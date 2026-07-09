---
title: "SQL materialized views"
sidebar_label: "Materialized views"
description: "Create an Upsolver materialized view as a dbt model to join data across multiple source tables."
---

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
