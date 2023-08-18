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

<h2> Overview of {frontMatter.meta.pypi_package} </h2>

<ul>
    <li><strong>Maintained by</strong>: {frontMatter.meta.maintained_by}</li>
    <li><strong>Authors</strong>: {frontMatter.meta.authors}</li>
    <li><strong>GitHub repo</strong>: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a><a href={`https://github.com/${frontMatter.meta.github_repo}`}><img src={`https://img.shields.io/github/stars/${frontMatter.meta.github_repo}?style=for-the-badge`}/></a></li>
    <li><strong>PyPI package</strong>: <code>{frontMatter.meta.pypi_package}</code> <a href={`https://badge.fury.io/py/${frontMatter.meta.pypi_package}`}><img src={`https://badge.fury.io/py/${frontMatter.meta.pypi_package}.svg`}/></a></li>
    <li><strong>Slack channel</strong>: <a href={frontMatter.meta.slack_channel_link}>{frontMatter.meta.slack_channel_name}</a></li>
    <li><strong>Supported dbt Core version</strong>: {frontMatter.meta.min_core_version} and newer</li>
    <li><strong>dbt Cloud support</strong>: {frontMatter.meta.cloud_support}</li>
    <li><strong>Minimum data platform version</strong>: {frontMatter.meta.min_supported_version}</li>
    </ul>


<h2> Installing {frontMatter.meta.pypi_package} </h2>

pip is the easiest way to install the adapter:

<code>pip install {frontMatter.meta.pypi_package}</code>

<p>Installing <code>{frontMatter.meta.pypi_package}</code> will also install <code>dbt-core</code> and any other dependencies.</p>

<h2> Configuring {frontMatter.meta.pypi_package} </h2>

<p>For {frontMatter.meta.platform_name}-specifc configuration please refer to <a href={frontMatter.meta.config_page}>{frontMatter.meta.platform_name} Configuration</a> </p>

<p>For further info, refer to the GitHub repository: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a></p>

`dbt-databricks` is the recommend adapter for Databricks.

`dbt-databricks` includes features not available in `dbt-spark`:
- Unity Catalog support
- No need to install additional drivers or dependencies for use on the CLI
- Use of Delta Lake for all models out of the box
- SQL macros that are optimized to run with [Photon](https://docs.databricks.com/runtime/photon.html)

#### Connecting to Databricks

To connect to a data platform with dbt Core, create the appropriate _profile_ and _target_ YAML keys/values in the `profiles.yml` configuration file for your Databricks SQL Warehouse/cluster. This dbt YAML file lives in the  `.dbt/` directory of your user/home directory. For more information, refer to [Connection profiles](/docs/core/connect-data-platform/connection-profiles) and [profiles.yml](/docs/core/connect-data-platform/profiles.yml).

`dbt-databricks` can connect to Databricks SQL Warehouses and all-purpose clusters. Databricks SQL Warehouses is the recommended way to get started with Databricks.


Refer to the [Databricks docs](https://docs.databricks.com/dev-tools/dbt.html#) for more info on how
to obtain the credentials for configuring your profile.

## Host parameters

The following profile fields are always required. 

| Field     | Example | Description |
| --------- | ------- | ----------- |
|   `host`   | `yourorg.databrickshost.com` | The hostname of your cluster.<br/><br/>Don't include the `http://` or `https://` prefix.  |
|   `http_path`   | `/sql/your/http/path`  | The http path to your SQL Warehouse or all-purpose cluster. |
|  `schema`  | `my_schema`  | The name of a schema within your cluster's catalog. <br/><br/>It's _not recommended_ to use schema names that have upper case or mixed case letters.  |

## Authentication parameters

The `dbt-databricks` adapter supports both token-based authentication and OAuth client-based authentication. 

| Field     | Example | Description |
| --------- | ------- | ----------- |
|  `token`  | `dapiXXXXXXXXXXXXXXXXXXXXXXX`  | The Personal Access Token (PAT) to connect to Databricks. This is required if you are using token-based authentication. |
|  `client_id`  | `<oauth-client-id>`  | The client ID for your Databricks OAuth application. This is required if you are using OAuth-based authentication. |
|  `client_secret`  | `XXXXXXXXXXXXXXXXXXXXXXXXXXX`  | The client secret for your Databricks OAuth application. This is required if you are using OAuth-based authentication. |
|  `auth_type`  | `oauth`  | This is required if you are using OAuth-based authentication. You do not need to include this value if you are using token-based authentication. |


## Additional parameters

The following profile fields are optional to set up. They let you configure your cluster's session and dbt for your connection. 


| Profile field                 | Example                          | Description                                                                                                 |
| ----------------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `threads`                     | `8`                              | How many threads dbt should use (default is `1`)                                                            |
| `connect_retries`                     | `3`                              | How many times dbt should retry the connection to Databricks (default is `1`)                                                            |
| `connect_timeout`                     | `1000`                              | How many seconds before the connection to Databricks should timeout (default behavior is no timeouts)                                                            |
| `session_properties`          | `ansi_mode: true`         | Sets Databricks session properties used in the connection. Execute `SET -v` to see available options       |

#### Example profiles.yml for token-based authentication

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: databricks
      catalog: [optional catalog name if you are using Unity Catalog]
      schema: [schema name]
      host: [yourorg.databrickshost.com]
      http_path: [/sql/your/http/path]
      token: [dapiXXXXXXXXXXXXXXXXXXXXXXX] # Personal Access Token (PAT)
      threads: [1 or more]  # optional, default 1
```

</File>

#### Example profiles.yml for OAuth client-based authentication

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: databricks
      catalog: [optional catalog name if you are using Unity Catalog]
      schema: [schema name]
      host: [yourorg.databrickshost.com]
      http_path: [/sql/your/http/path]
      auth_type: oauth
      client_id: [OAuth-Client-ID] # The ID of your OAuth application
      client_secret: [XXXXXXXXXXXXXXXXXXXXXXXXXXX] # OAuth client secret
      threads: [1 or more]  # optional, default 1
```

</File>

## Supported Functionality

### Delta Lake

Most dbt Core functionality is supported, but some features are only available
on Delta Lake.

Delta-only features:
1. Incremental model updates by `unique_key` instead of `partition_by` (see [`merge` strategy](/reference/resource-configs/databricks-configs#the-merge-strategy))
2. [Snapshots](/docs/build/snapshots)


### Unity Catalog

The adapter `dbt-databricks>=1.1.1` supports the 3-level namespace of Unity Catalog (catalog / schema / relations) so you can organize and secure your data the way you like.
