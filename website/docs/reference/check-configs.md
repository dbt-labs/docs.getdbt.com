---
title: Check configurations
description: "Configure severity, enabled, selection_filter_on, tags, and meta for project quality checks."
availability:
  engine: v2
meta:
  resource_type: Checks
---

## Related documentation
- [Project quality checks](/docs/build/project-checks)
- [Check properties](/reference/check-properties)
- [`dbt check` command](/reference/commands/check)

## Available configurations

<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
    { label: 'Project YAML file', value: 'project-yaml', },
    { label: 'Properties YAML file', value: 'property-yaml', },
    { label: 'SQL config', value: 'config', },
  ]
}>

<TabItem value="project-yaml">

<File name='dbt_project.yml'>

```yaml
checks:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[severity](/reference/resource-configs/severity): error | warn
    [+](/reference/resource-configs/plus-prefix)[enabled](/reference/resource-configs/enabled): true | false
    [+](/reference/resource-configs/plus-prefix)[selection_filter_on](/reference/resource-configs/selection-filter-on): <column_name> | [<column_names>] | none
    [+](/reference/resource-configs/plus-prefix)[tags](/reference/resource-configs/tags): <string> | [<string>]
    [+](/reference/resource-configs/plus-prefix)[meta](/reference/resource-configs/meta): {<dictionary>}
```

</File>

</TabItem>

<TabItem value="property-yaml">

<File name='checks/_checks.yml'>

```yaml
version: 2

checks:
  - name: [<check-name>](/reference/resource-configs/resource-path)
    config:
      [severity](/reference/resource-configs/severity): error | warn
      [enabled](/reference/resource-configs/enabled): true | false
      [selection_filter_on](/reference/resource-configs/selection-filter-on): <column_name> | [<column_names>] | none
      [tags](/reference/resource-configs/tags): <string> | [<string>]
      [meta](/reference/resource-configs/meta): {<dictionary>}
```

</File>

</TabItem>

<TabItem value="config">

<File name='checks/<check_name>.sql'>

```sql
{{ config(
    severity = "error" | "warn",
    enabled = true | false,
    selection_filter_on = "<column_name>" | ["<column_names>"] | "none",
    tags = ["<string>"],
    meta = {"key": "value"}
) }}

select ...
from {{ info_schema('models') }}
where ...
```

</File>

</TabItem>

</Tabs>

## Examples

The following examples show common ways to configure checks.

### Warn-severity check

You can use `severity: warn` when rolling out a new rule gradually. Issues are logged but the build does not fail.

<File name='checks/_public_models_have_owners.yml'>

```yaml
checks:
  - name: public_models_have_owners
    config:
      severity: warn  # default is error
```

</File>

### Edge check with `selection_filter_on`

Edge checks return parent/child pairs rather than a single `unique_id` column. Without `selection_filter_on`, dbt looks for a `unique_id` column to scope rows by `--select` and finds none, so the check always runs against the whole project. Set `selection_filter_on` to list both columns so `--select` scopes rows by either endpoint:

<File name='checks/_no_staging_to_mart_dependency.yml'>

```yaml
checks:
  - name: no_staging_to_mart_dependency
    config:
      severity: error
      selection_filter_on: [parent_unique_id, child_unique_id]
```

</File>

