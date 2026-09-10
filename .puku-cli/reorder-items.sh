#!/bin/bash
# Reorder project items so the most strategic ones appear first.
# Priority order (manual):
# 1. AI / FDE epic + items (#7, #8, #9, #28, #39, #50, #49)
# 2. P0 / P1 items currently in Todo
# 3. Foundation v1.0 items
# 4. Everything else

# Get all items with their issue numbers and current Status
gh api graphql -f query='
{
  node(id: "PVT_kwHOAYGZZc4BhuAE") {
    ... on ProjectV2 {
      items(first: 100) {
        nodes {
          id
          content {
            ... on Issue {
              number
              title
              labels(first: 20) { nodes { name } }
            }
          }
        }
      }
    }
  }
}' --jq '.data.node.items.nodes[] | select(.content.number != null) | "\(.id)|\(.content.number)|\(.content.title)|\(.content.labels.nodes | map(.name) | join(","))"' > /tmp/items_with_labels.txt

echo "Loaded $(wc -l < /tmp/items_with_labels.txt) items with labels"

# Build a sorted order using a Python script for clarity
python3 << 'PYEOF'
import subprocess, json

# Read the items file
with open('/tmp/items_with_labels.txt') as f:
    items = []
    for line in f:
        parts = line.strip().split('|', 3)
        if len(parts) >= 4:
            item_id, number, title, labels_str = parts[0], parts[1], parts[2], parts[3]
            labels = labels_str.split(',') if labels_str else []
            items.append({
                'id': item_id,
                'number': int(number),
                'title': title,
                'labels': labels,
            })

# Priority scoring
def score(item):
    labels = set(item['labels'])
    s = 0

    # P0 is highest
    if 'priority: p0' in labels:
        s += 10000
    elif 'priority: p1' in labels:
        s += 5000
    elif 'priority: p2' in labels:
        s += 1000
    elif 'priority: p3' in labels:
        s += 100

    # FDE / AI is the strategic focus
    if 'track: fde-readiness' in labels:
        s += 8000
    if 'track: ai-agent' in labels:
        s += 7000
    if 'epic: ai-portfolio-section' in labels:
        s += 6000

    # Epics are prominent
    if 'epic: fde-launch' in labels:
        s += 4000
    if 'epic: portfolio-revamp' in labels:
        s += 3000

    # Showcase / highlights
    if 'highlight: ai-native' in labels or 'highlight: agentic' in labels:
        s += 2000
    if 'showcase' in labels or 'demo' in labels:
        s += 1500

    # Interview prep
    if 'interview: fde' in labels:
        s += 1200

    # Lower-numbered issues = foundational
    s += max(0, 100 - item['number']) // 4

    return s

items.sort(key=score, reverse=True)

# Output in order
print("Top 15 items by priority score:")
for item in items[:15]:
    print(f"  #{item['number']:3d} score={score(item):5d}  {item['title'][:60]}")

# Save ordering
with open('/tmp/ordered_items.txt', 'w') as f:
    for item in items:
        f.write(f"{item['id']}\n")

print(f"\nTotal: {len(items)} items, ordered")
PYEOF
