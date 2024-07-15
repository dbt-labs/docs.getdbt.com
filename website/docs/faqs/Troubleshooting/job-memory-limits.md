---
title: "I'm receiving a 'This run exceeded your account's run memory limits' error in my failed job"
description: "Use incremental models or optimize queries for job failures due to exceeded memory limits."
sidebar_label: 'Job failures due to exceeded memory limits'
---

If you're receiving a `This run exceeded your account's run memory limits` error in your failed job, it means that the job exceeded the [memory limits](/docs/deploy/job-scheduler#job-memory) set for your account. All dbt Cloud accounts have a pod memory of 600Mib and memory limits are on a per run basis. They're typically influenced by the amount of result data that dbt has to ingest and process, which is small but can become bloated unexpectedly by project design choices.

## Common reasons

Some common reasons for higher memory usage are:

- dbt run/build:  Macros that capture large result sets from run query may not all be necessary and may be memory inefficient.
- dbt docs generate: Source or model schemas with large numbers of tables (even if those tables aren't all used by dbt) cause the ingest of very large results for catalog queries.

## Resolution

Try the following to resolve this:

1. **Use incremental models**: Try using [incremental models](/docs/build/incremental-models-overview) to reduce the amount of data being processed in each run. Incremental models only process new or updated data, which can help reduce the memory usage of your jobs.
2. **Refactor your data model**: Review your data models to see if there are any opportunities to optimize or refactor them. For example, you can try to reduce the number of columns being selected, use `where` clauses to filter data early in the query or use `limit` clauses to reduce the amount of data being processed.

If you've tried the earlier suggestions and are still experiencing failed job runs with this error about hitting the memory limits of your account, please [reach out to support](mailto:support@getdbt.com) and we can try increasing your account's memory. We're happy to help!

## Additional resources
- [Blog post on how we shaved 90 mins off](https://docs.getdbt.com/blog/how-we-shaved-90-minutes-off-model)
