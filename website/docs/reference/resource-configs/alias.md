---
resource_types: [models, seeds, snapshots, tests]
description: "Aliasing a resource lets you give it a custom name in the database instead of using the filename."
datatype: string
---


<Tabs>
<TabItem value="model" label="Models">

Specify a custom alias for a model in your `dbt_project.yml` file, `models/properties.yml` file, or config block in a SQL file. 

For example, if you have a model that calculates `sales_total` and want to give it a more user-friendly alias, you can alias it as shown in the following examples.

In the `dbt_project.yml` file, the following example sets a default `alias` for the `sales_total` model at the project level:

<File name='dbt_project.yml'>

```yml
models:
  your_project:
    sales_total:
      +alias: sales_dashboard
```
</File>

The following specifies an `alias` as part of the `models/properties.yml` file metadata, useful for centralized configuration:

<File name='models/properties.yml'>

```yml
version: 2

models:
  - name: sales_total
    config:
      alias: sales_dashboard
```
</File>

The following assigns the `alias` directly in the In `models/sales_total.sql` file:

<File name='models/sales_total.sql'>

```sql
{{ config(
    alias="sales_dashboard"
) }}
```
</File>

This would return `analytics.finance.sales_dashboard` in the database, instead of the default `analytics.finance.sales_total`.

</TabItem>

<TabItem value="seeds" label="Seeds">

Configure a seed's alias in your `dbt_project.yml` file or a `properties.yml` file. The following examples demonstrate how to `alias` a seed named `product_categories` to `categories_data`.

In the `dbt_project.yml` file at the project level:

<File name='dbt_project.yml'>

```yml
seeds:
  your_project:
    product_categories:
      +alias: categories_data
```
</File>

In the `seeds/properties.yml` file:

<File name='seeds/properties.yml'>

```yml
version: 2

seeds:
  - name: product_categories
    config:
      alias: categories_data
```
</File>

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
</TabItem>

<TabItem value="snapshot" label="Snapshots">

Configure a snapshots's alias in your `dbt_project.yml` file, `snapshots/snapshot_name.yml` file, or config block. 

The following examples demonstrate how to `alias` a snapshot named `your_snapshot` to `the_best_snapshot`.

In the `dbt_project.yml` file at the project level:

<File name='dbt_project.yml'>

```yml
snapshots:
  your_project:
    your_snapshot:
      +alias: the_best_snapshot
```
</File>

In the `snapshots/snapshot_name.yml` file:

<File name='snapshots/snapshot_name.yml'>

```yml
version: 2

snapshots:
  - name: your_snapshot_name
    config:
      alias: the_best_snapshot
</File>

In `snapshots/your_snapshot.sql` file:

<File name='snapshots/your_snapshot.sql'>

```sql
{{ config(
    alias="the_best_snapshot"
) }}
```
</File>

This would build your snapshot to `analytics.finance.the_best_snapshot` in the database.

</TabItem>

<TabItem value="test" label="Tests">

Configure a data test's alias in your `dbt_project.yml` file, `properties.yml` file, or config block in the model file. 

The following examples demonstrate how to `alias` a unique data test named `order_id` to `unique_order_id_test` to identify a specific data test.

In the `dbt_project.yml` file at the project level:

<File name='dbt_project.yml'>

```yml
tests:
  your_project:
    +alias: unique_order_id_test
```
</File>

In the `models/properties.yml` file:

<File name='models/properties.yml'>

```yml
models:
  - name: orders
    columns:
      - name: order_id
        tests:
          - unique:
              alias: unique_order_id_test
```
</File>

In `tests/unique_order_id_test.sql` file:

<File name='tests/unique_order_id_test.sql'>

```sql
{{ config(
    alias="unique_order_id_test",
    severity="error"
) }}
```
</File>

When using [`store_failures_as`](/reference/resource-configs/store_failures_as), this would return the name `analytics.dbt_test__audit.orders_order_id_unique_order_id_test` in the database.


</TabItem>
</Tabs>

## Definition

Optionally specify a custom alias for a [model](/docs/build/models), [data test](/docs/build/data-tests), [snapshot](/docs/build/snapshots), or [seed](/docs/build/seeds).

When dbt creates a relation (<Term id="table" />/<Term id="view" />) in a database, it creates it as: `{{ database }}.{{ schema }}.{{ identifier }}`, e.g. `analytics.finance.payments`

The standard behavior of dbt is:
* If a custom alias is _not_ specified, the identifier of the relation is the resource name (i.e. the filename).
* If a custom alias is specified, the identifier of the relation is the `{{ alias }}` value.

**Note** With an [ephemeral model](/docs/build/materializations), dbt will always apply the prefix `__dbt__cte__` to the <Term id="cte" /> identifier. This means that if an alias is set on an ephemeral model, then its CTE identifier will be `__dbt__cte__{{ alias }}`, but if no alias is set then its identifier will be `__dbt__cte__{{ filename }}`.

To learn more about changing the way that dbt generates a relation's `identifier`, read [Using Aliases](/docs/build/custom-aliases).

