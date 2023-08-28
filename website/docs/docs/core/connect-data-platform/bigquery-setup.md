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
  platform_name: 'Big Query'
  config_page: '/reference/resource-configs/bigquery-configs'
---


<Snippet path="warehouse-setups-cloud-callout" />

<h2> Overview of {frontMatter.meta.pypi_package} </h2>

<ul>
    <li><strong>Maintained by</strong>: {frontMatter.meta.maintained_by}</li>
    <li><strong>Authors</strong>: {frontMatter.meta.authors}</li>
    <li><strong>GitHub repo</strong>: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a>   <a href={`https://github.com/${frontMatter.meta.github_repo}`}><img src={`https://img.shields.io/github/stars/${frontMatter.meta.github_repo}?style=for-the-badge`}/></a></li>
    <li><strong>PyPI package</strong>: <code>{frontMatter.meta.pypi_package}</code> <a href={`https://badge.fury.io/py/${frontMatter.meta.pypi_package}`}><img src={`https://badge.fury.io/py/${frontMatter.meta.pypi_package}.svg`}/></a></li>
    <li><strong>Slack channel</strong>: <a href={frontMatter.meta.slack_channel_link}>{frontMatter.meta.slack_channel_name}</a></li>
    <li><strong>Supported dbt Core version</strong>: {frontMatter.meta.min_core_version} and newer</li>
    <li><strong>dbt Cloud support</strong>: {frontMatter.meta.cloud_support}</li>
    <li><strong>Minimum data platform version</strong>: {frontMatter.meta.min_supported_version}</li>
    </ul>

<h2> Installing {frontMatter.meta.pypi_package} </h2>

pip is the easiest way to install the adapter:

<code>pip install {frontMatter.meta.pypi_package}</code>

<p>Installing <code>{frontMatter.meta.pypi_package}</code> will also install <code>dbt-core</code> and any other dependencies.</p>

<h2> Configuring {frontMatter.meta.pypi_package} </h2>

<p>For {frontMatter.meta.platform_name}-specifc configuration please refer to <a href={frontMatter.meta.config_page}>{frontMatter.meta.platform_name} Configuration</a> </p>

<p>For further info, refer to the GitHub repository: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a></p>


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
      project: [GCP project id]
      dataset: [the name of your dbt dataset] # You can also use "schema" here
      threads: [1 or more]
      [<optional_config>](#optional-configurations): <value>
```

</File>

**Default project**

<Changelog>New in dbt v0.19.0</Changelog>

If you do not specify a `project`/`database` and are using the `oauth` method, dbt will use the default `project` associated with your user, as defined by `gcloud config set`.

### OAuth Token-Based

See [docs](https://developers.google.com/identity/protocols/oauth2) on using OAuth 2.0 to access Google APIs.

<Tabs
  defaultValue="refresh"
  values={[
    {label: 'Refresh token', value: 'refresh'},
    {label: 'Temporary token', value: 'temp'},
  ]}>

<TabItem value="refresh">

Using the refresh token and client information, dbt will mint new access tokens as necessary.

<File name='~/.dbt/profiles.yml'>

```yaml
my-bigquery-db:
  target: dev
  outputs:
    dev:
      type: bigquery
      method: oauth-secrets
      project: [GCP project id]
      dataset: [the name of your dbt dataset] # You can also use "schema" here
      threads: [1 or more]
      refresh_token: [token]
      client_id: [client id]
      client_secret: [client secret]
      token_uri: [redirect URI]
      [<optional_config>](#optional-configurations): <value>
```

</File>

</TabItem>

<TabItem value="temp">

dbt will use the one-time access token, no questions asked. This approach makes sense if you have an external deployment process that can mint new access tokens and update the profile file accordingly.

<File name='~/.dbt/profiles.yml'>

```yaml
my-bigquery-db:
  target: dev
  outputs:
    dev:
      type: bigquery
      method: oauth-secrets
      project: [GCP project id]
      dataset: [the name of your dbt dataset] # You can also use "schema" here
      threads: [1 or more]
      token: [temporary access token] # refreshed + updated by external process
      [<optional_config>](#optional-configurations): <value>
```

</File>

</TabItem>

</Tabs>

### Service Account File

<File name='~/.dbt/profiles.yml'>

```yaml
my-bigquery-db:
  target: dev
  outputs:
    dev:
      type: bigquery
      method: service-account
      project: [GCP project id]
      dataset: [the name of your dbt dataset]
      threads: [1 or more]
      keyfile: [/path/to/bigquery/keyfile.json]
      [<optional_config>](#optional-configurations): <value>
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
      project: [GCP project id]
      dataset: [the name of your dbt dataset]
      threads: [1 or more]
      [<optional_config>](#optional-configurations): <value>

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

<VersionBlock firstVersion="1.1">

The `dbt-bigquery` plugin uses the BigQuery Python client library to submit queries. Each query requires two steps:
1. Job creation: Submit the query job to BigQuery, and receive its job ID.
2. Job execution: Wait for the query job to finish executing, and receive its result.

Some queries inevitably fail, at different points in process. To handle these cases, dbt supports <Term id="grain">fine-grained</Term> configuration for query timeouts and retries.

#### job_execution_timeout_seconds

Use the `job_execution_timeout_seconds` configuration to set the number of seconds dbt should wait for queries to complete, after being submitted successfully. Of the four configurations that control timeout and retries, this one is the most common to use.

:::info Renamed config

In older versions of `dbt-bigquery`, this same config was called `timeout_seconds`.

:::
  
No timeout is set by default. (For historical reasons, some query types use a default of 300 seconds when the `job_execution_timeout_seconds` configuration is not set.) When `job_execution_timeout_seconds` is set, if any dbt query, including a model's SQL transformation, takes longer than 300 seconds to complete, BigQuery might cancel the query and issue the following error:

```
 Operation did not complete within the designated timeout.
```
  
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

</VersionBlock>

<VersionBlock lastVersion="1.0">

BigQuery supports query timeouts. By default, the timeout is set to 300 seconds. If a dbt model takes longer than this timeout to complete, then BigQuery may cancel the query and issue the following error:

```
 Operation did not complete within the designated timeout.
```

To change this timeout, use the `timeout_seconds` configuration:

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
      timeout_seconds: 600 # 10 minutes
```

</File>

The `retries` profile configuration designates the number of times dbt should retry queries that result in unhandled server errors. This configuration is only specified for BigQuery targets. Example:

<File name='profiles.yml'>

```yaml
# This example target will retry BigQuery queries 5
# times with a delay. If the query does not succeed
# after the fifth attempt, then dbt will raise an error

my-profile:
  target: dev
  outputs:
    dev:
      type: bigquery
      method: oauth
      project: abc-123
      dataset: my_dataset
      retries: 5
```

</File>

</VersionBlock>

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

<Changelog>

- New in dbt v0.17.0

</Changelog>

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
<Changelog>New in v0.18.0</Changelog>

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
<Changelog>New in v0.21.0</Changelog>

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

<VersionBlock firstVersion="1.3">

### Running Python models on Dataproc

To run dbt Python models on GCP, dbt uses companion services, Dataproc and Cloud Storage, that offer tight integrations with BigQuery. You may use an existing Dataproc cluster and Cloud Storage bucket, or create new ones:
- https://cloud.google.com/dataproc/docs/guides/create-cluster
- https://cloud.google.com/storage/docs/creating-buckets

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
        environment_config:
          execution_config:
            service_account: dbt@abc-123.iam.gserviceaccount.com
            subnetwork_uri: regions/us-central1/subnetworks/dataproc-dbt
        labels:
          project: my-project
          role: dev
        runtime_config:
          properties:
            spark.executor.instances: 3
            spark.driver.memory: 1g
```

For a full list of possible configuration fields that can be passed in `dataproc_batch`, refer to the [Dataproc Serverless Batch](https://cloud.google.com/dataproc-serverless/docs/reference/rpc/google.cloud.dataproc.v1#google.cloud.dataproc.v1.Batch) documentation.

</VersionBlock>

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
