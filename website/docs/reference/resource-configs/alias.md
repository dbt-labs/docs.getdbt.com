---
resource_types: [models, seeds, snapshots, tests]
description: "Aliasing a resource lets you give it a custom name in the database instead of using the filename."
datatype: string
---


<Tabs>
<TabItem value="model" label="Models">

Specify a custom alias for a model in your `dbt_project.yml` file or config block. 

For example, if you have a model that calculates `sales_total` and want to give it a more user-friendly alias, you can alias it like this:

<File name='dbt_project.yml'>

```yml
models:
  your_project:
    sales_total:
      +alias: sales_dashboard
```
</File>

This would return `analytics.finance.sales_dashboard` in the database, instead of the default `analytics.finance.sales_total`.

</TabItem>

<TabItem value="seeds" label="Seeds">


Configure a seed's alias in your `dbt_project.yml` file or config block. 

For example, if you have a seed that represents `product_categories` and want to alias it as `categories_data`, you would alias like this:

<File name='dbt_project.yml'>

```yml
seeds:
  your_project:
    product_categories:
      +alias: categories_data
```

This would return the name `analytics.finance.categories_data` in the database.

In the following second example, the seed at `seeds/country_codes.csv` will be built as a <Term id="table" /> named `country_mappings`.

<File name='dbt_project.yml'>

```yml
seeds:
  jaffle_shop:
    country_codes:
      +alias: country_mappings

```

</File>

</File>
</TabItem>

<TabItem value="snapshot" label="Snapshots">

Configure a seed's alias in your `dbt_project.yml` file or config block. 

For example, if you have a snapshot that represents `your_snapshot` and want to alias it as `updated_at_id`, you would alias like this:

<File name='dbt_project.yml'>

```yml
snapshots:
  - name: your_snapshot
    config:
      target_database: analytics
      target_schema: finance
      unique_key: id
      strategy: timestamp
      updated_at: updated_at
      alias: your_snapshot
```

This would return the name `analytics.finance.your_snapshot` in the database.

</File>
</TabItem>

<TabItem value="test" label="Tests">

Configure a test's alias in your `schema.yml` file or config block. 

For example, to add a unique test to the `order_id` column and give it an alias `unique_order_id_test` to identify this specific test, you would alias like this:

<File name='schema.yml'>

```yml
models:
  - name: orders
    columns:
      - name: order_id
        tests:
          - unique
            alias: unique_order_id_test
```

When using `--store-failures`, this would return the name `analytics.finance.orders_order_id_unique_order_id_test` in the database.

</File>
</TabItem>
</Tabs>

## Definition

Optionally specify a custom alias for a [model](/docs/build/models), [tests](/docs/build/data-tests), [snapshots](/docs/build/snapshots), or [seed](/docs/build/seeds).

When dbt creates a relation (<Term id="table" />/<Term id="view" />) in a database, it creates it as: `{{ database }}.{{ schema }}.{{ identifier }}`, e.g. `analytics.finance.payments`

The standard behavior of dbt is:
* If a custom alias is _not_ specified, the identifier of the relation is the resource name (i.e. the filename).
* If a custom alias is specified, the identifier of the relation is the `{{ alias }}` value.

To learn more about changing the way that dbt generates a relation's `identifier`, read [Using Aliases](/docs/build/custom-aliases).

