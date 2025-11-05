---
title: "BigQuery setup"
description: "Read this guide to learn about the BigQuery warehouse setup in dbt Fusion."
id: "bigquery-setup"
meta:
  maintained_by: dbt Labs
  authors: 'Fusion dbt maintainers'
  github_repo: 'dbt-labs/dbt-adapters'
  pypi_package: 'dbt-bigquery'
  cloud_support: Supported
  min_supported_version: 'n/a'
  slack_channel_name: '#db-bigquery'
  slack_channel_link: 'https://getdbt.slack.com/archives/C99SNSRTK'
  platform_name: 'BigQuery'
  config_page: '/reference/resource-configs/bigquery-configs'
---

# BigQuery setup <Lifecycle status='preview' />

You can configure the BigQuery adapter by running `dbt init` in your CLI or manually providing the `profiles.yml` file with the fields configured for your authentication type.

The BigQuery adapter for Fusion supports the following [authentication methods](#supported-authentication-types):
- Service account (JSON file)
- gcloud OAuth

## BigQuery permssions

dbt user accounts need the following permissions to read from and create tables and views in a BigQuery project:

- BigQuery Data Editor
- BigQuery User
- BigQuery Read Session User (New in Fusion. For Storage Read API access)

For BigQuery DataFrames, users need these additional permissions:
- BigQuery Job User
- BigQuery Read Session User
- Notebook Runtime User
- Code Creator
- colabEnterpriseUser

## Configure Fusion

Executing `dbt init` in your CLI will prompt for the following fields:
- **Project ID:** The GCP BigQuery project ID
- **Dataset:** The schema name
- **Location:** The location for your GCP environment (for example, us-east1)

Alternatively, you can manually create the `profiles.yml` file and configure the fields. See examples in [authentication](#supported-authentication-types) section for formatting. If there is an existing `profiles.yml` file, you have the option to retain the existing fields or overwrite them. 

Next, select your authentication method. Follow the on-screen prompts to provide the required information.

## Supported authentication types

<Tabs>

<TabItem value="Service account (JSON file)">

Selecting the **Service account (JSON file)** authentication type will prompt you for the path to your JSON file. You can also manually define the path in your `profiles.yml` file.

#### Example service account JSON file configuration

<File name="profiles.yml">

```yml
default:
  target: dev
  outputs:
    dev:
      type: bigquery
      threads: 16
      database: ABC123
      schema: JAFFLE_SHOP
      method: service-account
      keyfile: /Users/mshaver/Downloads/CustomRoleDefinition.json
      location: us-east1
      dataproc_batch: null
```

</File>

</TabItem>

<TabItem value="gcloud OAuth">

Prior to selecting this authentication method, you must first configure local OAuth for gcloud:

#### Local OAuth gcloud setup

1. Make sure the `gcloud` command is [installed on your computer](https://cloud.google.com/sdk/downloads).
2. Activate the application-default account with:

```shell
gcloud auth application-default login \           
  --scopes=https://www.googleapis.com/auth/bigquery,\
https://www.googleapis.com/auth/drive.readonly,\
https://www.googleapis.com/auth/iam.test,\
https://www.googleapis.com/auth/cloud-platform

# This command uses the `--scopes` flag to request access to Google Sheets. This makes it possible to transform data in Google Sheets using dbt. If your dbt project does not transform data in Google Sheets, then you may omit the `--scopes` flag.
```

A browser window should open, and you should be prompted to log into your Google account. Once you've done that, dbt will use your OAuth'd credentials to connect to BigQuery.

#### Example gcloud configuration

<File name="profiles.yml">

```yml
default:
  target: dev
  outputs:
    dev:
      type: bigquery
      threads: 16
      database: ABC123
      schema: JAFFLE_SHOP
      method: oauth
      location: us-east1
      dataproc_batch: null

```

</File>

</TabItem>

</Tabs>

## More information

Find BigQuery-specific configuration information in the [BigQuery adapter reference guide](/reference/resource-configs/bigquery-configs).