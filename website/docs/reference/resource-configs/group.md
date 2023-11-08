---
resource_types: [models, seeds, snapshots, tests, analyses, metrics]
id: "group"
---

:::info New functionality
This functionality is new in v1.5.
:::

<Tabs
  defaultValue="models"
  values={[
    { label: 'Models', value: 'models', },
    { label: 'Seeds', value: 'seeds', },
    { label: 'Snapshots', value: 'snapshots', },
    { label: 'Tests', value: 'tests', },
    { label: 'Analyses', value: 'analyses', },
    { label: 'Metrics', value: 'metrics', },
    { label: 'Semantic models', value: 'semantic models', },
  ]
}>
<TabItem value="models">

<VersionBlock lastVersion="1.4">

Support for grouping models was added in dbt Core v1.5

</VersionBlock>

<VersionBlock firstVersion="1.5">

<File name='models/schema.yml'>

```yml
version: 2

models:
  - name: model_name
    group: finance
```

</File>

<File name='dbt_project.yml'>

```yml
models:
  [<resource-path>](resource-path):
    +group: finance
```


</File>

<File name='models/<modelname>.sql'>

```sql

{{ config(
  group='finance'
) }}

select ...

```

</File>

</VersionBlock>

</TabItem>

<TabItem value="seeds">

<VersionBlock lastVersion="1.4">

Support for grouping seeds was added in dbt Core v1.5

</VersionBlock>

<VersionBlock firstVersion="1.5">

<File name='dbt_project.yml'>

```yml
models:
  [<resource-path>](resource-path):
    +group: finance
```

</File>

<File name='seeds/properties.yml'>

```yml
seeds:
  - name: [<seed-name>]
    group: finance
```

</File>

</VersionBlock>


</TabItem>

<TabItem value="snapshots">

<VersionBlock lastVersion="1.4">

Support for grouping snapshots was added in dbt Core v1.5

</VersionBlock>

<VersionBlock firstVersion="1.5">

<File name='dbt_project.yml'>

```yml
snapshots:
  [<resource-path>](resource-path):
    +group: finance
```

</File>

<File name='snapshots/<filename>.sql'>

```sql
{% snapshot [snapshot_name](snapshot_name) %}

{{ config(
  group='finance'
) }}

select ...

{% endsnapshot %}
```

</File>

</VersionBlock>


</TabItem>

<TabItem value="tests">

<VersionBlock lastVersion="1.4">

Support for grouping tests was added in dbt Core v1.5

</VersionBlock>

<VersionBlock firstVersion="1.5">

<File name='dbt_project.yml'>

```yml
tests:
  [<resource-path>](resource-path):
    +group: finance
```

</File>

<File name='tests/properties.yml'>

```yml
version: 2

<resource_type>:
  - name: <resource_name>
    tests:
      - <test_name>:
          config:
            group: finance
```

</File>

<File name='tests/<filename>.sql'>

```sql
{% test <testname>() %}

{{ config(
  group='finance'
) }}

select ...

{% endtest %}
```

</File>

<File name='tests/<filename>.sql'>


```sql
{{ config(
  group='finance'
) }}
```

</File>

</VersionBlock>

</TabItem>

<TabItem value="analyses">

<File name='analyses/<filename>.yml'>

```yml
version: 2

analyses:
  - name: <analysis_name>
    group: finance
```

</File>

</TabItem>


<TabItem value="metrics">

<VersionBlock lastVersion="1.4">

Support for grouping metrics was added in dbt Core v1.5

</VersionBlock>

<VersionBlock firstVersion="1.5">

<File name='dbt_project.yml'>

```yaml
metrics:
  [<resource-path>](resource-path):
    [+](plus-prefix)group: finance
```

</File>

<File name='models/metrics.yml'>

```yaml
version: 2

metrics:
  - name: [<metric-name>]
    group: finance

```

</File>

</VersionBlock>

</TabItem>


<TabItem value="semantic models">

<VersionBlock lastVersion="1.6">

Support for grouping semantic models has been added in dbt Core v1.7.

</VersionBlock>

<VersionBlock firstVersion="1.7">

<File name='models/semantic_models.yml'>

```yaml
semantic_models:
  - name: [<semantic_model_name>]
    group: <group_name>

```

</File>

<File name='dbt_project.yml'>

```yaml
semantic-models:
  [<resource-path>](resource-path):
    [+](plus-prefix)group: <group_name>
```

</File>

</VersionBlock>

</TabItem>

</Tabs>

## Definition
An optional configuration for assigning a group to a resource. When a resource is grouped, dbt will allow it to reference private models within the same group.

For more details on reference access between resources in groups, check out [model access](/docs/collaborate/govern/model-access#groups).

## Examples
### Prevent a 'marketing' group model from referencing a private 'finance' group model
This is useful if you want to prevent other groups from building on top of models that are rapidly changing, experimental, or otherwise internal to a group or team. 

<File name='models/schema.yml'>

```yml
models:
  - name: finance_model
    access: private
    group: finance
  - name: marketing_model
    group: marketing
```
</File>

<File name='models/marketing_model.sql'>

```sql
select * from {{ ref('finance_model') }}
```
</File>

```shell
$ dbt run -s marketing_model
...
dbt.exceptions.DbtReferenceError: Parsing Error
  Node model.jaffle_shop.marketing_model attempted to reference node model.jaffle_shop.finance_model, 
  which is not allowed because the referenced node is private to the finance group.
```

## Related docs

* [Model Access](/docs/collaborate/govern/model-access#groups)
* [Defining groups](/docs/build/groups)
