To run dbt Python models on GCP, dbt uses companion services, Dataproc and Cloud Storage, that offer tight integrations with BigQuery. You may use an existing Dataproc cluster and Cloud Storage bucket, or create new ones:
- https://cloud.google.com/dataproc/docs/guides/create-cluster
- https://cloud.google.com/storage/docs/creating-buckets