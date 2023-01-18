---
resource_types: all
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
  ]
}>
<TabItem value="models">

<File name='models/<modelname>.sql'>

```sql

{{ config(
  enabled=true | false
) }}

select ...


```

</File>

<File name='dbt_project.yml'>

```yml
models:
  [<resource-path>](resource-path):
    +enabled: true | false

```

</File>

</TabItem>


<TabItem value="seeds">

<File name='dbt_project.yml'>

```yml
seeds:
  [<resource-path>](resource-path):
    +enabled: true | false

```

</File>

</TabItem>

<TabItem value="snapshots">

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

<File name='dbt_project.yml'>

```yml
snapshots:
  [<resource-path>](resource-path):
    +enabled: true | false

```

</File>

</TabItem>

<TabItem value="tests">

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

<File name='dbt_project.yml'>

```yml
tests:
  [<resource-path>](resource-path):
    +enabled: true | false

```

</File>

</TabItem>

<TabItem value="sources">

<File name='dbt_project.yml'>

```yaml
sources:
  [<resource-path>](resource-path):
    [+](plus-prefix)enabled: true | false

```

</File>

<VersionBlock firstVersion="1.1">

<File name='models/properties.yml'>

```yaml
version: 2

sources:
  - name: [<source-name>]
    [config](resource-properties/config):
      enabled: true | false
    tables:
      - name: [<source-table-name>]
        [config](resource-properties/config):
          enabled: true | false

```

</File>

</VersionBlock>

</TabItem>

<TabItem value="metrics">

<VersionBlock lastVersion="1.2">

Support for disabling metrics was added in dbt Core v1.3

</VersionBlock>

<VersionBlock firstVersion="1.3">

<File name='dbt_project.yml'>

```yaml
metrics:
  [<resource-path>](resource-path):
    [+](plus-prefix)enabled: true | false

```

</File>

<File name='models/metrics.yml'>

```yaml
version: 2

metrics:
  - name: [<metric-name>]
    [config](resource-properties/config):
      enabled: true | false

```

</File>

</VersionBlock>

</TabItem>

<TabItem value="exposures">

<VersionBlock lastVersion="1.2">

Support for disabling exposures was added in dbt Core v1.3

</VersionBlock>

<VersionBlock firstVersion="1.3">

<File name='dbt_project.yml'>

```yaml
exposures:
  [<resource-path>](resource-path):
    [+](plus-prefix)enabled: true | false

```

</File>

<File name='models/exposures.yml'>

```yaml
version: 2

exposures:
  - name: [<exposure-name>]
    [config](resource-properties/config):
      enabled: true | false

```

</File>

</VersionBlock>

</TabItem>

</Tabs>

## Definition
An optional configuration for disabling models, seeds, snapshots, and tests.

* Default: true

When a resource is disabled, dbt will not consider it as part of your project. Note that this can cause compilation errors.

If you instead want to exclude a model from a particular run, consider using the `--exclude` parameter as part of the [model selection syntax](node-selection/syntax)

If you are disabling models because they are no longer being used, but you want to version control their SQL, consider making them an [analysis](/docs/build/analyses) instead.

## Examples
### Disable a model in a package in order to use your own version of the model.
This could be useful if you want to change the logic of a model in a package. For example, if you need to change the logic in the `segment_web_page_views` from the `segment` package ([original model](https://github.com/dbt-labs/segment/blob/main/models/base/segment_web_page_views.sql)):
1. Add a model named `segment_web_page_views` the same name to your own project.
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
