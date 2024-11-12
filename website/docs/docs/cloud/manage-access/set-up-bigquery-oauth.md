---
title: "Set up BigQuery OAuth"
description: "Learn how dbt Cloud administrators can use BigQuery OAuth to control access in a dbt Cloud account"
id: "set-up-bigquery-oauth"
pagination_next: null
---

:::info Enterprise Feature

This guide describes a feature of the dbt Cloud Enterprise plan. If you’re interested in learning more about an Enterprise plan, contact us at sales@getdbt.com.

:::


dbt Cloud supports developer [OAuth](https://cloud.google.com/bigquery/docs/authentication) with BigQuery, providing an additional layer of security for dbt enterprise users. When BigQuery OAuth is enabled for a dbt Cloud project, all dbt Cloud developers must authenticate with BigQuery in order to use the dbt Cloud IDE. The project's deployment environments will still leverage the BigQuery service account key set in the project credentials.


To set up BigQuery OAuth in dbt Cloud, a BigQuery admin must:
1. [Locate the redirect URI value](#locate-the-redirect-uri-value) in dbt Cloud.
2. [Create a BigQuery OAuth 2.0 client ID and secret](#creating-a-bigquery-oauth-20-client-id-and-secret) in BigQuery.
3. [Configure the connection](#configure-the-connection-in-dbt-cloud) in dbt Cloud.

To use BigQuery in the dbt Cloud IDE, all developers must:
1. [Authenticate to BigQuery](#authenticating-to-bigquery) in the their profile credentials.

### Locate the redirect URI value
To get started, locate the connection's redirect URI for configuring BigQuery OAuth. To do so:
 - Navigate to your account name, above your profile icon on the left side panel  
 - Select **Account settings** from the menu 
 - From the left sidebar, select **Projects** 
 - Choose the project from the list
 - Select **Connection** to edit the connection details
 - Locate the **Redirect URI** field under the **OAuth 2.0 Settings** section. Copy this value to your clipboard to use later on.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dbt-cloud-enterprise/BQ-auth/dbt-cloud-bq-id-secret-02.png" title="Accessing the BigQuery OAuth configuration in dbt Cloud" />

### Creating a BigQuery OAuth 2.0 client ID and secret
To get started, you need to create a client ID and secret for [authentication](https://cloud.google.com/bigquery/docs/authentication) with BigQuery. This client ID and secret will be stored in dbt Cloud to manage the OAuth connection between dbt Cloud users and BigQuery.

In the BigQuery console, navigate to **APIs & Services** and select **Credentials**:

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dbt-cloud-enterprise/BQ-auth/BQ-nav.gif" title="BigQuery navigation to credentials" />

On the **Credentials** page, you can see your existing keys, client IDs, and service accounts.

Set up an [OAuth consent screen](https://support.google.com/cloud/answer/6158849) if you haven't already. Then, click **+ Create Credentials** at the top of the page and select **OAuth client ID**.

Fill in the client ID configuration. **Authorized JavaScript Origins** are not applicable. Add an item to **Authorized redirect URIs** and replace `REDIRECT_URI` with the value you copied to your clipboard earlier from the connection's **OAuth 2.0 Settings** section in dbt Cloud:

| Config                       | Value           |
| ---------------------------- | --------------- |
| **Application type**         | Web application |
| **Name**                     | dbt Cloud       |
| **Authorized redirect URIs** | `REDIRECT_URI`  |

Then click **Create** to create the BigQuery OAuth app and see the app client ID and secret values. These values are available even if you close the app screen, so this isn't the only chance you have to save them.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dbt-cloud-enterprise/BQ-auth/bq-oauth-app-02.png" title="Create an OAuth app in BigQuery" />

### Configure the Connection in dbt Cloud
Now that you have an OAuth app set up in BigQuery, you'll need to add the client ID and secret to dbt Cloud. To do so:
 - Navigate back to the connection details page, as described in [Locate the redirect URI value](#locate-the-redirect-uri-value)
 - Add the client ID and secret from the BigQuery OAuth app under the **OAuth 2.0 Settings** section

### Authenticating to BigQuery
Once the BigQuery OAuth app is set up for a dbt Cloud project, each dbt Cloud user will need to authenticate with BigQuery in order to use the IDE. To do so:

- Navigate to your account name, above your profile icon on the left side panel
- Select **Account settings** from the menu
- From the left sidebar, select **Credentials**
- Choose the project from the list
- Select **Authenticate BigQuery Account**

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dbt-cloud-enterprise/developer-bq-auth.gif" title="Authenticating to BigQuery" />

You will then be redirected to BigQuery and asked to approve the drive, cloud platform, and BigQuery scopes, unless the connection is less privileged.
<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dbt-cloud-enterprise/BQ-auth/BQ-access.png" title="BigQuery access request" />

Select **Allow**. This redirects you back to dbt Cloud. You should now be an authenticated BigQuery user, ready to use the dbt Cloud IDE.

## FAQs

<FAQ path="Warehouse/bq-oauth-drive-scope" />

