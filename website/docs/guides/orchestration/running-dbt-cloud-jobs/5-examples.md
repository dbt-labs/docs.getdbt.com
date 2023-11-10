---
title: "dbt Cloud job examples"
id: "dbt-cloud-job-examples"
slug: examples
description: Examples of configuring dbt Cloud jobs
displayText: dbt Cloud job examples
hoverSnippet: Examples of configuring dbt Cloud jobs.
---

### Example 1:

This organization has a simple DAG, with a set of models that need to be run every hour, and another set of models that need to be run once per day.

##### Job 1: 

`dbt build -s +tag:hourly`

##### Job 2:

`dbt build -s +tag:daily`

### Example 2:

This organization has a DAG that includes `incremental` models which need to be run on their own cadence separate from `table` and `view` models. They organize their runs according to the SLAs associated with a few key data marts, each of which are defined in separate subfolders within the `models/` directory, as follows:

```
- models
-- marts
--- customer
--- transaction
```

The customer mart models are refreshed once per day, while transaction mart models run hourly.

##### Job 1: Build incremental models

`dbt build -s +config.materialized:incremental`

##### Job 2: Incremental full refresh

`dbt build -s +config.materialized:incremental --full-refresh`

##### Job 2: Build customer_mart models

`dbt build -s +marts.customer --exclude config.materialized:incremental`

##### Job 3: Build transaction_mart models

`dbt build -s +marts.transaction --exclude config.materialized:incremental`

### Example 3: 



#### Job 1: