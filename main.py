#!/usr/bin/env python3
import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from extractor.isofmap_extractor import run_extraction


def main() -> None:
    parser = argparse.ArgumentParser(description="Extract property data from isofmap.bg by address")
    parser.add_argument("--address", required=True, help="Input address in Bulgarian")
    parser.add_argument("--output", help="Optional output JSON file path")
    args = parser.parse_args()

    result = run_extraction(args.address)
    payload = result.model_dump()

    if args.output:
        output_path = Path(args.output)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")

    print(json.dumps(payload, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
