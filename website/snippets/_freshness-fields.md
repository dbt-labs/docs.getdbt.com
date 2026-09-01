| Field | Description |
|---|---|
| `warn_after` | Duration after which `dbt freshness` reports a warning if the most recent available data is older than this threshold. Requires both `count` (positive integer) and `period` (`minute`, `hour`, or `day`). One or both of `warn_after` and `error_after` can be provided. If neither is set, dbt will not check freshness for that resource. |
| `error_after` | Duration after which `dbt freshness` reports an error if the most recent available data is older than this threshold. Same format as `warn_after`. |
| `loaded_at_field` | Column dbt queries to determine the most recent loaded timestamp. Required when adapter metadata is unavailable to determine freshness. Set as a sibling config alongside `freshness:`. |
| `loaded_at_query` | A SQL expression that returns the most recent loaded timestamp. Alternative to `loaded_at_field`. Set as a sibling config alongside `freshness:`. If both are set, `loaded_at_query` takes precedence. |
