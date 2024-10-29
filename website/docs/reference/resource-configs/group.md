---
resource_types: [models, seeds, snapshots, tests, analyses, metrics]
id: "group"
---

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
    { label: 'Saved queries', value: 'saved queries',} ,
  ]
}>
<TabItem value="models">
 
<File name='dbt_project.yml'>

```yml
models:

  [<resource-path>](resource-path):
    +group: GROUP_NAME

```


</File>

<File name='models/schema.yml'>

```yml
version: 2

models:
  - name: MODEL_NAME
    group: GROUP

```

</File>

<File name='models/<modelname>.sql'>

```sql

{{ config(
  group='GROUP_NAME'
) }}

select ...

```

</File>

</TabItem>

<TabItem value="seeds">

<File name='dbt_project.yml'>

```yml
models:
  [<resource-path>](resource-path):
    +group: GROUP_NAME
```

</File>

<File name='seeds/properties.yml'>

```yml
seeds:
  - name: [SEED_NAME]
    group: GROUP_NAME
```

</File>

</TabItem>

<TabItem value="snapshots">

<File name='dbt_project.yml'>

```yml
snapshots:
  [<resource-path>](resource-path):
    +group: GROUP_NAME
```

</File>

<File name='snapshots/<filename>.sql'>

```sql
{% snapshot [snapshot_name](snapshot_name) %}

{{ config(
  group='GROUP_NAME'
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
  [<resource-path>](resource-path):
    +group: GROUP_NAME
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
            group: GROUP_NAME
```

</File>

<File name='tests/<filename>.sql'>

```sql
{% test <testname>() %}

{{ config(
  group='GROUP_NAME'
) }}

select ...

{% endtest %}
```

</File>

<File name='tests/<filename>.sql'>


```sql
{{ config(
  group='GROUP_NAME'
) }}
```

</File>

</TabItem>

<TabItem value="analyses">

<File name='analyses/<filename>.yml'>

```yml
version: 2

analyses:
  - name: ANALYSIS_NAME
    group: GROUP_NAME
```

</File>

</TabItem>


<TabItem value="metrics">

<File name='dbt_project.yml'>

```yaml
metrics:
  [<resource-path>](resource-path):
    [+](plus-prefix)group: GROUP_NAME
```

</File>

<File name='models/metrics.yml'>

```yaml
version: 2

metrics:
  - name: [METRIC_NAME]
    config:
      group: GROUP_NAME

```

</File>

</TabItem>


<TabItem value="semantic models">

<File name='dbt_project.yml'>

```yaml
semantic-models:
  [<resource-path>](resource-path):
    [+](plus-prefix)group: GROUP_NAME
```

</File>

<File name='models/semantic_models.yml'>

```yaml
semantic_models:
  - name: SEMANTIC_MODEL_NAME
    config:
      group: GROUP_NAME
```

</File>

</TabItem>

<TabItem value="saved queries">

<File name='dbt_project.yml'>

```yaml
saved-queries:
  [<resource-path>](resource-path):
    [+](plus-prefix)group: GROUP_NAME
```

</File>

<File name='models/semantic_models.yml'>

```yaml
saved_queries:
  - name: SAVED_QUERY_NAME
    config:
      group: GROUP_NAME
```

</File>

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
