---
description: "Configure tags to label and organize your dbt models and resources."
sidebar_label: "tags"
resource_types: all
datatype: string | [string]
---

<Tabs
  defaultValue="models"
  values={[
    { label: 'Models', value: 'models', },
    { label: 'Seeds', value: 'seeds', },
    { label: 'Snapshots', value: 'snapshots', },
    { label: 'Saved queries', value: 'saved queries', },
    { label: 'Sources', value: 'sources', },
    { label: 'Exposures', value: 'exposures', },
    { label: 'Tests', value: 'tests', },
  ]
}>
<TabItem value="models">

<File name='dbt_project.yml'>

<VersionBlock firstVersion="1.9">

```yml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    +tags: <string> | [<string>]
```

</VersionBlock>

</File>

<File name='models/properties.yml'>

```yaml
models:
  - name: model_name
    config:
      tags: <string> | [<string>]
    columns:
      - name: column_name
        config:
          tags: <string> | [<string>] # changed to config in v1.10 and backported to 1.9
        data_tests:
          - test_name:
              config:
                tags: <string> | [<string>]
```

</File>

<File name='models/<modelname>.sql'>

```sql
{{ config(
    tags="<string>" | ["<string>"]
) }}

select ...
```

</File>

</TabItem>

<TabItem value="seeds">

<File name='dbt_project.yml'>

<VersionBlock firstVersion="1.9">

```yml
seeds:
  [<resource-path>](/reference/resource-configs/resource-path):
    +tags: <string> | [<string>]
```

</VersionBlock>

</File>

<File name='seeds/properties.yml'>

```yaml
seeds:
  - name: seed_name
    config:
      tags: <string> | [<string>]
    columns:
      - name: column_name
        config:
          tags: <string> | [<string>] # changed to config in v1.10 and backported to 1.9
        data_tests:
          - test_name:
              config:
                tags: <string> | [<string>]
```

</File>

</TabItem>

<TabItem value="snapshots">

<File name='dbt_project.yml'>

<VersionBlock firstVersion="1.9">

```yml
snapshots:
  [<resource-path>](/reference/resource-configs/resource-path):
    +tags: <string> | [<string>]
```

</VersionBlock>

</File>

<VersionBlock firstVersion="1.9">

<File name='snapshots/properties.yml'>

```yaml
snapshots:
  - name: snapshot_name
    config:
      tags: <string> | [<string>]
```

</File>

</VersionBlock>

<File name='snapshots/<filename>.sql'>

```sql
{% snapshot snapshot_name %}

{{ config(
    tags="<string>" | ["<string>"]
) }}

select ...

{% endsnapshot %}
```

</File>

</TabItem>

<TabItem value="saved queries">

<File name='dbt_project.yml'>

<VersionBlock firstVersion="1.9">

```yml
saved-queries:
  [<resource-path>](/reference/resource-configs/resource-path):
    +tags: <string> | [<string>]
```

</VersionBlock>

</File>

<File name='models/semantic_models.yml'>

```yaml
saved_queries:
  - name: saved_query_name
    config:
      tags: <string> | [<string>]
```

</File>

</TabItem>

<TabItem value="sources">

<File name='dbt_project.yml'>

<VersionBlock firstVersion="1.9">

```yml
sources:
  [<resource-path>](/reference/resource-configs/resource-path):
    +tags: <string> | [<string>]
```

</VersionBlock>

</File>

<File name='models/properties.yml'>

```yaml
sources:
  - name: source_name
    config:
      tags: <string> | [<string>] # changed to config in v1.10
    tables:
      - name: table_name
        config:
          tags: <string> | [<string>] # changed to config in v1.10
        columns:
          - name: column_name
            config:
              tags: <string> | [<string>] # changed to config in v1.10 and backported to 1.9
            data_tests:
              - test_name:
                  config:
                    tags: <string> | [<string>]
```

</File>

Note that for backwards compatibility, `tags` is supported as a top-level key for sources, but without the capabilities of config inheritance.

</TabItem>

<TabItem value="exposures">

<File name='dbt_project.yml'>

<VersionBlock firstVersion="1.9">

```yml
exposures:
  [<resource-path>](/reference/resource-configs/resource-path):
    +tags: <string> | [<string>]
```

</VersionBlock>

</File>

<File name='models/exposures.yml'>

```yaml
exposures:
  - name: exposure_name
    config:
      tags: <string> | [<string>] # changed to config in v1.10
```

</File>

Note that for backwards compatibility, `tags` is supported as a top-level key for exposures, but without the capabilities of config inheritance.

</TabItem>

<TabItem value="tests">

<File name='dbt_project.yml'>

<VersionBlock firstVersion="1.9">

```yml
data_tests:
  [<resource-path>](/reference/resource-configs/resource-path):
    +tags: <string> | [<string>]
```

</VersionBlock>

</File>

<File name='models/properties.yml'>

```yaml
models:
  - name: model_name
    columns:
      - name: column_name
        data_tests:
          - test_name:
              config:
                tags: <string> | [<string>]
```

</File>

<File name='tests/<filename>.sql'>

```sql
{% test test_name() %}

{{ config(
    tags="<string>" | ["<string>"]
) }}

select ...

{% endtest %}
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
- `dbt run --select +tag:my_tag+` &mdash; Run models tagged with `my_tag`, their upstream dependencies, and their downstream dependencies.
- `dbt run --select tag:my_tag+ --exclude tag:exclude_tag` &mdash; Run models tagged with `my_tag` and their downstream dependencies, and exclude models tagged with `exclude_tag`, regardless of their dependencies.


:::tip Usage notes about tags

When using tags, consider the following: 

- Each individual tag must be a string. 
- Tags are additive across project hierarchy.
- Some resource types (like sources, exposures) require tags at the top level.

Refer to [usage notes](#usage-notes) for more information.
:::

## Examples

The following examples show how to apply tags to resources in your project. You can configure tags in the `dbt_project.yml`, property files, or SQL files.

### Use tags to run parts of your project

Apply tags in your `dbt_project.yml` as a single value or a string. In the following example, one of the models, the `jaffle_shop` model, is tagged with `contains_pii`. 

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


### Apply tags to models

This section demonstrates applying tags to models in the `dbt_project.yml`, `schema.yml`, and SQL files. 

To apply tags to a model in your `dbt_project.yml` file, you would add the following:

<File name='dbt_project.yml'>

```yaml
models:
  jaffle_shop:
    +tags: finance # jaffle_shop model is tagged with 'finance'.
```

</File>

To apply tags to a model in your `models/` directory YAML property file, you would add the following using the `config` property:

<File name='models/stg_customers.yml'>

```yaml
models:
  - name: stg_customers
    description: Customer data with basic cleaning and transformation applied, one row per customer.
    config:
      tags: ['santi'] # stg_customers.yml model is tagged with 'santi'.
    columns:
      - name: customer_id
        description: The unique key for each customer.
        data_tests:
          - not_null
          - unique
```

</File>

To apply tags to a model in your SQL file, you would add the following:

<File name='models/staging/stg_payments.sql'>

```sql
{{ config(
    tags=["finance"] # stg_payments.sql model is tagged with 'finance'.
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


This following example shows how to apply a tag to a saved query in the `dbt_project.yml` file. The saved query is then tagged with `order_metrics`.

<File name='dbt_project.yml'>

```yml
saved-queries:
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

## Usage notes

### Tags must be strings

Each individual tag must be a string value (for example, `marketing` or `daily`).

In the following example, `my_tag: "my_value"` is invalid because it is a key-value pair.

```yml
sources:
  - name: ecom
    schema: raw
    description: E-commerce data for the Jaffle Shop
    config:
      tags:
        my_tag: "my_value". # invalid
    tables:
      - name: raw_customers
        config:
          tags:
            my_tag: "my_value". # invalid
```

A warning is raised when the `tags` value is not a string. For example:

```
Field config.tags: {'my_tag': 'my_value'} is not valid for source (ecom)
```

### Tags are additive
Tags accumulate hierarchically. The [earlier example](/reference/resource-configs/tags#use-tags-to-run-parts-of-your-project) would result in:

| Model                            | Tags                                  |
| -------------------------------- | ------------------------------------- |
| models/staging/stg_customers.sql | `contains_pii`, `hourly`              |
| models/staging/stg_payments.sql  | `contains_pii`, `hourly`, `finance`   |
| models/marts/dim_customers.sql   | `contains_pii`, `hourly`, `published` |
| models/metrics/daily_metrics.sql | `contains_pii`, `daily`, `published`  |

### Applying tags to specific columns and tests

You can also apply tags to specific columns in a resource, and to tests.

<File name='models/properties.yml'>

```yml
models:
  - name: my_model
    columns:
      - name: column_name
        config:
          tags: ['column_level'] # changed to config in v1.10 and backported to 1.9
        data_tests:
          - unique:
              config:
                tags: ['test_level'] # changed to config in v1.10
```

</File>

In the example above, the `unique` test would be selected by either of these tags:
```bash
dbt test --select tag:column_level
dbt test --select tag:test_level
```

### Backwards compatibility for sources and exposures

For backwards compatibility, `tags` is supported as a top-level key for sources and exposures (prior to dbt v1.10), but without the capabilities of config inheritance.

<File name='models/properties.yml'>

```yml
exposures:
  - name: my_exposure
    tags: ['exposure_tag'] # top-level key (legacy)
    # OR use config (v1.10+)
    config:
      tags: ['exposure_tag']

sources:
  - name: source_name
    tags: ['top_level'] # top-level key (legacy)
    # OR use config (v1.10+)
    config:
      tags: ['top_level']
    tables:
      - name: table_name
        tags: ['table_level'] # top-level key (legacy)
        # OR use config (v1.10+)
        config:
          tags: ['table_level']
        columns:
          - name: column_name
            config:
              tags: ['column_level'] # changed to config in v1.10 and backported to 1.9
```

</File>
