| Adapter | Behavior |
|---------|----------|
| **Snowflake** | Fusion ignores user-set threads and automatically optimizes parallelism for maximum performance. |
| **Databricks** | Fusion ignores user-set threads and automatically optimizes parallelism for maximum performance. |
| **BigQuery** | Fusion respects user-set threads to manage API rate limits. |
| **Redshift** | Fusion respects user-set threads to manage concurrency limits. |

For BigQuery and Redshift, setting `--threads 0` (or omitting the setting) allows Fusion to dynamically optimize parallelism.

- For BigQuery and Redshift, <Constant name="fusion"/> respects user-set thread values to accommodate warehouse-specific limits. Setting `--threads 0` (or omitting the setting) allows <Constant name="fusion"/> to dynamically optimize parallelism.