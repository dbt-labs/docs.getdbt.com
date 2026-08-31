---
title: selection_filter_on
id: "selection-filter-on"
description: "Configure which output column `--select` uses to filter check result rows."
resource_types: [checks]
datatype: string | [string] | none
availability:
  engine: v2
---

When you pass `--select` or `--exclude` to `dbt check` or `dbt build`, dbt filters the _rows_ a check reports. It does not control which checks run. `selection_filter_on` tells dbt which output column to use when deciding whether to keep or drop a row.

## Values

| Value | Behavior |
|-------|----------|
| Default (not set) | If the query returns `unique_id`, dbt keeps only rows whose `unique_id` is in the selection. If the query does not return `unique_id`, the check runs against the whole project. |
| `none` | The check always runs against the whole project, ignoring any selector. |
| A column name or list of column names | dbt keeps a row if the ID in any of the named columns is in the selection. Each named column must exist in the result, or the check errors. |

## When to set this config

For most checks that return a single `unique_id` column, the default behavior is correct and no configuration is needed.

Set `selection_filter_on` explicitly when:

- Your check returns edge rows (parent/child pairs): Set `selection_filter_on` to the columns your check returns (for example, `[parent_unique_id, child_unique_id]`) so `--select` scopes rows by either column.
- Your check is an aggregate (for example, "the project has at least one model"): Set `selection_filter_on: none` to prevent the selector from scoping the check down to nothing.

<Tabs
  groupId="config-languages"
  defaultValue="property-yaml"
  values={[
    { label: 'Project file', value: 'project-yaml', },
    { label: 'Property file', value: 'property-yaml', },
    { label: 'SQL config', value: 'config', },
  ]
}>

<TabItem value="project-yaml">

<File name='dbt_project.yml'>

```yaml
checks:
  +selection_filter_on: none
```

</File>

</TabItem>

<TabItem value="property-yaml">

<File name='checks/_checks.yml'>

```yaml
version: 2

checks:
  - name: no_forbidden_source_access
    config:
      selection_filter_on: [parent_unique_id, child_unique_id]
```

</File>

</TabItem>

<TabItem value="config">

<File name='checks/<check_name>.sql'>

```sql
{{ config(
    selection_filter_on = ["parent_unique_id", "child_unique_id"]
) }}

select parent_unique_id, child_unique_id
from {{ info_schema('edges') }}
where parent_unique_id like 'source.%forbidden%'
```

</File>

</TabItem>

</Tabs>

## Related docs

- [Project quality checks](/docs/build/project-checks)
- [Check configurations](/reference/check-configs)
- [Using selectors with checks](/docs/build/project-checks#using-selectors-with-checks)
