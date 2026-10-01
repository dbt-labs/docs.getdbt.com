---
title: "Enabling dbt State on individual jobs"
sidebar_label: "Enable on individual jobs"
description: "Enable dbt State on specific jobs in dbt platform, whether existing or newly created."
id: "dbt-state-enable-jobs"
tags: ['dbt State']
availability: everywhere_usage
---

# Enabling dbt State on individual jobs

dbt State is available on all job types: deploy, continuous integration (CI), and merge jobs. Each job has a **dbt State** dropdown in its execution settings with **On**, **Off**, or **Inherited from environment** options. New jobs default to **Inherited from environment** &mdash; no additional configuration needed as long as dbt State is enabled on the environment.

Existing jobs default to **Off**. To follow the environment's setting, you must update each job manually.

<!-- TODO (ORC-4324): When this ships, replace with:

dbt State is available on all job types: deploy, continuous integration (CI), and merge jobs. Each job has a **dbt State** dropdown in its execution settings with **On**, **Off**, or **Inherited from environment** options.

When you enable dbt State on a deployment environment:
- New jobs default to **Inherited from environment** with dbt State enabled automatically.
- Existing jobs with **dbt State** set to **Off** automatically switch to **Inherited from environment**, enabling dbt State for those jobs.
-->

To enable dbt State on individual jobs: 

1. Go to **Orchestration** > **Jobs**.
2. Select the job you want to enable dbt State for.
3. Click **Settings** > **Edit**.
4. In the **Execution settings** section, set the **dbt State** dropdown to **On** to enable it explicitly, or **Inherited from environment** to follow the environment's setting. If you select **Inherited from environment**, make sure dbt State is [enabled on the environment](/docs/deploy/dbt-state-enable-environments) first &mdash; otherwise, the job will inherit it as off.
5. Click **Save**.

:::note
dbt State and State-aware orchestration are mutually exclusive. Selecting **Inherited from environment** or **On** automatically clears the **State-aware orchestration** option, and enabling **State-aware orchestration** sets **dbt State** to **Off**.
:::


## Related docs

- [About dbt State](/docs/deploy/dbt-state-about)
- [Set up dbt State](/docs/deploy/dbt-state-setup)
- [Enable dbt State on environments](/docs/deploy/dbt-state-enable-environments)
- [Enable dbt State in Studio](/docs/deploy/dbt-state-enable-studio)
