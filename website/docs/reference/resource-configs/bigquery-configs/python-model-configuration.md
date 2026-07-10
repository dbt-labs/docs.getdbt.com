---
title: "Python model configuration"
sidebar_label: "Python models"
description: "How to submit BigQuery Python models using BigQuery DataFrames or Dataproc, including setup and configuration parameters."
---

**Submission methods:**
BigQuery supports a few different mechanisms to submit Python code, each with relative advantages. The `dbt-bigquery` adapter uses BigQuery DataFrames (BigFrames) or Dataproc. This process reads data from BigQuery, computes it either natively with BigQuery DataFrames or Dataproc, and writes the results back to BigQuery.

<Tabs
  defaultValue="dataframes"
  values={[
    { label: 'BigQuery DataFrames', value: 'dataframes', },
    { label: 'Dataproc', value: 'dataproc', },
  ]
}>
<TabItem value="dataframes">

BigQuery DataFrames can execute pandas and scikit-learn. There's no need to manage infrastructure and leverages BigQuery-distributed query engines. It's great for analysts, data scientists, and machine learning engineers who want to manipulate big data using a pandas-like syntax.

**Note:** BigQuery DataFrames run on Google Colab's default runtime. If no `default` runtime template is available, the adapter will automatically create one for you and mark it `default` for next time usage (assuming it has the right permissions).

**BigQuery DataFrames setup:**

```bash
# IAM permission if using service account

#Create Service Account
gcloud iam service-accounts create dbt-bigframes-sa
#Grant BigQuery User Role
gcloud projects add-iam-policy-binding ${GOOGLE_CLOUD_PROJECT} --member=serviceAccount:dbt-bigframes-sa@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com --role=roles/bigquery.user
#Grant BigQuery Data Editor role. This can be restricted at dataset level
gcloud projects add-iam-policy-binding ${GOOGLE_CLOUD_PROJECT} --member=serviceAccount:dbt-bigframes-sa@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com --role=roles/bigquery.dataEditor
#Grant Service Account user 
gcloud projects add-iam-policy-binding ${GOOGLE_CLOUD_PROJECT} --member=serviceAccount:dbt-bigframes-sa@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com --role=roles/iam.serviceAccountUser
#Grant Colab Enterprise User
gcloud projects add-iam-policy-binding ${GOOGLE_CLOUD_PROJECT} --member=serviceAccount:dbt-bigframes-sa@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com --role=roles/aiplatform.colabEnterpriseUser
```

<File name='dbt_project.yml'>

```yaml
models:
  my_dbt_project:
    submission_method: bigframes
```

</File>

<File name='profiles.yml'>

```yaml
my_dbt_project_sa:
  outputs:
    dev:
      compute_region: us-central1
      dataset: <BIGQUERY_DATASET>
      gcs_bucket: <GCS BUCKET USED FOR BIGFRAME LOGS>
      job_execution_timeout_seconds: 300
      job_retries: 1
      keyfile: <SERVICE ACCOUNT KEY FILE>
      location: US
      method: service-account
      priority: interactive
      project: <BIGQUERY_PROJECT>
      threads: 1
      type: bigquery
  target: dev
```
</File>

</TabItem>

<TabItem value="dataproc">

Dataproc (`serverless` or pre-configured `cluster`) can execute Python models as PySpark jobs, reading from and writing to BigQuery. `serverless` is simpler but slower with limited configuration and pre-installed packages (`pandas`, `numpy`, `scikit-learn`), while `cluster` offers full control and faster runtimes. Good for complex, long-running batch pipelines and legacy Hadoop/Spark workflows but often slower for ad-hoc or interactive workloads.

**Dataproc setup:**
- Create or use an existing [Cloud Storage bucket](https://cloud.google.com/storage/docs/creating-buckets).
- Enable Dataproc APIs for your project and region.
- If using the `cluster` submission method: Create or use an existing [Dataproc cluster](https://cloud.google.com/dataproc/docs/guides/create-cluster) with the [Spark BigQuery connector initialization action](https://github.com/GoogleCloudDataproc/initialization-actions/tree/master/connectors#bigquery-connectors). (Google recommends copying the action into your own Cloud Storage bucket, rather than using the example version shown in the screenshot.)

<Lightbox src="/img/docs/building-a-dbt-project/building-models/python-models/dataproc-connector-initialization.png" title="Add the Spark BigQuery connector as an initialization action"/>

The following configurations are needed to run Python models on Dataproc. You can add these to your [BigQuery profile](/docs/local/connect-data-platform/bigquery-setup#running-python-models-on-dataproc) or configure them on specific Python models:
- `gcs_bucket`: Storage bucket to which dbt will upload your model's compiled PySpark code.
- `dataproc_region`: GCP region in which you have enabled Dataproc (for example `us-central1`).
- `dataproc_cluster_name`: Name of Dataproc cluster to use for running Python model (executing PySpark job). Only required if `submission_method: cluster`.

```python
def model(dbt, session):
    dbt.config(
        submission_method="cluster",
        dataproc_cluster_name="my-favorite-cluster"
    )
    ...
```
```yml
models:
  - name: my_python_model
    config:
      submission_method: serverless
```

Python models running on Dataproc Serverless can be further configured in your [BigQuery profile](/docs/local/connect-data-platform/bigquery-setup#running-python-models-on-dataproc).

Any user or service account that runs dbt Python models will need the following permissions, in addition to the required BigQuery permissions:
```
dataproc.batches.create
dataproc.clusters.use
dataproc.jobs.create
dataproc.jobs.get
dataproc.operations.get
dataproc.operations.list
storage.buckets.get
storage.objects.create
storage.objects.delete
```
For more information, refer to [Dataproc IAM roles and permissions](https://cloud.google.com/dataproc/docs/concepts/iam/iam).

**Installing packages:** 

Installation of third-party packages on Dataproc varies depending on whether it's a [cluster](https://cloud.google.com/dataproc/docs/guides/create-cluster) or [serverless](https://cloud.google.com/dataproc-serverless/docs).  

- **Dataproc Cluster** &mdash; Google recommends installing Python packages while creating the cluster via initialization actions:  
    - [How initialization actions are used](https://github.com/GoogleCloudDataproc/initialization-actions/blob/master/README.md#how-initialization-actions-are-used)  
    - [Actions for installing via `pip` or `conda`](https://github.com/GoogleCloudDataproc/initialization-actions/tree/master/python)

    You can also install packages at cluster creation time by [defining cluster properties](https://cloud.google.com/dataproc/docs/tutorials/python-configuration#image_version_20): `dataproc:pip.packages` or `dataproc:conda.packages`.  

- **Dataproc Serverless** &mdash; Google recommends using a [custom docker image](https://cloud.google.com/dataproc-serverless/docs/guides/custom-containers) to install thrid-party packages. The image needs to be hosted in [Google Artifact Registry](https://cloud.google.com/artifact-registry/docs). It can then be used by providing the image path in dbt profiles:
    
    <File name='profiles.yml'>
    ```yml
    my-profile:
        target: dev
        outputs:
            dev:
            type: bigquery
            method: oauth
            project: abc-123
            dataset: my_dataset
            
            # for dbt Python models to be run on Dataproc Serverless
            gcs_bucket: dbt-python
            dataproc_region: us-central1
            submission_method: serverless
            dataproc_batch:
                runtime_config:
                    container_image: {HOSTNAME}/{PROJECT_ID}/{IMAGE}:{TAG}
    ```


    </File>

<Lightbox src="/img/docs/building-a-dbt-project/building-models/python-models/dataproc-pip-packages.png" title="Adding packages to install via pip at cluster startup"/>

</TabItem>
</Tabs>

### Additional parameters

The BigQuery Python models also have the following additional configuration parameters:

| Parameter               | Type        | Required | Default   | Valid values     |
| :---------------------- | :---------- | :------- | :-------- | :--------------- |
| `enable_list_inference` | `<boolean>` | no       | `True`    | `True`, `False`  |
| `intermediate_format`   | `<string>`  | no       | `parquet` | `parquet`, `orc` |
| `submission_method`     | `<string>`  | no       | ``        | `serverless`, `bigframes`, `cluster` |
| `notebook_template_id`  | `<integer>` | no       | ``        | `<NOTEBOOK RUNTIME TEMPLATE_ID>` |
| `compute_region`        | `<string>`  | no       | ``        | `<COMPUTE_REGION>` |
| `gcs_bucket`            | `<string>`  | no       | ``        | `<GCS_BUCKET>` |
| `packages`              | `<string>`  | no       | ``        | `['numpy<=1.1.1', 'pandas', 'mlflow']` |
| `timeout`               | `<integer>` | no       | ``        | `<timeout_in_seconds>` |

- The `enable_list_inference` parameter
  - The `enable_list_inference` parameter enables a PySpark data frame to read multiple records in the same operation. By default, this is set to `True` to support the default `intermediate_format` of `parquet`.

- The `intermediate_format` parameter
  - The `intermediate_format` parameter specifies which file format to use when writing records to a table. The default is `parquet`.

- The `submission_method` parameter
  - The `submission_method` parameter specifies whether the job will run on BigQuery DataFrames or Serverless Spark. `submission_method` is not required when `dataproc_cluster_name` is declared.

- The `notebook_template_id` parameter
  - The `notebook_template_id` parameter specifies runtime template in Colab Enterprise.

- The `compute_region` parameter
  - The `compute_region` parameter specifies the region of the job.

- The `gcs_bucket` parameter
  - The `gcs_bucket` parameter specifies the GCS bucket used for storing artifacts for the job.

- The `timeout` parameter
  - The `timeout` parameter specifies the maximum execution time in seconds for the Python model. This is particularly useful for BigFrames models that may require longer execution times for complex data processing or machine learning workloads. If not specified, the model will use the default timeout configured for the execution environment.


**Related docs:**

- [Dataproc overview](https://cloud.google.com/dataproc/docs/concepts/overview)
- [Create a Dataproc cluster](https://cloud.google.com/dataproc/docs/guides/create-cluster)
- [Create a Cloud Storage bucket](https://cloud.google.com/storage/docs/creating-buckets)
- [PySpark DataFrame syntax](https://spark.apache.org/docs/latest/api/python/reference/pyspark.sql/api/pyspark.sql.DataFrame.html)
