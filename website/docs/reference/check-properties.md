---
title: Check properties
availability:
  engine: v2
---

You can declare check properties in `.yml` files in your `checks/` directory (as defined by the [`check-paths` config](/reference/project-configs/check-paths)).

## Available properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| [name](/reference/resource-configs/resource-path) | string | Yes | The check name. Must match the filename of the check SQL file (without the `.sql` extension). |
| [description](/reference/resource-properties/description) | string | No | Documentation for the check. |
| [config](/reference/check-configs) | object | No | Configuration for the check, including `severity`, `enabled`, `selection_filter_on`, `tags`, and `meta`. Refer to [Check configurations](/reference/check-configs). |

## Example

<File name='checks/_checks.yml'>

```yaml
version: 2

checks:
  - name: all_models_have_descriptions
    description: "Fails if any model is missing a description."
    config:
      severity: error
      enabled: true
      tags: ["governance"]
      meta:
        owner: "data-platform-team"

  - name: no_forbidden_source_access
    description: "Fails if any model reads from a forbidden source."
    config:
      severity: error
      selection_filter_on: [parent_unique_id, child_unique_id]
```

</File>
