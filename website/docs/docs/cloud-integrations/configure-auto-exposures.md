---
title: "Auto-exposures"
sidebar_label: "Configure auto-exposures
id: "configure-auto-exposures"
description: "Import and auto-generate exposures from dashboards and understand how models are used in downstream tools for a richer lineage."
---

# Configure auto-exposures <Lifecycle status='beta' />

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

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/d044428d-35c1-45b8-8e9c-df25f39d8ced/72097e01-3d7a-4261-992a-153157288e3d/Untitled.png)

2. Next, create a PAT that you can add to dbt Cloud to pull in Tableau metadata for auto exposures.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/d044428d-35c1-45b8-8e9c-df25f39d8ced/29cdf61d-b8df-4df2-b869-981424c111bc/Untitled.png)

3. Copy the **Secret** and the **Token name.** Enter them in dbt Cloud. For security, you can save them in a password manager if desired.

![BI auto exposures.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d044428d-35c1-45b8-8e9c-df25f39d8ced/aedc22d5-eae1-436a-ad1c-3572634c932c/BI_auto_exposures.png)

4. You will also need the **Server URL** and **Sitename**. You can find these in the URL while logged into Tableau.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/d044428d-35c1-45b8-8e9c-df25f39d8ced/2c315203-d6d0-448c-b972-2646c4a4d2ec/Untitled.png)

For example, if the full URL is: `10az.online.tableau.com/#/site/dbtlabspartner/explore`:

1. The **Server URL** is the first part of the URL, in this case: `10az.online.tableau.com`
2. The **Sitename** is right after the `site` in the URL, in this case: `dbtlabspartner` 

3. You should now be ready to set up Auto Exposures in dbt Cloud after having the four following items: ServerURL, Sitename, Token name, and Secret

## Set up in dbt Cloud

1. First, navigate to the project you want to add the Auto Exposures to and then select **Settings**.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/d044428d-35c1-45b8-8e9c-df25f39d8ced/65200e61-8b1e-45c8-bcf0-e1a3aeaedb07/Untitled.png)

2. Select **Add Integration** to add the Tableau connection.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/d044428d-35c1-45b8-8e9c-df25f39d8ced/7c8becaf-da99-4efc-8757-eb29dcc06e9b/Untitled.png)

3. Enter the details for the exposure connection you gathered from Tableau in [Step 4 earlier](https://www.notion.so/Beta-Tableau-auto-exposures-4dc682d7bdda4aa892d29aa65b684fe9?pvs=21) (all fields are case-sensitive) and click **Continue**.

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/d044428d-35c1-45b8-8e9c-df25f39d8ced/aa27b67b-b6ec-467c-9da8-9d091dc88f30/Untitled.png)

4. Select the collections you want to include for auto exposures. dbt Cloud automatically imports and syncs any workbook within the selected collections. New additions to the collections will be added to the lineage in dbt Cloud during the next automatic sync (usually once per day).

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/d044428d-35c1-45b8-8e9c-df25f39d8ced/2918c6ea-4d92-4114-91cb-35657600a982/Untitled.png)

5. Click **Save**. Everything in this collection will be imported and you can continue to view them in Explorer using the steps below. 

## View auto-exposures in dbt Explorer

1. Navigate to dbt Explorer by clicking on the **Explore** link in the navigation.
2. From the main **Overview** page, navigate to **Exposures**.

<!-- turn to expandables -->
   - From the **Exposures** menu item under **Resources**.
        
        ![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/d044428d-35c1-45b8-8e9c-df25f39d8ced/e1276e11-afb6-441b-b48d-20c01705a0bc/Untitled.png)
        
    - From within the **File tree** or 
    
    ![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/d044428d-35c1-45b8-8e9c-df25f39d8ced/9ac40655-6c7e-49c6-9d1e-a67ed3e7c9f0/Untitled.png)
    
   - Or from the **Project lineage**
    
    ![Screenshot 2024-07-22 at 11.03.41 AM.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d044428d-35c1-45b8-8e9c-df25f39d8ced/c4c4d1f7-3887-495f-b042-043a3851e746/Screenshot_2024-07-22_at_11.03.41_AM.png)
    
    ![Screenshot 2024-07-22 at 11.02.29 AM.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/d044428d-35c1-45b8-8e9c-df25f39d8ced/4e68df3f-363d-4880-808b-bde37a837750/Screenshot_2024-07-22_at_11.02.29_AM.png)
    
## Later: Refresh the auto-exposures via your jobs

:::info
Soon, you’ll also be able to use auto-exposures trigger refresh of the data used in your Tableau dashboards from within dbt Cloud. Stay tuned for more on this soon!
:::
