---
title: "Orchestrate downstream exposures"
sidebar_label: "Orchestrate exposures"
description: "Use dbt to proactively refresh the underlying data sources (like Tableau extracts) during scheduled dbt jobs."
image: /img/docs/platform-integrations/auto-exposures/explorer-lineage2.jpg
---

# Orchestrate downstream exposures <Lifecycle status="managed,managed_plus,beta" />

<IntroText>

Use [<Constant name="dbt_platform" /> job scheduler](/docs/deploy/job-scheduler) to proactively refresh downstream exposures and the underlying data sources (extracts) that power your Tableau Workbooks.

</IntroText>

<VersionBlock firstVersion="2.0">

:::warning <Constant name="fusion" /> not supported for this beta

Orchestrating downstream exposures _isn't_ available when your deployments use [Latest <Constant name="fusion" />](/docs/dbt-versions/cloud-release-tracks). Supported jobs must use [Latest](/docs/dbt-versions/cloud-release-tracks) with the <Constant name="core" /> engine.

On the [Latest <Constant name="fusion" />](/docs/dbt-versions/cloud-release-tracks) release track (the <Constant name="fusion_engine" /> preview), orchestrating downstream exposures isn’t supported yet. Setting `DBT_ACTIVE_EXPOSURES` and `DBT_ACTIVE_EXPOSURES_BUILD_AFTER` won’t enable orchestration behavior (like Tableau extract refreshes) or the related job log entries.

The private beta is for <Constant name="dbt" /> Enterprise accounts. Contact your account representative for access.

:::

</VersionBlock>

<VersionBlock lastVersion="1.99">

:::tip Available in private beta

Orchestrating exposures is currently available in private beta to <Constant name="dbt" /> Enterprise accounts. Your deployment environments and scheduled jobs must use [Latest](/docs/dbt-versions/cloud-release-tracks) with the <Constant name="core" /> engine (not [Latest <Constant name="fusion" /> engine](/docs/dbt-versions/cloud-release-tracks)). To join the beta, contact your account representative.

:::

</VersionBlock>

Orchestrating exposures integrates with [downstream exposures](/docs/platform-integrations/downstream-exposures-tableau) and uses your `dbt build` job to ensure that Tableau extracts are updated regularly.

Control the frequency of these refreshes by configuring environment variables in your dbt environment.

<Expandable alt_header="Differences between visualizing and orchestrating downstream exposures">

The following table summarizes the differences between visualizing and orchestrating downstream exposures:

| Info | Set up and visualize downstream exposures | Orchestrate downstream exposures <Lifecycle status="beta"/> |
| ---- | ---- | ---- |
| Purpose | Automatically brings downstream assets into your dbt lineage. | Proactively refreshes the underlying data sources during scheduled dbt jobs. |
| Benefits | Provides visibility into data flow and dependencies. | Ensures BI tools always have up-to-date data without manual intervention. |
| Location  | Exposed in [<Constant name="catalog" />](/docs/explore/explore-projects) | Exposed in [<Constant name="dbt" /> scheduler](/docs/deploy/deployments) |
| Supported BI tool | Tableau | Tableau |
| Use case | Helps users understand how models are used and reduces incidents. | Optimizes timeliness and reduces costs by running models when needed. |
</Expandable>

## Prerequisites

To orchestrate downstream exposures, you should meet the following:

- [Configured downstream exposures](/docs/platform-integrations/downstream-exposures-tableau) and ensured desired exposures are included in your lineage.
- Verified your environment and jobs use [Latest](/docs/dbt-versions/cloud-release-tracks) with <Constant name="core" />. [Latest <Constant name="fusion" /> engine](/docs/dbt-versions/cloud-release-tracks), the <Constant name="fusion_engine" /> preview, does _not_ support orchestrating downstream exposures yet.
- Have a <Constant name="dbt" /> account on the [Enterprise or Enterprise+ plan](https://www.getdbt.com/pricing/).
- Created a [production](/docs/deploy/deploy-environments#set-as-production-environment) deployment environment for each project you want to explore, with at least one successful job run.
- Have [admin permissions](/docs/platform/manage-access/enterprise-permissions) in <Constant name="dbt" /> to edit project settings or production environment settings.
- Configured a [Tableau personal access token (PAT)](https://help.tableau.com/current/server/en-us/security_personal_access_tokens.htm) whose creator has privileges to view and refresh the data sources used by your exposures. The PAT inherits the permissions of its creator. Use a PAT created by:
   - A Tableau server or site administrator
   - A data source owner or a project leader


## Orchestrate downstream exposures

To orchestrate downstream exposures and see refreshes happen automatically during scheduled jobs on [Latest](/docs/dbt-versions/cloud-release-tracks) with the <Constant name="core" /> engine:

1. In the <Constant name="dbt" />, click **Deploy**, then **Environments**, and select the **Environment variables** tab.
2. Click **Add variable** and set the [environment level variable](/docs/build/environment-variables#setting-and-overriding-environment-variables) `DBT_ACTIVE_EXPOSURES` to `1` within the environment you want the refresh to happen.
3. Then set the `DBT_ACTIVE_EXPOSURES_BUILD_AFTER` to control the maximum refresh frequency (in minutes) you want between each exposure refresh.
4. Set the variable to **1440** minutes (24 hours) by default. This means that downstream exposures won’t refresh Tableau extracts more often than this set interval, even if the related models run more frequently.
   <Lightbox src="/img/docs/platform-integrations/auto-exposures/active-exposures-env-var.jpg" width="100%" title="Set the environment variable `DBT_ACTIVE_EXPOSURES` to `1`."/>
5. Run a production job on [Latest](/docs/dbt-versions/cloud-release-tracks) with <Constant name="core" />. Each run can trigger a downstream exposure refresh; if a job runs before the configured interval has passed, <Constant name="dbt" /> skips the downstream exposure refresh and marks it as `skipped` in the job logs.
6. View downstream exposure entries in your run job logs.
   <Lightbox src="/img/docs/platform-integrations/auto-exposures/active-exposure-log.jpg" title="View the downstream exposure logs in the dbt run job logs."/>
   - View more details in the debug logs for any troubleshooting.
