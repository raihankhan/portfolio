#!/bin/bash
# Get all project items with issue numbers for processing
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
            }
          }
        }
      }
    }
  }
}' --jq '.data.node.items.nodes[] | select(.content.number != null) | "\(.id) #\(.content.number) \(.content.title)"' > /tmp/items.txt
wc -l /tmp/items.txt
