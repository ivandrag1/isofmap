from __future__ import annotations

import asyncio
import json
from typing import Any
from urllib.parse import urlencode

from bs4 import BeautifulSoup
from playwright.async_api import async_playwright

from extractor.schema import DebugData, ExtractionResult, NeighborProperty, TargetProperty
from utils.address import normalize_address


FEATURE_MAP = {
    "searchAddressAddress": "addr_address",
    "searchAddressStreet": "addr_street",
    "searchAddressQuarter": "addr_lareaunit",
    "searchCadImmovable": "cad_immovable",
    "searchRegImmovable": "reg_immovable",
    "searchRegParcel": "reg_parcel",
}

PRIORITY_SUBTYPES = [
    "searchAddressAddress",
    "searchCadImmovable",
    "searchRegParcel",
    "searchAddressStreet",
    "searchAddressQuarter",
]


class IsofmapExtractor:
    async def extract(self, input_address: str) -> ExtractionResult:
        normalized = normalize_address(input_address)
        result = ExtractionResult(
            input_address=input_address,
            normalized_address=normalized,
            match_status="not_found",
            target_property=TargetProperty(),
            debug=DebugData(),
        )

        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context()
            page = await context.new_page()

            network_calls: set[str] = set()
            page.on("request", lambda req: network_calls.add(req.url))

            await page.goto("http://www.isofmap.bg/", wait_until="domcontentloaded", timeout=90_000)
            result.debug.final_url = page.url

            token = await page.eval_on_selector('input[name="token"]', "el => el.value")
            if not token:
                result.errors.append("Не е намерен CSRF token във формата за търсене.")
                result.debug.network_calls_used = sorted(network_calls)
                await browser.close()
                return result

            search_html = await self._search(page, token, normalized)
            candidate = self._pick_candidate(search_html)
            if not candidate:
                result.match_status = "not_found"
                result.uncertainties.append("Няма резултат в /search за този адрес.")
                result.debug.network_calls_used = sorted(network_calls)
                await browser.close()
                return result

            result.match_status = "exact" if candidate["subtype"] == "searchAddressAddress" else "partial"
            feature_type = candidate["feature"]
            adm_id = candidate["adm_id"]

            feature_geojson = await self._wfs_by_adm(page, feature_type, adm_id)
            if feature_geojson and feature_geojson.get("features"):
                main_feature = feature_geojson["features"][0]
                props = main_feature.get("properties", {})
                geometry = main_feature.get("geometry")
                result.target_property = self._to_target_property(props, geometry)

                neighbors = await self._neighbors_by_bbox(page, feature_type, geometry, adm_id)
                result.neighboring_properties = [self._to_neighbor(n) for n in neighbors]
            else:
                result.errors.append("WFS заявката за избрания обект не върна резултат.")

            result.debug.network_calls_used = sorted(network_calls)
            result.debug.notes.extend(
                [
                    f"selected_search_subtype={candidate['subtype']}",
                    f"selected_feature_type={feature_type}",
                    f"selected_adm_id={adm_id}",
                ]
            )
            await browser.close()

        return result

    async def _search(self, page, token: str, address: str) -> str:
        body = urlencode({"token": token, "searchType": "searchFast", "searchFast": address})
        return await page.evaluate(
            """async (payload) => {
                const r = await fetch('/search', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                    body: payload,
                });
                return await r.text();
            }""",
            body,
        )

    def _pick_candidate(self, search_html: str) -> dict[str, str] | None:
        soup = BeautifulSoup(search_html, "html.parser")
        tables = soup.select("table[data-searchsubtype]")
        available = {t.get("data-searchsubtype"): t for t in tables}

        for subtype in PRIORITY_SUBTYPES:
            table = available.get(subtype)
            if not table:
                continue
            img = table.select_one("img[data-adm_id]")
            if not img:
                continue
            feature = FEATURE_MAP.get(subtype)
            if not feature:
                continue
            return {"subtype": subtype, "feature": feature, "adm_id": img.get("data-adm_id", "")}

        for table in tables:
            subtype = table.get("data-searchsubtype")
            img = table.select_one("img[data-adm_id]")
            if img and subtype in FEATURE_MAP:
                return {"subtype": subtype, "feature": FEATURE_MAP[subtype], "adm_id": img.get("data-adm_id", "")}

        return None

    async def _wfs_by_adm(self, page, feature_type: str, adm_id: str) -> dict[str, Any] | None:
        xml = f"""<wfs:GetFeature service='WFS' version='1.1.0'
            xmlns:wfs='http://www.opengis.net/wfs'
            xmlns:ogc='http://www.opengis.net/ogc'
            xmlns:gml='http://www.opengis.net/gml'
            xmlns:ms='http://mapserver.gis.umn.edu/mapserver'
            outputFormat='application/json'>
            <wfs:Query typeName='ms:{feature_type}' srsName='EPSG:7801'>
                <ogc:Filter>
                    <ogc:PropertyIsEqualTo>
                        <ogc:PropertyName>adm_id</ogc:PropertyName>
                        <ogc:Literal>{adm_id}</ogc:Literal>
                    </ogc:PropertyIsEqualTo>
                </ogc:Filter>
            </wfs:Query>
        </wfs:GetFeature>"""

        text = await page.evaluate(
            """async (xml) => {
                const r = await fetch('/owsmap', {method: 'POST', body: xml});
                return await r.text();
            }""",
            xml,
        )

        try:
            return json.loads(text)
        except json.JSONDecodeError:
            return None

    async def _neighbors_by_bbox(self, page, feature_type: str, geometry: dict[str, Any] | None, self_adm_id: str) -> list[dict[str, Any]]:
        if not geometry:
            return []

        bbox = self._bbox_from_geometry(geometry)
        if not bbox:
            return []

        minx, miny, maxx, maxy = bbox
        pad = 0.5
        minx -= pad
        miny -= pad
        maxx += pad
        maxy += pad

        xml = f"""<wfs:GetFeature service='WFS' version='1.1.0'
            xmlns:wfs='http://www.opengis.net/wfs'
            xmlns:ogc='http://www.opengis.net/ogc'
            xmlns:gml='http://www.opengis.net/gml'
            xmlns:ms='http://mapserver.gis.umn.edu/mapserver'
            outputFormat='application/json'>
            <wfs:Query typeName='ms:{feature_type}' srsName='EPSG:7801'>
                <ogc:Filter>
                    <ogc:BBOX>
                        <ogc:PropertyName>msGeometry</ogc:PropertyName>
                        <gml:Envelope srsName='EPSG:7801'>
                            <gml:lowerCorner>{minx} {miny}</gml:lowerCorner>
                            <gml:upperCorner>{maxx} {maxy}</gml:upperCorner>
                        </gml:Envelope>
                    </ogc:BBOX>
                </ogc:Filter>
            </wfs:Query>
        </wfs:GetFeature>"""

        text = await page.evaluate(
            """async (xml) => {
                const r = await fetch('/owsmap', {method: 'POST', body: xml});
                return await r.text();
            }""",
            xml,
        )

        try:
            data = json.loads(text)
        except json.JSONDecodeError:
            return []

        feats = data.get("features", [])
        return [f for f in feats if str(f.get("properties", {}).get("adm_id", "")) != str(self_adm_id)]

    def _bbox_from_geometry(self, geometry: dict[str, Any]) -> tuple[float, float, float, float] | None:
        coords = geometry.get("coordinates")
        if not coords:
            return None

        flat = []

        def _walk(values):
            if isinstance(values, (list, tuple)) and values and isinstance(values[0], (int, float)):
                if len(values) >= 2:
                    flat.append((float(values[0]), float(values[1])))
                return
            if isinstance(values, (list, tuple)):
                for item in values:
                    _walk(item)

        _walk(coords)
        if not flat:
            return None
        xs = [p[0] for p in flat]
        ys = [p[1] for p in flat]
        return min(xs), min(ys), max(xs), max(ys)

    def _to_target_property(self, props: dict[str, Any], geometry: dict[str, Any] | None) -> TargetProperty:
        return TargetProperty(
            display_address=props.get("address") or props.get("full_address") or props.get("street"),
            property_identifier=props.get("cadnumber") or props.get("parcel") or props.get("upi"),
            system_id=str(props.get("adm_id")) if props.get("adm_id") is not None else None,
            area_sq_m=self._to_float(props.get("area")),
            territory_type=props.get("territory") or props.get("territory_type"),
            permanent_use=props.get("landuse") or props.get("permanent_use") or props.get("ntp"),
            district=props.get("district") or props.get("settlement"),
            quarter=props.get("quarter") or props.get("regquarter"),
            upi=props.get("upi"),
            previous_plan_number=props.get("oldplan") or props.get("prevplan"),
            administrative_area=props.get("region") or props.get("raion"),
            zone=props.get("zone") or props.get("zoning"),
            coordinates=self._first_coordinate(geometry),
            geometry=geometry,
            attributes_raw=props,
        )

    def _to_neighbor(self, feature: dict[str, Any]) -> NeighborProperty:
        props = feature.get("properties", {})
        return NeighborProperty(
            property_identifier=props.get("cadnumber") or props.get("parcel") or props.get("upi"),
            area_sq_m=self._to_float(props.get("area")),
            permanent_use=props.get("landuse") or props.get("ntp"),
            relation="bbox_intersection",
            attributes_raw=props,
        )

    def _first_coordinate(self, geometry: dict[str, Any] | None) -> list[float] | None:
        if not geometry:
            return None
        bbox = self._bbox_from_geometry(geometry)
        if not bbox:
            return None
        minx, miny, maxx, maxy = bbox
        return [round((minx + maxx) / 2, 3), round((miny + maxy) / 2, 3)]

    def _to_float(self, value: Any) -> float | None:
        if value is None:
            return None
        try:
            return float(str(value).replace(",", "."))
        except ValueError:
            return None


def run_extraction(address: str) -> ExtractionResult:
    return asyncio.run(IsofmapExtractor().extract(address))
