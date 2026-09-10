#!/bin/bash
# Set status field on project items. Selected strategic items go "In Progress", rest stay "Todo"
# This demonstrates the Kanban view with realistic state

STATUS_FIELD_ID="PVTSSF_lAHOAYGZZc4BhuAEzhgouC4"  # Status field
IN_PROGRESS_ID="47fc9ee4"  # "In Progress" option ID
TODO_ID="f75ad846"         # "Todo" option ID
DONE_ID="98236657"         # "Done" option ID

# Strategic "In Progress" issues — items that map to v1.0 (the active milestone)
# These are the work that's effectively happening for the foundation phase
IN_PROGRESS_NUMBERS=(
  1   # Epic: Reposition Portfolio
  2   # Author 5 deep case studies
  3   # Add ADRs section
  33  # Write About Me deep page
  34  # Engineering Philosophy manifesto
  4   # CI/CD pipeline (in v1.1 but starts in foundation)
)

# Strategic "Done" issues — items already completed per plan.md
DONE_NUMBERS=(
  # Phase 1-6 items from plan.md that are already implemented
  # These were intentionally not added as issues because they're done
)

# Get all items with their numbers
declare -A ITEM_BY_NUMBER
while IFS= read -r line; do
  item_id=$(echo "$line" | awk '{print $1}')
  issue_num=$(echo "$line" | awk '{print $2}' | tr -d '#')
  if [ -n "$issue_num" ]; then
    ITEM_BY_NUMBER[$issue_num]=$item_id
  fi
done < /tmp/items.txt

echo "Found ${#ITEM_BY_NUMBER[@]} items"

# Set In Progress for selected items
count_ip=0
for num in "${IN_PROGRESS_NUMBERS[@]}"; do
  item_id=${ITEM_BY_NUMBER[$num]}
  if [ -n "$item_id" ]; then
    gh api graphql -f query='
    mutation {
      updateProjectV2ItemFieldValue(
        input: {
          projectId: "PVT_kwHOAYGZZc4BhuAE"
          itemId: "'"$item_id"'"
          fieldId: "'"$STATUS_FIELD_ID"'"
          value: { singleSelectOptionId: "'"$IN_PROGRESS_ID"'" }
        }
      ) {
        projectV2Item { id }
      }
    }' >/dev/null 2>&1
    count_ip=$((count_ip+1))
  fi
done

echo "Set $count_ip items to In Progress"
