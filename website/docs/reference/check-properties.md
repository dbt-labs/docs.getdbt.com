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


## Example

<File name='checks/_checks.yml'>

```yaml
version: 2

checks:
  - name: all_models_have_descriptions
    description: "Fails if any model is missing a description."
    config:
      severity: error
      tags: ["governance"]
      meta:
        owner: "data-platform-team"

  - name: public_models_have_owners
    description: "Fails if any public model is missing an owner."
    config:
      severity: error
```

</File>
