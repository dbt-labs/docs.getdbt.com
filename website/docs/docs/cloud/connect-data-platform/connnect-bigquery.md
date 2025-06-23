---
title: "Connect BigQuery"
id: connect-bigquery
description: "Configure BigQuery connection."
sidebar_label: "Connect BigQuery"
---

## Authentication

<Constant name="cloud" /> supports different authentication methods depending on your environment and plan type:

- Development environments support:
    - Service JSON
    - BigQuery Oauth <Lifecycle status="managed" />
- Deployment environments support: 
    - Service JSON
    - BigQuery Workload Identity Federation (WIF) <Lifecycle status="managed" />

These authentication methods are set up in the [global connections account settings](/docs/cloud/connect-data-platform/about-connections), rather than single sign-on or integration settings. 

When you create a new BigQuery connection, you will be presented with two schema options for the connection (both use the same adapter):

- **BigQuery:** Supports all connection types (Use this option)
- **BigQuery (Legacy):**  Supports all connection types except for WIF (Deprecated feature. Do not use)

All new connections should use the **BigQuery** option as **BigQuery (Legacy)** will be deprecated. To update existing connections and credentials in an environment to use the new BigQuery option, first, use the [APIs](/docs/dbt-cloud-apis/admin-cloud-api) to remove the configurations. 

### JSON keyfile

:::info Uploading a service account JSON keyfile

While the fields in a BigQuery connection can be entered manually, we recommend uploading a service account <Term id="json" /> keyfile to quickly and accurately configure a connection to BigQuery. 

You can provide the JSON keyfile in one of two formats:

- JSON keyfile upload &mdash; Upload the keyfile directly using its normal JSON format.
- Base64-encoded string &mdash; Provide the keyfile as a base64-encoded string. When you provide a base64-encoded string, dbt decodes it automatically and populates the necessary fields.

:::

The JSON keyfile option is available for configuring both **development** and **deployment** environments.

Uploading a valid JSON keyfile will populate the following fields:
- Project ID
- Private key ID
- Private key
- Client email
- Client ID
- Auth URI
- Token URI
- Auth provider x509 cert url
- Client x509 cert url

In addition to these fields, two other optional fields can be configured in a BigQuery connection:

| Field | Description | Examples |
| ----- | ----------- | ------- |
| Timeout | Deprecated; exists for backwards compatibility with older versions of dbt and will be removed in the future. | `300` |
| Location | The [location](https://cloud.google.com/bigquery/docs/locations) where dbt should create datasets. | `US`, `EU` |


<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/bigquery-connection.png" title="A valid BigQuery connection"/>

### BigQuery OAuth
**Available in:** Development environments, Enterprise-tier plans only

The OAuth auth method permits <Constant name="cloud" /> to run development queries on behalf of
a BigQuery user without configuring the BigQuery service account keyfile in <Constant name="cloud" />. For more information on the initial configuration of a BigQuery OAuth connection in <Constant name="cloud" />, please see [the docs on setting up BigQuery OAuth](/docs/cloud/manage-access/set-up-bigquery-oauth).

As an end user, if your organization has set up BigQuery OAuth, you can link a project with your personal BigQuery account in your Profile in <Constant name="cloud" />.

### BigQuery Workload Identity Federation <Lifecycle status="managed, preview" />

:::note

If you're using BigQuery WIF, we recommend using it with BigQuery OAuth. Otherwise, you must create two connections - one with service JSON and one with WIF to use service JSON for development environments. 

:::

**Available in:** Deployment environments

The BigQuery WIF auth method permits <Constant name="cloud" /> to run deployment queries as a service account without configuring a BigQuery service account keyfile in <Constant name="cloud" />. For more information on the initial configuration of a BigQuery WIF connection in <Constant name="cloud" />, please see [the docs on setting up BigQuery](https://docs.getdbt.com/docs/cloud/manage-access/set-up-bigquery-oauth#Set-up-bigquery-workload-identity-federation) WIF.


## Configuration

To learn how to optimize performance with data platform-specific configurations in <Constant name="cloud" />, refer to [BigQuery-specific configuration](/reference/resource-configs/bigquery-configs).

### Optional configurations

In BigQuery, optional configurations let you tailor settings for tasks such as query priority, dataset location, job timeout, and more. These options give you greater control over how BigQuery functions behind the scenes to meet your requirements.

To customize your optional configurations in <Constant name="cloud" />:

1. Click your name at the bottom left-hand side bar menu in <Constant name="cloud" />
2. Select **Your profile** from the menu
3. From there, click **Projects** and select your BigQuery project
5. Go to **development Connection** and select BigQuery
6. Click **Edit** and then scroll down to **Optional settings**

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

### Account level connections and credential management

You can re-use connections across multiple projects with [global connections](/docs/cloud/connect-data-platform/about-connections#migration-from-project-level-connections-to-account-level-connections). Connections are attached at the environment level (formerly project level), so you can utilize multiple connections inside of a single project (to handle dev, staging, production, etc.).

BigQuery connections in <Constant name="cloud" /> currently expect the credentials to be handled at the connection level (and only BigQuery connections). This was originally designed to facilitate creating a new connection by uploading a service account keyfile. This describes how to override credentials at the environment level, via [extended attributes](/docs/dbt-cloud-environments#extended-attributes), _to allow project administrators to manage credentials independently_ of the account level connection details used for that environment.

For a project, you will first create an environment variable to store the secret `private_key` value. Then, you will use extended attributes to override the entire service account JSON (you can't only override the secret key due to a constraint of extended attributes).

1. **New environment variable**

    - Create a new _secret_ [environment variable](https://docs.getdbt.com/docs/build/environment-variables#handling-secrets) to handle the private key: `DBT_ENV_SECRET_PROJECTXXX_PRIVATE_KEY`
    - Fill in the private key value according the environment

    To automate your deployment, use the following [admin API request](https://docs.getdbt.com/dbt-cloud/api-v3#/operations/Create%20Projects%20Environment%20Variables%20Bulk), with `XXXXX` your account number, `YYYYY` your project number, `ZZZZZ` your [API token](/docs/dbt-cloud-apis/authentication):

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

    In the environment details, complete the [extended attributes](/docs/dbt-cloud-environments#extended-attributes) block with the following payload (replacing `XXX` with your corresponding information):

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

    If you require [other fields](/docs/core/connect-data-platform/bigquery-setup#service-account-json) to be overridden at the environment level via extended attributes, please respect the [expected indentation](/docs/dbt-cloud-environments#only-the-top-level-keys-are-accepted-in-extended-attributes) (ordering doesn't matter):

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

    To automate your deployment, you first need to [create the extended attributes payload](https://docs.getdbt.com/dbt-cloud/api-v3#/operations/Create%20Extended%20Attributes) for a given project, and then [assign it](https://docs.getdbt.com/dbt-cloud/api-v3#/operations/Update%20Environment) to a specific environment. With `XXXXX` as your account number, `YYYYY` as your project number, and `ZZZZZ` as your [API token](/docs/dbt-cloud-apis/authentication):

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
    _Make a note of the `id` returned in the message._ It will be used in the following call. With `EEEEE` the environment id, `FFFFF` the extended attributes id: 

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
    


  
