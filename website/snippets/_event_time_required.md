:::caution Required
  For incremental microbatch models, if your upstream models don't have `event_time` configured, dbt _cannot_ automatically filter them during batch processing and will perform full table scans on every batch run. 
  
  To avoid this, configure `event_time` on every upstream model that should be filtered. Learn how to exclude a model from auto-filtering by [opting out of auto-filtering](/docs/build/incremental-microbatch#opting-out-of-auto-filtering).
:::
