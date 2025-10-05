---
title: "Salesforce Data Cloud setup"
description: "Read this guide to learn about the Salesforce Data Cloud warehouse setup in dbt."
id: "postgres-setup"
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


## Installing dbt-salesforce
This adapter is only available via dbt Fusion. In order to access the adapter, install dbt Fusion and the adapter will be available for usage. We recommend using the VS Code Extension for development. 


## Profile Configuration

Salesforce Data Cloud targets should be set up using the following configuration in your `profiles.yml` file. Prior to setting up the Data Cloud profiles.yml, you will need:

- A Data Cloud instance with an app configurated for dbt ##TODO add in link for how to set it up
- User with `Data Cloud admin` permission set

<File name='~/.dbt/profiles.yml'>

```yaml
company-name:
  target: dev
  outputs:
    dev:
      type: salesforce
      method: [auth method]
      client_id: [client id of your Data Cloud app]
      private_key_path: [local file path of your server key]
      login_url: "https://login.salesforce.com"
      username: [Data Cloud instance]
```

salesforce:
  outputs:
    salesforce:
      type: salesforce
      method: jwt_bearer
      client_id: "3MVG9azVmavckRRTHNV2_fE_OhgCA6moSG91tgRlo9Y1epZ7GLgotfJ7DdC3M.PVICcX1fRlle7x7gJGslavv"
      private_key_path: "/Users/amychen/Downloads/server.key"
      login_url: "https://login.salesforce.com"
      username: "storm.050b6314da1346@salesforce.com"
  target: salesforce

</File>

### Configurations
