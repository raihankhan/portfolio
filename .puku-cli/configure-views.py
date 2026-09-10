#!/usr/bin/env python3
"""Configure view columns to show Priority, Effort, Track."""
import json
import subprocess

PRIORITY_FIELD = "PVTSSF_lAHOAYGZZc4BhuAEzhgo0Y8"
EFFORT_FIELD = "PVTSSF_lAHOAYGZZc4BhuAEzhgo0bo"
TRACK_FIELD = "PVTSSF_lAHOAYGZZc4BhuAEzhgo0e0"
STATUS_FIELD = "PVTSSF_lAHOAYGZZc4BhuAEzhgouC4"
MILESTONE_FIELD = "PVTF_lAHOAYGZZc4BhuAEzhgouDE"
LABELS_FIELD = "PVTF_lAHOAYGZZc4BhuAEzhgouC8"
ASSIGNEES_FIELD = "PVTF_lAHOAYGZZc4BhuAEzhgouC0"
TITLE_FIELD = "PVTF_lAHOAYGZZc4BhuAEzhgouCw"
UPDATED_FIELD = "PVTF_lAHOAYGZZc4BhuAEzhgouDg"

# Views to configure (from earlier output)
VIEWS = {
    "By Track (Grouped)": "PVTV_lAHOAYGZZc4BhuAEzgLdTgc",
    "Status Board (Kanban)": "PVTV_lAHOAYGZZc4BhuAEzgLdTgo",
    "Roadmap by Milestone": "PVTV_lAHOAYGZZc4BhuAEzgLdTgs",
    "AI / FDE Workstream": "PVTV_lAHOAYGZZc4BhuAEzgLdThE",
    "Quick Wins (< 3h)": "PVTV_lAHOAYGZZc4BhuAEzgLdThU",
    "Priority Board (P0 + P1)": "PVTV_lAHOAYGZZc4BhuAEzgLdThg",
    "All Epics": "PVTV_lAHOAYGZZc4BhuAEzgLdThk",
    "Showcase / Highlights": "PVTV_lAHOAYGZZc4BhuAEzgLdTho",
}

# Default columns for table views
DEFAULT_COLUMNS = [
    TITLE_FIELD,
    STATUS_FIELD,
    PRIORITY_FIELD,
    EFFORT_FIELD,
    TRACK_FIELD,
    ASSIGNEES_FIELD,
    MILESTONE_FIELD,
    LABELS_FIELD,
    UPDATED_FIELD,
]


def configure_view(view_id: str, field_ids: list):
    fields_csv = ",".join(f'"{f}"' for f in field_ids)
    q = f'''
    mutation {{
      updateProjectV2View(
        input: {{
          viewId: "{view_id}"
          configuration: {{ visibleFieldIds: [{fields_csv}] }}
        }}
      ) {{
        projectV2View {{ id name }}
      }}
    }}
    '''
    result = subprocess.run(
        ["gh", "api", "graphql", "-f", f"query={q}"],
        capture_output=True, text=True
    )
    try:
        data = json.loads(result.stdout)
        if "data" in data and data["data"].get("updateProjectV2View"):
            return True
        else:
            print(f"  Error: {result.stdout[:200]}")
            return False
    except json.JSONDecodeError:
        print(f"  Parse error: {result.stdout[:200]}")
        return False


for view_name, view_id in VIEWS.items():
    print(f"Configuring {view_name} ({view_id[:20]}...)")
    success = configure_view(view_id, DEFAULT_COLUMNS)
    print(f"  {'✓' if success else '✗'} {view_name}")
