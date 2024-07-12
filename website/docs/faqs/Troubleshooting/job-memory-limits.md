---
title: "I'm receiving a 'This run exceeded your account's run memory limits' error in my failed job"
description: "Use incremental models or optimize queries for job failures due to exceeded memory limits."
sidebar_label: 'Job failures due to exceeded memory limits'
---

If you're receiving a `This run exceeded your account's run memory limits` error in your failed job, it means that the job exceeded the memory limits set for your account. Memory limits are on a per run basis and are typically influenced by the amount of result data that dbt has to ingest and process, which typically is quite small but can be bloated unexpectedly by project design choices.

Some common reasons for higher memory usage are:
- dbt run/build command:  Macros that capture large result sets from run query. These may not all be necessary and may be memory inefficient.
- dbt docs generate command: Source or model schemas with large numbers of tables (even if those tables aren't all used by dbt) cause the ingest of very large results for catalog queries.

To resolve this, you can try the following:

1. **Use incremental models**: Try using [incremental models](/docs/build/incremental-models-overview) to reduce the amount of data being processed in each run. Incremental models only process new or updated data, which can help reduce the memory usage of your jobs.
2. **Refactor your data model**: Review your data model to see if there are any opportunities to optimize or refactor them. For example, you can try to reduce the number of columns being selected, use `where` clauses to filter data early in the query, or use `limit` clauses to reduce the amount of data being processed.

If you've tried the earlier suggestions and are still experiencing failed job runs with this error about hitting the memory limits of your account, please [reach out to support](mailto:support@getdbt.com) and we can try increasing your account's memory. We're happy to help!
