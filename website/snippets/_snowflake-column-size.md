:::warning Snowflake column size change
[Snowflake plans to increase](https://docs.snowflake.com/en/release-notes/bcr-bundles/un-bundled/bcr-2118) the default column size for string and binary data types in September 2026. `dbt-snowflake` versions below v1.10.6 may fail to build certain incremental models when this change is deployed.

<Expandable alt_header="Assess impact and required actions">

If you're using a `dbt-snowflake` version below v1.10.6 or have not yet migrated to a [release track](/docs/dbt-versions/dbt-release-tracks) in the <Constant name="dbt_platform" />, your adapter version is incompatible with this change and may fail to build incremental models that meet _both_ of the following conditions:

- Contain string columns with collation defined
- Use the `on_schema_change='sync_all_columns'` config

To check whether this change affects your project, run the following [list](/reference/commands/list) command:

```bash
dbt ls -s config.materialized:incremental,config.on_schema_change:sync_all_columns --resource-type model
```

- If the command returns `No nodes selected!`, no action is required.
- If the command returns one or more models (for example, `Found 1000 models, 644 macros`), you may be impacted if those models have string columns that don't specify a width. In that case, upgrade to a version that includes the fix:

    - **<Constant name="core" />**: `dbt-snowflake` v1.10.6 or later. For upgrade instructions, refer to [Upgrade adapters](/docs/local/install-dbt) in the <Constant name="core" /> v1 installation instructions.
    - **<Constant name="dbt_platform" />**: Any release track (Latest, Compatible, Extended, or Fallback).
    - **<Constant name="fusion_engine" />**: v2.0.0-preview.147 or higher.

    This ensures your incremental models can safely handle schema changes while maintaining required collation settings.
</Expandable>
:::
