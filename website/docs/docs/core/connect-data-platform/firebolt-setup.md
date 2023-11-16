---
title: "Firebolt setup"
description: "Read this guide to learn about the Firebolt warehouse setup in dbt."
meta:
  maintained_by: Firebolt
  authors: 'Firebolt'
  github_repo: 'firebolt-db/dbt-firebolt'
  pypi_package: 'dbt-firebolt'
  min_core_version: 'v1.1.0'
  cloud_support: Not Supported
  min_supported_version: 'n/a'
  slack_channel_name: '#db-firebolt'
  slack_channel_link: 'https://getdbt.slack.com/archives/C03K2PTHHTP'
  platform_name: 'Firebolt'
  config_page: '/reference/resource-configs/firebolt-configs'
---


Some core functionality may be limited. If you're interested in contributing, check out the source code for the repository listed below.


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

<code>python -m pip install {frontMatter.meta.pypi_package}</code>

<p>Installing <code>{frontMatter.meta.pypi_package}</code> will also install <code>dbt-core</code> and any other dependencies.</p>

<h2> Configuring {frontMatter.meta.pypi_package} </h2>

<p>For {frontMatter.meta.platform_name}-specifc configuration please refer to <a href={frontMatter.meta.config_page}>{frontMatter.meta.platform_name} Configuration</a> </p>

<p>For further info, refer to the GitHub repository: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a></p>


For other information including Firebolt feature support, see the [GitHub README](https://github.com/firebolt-db/dbt-firebolt/blob/main/README.md) and the [changelog](https://github.com/firebolt-db/dbt-firebolt/blob/main/CHANGELOG.md).


## Connecting to Firebolt

To connect to Firebolt from dbt, you'll need to add a [profile](https://docs.getdbt.com/docs/core/connection-profiles) to your `profiles.yml` file. A Firebolt profile conforms to the following syntax:

<File name='profiles.yml'>

```yml
<profile-name>:
  target: <target-name>
  outputs:
    <target-name>:
      type: firebolt
      user: "<username>"
      password: "<password>"
      database: "<database-name>"
      engine_name: "<engine-name>"
      schema: <tablename-prefix>
      threads: 1
      #optional fields
      jar_path: <path-to-local-jdbc-driver>
      host: "<hostname>"
      account_name: "<account-name>"
```

</File>


#### Description of Firebolt Profile Fields

To specify values as environment variables, use the format `{{ env_var('<variable_name>' }}`. For example, `{{ env_var('DATABASE_NAME' }}`. 

| Field                    | Description |
|--------------------------|--------------------------------------------------------------------------------------------------------|
| `type`                   | This must be included either in `profiles.yml` or in the `dbt_project.yml` file. Must be set to `firebolt`. |
| `user`                   | Required. A Firebolt username with adequate permissions to access the specified `engine_name`. |
| `password`               | Required. The password associated with the specified `user`. |
| `database`               | Required. The name of the Firebolt database to connect to. |
| `engine_name`            | Required in version 0.21.10 and later. Optional in earlier versions. The name (not the URL) of the Firebolt engine to use in the specified `database`. This must be a general purpose read-write engine and the engine must be running. If omitted in earlier versions, the default engine for the specified `database` is used. |
| `schema`                 | Recommended. A string to add as a prefix to the names of generated tables when using the [custom schemas workaround](https://docs.getdbt.com/reference/warehouse-profiles/firebolt-profile#supporting-concurrent-development). |
| `threads`                | Required. Must be set to `1`. Multi-threading is not currently supported. |
| `jar_path`               | Required only with versions earlier than 0.21.0. Ignored in 0.21.0 and later. The path to your JDBC driver on your local drive. |
| `host`                   | Optional. The host name of the connection. For all customers it is `api.app.firebolt.io`, which will be used if omitted. |
| `account_name`           | Required if more than one account is associated with the specified `user1`. Specifies the account name (not the account ID) under which the specified `database` exists. If omitted, the default account is assumed. |

      
#### Troubleshooting Connections

If you encounter issues connecting to Firebolt from dbt, make sure the following criteria are met:
- The engine must be a general-purpose read-write engine, not an analytics engine.
- You must have adequate permissions to access the engine.
- The engine must be running.
- If you're not using the default engine for the database, you must specify an engine name.
- If there is more than one account associated with your credentials, you must specify an account.


## Supporting Concurrent Development

In dbt, database schemas are used to compartmentalize developer environments so that concurrent development does not cause <Term id="table" /> name collisions. Firebolt, however, does not currently support database schemas (it is on the roadmap). To work around this, we recommend that you add the following macro to your project. This macro will take the `schema` field of your `profiles.yml` file and use it as a table name prefix.

```sql
-- macros/generate_alias_name.sql
{% macro generate_alias_name(custom_alias_name=none, node=none) -%}
    {%- if custom_alias_name is none -%}
        {{ node.schema }}__{{ node.name }}
    {%- else -%}
        {{ node.schema }}__{{ custom_alias_name | trim }}
    {%- endif -%}
{%- endmacro %}
```

For an example of how this works, let’s say Shahar and Eric are both working on the same project.

In her `.dbt/profiles.yml`, Sharar sets `schema=sh`, whereas Eric sets `schema=er` in his. When each runs the `customers` model, the models will land in the database as tables named `sh_customers` and `er_customers`, respectively. When running dbt in production, you would use yet another `profiles.yml` with a string of your choice.
