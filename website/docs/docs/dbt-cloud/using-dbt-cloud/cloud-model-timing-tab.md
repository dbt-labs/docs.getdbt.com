---
title: "Model timing tab"
id: "cloud-model-timing-tab"
description: "Visually explore runs and identify long-running models with the model timing dashboard."
---

### Overview

:::info Model timing
Model Timing is only available on the Team and Multi-tenant Enterprise plans
:::

Accessed via the "run detail" page in dbt Cloud, the model timing dashboard displays the model composition, order, and run time for every job run in dbt Cloud. The top 1% of model durations are automatically highlighted for quick reference.  This visualization is displayed after the run completes.

This is a very visual way to explore your run and surface model bottlenecks. Longest running models *may* be ripe for further exploration -- which can lead to refactoring or reducing run cadence.

Notes:
- The model timing dashboard is currently only available on multi-tenant Team and Enterprise accounts.
- The model timing dashboard can only be viewed for jobs that have successfully completed.

<Lightbox src="/img/docs/dbt-cloud/Model-timing-tab.png" title="Model timing tab"/>
