---
title: "Auto-exposures"
id: "configure-auto-exposures"
sidebar_label: "Configure auto-exposures"
description: "Import and auto-generate exposures from dashboards and understand how models are used in downstream tools for a richer lineage."
image: /img/docs/cloud-integrations/auto-exposures/explorer-lineage2.jpg
---

# Configure auto-exposures <Lifecycle status="preview,enterprise" />

As a data team, it’s critical that you have context into the downstream use cases and users of your data products. [Auto-exposures](/docs/collaborate/auto-exposures) integrates natively with Tableau and [auto-generates downstream lineage](/docs/collaborate/auto-exposures#view-auto-exposures-in-dbt-explorer) in dbt Explorer for a richer experience.

Auto-exposures help data teams optimize their efficiency and ensure data quality by:

- Helping users understand how their models are used in downstream analytics tools to inform investments and reduce incidents — ultimately building trust and confidence in data products.
- Importing and auto-generating exposures based on Tableau dashboards, with user-defined curation.
- Enabling the active exposure work to run models based on when exposures are updated or need to be updated, improving timeliness and reducing costs.

## Prerequisites

To access the features, you should meet the following:

1. Your environment and jobs are on [Versionless](/docs/dbt-versions/versionless-cloud) dbt.
2. You have a dbt Cloud account on the [Enterprise plan](https://www.getdbt.com/pricing/).
3. You have set up a [production](/docs/deploy/deploy-environments#set-as-production-environment) deployment environment for each project you want to explore, with at least one successful job run. 
4. You have [admin permissions](/docs/cloud/manage-access/enterprise-permissions) in dbt Cloud to edit project settings or production environment settings.
5. Use Tableau as your BI tool and enable metadata permissions or work with an admin to do so. Compatible with Tableau Cloud or Tableau Server with the Metadata API enabled. 

## Set up in Tableau

This section of the document explains the steps you need to set up the auto-exposures integration with Tableau. Once you've set this up in Tableau and dbt Cloud, you can view the [auto-exposures](/docs/collaborate/auto-exposures#view-auto-exposures-in-dbt-explorer) in dbt Explorer.

To set up [personal access tokens (PATs)](https://help.tableau.com/current/server/en-us/security_personal_access_tokens.htm) needed for auto exposures, ask a site admin to configure it for the account.

1. Ensure you or a site admin enables PATs for the account in Tableau.
   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/tableau-enable-pat.jpg" title="Enable PATs for the account in Tableau"/>

2. Create a PAT that you can add to dbt Cloud to pull in Tableau metadata for auto exposures. Ensure the user creating the PAT has access to collections/folders, as the PAT only grants access matching the creator's existing privileges.
   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/tableau-create-pat.jpg" title="Create PATs for the account in Tableau"/>

3. Copy the **Secret** and the **Token name** and enter them in dbt Cloud. The secret is only displayed once, so store it in a safe location (like a password manager).
   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/tableau-copy-token.jpg" title="Copy the secret and token name to enter them in dbt Cloud"/>

4. Copy the **Server URL** and **Sitename**. You can find these in the URL while logged into Tableau.
   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/tablueau-serverurl.jpg" title="Locate the Server URL and Sitename in Tableau"/>

   For example, if the full URL is: `10az.online.tableau.com/#/site/dbtlabspartner/explore`:
   - The **Server URL** is the first part of the URL, in this case: `10az.online.tableau.com`
   - The **Sitename** is right after the `site` in the URL, in this case: `dbtlabspartner` 

5. You should now be ready to set up auto-exposures in dbt Cloud after copying the following items, which you'll need during the dbt Cloud setup: ServerURL, Sitename, Token name, and Secret.

## Set up in dbt Cloud <Lifecycle status="enterprise"/>

1. In dbt Cloud, navigate to the project you want to add the auto-exposures to and then select **Settings**.
2. Under the **Exposures** section, select **Add integration** to add the Tableau connection.
   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/cloud-add-integration.jpg" title="Select Add Integration to add the Tableau connection."/>
3. Enter the details for the exposure connection you collected from Tableau in the [previous step](#set-up-in-tableau) and click **Continue**. Note that all fields are case-sensitive.
   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/cloud-integration-details.jpg" title="Enter the details for the exposure connection."/>
4. Select the collections you want to include for auto exposures. 
   
   dbt Cloud automatically imports and syncs any workbook within the selected collections. New additions to the collections will be added to the lineage in dbt Cloud during the next automatic sync (usually once per day).
   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/cloud-select-collections.jpg" title="Select the collections you want to include for auto exposures."/>
5. Click **Save**. 

dbt Cloud imports everything in the collection(s) and you can continue to view them in Explorer. For more information on how to view and use auto-exposures, refer to [View auto-exposures from dbt Explorer](/docs/collaborate/auto-exposures) page.

<Lightbox src="/img/docs/cloud-integrations/auto-exposures/explorer-lineage2.jpg" width="100%" title="View from the dbt Explorer in your Project lineage view, displayed with the Tableau icon."/>

## Refresh auto-exposures in jobs

:::info Coming soon
Soon, you’ll also be able to use auto-exposures to trigger the refresh of the data used in your Tableau dashboards from within dbt Cloud. Stay tuned for more on this soon!
:::
