### Optional configurations

In BigQuery, optional configurations let you tailor settings for tasks such as query priority, dataset location, job timeout, and more. These options give you greater control over how BigQuery functions behind the scenes to meet your requirements.

To customize your optional configurations in <Constant name="cloud" />:

1. Click your account name at the bottom left-hand menu and go to **Account settings** > **Projects**.
2. Select your BigQuery project.
3. Go to **Development connection** and select **BigQuery**.
4. Click **Edit** and then scroll down to **Optional settings**.

<Lightbox src="/img/bigquery/bigquery-optional-config.png" width="70%" title="BigQuery optional configuration"/>

The following are the optional configurations you can set in <Constant name="cloud" />:

| Configuration    | <div style={{width:'250'}}>Information</div>   | Type    | <div style={{width:'150'}}>Example</div>             |
|---------------------------|-----------------------------------------|---------|--------------------|
| [Priority](#priority)             | Sets the priority for BigQuery jobs (either `interactive` or queued for `batch` processing)  | String  | `batch` or `interactive`    |
| [Retries](#retries)                       | Specifies the number of retries for failed jobs due to temporary issues             | Integer | `3`                         |
| [Location](#location)                       | Location for creating new datasets       | String  | `US`, `EU`, `us-west2`      |
| [Maximum bytes billed](#maximum-bytes-billed)           | Limits the maximum number of bytes that can be billed for a query            | Integer | `1000000000`                |
| [Execution project](#execution-project)              | Specifies the project ID to bill for query execution       | String  | `my-project-id`             |
| [Impersonate service account](#impersonate-service-account)    | Allows users authenticated locally to access BigQuery resources under a specified service account   | String  | `service-account@project.iam.gserviceaccount.com` |
| [Job retry deadline seconds](#job-retry-deadline-seconds)     | Sets the total number of seconds BigQuery will attempt to retry a job if it fails    | Integer | `600`                       |
| [Job creation timeout seconds](#job-creation-timeout-seconds)   | Specifies the maximum timeout for the job creation step       | Integer | `120`                       |
| [Google cloud storage-bucket](#google-cloud-storage-bucket)    | Location for storing objects in Google Cloud Storage   | String  | `my-bucket`                 |
| [Dataproc region](#dataproc-region)                | Specifies the cloud region for running data processing jobs    | String  | `US`, `EU`, `asia-northeast1` |
| [Dataproc cluster name](#dataproc-cluster-name)          | Assigns a unique identifier to a group of virtual machines in Dataproc          | String  | `my-cluster`                |
| [Notebook Template ID](#notebook-template-id)          | Unique identifier to a Colab Enterprise notebook runtime          | Integer  | `7018811640745295872`                |
| [Compute Region](#compute-region)          | Assigns a unique identifier to a group of virtual machines in Dataproc          | String  | `US`, `EU`, `asia-northeast1`              |


<Expandable alt_header="Priority">

The `priority` for the BigQuery jobs that dbt executes can be configured with the `priority` configuration in your BigQuery profile. The priority field can be set to one of `batch` or `interactive`. For more information on query priority, consult the [BigQuery documentation](https://cloud.google.com/bigquery/docs/running-queries).

</Expandable>

<Expandable alt_header="Retries">

Retries in BigQuery help to ensure that jobs complete successfully by trying again after temporary failures, making your operations more robust and reliable.

</Expandable>

<Expandable alt_header="Location">

The `location` of BigQuery datasets can be set using the `location` setting in a BigQuery profile. As per the [BigQuery documentation](https://cloud.google.com/bigquery/docs/locations), `location` may be either a multi-regional location (for example, `EU`, `US`), or a regional location (like `us-west2`).

</Expandable>

<Expandable alt_header="Maximum bytes billed">

When a `maximum_bytes_billed` value is configured for a BigQuery profile, that allows you to limit how much data your query can process. It’s a safeguard to prevent your query from accidentally processing more data than you expect, which could lead to higher costs. Queries executed by dbt will fail if they exceed the configured maximum bytes threshhold. This configuration should be supplied as an integer number of bytes.

If your `maximum_bytes_billed` is 1000000000, you would enter that value in the `maximum_bytes_billed` field in <Constant name="cloud" />.


</Expandable>

<Expandable alt_header="Execution project">

By default, dbt will use the specified `project`/`database` as both:

1. The location to materialize resources (models, seeds, snapshots, and so on), unless they specify a custom project/database config
2. The GCP project that receives the bill for query costs or slot usage

Optionally, you may specify an execution project to bill for query execution, instead of the project/database where you materialize most resources.

</Expandable>

<Expandable alt_header="Impersonate service account">

This feature allows users authenticating using local OAuth to access BigQuery resources based on the permissions of a service account.

For a general overview of this process, see the official docs for [Creating Short-lived Service Account Credentials](https://cloud.google.com/iam/docs/create-short-lived-credentials-direct).

</Expandable>

<Expandable alt_header="Job retry deadline seconds">

Job retry deadline seconds is the maximum amount of time BigQuery will spend retrying a job before it gives up.

</Expandable>

<Expandable alt_header="Job creation timeout seconds">

Job creation timeout seconds is the maximum time BigQuery will wait to start the job. If the job doesn’t start within that time, it times out.

</Expandable>

#### Run dbt python models on Google Cloud Platform

import BigQueryDataproc from '/snippets/_bigquery-dataproc.md';

<BigQueryDataproc />

<Expandable alt_header="Google cloud storage bucket">

Everything you store in Cloud Storage must be placed inside a [bucket](https://cloud.google.com/storage/docs/buckets). Buckets help you organize your data and manage access to it.

</Expandable>

<Expandable alt_header="Dataproc region">

A designated location in the cloud where you can run your data processing jobs efficiently. This region must match the location of your BigQuery dataset if you want to use Dataproc with BigQuery to ensure data doesn't move across regions, which can be inefficient and costly.

For more information on [Dataproc regions](https://cloud.google.com/bigquery/docs/locations), refer to the BigQuery documentation.

</Expandable>

<Expandable alt_header="Dataproc cluster name">

A unique label you give to your group of virtual machines to help you identify and manage your data processing tasks in the cloud. When you integrate Dataproc with BigQuery, you need to provide the cluster name so BigQuery knows which specific set of resources (the cluster) to use for running the data jobs.

Have a look at [Dataproc's document on Create a cluster](https://cloud.google.com/dataproc/docs/guides/create-cluster) for an overview on how clusters work.

</Expandable>

<Expandable alt_header="Notebook Template ID">

The unique identifier associated with a specific Colab notebook, which acts are the python runtime for BigQuery DataFrames.

</Expandable>

<Expandable alt_header="Compute Region">

This region must match the location of your BigQuery dataset if you want to use BigQuery DataFrames, ensure the Colab runtime is also within the same region.

</Expandable>