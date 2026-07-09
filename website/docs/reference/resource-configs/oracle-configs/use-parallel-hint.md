---
title: "Use parallel hint"
sidebar_label: "Parallel hint"
description: "Specify the number of parallel executions for table materializations in Oracle."
---

<VersionBlock firstVersion="1.3.2">

Table materialization supports specifying the number of parallel executions as shown below

```sql
-- Create a dbt model using 4 parallel executions
{{config(materialized='table', parallel=4}}
SELECT c.cust_id, c.cust_first_name, c.cust_last_name
from {{ source('sh_database', 'customers') }} c
```

</VersionBlock>
