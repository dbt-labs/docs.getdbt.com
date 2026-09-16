---
title: selection_filter_on
id: "selection-filter-on"
description: "Configure which output columns dbt uses to match check result rows against a selector."
resource_types: [checks]
datatype: string | [string] | none
availability:
  engine: v2
---

When you pass a selector (`--select`, `--exclude`, `--selector`) to `dbt check` or `dbt build`, dbt uses it to scope which project resources each check evaluates. `selection_filter_on` tells dbt which column in the check's output contains the resource IDs to match against the selection.

By default, dbt scopes check results to selected resources by matching the `unique_id` column in the output. If the check returns no `unique_id` column, it runs against the whole project. Use `selection_filter_on` to change this default.

## Values

import SelectionFilterOnValues from '/snippets/_selection-filter-on-values.md';

<SelectionFilterOnValues />

## When to set this config

If your check returns a `unique_id` column, you don't need to set this config.

Use `selection_filter_on` when your check returns rows with ID columns other than `unique_id`. Set it to the columns that contain resource IDs so selectors can scope rows by those columns.

The following check queries the `edges` table and returns `child_unique_id` instead of `unique_id`, so you must set `selection_filter_on`:

<File name='checks/multiple_sources_joined.sql'>

```sql
select child_unique_id, count(*) as source_parents
from {{ info_schema('edges') }}
where parent_unique_id like 'source.%'
group by child_unique_id
having count(*) > 1
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
  +selection_filter_on: child_unique_id
```

</File>

</TabItem>

<TabItem value="property-yaml">

<File name='checks/_checks.yml'>

```yaml
version: 2
checks:
  - name: multiple_sources_joined
    description: "Fails if any model reads directly from more than one source."
    config:
      selection_filter_on: child_unique_id
```

</File>

</TabItem>

<TabItem value="config">

<File name='checks/multiple_sources_joined.sql'>

```sql
{{ config(
    selection_filter_on = "child_unique_id"
) }}
```

</File>

</TabItem>

</Tabs>

## Related docs

- [Checks](/docs/build/checks)
- [Check configurations](/reference/check-configs)
- [Using selectors with checks](/docs/build/checks#using-selectors-with-checks)
