---
title: "Firebolt Profile"
---


Some core functionality may be limited. If you're interested in contributing, check out the source code for the repository listed below.


## Overview of dbt-firebolt

**Maintained by:** Firebolt  
**Author:** Anders Swanson and Eric Ford     
**Source:** [Github](https://github.com/firebolt-db/dbt-firebolt)  
**dbt Cloud:** Not Supported  

![dbt-firebolt stars](https://img.shields.io/github/stars/firebolt-db/dbt-firebolt?style=for-the-badge)

The package can be installed from PyPI with:

```
pip install dbt-firebolt
```
For more complete information including Firebolt feature support, see the [README](https://github.com/firebolt-db/dbt-firebolt/blob/main/README.md)


### Connecting to Firebolt

To connect to Firebolt from dbt, you'll need to add a [profile](https://docs.getdbt.com/dbt-cli/configure-your-profile) to your `profiles.yml` file. A Firebolt profile conforms to the following syntax:

<File name='profiles.yml'>

```yml
<profile-name>:
  target: <target-name>
  outputs:
    <target-name>:
      type: firebolt
      user: <username>
      password: <password>
      database: <database-name>
      schema: <tablename-prefix>
      jar_path: <path-to-local-jdbc-driver>
      threads: 1

      #optional fields
      engine_name: <engine-name>
      host: <hostname>
      account_name: <account-name>
```

</File>


#### Description of Firebolt Profile Fields

| Field                    | Required | Description |
|--------------------------|----------|--------------------------------------------------------------------------------------------------------|
| `type`                   | Yes | Must be set to `firebolt`. This must be included either in `profiles.yml` or in the `dbt_project.yml` file. |
| `user`                   | Yes | Your Firebolt username. |
| `password`               | Yes | Your Firebolt password. |
| `database`               | Yes | The name of your Firebolt database. |
| `schema`                 | Yes | A string to prefix the names of generated tables with, if using the [custom schemas workaround below](https://github.com/firebolt-db/dbt-firebolt#supporting-concurrent-development). |
| `jar_path`               | Yes | The path to your JDBC driver on your local drive. |
| `threads`                | Yes | Must be set to `1`. Multi-threading is not currently supported. |
| `engine_name`            | No | The name (not the URL) of the Firebolt engine to use. If omitted, it will use your default engine. |
| `host`                   | No | The host name of the connection. For all customers it is `api.app.firebolt.io`, which will be used if omitted. |
| `account_name`           | No | The account name (not the account ID). If omitted, it will use your default account. |

#### Troubleshooting Connections

If you encounter issues connecting to Firebolt from dbt, make sure the following criteria are met:
- The engine must be a general-purpose read-write engine, not an analytics engine.
- You must have adequate permissions to access the engine.
- The engine must be running.
- If you're not using the default engine for the database, you must specify an engine name.
- If there is more than one account associated with your credentials, you must specify an account.

To connect to Firebolt from dbt, you'll need to add a new [profile](https://docs.getdbt.com/dbt-cli/configure-your-profile) to your `profiles.yml` file. A Firebolt profile conforms to the following syntax:


#### Supporting Concurrent Development

In dbt, database schemas are used to compartmentalize developer environments so that concurrent development does not cause table name collisions. Firebolt, however, does not currently support database schemas (it is on the roadmap). To work around this, we recommend that you add the following macro to your project. This macro will take the `schema` field of your `profiles.yml` file and use it as a table name prefix.

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
