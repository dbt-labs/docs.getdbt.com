---
title: "I'm receiving a 'This run exceeded your account's run memory limits' error in my failed job"
description: "Use incremental models or optimize queries for job failures due to exceeded memory limits."
sidebar_label: 'Job failures due to exceeded memory limits'
---

If you're receiving a `This run exceeded your account's run memory limits` error in your failed job, it means that the job exceeded the memory limits set for your account. To resolve this, you can try the following:

1. **Use incremental models**: Try using incremental models to reduce the amount of data being processed in each run. Incremental models only process new or updated data, which can help reduce the memory usage of your jobs.
2. **Refactor your data model**: Review your data model to see if there are any opportunities to optimize or refactor them. For example, you can try to reduce the number of columns being selected, use `where` clauses to filter data early in the query, or use `limit` clauses to reduce the amount of data being processed.

If you've tried the earlier suggestions and are still experiencing failed job runs with this error about hitting the memory limits of your account, please [reach out to support](mailto:support@getdbt.com) and we'll be happy to help!
