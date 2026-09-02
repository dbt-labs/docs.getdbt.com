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

- **Default (not set):** If the query returns `unique_id`, dbt keeps only rows whose `unique_id` is in the selection. If the query does not return `unique_id`, the check runs against the whole project.
- **`none`:** The check always runs against the whole project, ignoring any selector. Use this to make whole-project behavior explicit.
- **A column name or list of column names:** dbt keeps a row if the ID in any of the named columns is in the selection. Each named column must exist in the result, or the check raises an error.

## When to set this config

For most checks that return a single `unique_id` column, the default behavior is correct and no configuration is needed.

Use `selection_filter_on` when your check returns edge rows (parent/child pairs). Set it to the columns that contain resource IDs (for example, `[parent_unique_id, child_unique_id]`) so selectors can scope rows by either column.

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
  +selection_filter_on: none
```

</File>

</TabItem>

<TabItem value="property-yaml">

<File name='checks/_checks.yml'>

```yaml
checks:
  - name: no_staging_to_mart_dependency
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
where ...
```

</File>

</TabItem>

</Tabs>

## Related docs

- [Project quality checks](/docs/build/project-checks)
- [Check configurations](/reference/check-configs)
- [Using selectors with checks](/docs/build/project-checks#using-selectors-with-checks)
