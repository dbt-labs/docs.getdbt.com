---
title: "Set up and connect BigQuery"
id: setting-up-bigquery
description: "Set up BigQuery with sample data and connect to dbt Cloud."
sidebar_label: "Set up and connect BigQuery"
---

## Introduction

For the BigQuery project in the getting started guide, you'll learn how to set up BigQuery and connect it to dbt Cloud.

This project will walk you through:

- Setting up a new BigQuery instance
- Replicating sample data for this guide
- Connecting dbt Cloud to BigQuery

## Prerequisites

Before beginning this tutorial, make sure that you have access to **new or existing Google account**. You can use a personal or work account to set up BigQuery through Google Cloud Platform (GCP).

## Setting up

<WistiaVideo id="668fnsit1t" paddingTweak="62.5%" />

Before jumping into the steps below, login to your Google account.

1. Go to the [BigQuery Console](https://console.cloud.google.com/bigquery)

   - If you don't have a Google Cloud Platform account you will be asked to create one.
   - If you do have one (or multiple) it will likely log you into your oldest account. Click your profile icon in the top right corner to verify which Google account you're using.

2. Create a new project for this tutorial:

   - If you've just created a BigQuery account, you'll be prompted to create a new project straight away.
   - If you already have an existing organization, you can select the project drop down in the header bar, and create a new project from there.
    <Lightbox src="/img/bigquery/project-dropdown.png" title="Bigquery Project Dropdown" />
   - Select NEW PROJECT
    <Lightbox src="/img/bigquery/new-project-creation.png" title="Bigquery New Project Creation" />
   - It will automatically populate with a project name, but you can change the name to something more relevant. For example, dbt Learn - Bigquery Setup'.  Click **Create**.

## Loading data

BigQuery supports public data sets that can be directly queried, so we will show you how to access those datasets via select statements. Additionally, we will show you how to populate your own database objects with that data.

1. Head back to the [BigQuery Console](https://console.cloud.google.com/bigquery), and ensure your new project is selected.
    > Note: If you do not see your account or project, click on your profile picture on the far right to ensure you are under the proper email address account. Sometimes when following links, your account switches from personal email to work email, or vice versa.

2. Copy and paste the below queries into the Query Editor to validate that you are able to run them successfully.

    ```sql
    select * from `dbt-tutorial.jaffle_shop.customers`;
    select * from `dbt-tutorial.jaffle_shop.orders`;
    select * from `dbt-tutorial.stripe.payment`;
    ```

3. Verify you can see an output:
    <Lightbox src="/img/bigquery/query-results.png" title="Bigquery Query Results" />

4. Create datasets. Datasets in BigQuery are equivalent to schemas in a traditional database.

    a. Find your project in the picker. Click the three dots to expose options. 
    
    b. Click **Create dataset**.

    <Lightbox src="/img/bigquery/create-dataset.png" title="Bigquery Create Dataset" />
    
    c. Fill in `Dataset ID` as required. This will be used like schema in fully qualified references to your database objects, i.e. database.schema.table, so choose a name that fits the purpose, in this case we will be creating one now for `jaffle_shop` and one for `stripe` later.
    
    <Lightbox src="/img/bigquery/create-dataset-id.png" title="Bigquery Create Dataset ID" />
    
    d. Leave the default values in the rest of the fields:
        * `Data location` can be left blank -- if selected, this determines the GCP location where your data is stored. The current default location is the US multi-region. All tables within this dataset will share this location.
        * Even though it is unchecked, billing table expiration will be set automatically to 60 days, because billing has not been enabled for this project, so GCP defaults to deprecating tables.
        * Let Google manage encryption
        * Click `CREATE DATASET`
        * Repeat these steps for the second dataset, `stripe`

5. Create views. You will create views within your project to simulate source tables in your project.  These will be built on top of the public tables created in previous steps.

  a. Select your jaffle_shop or stripe project and click **Compose new query**.

  b. Copy the following code and paste it in the blank query editor: 
  ```sql
  select * from `dbt-tutorial.jaffle_shop.customers`;
  ```
  c. Click **SAVE** then **Save View**.

    <Lightbox src="/img/bigquery/save-view.png" title="Bigquery Save View" />

  d. Your two datasets, `jaffle_shop` and `stripe` should now show up under `Dataset`.

  e. Select `jaffle_shop`.  Enter `customers` as your “Table” name. Click **Save**.

    <Lightbox src="/img/bigquery/save-view-table.png" title="Bigquery Save View - Table" />

6. You should now see your database object in the dropdown. If you click on it, BigQuery automatically infers data types and other metadata information for you:

    <Lightbox src="/img/bigquery/view-created.png" title="Bigquery View Created" />

7. You can now query that database object using either `dbt-learn-bigquery-setup.jaffle_shop.customers` or more simply `jaffle_shop.customers`.  Note: `dbt-learn-big-query-setup` will reflect the project ID that you chose earlier in the tutorial.
 
 8. Repeat steps 5 - 7 for the orders table, naming it "orders" and selecting the jaffle_shop project:

    ```sql
    select * from `dbt-tutorial.jaffle_shop.orders`;
    ```

9. Repeat steps 5 - 7 for the payment table "payment" and selecting the stripe project:

    ```sql
    select * from `dbt-tutorial.stripe.payment`;```
    ```

## Connecting to dbt Cloud

Our next step will focus on connecting dbt Cloud to Google BigQuery so that you can leverage the power of dbt to transform data in BigQuery.

### Access your BigQuery credentials

<WistiaVideo id="o9a2bawwl6" paddingTweak="62.5%" />

In order to let dbt connect to your warehouse, you'll need to generate a keyfile. This is analogous to using a database user name and password with most other data warehouses.

1. Go to the [BigQuery credential wizard](https://console.cloud.google.com/apis/credentials/wizard). Ensure that your new project is selected in the header bar.
    > Note: If you do not see your account or project, click on your profile picture on the far right to ensure you are under the proper email address account. Sometimes when following links, your account switches from personal email to work email, or vice versa.
2. Select **+ Create Credentials** then select **Service account**.
3. Type `dbt-user` in the Service account name field, then click **Create and Continue**.
4. Type and select **BigQuery Admin** in the Role field.
5. Click **Continue**.
6. Leave fields blank in the "Grant users access to this service account" section and click **Done**.
7. Click the service account that you just created.
8. Select **Keys**.
9. Click **Add Key** then select **Create new key**.
10. Select **JSON** as the key type then click **Create**.  
11. You should be prompted to download the JSON file. Save it locally to an easy-to-remember spot, with a clear filename. For example, `dbt-user-creds.json`.

### Create a dbt Cloud account

<WistiaVideo id="vrytipyvl4" paddingTweak="62.5%" />

<Snippet src="tutorial-create-new-dbt-cloud-account" />

### Connect dbt Cloud to BigQuery

Now let's formally set up the connection between dbt Cloud and BigQuery. 

1. Click on the "BigQuery" icon to set up your connection.
2. Click on “Upload a Service Account JSON File”.
3. Select your file from your recent Downloads folder and dbt Cloud will automatically fill in all the necessary fields:
4. Click “Test” at the top. This will check that dbt Cloud can access your BigQuery account.
5. If test successful, click “Continue”

## Initialize your repository and start development

<WistiaVideo id="x3vd9bowj0" paddingTweak="62.5%" />

<Snippet src="tutorial-managed-repo-and-initiate-project" />

Congratulations! You have successfully completed the following:

- Set up a new BigQuery instance
- Replicated sample data for this guide
- Connected dbt Cloud to BigQuery

## Next steps

<Snippet src="tutorial-next-steps-setting-up" />
