#!/usr/bin/env python3
import argparse
import csv
import json
import zipfile


KEY_HINT_COLUMNS = {"key", "name", "attr", "attribute", "property"}


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--export-zip", required=True)
    parser.add_argument(
        "--expect",
        default=".github/skills/empirica-data-schema-validation/expected-schema.example.json",
    )
    return parser.parse_args()


def collect_keys_from_zip(zip_path):
    observed = set()
    by_file = {}
    with zipfile.ZipFile(zip_path, "r") as zf:
        for member in zf.namelist():
            if not member.endswith(".csv"):
                continue
            file_name = member.split("/")[-1]
            file_keys = by_file.setdefault(file_name, set())
            with zf.open(member, "r") as fh:
                text = (line.decode("utf-8", errors="replace") for line in fh)
                reader = csv.DictReader(text)
                if reader.fieldnames:
                    for header in reader.fieldnames:
                        observed.add(header)
                        file_keys.add(header)
                hint_cols = [
                    c
                    for c in (reader.fieldnames or [])
                    if c and c.strip().lower() in KEY_HINT_COLUMNS
                ]
                for row in reader:
                    for value in row.values():
                        if not value:
                            continue
                        text = value.strip()
                        if not text:
                            continue
                        if (text.startswith("{") and text.endswith("}")) or (
                            text.startswith("[") and text.endswith("]")
                        ):
                            try:
                                parsed = json.loads(text)
                                collect_json_keys(parsed, observed, file_keys)
                            except Exception:
                                pass
                    for col in hint_cols:
                        value = (row.get(col) or "").strip()
                        if value:
                            observed.add(value)
                            file_keys.add(value)
    return observed, by_file


def collect_json_keys(value, observed, file_keys):
    if isinstance(value, dict):
        for k, v in value.items():
            observed.add(k)
            file_keys.add(k)
            collect_json_keys(v, observed, file_keys)
    elif isinstance(value, list):
        for item in value:
            collect_json_keys(item, observed, file_keys)


def main():
    args = parse_args()
    with open(args.expect, "r", encoding="utf-8") as f:
        expected = json.load(f)
    observed, by_file = collect_keys_from_zip(args.export_zip)

    missing = []
    wrong_file = []
    for item in expected.get("required", []):
        key = item.get("key")
        if not key:
            continue
        if key not in observed:
            missing.append(key)
            continue
        target_files = item.get("export_files") or []
        if target_files:
            if not any(key in by_file.get(f, set()) for f in target_files):
                wrong_file.append(f"{key} (expected in {', '.join(target_files)})")

    print("Export files detected:", ", ".join(sorted(by_file.keys())))
    print("Observed export keys:", ", ".join(sorted(observed)))
    if missing:
        print("Missing required export keys:", ", ".join(missing))
        raise SystemExit(1)
    if wrong_file:
        print("Required keys found in unexpected file(s):", ", ".join(wrong_file))
        raise SystemExit(1)
    print("All required keys were found in export data.")


if __name__ == "__main__":
    main()
