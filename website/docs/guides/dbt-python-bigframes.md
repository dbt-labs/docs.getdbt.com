---
title: "Using BigQuery DataFrames with dbt Python models"
id: dbt-python-bigframes
description: "Use this guide to help you set up dbt with BigQuery DataFrames (BigFrames)."
sidebar_label: "BigQuery DataFrames and dbt python"
# time_to_complete: '30 minutes' comment out until test
icon: 'guides'
hide_table_of_contents: true
tags: ['BigQuery', 'Google', 'GCP', 'BigFrames','Quickstart']
keywords: ['BigQuery','dbt platform', 'Google']
level: 'Intermediate'
---

<div style={{maxWidth: '900px'}}>

## Introduction

In this guide, you'll learn how to set up dbt so you can use it with BigQuery DataFrames (BigFrames):
* Build scalable data transformation pipelines using dbt and Google Cloud, with SQL and Python.
* Leverage BigFrames from dbt for scalable BigQuery SQL.


In addition to the existing dataproc/pyspark based submission methods for executing python models, you can now use the BigFrames submission method to execute Python models with  pandas-like and scikit-like APIs,  without the need of any Spark setup or knowledge.


BigQuery DataFrames is an open source Python package that transpiles pandas and scikit-learn code to scalable BigQuery SQL. The dbt-bigquery adapter relies on the BigQuery Studio Notebook Executor Service to run the Python client side code.


### Prerequisites

- A [Google Cloud account](https://cloud.google.com/free) 
- A [<Constant name="cloud" /> account](https://www.getdbt.com/signup/) 
- Basic to intermediate SQL and python.
- Basic understanding of dbt fundamentals. We recommend the [dbt Fundamentals course](https://learn.getdbt.com).

### What you'll build

Here's what you'll build in two parts:
- Google Cloud project setup
    - A one-time setup to configure the Google Cloud project you’ll be working with.
- Build and Run the Python Model
  - Create, configure, and execute a Python model using BigQuery DataFrames and dbt. 

You will set up the environments, build scalable pipelines in dbt, and execute a python model.

<Lightbox src="/img/guides/gcp-guides/gcp-bigframes-architecture.png" title="Implementation of the BigFrames submission method"/>

**Figure 1** - Implementation of the BigFrames submission method for dbt python models


## Configure Google Cloud

:::tip

**BigQuery set up**
Initialize your dbt project and select BigQuery (Legacy) as their adapter. as the adapter, making sure your profiles.yml is configured accordingly (using type: bigquery, your GCP project, dataset, credentials, etc.

:::

The dbt BigFrames submission method supports both service account and OAuth credentials. You will use the service account in the following steps.

1. **Create a new Google Cloud Project**

   a. Your new project will have the following list of APIs already enabled, including BigQuery, which is required.

      * [Default APIs](https://cloud.google.com/service-usage/docs/enabled-service#default)

   b. Enable the BigQuery API which also enables the following additional APIs automatically
      * [BigQuery API's](https://cloud.google.com/bigquery/docs/enable-assets#automatic-api-enablement)


2. **Create a service account and grant IAM permissions**

   This service account will be used by dbt to read and write data on BigQuery and use BigQuery Studio Notebooks.

   Create the service account with IAM permissions:

   ```python
   #Create Service Account
   gcloud iam service-accounts create dbt-bigframes-sa
   #Grant BigQuery User Role
   gcloud projects add-iam-policy-binding ${GOOGLE_CLOUD_PROJECT} --member=serviceAccount:dbt-bigframes-sa@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com --role=roles/bigquery.user
   #Grant BigQuery Data Editor role. This can be restricted at dataset level
   gcloud projects add-iam-policy-binding ${GOOGLE_CLOUD_PROJECT} --member=serviceAccount:dbt-bigframes-sa@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com --role=roles/bigquery.dataEditor
   #Grant Service Account user 
   gcloud projects add-iam-policy-binding ${GOOGLE_CLOUD_PROJECT} --member=serviceAccount:dbt-bigframes-sa@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com --role=roles/iam.serviceAccountUser
   #Grant Colab Entperprise User
   gcloud projects add-iam-policy-binding ${GOOGLE_CLOUD_PROJECT} --member=serviceAccount:dbt-bigframes-sa@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com --role=roles/aiplatform.colabEnterpriseUser
   ```

3. *(Optional)* **Create a test BigQuery Dataset**

   Create a new BigQuery Dataset if you don't already have one:

   ```python
   #Create BQ dataset 
   bq mk --location=${REGION} echo "${GOOGLE_CLOUD_PROJECT}" | tr '-' '_'_dataset
   ```

4. **Create a GCS bucket to stage the python code**

   For temporary log and code storage, please create a GCS bucket and assign the required permissions:

   ```python
   #Create GCS bucket
   gcloud storage buckets create gs://${GOOGLE_CLOUD_PROJECT}-bucket --location=${REGION}
   #Grant Storage Admin over the bucket to your SA 

   gcloud storage buckets add-iam-policy-binding gs://${GOOGLE_CLOUD_PROJECT}-bucket --member=serviceAccount:dbt-bigframes-sa@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com --role=roles/storage.admin
   ```

5. **Create a GCS bucket to hold the logs**
   ```python
   #Create GCS bucket
   gcloud storage buckets create gs://${GOOGLE_CLOUD_PROJECT}-bucket-logs --location=${REGION}
   #Grant Storage Admin over the bucket to your SA 
   gcloud storage buckets add-iam-policy-binding gs://${GOOGLE_CLOUD_PROJECT}-bucket-logs --member=serviceAccount:dbt-bigframes-sa@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com --role=roles/storage.admin
   ```

import OptionalSettings from '/snippets/_bigquery-optional-configs.md'; 

<OptionalSettings />

6. **Google cloud storage bucket** 

The GCS bucket and Dataproc region aren't always needed in a basic BigQuery setup for dbt, but they are required in some specific use cases, especially when:

- You're using Python models with BigQuery DataFrames.

- You're using Spark on Dataproc (via dbt or other tools).

- You're staging large files in GCS before loading into BigQuery.

You can configure the GCS bucket in the [profiles.yml](/docs/core/connect-data-platform/profiles.yml), add this under your BigQuery profile:

```yaml
my_bq_project:
  target: dev
  outputs:
    dev:
      type: bigquery
      method: service-account
      project: your-gcp-project-id
      dataset: your_dataset
      keyfile: /path/to/key.json
      location: US
      threads: 4
      timeout_seconds: 300

      # 👇 Optional settings
      job_execution_timeout_seconds: 300
      gcs_bucket: your-temp-gcs-bucket-name
```

**Dataproc region**

The Dataproc region is only if you're using Dataproc (for example, for running PySpark or Spark jobs). You would set the region when initializing or referencing a Dataproc cluster. For example, if running Spark on Dataproc.

It's not required for standard BigQuery or Python models via dbt unless explicitly configured.

For example, in a gcloud CLI command:

```bash
gcloud dataproc clusters create my-cluster \
  --region=us-central1 \
  --zone=us-central1-b
```

## Create, configure, and execute your Python models

1. In your dbt project, create a SQL model in your models directory, ending in the `.sql` file extension. Name it `my_sql_model.sql`.
2. In the file, copy this SQL into it. 

   ```sql
      select 
      1 as foo,
      2 as bar
   ```
3. Now create a new model file in the models directory, named `my_first_python_model.py`. 

4. In the `my_first_python_model.py` file, add this code:

   ```python
   def model(dbt, session):
      dbt.config(submission_method="bigframes")
      bdf = dbt.ref("my_sql_model") #loading from prev step
      return bdf
   ```

5. Configure the BigFrames submission method by using either:  

   a. Project level configuration via dbt_project.yml

   ```python
   models:
   my_dbt_project:
      submission_method: bigframes
      python_models:
         +materialized: view
   ```
   or 

   b. The Python code via dbt.config in the my_first_python_model.py file 

   ```python
   def model(dbt, session):
      dbt.config(submission_method="bigframes")
      # rest of the python code...

   ```

6. Run `dbt run` 

7. You can view the logs in [dbt logs](/reference/events-logging). You can optionally view the codes and logs (including previous executions) from the [Colab Enterprise Executions](https://console.cloud.google.com/vertex-ai/colab/execution-jobs) tab and [GCS bucket](https://console.cloud.google.com/storage/browser) from the GCP console.

8. Congrats! You just created your first two python models to run on BigFrames! 

</div>
