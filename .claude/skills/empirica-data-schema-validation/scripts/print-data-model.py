#!/usr/bin/env python3
import argparse
import json


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--expect",
        default=".github/skills/empirica-data-schema-validation/expected-schema.example.json",
    )
    return parser.parse_args()


SCOPE_GROUPS = [
    ("ROUND", {"round"}),
    ("STAGE / PLAYER-STAGE", {"stage", "stage_or_round"}),
    ("PLAYER", {"player", "player_and_round"}),
    ("GAME", {"game"}),
    ("TREATMENT", {"treatment"}),
]


def main():
    args = parse_args()
    with open(args.expect, "r", encoding="utf-8") as f:
        spec = json.load(f)

    entries = []
    required_keys = {e.get("key") for e in (spec.get("required") or [])}
    for e in spec.get("required") or []:
        entries.append((e, True))
    for e in spec.get("optional") or []:
        entries.append((e, False))

    def print_entry(e, is_required):
        key = e.get("key", "")
        unit = e.get("unit", "").strip() or "unspecified"
        desc = e.get("description", "").strip() or "no description provided"
        export_files = e.get("export_files", [])
        export_target = ", ".join(export_files) if export_files else "unspecified"
        req = "required" if is_required or key in required_keys else "optional"
        print(f"- `{key}` ({req})")
        print(f"  unit: {unit}")
        print(f"  desc: {desc}")
        print(f"  export: {export_target}")

    print("Proposed Data Model")
    printed = set()
    for title, scopes in SCOPE_GROUPS:
        scoped = [(e, req) for e, req in entries if e.get("scope") in scopes]
        if not scoped:
            continue
        print(f"\n{title}")
        for e, req in scoped:
            print_entry(e, req)
            printed.add(e.get("key"))

    remaining = [(e, req) for e, req in entries if e.get("key") not in printed]
    if remaining:
        print("\nOTHER")
        for e, req in remaining:
            print_entry(e, req)


if __name__ == "__main__":
    main()
