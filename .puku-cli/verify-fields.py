#!/usr/bin/env python3
"""Verify fields are populated on items."""
import json
import subprocess

q = '''
{
  node(id: "PVT_kwHOAYGZZc4BhuAE") {
    ... on ProjectV2 {
      items(first: 10) {
        nodes {
          content { ... on Issue { number title } }
          track: fieldValueByName(name: "Track") {
            ... on ProjectV2ItemFieldSingleSelectValue { name }
          }
          priority: fieldValueByName(name: "Priority") {
            ... on ProjectV2ItemFieldSingleSelectValue { name }
          }
          effort: fieldValueByName(name: "Effort") {
            ... on ProjectV2ItemFieldSingleSelectValue { name }
          }
          status: fieldValueByName(name: "Status") {
            ... on ProjectV2ItemFieldSingleSelectValue { name }
          }
        }
      }
    }
  }
}
'''
result = subprocess.run(
    ["gh", "api", "graphql", "-f", f"query={q}"],
    capture_output=True, text=True
)
data = json.loads(result.stdout)
items = data["data"]["node"]["items"]["nodes"]

print("Verification of first 10 items:")
print(f"{'#':>3} | {'Status':<12} | {'Priority':<11} | {'Effort':<10} | {'Track':<18} | Title")
print("-" * 100)
for item in items:
    n = item["content"]["number"]
    title = item["content"]["title"][:50]
    status = item["status"]["name"] if item["status"] else "?"
    priority = item["priority"]["name"] if item["priority"] else "?"
    effort = item["effort"]["name"] if item["effort"] else "?"
    track = item["track"]["name"] if item["track"] else "?"
    print(f"{n:>3} | {status:<12} | {priority:<11} | {effort:<10} | {track:<18} | {title}")
