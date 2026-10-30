---
title: "Connect Microsoft Fabric Data Warehouse to dbt v1"
sidebar_label: "Microsoft Fabric Data Warehouse"
description: "Read this guide to learn about the Microsoft Fabric Data Warehouse setup in dbt."
id: fabric-setup
meta:
  maintained_by: Microsoft
  authors: 'Microsoft'
  github_repo: 'Microsoft/dbt-fabric'
  pypi_package: 'dbt-fabric'
  min_core_version: '1.11.0'
  cloud_support: Supported
  platform_name: 'Microsoft Fabric'
  config_page: '/reference/resource-configs/fabric-configs'
availability: local_free
---

<Snippet path="warehouse-setups-cloud-callout" />

Below is a guide for use with [Fabric Data Warehouse](https://learn.microsoft.com/en-us/fabric/data-warehouse/data-warehousing#synapse-data-warehouse), a product within Microsoft Fabric. The adapter currently supports connecting to a warehouse.

To learn how to set up dbt using Fabric Lakehouse, refer to [Microsoft Fabric Lakehouse](/docs/local/connect-data-platform/fabricspark-setup).

To learn how to set up dbt for Azure Synapse Analytics dedicated SQL pools, refer to [Microsoft Azure Synapse Analytics setup](/docs/local/connect-data-platform/azuresynapse-setup).

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

### Installation

`dbt-fabric` connects to Fabric using [`mssql-python`](https://github.com/microsoft/mssql-python), Microsoft's native Python driver for SQL Server/Fabric. The driver ships as part of the `mssql-python` package dependency, so **no separate ODBC Driver install is required** — you don't need to install "ODBC Driver 17/18 for SQL Server" or any `unixodbc`/`msodbcsql` system packages to use this adapter.

```shell
pip install -U dbt-fabric
```

#### Supported configurations

* The adapter is tested against Microsoft Fabric Data Warehouse (also referred to as warehouses).
* The adapter does not require or use the `driver` or `port` profile fields found in other SQL Server-family adapters (such as `dbt-sqlserver`/`dbt-synapse`) — these were removed when the adapter moved off ODBC/`pyodbc` to `mssql-python`. If your `profiles.yml` was written for an older version of this adapter, you can safely remove `driver` and `port`.

The adapter support is not limited to the above. If you notice an issue with any other configuration, let us know by opening an issue on [GitHub](https://github.com/microsoft/dbt-fabric).

##### Unsupported configurations
SQL analytics endpoints are read-only and so are not appropriate for transformation workloads; use a Warehouse instead.

## Authentication methods & profile configuration

:::info Supported authentication methods

Microsoft Fabric Data Warehouse requires Microsoft Entra ID (formerly Azure AD) authentication; SQL/basic (username+password, non-Entra) authentication is not supported.

To better understand the authentication mechanisms available in dbt Cloud specifically, read our [Connect Microsoft Fabric](/docs/platform/connect-data-platform/connect-microsoft-fabric) page.

:::

### Common configuration

For all authentication methods, refer to the following configuration options that can be set in your `profiles.yml` file.
A complete reference of all options can be found [at the end of this page](#reference-of-all-connection-options).

| Configuration option | Description | Type | Example |
| --------------------- | ---- | ---- | ------- |
| `server` | The server hostname. Can be omitted if `workspace_id`/`workspace_name` is set instead (the adapter resolves the SQL endpoint via the Fabric REST API). | Required (or `workspace_id`/`workspace_name`) | `your-warehouse.datawarehouse.fabric.microsoft.com` |
| `database` | The database (warehouse) name. | Required | Not applicable |
| `schema` | The schema name. | Required | `dbo` |
| `authentication` | The authentication method to use. See [below](#microsoft-entra-id-authentication). | Optional | `CLI` |
| `retries` | The number of times to automatically retry a query before failing. Defaults to `3`. This also sets `ConnectRetryCount` on the underlying connection. | Optional | Not applicable |
| `login_timeout` | The number of seconds used to establish a connection before failing. Defaults to `0` (disabled/system default). | Optional | Not applicable |
| `query_timeout` | The number of seconds to wait for a query before failing. Defaults to `86400` (24 hours). | Optional | Not applicable |
| `lock_timeout` | Milliseconds a statement waits on a schema lock before failing with "Lock request time out period exceeded", issued via `SET LOCK_TIMEOUT`. Defaults to `30000` (30s). Set to `0` to disable and wait indefinitely (SQL Server default). | Optional | Not applicable |
| `schema_authorization` | Optionally set this to the principal who should own the schemas created by dbt. [Read more](#schema-authorization). | Optional | Not applicable |
| `encrypt` | Whether to encrypt the connection to the server. Defaults to `true`. | Optional | Not applicable |
| `trust_cert` | Whether to trust the server certificate. Defaults to `false`. | Optional | Not applicable |
| `workspace_id` / `workspace_name` | Resolve the warehouse's SQL connection string automatically via the Fabric REST API instead of specifying `server` directly. Required for [warehouse snapshots](/reference/resource-configs/fabric-configs#warehouse-snapshots). | Optional | Not applicable |

### Connection encryption

* The default value of `encrypt` is `true`, meaning connections are encrypted by default.
* The default value of `trust_cert` is `false`, meaning the server certificate is validated. Set this to `true` to accept a self-signed certificate.

### Standard SQL Server authentication

SQL Server and Windows authentication are not supported by Microsoft Fabric Data Warehouse.

### Microsoft Entra ID authentication

Microsoft Entra ID authentication is the only authentication mechanism supported by Microsoft Fabric Data Warehouse.

The following authentication methods are available:

* Azure CLI authentication
* Service principal
* Microsoft Entra ID username and password
* Interactive (browser-based, with MFA support)
* Device code flow
* Managed Identity
* Workload Identity (federated/OIDC token, for example from GitHub Actions or Kubernetes)
* A custom `azure-identity` `TokenCredential` class
* A pre-fetched access token
* Environment-based authentication
* Automatic (`ActiveDirectoryDefault` / `auto`)
* Fabric notebook authentication (via `notebookutils`, for running dbt inside a Fabric notebook)

<Tabs
  defaultValue="azure_cli"
  values={[
    {label: 'Azure CLI', value: 'azure_cli'},
    {label: 'Service principal', value: 'service_principal'},
    {label: 'Entra ID username & password', value: 'meid_password'},
    {label: 'Interactive', value: 'meid_interactive'},
    {label: 'Managed Identity', value: 'managed_identity'},
    {label: 'Workload Identity', value: 'workload_identity'},
    {label: 'Custom token credential', value: 'token_credential'},
    {label: 'Pre-fetched access token', value: 'access_token'},
    {label: 'Environment-based', value: 'environment_based'},
    {label: 'Automatic', value: 'auto'},
    {label: 'Fabric notebook', value: 'fabric_notebook'},
  ]}
>

<TabItem value="azure_cli">

First, install the [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli), then log in:

```shell
az login
```

<File name='profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: fabric
      server: your-warehouse.datawarehouse.fabric.microsoft.com
      database: exampledb
      schema: schema_name
      authentication: CLI
```

</File>

</TabItem>

<TabItem value="service_principal">

Client ID is often also referred to as Application ID. `authentication: ServicePrincipal` is accepted as a legacy alias of the canonical `ActiveDirectoryServicePrincipal`.

<File name='profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: fabric
      server: your-warehouse.datawarehouse.fabric.microsoft.com
      database: exampledb
      schema: schema_name
      authentication: ActiveDirectoryServicePrincipal
      tenant_id: 00000000-0000-0000-0000-000000001234
      client_id: 00000000-0000-0000-0000-000000001234
      client_secret: "{{ env_var('AZURE_CLIENT_SECRET') }}"
```

</File>

</TabItem>

<TabItem value="meid_password">

<File name='profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: fabric
      server: your-warehouse.datawarehouse.fabric.microsoft.com
      database: exampledb
      schema: schema_name
      authentication: ActiveDirectoryPassword
      user: bill.gates@microsoft.com
      password: "{{ env_var('FABRIC_PASSWORD') }}"
```

</File>

:::note

`ActiveDirectoryPassword` (and `ActiveDirectoryIntegrated`, on Windows) authenticate the SQL connection natively through the driver. Because of this, they can't currently be combined with `workspace_id`/`workspace_name`-based host resolution or other Fabric REST API-dependent features (for example, warehouse snapshots or Purview sync) — set `server` explicitly when using these methods.

:::

</TabItem>

<TabItem value="meid_interactive">

This setting can show Multi-Factor Authentication prompts in a browser.

<File name='profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: fabric
      server: your-warehouse.datawarehouse.fabric.microsoft.com
      database: exampledb
      schema: schema_name
      authentication: ActiveDirectoryInteractive
      user: bill.gates@microsoft.com
```

</File>

</TabItem>

<TabItem value="managed_identity">

<File name='profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: fabric
      server: your-warehouse.datawarehouse.fabric.microsoft.com
      database: exampledb
      schema: schema_name
      authentication: ActiveDirectoryMsi
```

</File>

</TabItem>

<TabItem value="workload_identity">

For federated/OIDC credentials, such as GitHub Actions OIDC or Kubernetes workload identity. Provide the federated token either via a URL (for example, GitHub Actions' token-request endpoint) or a file path (for example, the projected service account token on Kubernetes) — exactly one of `federated_token_url` or `federated_token_file` must be set.

<File name='profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: fabric
      server: your-warehouse.datawarehouse.fabric.microsoft.com
      database: exampledb
      schema: schema_name
      authentication: workload_identity
      tenant_id: 00000000-0000-0000-0000-000000001234
      client_id: 00000000-0000-0000-0000-000000001234
      federated_token_url: "{{ env_var('ACTIONS_ID_TOKEN_REQUEST_URL') }}"
      federated_token_header: "Bearer {{ env_var('ACTIONS_ID_TOKEN_REQUEST_TOKEN') }}"
      # or, instead of federated_token_url/federated_token_header:
      # federated_token_file: /var/run/secrets/tokens/azure-identity-token
```

</File>

</TabItem>

<TabItem value="token_credential">

Supply your own [`azure-identity` `TokenCredential`](https://learn.microsoft.com/en-us/python/api/azure-core/azure.core.credentials.tokencredential) implementation as a dotted import path, with optional constructor kwargs. Useful for custom credential chains not covered by the built-in methods.

<File name='profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: fabric
      server: your-warehouse.datawarehouse.fabric.microsoft.com
      database: exampledb
      schema: schema_name
      authentication: token_credential
      credential_class: my_pkg.auth.MyCustomCredential
      credential_kwargs:
        some_option: some_value
```

</File>

</TabItem>

<TabItem value="access_token">

Supply a pre-fetched Microsoft Entra ID access token directly, instead of having the adapter acquire one. Useful when a token is already managed by surrounding infrastructure (for example, a CI pipeline step).

<File name='profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: fabric
      server: your-warehouse.datawarehouse.fabric.microsoft.com
      database: exampledb
      schema: schema_name
      authentication: ActiveDirectoryAccessToken
      access_token: "{{ env_var('FABRIC_ACCESS_TOKEN') }}"
```

</File>

</TabItem>

<TabItem value="environment_based">

This authentication option dynamically selects an authentication method depending on the available environment variables.

[The Microsoft docs on EnvironmentCredential](https://docs.microsoft.com/en-us/python/api/azure-identity/azure.identity.environmentcredential?view=azure-python)
explain the available combinations of environment variables you can use.

<File name='profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: fabric
      server: your-warehouse.datawarehouse.fabric.microsoft.com
      database: exampledb
      schema: schema_name
      authentication: environment
```

</File>

</TabItem>

<TabItem value="auto">

This authentication option (`auto`, equivalent to the canonical `ActiveDirectoryDefault`) uses [`DefaultAzureCredential`](https://learn.microsoft.com/en-us/python/api/azure-identity/azure.identity.defaultazurecredential), which tries a sequence of credential sources (environment variables, Managed Identity, Azure CLI, Azure PowerShell, and others) until one succeeds. This is usually the easiest choice for local development.

<File name='profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: fabric
      server: your-warehouse.datawarehouse.fabric.microsoft.com
      database: exampledb
      schema: schema_name
      authentication: auto
```

</File>

</TabItem>

<TabItem value="fabric_notebook">

Use this when running dbt from inside a Fabric notebook, to authenticate via the notebook's own identity using [`notebookutils`](https://learn.microsoft.com/en-us/fabric/data-engineering/notebook-utilities). `authentication: fabricnotebook` is accepted as a legacy alias of the canonical `notebookutils`.

<File name='profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: fabric
      server: your-warehouse.datawarehouse.fabric.microsoft.com
      database: exampledb
      schema: schema_name
      authentication: notebookutils
```

</File>

</TabItem>

</Tabs>

### Automatic Microsoft Entra ID principal provisioning for grants

Automatic Microsoft Entra ID principal provisioning is not supported by Microsoft Fabric Data Warehouse at this time. Even though dbt's [grants](/reference/resource-configs/grants) config block can be used to automatically grant/revoke permissions on your models to users or groups, the data warehouse does not support this feature.

You need to add the service principal or Microsoft Entra identity to a Fabric Workspace as an admin.

### Schema authorization

You can optionally set the principal who should own all schemas created by dbt. This is then used in the `CREATE SCHEMA` statement like so:

```sql
CREATE SCHEMA [schema_name] AUTHORIZATION [schema_authorization]
```

A common use case is to use this when you are authenticating with a principal who has permissions based on a group, such as a Microsoft Entra ID group. When that principal creates a schema, the server will first try to create an individual login for this principal and then link the schema to that principal. If you are using Microsoft Entra ID in this case, this would fail since Fabric can't automatically create logins for individuals part of an Entra ID group.

## Performance guidance for large projects

Fabric Warehouse DDL operations (for example, `CREATE TABLE`, `sp_rename`) hold catalog locks that can block `sys.tables`/`sys.views` reads from concurrent dbt sessions. With many models and high thread counts, this can cause schema-listing steps to stall for minutes.

Recommended for projects with 500+ models or concurrent dbt runs:

<File name='profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: fabric
      # ... connection settings ...
      threads: 4          # keep low (4-8) to reduce catalog lock pressure
      query_timeout: 30   # fail fast on blocked catalog reads (seconds)
```

</File>

In your `dbt_project.yml`:

```yaml
flags:
  cache_selected_only: true  # only list schemas for models in the current run
```

Or pass `--no-populate-cache` on the CLI for a single run. This prevents dbt from listing every schema in the warehouse upfront, significantly reducing catalog read pressure during concurrent runs.

### Reference of all connection options

| Configuration option    | Description                                                                                                                                                 | Required           | Default value |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------ | -------------- |
| `server` (alias `host`) | The hostname of the warehouse's SQL endpoint. Not required if `workspace_id`/`workspace_name` is set. |                    |               |
| `database`              | The name of the database (warehouse) to connect to.                                                                                                        | :white_check_mark: |               |
| `schema`                | The schema to use.                                                                                                                                          | :white_check_mark: |               |
| `authentication`        | The authentication method to use. See [above](#microsoft-entra-id-authentication).                                                                         |                    | `ActiveDirectoryDefault` |
| `user` (alias `UID`)    | Username used to authenticate. Required for `ActiveDirectoryPassword`.                                                                                     |                    |               |
| `password` (alias `PWD`) | Password used to authenticate. Required for `ActiveDirectoryPassword`.                                                                                   |                    |               |
| `tenant_id`             | The tenant ID of the Microsoft Entra ID instance. Required for `ActiveDirectoryServicePrincipal` and `workload_identity`.                                  |                    |               |
| `client_id`             | The client ID of the Microsoft Entra service principal. Required for `ActiveDirectoryServicePrincipal` and `workload_identity`.                            |                    |               |
| `client_secret`         | The client secret of the Microsoft Entra service principal. Required for `ActiveDirectoryServicePrincipal`.                                                 |                    |               |
| `access_token`          | A pre-fetched Microsoft Entra ID access token. Used with `authentication: ActiveDirectoryAccessToken`.                                                     |                    |               |
| `token_scope`           | Overrides the default OAuth scope requested when acquiring a token.                                                                                        |                    | Fabric API scope |
| `credential_class`      | Dotted import path to a custom `azure-identity`-compatible `TokenCredential` class. Used with `authentication: token_credential`.                          |                    |               |
| `credential_kwargs`     | Keyword arguments passed to `credential_class` when instantiated.                                                                                           |                    | `{}`          |
| `federated_token_url` / `federated_token_file` | Source of the federated/OIDC token for `authentication: workload_identity`. Exactly one must be set.                               |                    |               |
| `federated_token_header` | Optional `Authorization` header value to send when fetching the token from `federated_token_url`.                                                        |                    |               |
| `encrypt`               | Set this to `false` to disable the use of encryption. See [above](#connection-encryption).                                                                 |                    | `true`        |
| `trust_cert`            | Set this to `true` to trust the server certificate. See [above](#connection-encryption).                                                                   |                    | `false`       |
| `retries`               | The number of times to retry a failed connection or query.                                                                                                 |                    | `3`           |
| `login_timeout`         | Seconds to wait for a connection to be established. `0` disables the timeout.                                                                              |                    | `0`           |
| `query_timeout`         | Seconds to wait for a query to complete. `0` disables the timeout.                                                                                         |                    | `86400`       |
| `lock_timeout`          | Milliseconds a statement waits on a schema lock before failing. `0` disables the timeout (wait indefinitely).                                              |                    | `30000`       |
| `schema_authorization`  | Optionally set this to the principal who should own the schemas created by dbt. [Details above](#schema-authorization).                                   |                    |               |
| `workspace_id` / `workspace_name` | Resolve the warehouse connection string via the Fabric REST API instead of `server`. Required for [warehouse snapshots](/reference/resource-configs/fabric-configs#warehouse-snapshots). |                    |               |

Valid values for `authentication` (case-insensitive):

* `ActiveDirectoryDefault` (alias `auto`): tries a chain of credential sources via `DefaultAzureCredential`
* `ActiveDirectoryServicePrincipal` (alias `ServicePrincipal`): Microsoft Entra ID authentication using a service principal
* `ActiveDirectoryPassword`: Microsoft Entra ID authentication using username and password
* `ActiveDirectoryInteractive`: Microsoft Entra ID authentication using a username and MFA prompts
* `ActiveDirectoryIntegrated`: Microsoft Entra ID authentication using the current user's credentials (Windows only)
* `ActiveDirectoryMsi`: Managed Identity authentication
* `ActiveDirectoryDeviceCodeFlow`: Device code authentication flow
* `ActiveDirectoryAccessToken`: use a pre-fetched access token supplied via `access_token`
* `CLI`: Microsoft Entra ID authentication using the account you're logged in with in the Azure CLI
* `environment`: Microsoft Entra ID authentication using environment variables, as documented [here](https://learn.microsoft.com/en-us/python/api/azure-identity/azure.identity.environmentcredential?view=azure-python)
* `workload_identity`: federated/OIDC credential (for example, GitHub Actions or Kubernetes workload identity)
* `token_credential`: a custom `azure-identity`-compatible `TokenCredential` class, supplied via `credential_class`
* `notebookutils` (alias `fabricnotebook`): authenticate using the identity of the Fabric notebook dbt is running in
