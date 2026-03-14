from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field


class TargetProperty(BaseModel):
    display_address: str | None = None
    property_identifier: str | None = None
    system_id: str | None = None
    area_sq_m: float | None = None
    territory_type: str | None = None
    permanent_use: str | None = None
    district: str | None = None
    quarter: str | None = None
    upi: str | None = None
    previous_plan_number: str | None = None
    administrative_area: str | None = None
    zone: str | None = None
    coordinates: list[float] | None = None
    geometry: dict[str, Any] | None = None
    attributes_raw: dict[str, Any] = Field(default_factory=dict)


class NeighborProperty(BaseModel):
    property_identifier: str | None = None
    area_sq_m: float | None = None
    permanent_use: str | None = None
    relation: str | None = None
    attributes_raw: dict[str, Any] = Field(default_factory=dict)


class DebugData(BaseModel):
    final_url: str | None = None
    network_calls_used: list[str] = Field(default_factory=list)
    notes: list[str] = Field(default_factory=list)


class ExtractionResult(BaseModel):
    input_address: str
    normalized_address: str
    match_status: Literal["exact", "partial", "not_found", "ambiguous"]
    source_site: str = "isofmap.bg"
    source_method: Literal["api", "xhr", "dom", "browser", "mixed"] = "mixed"
    confidence: Literal["high", "medium", "low", "review_required"] = "medium"
    target_property: TargetProperty
    neighboring_properties: list[NeighborProperty] = Field(default_factory=list)
    uncertainties: list[str] = Field(default_factory=list)
    errors: list[str] = Field(default_factory=list)
    debug: DebugData = Field(default_factory=DebugData)
