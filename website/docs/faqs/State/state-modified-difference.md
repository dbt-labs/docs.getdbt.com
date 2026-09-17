---
title: How is dbt State different from using state:modified?
description: "Learn how dbt State compares to the state:modified selector in dbt v1."
sidebar_label: 'How is this different from state:modified?'
id: state-modified-difference
---

On its own, `state:modified` requires manual management of `manifest.json`, which is cumbersome and error-prone. dbt State is completely managed with almost zero setup and no workflow changes. In self-managed deployments, dbt State can also power `state:*` selectors directly &mdash; see the last item below.

`state:modified` only checks if a file has changed. dbt State has semantic understanding of SQL, so meaningless changes like whitespace or table aliases are not counted as a change &mdash; making dbt State smarter about what actually needs to rebuild.

`state:modified` does not consider upstream data changes. dbt State checks all sources to see if there is any new data or if the schema has been modified. This enables dbt State to skip running models if the result of the run would be the same as before. For example, if you run `dbt run` with `state:modified` twice, it runs all modified models both times. dbt State only reruns models the second time if upstream sources have changed.

dbt State also has the ability to auto-defer refs and automatically clone tables when the result of the clone would have been the same as a full model run.

`state:modified` has a limitation on seed files over 1MB, while dbt State does not.

When dbt State is enabled in a self-managed deployment, all [`state:*` selectors](/reference/node-selection/methods#state) can use dbt State as their comparison source. This provides per-node granularity &mdash; each node is compared against its own last execution in the [`defer_to_target`](/reference/resource-configs/defer-to-target) environment, rather than comparing all nodes against a single `manifest.json` from the most recent job. This applies automatically when no explicit [`--state`](/reference/node-selection/configure-state) manifest has been provided. For more details, refer to [dbt State-powered `state:*` selectors](/docs/deploy/dbt-state-deferral#dbt-state-powered-state-selectors).
