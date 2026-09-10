#!/bin/bash
# Bulk-add all issues to the project board using GraphQL
set -e

PROJECT_ID="PVT_kwHOAYGZZc4BhuAE"

count=0
while IFS= read -r node_id; do
  gh api graphql -f query='
  mutation($project: ID!, $content: ID!) {
    addProjectV2ItemById(input: {projectId: $project, contentId: $content}) {
      item { id }
    }
  }' -f project="$PROJECT_ID" -f content="$node_id" >/dev/null 2>&1
  count=$((count+1))
done < /tmp/issue_node_ids.txt

echo "Added $count issues to project"
