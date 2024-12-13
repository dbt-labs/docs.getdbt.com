---
resource_types: all
description: "Enabled - Read this in-depth guide to learn about configurations in dbt."
datatype: boolean
default_value: true
---

<Tabs
  defaultValue="models"
  values={[
    { label: 'Models', value: 'models', },
    { label: 'Seeds', value: 'seeds', },
    { label: 'Snapshots', value: 'snapshots', },
    { label: 'Tests', value: 'tests', },
    { label: 'Sources', value: 'sources', },
    { label: 'Metrics', value: 'metrics', },
    { label: 'Exposures', value: 'exposures', },
    { label: 'Semantic models', value: 'semantic models', },
    { label: 'Saved queries', value: 'saved queries', },
  ]
}>
<TabItem value="models">

<File name='dbt_project.yml'>

```yml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    +enabled: true | false

```

</File>

<File name='models/<modelname>.sql'>

```sql

{{ config(
  enabled=true | false
) }}

select ...


```

</File>

</TabItem>


<TabItem value="seeds">

<File name='dbt_project.yml'>

```yml
seeds:
  [<resource-path>](/reference/resource-configs/resource-path):
    +enabled: true | false

```

</File>

</TabItem>

<TabItem value="snapshots">

<File name='dbt_project.yml'>

```yml
snapshots:
  [<resource-path>](/reference/resource-configs/resource-path):
    +enabled: true | false

```

</File>

<File name='snapshots/<filename>.sql'>

```sql
{% snapshot [snapshot_name](snapshot_name) %}

{{ config(
  enabled=true | false
) }}

select ...

{% endsnapshot %}

```

</File>

</TabItem>

<TabItem value="tests">

<File name='dbt_project.yml'>

```yml
tests:
  [<resource-path>](/reference/resource-configs/resource-path):
    +enabled: true | false

```

</File>

<File name='tests/<filename>.sql'>

```sql
{% test <testname>() %}

{{ config(
  enabled=true | false
) }}

select ...

{% endtest %}

```

</File>

<File name='tests/<filename>.sql'>

```sql
{{ config(
  enabled=true | false
) }}
```

</File>

</TabItem>

<TabItem value="sources">

<File name='dbt_project.yml'>

```yaml
sources:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)enabled: true | false

```

</File>


<File name='models/properties.yml'>

```yaml
version: 2

sources:
  - name: [<source-name>]
    [config](/reference/resource-properties/config):
      enabled: true | false
    tables:
      - name: [<source-table-name>]
        [config](/reference/resource-properties/config):
          enabled: true | false

```

</File>


</TabItem>

<TabItem value="metrics">

<File name='dbt_project.yml'>

```yaml
metrics:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)enabled: true | false
```

</File>

<File name='models/metrics.yml'>

```yaml
version: 2

metrics:
  - name: [<metric-name>]
    [config](/reference/resource-properties/config):
      enabled: true | false
```

</File>

</TabItem>

<TabItem value="exposures">

<File name='dbt_project.yml'>

```yaml
exposures:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)enabled: true | false
```

</File>

<File name='models/exposures.yml'>

```yaml
version: 2

exposures:
  - name: [<exposure-name>]
    [config](/reference/resource-properties/config):
      enabled: true | false
```

</File>

</TabItem>

<TabItem value="semantic models">

<File name='dbt_project.yml'>

```yaml
semantic-models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)enabled: true | false
```

</File>

<File name='models/semantic_models.yml'>

```yaml
semantic_models:
  - name: [<semantic_model_name>]
    [config](/reference/resource-properties/config):
      enabled: true | false
```

</File>

</TabItem>

<TabItem value="saved queries">

<File name='dbt_project.yml'>

```yaml
saved-queries:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)enabled: true | false
```

</File>

<File name='models/semantic_models.yml'>

```yaml
saved_queries:
  - name: [<saved_query_name>]
    [config](/reference/resource-properties/config):
      enabled: true | false
```

</File>

</TabItem>

</Tabs>

## Definition

An optional configuration for enabling or disabling a resource.

* Default: true

When a resource is disabled, dbt will not consider it as part of your project. Note that this can cause compilation errors.

If you instead want to exclude a model from a particular run, consider using the `--exclude` parameter as part of the [model selection syntax](/reference/node-selection/syntax)

If you are disabling models because they are no longer being used, but you want to version control their SQL, consider making them an [analysis](/docs/build/analyses) instead.

## Examples
### Disable a model in a package in order to use your own version of the model.
This could be useful if you want to change the logic of a model in a package. For example, if you need to change the logic in the `segment_web_page_views` from the `segment` package ([original model](https://github.com/dbt-labs/segment/blob/a8ff2f892b009a69ec36c3061a87e437f0b0ea93/models/base/segment_web_page_views.sql)):
1. Add a model named `segment_web_page_views` (the same name) to your own project.
2. To avoid a compilation error due to duplicate models, disable the segment package's version of the model like so:

<File name='dbt_project.yml'>

```yml
models:
  segment:
    base:
      segment_web_page_views:
        +enabled: false
```

</File>
