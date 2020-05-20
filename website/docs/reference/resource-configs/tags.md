---
resource_types: all
datatype: string | [string]
---
<Alert type='info'>

To tag a column, test, or source, use the [tag _property_](resource-properties/tags).

</Alert>

<Tabs
  defaultValue="yaml"
  values={[
    { label: 'YAML', value: 'yaml', },
    { label: 'Config block', value: 'config', },
  ]
}>
<TabItem value="yaml">

<File name='dbt_project.yml'>

```yml

models:
  [<resource-path>](resource-path):
    [tags](tags): <string> | [<string>]

snapshots:
  [<resource-path>](resource-path):
    [tags](tags): <string> | [<string>]

seeds:
  [<resource-path>](resource-path):
    [tags](tags): <string> | [<string>]

```

</File>
</TabItem>


<TabItem value="config">

```jinja

{{ config(
    [tags](tags)="<string>" | ["<string>"]
) }}

```

</TabItem>

</Tabs>

## Definition
Apply a tag (or list of tags) to a model, seed, or snapshot.

These tags can be used as part of the [resource selection syntax](model-selection-syntax), when running the following commands:
- `dbt run --models tag:my_tag`
- `dbt seed --select tag:my_tag`
- `dbt snapshot --select tag:my_tag`

Note that you need to use the [tag _property_](resource-properties/tags) to apply tags to columns, tests, and sources. (Yes, we know this is confusing, and hope to resolve it in a future release!)

## Examples
### Use tags to run parts of your project

Apply tags in your `dbt_project.yml` as a single value or a string:

<File name='dbt_project.yml'>

```yml
models:
  jaffle_shop:
    tags: "contains_pii"

    staging:
      tags:
        - "hourly"

    marts:
      tags:
        - "hourly"
        - "published"

    metrics:
      tags:
        - "daily"
        - "published"

```

</File>

You can also apply tags to individual resources using a config block:

<File name='models/staging/stg_payments.sql'>

```sql
{{ config(
    tags=["finance"]
) }}

select ...

```

</File>

Then, run part of your project like so:

```
# Run all models tagged "daily"
$ dbt run --model tag:daily

# Run all models tagged "daily", except those that are tagged hourly
$ dbt run --model tag:daily --exclude tag:hourly
```

### Apply tags to seeds

<File name='dbt_project.yml'>

```yml
seeds:
  jaffle_shop:
    utm_mappings:
      tags: marketing
```

</File>

<File name='dbt_project.yml'>

```yml
seeds:
  jaffle_shop:
    utm_mappings:
      tags:
        - marketing
        - hourly
```

</File>

## Usage notes

### Tags are additive
Tags accumulate hierarchically. The above example would result in:

| Model                            | Tags                                  |
| -------------------------------- | ------------------------------------- |
| models/staging/stg_customers.sql | `contains_pii`, `hourly`              |
| models/staging/stg_payments.sql  | `contains_pii`, `hourly`, `finance`   |
| models/marts/dim_customers.sql   | `contains_pii`, `hourly`, `published` |
| models/metrics/daily_metrics.sql | `contains_pii`, `daily`, `published`  |
