---
sidebar_label: "tags"
resource_types: all
datatype: string | [string]
---

<Tabs
  defaultValue="project-yaml"
  values={[
    { label: 'Project file', value: 'project-yaml', },
    { label: 'Config property', value: 'other-yaml', },
    { label: 'Config block', value: 'config', },
  ]
}>
<TabItem value="project-yaml">

<File name='dbt_project.yml'>

```yml

models:
  [<resource-path>](/reference/resource-configs/resource-path):
    +tags: <string> | [<string>]

snapshots:
  [<resource-path>](/reference/resource-configs/resource-path):
    +tags: <string> | [<string>]

seeds:
  [<resource-path>](/reference/resource-configs/resource-path):
    +tags: <string> | [<string>]

```

</File>
</TabItem>

<TabItem value="other-yaml">

<File name='models/resources.yml'>

```yml
version: 2

models:
  - name: model_name
    config:
      tags: <string> | [<string>]

    columns:
      - name: column_name
        tags: [<string>]
        tests:
          <test-name>:
            config:
              tags: <string> | [<string>]
```

</File>
</TabItem>


<TabItem value="config">

```jinja

{{ config(
    tags="<string>" | ["<string>"]
) }}

```

</TabItem>

</Tabs>

## Definition
Apply a tag (or list of tags) to a resource.

These tags can be used as part of the [resource selection syntax](/reference/node-selection/syntax), when running the following commands:
- `dbt run --select tag:my_tag`
- `dbt seed --select tag:my_tag`
- `dbt snapshot --select tag:my_tag`
- `dbt test --select tag:my_tag` (indirectly runs all tests associated with the models that are tagged)

## Examples
### Use tags to run parts of your project

Apply tags in your `dbt_project.yml` as a single value or a string:

<File name='dbt_project.yml'>

```yml
models:
  jaffle_shop:
    +tags: "contains_pii"

    staging:
      +tags:
        - "hourly"

    marts:
      +tags:
        - "hourly"
        - "published"

    metrics:
      +tags:
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
$ dbt run --select tag:daily

# Run all models tagged "daily", except those that are tagged hourly
$ dbt run --select tag:daily --exclude tag:hourly
```

### Apply tags to seeds

<File name='dbt_project.yml'>

```yml
seeds:
  jaffle_shop:
    utm_mappings:
      +tags: marketing
```

</File>

<File name='dbt_project.yml'>

```yml
seeds:
  jaffle_shop:
    utm_mappings:
      +tags:
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

### Other resource types

Tags can also be applied to sources, exposures, and even _specific columns_ in a resource.
These resources do not yet support the `config` property, so you'll need to specify
the tags as a top-level key instead.

<File name='models/schema.yml'>

```yml
version: 2

exposures:
  - name: my_exposure
    tags: ['exposure_tag']
    ...

sources:
  - name: source_name
    tags: ['top_level']

    tables:
      - name: table_name
        tags: ['table_level']

        columns:
          - name: column_name
            tags: ['column_level']
            tests:
              - unique:
                  tags: ['test_level']
```

</File>

In the example above, the `unique` test would be selected by any of these four tags:
```bash
$ dbt test --select tag:top_level
$ dbt test --select tag:table_level
$ dbt test --select tag:column_level
$ dbt test --select tag:test_level
```
