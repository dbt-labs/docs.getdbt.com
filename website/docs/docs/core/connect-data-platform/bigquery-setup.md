---
title: "BigQuery setup"
description: "Read this guide to learn about the BigQuery warehouse setup in dbt."
meta:
  maintained_by: dbt Labs
  authors: 'core dbt maintainers'
  github_repo: 'dbt-labs/dbt-bigquery'
  pypi_package: 'dbt-bigquery'
  min_core_version: 'v0.10.0'
  cloud_support: Supported
  min_supported_version: 'n/a'
  slack_channel_name: '#db-bigquery'
  slack_channel_link: 'https://getdbt.slack.com/archives/C99SNSRTK'
  platform_name: 'BigQuery'
  config_page: '/reference/resource-configs/bigquery-configs'
---


<Snippet path="warehouse-setups-cloud-callout" />

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

## Authentication Methods

BigQuery targets can be specified using one of four methods:

1. [OAuth via `gcloud`](#oauth-via-gcloud)
2. [OAuth token-based](#oauth-token-based)
3. [service account file](#service-account-file)
4. [service account json](#service-account-json)

For local development, we recommend using the OAuth method. If you're scheduling dbt on a server, you should use the service account auth method instead.

BigQuery targets should be set up using the following configuration in your `profiles.yml` file. There are a number of [optional configurations](#optional-configurations) you may specify as well.

### OAuth via gcloud

This connection method requires [local OAuth via `gcloud`](#local-oauth-gcloud-setup).

<File name='~/.dbt/profiles.yml'>

```yaml
# Note that only one of these targets is required

my-bigquery-db:
  target: dev
  outputs:
    dev:
      type: bigquery
      method: oauth
      project: GCP_PROJECT_ID
      dataset: DBT_DATASET_NAME # You can also use "schema" here
      threads: 4 # Must be a value of 1 or greater 
      [OPTIONAL_CONFIG](#optional-configurations): VALUE
```

</File>

**Default project**

If you do not specify a `project`/`database` and are using the `oauth` method, dbt will use the default `project` associated with your user, as defined by `gcloud config set`.

### OAuth Token-Based

See [docs](https://developers.google.com/identity/protocols/oauth2) on using OAuth 2.0 to access Google APIs.

#### Refresh token

Using the refresh token and client information, dbt will mint new access tokens as necessary.

<File name='~/.dbt/profiles.yml'>

```yaml
my-bigquery-db:
  target: dev
  outputs:
    dev:
      type: bigquery
      method: oauth-secrets
      project: GCP_PROJECT_ID
      dataset: DBT_DATASET_NAME # You can also use "schema" here
      threads: 4 # Must be a value of 1 or greater
      refresh_token: TOKEN
      client_id: CLIENT_ID
      client_secret: CLIENT_SECRET
      token_uri: REDIRECT_URI
      [OPTIONAL_CONFIG](#optional-configurations): VALUE
```

</File>

#### Temporary token

dbt will use the one-time access token, no questions asked. This approach makes sense if you have an external deployment process that can mint new access tokens and update the profile file accordingly.

<File name='~/.dbt/profiles.yml'>

```yaml
my-bigquery-db:
  target: dev
  outputs:
    dev:
      type: bigquery
      method: oauth-secrets
      project: GCP_PROJECT_ID
      dataset: DBT_DATASET_NAME # You can also use "schema" here
      threads: 4 # Must be a value of 1 or greater
      token: TEMPORARY_ACCESS_TOKEN # refreshed + updated by external process
      [OPTIONAL_CONFIG](#optional-configurations): VALUE
```

</File>


### Service Account File

<File name='~/.dbt/profiles.yml'>

```yaml
my-bigquery-db:
  target: dev
  outputs:
    dev:
      type: bigquery
      method: service-account
      project: GCP_PROJECT_ID
      dataset: DBT_DATASET_NAME
      threads: 4 # Must be a value of 1 or greater
      keyfile: /PATH/TO/BIGQUERY/keyfile.json
      [OPTIONAL_CONFIG](#optional-configurations): VALUE
```

</File>

### Service Account JSON

:::caution Note

This authentication method is only recommended for production environments where using a Service Account Keyfile is impractical.

:::



<File name='~/.dbt/profiles.yml'>

```yaml
my-bigquery-db:
  target: dev
  outputs:
    dev:
      type: bigquery
      method: service-account-json
      project: GCP_PROJECT_ID
      dataset: DBT_DATASET_NAME
      threads: 4 # Must be a value of 1 or greater
      [OPTIONAL_CONFIG](#optional-configurations): VALUE

      # These fields come from the service account json keyfile
      keyfile_json:
        type: xxx
        project_id: xxx
        private_key_id: xxx
        private_key: xxx
        client_email: xxx
        client_id: xxx
        auth_uri: xxx
        token_uri: xxx
        auth_provider_x509_cert_url: xxx
        client_x509_cert_url: xxx

```

</File>

## Optional configurations

### Priority

The `priority` for the BigQuery jobs that dbt executes can be configured with the `priority` configuration in your BigQuery profile. The `priority` field can be set to one of `batch` or `interactive`. For more information on query priority, consult the [BigQuery documentation](https://cloud.google.com/bigquery/docs/running-queries).

```yaml
my-profile:
  target: dev
  outputs:
    dev:
      type: bigquery
      method: oauth
      project: abc-123
      dataset: my_dataset
      priority: interactive
```

### Timeouts and Retries

The `dbt-bigquery` plugin uses the BigQuery Python client library to submit queries. Each query requires two steps:
1. Job creation: Submit the query job to BigQuery, and receive its job ID.
2. Job execution: Wait for the query job to finish executing, and receive its result.

Some queries inevitably fail, at different points in process. To handle these cases, dbt supports <Term id="grain">fine-grained</Term> configuration for query timeouts and retries.

#### job_execution_timeout_seconds

Use the `job_execution_timeout_seconds` configuration to set the number of seconds dbt should wait for queries to complete, after being submitted successfully. Of the four configurations that control timeout and retries, this one is the most common to use.

:::info Renamed config

In older versions of `dbt-bigquery`, this same config was called `timeout_seconds`.

:::
  
No timeout is set by default. (For historical reasons, some query types use a default of 300 seconds when the `job_execution_timeout_seconds` configuration is not set). When you do set the `job_execution_timeout_seconds`, if any dbt query takes more than 300 seconds to finish, the dbt-bigquery adapter will run into an exception:

```
 Operation did not complete within the designated timeout.
```

:::caution Note

The `job_execution_timeout_seconds` represents the number of seconds to wait for the [underlying HTTP transport](https://cloud.google.com/python/docs/reference/bigquery/latest/google.cloud.bigquery.job.QueryJob#google_cloud_bigquery_job_QueryJob_result). It _doesn't_ represent the maximum allowable time for a BigQuery job itself. So, if dbt-bigquery ran into an exception at 300 seconds, the actual BigQuery job could still be running for the time set in BigQuery's own timeout settings.

:::
  
You can change the timeout seconds for the job execution step by configuring `job_execution_timeout_seconds` in the BigQuery profile:

```yaml
my-profile:
  target: dev
  outputs:
    dev:
      type: bigquery
      method: oauth
      project: abc-123
      dataset: my_dataset
      job_execution_timeout_seconds: 600 # 10 minutes
```

#### job_creation_timeout_seconds

It is also possible for a query job to fail to submit in the first place. You can configure the maximum timeout for the job creation step by configuring  `job_creation_timeout_seconds`. No timeout is set by default.

In the job creation step, dbt is simply submitting a query job to BigQuery's `Jobs.Insert` API, and receiving a query job ID in return. It should take a few seconds at most. In some rare situations, it could take longer.

#### job_retries

Google's BigQuery Python client has native support for retrying query jobs that time out, or queries that run into transient errors and are likely to succeed if run again. You can configure the maximum number of retries by configuring `job_retries`.

:::info Renamed config

In older versions of `dbt-bigquery`, the `job_retries` config was just called `retries`.

:::

The default value is 1, meaning that dbt will retry failing queries exactly once. You can set the configuration to 0 to disable retries entirely.

#### job_retry_deadline_seconds

After a query job times out, or encounters a transient error, dbt will wait one second before retrying the same query. In cases where queries are repeatedly timing out, this can add up to a long wait. You can set the `job_retry_deadline_seconds` configuration to set the total number of seconds you're willing to wait ("deadline") while retrying the same query. If dbt hits the deadline, it will give up and return an error.

Combining the four configurations above, we can maximize our chances of mitigating intermittent query errors. In the example below, we will wait up to 30 seconds for initial job creation. Then, we'll wait up to 10 minutes (600 seconds) for the query to return results. If the query times out, or encounters a transient error, we will retry it up to 5 times. The whole process cannot take longer than 20 minutes (1200 seconds). At that point, dbt will raise an error.

<File name='profiles.yml'>

```yaml
my-profile:
  target: dev
  outputs:
    dev:
      type: bigquery
      method: oauth
      project: abc-123
      dataset: my_dataset
      job_creation_timeout_seconds: 30
      job_execution_timeout_seconds: 600
      job_retries: 5
      job_retry_deadline_seconds: 1200

```

</File>


### Dataset locations

The location of BigQuery datasets can be configured using the `location` configuration in a BigQuery profile.
`location` may be either a multi-regional location (e.g. `EU`, `US`), or a regional location (e.g. `us-west2` ) as per [the BigQuery documentation](https://cloud.google.com/bigquery/docs/locations) describes.
Example:

```yaml
my-profile:
  target: dev
  outputs:
    dev:
      type: bigquery
      method: oauth
      project: abc-123
      dataset: my_dataset
      location: US # Optional, one of US or EU, or a regional location
```

### Maximum Bytes Billed

When a `maximum_bytes_billed` value is configured for a BigQuery profile,
queries executed by dbt will fail if they exceed the configured maximum bytes
threshhold. This configuration should be supplied as an integer number
of bytes.


```yaml
my-profile:
  target: dev
  outputs:
    dev:
      type: bigquery
      method: oauth
      project: abc-123
      dataset: my_dataset
      # If a query would bill more than a gigabyte of data, then
      # BigQuery will reject the query
      maximum_bytes_billed: 1000000000
```

**Example output**

```
Database Error in model debug_table (models/debug_table.sql)
  Query exceeded limit for bytes billed: 1000000000. 2000000000 or higher required.
  compiled SQL at target/run/bq_project/models/debug_table.sql
```

### OAuth 2.0 Scopes for Google APIs

By default, the BigQuery connector requests three OAuth scopes, namely `https://www.googleapis.com/auth/bigquery`, `https://www.googleapis.com/auth/cloud-platform`, and `https://www.googleapis.com/auth/drive`. These scopes were originally added to provide access for the models that are reading from Google Sheets. However, in some cases, a user may need to customize the default scopes (for example, to reduce them down to the minimal set needed). By using the `scopes` profile configuration you are able to set up your own OAuth scopes for dbt. Example:

```yaml
my-profile:
  target: dev
  outputs:
    dev:
      type: bigquery
      method: oauth
      project: abc-123
      dataset: my_dataset
      scopes:
        - https://www.googleapis.com/auth/bigquery
```

### Service Account Impersonation

This feature allows users authenticating via local OAuth to access BigQuery resources based on the permissions of a service account.

```yaml
my-profile:
  target: dev
  outputs:
    dev:
      type: bigquery
      method: oauth
      project: abc-123
      dataset: my_dataset
      impersonate_service_account: dbt-runner@yourproject.iam.gserviceaccount.com
```

For a general overview of this process, see the official docs for [Creating Short-lived Service Account Credentials](https://cloud.google.com/iam/docs/creating-short-lived-service-account-credentials).

<FAQ path="Warehouse/bq-impersonate-service-account-why" />
<FAQ path="Warehouse/bq-impersonate-service-account-setup" />

### Execution project

By default, dbt will use the specified `project`/`database` as both:
1. The location to materialize resources (models, seeds, snapshots, etc), unless they specify a custom `project`/`database` config
2. The GCP project that receives the bill for query costs or slot usage

Optionally, you may specify an `execution_project` to bill for query execution, instead of the `project`/`database` where you materialize most resources.

```yaml
my-profile:
  target: dev
  outputs:
    dev:
      type: bigquery
      method: oauth
      project: abc-123
      dataset: my_dataset
      execution_project: buck-stops-here-456
```

### Running Python models on Dataproc

import BigQueryDataproc from '/snippets/_bigquery-dataproc.md';

<BigQueryDataproc />

Then, add the bucket name, cluster name, and cluster region to your connection profile:

```yaml
my-profile:
  target: dev
  outputs:
    dev:
      type: bigquery
      method: oauth
      project: abc-123
      dataset: my_dataset
      
      # for dbt Python models to be run on a Dataproc cluster
      gcs_bucket: dbt-python
      dataproc_cluster_name: dbt-python
      dataproc_region: us-central1
```

Alternatively, Dataproc Serverless can be used:

```yaml
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
        batch_id: MY_CUSTOM_BATCH_ID # Supported in v1.7+
        environment_config:
          execution_config:
            service_account: dbt@abc-123.iam.gserviceaccount.com
            subnetwork_uri: regions/us-central1/subnetworks/dataproc-dbt
        labels:
          project: my-project
          role: dev
        runtime_config:
          properties:
            spark.executor.instances: "3"
            spark.driver.memory: 1g
```

For a full list of possible configuration fields that can be passed in `dataproc_batch`, refer to the [Dataproc Serverless Batch](https://cloud.google.com/dataproc-serverless/docs/reference/rpc/google.cloud.dataproc.v1#google.cloud.dataproc.v1.Batch) documentation.


## Required permissions

BigQuery's permission model is dissimilar from more conventional databases like Snowflake and Redshift. The following permissions are required for dbt user accounts:
- BigQuery Data Editor
- BigQuery User

This set of permissions will permit dbt users to read from and create tables and <Term id="view">views</Term> in a BigQuery project.

## Local OAuth gcloud setup

To connect to BigQuery using the `oauth` method, follow these steps:

1. Make sure the `gcloud` command is [installed on your computer](https://cloud.google.com/sdk/downloads)
2. Activate the application-default account with

```shell
gcloud auth application-default login \
  --scopes=https://www.googleapis.com/auth/bigquery,\
https://www.googleapis.com/auth/drive.readonly,\
https://www.googleapis.com/auth/iam.test
```

A browser window should open, and you should be prompted to log into your Google account. Once you've done that, dbt will use your OAuth'd credentials to connect to BigQuery!

This command uses the `--scopes` flag to request access to Google Sheets. This makes it possible to transform data in Google Sheets using dbt. If your dbt project does not transform data in Google Sheets, then you may omit the `--scopes` flag.
