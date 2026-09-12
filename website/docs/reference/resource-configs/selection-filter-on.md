---
title: selection_filter_on
id: "selection-filter-on"
description: "Configure which output column selector methods use to filter check result rows."
resource_types: [checks]
datatype: string | [string] | none
availability:
  engine: v2
---

When you pass a selector (`--select`, `--exclude`, `--selector`) to `dbt check` or `dbt build`, dbt uses it to scope which project resources each check evaluates. `selection_filter_on` tells dbt which column in the check's output contains the resource IDs to match against the selection.

By default, dbt scopes check results to selected resources by matching the `unique_id` column in the output. If the check returns no `unique_id` column, it runs against the whole project. Use `selection_filter_on` to change this default. For example, to specify `[parent_unique_id, child_unique_id]` for an edge check, or `none` to always run the check against the whole project.

## Values

import SelectionFilterOnValues from '/snippets/_selection-filter-on-values.md';

<SelectionFilterOnValues />

## When to set this config

For most checks that return a single `unique_id` column, the default behavior is correct and no configuration is needed.

Use `selection_filter_on` when your check returns edge rows (parent/child pairs). Set it to the columns that contain resource IDs (for example, `[parent_unique_id, child_unique_id]`) so selectors can scope rows by either column.

For example, the following check returns edge rows and has no `unique_id` column, so you must set `selection_filter_on` to tell dbt which columns contain resource IDs to filter on:

<File name='checks/no_direct_raw_dependency.sql'>

```sql
select parent_unique_id, child_unique_id
from {{ info_schema('edges') }}
where child_unique_id like 'model.%'
  and parent_unique_id like '%raw_%'
  and child_unique_id not like '%stg_%'
```
</File>

Configure `selection_filter_on` for this check using one of the following methods:

<Tabs
  groupId="config-languages"
  defaultValue="property-yaml"
  values={[
    { label: 'Project YAML file', value: 'project-yaml', },
    { label: 'Properties YAML file', value: 'property-yaml', },
    { label: 'SQL file config', value: 'config', },
  ]
}>

<TabItem value="project-yaml">

<File name='dbt_project.yml'>

```yaml
checks:
  +selection_filter_on: [parent_unique_id, child_unique_id]
```

</File>

</TabItem>

<TabItem value="property-yaml">

<File name='checks/_checks.yml'>

```yaml
version: 2
checks:
  - name: no_direct_raw_dependency
    description: "Fails if a non-staging model refs a raw_ model directly."
    config:
      selection_filter_on: [parent_unique_id, child_unique_id]
```

</File>

</TabItem>

<TabItem value="config">

<File name='checks/no_direct_raw_dependency.sql'>

```sql
{{ config(
    selection_filter_on = ["parent_unique_id", "child_unique_id"]
) }}
```

</File>

</TabItem>

</Tabs>

## Related docs

- [Checks](/docs/build/checks)
- [Check configurations](/reference/check-configs)
- [Using selectors with checks](/docs/build/checks#using-selectors-with-checks)
