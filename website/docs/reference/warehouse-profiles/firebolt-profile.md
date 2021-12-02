---
title: "Firebolt Profile"
---


:::info Community plugin

Some core functionality may be limited. If you're interested in contributing, check out the source code for each repository listed below.

:::

## Overview of dbt-synapse

**Maintained by:** Community  
**Author:** Anders Swanson and Eric Ford
**Source:** [Github](https://github.com/firebolt-db/dbt-firebolt)  
**dbt Cloud:** Not Supported  

![dbt-synapse stars](https://img.shields.io/github/stars/firebolt-db/dbt-firebolt?style=for-the-badge)

The package can be installed from PyPI with:

```
pip install dbt-firebolt
```
For more complete information including Firebolt feature support, see the [README](https://github.com/firebolt-db/dbt-firebolt/blob/main/README.md)

### Connecting to Firebolt

To connect to Firebolt from dbt, you'll need to add a new [profile](https://docs.getdbt.com/dbt-cli/configure-your-profile) to your `profiles.yml` file. A Firebolt profile conforms to the following syntax:

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

### Setup Recommendations

#### `quote_columns`

To prevent a warning, you should add a configuration as below to your `dbt_project.yml`. For more info, see the [relevant dbt docs page](https://docs.getdbt.com/reference/resource-configs/quote_columns).


<File name>
```yml
seeds:
  +quote_columns: false  #or `true` if you have csv column headers with spaces
```
</File>

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

In her `.dbt/profiles.yml`, Sharar sets `schema=sh`, whereas Eric sets `schema=er` in his. When each runs the `customers` model, the models will land in the database as tables named `sh_customers` and `er_customers`, respectively. When running dbt in production, you would use yet another `profiles.yml` with nothing set in the `schema` field (or any string of your choice).
