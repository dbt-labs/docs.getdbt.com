---
title: Setting up with BigQuery
id: setting-up-bigquery
---

## Create a BigQuery Project

Anyone with a Google Account can use BigQuery, so let's go through how to Create a BigQuery project

<LoomVideo id="f9f42ae9ef7643b2b2043256927feb26" />

1. Go to the [BigQuery Console](https://console.cloud.google.com/bigquery)

   1. If you don't have a Google Cloud Platform account you will be asked to create one.

   2. If you do have one (or multiple) it will likely log you into your oldest account. Check which Google account is being used by clicking your face in the top right corner.

2. Create a new project for this tutorial

   1. If you've just created a BigQuery account, you'll be prompted to create a new project straight away.

   2. If you already have an existing organization, you can select the project drop down in the header bar, and create a new project from there.
    <Lightbox src="/img/bigquery/project-dropdown.png" title="Bigquery Project Dropdown" />
   
   3. Select "NEW PROJECT"
    <Lightbox src="/img/bigquery/new-project-creation.png" title="Bigquery New Project Creation" />
   
   4. It will automatically populate with a project name, feel free to pick something that makes more sense. I chose 'dbt Learn - Bigquery Setup'.  Click “Create”!


## Access Sample Data Within BigQuery

BigQuery supports public data sets that can be directly queried, so we will show you how to access those datasets via select statements. Additionally, we will show you how to populate your own database objects with that data.

1. Head back to the [BigQuery Console](https://console.cloud.google.com/bigquery), and ensure your new project is selected. 
    > Note: If you do not see your account or project, click on your profile picture on the far right to ensure you are under the proper email address account. Sometimes when following links, your account switches from personal email to work email, or vice versa.

2. Copy and paste the below queries into the Query Editor to validate that you are able to run them successfully.

    1. select * from `dbt-tutorial.jaffle_shop.customers`;

    2. select * from `dbt-tutorial.jaffle_shop.orders`;

    3. select * from `dbt-tutorial.stripe.payment`;

3. Verify you can see an output:
    <Lightbox src="/img/bigquery/query-results.png" title="Bigquery Query Results" />

4. Create a dataset

    1. Find your project in the picker (at this point it's probably the only project in your explorer!)

    2. Click the three dots to expose options
        <Lightbox src="/img/bigquery/expose-options.png" title="Bigquery Project Options" />

    3. Click “Create dataset”
        <Lightbox src="/img/bigquery/create-dataset.png" title="Bigquery Create Dataset" />
    4. You should see this:
        <Lightbox src="/img/bigquery/create-dataset-options.png" title="Bigquery Create Dataset Options" />    
    
    5. Fill in “Dataset ID” as required. This will be used like schema in fully qualified references to your database objects, i.e. database.schema.table, so choose a name that fits the purpose, in this case we will be creating one now for 'jaffle_shop' and one for 'stripe' later.
        <Lightbox src="/img/bigquery/create-dataset-id.png" title="Bigquery Create Dataset ID" />
    
    6. Leave everything else as is:
        - “Data location” can be left blank -- if selected, this determines the AWS location where your data is stored. The current default location is the US multi-region. All tables within this dataset will share this location.
        - Even though it is unchecked, billing table expiration will be set automatically to 60 days, because billing has not been enabled for this project, so AWS defaults to deprecating tables.
        - Let Google manage encryption
        - Click “CREATE DATASET”
        - Repeat steps 1-6 for the second dataset, 'stripe'

5. Create Views

    1. “RUN” your first query: ```select * from `dbt-tutorial.jaffle_shop.customers`;```

    2. Click “SAVE” > “Save View”
        <Lightbox src="/img/bigquery/save-view.png" title="Bigquery Save View" />
    
    3. Your two datasets, `jaffle_shop` and `stripe` should now show up under “Dataset”. Select “jaffle_shop”.
        <Lightbox src="/img/bigquery/save-view-datasets.png" title="Bigquery Save View - Datasets" />
    
    4. Enter 'customers' as your “Table” name. Hit “SAVE”
        <Lightbox src="/img/bigquery/save-view-table.png" title="Bigquery Save View - Table" />

6. You should now see your database object in the dropdown. If you click on it, BigQuery automatically infers data types and other metadata information for you:
    <Lightbox src="/img/bigquery/view-created.png" title="Bigquery View Created" />

7. You can now query that database object using either `dbt-learn-bigquery-setup.jaffle_shop.customers` or more simply `jaffle_shop.customers`

8. Repeat those steps for the other two queries / tables:

    1. ```select * from `dbt-tutorial.jaffle_shop.orders`;```

    2. ```select * from `dbt-tutorial.stripe.payment`;```

## Generate BigQuery Credentials

<LoomVideo id="33f64471b1714be397ada074cdbd8649" />

In order to let dbt connect to your warehouse, you'll need to generate a keyfile. This is analogous to using a database user name and password with most other data warehouses.

1. Go to the [BigQuery credential wizard](https://console.cloud.google.com/apis/credentials/wizard). Ensure that your new project is selected in the header bar.
    > Note: If you do not see your account or project, click on your profile picture on the far right to ensure you are under the proper email address account. Sometimes when following links, your account switches from personal email to work email, or vice versa.
    
    <Lightbox src="/img/bigquery/project-selected.png" title="Bigquery Project Selected" />

2. Generate credentials with the following options:

    1. "Credential Type"

        1. "Which API are you using?" `BigQuery API`

        2. "What data will you be accessing?" `Application data` (you'll be creating a service account)

        3. "Are you planning to use this API with App Engine or Compute Engine?" `No`
            <Lightbox src="/img/bigquery/api-credential-type.png" title="Bigquery API - Credential Type" />

        4. Click “NEXT”

    2. “Service account details”

        1. "Service account name" `dbt-user` (although I chose `dbt-learn-admin`)
            > Note: You can enter a description for future reference, but this is optional.

            <Lightbox src="/img/bigquery/api-service-account-details.png" title="Bigquery API - Service Account Details" />

        2. Click “CREATE AND CONTINUE”

    3. Create and/or grant access to project. 
        > Note: The simplest way is to set up one owner/admin role, but you can set up different permissions here for developers or read-only if required.

        <Lightbox src="/img/bigquery/api-grant-service-access.png" title="Bigquery API - Grant Service Account Access" />

        1. then click “CONTINUE”

    4. Grant users access:

        1. Add your own email initially  
            <Lightbox src="/img/bigquery/api-grant-user-access.png" title="Bigquery API - Grant Users Access" />

        2. Click “DONE”

3. You now have a service account. Click on it to proceed:
    <Lightbox src="/img/bigquery/api-select-service-account.png" title="Bigquery API - Select Service Account" />

    1. Under “KEYS” heading, click “ADD KEY” then “Create new key”
        <Lightbox src="/img/bigquery/api-create-key.png" title="Bigquery API - Create New Key" />

    2. "Key type" `JSON`
        <Lightbox src="/img/bigquery/api-key-type.png" title="Bigquery API - Key Type" />

    3. Click “CREATE” and it will download the keyfile

## Set up a dbt Cloud project and connect to BigQuery

<LoomVideo id="c75212052038463b977d0eb856d25ff1" />

Above we created a project in Bigquery and created an API key so we interact with BigQuery from other applications. Now we are going to navigate to dbt Cloud and see if we can access our BigQuery Project!

1. It's time to leave BigQuery and navigate to https://cloud.getdbt.com/ so we can create a new project

2. Click the Hamburger

3. Click "Account Settings"
    
    1. You should be in the "Projects" section by default. Click "New Project”, in the top right.
        <Lightbox src="/img/bigquery/set-up-new-project.png" title="dbt Cloud - Set Up A New Project" />
    
    2. Click “Begin”

4. Project Settings
    1. Name your project. I chose 'BigQuery Demo', but you might consider your company's name or 'Arrakis' if you semi-haphazardly name all your projects and repos after Dune references. Click “Continue”.
        <Lightbox src="/img/bigquery/project-name.png" title="dbt Cloud - Project Name" />
    
    2. Set Up a Database Connection
        <Lightbox src="/img/bigquery/database-connection.png" title="dbt Cloud - Set Up a Database Connection" />
        1. Click on “BigQuery” icon.

        2. Click on “Upload a Service Account JSON File”.
        
        3. Select your file from your recent Downloads folder and dbt Cloud will automatically fill in all the necessary fields:
            <Lightbox src="/img/bigquery/database-connection-json-file.png" title="dbt Cloud - Upload a JSON File" />
        
        4. Click “Test” at the top
            <Lightbox src="/img/bigquery/database-connection-test.png" title="dbt Cloud - Database Connection Test" />
        
        5. If test successful, click “Continue”

    3. Add Repository

        1. If you have one already (CLI folks) you can connect your Github and select it from a dropdown

        2. If you want to use dbt “Managed” repository, you can do that as well.  That's what I am doing, and chose the name 'bigquery_set_up_tutorial'
            <Lightbox src="/img/bigquery/set-up-repository.png" title="dbt Cloud - Set Up Repository" />

        3. Click “Create” then “Continue”

Welcome to dbt Learn on dbt Cloud!

<LoomVideo id="df61a23b29974710b67088514f895aa5" />

1. Click “Start Developing”.
    > Note: This can take a few minutes for your project to spin up for the first time, as it established your git connection, clones your repo, and tests the connection to the warehouse.
        
    <Lightbox src="/img/bigquery/start-developing.png" title="dbt Cloud - Start Developing" />

2. Click “initialize your project”
    <Lightbox src="/img/bigquery/initialize-your-project.png" title="dbt Cloud - Initialize Your Project" />
    This will build out your folder structure with example models included

3. Commit your first init
    <Lightbox src="/img/bigquery/init-commit.png" title="dbt Cloud - First Commit" />

4. Now you are ready to run SQL in the "Statement" tab!

    1. Test you can access the opensource dataset by entering: 
        - ```select * from `dbt-tutorial.jaffle_shop.customers` ``` 
        - Hit "Preview"
        <Lightbox src="/img/bigquery/preview-open-data.png" title="dbt Cloud - Statement Preview Open Source Data" />

    1. Test you can access the datasets we created in your project by entering: 
        - `select * from jaffle_shop.customers`
        - Hit “Preview”
        <Lightbox src="/img/bigquery/preview-data.png" title="dbt Cloud - Statement Preview Project Data" />

Congratulations, you are all set! 
