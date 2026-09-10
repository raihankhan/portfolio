#!/usr/bin/env python3
"""Populate Priority, Effort, and Track fields on all project items based on labels."""

import json
import subprocess
import sys
import time

PRIORITY_FIELD = "PVTSSF_lAHOAYGZZc4BhuAEzhgo0Y8"
EFFORT_FIELD = "PVTSSF_lAHOAYGZZc4BhuAEzhgo0bo"
TRACK_FIELD = "PVTSSF_lAHOAYGZZc4BhuAEzhgo0e0"
PROJECT_ID = "PVT_kwHOAYGZZc4BhuAE"


def gh_graphql(query: str) -> dict:
    result = subprocess.run(
        ["gh", "api", "graphql", "-f", f"query={query}"],
        capture_output=True, text=True
    )
    if result.returncode != 0:
        print(f"GraphQL error: {result.stderr}", file=sys.stderr)
        return {}
    return json.loads(result.stdout)


def get_field_options(field_id: str) -> dict:
    q = f'''
    {{
      node(id: "{field_id}") {{
        ... on ProjectV2SingleSelectField {{
          options {{ id name }}
        }}
      }}
    }}
    '''
    data = gh_graphql(q)
    if not data or "data" not in data:
        return {}
    return {o["name"]: o["id"] for o in data["data"]["node"]["options"]}


def set_field(item_id: str, field_id: str, option_id: str):
    q = f'''
    mutation {{
      updateProjectV2ItemFieldValue(
        input: {{
          projectId: "{PROJECT_ID}"
          itemId: "{item_id}"
          fieldId: "{field_id}"
          value: {{ singleSelectOptionId: "{option_id}" }}
        }}
      ) {{
        projectV2Item {{ id }}
      }}
    }}
    '''
    gh_graphql(q)


def get_priority(labels: list) -> str:
    for l in labels:
        if l == "priority: p0":
            return "P0 - Critical"
        if l == "priority: p1":
            return "P1 - High"
        if l == "priority: p2":
            return "P2 - Medium"
        if l == "priority: p3":
            return "P3 - Low"
    return ""


def get_effort(labels: list) -> str:
    for l in labels:
        if l == "effort: xs (< 1h)":
            return "XS (< 1h)"
        if l == "effort: s (1-3h)":
            return "S (1-3h)"
        if l == "effort: m (3-8h)":
            return "M (3-8h)"
        if l == "effort: l (1-3d)":
            return "L (1-3d)"
        if l == "effort: xl (> 3d)":
            return "XL (> 3d)"
    return ""


def get_track(labels: list) -> str:
    for l in labels:
        if l == "track: fde-readiness":
            return "FDE-Readiness"
        if l == "track: ai-agent":
            return "AI Agent"
        if l == "track: portfolio":
            return "Portfolio"
        if l == "track: platform":
            return "Platform"
        if l == "track: knowledge-sharing":
            return "Knowledge Sharing"
    return ""


def main():
    print("Fetching field options...")
    pri = get_field_options(PRIORITY_FIELD)
    eff = get_field_options(EFFORT_FIELD)
    trk = get_field_options(TRACK_FIELD)
    print(f"Priority options: {pri}")
    print(f"Effort options: {eff}")
    print(f"Track options: {trk}")

    # Read items file
    items = []
    with open("/tmp/items_with_labels.txt") as f:
        for line in f:
            parts = line.strip().split("|", 3)
            if len(parts) >= 4:
                item_id, number, title, labels_str = parts
                labels = labels_str.split(",") if labels_str else []
                items.append({
                    "id": item_id,
                    "number": int(number),
                    "labels": labels,
                })

    print(f"\nUpdating {len(items)} items...")
    count_p = count_e = count_t = 0
    for item in items:
        p = get_priority(item["labels"])
        e = get_effort(item["labels"])
        t = get_track(item["labels"])

        if p and p in pri:
            set_field(item["id"], PRIORITY_FIELD, pri[p])
            count_p += 1
        if e and e in eff:
            set_field(item["id"], EFFORT_FIELD, eff[e])
            count_e += 1
        if t and t in trk:
            set_field(item["id"], TRACK_FIELD, trk[t])
            count_t += 1

    print(f"\nUpdated:")
    print(f"  Priority: {count_p} items")
    print(f"  Effort: {count_e} items")
    print(f"  Track: {count_t} items")


if __name__ == "__main__":
    main()
