---
title: "Amazon Redshift and Apache Iceberg"
id: redshift-iceberg-support
sidebar_label: "Redshift Iceberg support"
description: Create Apache Iceberg tables in Amazon Redshift with dbt v2, registered in the AWS Glue Data Catalog and stored in Amazon S3.
availability:
  engine: v2
---

import BaseLocationEnvIsolation from '/snippets/_base-location-env-isolation-warning.md';

<VersionBlock lastVersion="1.99">

Iceberg tables on Amazon Redshift are available only in <Constant name="fusion_engine" />. Select v2 in the version menu to view this page.

</VersionBlock>

<VersionBlock firstVersion="2.0">

In <Constant name="fusion_engine" />, you can materialize Redshift models as Apache Iceberg tables. Redshift writes each table's data and metadata files to Amazon S3 and registers the table in the AWS Glue Data Catalog, so other Glue-connected engines, such as Amazon Athena and Amazon EMR, can read it.

There are two ways to configure it:

- Simplest: Set `table_format='iceberg'` and `external_volume` in the model config.
- Extensible: Define a `glue` catalog in `catalogs.yml` and set `catalog_name` on your models.

## Supported materializations

- [Table](/docs/build/materializations#table)
- [Incremental](/docs/build/materializations#incremental), with the `append` strategy

## Prerequisites

<!-- TODO (release check V4): replace DBT_FUSION_MIN_VERSION, REDSHIFT_MIN_VERSION, and the AWS documentation references below before publishing. -->

- <Constant name="fusion" /> version `DBT_FUSION_MIN_VERSION` or later. Earlier versions ignore `table_format='iceberg'` on Redshift and build a regular Redshift table.
- Amazon Redshift version `REDSHIFT_MIN_VERSION` or later.
- An S3 bucket for table data, and an IAM role that lets Redshift write to the bucket and to the AWS Glue Data Catalog. Refer to the AWS documentation for writing to Apache Iceberg tables in Amazon Redshift.
- An external schema, backed by the AWS Glue Data Catalog, for every schema your Iceberg models resolve to.

### Create the external schema

dbt doesn't create external schemas, and it builds an Iceberg model only in an external schema. With dbt's default [schema naming](/docs/build/custom-schemas), a model with `schema='iceberg_analytics'` in a target whose schema is `dbt_jane` resolves to `dbt_jane_iceberg_analytics`. Create that external schema once per target, each mapped to its own Glue database:

```sql
create external schema dbt_jane_iceberg_analytics
from data catalog
database 'dbt_jane_iceberg_analytics'
iam_role 'arn:aws:iam::ACCOUNT_ID:role/ROLE_NAME';
```

Do the same for every other target, such as `prod_iceberg_analytics` for a production target with schema `prod`. Two external schemas that point to the same Glue database share the same tables, so map each environment to its own Glue database.

If the resolved schema isn't an external schema, dbt stops before running any SQL:

```
dbt_jane_iceberg_analytics is not an external (Glue-backed) schema; create it with CREATE EXTERNAL SCHEMA ... FROM DATA CATALOG before running Iceberg models
```

All the examples on this page use this setup.

## Configure Iceberg tables

### Simplest: model config

<File name="models/orders.sql">

```sql
{{ config(
    materialized='table',
    table_format='iceberg',
    external_volume='s3://BUCKET',
    schema='iceberg_analytics'
) }}

select order_id, customer_id, ordered_at, status
from {{ ref('stg_orders') }}
```

</File>

To apply these configs to a whole folder, set them in `dbt_project.yml` (refer to [model configs](/reference/model-configs)).

`dbt run -s orders` creates the table with:

```sql
create table "analytics"."dbt_jane_iceberg_analytics"."orders"
  using iceberg location 's3://BUCKET/_dbt/dbt_jane_iceberg_analytics/orders'
  as (select order_id, customer_id, ordered_at, status from "analytics"."dbt_jane"."stg_orders")
```

### Extensible: `catalogs.yml`

In <Constant name="fusion_engine" />, `catalogs.yml` uses the [new spec](/docs/build/iceberg/catalogs-yml#new-spec-recommended-) by default. Redshift doesn't support the old spec.

<File name="catalogs.yml">

```yaml
catalogs:
  - name: glue_iceberg
    type: glue
    table_format: iceberg
    config:
      redshift:
        external_volume: s3://BUCKET
```

</File>

<File name="models/orders.sql">

```sql
{{ config(
    materialized='table',
    catalog_name='glue_iceberg',
    schema='iceberg_analytics'
) }}

select order_id, customer_id, ordered_at, status
from {{ ref('stg_orders') }}
```

</File>

This model lands at the same location as the previous example. The `redshift` block accepts `external_volume` (required) and `base_location_root`. `base_location_subpath` can be set only on the model. A model can override `external_volume` and `base_location_root`.

### Storage location

dbt gives every Iceberg table its own S3 location:

```
{external_volume}/{base_location_root}/{schema}/{identifier}/{base_location_subpath}
```

- `base_location_root` defaults to `_dbt`.
- `schema` is the resolved schema, such as `dbt_jane_iceberg_analytics`.
- `identifier` is the model's [`alias`](/reference/resource-configs/alias), or its name when it has no alias.
- `base_location_subpath` is optional and can be set only in the model config.

<BaseLocationEnvIsolation />

### Data types

Redshift writes Iceberg data types, which differ from Redshift's own (refer to the AWS documentation for the data types that Iceberg tables in Amazon Redshift support). When dbt creates a table, Redshift rejects some column types:

| Type in your model's SQL | What happens | What to do |
| --- | --- | --- |
| `smallint` | Fails: `Unsupported data type "smallint"` | Cast to `integer` |
| `char(n)` | Fails: `CHAR type is not supported` | Cast to `varchar` |

If an upstream model or source has these types, list and cast the columns instead of using `select *`:

```sql
select order_id, store_id::integer as store_id, status::varchar as status
from {{ ref('stg_orders') }}
```

When `on_schema_change` adds a column to an existing table, dbt does this for you: it adds `smallint` columns as `integer`, and `char(n)` and `varchar(n)` columns as `varchar`.

### Partitioning

Set `partition_by` to an Iceberg partition transform, or a list of them. dbt passes them to Redshift as written.

```sql
{{ config(
    materialized='table',
    catalog_name='glue_iceberg',
    schema='iceberg_analytics',
    partition_by=['month(ordered_at)', 'status']
) }}
```

<!-- TODO (release check V2): confirm that create or replace applies a changed partition_by. If it doesn't, replace the next paragraph's last sentence with "drop the table and its files, then run the model again" and link to the cleanup steps. -->

The partition spec is set when dbt creates or replaces the table. Incremental runs append rows without changing it, so after you change `partition_by` on an incremental model, rebuild it with `--full-refresh`.

<!-- TODO (release check V1): if bucket and truncate widths are still ignored on the GA build, add "Redshift currently ignores the width in `bucket(N, column)` and `truncate(N, column)`." Otherwise, bucket(16, customer_id) can go in the example. -->

## Incremental models

Iceberg incremental models support only the `append` strategy:

- First run: dbt creates the table, as for a `table` model.
- Later runs: dbt loads the new rows into a temporary table, then inserts them into the Iceberg table.
- `--full-refresh`: dbt rebuilds the table with `create or replace table`.

<File name="models/orders_incremental.sql">

```sql
{{ config(
    materialized='incremental',
    catalog_name='glue_iceberg',
    schema='iceberg_analytics',
    on_schema_change='append_new_columns'
) }}

select order_id, customer_id, ordered_at, status
from {{ ref('stg_orders') }}
{% if is_incremental() %}
where ordered_at > (select max(ordered_at) from {{ this }})
{% endif %}
```

</File>

| `on_schema_change` | Behavior on an Iceberg table |
| --- | --- |
| `ignore` (default) | Doesn't change the table. |
| `fail` | Fails if columns were added or removed. |
| `append_new_columns` | Adds new columns. |
| `sync_all_columns` | Adds new columns. Fails instead of dropping columns, because Redshift doesn't expose the partition spec that dbt needs to drop them safely. |

In every mode except `ignore`, dbt fails if a column's data type changed. Change the type by hand, or rebuild the table.

## Limitations

- Views can't be Iceberg. To select from an Iceberg table in a view, make it a [late binding view](/reference/resource-configs/redshift-configs#late-binding-views) (`bind=False`).
- Incremental models support only the `append` strategy.
- Not supported for Iceberg models: [enforced contracts](/reference/resource-configs/contract), and seeds or snapshots that write into an Iceberg table.
- Redshift rejects `GRANT` and `COMMENT` on Iceberg tables, so dbt skips [`grants`](/reference/resource-configs/grants) and [`persist_docs`](/reference/resource-configs/persist_docs) with a warning. It also ignores `dist`, `sort`, and `backup`.
- Some column types aren't supported when dbt creates a table (refer to [Data types](#data-types)).
- Iceberg models must be in the database you connect to.
- Hooks on Iceberg models must not open a transaction (`begin`). Redshift doesn't allow Iceberg DDL inside a transaction block.

</VersionBlock>
