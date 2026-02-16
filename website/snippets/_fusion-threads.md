| Adapter | Behavior |
|---------|----------|
| **Snowflake** | Fusion ignores user-set threads and automatically optimizes parallelism for maximum performance. <br></br> The only supported override is `threads: 1`, which can also help resolve timeout issues if set. 
| **Databricks** | Fusion ignores user-set threads and automatically optimizes parallelism for maximum performance. <br></br> The only supported override is `threads: 1`, which can also help resolve timeout issues if set. |
| **BigQuery** | Fusion respects user-set threads to manage API rate limits. <br></br> Setting `--threads 0` (or omitting the setting) allows <Constant name="fusion"/> to dynamically optimize parallelism. |
| **Redshift** | Fusion respects user-set threads to manage concurrency limits.<br></br> Setting `--threads 0` (or omitting the setting) allows <Constant name="fusion"/> to dynamically optimize parallelism. |
