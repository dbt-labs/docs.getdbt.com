---
title: "Set up and connect BigQuery"
id: setting-up-bigquery
description: "Set up BigQuery with sample data and connect to dbt Cloud."
sidebar_label: "Set up and connect BigQuery"
pagination_next: docs/get-started/getting-started/building-your-first-project/build-your-first-models
---

## Introduction

For the BigQuery project in the getting started guide, you'll learn how to set up BigQuery and connect it to dbt Cloud.

This guide will walk you through:

- Setting up a new BigQuery instance
- Accessing sample data in a public data set
- Connecting dbt Cloud to BigQuery

## Prerequisites

Before beginning this guide, make sure that you have access to [new or existing Google account](https://support.google.com/accounts/answer/27441?hl=en). You can use a personal or work account to set up BigQuery through [Google Cloud Platform (GCP)](https://cloud.google.com/free).

## Setting up

<WistiaVideo id="668fnsit1t" paddingTweak="62.5%" />

Before jumping into the steps below, login to your Google account.

1. Navigate to the [BigQuery Console](https://console.cloud.google.com/bigquery).
   - If you don't have a Google Cloud Platform account you will be asked to create one.
   - If you do have one (or multiple) it will likely log you into your oldest account. Click your profile picture to the right and verify your are using the correct email account.

2. Create a new project for this tutorial:
   - If you've just created a BigQuery account, you'll be prompted to create a new project straight away.
   - If you already have an existing organization, you can select the project drop down in the header bar, and create a new project from there.
   <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/bigquery/project-dropdown.png" title="Bigquery Project Dropdown" />
   </div>

3. Select **NEW PROJECT**. You should see a project name automatically populate. You can change the name to something more relevant, for example "dbt Learn - Bigquery Setup."

    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/bigquery/new-project-creation.png" title="Bigquery New Project Creation" />
    </div>

4. Click **Create**.

## Loading data

BigQuery supports public data sets that can be directly queried, so we will show you how to access those datasets via select statements. Additionally, we will show you how to populate your own database objects with that data.

1. Navigate to the [BigQuery Console](https://console.cloud.google.com/bigquery) again. Make sure your new project is selected in the header. If you do not see your account or project, click your profile picture to the right and verify your are using the correct email account.

2. Copy and paste the below queries into the Query Editor to validate that you are able to run them successfully.

    ```sql
    select * from `dbt-tutorial.jaffle_shop.customers`;
    select * from `dbt-tutorial.jaffle_shop.orders`;
    select * from `dbt-tutorial.stripe.payment`;
    ```

3. Verify you can see an output:
    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/bigquery/query-results.png" title="Bigquery Query Results" />
    </div>
4. Create datasets. Datasets in BigQuery are equivalent to schemas in a traditional database.

    1. Find your project in the picker. Click the three dots to expose options.
    2. Click **Create dataset**.
    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/bigquery/create-dataset.png" title="Bigquery Create Dataset" />
    </div>
    3. Fill in `Dataset ID` as required. This will be used like schema in fully qualified references to your database objects, i.e. database.schema.table, so choose a name that fits the purpose, in this case we will be creating one now for `jaffle_shop` and one for `stripe` later.
    <div style={{maxWidth: '400px'}}>
    <Lightbox src="/img/bigquery/create-dataset-id.png" title="Bigquery Create Dataset ID" />
    </div>
    4. Leave the default values in the rest of the fields:
        - `Data location` can be left blank -- if selected, this determines the GCP location where your data is stored. The current default location is the US multi-region. All tables within this dataset will share this location.
        - Even though it is unchecked, billing table expiration will be set automatically to 60 days, because billing has not been enabled for this project, so GCP defaults to deprecating tables.
        - Allow Google to manage encryption.
        - Click `CREATE DATASET`.
        - Repeat steps i through iv for the second dataset, `stripe`.

## Connecting to dbt Cloud

You will learn how to connect dbt Cloud to Google BigQuery so that you can leverage the power of dbt to transform data in BigQuery.

### Generate BigQuery credentials

<WistiaVideo id="o9a2bawwl6" paddingTweak="62.5%" />

In order to let dbt connect to your warehouse, you'll need to generate a keyfile. This is analogous to using a database user name and password with most other <Term id="data-warehouse">data warehouses</Term>.

1. Go to the [BigQuery credential wizard](https://console.cloud.google.com/apis/credentials/wizard). Make sure your new project is selected in the header. If you do not see your account or project, click your profile picture to the right and verify your are using the correct email account.
2. Select **+ Create Credentials** then select **Service account**.
3. Type `dbt-user` in the Service account name field, then click **Create and Continue**.
4. Type and select **BigQuery Admin** in the Role field.
5. Click **Continue**.
6. Leave fields blank in the "Grant users access to this service account" section and click **Done**.
7. Click the service account that you just created.
8. Select **Keys**.
9. Click **Add Key** then select **Create new key**.
10. Select **JSON** as the key type then click **Create**.  
11. You should be prompted to download the <Term id="json" /> file. Save it locally to an easy-to-remember spot, with a clear filename. For example, `dbt-user-creds.json`.

### Create a dbt Cloud account

<WistiaVideo id="vrytipyvl4" paddingTweak="62.5%" />

<Snippet src="tutorial-create-new-dbt-cloud-account" />

### Connect dbt Cloud to BigQuery

Now let's set up the connection between dbt Cloud and BigQuery.

1. Click **BigQuery** to set up your connection.
2. Click **Upload a Service Account JSON File** in BigQuery settings.
3. Select the JSON file you downloaded in [Generate BigQuery Credentials](#generate-bigquery-credentials). dbt Cloud will fill in all the necessary fields.
4. Click **Test** at the top. This verifies that dbt Cloud can access your BigQuery account.
5. If you see "Connection test Succeeded!" then click **Continue**. If it fails, you might need to go back and regenerate your BigQuery credentials.

## Initialize your repository and start development

### Setting up a managed repository

<Snippet src="tutorial-managed-repo" />

### Initialize your dbt project

<Snippet src="tutorial-initiate-project" />


Congratulations! You have successfully completed the following:

- Set up a new BigQuery instance
- Accessing sample data in a public data set
- Connected dbt Cloud to BigQuery

## Next steps

<Snippet src="tutorial-next-steps-setting-up" />
