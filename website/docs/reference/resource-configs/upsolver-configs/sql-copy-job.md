---
title: "SQL copy job"
sidebar_label: "SQL copy job"
description: "Define an Upsolver COPY FROM job as an incremental dbt model to load data from a source into a staging table."
---

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

Running this model will  compile CREATE TABLE SQL for target type Data lake (or ALTER TABLE if exists) and CREATE COPY JOB(or ALTER COPY JOB if exists) SQL and send it to Upsolver engine. Name of the table will be name of the model. Name of the job will be name of the model plus '_job'
