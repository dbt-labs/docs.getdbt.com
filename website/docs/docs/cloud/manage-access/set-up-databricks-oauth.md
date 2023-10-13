---
title: "Set up Databricks OAuth"
description: "Learn how dbt Cloud administrators can use Databricks OAuth to control access in a dbt Cloud account."
id: "set-up-databricks-oauth"
---

:::info Enterprise Feature

This guide describes a feature of the dbt Cloud Enterprise plan. If you’re interested in learning more about an Enterprise plan, contact us at sales@getdbt.com.

:::

dbt Cloud supports developer OAuth ([OAuth for partner solutions](https://docs.databricks.com/en/integrations/manage-oauth.html)) with Databricks, providing an additional layer of security for dbt enterprise users. When you enable Databricks OAuth for a dbt Cloud project, all dbt Cloud developers must authenticate with Databricks in order to use the dbt Cloud IDE. The project's deployment environments will still leverage the Databricks authentication method set at the environment level.

:::tip Beta Feature

Databricks OAuth support in dbt Cloud is a [beta feature](/docs/dbt-versions/product-lifecycles#dbt-cloud) and subject to change without notification. More updates to this feature coming soon.

Current limitations:
- Databrick's OAuth applications are in public preview
- The current experience requires the IDE to be restarted every hour (access tokens expire after 1 hour - [workaround](https://docs.databricks.com/en/integrations/manage-oauth.html#override-the-default-token-lifetime-policy-for-dbt-core-power-bi-or-tableau-desktop))
 
:::

### Configure Databricks OAuth (Databricks admin)

To get started, you will need to [add dbt as an OAuth application](https://docs.databricks.com/en/integrations/configure-oauth-dbt.html) with Databricks, in 2 steps:

1. From your terminal, [authenticate to the Databricks Account API](https://docs.databricks.com/en/integrations/configure-oauth-dbt.html#authenticate-to-the-account-api) with the Databricks CLI. You authenticate using:
  - OAuth for users ([prerequisites](https://docs.databricks.com/en/dev-tools/auth.html#oauth-u2m-auth))
  - Oauth for service principals ([prerequisites](https://docs.databricks.com/en/dev-tools/auth.html#oauth-m2m-auth))
  - Username and password (must be account admin)
2. In the same terminal, **add dbt Cloud as an OAuth application** using `curl` and the [OAuth Custom App Integration API](https://docs.databricks.com/api/account/customappintegration/create)

For the second step, you can use this example `curl` to authenticate with your username and password, replacing values as defined in the following table:

```shell
curl -u USERNAME:PASSWORD https://accounts.cloud.databricks.com/api/2.0/accounts/ACCOUNT_ID/oauth2/custom-app-integrations -d '{"redirect_urls": ["https://YOUR_ACCESS_URL", "https://YOUR_ACCESS_URL/complete/databricks"], "confidential": true, "name": "NAME", "scopes": ["sql", "offline_access"]}'
```

These parameters and descriptions will help you authenticate with your username and password:

| Parameter | Description |
| ------ | ----- |
| **USERNAME** | Your Databricks username (account admin level) |
| **PASSWORD** | Your Databricks password (account admin level) |
| **ACCOUNT_ID** | Your Databricks [account ID](https://docs.databricks.com/en/administration-guide/account-settings/index.html#locate-your-account-id) |
| **YOUR_ACCESS_URL** | The [appropriate Access URL](/docs/cloud/about-cloud/regions-ip-addresses) for your dbt Cloud account region and plan |
| **NAME** | The integration name (i.e 'databricks-dbt-cloud')

After running the `curl`, you'll get an API response that includes the `client_id` and `client_secret` required in the following section. At this time, this is the only way to retrieve the secret. If you lose the secret, then the integration needs to be [deleted](https://docs.databricks.com/api/account/customappintegration/delete) and re-created.


### Configure the Connection in dbt Cloud (dbt Cloud project admin)

Now that you have an OAuth app set up in Databricks, you'll need to add the client ID and secret to dbt Cloud. To do so:
 - go to Settings by clicking the gear in the top right.
 - on the left, select **Projects** under **Account Settings**
 - choose your project from the list
 - select **Connection** to edit the connection details
 - add the `OAuth Client ID` and `OAuth Client Secret` from the Databricks OAuth app under the **Optional Settings** section

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dbt-cloud-enterprise/DBX-auth/dbt-databricks-oauth.png" title="Adding Databricks OAuth application client ID and secret to dbt Cloud" />

### Authenticating to Databricks (dbt Cloud IDE developer)

Once the Databricks connection via OAuth is set up for a dbt Cloud project, each dbt Cloud user will need to authenticate with Databricks in order to use the IDE. To do so:

- Click the gear icon at the top right and select **Profile settings**.
- Select **Credentials**.
- Choose your project from the list
- Select `OAuth` as the authentication method, and click **Save**
- Finalize by clicking the **Connect Databricks Account** button

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dbt-cloud-enterprise/DBX-auth/dbt-databricks-oauth-user.png" title="Connecting to Databricks from an IDE user profile" />

You will then be redirected to Databricks and asked to approve the connection. This redirects you back to dbt Cloud. You should now be an authenticated Databricks user, ready to use the dbt Cloud IDE.
