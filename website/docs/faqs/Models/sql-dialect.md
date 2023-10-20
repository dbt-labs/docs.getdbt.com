---
title: Which SQL dialect should I write my models in? Or which SQL dialect does dbt use?
description: "Use SQL dialect of your own database"
sidebar_label: 'Which SQL dialect to use?'
id: sql-dialect
---

dbt can feel like magic, but it isn't actually magic. Under the hood, it's running SQL in your own warehouse — your data is not processed outside of your warehouse.

As such, your models should just use the **SQL dialect of your own database**. Then, when dbt wraps your `select` statements in the appropriate <Term id="ddl" /> or <Term id="dml" />, it will use the correct DML for your warehouse — all of this logic is written in to dbt.

You can find more information about the databases, platforms, and query engines that dbt supports in the [Supported Data Platforms](/docs/supported-data-platforms) docs.

Want to go a little deeper on how this works? Consider a snippet of SQL that works on each warehouse:

<File name='models/test_model.sql'>

```sql
select 1 as my_column

```

</File>

To replace an existing <Term id="table" />, here's an _illustrative_ example of the SQL dbt will run on different warehouses (the actual SQL can get much more complicated than this!)

<Tabs
  defaultValue="redshift"
  values={[
    {label: 'Redshift', value: 'redshift'},
    {label: 'BigQuery', value: 'bigquery'},
    {label: 'Snowflake', value: 'snowflake'},
  ]}>
  <TabItem value="redshift">

```sql
-- you can't create or replace on redshift, so use a transaction to do this in an atomic way

begin;

create table "dbt_alice"."test_model__dbt_tmp" as (
    select 1 as my_column
);

alter table "dbt_alice"."test_model" rename to "test_model__dbt_backup";

alter table "dbt_alice"."test_model__dbt_tmp" rename to "test_model"

commit;

begin;

drop table if exists "dbt_alice"."test_model__dbt_backup" cascade;

commit;
```

  </TabItem>

  <TabItem value="bigquery">

```sql

-- Make an API call to create a dataset (no DDL interface for this)!!;

create or replace table `dbt-dev-87681`.`dbt_alice`.`test_model` as (
  select 1 as my_column
);
```

  </TabItem>

  <TabItem value="snowflake">

```sql
create schema if not exists analytics.dbt_alice;

create or replace table analytics.dbt_alice.test_model as (
    select 1 as my_column
);
```

  </TabItem>
</Tabs>
