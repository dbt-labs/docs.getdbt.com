---
title: "Connect BigQuery"
id: connect-bigquery
description: "Configure BigQuery connection."
sidebar_label: "Connect BigQuery"
---

## Authentication

### JSON keyfile

:::info Uploading a service account JSON keyfile

While the fields in a BigQuery connection can be specified manually, we recommend uploading a service account <Term id="json" /> keyfile to quickly and accurately configure a connection to BigQuery.

:::

Uploading a JSON keyfile should populate the following fields:
- Project id
- Private key id
- Private key
- Client email
- Client id
- Auth uri
- Token uri
- Auth provider x509 cert url
- Client x509 cert url

In addition to these fields, there are two other optional fields that can be configured in a BigQuery connection:

| Field | Description | Examples |
| ----- | ----------- | ------- |
| Timeout | Deprecated; exists for backwards compatibility with older versions of dbt and will be removed in the future. | `300` |
| Location | The [location](https://cloud.google.com/bigquery/docs/locations) where dbt should create datasets. | `US`, `EU` |



<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/bigquery-connection.png" title="A valid BigQuery connection"/>

### BigQuery OAuth
**Available in:** Development environments, Enterprise plans only

The OAuth auth method permits dbt Cloud to run development queries on behalf of
a BigQuery user without the configuration of BigQuery service account keyfile in dbt Cloud. For
more information on the initial configuration of a BigQuery OAuth connection in dbt Cloud, please see
[the docs on setting up BigQuery OAuth](/docs/cloud/manage-access/set-up-bigquery-oauth).

As an end user, if your organization has set up BigQuery OAuth, you can link a project with your personal BigQuery account in your personal Profile in dbt Cloud, like so:
<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/gsuite/bq_oauth/bq_oauth_as_user.gif" title="Link Button in dbt Cloud Credentials Screen" />

## Configuration

To learn how to optimize performance with data platform-specific configurations in dbt Cloud, refer to [BigQuery-specific configuration](/reference/resource-configs/bigquery-configs).

### Account level connections and credential management

You can re-use connections across multiple projects with [global connections](/docs/cloud/connect-data-platform/about-connections#migration-from-project-level-connections-to-account-level-connections). Connections are attached at the environment level (formerly project level), so you can utilize multiple connections inside of a single project (to handle dev, staging, production, etc.).

BigQuery connections in dbt Cloud currently expect the credentials to be handled at the connection level (and only BigQuery connections). This was originally designed to facilitate creating a new connection by uploading a service account keyfile. This describes how to override credentials at the environment level, via [extended attributes](/docs/dbt-cloud-environments#extended-attributes), _to allow project administrators to manage credentials independently_ of the account level connection details used for that environment.

For a project, you will first create an environment variable to store the secret `private_key` value. Then, you will use extended attributes to override the entire service account JSON (due to a constraint of extended attributes, you can't only override the secret key).

1. **New environment variable**

    - Create a new _secret_ [environment variable](https://docs.getdbt.com/docs/build/environment-variables#handling-secrets) to handle the private key: `DBT_ENV_SECRET_PROJECTXXX_PRIVATE_KEY`
    - Fill in the private key value according the environment

    To automate your deployment, you can use the following [admin API request](https://docs.getdbt.com/dbt-cloud/api-v3#/operations/Create%20Projects%20Environment%20Variables%20Bulk), with `XXXXX` your account number, `YYYYY` your project number, `ZZZZZ` your [API token](/docs/dbt-cloud-apis/authentication):

    ```shell
    curl --request POST \
    --url https://cloud.getdbt.com/api/v3/accounts/XXXXX/projects/YYYYY/environment-variables/bulk/ \
    --header 'Accept: application/json' \
    --header 'Authorization: Bearer ZZZZZ' \
    --header 'Content-Type: application/json' \
    --data '{
    "env_var": [
    {
        "new_name": "DBT_ENV_SECRET_PROJECTXXX_PRIVATE_KEY",
        "project": "Value by default for the entire project",
        "ENVIRONMENT_NAME_1": "Optional, if wanted, value for environment name 1",
        "ENVIRONMENT_NAME_2": "Optional, if wanted, value for environment name 2"
    }
    ]
    }'
    ```


2. **Extended attributes**

In the environment details, fill the [extended attributes](/docs/dbt-cloud-environments#extended-attributes) block with the following payload (replacing `XXX` with your relevant information):

    ```yaml
    keyfile_json:
      type: service_account
      project_id: xxx
      private_key_id: xxx
      private_key: '{{ env_var(''DBT_ENV_SECRET_PROJECTXXX_PRIVATE_KEY'') }}'
      client_email: xxx
      client_id: xxx
      auth_uri: xxx
      token_uri: xxx
      auth_provider_x509_cert_url: xxx
      client_x509_cert_url: xxx
    ```

    If you require [other fields](/docs/core/connect-data-platform/bigquery-setup#service-account-json) to be overridden at the enviromnent level via extended attributes, please respect the [expected indentiation](/docs/dbt-cloud-environments#only-the-top-level-keys-are-accepted-in-extended-attributes) (ordering doesn't matter):

    ```yaml
    priority: interactive
    keyfile_json:
      type: xxx
      project_id: xxx
      private_key_id: xxx
      private_key: '{{ env_var(''DBT_ENV_SECRET_PROJECTXXX_PRIVATE_KEY'') }}'
      client_email: xxx
      client_id: xxx
      auth_uri: xxx
      token_uri: xxx
      auth_provider_x509_cert_url: xxx
      client_x509_cert_url: xxx
    execution_project: buck-stops-here-456
    ```

    To automate your deployment, you first need to [create the extended attributes payload](https://docs.getdbt.com/dbt-cloud/api-v3#/operations/Create%20Extended%20Attributes) for a given project, and then [assign it](https://docs.getdbt.com/dbt-cloud/api-v3#/operations/Update%20Environment) to a specific environment. With `XXXXX` your account number, `YYYYY` your project number, `ZZZZZ` your [API token](/docs/dbt-cloud-apis/authentication):

    ```shell
    curl --request POST \
    --url https://cloud.getdbt.com/api/v3/accounts/XXXXX/projects/YYYYY/extended-attributes/ \
    --header 'Accept: application/json' \
    --header 'Authorization: Bearer ZZZZZ' \
    --header 'Content-Type: application/json' \
    --data '{
    "id": null,
    "extended_attributes": {"type":"service_account","project_id":"xxx","private_key_id":"xxx","private_key":"{{ env_var('DBT_ENV_SECRET_PROJECTXXX_PRIVATE_KEY')    }}","client_email":"xxx","client_id":xxx,"auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"xxx"},
    "state": 1
    }'
    ```
    **You will need to make a note of the `id` returned in the message**. It will be used in the following call. With `EEEEE` the environment id, `FFFFF` the extended attributes id: 

    ```shell
    curl --request POST \
    --url https://cloud.getdbt.com/api/v3/accounts/XXXXX/projects/YYYYY/environments/EEEEE/ \
    --header 'Accept: application/json' \
    --header 'Authorization: Bearer ZZZZZZ' \
    --header 'Content-Type: application/json' \
    --data '{
      "extended_attributes_id": FFFFF
    }'
    ```
