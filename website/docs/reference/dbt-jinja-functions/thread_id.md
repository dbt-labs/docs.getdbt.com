---
title: "About thread_id"
sidebar_label: "thread_id"
id: "thread_id"
description: "The `thread_id` outputs an identifier for the current Python thread."
---

The `thread_id` outputs an identifier for the current Python thread that is executing a node, like `Thread-1`. 

This value is useful when auditing or analyzing dbt invocation metadata. It corresponds to the `thread_id` within the [`Result` object](/reference/dbt-classes#result-objects) and [`run_results.json`](/reference/artifacts/run-results-json).

If available, the `thread_id` is:
- available in the compilation context of [`query-comment`](/reference/project-configs/query-comment)
- included in the `info` dictionary in dbt [events and logs](/reference/events-logging#info)
- included in the `metadata` dictionary in [dbt artifacts](/reference/artifacts/dbt-artifacts#common-metadata)
- included as a label in all BigQuery jobs that dbt originates
