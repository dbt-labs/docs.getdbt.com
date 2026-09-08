## Adapter lifecycle

dbt v2 is available across adapters (data warehouse connectors). Track status by adapter using the following table:

<SimpleTable>
| Adapter | Lifecycle |
|---------|:---------:|
| Snowflake | Preview |
| BigQuery | Preview |
| Databricks | Preview |
| Redshift | Preview |
| Apache Spark (CLI only)| Beta |
| DuckDB (CLI only) | Beta |
</SimpleTable>

<small> _Note that adapter lifecycle may differ between the <Constant name="dbt_platform"/> and local development. An adapter can reach GA in the dbt platform before it reaches GA for local use._ </small>

