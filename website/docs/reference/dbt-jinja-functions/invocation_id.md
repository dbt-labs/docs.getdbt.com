---
title: "invocation_id"
id: "invocation_id"
description: "The `invocation_id` outputs a UUID generated for this dbt command."
---

The `invocation_id` outputs a UUID generated for this dbt command. This value is
useful when auditing or analyzing dbt invocation metadata.

<Changelog>

- Support for `query-comment` is new in v0.16.1
- Automatic inclusion of `invocation_id` in both dbt artifacts and BigQuery jobs is new in v0.19.0

</Changelog>

If available, the `invocation_id` is:
- available in the compilation context of [`query-comment`](query-comment)
- included in the `info` dictionary in dbt [events and logs](events-logging#info)
- included in the `metadata` dictionary in [dbt artifacts](dbt-artifacts#common-metadata)
- included as a label in all BigQuery jobs that dbt originates
