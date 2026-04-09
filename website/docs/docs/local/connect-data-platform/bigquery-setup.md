---
title: "BigQuery"
description: "Read this guide to learn about the BigQuery warehouse setup in dbt."
meta:
  maintained_by: dbt Labs
  authors: 'dbt maintainers'
  github_repo: 'dbt-labs/dbt-adapters'
  pypi_package: 'dbt-bigquery'
  min_core_version: 'v0.10.0'
  cloud_support: Supported
  min_supported_version: 'n/a'
  slack_channel_name: '#db-bigquery'
  slack_channel_link: 'https://getdbt.slack.com/archives/C99SNSRTK'
  platform_name: 'BigQuery'
  config_page: '/reference/resource-configs/bigquery-configs'
---

<VersionBlock firstVersion="2.0">

# Connect BigQuery to Fusion <Lifecycle status='preview' />

You can configure the BigQuery adapter by running `dbt init` in your CLI or manually providing the `profiles.yml` file with the fields configured for your authentication type.

The BigQuery adapter for Fusion supports the following [authentication methods](#supported-authentication-types):
- Service account (JSON file)
- gcloud OAuth

## Warehouse permissions

import FusionBigQueryWarehousePerms from '/snippets/_fusion-warehouse-permissions-bigquery.md';

<FusionBigQueryWarehousePerms />

## Configure Fusion

Executing `dbt init` in your CLI will prompt for the following fields:
- **Project ID:** The GCP BigQuery project ID
- **Dataset:** The schema name
- **Location:** The location for your GCP environment (for example, us-east1)

Alternatively, you can manually create the `profiles.yml` file and configure the fields. See examples in [authentication](#supported-authentication-types) section for formatting. If there is an existing `profiles.yml` file, you have the option to retain the existing fields or overwrite them. 

Next, select your authentication method. Follow the on-screen prompts to provide the required information.

## Supported authentication types

<Tabs>

<TabItem value="Service account (JSON file)">

Selecting the **Service account (JSON file)** authentication type will prompt you for the path to your JSON file. You can also manually define the path in your `profiles.yml` file.

#### Example service account JSON file configuration

<File name="profiles.yml">

```yml
default:
  target: dev
  outputs:
    dev:
      type: bigquery
      threads: 16
      database: ABC123
      schema: JAFFLE_SHOP
      method: service-account
      keyfile: /Users/youruser/Downloads/CustomRoleDefinition.json
      location: us-east1
      dataproc_batch: null
```

</File>

</TabItem>

<TabItem value="gcloud OAuth">

Prior to selecting this authentication method, you must first configure local OAuth for gcloud:

#### Local OAuth gcloud setup

1. Make sure the `gcloud` command is [installed on your computer](https://cloud.google.com/sdk/downloads).
2. Activate the application-default account with:

```shell
gcloud auth application-default login \           
  --scopes=https://www.googleapis.com/auth/bigquery,\
https://www.googleapis.com/auth/drive.readonly,\
https://www.googleapis.com/auth/iam.test,\
https://www.googleapis.com/auth/cloud-platform

# This command uses the `--scopes` flag to request access to Google Sheets. This makes it possible to transform data in Google Sheets using dbt. If your dbt project does not transform data in Google Sheets, then you may omit the `--scopes` flag.
```

A browser window should open, and you should be prompted to log into your Google account. Once you've done that, dbt will use your OAuth'd credentials to connect to BigQuery.

#### Example gcloud configuration

<File name="profiles.yml">

```yml
default:
  target: dev
  outputs:
    dev:
      type: bigquery
      threads: 16
      database: ABC123
      schema: JAFFLE_SHOP
      method: oauth
      location: us-east1
      dataproc_batch: null

```

</File>

</TabItem>

</Tabs>

## More information

Find BigQuery-specific configuration information in the [BigQuery adapter reference guide](/reference/resource-configs/bigquery-configs).

</VersionBlock>

<VersionBlock lastVersion="1.99">

# Connect BigQuery to dbt Core

<ProductCard text="Fusion compatible" url="/docs/local/connect-data-platform/bigquery-setup?version=2" /> connection also available.

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

## Prerequisites

- Install [Git](https://git-scm.com/install/)
- Install [Google Cloud SDK](https://docs.cloud.google.com/sdk/docs/install-sdk)
- Use Python versions 3.13.x or older. Python 3.14 is [not supported](/faqs/Core/install-python-compatibility#python-compatibility-matrix) as yet
- Access to a GCP account BigQuery project
- Access to a Git platform repository (like GitHub, AzureDevOps, GitLab, and so on)

## Required permissions

import BigQueryPerms from '/snippets/_bigquery-permissions.md';

<BigQueryPerms />

## Authentication Methods

BigQuery targets can be specified using one of four methods:

1. [OAuth via `gcloud`](#oauth-via-gcloud)
2. [OAuth token-based](#oauth-token-based)
3. [service account file](#service-account-file)
4. [service account JSON](#service-account-json)

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

      # These fields come from the service account JSON keyfile
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

In older versions of `dbt-bigquery`, this same config was called `timeout_seconds`.

Use the `job_execution_timeout_seconds` configuration to set the number of seconds dbt should wait for queries to complete after successfully submitting them. Of the four configurations that control timeout and retries, this one is the most common to use.

<VersionBlock lastVersion="1.11">

You can set the `job_execution_timeout_seconds` config in your BigQuery profile. The value set at the profile level becomes the default and applies to all runs.

For example:

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


</VersionBlock>

<VersionBlock firstVersion="1.12">

You can set the `job_execution_timeout_seconds` config in your BigQuery profile. The value set at the profile level becomes the default and applies to all runs. To override this default value, you can set the config individually per model, snapshot, seed, or test.

- Profile-level configuration:

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

- Resource-level configuration:

  <Tabs>
  <TabItem value="model" label="Models">

  <File name='my_model.sql'>

  ```sql
  {{ config(job_execution_timeout_seconds=600) }}
  SELECT ...
  ```

  </File>

  <File name='schema.yml'>

  ```yaml
  models:
    - name: my_model
      config:
        job_execution_timeout_seconds: 600
  ```

  </File>

  </TabItem>
  <TabItem value="seeds" label="Seeds">

  ```yaml
  seeds:
    - name: my_seed
      config:
        job_execution_timeout_seconds: 600
  ```

  For seeds, the timeout applies to the SQL that runs after the CSV is uploaded. The upload step uses the profile-level timeout.

  </TabItem>
  <TabItem value="snapshots" label="Snapshots">

  ```yaml
  snapshots:
    - name: my_snapshot
      config:
        job_execution_timeout_seconds: 600
  ```

  </TabItem>
  <TabItem value="tests" label="Tests">

  ```yaml
  models:
    - name: my_model
      columns:
        - name: id
          data_tests:
            - unique:
                config:
                  job_execution_timeout_seconds: 600
  ```

  </TabItem>
  </Tabs>

</VersionBlock>
  
No timeout is set by default. For historical reasons, some query types use a default of 300 seconds when the `job_execution_timeout_seconds` configuration is not set. When you do set the `job_execution_timeout_seconds`, if any dbt query takes more than the configured number of seconds to finish, the `dbt-bigquery` adapter will run into an exception:

```
 Operation did not complete within the designated timeout.
```

:::caution Note

The `job_execution_timeout_seconds` represents the number of seconds to wait for the [underlying HTTP transport](https://cloud.google.com/python/docs/reference/bigquery/latest/google.cloud.bigquery.job.QueryJob#google_cloud_bigquery_job_QueryJob_result). It _doesn't_ represent the maximum allowable time for a BigQuery job itself. 
Normally, BigQuery keeps running the job even if this timeout is reached; however, `dbt-bigquery` will send a request to BigQuery to cancel it.

:::

import JobTimeout from '/snippets/_bigquery-timeout.md';

<JobTimeout />

#### job_creation_timeout_seconds

It is also possible for a query job to fail to submit in the first place. You can configure the maximum timeout for the job creation step by configuring  `job_creation_timeout_seconds`. No timeout is set by default.

In the job creation step, dbt is simply submitting a query job to BigQuery's `Jobs.Insert` API, and receiving a query job ID in return. It should take a few seconds at most. In some rare situations, it could take longer.

import JobTimeout2 from '/snippets/_bigquery-timeout.md';

<JobTimeout2 />


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

<VersionBlock firstVersion="1.12">

#### job_link_info_level_log

By default, `dbt-bigquery` logs BigQuery job links at the debug level, so they only appear when you run dbt with the `--debug` flag. This can make it harder to find the corresponding job in the BigQuery console.

To log job links at the info level instead, set `job_link_info_level_log: true` in your BigQuery profile. 

With this enabled, job links appear in dbt logs, giving you quicker access to the BigQuery console for debugging and monitoring.

You can configure `dbt-bigquery` to log BigQuery job links at the info level by setting `job_link_info_level_log: true` in your BigQuery profile. This makes the job links visible in dbt logs, making it easier to access the BigQuery console for debugging and monitoring.

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
      job_link_info_level_log: true
```

</File>
</VersionBlock>

### Dataset locations

The location of BigQuery datasets can be configured using the `location` configuration in a BigQuery profile.
`location` may be either a multi-regional location (for example, `EU`, `US`), or a regional location (for example, `us-west2` ) as per [the BigQuery documentation](https://cloud.google.com/bigquery/docs/locations) describes.
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

### Quota project

By default, dbt will use the `quota_project_id` set within the credentials of the account you are using to authenticate to BigQuery.

Optionally, you may specify `quota_project` to bill for query execution instead of the default quota project specified for the account from the environment.

This can sometimes be required when impersonating service accounts that do not have the BigQuery API enabled within the project in which they are defined. Without overriding the quota project, it will fail to connect.

If you choose to set a quota project, the account you use to authenticate must have the `Service Usage Consumer` role on that project.

```yaml
my-profile:
  target: dev
  outputs:
    dev:
      type: bigquery
      method: oauth
      project: abc-123
      dataset: my_dataset
      quota_project: my-bq-quota-project
```

### Running Python models on BigQuery DataFrames
To run dbt Python models on GCP, dbt uses BigQuery DataFrames running directly with BigQuery compute, leveraging the scale and performance of BigQuery.

```
my-profile:
  target: dev
  outputs:
    dev:
      compute_region: us-central1
      dataset: my_dataset
      gcs_bucket: dbt-python
      job_execution_timeout_seconds: 300
      job_retries: 1
      location: US
      method: oauth
      priority: interactive
      project: abc-123
      threads: 1
      type: bigquery
```


### Running Python models on Dataproc

import BigQueryDataproc from '/snippets/_bigquery-dataproc.md';

<BigQueryDataproc />

The `submission_method` profile field controls how dbt submits Python model jobs. There are three supported values:

| `submission_method` | Description |
|---------------------|-------------|
| `serverless` (default) | Runs jobs on [Dataproc Serverless](/docs/local/connect-data-platform/bigquery-setup#dataproc-serverless) with no cluster management required |
| `cluster` | Runs jobs on an existing [Dataproc cluster](/docs/local/connect-data-platform/bigquery-setup#dataproc-cluster) |
| `bigframes` | Runs jobs using [BigQuery DataFrames](/docs/local/connect-data-platform/bigquery-setup#bigframes). No Spark setup required |

#### Dataproc cluster

Add the bucket name, cluster name, and cluster region to your connection profile:

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
      submission_method: cluster
      gcs_bucket: dbt-python
      dataproc_cluster_name: dbt-python
      dataproc_region: us-central1
```

#### Dataproc Serverless

Dataproc Serverless is the default `submission_method`. It requires no cluster management and supports optional batch configuration:

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
      submission_method: serverless
      gcs_bucket: dbt-python
      dataproc_region: us-central1
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

#### BigFrames

[BigQuery DataFrames](https://cloud.google.com/bigquery/docs/bigquery-dataframes-introduction) lets you run Python models using APIs directly in BigQuery without setting up Spark. Refer to the [dbt Python models with BigFrames](/guides/dbt-python-bigframes) guide for full setup instructions.

```yaml
my-profile:
  target: dev
  outputs:
    dev:
      type: bigquery
      method: oauth
      project: abc-123
      dataset: my_dataset

      # for dbt Python models to be run using BigQuery DataFrames
      submission_method: bigframes
      gcs_bucket: dbt-python
      dataproc_region: us-central1
```



## Local OAuth gcloud setup

To connect to BigQuery using the `oauth` method, follow these steps:

1. Make sure the `gcloud` command is [installed on your computer](https://cloud.google.com/sdk/downloads)
2. Activate the application-default account with:

```shell
gcloud auth application-default login \
  --scopes=https://www.googleapis.com/auth/bigquery,\
https://www.googleapis.com/auth/drive.readonly,\
https://www.googleapis.com/auth/iam.test,\
https://www.googleapis.com/auth/cloud-platform
```

A browser window should open, and you should be prompted to log into your Google account. Once you've done that, dbt will use your OAuth'd credentials to connect to BigQuery!

This command uses the `--scopes` flag to request access to Google Sheets. This makes it possible to transform data in Google Sheets using dbt. If your dbt project does not transform data in Google Sheets, then you may omit the `--scopes` flag.

</VersionBlock>
