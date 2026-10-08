---
title: What if my prod environment isn't named prod?
description: "Learn how to specify a custom defer-to environment for dbt State."
sidebar_label: "What if my prod environment isn't named prod?"
id: non-prod-environment
---

You can specify the defer-to environment using the [`defer_to_target`](/reference/resource-configs/defer-to-target) config in `profiles.yml`:

```yaml
my_project:
  outputs:
    prod:
      type: snowflake
      defer_to_target: production
```

`defer_to_target` only applies to self-managed deployments. If you're using the dbt platform, deferral is configured through your environment settings in the UI. For more details, refer to [Configuring deferral](/docs/deploy/dbt-state-deferral).
