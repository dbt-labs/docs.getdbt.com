---
title: "BigQuery Profile"
---

## Overview of dbt-bigquery
**Maintained by:** core dbt maintainers    
**Author:** dbt Labs    
**Source:** [Github](https://github.com/dbt-labs/dbt-bigquery)   
**dbt Cloud:** Supported   
**dbt Slack channel** [Link to channel](https://getdbt.slack.com/archives/C99SNSRTK)      


## Authentication Methods

BigQuery targets can be specified using one of four methods:

1. [oauth via `gcloud`](#oauth-via-gcloud)
2. [oauth token-based](#oauth-token-based)
3. [service account file](#service-account-file)
4. [service account json](#service-account-json)

For local development, we recommend using the oauth method. If you're scheduling dbt on a server, you should use the service account auth method instead.

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

### Oauth Token-Based

See [docs](https://developers.google.com/identity/protocols/oauth2) on using Oauth 2.0 to access Google APIs.

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

Every BigQuery query is made in two steps:
1. Submit the query job to BQ server and obtain a query job id. 
2. Wait for the query to execute and poll the query result. 

dbt supports configuring BigQuery query timeouts in each step, as well as the retry and deadline of the overall query. 

#### job_execution_timeout_seconds

The timeout setting of step 2, `job_execution_timeout_seconds`, is the most common one.

:::info Renamed config

In older versions, this same config was just called `timeout_seconds`.

:::
  
By default, the query execuion timeout is set to 300 seconds. If a dbt model takes longer than this timeout to complete, then BigQuery may cancel the query and issue the following error:

```
 Operation did not complete within the designated timeout.
```
  
To change this timeout, use the `job_execution_timeout_seconds` configuration:

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
  
In addition, dbt also allow more advanced timeout control in step 1 via `job_creation_timeout_seconds`, in which dbt submits a query job to BQ JobInsert API server and receives a query job id in return. This step shall be very quick, usually under a few seconds. However, in some rare situation, it could take much longer to complete. 

#### job_retry_deadline_seconds

Pass a maximum deadline into the BigQuery client's built-in retry capabilities. From [Google's docs](https://googleapis.dev/python/google-api-core/latest/retry.html):

> Because a exponential sleep algorithm is used, the retry is limited by a deadline. The deadline is the maxmimum amount of time a method can block. This is used instead of total number of retries because it is difficult to ascertain the amount of time a function can block when using total number of retries and exponential backoff.

#### job_retries

In addition to using the BigQuery client's built-in retry logic, dbt will retry queries itself, up to a certain number of times, if they result in unhandled BigQuery errors.

:::info Renamed config

In older versions, the `job_retries` config was just called `retries`.

:::

Combining the four configurations above, we can maximize our chances of mitigating intermittent query errors.

<File name='profiles.yml'>

```yaml
# In this example below, target would fail faster on the step of BQ job creation,
# while allowing queries with long-running results.
# it would also retry BigQuery queries 5 times. 
# If the query does not succeed after the fifth attempt or exceed 
# the maximum deadline of 1500 seconds, or then dbt will raise an error.

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
      job_retry_deadline_seconds: 1500
      job_retries: 5

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
`location` may be iether a multi-regional location (e.g. `EU`, `US`), or a regional location (e.g. `us-west2` ) as per the [the BigQuery documentation](https://cloud.google.com/bigquery/docs/locations) describes.
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

This feature allows users authenticating via local oauth to access BigQuery resources based on the permissions of a service account.

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

<FAQ src="bq-impersonate-service-account-why" />
<FAQ src="bq-impersonate-service-account-setup" />

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

## Required permissions

BigQuery's permission model is dissimilar from more conventional databases like Snowflake and Redshift. The following permissions are required for dbt user accounts:
- BigQuery Data Editor
- BigQuery User

This set of permissions will permit dbt users to read from and create tables and views in a BigQuery project.

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

A browser window should open, and you should be prompted to log into your Google account. Once you've done that, dbt will use your oauth'd credentials to connect to BigQuery!

This command uses the `--scopes` flag to request access to Google Sheets. This makes it possible to transform data in Google Sheets using dbt. If your dbt project does not transform data in Google Sheets, then you may omit the `--scopes` flag.
