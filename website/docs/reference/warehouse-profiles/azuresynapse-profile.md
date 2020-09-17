---
title: "Microsoft Azure Synapse DW Profile"
---


:::info Community contributed plugin

This is a Community Contributed plugin for dbt. If you're interested in contributing, check out the source code for the repository [dbt-azuresynapse](https://github.com/embold-health/dbt-azuresynapse)

:::

## Overview of dbt-sqlserver
**Status:** Community Contributed
**Author:** Ernesto Barajas and Matt Berns
**Source Code:** https://github.com/embold-health/dbt-azuresynapse

**dbt-sqlserver**
Only supports dbt 0.17 and newer!

Easiest install is to use pip:

    pip install dbt-azuresynapse

On Ubuntu make sure you have the ODBC header files as well as the appropriate ODBC adapter before installing

    sudo apt install unixodbc-dev
    sudo apt-get install msodbcsql17
    sudo apt-get install mssql-tools

### Connecting to SQL Server with **dbt-azuresynapse**

#### User / password authentication

Configure your dbt profile for using SQL Server authentication or Integrated Security:

##### SQL Server authentication
```yaml
dbt-azuresynapse:
  target: dev
  outputs:
    dev:
      type: sqlserver
      driver: 'ODBC Driver 17 for SQL Server' (The ODBC Driver installed on your system)
      server: server-host-name or ip
      port: 1433
      user: [username]
      password: [password]
      database: [databasename]
      authentication: SqlPassword
      schema: [schema]
```



------------------------------------------------------------

## Overview of dbt-azuresynapse

**Status:** Community Contributed
**Author:** Ernesto Barajas and Matt Berns
**Source Code:** https://github.com/embold-health/dbt-azuresynapse

**dbt-azuresynapse** is a custom adapter for dbt that adds support for Azure Synapse 10 and later. `pyodbc` is used as the connection driver as that is what is [suggested by Microsoft](https://docs.microsoft.com/en-us/sql/connect/python/python-driver-for-sql-server). 

dbt-azuresynapse is currently in a beta release. It is passing all of the [dbt integration tests](https://github.com/fishtown-analytics/dbt-integration-tests/) on Azure Synapse DW 10.

### Connecting to SQL Server with **dbt-azuresynapse**

#### User / password authentication

A connection can be configured using basic user/password authentication as shown below.

<File name='profiles.yml'>

```yaml
dbt-azuresynapse:
  target: dev
  outputs:
    dev:
      type: sqlserver
      driver: 'ODBC Driver 17 for SQL Server' (The ODBC Driver installed on your system)
      server: server-host-name or ip
      port: 1433
      user: [username]
      password: [password]
      database: [databasename]
      authentication: SqlPassword
      schema: [schema]
```

</File>
