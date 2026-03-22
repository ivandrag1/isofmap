import re


def normalize_address(raw: str) -> str:
    text = raw.strip()
    replacements = {
        "№": "No",
        "no.": "No",
        "no ": "No ",
        "ул.": "улица",
        "ул ": "улица ",
        "р-н": "район",
        "ж.к.": "жк",
        "кв.": "квартал",
    }

    lowered = text.lower()
    for old, new in replacements.items():
        lowered = lowered.replace(old, new.lower())

    lowered = re.sub(r"\s+", " ", lowered)
    lowered = lowered.replace('"', "")
    lowered = lowered.replace("'", "")
    return lowered.strip(" ,")
