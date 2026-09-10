#!/usr/bin/env python3
"""Fix missing Effort on items that have no effort label."""
import json
import subprocess

EFFORT_FIELD = "PVTSSF_lAHOAYGZZc4BhuAEzhgo0bo"
PROJECT_ID = "PVT_kwHOAYGZZc4BhuAE"

# Set Effort = "XL (> 3d)" for items missing Effort (treat as big initiative)
XL_OPTION_ID = "002fdec8"

q = '''
{
  node(id: "PVT_kwHOAYGZZc4BhuAE") {
    ... on ProjectV2 {
      items(first: 100) {
        nodes {
          content { ... on Issue { number title } }
          effort: fieldValueByName(name: "Effort") {
            ... on ProjectV2ItemFieldSingleSelectValue { name }
          }
        }
      }
    }
  }
}
'''
result = subprocess.run(["gh", "api", "graphql", "-f", f"query={q}"], capture_output=True, text=True)
data = json.loads(result.stdout)
items = data["data"]["node"]["items"]["nodes"]

# Set XL on items with no effort
fixed = 0
for item in items:
    if item["effort"] is None:
        n = item["content"]["number"]
        item_id = item["id"] if "id" in item else None
        # We need the item id - fetch differently
        fixed += 1
        print(f"Item #{n} missing effort")

# Actually let's just set XL on epic items specifically via the items file
# For now, let's just count
print(f"\nTotal missing effort: {fixed}")

# Get item ids for those missing effort
items_missing_effort = []
with open("/tmp/items_with_labels.txt") as f:
    for line in f:
        parts = line.strip().split("|", 3)
        if len(parts) >= 4:
            item_id, number, title, labels = parts[0], parts[1], parts[2], parts[3]
            if "effort:" not in labels:
                items_missing_effort.append((item_id, int(number), title))

print(f"\nItems without effort label: {len(items_missing_effort)}")
for item_id, number, title in items_missing_effort:
    # Set to XL for epics, M for everything else
    if title.startswith("[Epic]"):
        effort_id = XL_OPTION_ID
    else:
        # M (3-8h) for smaller items
        effort_id = "77d11203"
    set_q = f'''
    mutation {{
      updateProjectV2ItemFieldValue(
        input: {{
          projectId: "{PROJECT_ID}"
          itemId: "{item_id}"
          fieldId: "{EFFORT_FIELD}"
          value: {{ singleSelectOptionId: "{effort_id}" }}
        }}
      ) {{ projectV2Item {{ id }} }}
    }}
    '''
    subprocess.run(["gh", "api", "graphql", "-f", f"query={set_q}"], capture_output=True)
    print(f"  Set effort on #{number}: {title[:60]}")
