---
id: microsoft-sql-server
title: "Microsoft SQL Server"
description: ""
---
[block:callout]
{
  "type": "info",
  "title": "Community contributed plugin",
  "body": "This is a Community Contributed plugin for dbt. If you're interested in contributing, check out the source code [on GitHub](https://github.com/jacobm001/dbt-mssql)."
}
[/block]
# Overview of dbt-sqlserver
**Status:** Community Contributed
**Author:** Mikael Ene
**Source Code:** https://github.com/mikaelene/dbt-sqlserver

**dbt-sqlserver** is a custom adapter for Microsoft SQL Server (with emphasis on 2016 and later). Based on `pymssql`.  Passing all tests in dbt-integration-tests. Only supports `dbt` 0.14 and newer.

## Connecting to SQL Server with **dbt-sqlserver**

### User / password authentication

A SQL Server connection can be configured using basic user/password authentication as shown below.  If using Windows Authentication then use `[company-domain\username]` as the value for the `user` key instead of just `[username]`.
[block:code]
{
  "codes": [
    {
      "code": "dbt-sqlserver:\n  target: dev\n  outputs:\n    dev:\n      type: sqlserver\n      threads: 1\n      server: [host] # like sqlserver.mydomain.com \n      port: 1433\n      user: [username]\n      password: [password]\n      database: [database]\n      schema: [schema]",
      "language": "yaml"
    }
  ]
}
[/block]

[block:html]
{
  "html": "<hr />"
}
[/block]
# Overview of dbt-mssql
**Status:** Community Contributed
**Author:** Jacob M. Mastel
**Source Code:** https://github.com/jacobm001/dbt-mssql

**dbt-mssql** is a custom adapter for dbt that adds support for Microsoft SQL Server versions 2008 R2 and later. `pyodbc` is used as the connection driver as that is what is [suggested by Microsoft](https://docs.microsoft.com/en-us/sql/connect/python/python-driver-for-sql-server). The adapter supports both windows auth, and specified user accounts.

dbt-mssql is currently in a beta release. It is passing all of the [dbt integration tests](https://github.com/fishtown-analytics/dbt-integration-tests/) on SQL Server 2008 R2. Considering Microsoft's legendary backwards compatibility, it should work on newer versions, but that testing will come in the near future.

## Connecting to SQL Server with **dbt-mssql**

### User / password authentication

A SQL Server connection can be configured using basic user/password authentication as shown below.
[block:code]
{
  "codes": [
    {
      "code": "my-mssql-db:\n  target: dev\n  outputs:\n    dev:\n      type: mssql\n      driver: 'ODBC Driver 17 for SQL Server'\n      host: [host] # like sqlserver.mydomain.com\n      database: [database]\n      schema: [schema]\n      username: [username]\n      password: [password]",
      "language": "yaml",
      "name": "profiles.yml"
    }
  ]
}
[/block]
### Windows login authentication
[block:code]
{
  "codes": [
    {
      "code": "my-mssql-db:\n  target: dev\n  outputs:\n    dev:\n      type: mssql\n      driver: 'ODBC Driver 17 for SQL Server'\n      host: [host] # like sqlserver.mydomain.com\n      database: [database]\n      schema: [schema]\n      windows_login: True",
      "language": "yaml",
      "name": "profiles.yml"
    }
  ]
}
[/block]
