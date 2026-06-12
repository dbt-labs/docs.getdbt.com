| Adapter | Behavior |
|---------|----------|
| **Snowflake** | Fusion automatically manages connection parallelism based on platform limits and backpressure. The `threads` setting acts as a maximum connection cap if set, but Fusion is designed to work optimally without it configured. If you're experiencing timeout or rate limit issues, setting `threads` to a lower value can help. |
| **Databricks** | Fusion automatically manages connection parallelism based on platform limits and backpressure. The `threads` setting acts as a maximum connection cap if set, but Fusion is designed to work optimally without it configured. If you're experiencing timeout or rate limit issues, setting `threads` to a lower value can help. |
| **BigQuery** | Fusion respects user-set threads to manage API rate limits. <br></br> Setting `--threads 0` (or omitting the setting) allows <Constant name="fusion"/> to dynamically optimize parallelism. |
| **Redshift** | Fusion respects user-set threads to manage concurrency limits.<br></br> Setting `--threads 0` (or omitting the setting) allows <Constant name="fusion"/> to dynamically optimize parallelism. |
