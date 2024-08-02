---
title: "Auto-exposures"
id: "configure-auto-exposures"
sidebar_label: "Configure auto-exposures"
description: "Import and auto-generate exposures from dashboards and understand how models are used in downstream tools for a richer lineage."
---

# Configure auto-exposures <Lifecycle status='beta' />

:::info Available in beta
Auto-exposures is currently in beta. If you have any feedback or would like to take part in the beta, please reach out to your account manager.
:::

As a data team, it’s critical that you have context into the downstream use cases and users of your data products. Auto-exposures integrates natively with Tableau (Power BI coming soon) and auto-generates downstream lineage in dbt Explorer for a richer experience.

Auto-exposures help data teams optimize their efficiency and ensure data quality by:

- Helping users understand how their models are used in downstream analytics tools to inform investments and reduce incidents — ultimately building trust and confidence in data products.
- Importing and auto-generating exposures based on Tableau dashboards, with user-defined curation.
- Enabling the active exposure work to run models based on when exposures are updated or need to be updated, improving timeliness and reducing costs.

## Prerequisites

To access the features, you should meet the following:

1. You have a dbt Cloud account on the [Enterprise plan](https://www.getdbt.com/pricing/).
2. You have set up a [production](/docs/deploy/deploy-environments#set-as-production-environment) deployment environment for each project you want to explore, with at least one successful job run. 
3. You have admin permissions in dbt Cloud to edit project settings or production environment settings
4. For auto-exposures: You use Tableau as your BI tool and can enable metadata permissions or work with an admin to do so. Compatible with Tableau Cloud or Tableau Server with the Metadata API enabled. 

## Set up in Tableau

This section of the document explains the steps you need to set up the auto-exposures integration with Tableau.

To set up personal access tokens (PATs) needed for auto exposures, ask a site admin to configure it for the account. 

1. First, ensure you or a site admin enable PATs for the account in Tableau.

<Lightbox src="/img/docs/cloud-integrations/auto-exposures/tableau-enable-pat.jpg" title="Enable PATs for the account in Tableau"/>

2. Next, create a PAT that you can add to dbt Cloud to pull in Tableau metadata for auto exposures.

<Lightbox src="/img/docs/cloud-integrations/auto-exposures/tableau-create-pat.jpg" title="Create PATs for the account in Tableau"/>

3. Copy the **Secret** and the **Token name.** Enter them in dbt Cloud. For security, you can save them in a password manager if desired.

<Lightbox src="/img/docs/cloud-integrations/auto-exposures/tableau-copy-token.jpg" title="Copy the secret and token name to enter them in dbt Cloud"/>

4. You will also need the **Server URL** and **Sitename**. You can find these in the URL while logged into Tableau.

<Lightbox src="/img/docs/cloud-integrations/auto-exposures/tablueau-serverurl.jpg" title="Locate the Server URL and Sitename in Tableau"/>

For example, if the full URL is: `10az.online.tableau.com/#/site/dbtlabspartner/explore`:

5. The **Server URL** is the first part of the URL, in this case: `10az.online.tableau.com`
6. The **Sitename** is right after the `site` in the URL, in this case: `dbtlabspartner` 

7. You should now be ready to set up Auto Exposures in dbt Cloud after having the four following items: ServerURL, Sitename, Token name, and Secret

## Set up in dbt Cloud

1. First, navigate to the project you want to add the Auto Exposures to and then select **Settings**.

2. Select **Add Integration** to add the Tableau connection.

<Lightbox src="/img/docs/cloud-integrations/auto-exposures/cloud-add-integration.jpg" title="Select Add Integration to add the Tableau connection."/>

3. Enter the details for the exposure connection you gathered from Tableau in step 4 earlier (all fields are case-sensitive) and click **Continue**.

<Lightbox src="/img/docs/cloud-integrations/auto-exposures/cloud-integration-details.jpg" title="Enter the details for the exposure connection."/>

4. Select the collections you want to include for auto exposures. dbt Cloud automatically imports and syncs any workbook within the selected collections. New additions to the collections will be added to the lineage in dbt Cloud during the next automatic sync (usually once per day).

<Lightbox src="/img/docs/cloud-integrations/auto-exposures/cloud-select-collections.jpg" title="Select the collections you want to include for auto exposures."/>

5. Click **Save**. Everything in this collection will be imported and you can continue to view them in Explorer using the steps below. 

## View auto-exposures in dbt Explorer

1. Navigate to dbt Explorer by clicking on the **Explore** link in the navigation.
2. From the main **Overview** page, navigate to **Exposures**.

<!-- turn to expandables -->
   - From the **Exposures** menu item under **Resources**.
        
     <Lightbox src="/img/docs/cloud-integrations/auto-exposures/explorer-view-resources.jpg" title="View from the dbt Explorer under the 'Resources' menu."/>
        
    - From within the **File tree** or 
    
    <Lightbox src="/img/docs/cloud-integrations/auto-exposures/explorer-view-file-tree.jpg" title="View from the dbt Explorer under the 'File tree' menu."/>
    
   - Or from the **Project lineage**
    
    <Lightbox src="/img/docs/cloud-integrations/auto-exposures/explorer-lineage.jpg" title="View from the dbt Explorer under the 'File tree' menu."/>
    
## Later: Refresh the auto-exposures via your jobs

:::info
Soon, you’ll also be able to use auto-exposures trigger refresh of the data used in your Tableau dashboards from within dbt Cloud. Stay tuned for more on this soon!
:::
