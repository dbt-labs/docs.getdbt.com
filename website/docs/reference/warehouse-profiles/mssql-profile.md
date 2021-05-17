---
title: "Microsoft SQL Server Profile"
---

:::info Community plugin

Some core functionality may be limited. If you're interested in contributing, check out the source code for each repository listed below.

:::

## Overview of dbt-sqlserver
**Maintained by:** Community      
**Author:** Mikael Ene    
**Source:** https://github.com/dbt-msft/dbt-sqlserver    
**Core version:** v0.14.0 and newer 

![dbt-sqlserver stars](https://img.shields.io/github/stars/mikaelene/dbt-sqlserver?style=for-the-badge)

The package can be installed from PyPI with:

```python
pip install dbt-sqlserver
```
On Ubuntu make sure you have the ODBC header files before installing

    sudo apt install unixodbc-dev

### Connecting to SQL Server with **dbt-sqlserver**

#### standard SQL Server authentication
SQL Server credentials are supported for on-prem as well as cloud, and it is the default authentication method for `dbt-sqlsever`

<File name='profiles.yml'>

```yml
type: sqlserver
driver: 'ODBC Driver 17 for SQL Server' (The ODBC Driver installed on your system)
server: server-host-name or ip
port: 1433
schema: schemaname
user: username
password: password
```

</File>

#### Active Directory Authentication

The following [`pyodbc`-supported ActiveDirectory methods](https://docs.microsoft.com/en-us/sql/connect/odbc/using-azure-active-directory?view=sql-server-ver15#new-andor-modified-dsn-and-connection-string-keywords) are available to authenticate to Azure SQL products:
- ActiveDirectory Password
- Azure CLI
- ActiveDirectory Interactive (*Windows only*)
- ActiveDirectory Integrated (*Windows only*)
- Service Principal (a.k.a. AAD Application)
- ~~ActiveDirectory MSI~~ (not implemented)

<Tabs
  defaultValue="integrated"
  values={[
    { label: 'Password', value: 'password'},
    { label: 'CLI', value: 'cli'},
    { label: 'Interactive', value:'interactive'},
    { label: 'Integrated', value: 'integrated'},
    { label: 'Service Principal', value: 'serviceprincipal'}
    ]
}>

<TabItem value="password">

Definitely not ideal, but available

<File name='profiles.yml'>

```yml
type: sqlserver
driver: 'ODBC Driver 17 for SQL Server' (The ODBC Driver installed on your system)
server: server-host-name or ip
port: 1433
schema: schemaname
authentication: ActiveDirectoryPassword
user: bill.gates@microsoft.com
password: iheartopensource
```

</File>

</TabItem>

<TabItem value="cli">

First, install the [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli), then, log in:

`az login`

<File name='profiles.yml'>

```yml
type: sqlserver
driver: 'ODBC Driver 17 for SQL Server' (The ODBC Driver installed on your system)
server: server-host-name or ip
port: 1433
schema: schemaname
authentication: CLI
```
This is also the preferred route for using a service principal:

`az login --service-principal --username $CLIENTID --password $SECRET --tenant $TENANTID`

</File>

</TabItem>

<TabItem value="interactive">

*Windows Only* brings up the Azure AD prompt so you can MFA if need be.

<File name='profiles.yml'>

```yml
type: sqlserver
driver: 'ODBC Driver 17 for SQL Server' (The ODBC Driver installed on your system)
server: server-host-name or ip
port: 1433
schema: schemaname
authentication: ActiveDirectoryInteractive
user: bill.gates@microsoft.com
```

</File>

</TabItem>

<TabItem value="integrated">

*Windows Only* uses your machine's credentials (might be disabled by your AAD admins)

<File name='profiles.yml'>

```yml
type: sqlserver
driver: 'ODBC Driver 17 for SQL Server' (The ODBC Driver installed on your system)
server: server-host-name or ip
port: 1433
schema: schemaname
authentication: ActiveDirectoryIntegrated
```

</File>

</TabItem>

<TabItem value="serviceprincipal">

`client_*` and `app_*` can be used interchangeably

<File name='profiles.yml'>

```yml
type: sqlserver
driver: 'ODBC Driver 17 for SQL Server' (The ODBC Driver installed on your system)
server: server-host-name or ip
port: 1433
schema: schemaname
authentication: ServicePrincipal
tenant_id: tenant_id
client_id: clientid
client_secret: clientsecret
```

</File>

</TabItem>

</Tabs>


------------------------------------------------------------

## Overview of dbt-mssql

**Maintained by:** Community      
**Author:** Jacob M. Mastel    
**Source:** https://github.com/jacobm001/dbt-mssql    
**Core version:** v0.14.0     

![dbt-mssql stars](https://img.shields.io/github/stars/jacobm001/dbt-mssql?style=for-the-badge)

**dbt-mssql** is a custom adapter for dbt that adds support for Microsoft SQL Server versions 2008 R2 and later. `pyodbc` is used as the connection driver as that is what is [suggested by Microsoft](https://docs.microsoft.com/en-us/sql/connect/python/python-driver-for-sql-server). The adapter supports both windows auth, and specified user accounts.

dbt-mssql is currently in a beta release. It is passing all of the [dbt integration tests](https://github.com/fishtown-analytics/dbt-integration-tests/) on SQL Server 2008 R2. Considering Microsoft's legendary backwards compatibility, it should work on newer versions, but that testing will come in the near future.

### Connecting to SQL Server with **dbt-mssql**

#### User / password authentication

A SQL Server connection can be configured using basic user/password authentication as shown below.

<File name='profiles.yml'>

```yaml
my-mssql-db:
  target: dev
  outputs:
    dev:
      type: mssql
      driver: 'ODBC Driver 17 for SQL Server'
      host: [host] # like sqlserver.mydomain.com
      database: [database]
      schema: [schema]
      username: [username]
      password: [password]
```

</File>

#### Windows login authentication

<File name='profiles.yml'>

```yaml
my-mssql-db:
  target: dev
  outputs:
    dev:
      type: mssql
      driver: 'ODBC Driver 17 for SQL Server'
      host: [host] # like sqlserver.mydomain.com
      database: [database]
      schema: [schema]
      windows_login: True
```

</File>
