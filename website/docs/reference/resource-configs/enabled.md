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

</Tabs>

## Definition
An optional configuration for disabling models, seeds, and snapshots.

* Default: true

When a resource is disabled, dbt will not consider it as part of your project. Note that this can cause compilation errors.

If you instead want to exclude a model from a particular run, consider using the `--exclude` parameter as part of the [model selection syntax](node-selection/syntax)

If you are disabling models because they are no longer being used, but you want to version control their SQL, consider making them an [analysis](docs/building-a-dbt-project/analyses.md) instead.

## Examples
### Disable a model in a package in order to use your own version of the model.
This could be useful if you want to change the logic of a model in a package. For example, if you need to change the logic in the `segment_web_page_views` from the `segment` package ([original model](https://github.com/fishtown-analytics/segment/blob/master/models/base/segment_web_page_views.sql)):
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
