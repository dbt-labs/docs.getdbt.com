---
title: "Query tags"
sidebar_label: "Query tags"
description: "Attach custom key-value metadata to Databricks SQL queries using connection-level and model-level query tags."
---

_Available in versions 1.11 or higher_

[Query tags](https://docs.databricks.com/aws/en/sql/user/queries/query-tags) are a Databricks feature that allows you to attach custom key-value metadata to SQL queries. This metadata appears in system tables and query history, making it useful for tracking query costs, debugging, and auditing.

:::note Feature availability

Query tags may not yet be available in all Databricks workspaces. Check the [Databricks documentation](https://docs.databricks.com/aws/en/sql/user/queries/query-tags) for the latest information on feature availability.

:::

dbt-databricks supports setting query tags at both the connection level (in your profile) and the model level (in model configs). When you run dbt, it automatically includes default tags containing dbt metadata, such as the model name and dbt version.

### Default query tags

dbt-databricks automatically adds the following tags to every query:

| Tag key | Description |
|---------|-------------|
| `@@dbt_model_name` | The name of the model being executed |
| `@@dbt_core_version` | The version of dbt-core being used |
| `@@dbt_databricks_version` | The version of dbt-databricks being used |
| `@@dbt_materialized` | The materialization type (table, view, incremental, and so on.) |

These reserved keys cannot be overridden by user-defined tags.

### Configuring query tags

You can set query tags at the connection level in your profile or at the model level in your model config. Model-level tags take precedence over connection-level tags.

#### Connection-level query tags

To set query tags for all queries in a connection, add the `query_tags` parameter to your `profiles.yml` file as a JSON string:

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: databricks
      catalog: my_catalog
      schema: my_schema
      host: yourorg.databrickshost.com
      http_path: /sql/your/http/path
      token: dapiXXXXXXXXXXXXXXXXXXXXXXX
      query_tags: '{"team": "analytics", "project": "customer_360"}'
```

</File>

#### Model-level query tags

To set query tags for a specific model, use the `query_tags` config:

<File name='models/my_model.sql'>

```sql
{{ config(
    query_tags = {'cost_center': 'marketing', 'priority': 'high'}
) }}

select * from {{ ref('upstream_model') }}
```

</File>

You can also configure query tags in your `dbt_project.yml` for groups of models:

<File name='dbt_project.yml'>

```yaml
models:
  my_project:
    marketing:
      +query_tags: {'department': 'marketing'}
    finance:
      +query_tags: {'department': 'finance'}
```

</File>

### Tag precedence and merging

When query tags are defined at multiple levels, they are merged with the following precedence (highest to lowest):

1. Model-level tags (from `config()` or schema.yml)
2. Connection-level tags (from `profiles.yml`)
3. Default dbt tags (automatically added)

If the same key appears at multiple levels, the higher-precedence value wins.

:::note Why connection-level tags?

Due to how dbt merges configs, specifying `query_tags` at the model level in `config()` or `schema.yml` will **replace** any `query_tags` you defined in `dbt_project.yml` rather than merging them. This is standard dbt behavior for dictionary configs.

To work around this limitation, dbt-databricks accepts `query_tags` in your connection profile (`profiles.yml`). Connection-level tags are always merged with model-level tags, allowing you to define common tags once in your profile and selectively add or override specific keys at the model level.

**Recommended pattern:**
- Define shared tags (team, project, environment) in your profile's `query_tags`
- Use model-level `query_tags` when you need to add model-specific tags

:::

### Limitations

- **Maximum 20 tags**: The total number of query tags (including default tags) cannot exceed 20.
- **Value length**: Tag values must be at most 128 characters. Default tag values that exceed this limit are automatically truncated.
- **Special characters**: Backslash (`\`), comma (`,`), and colon (`:`) characters in tag values are automatically escaped. A warning is logged when escaping occurs.
- **Reserved keys**: The keys `@@dbt_model_name`, `@@dbt_core_version`, `@@dbt_databricks_version`, and `@@dbt_materialized` are reserved and cannot be used in user-defined tags.

### Viewing query tags

Query tags appear in Databricks system tables and query history. For information on how to query and analyze query tags, see the [Databricks query tags documentation](https://docs.databricks.com/aws/en/sql/user/queries/query-tags).
