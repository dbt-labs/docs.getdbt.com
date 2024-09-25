---
title: "Deploy your metrics"
id: deploy-sl
description: "Deploy the dbt Semantic Layer in dbt Cloud by running a job to materialize your metrics."
sidebar_label: "Deploy your metrics"
tags: [Semantic Layer]
pagination_next: "docs/use-dbt-semantic-layer/exports"
---

<!-- The below snippet can be found in the following file locations in the docs code repository) 

https://github.com/dbt-labs/docs.getdbt.com/blob/current/website/snippets/_sl-run-prod-job.md
-->

import RunProdJob from '/snippets/_sl-run-prod-job.md';

<RunProdJob/>

## Next steps
After you've executed a job and deployed your Semantic Layer:
- [Set up your Semantic Layer](/docs/use-dbt-semantic-layer/setup-sl) in dbt Cloud.
- Discover the [available integrations](/docs/cloud-integrations/avail-sl-integrations), such as Tableau, Google Sheets, Microsoft Excel, and more.
- Start querying your metrics with the [API query syntax](/docs/dbt-cloud-apis/sl-jdbc#querying-the-api-for-metric-metadata).


## Related docs
- [Optimize querying performance](/docs/use-dbt-semantic-layer/sl-cache) using declarative caching.
- [Validate semantic nodes in CI](/docs/deploy/ci-jobs#semantic-validations-in-ci) to ensure code changes made to dbt models don't break these metrics.
- If you haven't already, learn how to [build your metrics and semantic models](/docs/build/build-metrics-intro) in your development tool of choice.
