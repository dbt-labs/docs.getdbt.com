---
title: allow_clones
description: "Configure whether dbt State makes clone decisions when running against a target."
id: "allow-clones"
tags: ['dbt State']
---

# allow_clones

<File name="profiles.yml">

```yaml
my_project:
  outputs:
    prod:
      type: snowflake
      # ... other connection settings
      allow_clones: true | false
  target: dev
```

</File>


## Definition

`allow_clones` is a profile-level setting that controls whether dbt State is allowed to clone tables into a target environment. By default, dbt State can clone a table from any environment &mdash; including cloning a dev table into prod when the data and logic match. This behavior is intentional: if you built a model in dev and nothing changed, cloning it to prod saves compute compared to rebuilding.

Setting `allow_clones: false` on a target tells dbt State to skip clone candidates and run full builds instead, even if a matching table exists in another target.

This setting affects only the target it is set on. Other targets in the same profile are unaffected.

For <Constant name="dbt_platform" /> users, you can set `allow_clones` by adding it as an [extended attribute](/docs/dbt-platform-environments#extended-attributes) in your environment settings.

## Default

`true`. When omitted, cloning is enabled and dbt State clones from any environment where a matching table exists.

## When to disable

:::caution
Setting `allow_clones: false` reduces the efficiency gains from dbt State. Nodes that dbt State would otherwise clone instead run as full builds. Consider whether this restriction is necessary for your environment.
:::

You typically don't need to set `allow_clones: false`. dbt State only clones when the source table's SQL logic matches and the table's data is newer. Because this is based on the table's modification date (not by directly comparing table contents), manually editing a table outside of dbt can give it a newer modification date without actually matching what a full build would produce. It is safe to leave `allow_clones` enabled as long as you always change table contents through dbt, rather than editing tables manually

Disabling `allow_clones` is useful in regulated environments where policy prohibits any data from a development schema being written to production, regardless of correctness (for example, environments subject to data governance or audit requirements where the origin of a production table must be a warehouse-executed SQL statement rather than a clone).


## Related docs

- [About dbt State](/docs/deploy/dbt-state-about)
- [dbt State configs](/reference/resource-configs/dbt-state-configs)
