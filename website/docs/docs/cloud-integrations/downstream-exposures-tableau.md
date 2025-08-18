---
title: "Set up automatic downstream exposures"
sidebar_label: "Set up automatic exposures"
description: "Set up and visualize exposures automatically by auto-generating them from Tableau dashboards, helping you understand how models are used in downstream tools for a richer lineage."
image: /img/docs/cloud-integrations/auto-exposures/explorer-lineage2.jpg
---

# Set up automatic exposures in Tableau <Lifecycle status="managed,managed_plus" />

<IntroText>
Set up and automatically populate downstream exposures for supported BI tool integrations, like Tableau. Visualize and orchestrate them through <a href="https://docs.getdbt.com/docs/explore/explore-projects">dbt Catalog</a> and the [<Constant name="cloud" /> job scheduler](/docs/deploy/job-scheduler) for a richer experience.

</IntroText>

As a data team, it’s critical that you have context into the downstream use cases and users of your data products. By leveraging automatic downstream [exposures](/docs/build/exposures), you can:

- Gain a better understanding of how models are used in downstream analytics, improving governance and decision-making.
- Reduce incidents and optimize workflows by linking upstream models to downstream dependencies.
- Automate exposure tracking for supported BI tools, ensuring lineage is always up to date.
- [Orchestrate exposures](/docs/cloud-integrations/orchestrate-exposures) to refresh the underlying data sources during scheduled dbt jobs, improving timeliness and reducing costs. Orchestrating exposures is a way to ensure that your BI tools are updated regularly using the [<Constant name="cloud" /> job scheduler](/docs/deploy/job-scheduler). See the [previous page](/docs/cloud-integrations/downstream-exposures) for more info.

In <Constant name="cloud" />, you can configure downstream exposures in two ways:
- Manually &mdash; Declared [explicitly](/docs/build/exposures#declaring-an-exposure) in your project’s YAML files.
- Automatic &mdash;  <Constant name="cloud" /> [creates and visualizes downstream exposures](/docs/cloud-integrations/downstream-exposures) automatically for supported integrations, removing the need for manual YAML definitions. These downstream exposures are stored in dbt’s metadata system, appear in [<Constant name="explorer" />](/docs/explore/explore-projects), and behave like manual exposures. However, they don’t exist in YAML files.

:::info Tableau Server
If you're using Tableau Server, you need to add the [<Constant name="cloud" /> IP addresses for your region](/docs/cloud/about-cloud/access-regions-ip-addresses) to your allowlist.
:::

## Prerequisites

To configure automatic downstream exposures, you should meet the following:

1. Your environment and jobs are on a supported [<Constant name="cloud" /> release track](/docs/dbt-versions/cloud-release-tracks).
2. You have a <Constant name="cloud" /> account on the [Enterprise or Enterprise+ plan](https://www.getdbt.com/pricing/).
3. You have set up a [production](/docs/deploy/deploy-environments#set-as-production-environment) deployment environment for each project you want to explore, with at least one successful job run. 
4. You have [proper permissions](/docs/cloud/manage-access/enterprise-permissions) to edit <Constant name="cloud" /> project or production environment settings.
5. Use Tableau as your BI tool and enable metadata permissions or work with an admin to do so. Compatible with Tableau Cloud or Tableau Server with the Metadata API enabled.

### Considerations
import ConsiderationsTableau from '/snippets/_auto-exposures-considerations-tb.md';

<ConsiderationsTableau/>

## Set up downstream exposures

Set up downstream exposures in [Tableau](#set-up-in-tableau) and [<Constant name="cloud" />](#set-up-in-dbt-cloud) to ensure that your BI tool's extracts are updated automatically.

### Set up in Tableau

This section explains the steps to configure the integration in Tableau. A Tableau site admin must complete these steps. 

Once configured in both Tableau and [<Constant name="cloud" />](#set-up-in-dbt-cloud), you can [view downstream exposures](#view-downstream-exposures) in <Constant name="explorer" />. 

1. Enable [personal access tokens (PATs)](https://help.tableau.com/current/server/en-us/security_personal_access_tokens.htm) for your Tableau account.
   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/tableau-enable-pat.jpg" title="Enable PATs for the account in Tableau"/>

2. Create a PAT to add to <Constant name="cloud" /> to pull in Tableau metadata for the downstream exposures. When creating the token, you must have permission to access collections/folders, as the PAT only grants access matching the creator's existing privileges.
   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/tableau-create-pat.jpg" title="Create PATs for the account in Tableau"/>

3. Copy the **Secret** and the **Token name** for use in a later step in <Constant name="cloud" />. The secret is only displayed once, so store it in a safe location (like a password manager).
   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/tableau-copy-token.jpg" title="Copy the secret and token name to enter them in dbt"/>

4. Copy the **Server URL** and **Sitename**. You can find these in the URL while logged into Tableau.
   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/tablueau-serverurl.jpg" title="Locate the Server URL and Sitename in Tableau"/>

   For example, if the full URL is: `10az.online.tableau.com/#/site/dbtlabspartner/explore`:
   - The **Server URL** is the fully qualified domain name, in this case: `10az.online.tableau.com`
   - The **Sitename** is the path fragment right after `site` in the URL, in this case: `dbtlabspartner` 

5. With the following items copied, you are now ready to set up downstream exposures in <Constant name="cloud" />: 
      - ServerURL
      - Sitename
      - Token name
      - Secret

### Set up in dbt

1. In <Constant name="cloud" />, navigate to the **Dashboard** of the project you want to add the downstream exposure to and then select **Settings**.
2. Under the **Exposures** section, select **Add integration** to add the Tableau connection.
   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/cloud-add-integration.jpg" title="Select Add Integration to add the Tableau connection."/>
3. Enter the details for the exposure connection you collected from Tableau in the [previous step](#set-up-in-tableau) and click **Continue**. Note that all fields are case-sensitive.
   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/cloud-integration-details.jpg" title="Enter the details for the exposure connection."/>
4. Select the collections you want to include for the downstream exposures and click **Save**.

   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/cloud-select-collections.jpg" title="Select the collections you want to include for the downstream exposures."/>

      :::info
      <Constant name="cloud" /> automatically imports and syncs any workbook within the selected collections. New additions to the collections will appear in the lineage in <Constant name="cloud" /> once per day &mdash; after the daily sync and a job run.

      <Constant name="cloud" /> immediately starts a sync when you update the selected collections list, capturing new workbooks and removing irrelevant ones.
      :::

5. <Constant name="cloud" /> imports everything in the collection(s) and you can continue to [view them](#view-auto-exposures) in <Constant name="explorer" />. 

   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/explorer-lineage2.jpg" width="100%" title="View from the dbt Catalog in your Project lineage view, displayed with the Tableau icon."/>

import ViewExposures from '/snippets/_auto-exposures-view.md';

<ViewExposures/>

## Orchestrate exposures <Lifecycle status="beta,managed,managed_plus"/>

[Orchestrate exposures](/docs/cloud-integrations/orchestrate-exposures) using the dbt [Cloud job scheduler](/docs/deploy/job-scheduler) to proactively refresh the underlying data sources (extracts) that power your Tableau Workbooks.

- Orchestrating exposures with a `dbt build` job ensures that downstream exposures, like Tableau extracts, are updated regularly and automatically.
- You can control the frequency of these refreshes by configuring environment variables.

To set up and proactively run exposures with the <Constant name="cloud" /> job scheduler, refer to [Orchestrate exposures](/docs/cloud-integrations/orchestrate-exposures).
