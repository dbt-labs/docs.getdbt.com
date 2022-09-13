---
title: "Microsoft SQL Server Profile"
---

:::info Community plugin

Some core functionality may be limited. If you're interested in contributing, check out the source code for each repository listed below.

:::

## Overview of dbt-sqlserver

**Maintained by:** Community    
**Author:** [dbt-msft community](https://github.com/dbt-msft)   
**Source:** [GitHub](https://github.com/dbt-msft/dbt-sqlserver)    
**Core version:** v0.14.0 and newer     
**dbt Cloud:** Not Supported     
**dbt Slack channel:** [Link to channel](https://getdbt.slack.com/archives/CMRMDDQ9W)

![dbt-sqlserver stars](https://img.shields.io/github/stars/dbt-msft/dbt-sqlserver?style=for-the-badge)
![latest version on PyPI](https://img.shields.io/pypi/v/dbt-sqlserver?style=for-the-badge)

The package can be installed from PyPI with:

```python
pip install dbt-sqlserver
```

### Prerequisites

On Ubuntu make sure you have the ODBC header files before installing

    sudo apt install unixodbc-dev

Download and install the [Microsoft ODBC Driver 17 for SQL Server](https://docs.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server?view=sql-server-ver15)

### Authentication methods

#### Standard SQL Server authentication

SQL Server credentials are supported for on-prem as well as Azure,
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
      driver: 'ODBC Driver 17 for SQL Server' # (The ODBC Driver installed on your system)
      server: hostname or IP of your server
      port: 1433
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
      driver: 'ODBC Driver 17 for SQL Server' # (The ODBC Driver installed on your system)
      server: hostname or IP of your server
      port: 1433
      schema: schema_name
      windows_login: True
```

</File>

</TabItem>

</Tabs>

#### Azure Active Directory Authentication (AAD)

While you can use the SQL username and password authentication as mentioned above,
you might opt to use one of the authentication methods below for Azure SQL.

The following additional methods are available to authenticate to Azure SQL products:

- AAD username and password
- Service principal (a.k.a. AAD Application)
- Managed Identity
- Environment-based authentication
- Azure CLI authentication
- VS Code authentication (available through the automatic option below)
- Azure PowerShell module authentication (available through the automatic option below)
- Automatic authentication

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
      driver: 'ODBC Driver 17 for SQL Server' # (The ODBC Driver installed on your system)
      server: hostname or IP of your server
      port: 1433
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
      driver: 'ODBC Driver 17 for SQL Server' # (The ODBC Driver installed on your system)
      server: hostname or IP of your server
      port: 1433
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
      driver: 'ODBC Driver 17 for SQL Server' # (The ODBC Driver installed on your system)
      server: hostname or IP of your server
      port: 1433
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
      driver: 'ODBC Driver 17 for SQL Server' # (The ODBC Driver installed on your system)
      server: hostname or IP of your server
      port: 1433
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
      driver: 'ODBC Driver 17 for SQL Server' # (The ODBC Driver installed on your system)
      server: hostname or IP of your server
      port: 1433
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
      driver: 'ODBC Driver 17 for SQL Server' # (The ODBC Driver installed on your system)
      server: hostname or IP of your server
      port: 1433
      schema: schema_name
      authentication: auto
```

</File>

</TabItem>

</Tabs>

#### Additional options for AAD on Windows

On Windows systems, the following additional authentication methods are also available for Azure SQL:

- AAD interactive
- AAD integrated
- Visual Studio authentication (available through the automatic option above)

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
      driver: 'ODBC Driver 17 for SQL Server' # (The ODBC Driver installed on your system)
      server: hostname or IP of your server
      port: 1433
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
      driver: 'ODBC Driver 17 for SQL Server' # (The ODBC Driver installed on your system)
      server: hostname or IP of your server
      port: 1433
      schema: schema_name
      authentication: ActiveDirectoryIntegrated
```

</File>

</TabItem>

</Tabs>
