---
title: "BigQuery Profile"
---

## Authentication Methods

BigQuery targets can be specified using one of four methods:

1. [oauth via `gcloud`](#oauth-via-gcloud)
2. [oauth token-based](#oauth-token-based)
3. [service account file](#service-account-file)
4. [service account json](#service-account-json)

For local development, we recommend using the oauth method. If you're scheduling dbt on a server, you should use the service account auth method instead.

BigQuery targets should be set up using the following configuration in your `profiles.yml` file.

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
      timeout_seconds: 300
      location: US # Optional, one of US or EU
      priority: interactive
      retries: 1
```

</File>

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
      timeout_seconds: 300
      location: US # Optional, one of US or EU
      priority: interactive
      retries: 1
      refresh_token: [token]
      client_id: [client id]
      client_secret: [client secret]
      token_uri: [redirect URI]
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
      timeout_seconds: 300
      location: US # Optional, one of US or EU
      priority: interactive
      retries: 1
      token: [temporary access token] # refreshed + updated by external process
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
      timeout_seconds: 300
      priority: interactive
      retries: 1
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
      timeout_seconds: 300
      priority: interactive

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

## Configuration options

### Priority

The `priority` for the BigQuery jobs that dbt executes can be configured with the `priority` configuration in your BigQuery profile. The `priority` field can be set to one of `batch` or `interactive`. For more information on query priority, consult the [BigQuery documentation](https://cloud.google.com/bigquery/docs/running-queries).

### Timeouts

BigQuery supports query timeouts. By default, the timeout is set to 300 seconds. If a dbt model takes longer than this timeout to complete, then BigQuery may cancel the query and issue the following error:

```
 Operation did not complete within the designated timeout.
```

To change this timeout, use the `timeout_seconds` option shown in the BigQuery profile configuration above.

### Retries

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

### Dataset locations

The location of BigQuery datasets can be configured using the `location` configuration in a BigQuery profile. Example:

```yaml
my-profile:
  target: dev
  outputs:
    dev:
      type: bigquery
      method: oauth
      project: abc-123
      dataset: my_dataset
      location: US # Optional, one of US or EU
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
  --scopes=https://www.googleapis.com/auth/userinfo.email,\
https://www.googleapis.com/auth/cloud-platform,\
https://www.googleapis.com/auth/drive.readonly
```

A browser window should open, and you should be promoted to log into your Google account. Once you've done that, dbt will use your oauth'd credentials to connect to BigQuery!

This command uses the `--scopes` flag to request access to Google Sheets. This makes it possible to transform data in Google Sheets using dbt. If your dbt project does not transform data in Google Sheets, then you may omit the `--scopes` flag.
