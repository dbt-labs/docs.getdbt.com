| Adapter | Behavior |
|---------|----------|
| **Snowflake** | Fusion ignores user-set threads and automatically optimizes parallelism for maximum performance. |
| **Databricks** | Fusion ignores user-set threads and automatically optimizes parallelism for maximum performance. |
| **BigQuery** | Fusion respects user-set threads to manage API rate limits. |
| **Redshift** | Fusion respects user-set threads to manage concurrency limits. |

For BigQuery and Redshift, setting `--threads 0` (or omitting the setting) allows Fusion to dynamically optimize parallelism.

For Snowflake and Databricks, only `threads: 1` is respected. If you are seeing timeouts due to Fusion parallelism, try setting `threads: 1` to see if this resolves the issue.