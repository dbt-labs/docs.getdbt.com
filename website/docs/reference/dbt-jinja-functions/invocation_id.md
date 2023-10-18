---
title: "About invocation_id"
sidebar_label: "invocation_id"
id: "invocation_id"
description: "The `invocation_id` outputs a UUID generated for this dbt command."
---

The `invocation_id` outputs a UUID generated for this dbt command. This value is useful when auditing or analyzing dbt invocation metadata.

If available, the `invocation_id` is:
- available in the compilation context of [`query-comment`](/reference/project-configs/query-comment)
- included in the `info` dictionary in dbt [events and logs](/reference/events-logging#info)
- included in the `metadata` dictionary in [dbt artifacts](/reference/artifacts/dbt-artifacts#common-metadata)
- included as a label in all BigQuery jobs that dbt originates
