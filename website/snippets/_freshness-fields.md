| Field | Description |
|---|---|
| `warn_after` | How old the most recent data can be before `dbt freshness` reports a warning. Requires both `count` (positive integer) and `period` (`minute`, `hour`, or `day`). One or both of `warn_after` and `error_after` can be provided. If neither is set, dbt will not check freshness for that resource. |
| `error_after` | How old the most recent data can be before `dbt freshness` reports an error. Same format as `warn_after`. |
| `loaded_at_field` | Column dbt queries to determine the most recent loaded timestamp. Required when adapter metadata is unavailable to determine freshness. Set alongside `freshness:`, not nested inside it. |
| `loaded_at_query` | A SQL expression that returns the most recent loaded timestamp. Alternative to `loaded_at_field`. Set alongside `freshness:`, not nested inside it. If both are set, `loaded_at_query` takes precedence. |
