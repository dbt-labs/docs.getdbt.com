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

<VersionBlock lastVersion="1.8">

```yml

[models](/reference/model-configs):
  [<resource-path>](/reference/resource-configs/resource-path):
    +tags: <string> | [<string>] # Supports single strings or list of strings

[snapshots](/reference/snapshot-configs):
  [<resource-path>](/reference/resource-configs/resource-path):
    +tags: <string> | [<string>]

[seeds](/reference/seed-configs):
  [<resource-path>](/reference/resource-configs/resource-path):
    +tags: <string> | [<string>]

```
</VersionBlock>

<VersionBlock firstVersion="1.9">

```yml

[models](/reference/model-configs):
  [<resource-path>](/reference/resource-configs/resource-path):
    +tags: <string> | [<string>] # Supports single strings or list of strings

[snapshots](/reference/snapshot-configs):
  [<resource-path>](/reference/resource-configs/resource-path):
    +tags: <string> | [<string>]

[seeds](/reference/seed-configs):
  [<resource-path>](/reference/resource-configs/resource-path):
    +tags: <string> | [<string>]

[saved-queries:](/docs/build/saved-queries)
  [<resource-path>](/reference/resource-configs/resource-path):
    +tags: <string> | [<string>]

```
</VersionBlock>


</File>
</TabItem>

<TabItem value="other-yaml">

<VersionBlock firstVersion="1.9">

The following examples show how to add tags to dbt resources in YAML files. Replace `resource_type` with `models`, `snapshots`, `seeds`, or `saved_queries` as appropriate.
</VersionBlock>

<VersionBlock lastVersion="1.8">

The following examples show how to add tags to dbt resources in YAML files. Replace `resource_type` with `models`, `snapshots`, or `seeds` as appropriate.
</VersionBlock>

<File name='resource_type/properties.yml'>

```yaml
resource_type:
  - name: resource_name
    config:
      tags: <string> | [<string>] # Supports single strings or list of strings
    # Optional: Add the following specific properties for models
    columns:
      - name: column_name
        tags: <string> | [<string>]
        tests:
          test-name:
            config:
              tags: "single-string" # Supports single string 
              tags: ["string-1", "string-2"] # Supports list of strings
```

</File>
</TabItem>

<TabItem value="config">

<File name='models/model.sql'>
```sql
{{ config(
    tags="<string>" | ["<string>"]
) }}
```
</File>

</TabItem>

</Tabs>

## Definition
Apply a tag (or list of tags) to a resource.

These tags can be used as part of the [resource selection syntax](/reference/node-selection/syntax), when running the following commands:
- `dbt run --select tag:my_tag` &mdash; Run all models tagged with a specific tag.
- `dbt build --select tag:my_tag` &mdash; Build all resources tagged with a specific tag.
- `dbt seed --select tag:my_tag` &mdash; Seed all resources tagged with a specific tag.
- `dbt snapshot --select tag:my_tag` &mdash; Snapshot all resources tagged with a specific tag.
- `dbt test --select tag:my_tag` &mdash; Indirectly runs all tests associated with the models that are tagged.

#### Using tags with the `+` operator
You can use the [`+` operator](/reference/node-selection/graph-operators#the-plus-operator) to include upstream or downstream dependencies in your `tag` selection:
- `dbt run --select tag:my_tag+` &mdash; Run models tagged with `my_tag` and all their downstream dependencies.
- `dbt run --select +tag:my_tag` &mdash; Run models tagged with `my_tag` and all their upstream dependencies.
- `dbt run --select +model_name+` &mdash; Run a model, its upstream dependencies, and its downstream dependencies.
- `dbt run --select tag:my_tag+ --exclude tag:exclude_tag` &mdash; Run model tagged with `my_tag` and their downstream dependencies, and exclude models tagged with `exclude_tag`, regardless of their dependencies.

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

Run resources with specific tags (or exclude resources with specific tags) using the following commands:

```shell
# Run all models tagged "daily"
  dbt run --select tag:daily

# Run all models tagged "daily", except those that are tagged hourly
  dbt run --select tag:daily --exclude tag:hourly
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

### Apply tags to saved queries

<VersionBlock lastVersion="1.8">

:::tip Upgrade to dbt Core 1.9

Applying tags to saved queries is only available in dbt Core versions 1.9 and later.
:::

</VersionBlock>

<VersionBlock firstVersion="1.9">

This following example shows how to apply a tag to a saved query in the `dbt_project.yml` file. The saved query is then tagged with `order_metrics`.

<File name='dbt_project.yml'>

```yml
[saved-queries](/docs/build/saved-queries):
  jaffle_shop:
    customer_order_metrics:
      +tags: order_metrics
```

</File>

Then run resources with a specific tag using the following commands:

```shell
# Run all resources tagged "order_metrics"
  dbt run --select tag:order_metrics
```

The second example shows how to apply multiple tags to a saved query in the `semantic_model.yml` file. The saved query is then tagged with `order_metrics` and `hourly`.

<File name='semantic_model.yml'>

```yaml
saved_queries:
  - name: test_saved_query
    description: "{{ doc('saved_query_description') }}"
    label: Test saved query
    config:
      tags: 
        - order_metrics
        - hourly
```
</File>


Run resources with multiple tags using the following commands:

```shell
# Run all resources tagged "order_metrics" and "hourly"
  dbt build --select tag:order_metrics tag:hourly
```
</VersionBlock>

## Usage notes

### Tags are additive
Tags accumulate hierarchically. The [earlier example](/reference/resource-configs/tags#use-tags-to-run-parts-of-your-project) would result in:

| Model                            | Tags                                  |
| -------------------------------- | ------------------------------------- |
| models/staging/stg_customers.sql | `contains_pii`, `hourly`              |
| models/staging/stg_payments.sql  | `contains_pii`, `hourly`, `finance`   |
| models/marts/dim_customers.sql   | `contains_pii`, `hourly`, `published` |
| models/metrics/daily_metrics.sql | `contains_pii`, `daily`, `published`  |

### Other resource types

Tags can also be applied to [sources](/docs/build/sources), [exposures](/docs/build/exposures), and even _specific columns_ in a resource.
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
dbt test --select tag:top_level
dbt test --select tag:table_level
dbt test --select tag:column_level
dbt test --select tag:test_level
```
