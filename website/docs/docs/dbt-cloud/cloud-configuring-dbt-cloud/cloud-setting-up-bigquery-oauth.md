---
title: "Setting up BigQuery OAuth"
---

:::info Enterprise Feature

This guide describes a feature of the dbt Cloud Enterprise plan. If you’re interested in learning more about an Enterprise plan, contact us at sales@getdbt.com.

:::
### Overview


dbt Cloud supports developer [OAuth](https://cloud.google.com/bigquery/docs/authentication) with BigQuery, providing an additional layer of security for our enterprise customers. When BigQuery OAuth is enabled for a dbt Cloud project, all dbt Cloud developers must authenticate with BigQuery in order to develop using the dbt Cloud IDE. The project's deployment environments will still leverage the BigQuery service account key set in the project credentials.


To set up BigQuery OAuth in dbt Cloud, a BigQuery admin must:
1. [Create a BigQuery OAuth 2.0 client ID and secret](/cloud-setting-up-bigquery-oauth#creating-a-bigquery-oauth-20-client-id-and-secret) in BigQuery.
2. [Configure the connection](/cloud-setting-up-bigquery-oauth#configure-the-connection-in-dbt-cloud) in dbt Cloud.

To use BigQuery in the dbt Cloud IDE, all developers must:
1. [Authenticate to BigQuery](/cloud-setting-up-bigquery-oauth#authenticating-to-bigquery) in the their profile credentials.


### Creating a BigQuery OAuth 2.0 client ID and secret
To get started, you need to create a client ID and secret for [authentication](https://cloud.google.com/bigquery/docs/authentication) with BigQuery. This client ID and secret will be stored in dbt Cloud to manage the OAuth connection between dbt Cloud users and BigQuery.

In the BigQuery console, navigate to **APIs & Services** and select the **Credentials** page:

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dbt-cloud-enterprise/BQ-auth/BQ-nav.gif" title="BigQuery navigation to credentials" />

Here you'll see your existing keys, client IDs and service accounts. Note, if you haven't set up an [OAuth consent screen](https://support.google.com/cloud/answer/6158849) before, you'll need to do that before proceding. 

Otherwise, click the **+ Create Credentials** at the  of the page, and select **OAuth client ID**.

Fill in the application details as follows:

| Config | Value |
| ------ | ----- |
| **Application type** | Web application |
| **Name** | dbt Cloud |
| **Authorized Javascript origins** | https://cloud.getdbt.com |
| **Authorized Redirect URIs** | https://cloud.getdbt.com/complete/bigquery |

If you're a dbt Cloud single tenant customer, you'll need to replace **cloud.getdbt.com** with the hostname of
your dbt Cloud instance.

Then click **Create**, which will create the BigQuery OAuth app and will display the app client ID and secret. These values will be available even if you close the app screen, so this is not the only chance you have to save them. 

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dbt-cloud-enterprise/BQ-auth/bq-oauth-app.gif" title="Creating an OAuth app in BigQuery" />



### Configure the Connection in dbt Cloud
Now that you have an OAuth app set up in BigQuery, you'll need to add the client ID and secret to dbt Cloud. To do so:
 - navigate to your **Account Settings** pane
 - select the **Projects** tab
 - find your project
 - select **Connection** to edit the connection details
 - add the client ID and secret from the BigQuery OAuth app under the **OAuth2.0 Settings** section


<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dbt-cloud-enterprise/BQ-auth/dbt-cloud-bq-id-secret.gif" title="Adding BigQuery OAuth application client ID and secret to dbt Cloud" />

### Authenticating to BigQuery
Once the BigQuery OAuth app has been set up for the dbt Cloud project, each dbt Cloud user will need to authenticate with BigQuery in order to use the IDE. To do so:
- navigate to **Your Profile** settings
- select the **Credentials** tab
- find your project
- select **Authenticate BigQuery Account**
<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dbt-cloud-enterprise/developer-bq-auth.gif" title="Authenticating to BigQuery" />

You will then be redirected to BigQuery and asked to approve the drive, cloud platform, and BigQuery scopes, unless the connection is less privileged. 
<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dbt-cloud-enterprise/BQ-auth/BQ-access.png" title="BigQuery access request" />

Select **Allow**, which will redirect you back to dbt Cloud. You should now be an authenticated BigQuery user, ready to use the dbt Cloud IDE.