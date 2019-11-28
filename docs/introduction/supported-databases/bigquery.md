---
id: big-query
title: BigQuery
---
# Set up a BigQuery target

BigQuery targets can be specified using one of three methods:
1. oauth
2. a service account file
3. service account json

For local development, we recommend using the oauth method. If you're scheduling dbt on a server, you should use the service account auth method instead.

BigQuery targets should be set up using the following configuration in your `profiles.yml` file.

## oauth Authentication

[block:code]
{
  "codes": [
    {
      "code": "# Note that only one of these targets is required\n\nmy-bigquery-db:\n  target: dev\n  outputs:\n    dev:\n      type: bigquery\n      method: oauth\n      project: [GCP project id]\n      dataset: [the name of your dbt dataset] # You can also use \"schema\" here\n      threads: [1 or more]\n      timeout_seconds: 300\n      location: US # Optional, one of US or EU\n      priority: interactive",
      "language": "yaml",
      "name": "~/.dbt/profiles.yml"
    }
  ]
}
[/block]
## Service Account File Authentication
[block:code]
{
  "codes": [
    {
      "code": "my-bigquery-db:\n  target: dev\n  outputs:\n    dev:\n      type: bigquery\n      method: service-account\n      project: [GCP project id]\n      dataset: [the name of your dbt dataset]\n      threads: [1 or more]\n      keyfile: [/path/to/bigquery/keyfile.json]\n      timeout_seconds: 300\n      priority: interactive",
      "language": "yaml",
      "name": "~/.dbt/profiles.yml"
    }
  ]
}
[/block]
## Service Account JSON Authentication
[block:callout]
{
  "type": "warning",
  "title": "Note",
  "body": "This authentication method is only recommended for production environments where using a Service Account Keyfile is impractical."
}
[/block]

[block:code]
{
  "codes": [
    {
      "code": "my-bigquery-db:\n  target: dev\n  outputs:\n    dev:\n      type: bigquery\n      method: service-account-json\n      project: [GCP project id]\n      dataset: [the name of your dbt dataset]\n      threads: [1 or more]\n      timeout_seconds: 300\n      priority: interactive\n\n      # These fields come from the service account json keyfile\n      keyfile_json:\n        type: xxx\n        project_id: xxx\n        private_key_id: xxx\n        private_key: xxx\n        client_email: xxx\n        client_id: xxx\n        auth_uri: xxx\n        token_uri: xxx\n        auth_provider_x509_cert_url: xxx\n        client_x509_cert_url: xxx\n",
      "language": "yaml",
      "name": "~/.dbt/profiles.yml"
    }
  ]
}
[/block]
# Oauth Authorization

To connect to BigQuery using the `oauth` method, follow these steps:
1. Make sure the `gcloud` command is [installed on your computer](https://cloud.google.com/sdk/downloads)
2. Activate the application-default account with
[block:code]
{
  "codes": [
    {
      "code": "gcloud auth application-default login --scopes=https://www.googleapis.com/auth/userinfo.email,https://www.googleapis.com/auth/cloud-platform,https://www.googleapis.com/auth/drive.readonly",
      "language": "shell",
      "name": null
    }
  ]
}
[/block]
A browser window should open, and you should be promoted to log into your Google account. Once you've done that, dbt will use your oauth'd credentials to connect to BigQuery!

This command uses the `--scopes` flag to request access to Google Sheets. This makes it possible to transform data in Google Sheets using dbt. If your dbt project does not transform data in Google Sheets, then you may omit the `--scopes` flag.

# Priority

The `priority` for the BigQuery jobs that dbt executes can be configured with the `priority` configuration in your BigQuery profile. The `priority` field can be set to one of `batch` or `interactive`. For more information on query priority, consult the [BigQuery documentation](https://cloud.google.com/bigquery/docs/running-queries).

# Timeouts

BigQuery supports query timeouts. By default, the timeout is set to 300 seconds. If a dbt model takes longer than this timeout to complete, then BigQuery may cancel the query and issue the following error:

```
 Operation did not complete within the designated timeout.
```

To change this timeout, use the `timeout_seconds` option shown in the BigQuery profile configuration above.

# Dataset locations

The location of BigQuery datasets can be configured using the `location` configuration in a BigQuery profile. Example:
[block:code]
{
  "codes": [
    {
      "code": "my-profile:\n  target: dev\n  outputs:\n    dev:\n      type: bigquery\n      method: oauth\n      project: abc-123\n      dataset: my_dataset\n      location: US # Optional, one of US or EU",
      "language": "yaml"
    }
  ]
}
[/block]
# Required permissions

BigQuery's permission model is dissimilar from more conventional databases like Snowflake and Redshift. The following permissions are required for dbt user accounts:
- BigQuery Data Editor
- BigQuery Job User
- BigQuery User

This set of permissions will permit dbt users to read from and create tables and views in a BigQuery project.
