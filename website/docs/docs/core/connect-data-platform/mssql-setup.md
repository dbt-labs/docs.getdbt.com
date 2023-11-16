---
title: "Microsoft SQL Server setup"
description: "Read this guide to learn about the Microsoft SQL Server warehouse setup in dbt."
id: "mssql-setup"
meta:
  maintained_by: Community
  authors: 'dbt-msft community (https://github.com/dbt-msft)'
  github_repo: 'dbt-msft/dbt-sqlserver'
  pypi_package: 'dbt-sqlserver'
  min_core_version: 'v0.14.0'
  cloud_support: Not Supported
  min_supported_version: 'SQL Server 2016'
  slack_channel_name: '#db-sqlserver'
  slack_channel_link: 'https://getdbt.slack.com/archives/CMRMDDQ9W'
  platform_name: 'SQL Server'
  config_page: '/reference/resource-configs/mssql-configs'
---

:::info Community plugin

Some core functionality may be limited. If you're interested in contributing, check out the source code for each repository listed below.

:::

<h2> Overview of {frontMatter.meta.pypi_package} </h2>

<ul>
    <li><strong>Maintained by</strong>: {frontMatter.meta.maintained_by}</li>
    <li><strong>Authors</strong>: {frontMatter.meta.authors}</li>
    <li><strong>GitHub repo</strong>: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a><a href={`https://github.com/${frontMatter.meta.github_repo}`}><img src={`https://img.shields.io/github/stars/${frontMatter.meta.github_repo}?style=for-the-badge`}/></a></li>
    <li><strong>PyPI package</strong>: <code>{frontMatter.meta.pypi_package}</code> <a href={`https://badge.fury.io/py/${frontMatter.meta.pypi_package}`}><img src={`https://badge.fury.io/py/${frontMatter.meta.pypi_package}.svg`}/></a></li>
    <li><strong>Slack channel</strong>: <a href={frontMatter.meta.slack_channel_link}>{frontMatter.meta.slack_channel_name}</a></li>
    <li><strong>Supported dbt Core version</strong>: {frontMatter.meta.min_core_version} and newer</li>
    <li><strong>dbt Cloud support</strong>: {frontMatter.meta.cloud_support}</li>
    <li><strong>Minimum data platform version</strong>: {frontMatter.meta.min_supported_version}</li>
    </ul>


<h2> Installing {frontMatter.meta.pypi_package} </h2>

pip is the easiest way to install the adapter:

<code>python -m pip install {frontMatter.meta.pypi_package}</code>

<p>Installing <code>{frontMatter.meta.pypi_package}</code> will also install <code>dbt-core</code> and any other dependencies.</p>

<h2> Configuring {frontMatter.meta.pypi_package} </h2>

<p>For {frontMatter.meta.platform_name}-specifc configuration please refer to <a href={frontMatter.meta.config_page}>{frontMatter.meta.platform_name} Configuration</a> </p>

<p>For further info, refer to the GitHub repository: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a></p>


:::tip Default settings change in dbt-sqlserver v1.2 / ODBC Driver 18
Microsoft made several changes related to connection encryption. Read more about the changes [below](#connection-encryption).
:::

### Prerequisites

On Debian/Ubuntu make sure you have the ODBC header files before installing

```bash
sudo apt install unixodbc-dev
```

Download and install the [Microsoft ODBC Driver 18 for SQL Server](https://docs.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server?view=sql-server-ver15).
If you already have ODBC Driver 17 installed, then that one will work as well.

#### Supported configurations

* The adapter is tested with SQL Server 2017, SQL Server 2019, SQL Server 2022 and Azure SQL Database.
* We test all combinations with Microsoft ODBC Driver 17 and Microsoft ODBC Driver 18.
* The collations we run our tests on are `SQL_Latin1_General_CP1_CI_AS` and `SQL_Latin1_General_CP1_CS_AS`.

The adapter support is not limited to the matrix of the above configurations. If you notice an issue with any other configuration, let us know by opening an issue on [GitHub](https://github.com/dbt-msft/dbt-sqlserver).

## Authentication methods & profile configuration

### Common configuration

For all the authentication methods, refer to the following configuration options that can be set in your `profiles.yml` file. 
A complete reference of all options can be found [at the end of this page](#reference-of-all-connection-options).

| Configuration option | Description | Type | Example |
| --------------------- | ---- | ---- | ------- |
| `driver` | The ODBC driver to use | Required | `ODBC Driver 18 for SQL Server` |
| `server` | The server hostname | Required | `localhost` |
| `port` |  The server port | Required | `1433` |
| `database` | The database name | Required | Not applicable |
| `schema` | The schema name | Required | `dbo` |
| `retries` | The number of automatic times to retry a query before failing. Defaults to `1`. Queries with syntax errors will not be retried. This setting can be used to overcome intermittent network issues. | Optional |  Not applicable  |
| `login_timeout` | The number of seconds used to establish a connection before failing. Defaults to `0`, which means that the timeout is disabled or uses the default system settings. | Optional |  Not applicable  |
| `query_timeout` | The number of seconds used to wait for a query before failing. Defaults to `0`, which means that the timeout is disabled or uses the default system settings. | Optional |  Not applicable  |
| `schema_authorization` |  Optionally set this to the principal who should own the schemas created by dbt. [Read more about schema authorization](#schema-authorization). | Optional |  Not applicable  |
| `encrypt` |  Whether to encrypt the connection to the server. Defaults to `true`. Read more about [connection encryption](#connection-encryption). | Optional |  Not applicable  |
| `trust_cert` |   Whether to trust the server certificate. Defaults to `false`. Read more about [connection encryption](#connection-encryption).| Optional |  Not applicable  |

### Connection encryption

Microsoft made several changes in the release of ODBC Driver 18 that affects how connection encryption is configured.
To accommodate these changes, starting in dbt-sqlserver 1.2.0 or newer the default values of `encrypt` and `trust_cert` have changed.
Both of these settings will now **always** be included in the connection string to the server, regardless if you've left them out of your profile configuration or not.

* The default value of `encrypt` is `true`, meaning that connections are encrypted by default.
* The default value of `trust_cert` is `false`, meaning that the server certificate will be validated. By setting this to `true`, a self-signed certificate will be accepted.

More details about how these values affect your connection and how they are used differently in versions of the ODBC driver can be found in the [Microsoft documentation](https://learn.microsoft.com/en-us/sql/connect/odbc/dsn-connection-string-attribute?view=sql-server-ver16#encrypt).

### Standard SQL Server authentication

SQL Server credentials are supported for on-premise servers as well as Azure,
and it is the default authentication method for `dbt-sqlserver`.

When running on Windows, you can also use your Windows credentials to authenticate.

<Tabs
  defaultValue="password"
  values={[
    {label: 'SQL Server credentials', value: 'password'},
    {label: 'Windows credentials', value: 'windows'}
  ]}
>

<TabItem value="password">

<File name='profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: sqlserver
      driver: 'ODBC Driver 18 for SQL Server' # (The ODBC Driver installed on your system)
      server: hostname or IP of your server
      port: 1433
      database: database
      schema: schema_name
      user: username
      password: password
```

</File>

</TabItem>

<TabItem value="windows">

<File name='profiles.yml'>


```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: sqlserver
      driver: 'ODBC Driver 18 for SQL Server' # (The ODBC Driver installed on your system)
      server: hostname or IP of your server
      port: 1433
      database: exampledb
      schema: schema_name
      windows_login: True
```

</File>

</TabItem>

</Tabs>

### Azure Active Directory Authentication (AAD)

While you can use the SQL username and password authentication as mentioned above,
you might opt to use one of the authentication methods below for Azure SQL.

The following additional methods are available to authenticate to Azure SQL products:

* AAD username and password
* Service principal (a.k.a. AAD Application)
* Managed Identity
* Environment-based authentication
* Azure CLI authentication
* VS Code authentication (available through the automatic option below)
* Azure PowerShell module authentication (available through the automatic option below)
* Automatic authentication

The automatic authentication setting is in most cases the easiest choice and works for all of the above.

<Tabs
  defaultValue="azure_cli"
  values={[
    {label: 'AAD username & password', value: 'aad_password'},
    {label: 'Service principal', value: 'service_principal'},
    {label: 'Managed Identity', value: 'managed_identity'},
    {label: 'Environment-based', value: 'environment_based'},
    {label: 'Azure CLI', value: 'azure_cli'},
    {label: 'Automatic', value: 'auto'}
  ]}
>

<TabItem value="aad_password">

<File name='profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: sqlserver
      driver: 'ODBC Driver 18 for SQL Server' # (The ODBC Driver installed on your system)
      server: hostname or IP of your server
      port: 1433
      database: exampledb
      schema: schema_name
      authentication: ActiveDirectoryPassword
      user: bill.gates@microsoft.com
      password: iheartopensource
```

</File>

</TabItem>

<TabItem value="service_principal">

Client ID is often also referred to as Application ID.

<File name='profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: sqlserver
      driver: 'ODBC Driver 18 for SQL Server' # (The ODBC Driver installed on your system)
      server: hostname or IP of your server
      port: 1433
      database: exampledb
      schema: schema_name
      authentication: ServicePrincipal
      tenant_id: 00000000-0000-0000-0000-000000001234
      client_id: 00000000-0000-0000-0000-000000001234
      client_secret: S3cret!
```

</File>

</TabItem>

<TabItem value="managed_identity">

Both system-assigned and user-assigned managed identities will work.

<File name='profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: sqlserver
      driver: 'ODBC Driver 18 for SQL Server' # (The ODBC Driver installed on your system)
      server: hostname or IP of your server
      port: 1433
      database: exampledb
      schema: schema_name
      authentication: MSI
```

</File>

</TabItem>

<TabItem value="environment_based">

This authentication option allows you to dynamically select an authentication method depending on the available environment variables.

[The Microsoft docs on EnvironmentCredential](https://docs.microsoft.com/en-us/python/api/azure-identity/azure.identity.environmentcredential?view=azure-python)
explain the available combinations of environment variables you can use.

<File name='profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: sqlserver
      driver: 'ODBC Driver 18 for SQL Server' # (The ODBC Driver installed on your system)
      server: hostname or IP of your server
      port: 1433
      database: exampledb
      schema: schema_name
      authentication: environment
```

</File>

</TabItem>

<TabItem value="azure_cli">

First, install the [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli), then, log in:

`az login`

<File name='profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: sqlserver
      driver: 'ODBC Driver 18 for SQL Server' # (The ODBC Driver installed on your system)
      server: hostname or IP of your server
      port: 1433
      database: exampledb
      schema: schema_name
      authentication: CLI
```

</File>

</TabItem>

<TabItem value="auto">

This authentication option will automatically try to use all available authentication methods.

The following methods are tried in order:

1. Environment-based authentication
2. Managed Identity authentication
3. Visual Studio authentication (*Windows only, ignored on other operating systems*)
4. Visual Studio Code authentication
5. Azure CLI authentication
6. Azure PowerShell module authentication

<File name='profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: sqlserver
      driver: 'ODBC Driver 18 for SQL Server' # (The ODBC Driver installed on your system)
      server: hostname or IP of your server
      port: 1433
      database: exampledb
      schema: schema_name
      authentication: auto
```

</File>

</TabItem>

</Tabs>

#### Additional options for AAD on Windows

On Windows systems, the following additional authentication methods are also available for Azure SQL:

* AAD interactive
* AAD integrated
* Visual Studio authentication (available through the automatic option above)

<Tabs
  defaultValue="aad_interactive"
  values={[
    {label: 'AAD interactive', value: 'aad_interactive'},
    {label: 'AAD integrated', value: 'aad_integrated'}
  ]}
>

<TabItem value="aad_interactive">

This setting can optionally show Multi-Factor Authentication prompts.

<File name='profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: sqlserver
      driver: 'ODBC Driver 18 for SQL Server' # (The ODBC Driver installed on your system)
      server: hostname or IP of your server
      port: 1433
      database: exampledb
      schema: schema_name
      authentication: ActiveDirectoryInteractive
      user: bill.gates@microsoft.com
```

</File>

</TabItem>

<TabItem value="aad_integrated">

This uses the credentials you're logged in with on the current machine.

<File name='profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: sqlserver
      driver: 'ODBC Driver 18 for SQL Server' # (The ODBC Driver installed on your system)
      server: hostname or IP of your server
      port: 1433
      database: exampledb
      schema: schema_name
      authentication: ActiveDirectoryIntegrated
```

</File>

</TabItem>

</Tabs>

### Automatic AAD principal provisioning for grants

In dbt 1.2 or newer you can use the [grants](https://docs.getdbt.com/reference/resource-configs/grants) config block to automatically grant/revoke permissions on your models to users or groups. This is fully supported in this adapter and comes with an additional feature.

By setting `auto_provision_aad_principals` to `true` in your model configuration, you can automatically provision Azure Active Directory (AAD) principals (users or groups) that don't exist yet.

In Azure SQL, you can sign in using AAD authentication, but to be able to grant an AAD principal certain permissions, it needs to be linked in the database first. ([Microsoft documentation](https://learn.microsoft.com/en-us/azure/azure-sql/database/authentication-aad-configure?view=azuresql))

Note that principals will not be deleted automatically when they are removed from the `grants` block.

### Schema authorization

You can optionally set the principal who should own all schemas created by dbt. This is then used in the `CREATE SCHEMA` statement like so:

```sql
CREATE SCHEMA [schema_name] AUTHORIZATION [schema_authorization]
```

A common use case is to use this when you are authenticating with a principal who has permissions based on a group, such as an AAD group. When that principal creates a schema, the server will first try to create an individual login for this principal and then link the schema to that principal. If you would be using Azure AD in this case,
then this would fail since Azure SQL can't create logins for individuals part of an AD group automatically.

### Reference of all connection options

| Configuration option   | Description                                                                                                                                        | Required           | Default value |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ------------- |
| `driver`               | The ODBC driver to use.                                                                                                                            | :white_check_mark: |               |
| `host`                 | The hostname of the database server.                                                                                                               | :white_check_mark: |               |
| `port`                 | The port of the database server.                                                                                                                   |                    | `1433`        |
| `database`             | The name of the database to connect to.                                                                                                            | :white_check_mark: |               |
| `schema`               | The schema to use.                                                                                                                                 | :white_check_mark: |               |
| `authentication`       | The authentication method to use. This is not required for Windows authentication.                                                                 |                    | `'sql'`       |
| `UID`                  | Username used to authenticate. This can be left out depending on the authentication method.                                                        |                    |               |
| `PWD`                  | Password used to authenticate. This can be left out depending on the authentication method.                                                        |                    |               |
| `windows_login`        | Set this to `true` to use Windows authentication. This is only available for SQL Server.                                                           |                    |               |
| `tenant_id`            | The tenant ID of the Azure Active Directory instance. This is only used when connecting to Azure SQL with a service principal.                     |                    |               |
| `client_id`            | The client ID of the Azure Active Directory service principal. This is only used when connecting to Azure SQL with an AAD service principal.       |                    |               |
| `client_secret`        | The client secret of the Azure Active Directory service principal. This is only used when connecting to Azure SQL with an AAD service principal.   |                    |               |
| `encrypt`              | Set this to `false` to disable the use of encryption. See [above](#connection-encryption).                                                         |                    | `true`        |
| `trust_cert`           | Set this to `true` to trust the server certificate. See [above](#connection-encryption).                                                           |                    | `false`       |
| `retries`              | The number of times to retry a failed connection.                                                                                                  |                    | `1`           |
| `schema_authorization` | Optionally set this to the principal who should own the schemas created by dbt. [Details above](#schema-authorization).                            |                    |               |
| `login_timeout`        | The amount of seconds to wait until a response from the server is received when establishing a connection. `0` means that the timeout is disabled. |                    | `0`           |
| `query_timeout`        | The amount of seconds to wait until a response from the server is received when executing a query. `0` means that the timeout is disabled.         |                    | `0`           |

Valid values for `authentication`:

* `sql`: SQL authentication using username and password
* `ActiveDirectoryPassword`: Active Directory authentication using username and password
* `ActiveDirectoryInteractive`: Active Directory authentication using a username and MFA prompts
* `ActiveDirectoryIntegrated`: Active Directory authentication using the current user's credentials
* `ServicePrincipal`: Azure Active Directory authentication using a service principal
* `CLI`: Azure Active Directory authentication using the account you're logged in with in the Azure CLI
* `MSI`: Azure Active Directory authentication using a managed identity available on the system
* `environment`: Azure Active Directory authentication using environment variables as documented [here](https://learn.microsoft.com/en-us/python/api/azure-identity/azure.identity.environmentcredential?view=azure-python)
* `auto`: Azure Active Directory authentication trying the previous authentication methods until it finds one that works
