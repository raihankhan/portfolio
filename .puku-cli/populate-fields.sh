#!/bin/bash
# Populate Priority, Effort, and Track fields on all project items based on their issue labels

# Field IDs
PRIORITY_FIELD="PVTSSF_lAHOAYGZZc4BhuAEzhgo0Y8"
EFFORT_FIELD="PVTSSF_lAHOAYGZZc4BhuAEzhgo0bo"
TRACK_FIELD="PVTSSF_lAHOAYGZZc4BhuAEzhgo0e0"

# Priority option IDs
P0_ID="f7509ba7"   # P0 - Critical (need to look up)
P1_ID=""
P2_ID=""
P3_ID=""

# Re-fetch option IDs
PRIORITY_OPTS=$(gh api graphql -f query='
{
  node(id: "'"$PRIORITY_FIELD"'") {
    ... on ProjectV2SingleSelectField {
      options { id name }
    }
  }
}' --jq '.data.node.options[] | "\(.id) \(.name)"')

echo "Priority options:"
echo "$PRIORITY_OPTS"
echo ""

# Set field values
set_field() {
  local item_id="$1"
  local field_id="$2"
  local option_id="$3"
  gh api graphql -f query='
  mutation {
    updateProjectV2ItemFieldValue(
      input: {
        projectId: "PVT_kwHOAYGZZc4BhuAE"
        itemId: "'"$item_id"'"
        fieldId: "'"$field_id"'"
        value: { singleSelectOptionId: "'"$option_id"'" }
      }
    ) {
      projectV2Item { id }
    }
  }' >/dev/null 2>&1
}

# Build a map of option_id by name
declare -A PRI
declare -A EFF
declare -A TRK

while IFS= read -r line; do
  id=$(echo "$line" | awk '{print $1}')
  name=$(echo "$line" | sed 's/^[a-f0-9]* //')
  if [[ "$id" == "" ]]; then continue; fi
done <<< "$PRIORITY_OPTS"

# Get all options for all three fields
gh api graphql -f query='
{
  priority: node(id: "'"$PRIORITY_FIELD"'") {
    ... on ProjectV2SingleSelectField { options { id name } }
  }
  effort: node(id: "'"$EFFORT_FIELD"'") {
    ... on ProjectV2SingleSelectField { options { id name } }
  }
  track: node(id: "'"$TRACK_FIELD"'") {
    ... on ProjectV2SingleSelectField { options { id name } }
  }
}' --jq '
  .data.priority.options[] | "P|\(.id)|\(.name)",
  .data.effort.options[] | "E|\(.id)|\(.name)",
  .data.track.options[] | "T|\(.id)|\(.name)"
' > /tmp/options.txt

while IFS='|' read -r prefix id name; do
  [ -z "$id" ] && continue
  case "$prefix" in
    P) PRI["$name"]="$id" ;;
    E) EFF["$name"]="$id" ;;
    T) TRK["$name"]="$id" ;;
  esac
done < /tmp/options.txt

echo "Priority options mapped:"
for k in "${!PRI[@]}"; do echo "  $k -> ${PRI[$k]}"; done

# Map from labels to option names
get_priority() {
  local labels="$1"
  if echo "$labels" | grep -q "priority: p0"; then echo "P0 - Critical"
  elif echo "$labels" | grep -q "priority: p1"; then echo "P1 - High"
  elif echo "$labels" | grep -q "priority: p2"; then echo "P2 - Medium"
  elif echo "$labels" | grep -q "priority: p3"; then echo "P3 - Low"
  else echo ""
  fi
}

get_effort() {
  local labels="$1"
  if echo "$labels" | grep -q "effort: xs"; then echo "XS (< 1h)"
  elif echo "$labels" | grep -q "effort: s "; then echo "S (1-3h)"
  elif echo "$labels" | grep -q "effort: m "; then echo "M (3-8h)"
  elif echo "$labels" | grep -q "effort: l "; then echo "L (1-3d)"
  elif echo "$labels" | grep -q "effort: xl"; then echo "XL (> 3d)"
  else echo ""
  fi
}

get_track() {
  local labels="$1"
  if echo "$labels" | grep -q "track: fde-readiness"; then echo "FDE-Readiness"
  elif echo "$labels" | grep -q "track: ai-agent"; then echo "AI Agent"
  elif echo "$labels" | grep -q "track: portfolio"; then echo "Portfolio"
  elif echo "$labels" | grep -q "track: platform"; then echo "Platform"
  elif echo "$labels" | grep -q "track: knowledge-sharing"; then echo "Knowledge Sharing"
  else echo ""
  fi
}

# Read items with labels and update fields
count=0
while IFS='|' read -r item_id number title labels; do
  [ -z "$item_id" ] && continue

  p=$(get_priority "$labels")
  e=$(get_effort "$labels")
  t=$(get_track "$labels")

  if [ -n "$p" ] && [ -n "${PRI[$p]}" ]; then
    set_field "$item_id" "$PRIORITY_FIELD" "${PRI[$p]}"
  fi

  if [ -n "$e" ] && [ -n "${EFF[$e]}" ]; then
    set_field "$item_id" "$EFFORT_FIELD" "${EFF[$e]}"
  fi

  if [ -n "$t" ] && [ -n "${TRK[$t]}" ]; then
    set_field "$item_id" "$TRACK_FIELD" "${TRK[$t]}"
  fi

  count=$((count+1))
done < /tmp/items_with_labels.txt

echo "Updated fields on $count items"
