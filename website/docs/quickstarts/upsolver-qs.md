---
title: "Quickstart for dbt Core and Upsolver"
id: "upsolver"
platform: 'dbt-core'
icon: 'upsolver'
hide_table_of_contents: true
---

## What is Upsolver

[Upsolver](https://upsolver.com) enables you to use familiar SQL syntax to quickly build and deploy data pipelines, powered by a stream processing engine designed for cloud data lakes. Upsolver has own UI with SQL console allowing to execute commands and monitor pipelines in the UI. It also includes free trial and access to variety of examples and tutorials.

## Installation

### Install dbt-upsolver adapter

```sh
 pip install  dbt-upsolver
```

### Make sure the adapter is installed

```sh
dbt --version
```

### Expected result

```sh
Core:
  - installed: <version>
  - latest:    <version>
Plugins:
  - upsolver: <version>
```

## Upsolver account, API token, datsabase, schema

For registeration navigate to [SQL Lake Sign Up form](https://sqlake.upsolver.com/signup). You'll have access to SQL workbench with examples and tutorials after completing the registration.

### Create API token

After login navigate to "[Settings](https://sqlake.upsolver.com/Settings)" and then to "[API Tokens](https://sqlake.upsolver.com/Settings/api-tokens)"

You will need API token and API Url to access Upsolver programatically.

![API Tokens screen](https://github.com/Upsolver/upsolver-sdk-python/raw/build_package/doc/img/APITokens-m.png)

Then click "Generate" new token and save it for future use.

### Get your user name, database and schema

- For **user name** navigate to **Settings** -> **User details** and copy user name
- For **database** and **schema** navigate to **Worksheets** and click **New**.
- You will find **database name** and **schema(catalog) name** under **Entities panel**

## dbt-upsolver project

```sh
dbt init <project_name>
```

Prompt:

Which database would you like to use?
[1] upsolver

```sh
Enter a number:
api_url (your api_url): https://mt-api-prod.upsolver.com
token (your token): <token>
user (dev username): <username>
database (default database): <database>
schema (default schema): <schema>
threads (1 or more) [1]: <number>
```

### profiles.yml

- On mac `profiles.yml` location usually is `/Users/<user>/.dbt/profiles.yml`
- On Linux `/home/<user>/.dbt/profiles.yml`

```yml
project_name:
  target: dev
  outputs:
    dev:
      api_url: https://mt-api-prod.upsolver.com
      database: ...
      schema: ...
      threads: 1
      token: ...
      type: upsolver
      user: ...
```

### Check connection

```sh
dbt debug
```

## Supported Commands

### Supported dbt commands

| COMMAND | STATE |
| ------ | ------ |
| docs| not supported |
| source | not supported |
| init | supported |
| clean | supported |
| debug | supported |
| deps | supported |
| list| not supported |
| ls | not supported |
| build | supported |
| snapshot | not supported |
| run | supported |
| compile | supported |
| parse | supported |
| test | not supported |
| seed | not supported |
| run-operation | supported |

### Supported Upsolver functionality

| COMMAND | STATE | MATERIALIZED |
| ------ | ------ | ------ |
| SQL compute cluster| not supported | - |
| SQL connections| supported | connection |
| SQL copy job | supported | incremental |
| SQL merge job | supported | incremental |
| SQL insert job | supported | incremental |
| SQL materialized views | supported | materializedview |

## SQL connections

Connections are used to provide Upsolver with the proper credentials to bring your data into SQLake as well as to write out your transformed data to various services. More details on ["Upsolver SQL connections"](https://docs.upsolver.com/sqlake/sql-command-reference/sql-connections)
As a dbt model connection is a model with materialized='connection'

```sql
{{ config(
        materialized='connection',
        connection_type={ 'S3' | 'GLUE_CATALOG' | 'KINESIS' | 'KAFKA'| 'SNOWFLAKE' },
        connection_options={}
        )
}}
```

Running this model will compile CREATE CONNECTION(or ALTER CONNECTION if exists) SQL and send it to Upsolver engine. Name of the connection will be name of the model.

## SQL copy job

A COPY FROM job allows you to copy your data from a given source into a table created in a metastore connection. This table then serves as your staging table and can be used with SQLake transformation jobs to write to various target locations. More details on ["Upsolver SQL copy-from"](https://docs.upsolver.com/sqlake/sql-command-reference/sql-jobs/create-job/copy-from)

As a dbt model copy job is model with materialized='incremental'

```sql
{{ config(  materialized='incremental',
            sync=True|False,
            source = 'S3'| 'KAFKA' | ... ,
            options={
                'option_name': 'option_value'
            },
            partition_by=[{}]
        )
}}
SELECT * FROM {{ ref(<model>) }}
```

Running this model will  compile CREATE TABLE SQL(or ALTER TABLE if exists) and CREATE COPY JOB(or ALTER COPY JOB if exists) SQL and send it to Upsolver engine. Name of the table will be name of the model. Name of the job will be name of the model plus '_job'

## SQL insert job

An INSERT job defines a query that pulls in a set of data based on the given SELECT statement and inserts it into the designated target. This query is then run periodically based on the RUN_INTERVAL defined within the job. More details on ["Upsolver SQL insert"](https://docs.upsolver.com/sqlake/sql-command-reference/sql-jobs/create-job/sql-transformation-jobs/insert).

As a dbt model insert job is model with materialized='incremental' and incremental_strategy='insert'

```sql
{{ config(  materialized='incremental',
            sync=True|False,
            map_columns_by_name=True|False,
            incremental_strategy='insert',
            options={
              	'option_name': 'option_value'
            },
            primary_key=[{}]
          )
}}
SELECT ...
FROM {{ ref(<model>) }}
WHERE ...
GROUP BY ...
HAVING COUNT(DISTINCT orderid::string) ...
```

Running this model will compile CREATE TABLE SQL(or ALTER TABLE if exists) and CREATE INSERT JOB(or ALTER INSERT JOB if exists) SQL and send it to Upsolver engine. Name of the table will be name of the model. Name of the job will be name of the model plus '_job'

## SQL merge job

A MERGE job defines a query that pulls in a set of data based on the given SELECT statement and inserts into, replaces, or deletes the data from the designated target based on the job definition. This query is then run periodically based on the RUN_INTERVAL defined within the job. More details on ["Upsolver SQL merge"](https://docs.upsolver.com/sqlake/sql-command-reference/sql-jobs/create-job/sql-transformation-jobs/merge).

As a dbt model merge job is model with materialized='incremental' and incremental_strategy='merge'

```sql
{{ config(  materialized='incremental',
            sync=True|False,
            map_columns_by_name=True|False,
            incremental_strategy='merge',
            options={
              	'option_name': 'option_value'
            },
            primary_key=[{}]
          )
}}
SELECT ...
FROM {{ ref(<model>) }}
WHERE ...
GROUP BY ...
HAVING COUNT ...
```

Running this model will compile CREATE TABLE SQL(or ALTER TABLE if exists) and CREATE MERGE JOB(or ALTER MERGE JOB if exists) SQL and send it to Upsolver engine. Name of the table will be name of the model. Name of the job will be name of the model plus '_job'

## SQL materialized views

When transforming your data, you may find that you need data from multiple source tables in order to achieve your desired result.
In such a case, you can create a materialized view from one SQLake table in order to join it with your other table (which in this case is considered the main table). More details on ["Upsolver SQL materialized views"](https://docs.upsolver.com/sqlake/sql-command-reference/sql-jobs/create-job/sql-transformation-jobs/sql-materialized-views).

As a dbt model materialized views  is model with materialized='materializedview'.

```sql
{{ config(  materialized='materializedview',
            sync=True|False,
            options={'option_name': 'option_value'}
        )
}}
SELECT ...
FROM {{ ref(<model>) }}
WHERE ...
GROUP BY ...
```

Running this model will compile CREATE MATERIALIZED VIEW SQL(or ALTER MATERIALIZED VIEW if exists) and send it to Upsolver engine. Name of the materializedview  will be name of the model.

## Projects examples

> projects examples link: [github.com/dbt-upsolver/examples/](https://github.com/Upsolver/dbt-upsolver/tree/main/examples)
