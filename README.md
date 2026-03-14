# isofmap extractor

CLI инструмент за извличане на данни за имот по адрес от `http://www.isofmap.bg/`.

## Избран подход (работещ practically)
Използван е **mixed browser + backend extractor**:
1. Отваря се страницата с Playwright, за да се мине anti-bot защита (директни HTTP заявки връщат `403 Forbidden`).
2. Взима се `token` от `#fastSearchForm`.
3. Извиква се `POST /search` (XHR), за да се получат резултатите за адрес.
4. Избира се най-подходящият резултат (`searchAddressAddress` с приоритет).
5. Изпраща се WFS `GetFeature` към `/owsmap` с филтър по `adm_id`.
6. Връща се структуриран JSON.
7. По възможност се търсят и съседи чрез BBOX около геометрията.

## Релевантни endpoint-и (реално наблюдавани)
- `POST /search` – връща HTML с резултати от адресно търсене.
- `POST /owsmap` – WFS заявка (`GetFeature`, `outputFormat=application/json`).
- JS конфигурация:
  - `/js/mapUrl.js` -> `mapUrl() = /owsmap`
  - `/js/events/search.js` -> submit към `/search`
  - `/js/selectFeature.js` -> WFS филтър по `adm_id`

## Инсталация
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
playwright install chromium
```

## Стартиране
```bash
python main.py --address 'гр. София, район Лозенец, ж.к. "Лозенец", ул. "Милин камък" №50-54'
```

С файл:
```bash
python main.py --address 'София, ул. Милин камък 50-54' --output sample_output/milin_kamak.json
```

## JSON схема
Резултатът е в следния формат:
- `input_address`, `normalized_address`, `match_status`, `confidence`
- `target_property` (основни атрибути + `attributes_raw`)
- `neighboring_properties`
- `uncertainties`, `errors`
- `debug` (`final_url`, `network_calls_used`, `notes`)

## Ограничения
- При много нееднозначни резултати в `/search` първият кандидат по приоритет може да изисква ръчен review.
- Съседите се взимат с BBOX приближение (не е топологично `touches`).
- Ако източникът няма поле, се връща `null`/`[]` (без измисляне).
