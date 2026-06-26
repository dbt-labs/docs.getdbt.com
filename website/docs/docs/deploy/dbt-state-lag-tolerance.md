---
title: "Configuring lag tolerance in dbt State"
sidebar_label: "Configure lag tolerance"
description: "Configure lag tolerance to control how stale upstream data can be before dbt State rebuilds a model."
id: "dbt-state-lag-tolerance"
tags: ['dbt State']
---

# Configuring lag tolerance in dbt State <Lifecycle status="preview" />

Lag tolerance allows you to set a tolerance level for older data at the project, environment, or model level. We recommend starting with the following Jinja expression, which tolerates older data locally and requires fresher data in production. As you get a better feel for where adjustments make sense, you can tune individual models.

<File name="dbt_project.yml">

```yaml
models:
  +state:
    lag_tolerance: "{{ '4h' if target.name == 'prod' else '7d' }}"
```

</File>

In this example, models in the `prod` target rebuild only when upstream data is more than 4 hours old. In all other environments, models wait 7 days before rebuilding.

For more details, refer to the [`lag_tolerance` config reference](/reference/resource-configs/lag-tolerance).

## Related docs

- [About dbt State](/docs/deploy/dbt-state-about)
- [Set up dbt State](/docs/deploy/dbt-state-setup)
- [dbt State configs](/reference/resource-configs/dbt-state-configs)
