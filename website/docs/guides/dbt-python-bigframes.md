---
title: "Using BigQuery Dataframes with dbt python models"
id: dbt-python-bigframes
description: "Use this guide to help you set up dbt with BigQuery Dataframes (BigFrames)."
sidebar_label: "BigQuery Dataframes and dbt python"
# time_to_complete: '30 minutes' comment out until test
icon: 'guides'
hide_table_of_contents: true
tags: ['BigQuery', 'Google', 'GCP', 'BigFrames','Quickstart']
keywords: ['BigQuery','dbt', 'Google']
level: 'Intermediate'
recently_updated: true
---

<div style={{maxWidth: '900px'}}>

## Introduction

In this guide, you'll learn how to set up <Constant name="dbt" /> so you can use it with BigQuery Dataframes (BigFrames):
* Build scalable data transformation pipelines using <Constant name="dbt" /> and Google Cloud, with SQL and Python.
* Leverage BigFrames from <Constant name="dbt" /> for scalable BigQuery SQL.

In addition to the existing dataproc/pyspark based submission methods for executing python models, you can now use the BigFrames submission method to execute pandas and scikit, which help you learn code at scale on the BigQuery SQL engine.

BigQuery Dataframes is an open source python package that transpiles pandas and scikit-learn code to scalable BigQuery SQL. The <Constant name="dbt" />-bigquery adapter relies on the BigQuery Studio Notebook Executor Service to run the python client side code.


### Prerequisites

- A [Google Cloud account](https://cloud.google.com/free) 
- A [<Constant name="cloud" /> account](https://www.getdbt.com/signup/) 
- Basic to intermediate SQL and python.
- Basic understanding of <Constant name="dbt" /> fundamentals. We recommend the [<Constant name="dbt" /> Fundamentals course](https://learn.getdbt.com).

### What you'll build

Here's what you'll build in two parts:
- Google Cloud project setup
    - A one-time setup to configure the Google Cloud project you’ll be working with.
- Build and Run the Python Model
  - Create, configure, and execute a Python model using BigQuery DataFrames and <Constant name="dbt" />. 

You will set up the environments, build scalable pipelines in <Constant name="dbt" />, and execute a python model.

<Lightbox src="/img/guides/gcp-guides/gcp-bigframes-architecture.png" title="Implementation of the BigFrames submission method"/>

**Figure 1** - Implementation of the BigFrames submission method for <Constant name="dbt" /> python models


## Configure Google Cloud

The <Constant name="dbt" /> BigFrames submission method supports both service account and OAuth credentials. You will use the service account in the following steps.

1. **Create a new Google Cloud Project**

   a. Your new project will have the following list of APIs already enabled, including BigQuery, which is required.

      * [Default APIs](https://cloud.google.com/service-usage/docs/enabled-service#default)

   b. Enable the BigQuery API which also enables the following additional APIs automatically
      * [BigQuery API's](https://cloud.google.com/bigquery/docs/enable-assets#automatic-api-enablement)


2. **Create a service account and grant IAM permissions**

   This service account will be used by <Constant name="dbt" /> to read and write data on BigQuery and use BigQuery Studio Notebooks.

   Create the service account with IAM permissions:

   ```python
   #Create Service Account
   gcloud iam service-accounts create <Constant name="dbt" />-bigframes-sa
   #Grant BigQuery User Role
   gcloud projects add-iam-policy-binding ${GOOGLE_CLOUD_PROJECT} --member=serviceAccount:<Constant name="dbt" />-bigframes-sa@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com --role=roles/bigquery.user
   #Grant BigQuery Data Editor role. This can be restricted at dataset level
   gcloud projects add-iam-policy-binding ${GOOGLE_CLOUD_PROJECT} --member=serviceAccount:<Constant name="dbt" />-bigframes-sa@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com --role=roles/bigquery.dataEditor
   #Grant Service Account user 
   gcloud projects add-iam-policy-binding ${GOOGLE_CLOUD_PROJECT} --member=serviceAccount:<Constant name="dbt" />-bigframes-sa@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com --role=roles/iam.serviceAccountUser
   #Grant Colab Entperprise User
   gcloud projects add-iam-policy-binding ${GOOGLE_CLOUD_PROJECT} --member=serviceAccount:<Constant name="dbt" />-bigframes-sa@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com --role=roles/aiplatform.colabEnterpriseUser
   ```

   Note: Considering reviewing these optional IAM requirements required to apply for using remote functions and ML remote models:

   * [Remote Functions](https://cloud.google.com/bigquery/docs/use-bigquery-dataframes#remote-function-requirements)

   * [ML Remote Models](https://cloud.google.com/bigquery/docs/use-bigquery-dataframes#remote-models)

3. *(Optional)* **Create a test BigQuery Dataset**

   Create a new BigQuery Dataset if you don't already have one:

   ```python
   #Create BQ dataset 
   bq mk --location=${REGION} echo "${GOOGLE_CLOUD_PROJECT}" | tr '-' '_'_dataset
   ```

4. *(Optional)* **Create a GCS bucket to stage the python code**

   If you wish to store the python compiled code on a GCS bucket, create a new one:

   ```python
   #Create GCS bucket
   gcloud storage buckets create gs://${GOOGLE_CLOUD_PROJECT}-bucket --location=${REGION}
   #Grant Storage Admin over the bucket to your SA 
   xgcloud storage buckets add-iam-policy-binding gs://${GOOGLE_CLOUD_PROJECT}-bucket --member=serviceAccount:<Constant name="dbt" />-bigframes-sa@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com --role=roles/storage.admin
   ```

5. **Create a GCS bucket to hold the logs**
   ```python
   #Create GCS bucket
   gcloud storage buckets create gs://${GOOGLE_CLOUD_PROJECT}-bucket-logs --location=${REGION}
   #Grant Storage Admin over the bucket to your SA 
   gcloud storage buckets add-iam-policy-binding gs://${GOOGLE_CLOUD_PROJECT}-bucket-logs --member=serviceAccount:<Constant name="dbt" />-bigframes-sa@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com --role=roles/storage.admin
   ```

## Create, configure, and execute your Python models

1. In your dbt project, create a sql model in your models directory, ending in the `.sql` file extension. Name it `my_sql_model.sql`.
2. In the file, copy this sql into it. 

   ```sql
      select 
      1 as foo,
      2 as bar
   ```
3. Now create a new model file in the models directory, named `my_first_python_model.py`. 
4. Configure the BigFrames submission method by either:  

   a. Project level configuration via dbt_project.yml

   ```python
   models:
   my_dbt_project:
      submission_method: bigframes
      python_models:
         +materialized: view
   ```
   or 

   b. The Python code via <Constant name="dbt" />.config

   ```python
   def model(<Constant name="dbt" />, session):
      <Constant name="dbt" />.config(submission_method="bigframes")
      bdf = <Constant name="dbt" />.ref("my_sql_model") 
      return bdf
   ```

3. Now in that file, add in this code:

   ```python
   def model(<Constant name="dbt" />, session):
      <Constant name="dbt" />.config(submission_method="bigframes")
      bdf = <Constant name="dbt" />.ref("my_sql_model") #loading from prev step
      return bdf
   ```

3. Create a new python model file named `my_second_python_model.py` 

   ```python
   def model(<Constant name="dbt" />, session):  
      data = {"foo": [1, 2], "bar": [3, 4]}
      return bpd.DataFrame(data=data)
   ```

4. Run `dbt run` 

5. You can optionally view the codes and logs (including previous executions) from the Colab Enterprise Executions tab and GCS bucket from the GCP console.

6. Congrats! You just created your first two python models to run on BigFrames! 

</div>
