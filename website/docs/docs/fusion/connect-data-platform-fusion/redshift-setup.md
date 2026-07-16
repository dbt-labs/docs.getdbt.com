---
title: "Redshift setup"
description: "Read this guide to learn about the Redshift warehouse setup in dbt Fusion."
id: "redshift-setup"
meta:
  maintained_by: dbt Labs
  authors: 'Fusion dbt maintainers'
  github_repo: 'dbt-labs/dbt-adapters'
  pypi_package: 'dbt-redshift'
  cloud_support: Supported
  min_supported_version: 'n/a'
  slack_channel_name: '#db-redshift'
  slack_channel_link: 'https://getdbt.slack.com/archives/C01DRQ178LQ'
  platform_name: 'Redshift'
  config_page: '/reference/resource-configs-fusion/redshift-configs'
---

# Redshift setup <Lifecycle status='preview' />

You can configure the Redshift adapter by running `dbt init` in your CLI or manually providing the `profiles.yml` file with the fields configured for your authentication type.

The Redshift adapter for Fusion supports the following [authentication methods](#supported-authentication-types):
- Password
- IAM profile

## Configure Fusion

Executing `dbt init` in your CLI will prompt for the following fields:
- **Host:** The hostname of your Redshift cluster
- **User:** Username of the account that will be connecting to the database
- **Database:** The database name
- **Schema:** The schema name
- **Port (default: 5439):** Port for your Redshift environment

Alternatively, you can manually create the `profiles.yml` file and configure the fields. See examples in [authentication](#supported-authentication-types) section for formatting. If there is an existing `profiles.yml` file, you are given the option to retain the existing fields or overwrite them. 

Next, select your authentication method. Follow the on-screen prompts to provide the required information.

## Supported authentication types

<Tabs>
<TabItem value="Password">

Use your Redshift user's password to authenticate. You can also manually enter it in plain text into the `profiles.yml` file configuration.

#### Example password configuration

<File name="profiles.yml">

```yml
default:
  target: dev
  outputs:
    dev:
      type: redshift
      port: 5439
      database: JAFFLE_SHOP
      schema: JAFFLE_TEST
      ra3_node: true
      method: database
      host: ABC123.COM
      user: JANE.SMITH@YOURCOMPANY.COM
      password: ABC123
      threads: 16
```

</File>
</TabItem>

<TabItem value="IAM profile">

Specify the IAM profile to use to connect your Fusion sessions. You will need to provide the following information:
- **IAM Profile:** The profile name
- **Cluster ID:** The unique identifier for your AWS cluster
- **Region:** Your AWS region (for example, us-east-1)
- **Use RA3 node type (y/n):** Use high performance AWS RA3 node

#### Example password configuration

<File name="profiles.yml">

```yml
default:
  target: dev
  outputs:
    dev:
      type: redshift
      port: 5439
      database: JAFFLE_SHOP
      schema: JAFFLE_TEST
      ra3_node: false
      method: iam
      host: YOURHOSTNAME.COM
      user: JANE.SMITH@YOURCOMPANY.COM
      iam_profile: YOUR_PROFILE_NAME
      cluster_id: ABC123
      region: us-east-1
      threads: 16
```

</File>
</TabItem>
</Tabs>

## More information

Find Redshift-specific configuration information in the [Redshift adapter reference guide](/reference/resource-configs/redshift-configs).
