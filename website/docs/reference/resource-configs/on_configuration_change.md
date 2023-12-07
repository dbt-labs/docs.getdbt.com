---
resource_types: [models]
description: "on_configuration_change - Read this in-depth guide to learn about configuration change monitoring in dbt."
datatype: "string"
---

:::info
This functionality is currently only supported for [materialized views](/docs/build/materializations#materialized-view) on a subset of adapters
:::

The `on_configuration_change` config has three settings:
- `apply` (default) &mdash; attempt to update the existing database object if possible, avoiding a complete rebuild
  - *Note:* if any individual configuration change requires a full refresh, a full refresh be performed in lieu of individual alter statements
- `continue` &mdash; allow runs to continue while also providing a warning that the object was left untouched
  - *Note:* this could result in downstream failures as those models may depend on these unimplemented changes
- `fail` &mdash; force the entire run to fail if a change is detected

<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
    { label: 'Project file', value: 'project-yaml', },
    { label: 'Property file', value: 'property-yaml', },
    { label: 'Config block', value: 'config', },
  ]
}>


<TabItem value="project-yaml">

<File name='dbt_project.yml'>

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[materialized](/reference/resource-configs/materialized): <materialization_name>
    [+](/reference/resource-configs/plus-prefix)on_configuration_change: apply | continue | fail
```

</File>

</TabItem>


<TabItem value="property-yaml">

<File name='models/properties.yml'>

```yaml
version: 2

models:
  - name: [<model-name>]
    config:
      [materialized](/reference/resource-configs/materialized): <materialization_name>
      on_configuration_change: apply | continue | fail
```

</File>

</TabItem>


<TabItem value="config">

<File name='models/<model_name>.sql'>

```jinja
{{ config(
    [materialized](/reference/resource-configs/materialized)="<materialization_name>",
    on_configuration_change="apply" | "continue" | "fail"
) }}
```

</File>

</TabItem>

</Tabs>

Materializations are implemented following this "drop through" life cycle:
1. If a model does not exist with the provided path, create the new model
2. If a model exists, but has a different type, drop the existing model and create the new model 
3. If `--full-refresh` is supplied, replace the existing model regardless of configuration changes and the `on_configuration_change` setting
4. If there are no configuration changes, perform the default action for that type (e.g. apply refresh for a materialized view)
5. Determine whether to apply the configuration changes according to the `on_configuration_change` setting
