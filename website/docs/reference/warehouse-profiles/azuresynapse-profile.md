---
title: "Microsoft Azure Synapse DW Profile"
---


:::info Community plugin

Some core functionality may be limited. If you're interested in contributing, check out the source code for each repository listed below.

:::

## Overview of dbt-synapse

**Maintained by:** Community
**Author:** Nandan Hegde and Anders Swanson         
**Source:** [Github](https://github.com/dbt-msft/dbt-synapse)
**Core version:** v0.18.0 and newer  
**dbt Slack channel** [Link to channel](https://getdbt.slack.com/archives/C01DRQ178LQ)    

![dbt-synapse stars](https://img.shields.io/github/stars/dbt-msft/dbt-synapse?style=for-the-badge)

The package can be installed from PyPI with:

```python
pip install dbt-synapse
```
For further (and more likely up-to-date) info, see the [README](https://github.com/swanderz/dbt-synapse/blob/master/README.md)

### Connecting to Azure Synapse with **`dbt-synapse`**

First download and install the [MSFT ODBC Driver 17 for SQL Server](https://docs.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server?view=sql-server-ver15)

#### standard SQL Server authentication
SQL Server credentials are supported for on-prem as well as cloud, and it is the default authentication method for `dbt-sqlsever`

<File name='profiles.yml'>

```yml
type: synapse
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
type: synapse
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
type: synapse
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
type: synapse
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
type: synapse
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
type: synapse
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
