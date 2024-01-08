---
title: "Databricks setup"
description: "Read this guide to learn about the Databricks warehouse setup in dbt."
id: "databricks-setup"
meta:
  maintained_by: Databricks
  authors: 'some dbt loving Bricksters'
  github_repo: 'databricks/dbt-databricks'
  pypi_package: 'dbt-databricks'
  min_core_version: 'v0.18.0'
  cloud_support: Supported
  min_supported_version: 'Databricks SQL or DBR 12+'
  slack_channel_name: '#db-databricks-and-spark'
  slack_channel_link: 'https://getdbt.slack.com/archives/CNGCW8HKL'
  platform_name: 'Databricks'
  config_page: '/reference/resource-configs/databricks-configs'
--- 

<Snippet path="warehouse-setups-cloud-callout" />

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />


`dbt-databricks` is the recommended adapter for Databricks. It includes features not available in `dbt-spark`, such as:
- Unity Catalog support
- No need to install additional drivers or dependencies for use on the CLI
- Use of Delta Lake for all models out of the box
- SQL macros that are optimized to run with [Photon](https://docs.databricks.com/runtime/photon.html)

## Connecting to Databricks

To connect to a data platform with dbt Core, create the appropriate _profile_ and _target_ YAML keys/values in the `profiles.yml` configuration file for your Databricks SQL Warehouse/cluster. This dbt YAML file lives in the  `.dbt/` directory of your user/home directory. For more info, refer to [Connection profiles](/docs/core/connect-data-platform/connection-profiles) and [profiles.yml](/docs/core/connect-data-platform/profiles.yml).

`dbt-databricks` can connect to Databricks SQL Warehouses and all-purpose clusters. Databricks SQL Warehouses is the recommended way to get started with Databricks.

Refer to the [Databricks docs](https://docs.databricks.com/dev-tools/dbt.html#) for more info on how to obtain the credentials for configuring your profile.

### Examples {#examples}

You can use either token-based authentication or OAuth client-based authentication to connect to Databricks. Refer to the following examples for more info on how to configure your profile for each type of authentication.

<Tabs queryString="tokenoauth">

<TabItem value="token" label="Token-based authentication">

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: databricks
      catalog: [optional catalog name if you are using Unity Catalog]
      schema: [schema name] # Required
      host: [yourorg.databrickshost.com] # Required
      http_path: [/sql/your/http/path] # Required
      token: [dapiXXXXXXXXXXXXXXXXXXXXXXX] # Required Personal Access Token (PAT) if using token-based authentication
      threads: [1 or more]  # Optional, default 1
```

</File>

</TabItem>

<TabItem value="oauth" label="OAuth client-based authentication">


<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: databricks
      catalog: [optional catalog name if you are using Unity Catalog]
      schema: [schema name] # Required
      host: [yourorg.databrickshost.com] # Required
      http_path: [/sql/your/http/path] # Required
      auth_type: oauth # Required if using OAuth-based authentication
      client_id: [OAuth-Client-ID] # The ID of your OAuth application. Required if using OAuth-based authentication
      client_secret: [XXXXXXXXXXXXXXXXXXXXXXXXXXX] # OAuth client secret. # Required if using OAuth-based authentication
      threads: [1 or more]  # Optional, default 1
```
</File>

</TabItem>

</Tabs>

## Host parameters

The following profile fields are always required. 

| Field     | Description | Example |
| --------- | ------- | ----------- |
|   `host`  | The hostname of your cluster.<br/><br/>Don't include the `http://` or `https://` prefix. |  `yourorg.databrickshost.com` | 
|   `http_path`   | The http path to your SQL Warehouse or all-purpose cluster. | `/sql/your/http/path`  | 
|  `schema`  |  The name of a schema within your cluster's catalog. <br/><br/>It's _not recommended_ to use schema names that have upper case or mixed case letters.  | `my_schema`  |

## Authentication parameters

The `dbt-databricks` adapter supports both [token-based authentication](/docs/core/connect-data-platform/databricks-setup?tokenoauth=token#examples) and [OAuth client-based authentication](/docs/core/connect-data-platform/databricks-setup?tokenoauth=oauth#examples).  

Refer to the following **required** parameters to configure your profile for each type of authentication:

| Field     | Authentication type | Description | Example | Authentication type |
| --------- | ------- | ----------- | ---- | 
|  `token`  |  Token-based  | The Personal Access Token (PAT) to connect to Databricks.  | `dapiXXXXXXXXX`<br /> `XXXXXXXXXXXXXX`  |
|  `client_id`  | OAuth-based |  The client ID for your Databricks OAuth application.<br />  | `<oauth-client-id>`  | 
|  `client_secret`  | OAuth-based |  The client secret for your Databricks OAuth application. <br />  | `XXXXXXXXXXXXX`<br /> `XXXXXXXXXXXXXX`  |  
|  `auth_type`  |  OAuth-based |  The type of authorization needed to connect to Databricks. <br /> | `oauth`  |

## Additional parameters

The following profile fields are optional to set up. They help you configure how your cluster's session and dbt work for your connection.

| Profile field  |  Description  | Example   |
| ------------- | ------------------- | --------------- |
| `threads`   | The number of threads dbt should use (default is `1`) |`8`  | 
| `connect_retries`  | The number of times dbt should retry the connection to Databricks (default is `1`)  |`3`   | 
| `connect_timeout`     | How many seconds before the connection to Databricks should timeout (default behavior is no timeouts)  | `1000` | 
| `session_properties`  | This sets the Databricks session properties used in the connection. Execute `SET -v` to see available options  |`ansi_mode: true` | 

## Supported Functionality

### Delta Lake

Most dbt Core functionality is supported, but some features are only available
on Delta Lake.

Delta-only features:
1. Incremental model updates by `unique_key` instead of `partition_by` (see [`merge` strategy](/reference/resource-configs/databricks-configs#the-merge-strategy))
2. [Snapshots](/docs/build/snapshots)


### Unity Catalog

The adapter `dbt-databricks>=1.1.1` supports the 3-level namespace of Unity Catalog (catalog / schema / relations) so you can organize and secure your data the way you like.
