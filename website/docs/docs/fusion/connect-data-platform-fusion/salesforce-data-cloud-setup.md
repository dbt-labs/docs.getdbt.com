---
title: "Salesforce Data Cloud setup"
description: "Read this guide to learn about the Salesforce Data Cloud warehouse setup in dbt."
id: "salesforce-data-cloud-setup"
meta:
  maintained_by: dbt Labs
  authors: 'Fusion dbt maintainers'
  github_repo: 'dbt-labs/dbt-fusion'
  pypi_package: N/A
  min_core_version: N/A
  cloud_support: N/A
  min_supported_version: 'n/a'
  slack_channel_name: N/A
  slack_channel_link: N/A
  platform_name: 'Salesforec Data Cloud'
  config_page: '/reference/resource-configs/data-cloud-configs'
---

:::warning Disclaimer
This adapter is in the Alpha product stage and is not production-ready. It should only be used in sandbox or test environments. 

As we continue to develop and take in your feedback, the experience is subject to change &mdash; commands, configuration, and workflows may be updated or removed in future releases. 
:::

This `dbt-salesforce` adapter is available via the <Constant name="fusion_engine" /> CLI. To access the adapter, [install dbt Fusion](/docs/fusion/about-fusion-install). We recommend using the [VS Code Extension](/docs/fusion/install-dbt-extension) as the development interface. <Constant name="dbt_platform" /> support coming soon. 

## Prerequisites

Before you can connect dbt to the Salesforce Data Cloud, you need the following:

- A Data Cloud instance
- [An external client app that dbt connects to for the Data Cloud instance](https://help.salesforce.com/s/articleView?id=xcloud.create_a_local_external_client_app.htm&type=5), with [OAuth configured](https://help.salesforce.com/s/articleView?id=xcloud.configure_external_client_app_oauth_settings.htm&type=5). OAuth scopes must include:
  - `api` - To manage user data via APIs.
  - `refresh_token`, `offline_access` - To perform requests at any time, even when the user is offline or tokens have expired.
  - `cdp_query_api` - To execute ANSI SQL queries on Data Cloud data.
- [A private key and the `server.key` file](https://developer.salesforce.com/docs/atlas.en-us.252.0.sfdx_dev.meta/sfdx_dev/sfdx_dev_auth_key_and_cert.htm)
- User with `Data Cloud Admin` permission

## Configure Fusion

To connect dbt to Salesforce Data Cloud, set up your `profiles.yml`. Refer to the following configuration:

<File name='~/.dbt/profiles.yml'>

```yaml
company-name:
  target: dev
  outputs:
    dev:
      type: salesforce
      method: jwt_bearer
      client_id: [Consumer Key of your Data Cloud app]
      private_key_path: [local file path of your server key]
      login_url: "https://login.salesforce.com"
      username: [username on the Data Cloud Instance]
```
</File>


| Profile field | Required | Description | Example |
| --- | --- | --- | --- |
| `method` | Yes | Authentication Method. Currently, only `jwt_bearer` supported. | `jwt_bearer` |
| `client_id` | Yes | This is the `Consumer Key` from your connected app secrets. |  |
| `private_key_path` | Yes | File path of the `server.key` file in your computer. | `/Users/dbt_user/Documents/server.key` |
| `login_url` | Yes | Login URL of the Salesforce instance.  | [https://login.salesforce.com](https://login.salesforce.com/) |
| `username` | Yes | Username on the Data Cloud Instance. | dbt_user@dbtlabs.com |

<!--For username, the sample above says [Data cloud instance] but the sample here is an email-->

## More information

Find Salesforce-specific configuration information in the [Salesforce adapter reference guide](/reference/resource-configs/data-cloud-configs).