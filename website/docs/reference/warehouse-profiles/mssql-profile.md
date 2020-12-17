---
title: "Microsoft SQL Server Profile"
---

:::info Community plugin

Some core functionality may be limited. If you're interested in contributing, check out the source code for each repository listed below.

:::

## Overview of dbt-sqlserver
**Maintained by:** Community      
**Author:** Mikael Ene    
**Source:** https://github.com/mikaelene/dbt-sqlserver    
**Core version:** v0.14.0 and newer    

![dbt-sqlserver stars](https://img.shields.io/github/stars/mikaelene/dbt-sqlserver?style=for-the-badge)

Easiest install is to use pip:

    pip install dbt-sqlserver

On Ubuntu make sure you have the ODBC header files before installing

    sudo apt install unixodbc-dev

### Connecting to SQL Server with **dbt-sqlserver**

#### User / password authentication

Configure your dbt profile for using SQL Server authentication or Integrated Security:

##### SQL Server authentication
```yaml
dbt-sqlserver:
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
      schema: [schema]
```

##### Integrated Security
```yaml
dbt-sqlserver:
  target: dev
  outputs:
    dev:
      type: sqlserver
      driver: 'ODBC Driver 17 for SQL Server' (The ODBC Driver installed on your system)
      server: server-host-name or ip
      port: 1433
      database: [databasename]
      schema: [schema]
      windows_login: True
```



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
