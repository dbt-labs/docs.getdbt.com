---
resource_types: all
datatype: "{<dictionary>}"
default_value: {}
---

<Tabs
  defaultValue="models"
  values={[
    { label: 'Models', value: 'models', },
    { label: 'Sources', value: 'sources', },
    { label: 'Seeds', value: 'seeds', },
    { label: 'Snapshots', value: 'snapshots', },
    { label: 'Tests', value: 'tests', },
    { label: 'Unit tests', value: 'unit tests', },
    { label: 'Analyses', value: 'analyses', },
    { label: 'Macros', value: 'macros', },
    { label: 'Exposures', value: 'exposures', },
    { label: 'Semantic models', value: 'semantic models', },
    { label: 'Metrics', value: 'metrics', },
    { label: 'Saved queries', value: 'saved queries', },
  ]
}>
<TabItem value="models">

<File name='dbt_project.yml'>

```yml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    +meta: {<dictionary>}

```

</File>

<File name='models/schema.yml'>

```yml

models:
  - name: model_name
    config:
      meta: {<dictionary>}

    columns:
      - name: column_name
        config:
          meta: {<dictionary>} # changed to config in v1.10 and backported to 1.9

```

</File>

The `meta` config can be defined:
- Under the `models` config in the project file (shown in previous 'models/schema.yml' example)
- Under the `models` config in the project file (`dbt_project.yml`)
- in a `config()` Jinja macro within a model's SQL file

See [configs and properties](/reference/configs-and-properties) for details.

</TabItem>

<TabItem value="sources">

<File name='dbt_project.yml'>

```yml
sources:
  [<resource-path>](/reference/resource-configs/resource-path):
    +meta: {<dictionary>}
```
</File>

<File name='models/schema.yml'>

```yml

[sources](/reference/source-properties):
  - name: model_name
    config:
      meta: {<dictionary>}

    tables:
      - name: table_name
        config:
          meta: {<dictionary>}

        columns:
          - name: column_name
            config:
              meta: {<dictionary>} # changed to config in v1.10 and backported to 1.9

```

</File>

</TabItem>

<TabItem value="seeds">

<File name='dbt_project.yml'>

```yml
seeds:
  [<resource-path>](/reference/resource-configs/resource-path):
    +meta: {<dictionary>}
```
</File>

<File name='seeds/schema.yml'>

```yml

seeds:
  - name: seed_name
    config:
      meta: {<dictionary>}

    columns:
      - name: column_name
        config:
          meta: {<dictionary>} # changed to config in v1.10 and backported to 1.9

```

</File>

The `meta` config can be defined:
- Under the `seeds` config in the property file (shown in in previous 'seeds/schema.yml' example) 
- Under the `seeds` config in the project file (`dbt_project.yml`). See [configs and properties](/reference/configs-and-properties) for details.

</TabItem>

<TabItem value="snapshots">

<File name='dbt_project.yml'>

```yml
snapshots:
  [<resource-path>](/reference/resource-configs/resource-path):
    +meta: {<dictionary>}
```
</File>

<File name='snapshots/schema.yml'>

```yml

snapshots:
  - name: snapshot_name
    config:
      [meta](/reference/snapshot-properties): {<dictionary>}

    columns:
      - name: column_name
        config:
          meta: {<dictionary>} # changed to config in v1.10 and backported to 1.9

```

</File>

The `meta` config can be defined:
- under the `snapshots` config in the properties file (shown in previous `snapshots/schema.yml` example)
- under the `snapshots` config in the project file (`dbt_project.yml`)
- in a `config()` Jinja macro within a snapshot's SQL block

See [configs and properties](/reference/configs-and-properties) for details.

</TabItem>

<TabItem value="tests">

Use the `meta` field to add metadata to [generic](/docs/build/data-tests#generic-data-tests) or [singular tests](/docs/build/data-tests#singular-data-tests). `meta` accepts key-value pairs, is compiled into `manifest.json`, and appears in auto-generated documentation.

**Generic data tests**

Add `meta` under the `config` block in your `properties.yml` file:

<File name="models/properties.yml">
  
```yaml
models:
  - name: my_model
    columns:
      - name: my_column
        data_tests:
          - unique:
              config:
                meta:
                  owner: "docs team"
 ```
</File>

Or set defaults in `dbt_project.yml`:

<File name="dbt_project.yml">

```yaml
data_tests:
  my_project:
    +meta:
      owner: "docs team"
 ```
</File>

**Singular data tests**

Add `meta` in the SQL test file using `config()`:

<File name="tests/my_singular_test.sql">

```sql
{{ config(meta={'owner': 'docs team'}) }}

select * from {{ ref('my_model') }}
where my_column is null
```
</File>

Or document in `tests/properties.yml`:

<File name="tests/properties.yml">

```yaml
data_tests:
  - name: my_singular_test
    config:
      meta:
        owner: "analytics_team"
```
</File>

</TabItem>

<TabItem value="unit tests">

<VersionCallout version="1.8" />

<File name='dbt_project.yml'>

```yml
[unit_tests](/reference/resource-properties/unit-tests):
  [<resource-path>](/reference/resource-configs/resource-path):
    +meta: {<dictionary>}
```
</File>

<File name='models/<filename>.yml'>

```yml
unit_tests:
  - name: <test-name>
    config:
      [meta](/reference/snapshot-properties): {<dictionary>}

```

</File>

</TabItem>

<TabItem value="analyses">

The `meta` config is not currently supported for analyses.

</TabItem>

<TabItem value="macros">

<File name='dbt_project.yml'>

```yml
macros:
  [<resource-path>](/reference/resource-configs/resource-path):
    +meta: {<dictionary>}
```
</File>

<File name='macros/schema.yml'>

```yml
[macros](/reference/macro-properties):
  - name: macro_name
    config: 
      meta: {<dictionary>} # changed to config in v1.11
    arguments:
      - name: argument_name
```

</File>

</TabItem>

<TabItem value="exposures">

<File name='dbt_project.yml'>

```yml
exposures:
  [<resource-path>](/reference/resource-configs/resource-path):
    +meta: {<dictionary>}
```
</File>

<File name='models/exposures.yml'>

```yml

exposures:
  - name: exposure_name
    config:
      meta: {<dictionary>} # changed to config in v1.10

```

</File>

</TabItem>

<TabItem value="semantic models">
<VersionBlock lastVersion="1.11">

Configure `meta` in your [semantic models](/docs/build/semantic-models) YAML file or under the `semantic-models` config block in the `dbt_project.yml` file. 


<File name='dbt_project.yml'>

```yml
semantic-models:
  [<resource-path>](/reference/resource-configs/resource-path):
    +meta: {<dictionary>}
```
</File>


<File name='models/semantic_models.yml'>

```yml
semantic_models:
  - name: semantic_model_name
    config:
      meta: {<dictionary>}

```
</File>
</VersionBlock>

<VersionBlock firstVersion="1.12">

Configure `meta` in the [semantic models](/docs/build/semantic-models) embedded within your model YAML file or under the `semantic-models` config block in the `dbt_project.yml` file. 


<File name='dbt_project.yml'>

```yml
semantic-models:
  [<resource-path>](/reference/resource-configs/resource-path):
    +meta: {<dictionary>}
```
</File>

<File name='models/file_name.yml'>

```yml
models:
  - name: model_name
    semantic_model:
      enabled: true
      config:
        meta: {<dictionary>}

```
</File>
</VersionBlock>

<VersionBlock lastVersion="1.11">

[Dimensions](/docs/build/dimensions), [entities](/docs/build/entities), and [measures](/docs/build/measures) can also have their own `meta` configurations.

<File name='models/semantic_models.yml'>

```yml
semantic_models:
  - name: semantic_model_name
    config:
      meta: {<dictionary>}

    dimensions:
      - name: dimension_name
        config:
          meta: {<dictionary>}

    entities:
      - name: entity_name
        config:
          meta: {<dictionary>}

    measures:
      - name: measure_name
        config:
          meta: {<dictionary>}

```

</File>
</VersionBlock>

<VersionBlock firstVersion="1.12">

[Dimensions](/docs/build/dimensions), [entities](/docs/build/entities), and metrics can also have their own `meta` configurations.

<File name='models/file_name.yml'>

```yml
models:
  - name: model_name
    semantic_model:
      enabled: true
      config:
        meta: {<dictionary>}

    agg_time_dimension: your_time_dimension_name

    columns:
      - name: entity_column_name
        entity:
          type: primary
          name: entity_name
          config:
            meta: {<dictionary>}

      - name: dimension_column_name
        dimension:
          type: categorical
          name: dimension_name
          config:
            meta: {<dictionary>}

    metrics:
      - name: simple_metric_name
        description: "Description of the metric"
        type: simple
        agg: sum  
        expr: column_name 
        config:
          meta: {<dictionary>}
```

</File>
</VersionBlock>

The `meta` config can be defined:
- Under the `semantic-models` config in the properties file (as showin in previous `models/semantic_models.yml` example) 
- Under the `semantic-models` config in the project file (`dbt_project.yml`). See [configs and properties](/reference/configs-and-properties) for details.

</TabItem>

<TabItem value="metrics">

<File name='dbt_project.yml'>

```yml
metrics:
  [<resource-path>](/reference/resource-configs/resource-path):
    +meta: {<dictionary>}
```
</File>

<VersionBlock lastVersion="1.11">
<File name='models/metrics.yml'>

```yml
metrics:
  - name: number_of_people
    label: "Number of people"
    description: Total count of people
    type: simple
    type_params:
      measure: people
    config:
      meta:
        my_meta_config: 'config_value'
```

</File>
</VersionBlock>

<VersionBlock firstVersion="1.12">
<File name='models/file_name.yml'>

```yml
models:
  - name: model_name 
    semantic_model:
      enabled: true
    agg_time_dimension: your_time_dimension
    columns:
      - name: column_name
        dimension:
          type: time
        granularity: day
    metrics:
      - name: number_of_people
        type: simple
        description: Total count of people
        agg: count
        expr: people
        config:
          meta:
            my_meta_config: 'config_value'
```

</File>
</VersionBlock>

</TabItem>

<TabItem value="saved queries">

<File name='dbt_project.yml'>

```yml
saved-queries:
  [<resource-path>](/reference/resource-configs/resource-path):
    +meta: {<dictionary>}
```
</File>

<File name='models/semantic_models.yml'>

```yml
saved_queries:
  - name: saved_query_name
    config:
      meta: {<dictionary>}
```

</File>
</TabItem>
</Tabs>

## Definition
The `meta` config sets metadata for a resource and accepts any key-value pairs. This metadata is compiled into the `manifest.json` file generated by dbt, and is visible in the auto-generated documentation.

Depending on the resource you're configuring, `meta` may be available within the `config` property, and/or as a top-level key. (For backwards compatibility, `meta` is often (but not always) supported as a top-level key, though without the capabilities of config inheritance.)


## Examples
To demonstrate how to use the `meta` config, here are some examples:

<!-- no toc -->
  - [Designate a model owner](#designate-a-model-owner)
  - [Designate a source column as containing PII](#designate-a-source-column-as-containing-pii)
  - [Configure one meta attribute for all seeds](#configure-one-meta-attribute-for-all-seeds)
  - [Override one meta attribute for a single model](#override-one-meta-attribute-for-a-single-model)
  - [Assign owner and favorite\_color in the dbt\_project.yml as a config property](#assign-owner-and-favorite_color-in-the-dbt_projectyml-as-a-config-property)
  - [Assign meta to semantic model](#assign-meta-to-semantic-model)
  - [Assign meta to dimensions, measures, entities](#assign-meta-to-dimensions-measures-entities)
  - [Add meta to generic and singular data tests](#add-meta-to-generic-and-singular-data-tests)
  - [Access meta values in Python models](#access-meta-values-in-python-models)


### Designate a model owner
Additionally, indicate the maturity of a model using a `model_maturity:` key.

<File name='models/schema.yml'>

```yml

models:
  - name: users
    config:
      meta:
        owner: "@alice"
        model_maturity: in dev

```

</File>


### Designate a source column as containing PII

<File name='models/schema.yml'>

```yml

sources:
  - name: salesforce
    tables:
      - name: account
        config:
          meta:
            contains_pii: true
        columns:
          - name: email
            config:
              meta: # changed to config in v1.10 and backported to 1.9
                contains_pii: true

```

</File>

### Configure one meta attribute for all seeds

<File name='dbt_project.yml'>

```yml
seeds:
  +meta:
    favorite_color: red
```

</File>

### Override one meta attribute for a single model

<File name='models/my_model.sql'>

```sql
{{ config(meta = {
    'single_key': 'override'
}) }}

select 1 as id
```

</File><br />

### Assign owner and favorite_color in the dbt_project.yml as a config property

<File name='dbt_project.yml'>

```yml
models:
  jaffle_shop:
    +meta:
      owner: "@alice"
      favorite_color: red
```

</File>

### Assign meta to semantic model

<VersionBlock lastVersion="1.11">

The following example shows how to assign a `meta` value to a [semantic model](/docs/build/semantic-models) in the `semantic_model.yml` file and  `dbt_project.yml` file:

<Tabs>
<TabItem value="semantic_model" label="Semantic model">

```yaml
semantic_models:
  - name: transaction 
    model: ref('fact_transactions')
    description: "Transaction fact table at the transaction level. This table contains one row per transaction and includes the transaction timestamp."
    defaults:
      agg_time_dimension: transaction_date
    config:
      meta:
        data_owner: "Finance team"
        used_in_reporting: true
```

</TabItem>

<TabItem value="project.yml" label="dbt_project.yml">

```yaml
semantic-models:
  jaffle_shop:
    +meta:
      used_in_reporting: true
```
</TabItem>
</Tabs>
</VersionBlock>


<VersionBlock firstVersion="1.12">

The following example shows how to assign a `meta` value to a [semantic model](/docs/build/semantic-models) in the model YAML file and  `dbt_project.yml` file:

<Tabs>
<TabItem value="semantic_model" label="Semantic model">

```yaml
models:
  - name: fact_transactions
    description: "Transaction fact table at the transaction level. This table contains one row per transaction and includes the transaction timestamp."
    semantic_model:
      enabled: true
      name: transaction
      config:
        meta:
          data_owner: "Finance team"
          used_in_reporting: true

    agg_time_dimension: transaction_date
```

</TabItem>

<TabItem value="project.yml" label="dbt_project.yml">

```yaml
semantic-models:
  jaffle_shop:
    +meta:
      used_in_reporting: true
```
</TabItem>
</Tabs>
</VersionBlock>

### Assign meta to dimensions, measures, entities

<VersionBlock lastVersion="1.11">

<Tabs>
<TabItem value="semantic_model" label="Semantic model">

The following example shows how to assign a `meta` value to a [dimension](/docs/build/dimensions), [entity](/docs/build/entities), and [measure](/docs/build/measures) in a semantic model:

<File name='semantic_model.yml'>

```yml
semantic_models:
  - name: semantic_model
    ...
    dimensions:
      - name: order_date
        type: time
        config:
          meta:
            data_owner: "Finance team"
            used_in_reporting: true
    entities:
      - name: customer_id
        type: primary
        config:
          meta:
            description: "Unique identifier for customers"
            data_owner: "Sales team"
            used_in_reporting: false
    measures:
      - name: count_of_users
        expr: user_id
        config:
          meta:
            used_in_reporting: true
```

</File>
</TabItem>

<TabItem value="project.yml" label="dbt_project.yml">

This second example shows how to assign a `data_owner` and additional metadata value to a dimension in the `dbt_project.yml` file using the `+meta` syntax. The similar syntax can be used for entities and measures.

<File name='dbt_project.yml'>

```yml
semantic-models:
  jaffle_shop:
    ...
    [dimensions](/docs/build/dimensions):
      - name: order_date
        config:
          meta:
            data_owner: "Finance team"
            used_in_reporting: true
```


</File>
</TabItem>
</Tabs>
</VersionBlock>

<VersionBlock firstVersion="1.12">

<Tabs>
<TabItem value="semantic_model" label="Semantic model">

The following example shows how to assign a `meta` value to a [dimension](/docs/build/dimensions), [entity](/docs/build/entities), and [simple metrics](/docs/build/simple) in a semantic model:

<File name='model_name.yml'>

```yml
models:
  - name: model_name
    semantic_model:
      enabled: true
      name: semantic_model

    agg_time_dimension: order_date

    columns:
      - name: order_date
        dimension:
          type: time
          config:
            meta:
              data_owner: "Finance team"
              used_in_reporting: true

      - name: customer_id
        entity:
          type: primary
          config:
            meta:
              description: "Unique identifier for customers"
              data_owner: "Sales team"
              used_in_reporting: false

    metrics:
      - name: count_of_users
        type: simple
        agg: count_distinct
        expr: user_id
        config:
          meta:
            used_in_reporting: true
```

</File>
</TabItem>

<TabItem value="project.yml" label="dbt_project.yml">

This second example shows how to assign a `data_owner` and additional metadata value to a dimension in the `dbt_project.yml` file using the `+meta` syntax. The similar syntax can be used for entities and simple metrics.

<File name='dbt_project.yml'>

```yml
semantic-models:
  jaffle_shop:
    ...
    [dimensions](/docs/build/dimensions):
      - name: order_date
        config:
          meta:
            data_owner: "Finance team"
            used_in_reporting: true
```


</File>
</TabItem>
</Tabs>
</VersionBlock>

### Add meta to generic and singular data tests

The following examples show how to add `meta` to [generic data tests](/docs/build/data-tests#generic-data-tests) in a `properties.yml` file, and to [singular data tests](/docs/build/data-tests#singular-data-tests) using `config()`. You can also set defaults in `dbt_project.yml` or `tests/properties.yml`.

<Tabs>
<TabItem value="generic" label="Generic data test">

<File name='models/properties.yml'>

```yaml
models:
  - name: orders
    columns:
      - name: order_id
        data_tests:
          - not_null:
              config:
                meta:
                  owner: "@data_team"
```

</File>

</TabItem>

<TabItem value="singular" label="Singular data test">

<File name='tests/assert_order_ids.sql'>

```sql
{{ config(meta={'owner': '@data_team'}) }}

select *
from {{ ref('orders') }}
where order_id is null
```

</File>

</TabItem>
</Tabs>

### Access meta values in Python models

To access custom `meta` values in [Python models](/docs/build/python-models), use the `dbt.config.meta_get()` method.

For example, if you have a model named `my_python_model` and you want to store custom values, you can do the following:

<File name='models/schema.yml'>

```yml
models:
  - name: my_python_model
    config:
      meta:
        batch_size: 1000
        processing_mode: "incremental"
```

</File>

<File name='models/my_python_model.py'>

```python
def model(dbt, session):
    # Access custom values stored in meta directly
    batch_size = dbt.config.meta_get("batch_size")
    processing_mode = dbt.config.meta_get("processing_mode")
    
    # Use the meta values in your model logic
    df = dbt.ref("upstream_model")
    
    if processing_mode == "incremental":
        df = df.limit(batch_size)
    
    return df
```

</File>
