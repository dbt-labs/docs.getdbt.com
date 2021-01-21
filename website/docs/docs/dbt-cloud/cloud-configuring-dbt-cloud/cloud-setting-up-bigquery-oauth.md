---
title: "Setting up BigQuery OAuth"
---

:::info Enterprise Feature

This guide describes a feature of the dbt Cloud Enterprise plan. If you’re interested in learning more about an Enterprise plan, contact us at sales@getdbt.com.

:::

dbt Cloud supports [OAuth authentication](https://cloud.google.com/bigquery/docs/authentication) with BigQuery. When BigQuery OAuth is enabled, users can interact with the BigQuery warehouse as individual users, rather than leveraging a shared service level authentication. 

:::info Some Pre-Work Required

Before setting up a Client ID & Secret, you'll have to have your existing BigQuery Settings in order. We recommend using a Service Account JSON file, and have a walkthrough for that [here](https://docs.getdbt.com/tutorial/setting-up/#generate-bigquery-credentials)

:::

### Configuring a Client ID & Secret
To enable BigQuery OAuth, you will need a Client ID & Secret for [authentication](https://cloud.google.com/bigquery/docs/authentication) with BigQuery to manage the OAuth connection between dbt Cloud and BigQuery.

In the BigQuery console you'll want to navigate to the Credentials page:

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/gsuite/bq_oauth/bq_oauth_creds_bq_sidebar.png" title="BigQuery Sidebar Menu to Credentials Page" />

There you'll see your existing Keys, Client IDs and Service Accounts - you'll want to click the "Create Credentials" button at the top and follow the steps, like this:

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/gsuite/bq_oauth/create_creds_bq_oauth.gif" title="Creating OAuth Credentials in BigQuery" />

For the fields we recommend the following:
- **Application Type:** Web application
- **Name:** dbt cloud
- **Authorized JavaScript origins:** Not required, but some organizations may have URIs they'd like to use here
- **Authorized redirect URIs:** Not required, but some organizations may have URIs they'd like to use here

Then, click the blue Create button, which will display your Client ID and Client Secret, with handy clipboard buttons for copying into other screens, which is exactly whaty we're about to do. These values will continue to be available in your Credentials screen in perpetuity, *this is not the only chance you have to access them*. 


### Configure the Connection in dbt Cloud

Back in dbt Cloud, you'll want to navigate to your Connection page for BigQuery. There you'll be able to click the Edit button in the top corner to enable writing into the OAuth 2.0 Settings boxes near the bottom.

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/gsuite/bq_oauth/dbt_cloud_bq_cred_edit.png" title="Edit Button in dbt Cloud BQ Connection" />

With Editing enabled, you can copy paste the Client ID and the Client Secret you created in BigQuery into their respective boxes, and return to the top of the page, to Save your new OAuth Credentials. 

