| Adapter | Behavior |
|---------|----------|
| **Snowflake** | Fusion ignores user-set threads and automatically optimizes parallelism for maximum performance. |
| **Databricks** | Fusion ignores user-set threads and automatically optimizes parallelism for maximum performance. |
| **BigQuery** | Fusion respects user-set threads to manage API rate limits. |
| **Redshift** | Fusion respects user-set threads to manage concurrency limits. |

For Snowflake and Databricks, setting `--threads 0` (or omitting the setting) allows Fusion to dynamically optimize parallelism. Low thread values (like 4 or 6) can significantly slow down Fusion performance on these platforms.