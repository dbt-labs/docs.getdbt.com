<Expandable alt_header="Warehouse-specific volatility keywords">

Different warehouses show volatility controls with different keywords and default values:

| Warehouse | `deterministic` | `stable` | `non-deterministic` |
| --- | --- | --- | --- |
| [Snowflake](https://docs.snowflake.com/en/sql-reference/sql/create-function#sql-handler) | `IMMUTABLE` | Not supported | `VOLATILE` (default) |
| [Redshift](https://docs.aws.amazon.com/redshift/latest/dg/r_CREATE_FUNCTION.html#r_CREATE_FUNCTION-synopsis) | `IMMUTABLE` | `STABLE` | `VOLATILE` (default) |
| [Databricks](https://docs.databricks.com/aws/en/udf/unity-catalog#set-deterministic-if-your-function-produces-consistent-results) | `DETERMINISTIC` | Not supported | Assumed `non-deterministic` unless declared |
| [Postgres](https://www.postgresql.org/docs/current/xfunc-volatility.html) | `IMMUTABLE` | `STABLE` | `VOLATILE` (default) |

For SQL and Python UDFs, BigQuery does not support explicitly setting volatility and infers it based on the functions and expressions used. For JavaScript UDFs, BigQuery supports `deterministic` and `non-deterministic` only; `stable` is not supported.

</Expandable>