---
resource_types: [models]
description: "Materialized - Read this in-depth guide to learn about materializations in dbt."
datatype: "string"
---

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
[config-version](/reference/project-configs/config-version): 2

models:
  [<resource-path>](/reference/resource-configs/resource-path):
    +materialized: [<materialization_name>](https://docs.getdbt.com/docs/build/materializations#materializations)
```

</File>

</TabItem>


<TabItem value="property-yaml">

<File name='models/properties.yml'>

```yaml
version: 2

models:
  - name: <model_name>
    config:
      materialized: [<materialization_name>](https://docs.getdbt.com/docs/build/materializations#materializations)

```

</File>

</TabItem>


<TabItem value="config">

<File name='models/<model_name>.sql'>

```jinja
{{ config(
  materialized="[<materialization_name>](https://docs.getdbt.com/docs/build/materializations#materializations)"
) }}

select ...
```

</File>

</TabItem>

</Tabs>

## Definition 

[Materializations](/docs/build/materializations#materializations) are strategies for persisting dbt models in a warehouse. These are the materialization types built into dbt:

- `ephemeral` &mdash; [ephemeral](/docs/build/materializations#ephemeral) models are not directly built into the database
- `table` &mdash; a model is rebuilt as a [table](/docs/build/materializations#table) on each run
- `view` &mdash; a model is rebuilt as a [view](/docs/build/materializations#view) on each run
- `materialized_view` &mdash; allows the creation and maintenance of [materialized views](/docs/build/materializations#materialized-view) in the target database
- `incremental` &mdash; [incremental](/docs/build/materializations#incremental) models allow dbt to insert or update records into a table since the last time that model was run

You can also configure [custom materializations](/guides/create-new-materializations?step=1) in dbt. Custom materializations are a powerful way to extend dbt's functionality to meet your specific needs.

## Creation Precedence
<!-- This text is copied from /reference/resource-configs/on_configuration_change.md -->
Materializations are implemented following this "drop through" life cycle:

1. If a model does not exist with the provided path, create the new model.
2. If a model exists, but has a different type, drop the existing model and create the new model.
3. If [`--full-refresh`](/reference/resource-configs/full_refresh) is supplied, replace the existing model regardless of configuration changes and the [`on_configuration_change`](/reference/resource-configs/on_configuration_change) setting.
4. If there are no configuration changes, perform the default action for that type (e.g. apply refresh for a materialized view).
5. Determine whether to apply the configuration changes according to the `on_configuration_change` setting.


