---
title: "Model Timing Tab"
id: "cloud-model-timing-tab"
---

### Overview
Accessed via the "run detail" page in dbt Cloud, the model timing dashboard displays the model composition, order, and run time for every job run in dbt Cloud. The top 1% of model durations are automatically highlighted for quick reference.  This visualization is displayed after the run completes.

This is a very visual way to explore your run. Longest running models *may* be ripe for further exploration -- which can lead to refactoring or reducing run cadence.

Notes:
- The model timing dashboard is currently only available on multi-tenant Team and Enterprise accounts.
- The model timing dashboard can only be viewed for jobs that have successfully completed

<LoomVideo id="28a49a5c511c4063b4a3381cb81a03cf" />
