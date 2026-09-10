#!/bin/bash
# Apply the priority ordering to the project board

PROJECT_ID="PVT_kwHOAYGZZc4BhuAE"
prev_id=""

count=0
while IFS= read -r item_id; do
  if [ -z "$item_id" ]; then continue; fi

  # Build the afterId parameter
  if [ -z "$prev_id" ]; then
    # First item — no afterId (becomes top)
    gh api graphql -f query='
    mutation {
      updateProjectV2ItemPosition(
        input: {
          projectId: "'"$PROJECT_ID"'"
          itemId: "'"$item_id"'"
        }
      ) {
        clientMutationId
      }
    }' >/dev/null 2>&1
  else
    gh api graphql -f query='
    mutation {
      updateProjectV2ItemPosition(
        input: {
          projectId: "'"$PROJECT_ID"'"
          itemId: "'"$item_id"'"
          afterId: "'"$prev_id"'"
        }
      ) {
        clientMutationId
      }
    }' >/dev/null 2>&1
  fi
  prev_id="$item_id"
  count=$((count+1))
done < /tmp/ordered_items.txt

echo "Reordered $count items"
