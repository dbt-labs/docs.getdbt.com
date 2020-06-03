---
title: "Oracle SQL Database"
id: "profile-oracle"
---


<Callout type="info" title="Community contributed plugin">

This is a Community Contributed plugin for dbt. If you're interested in contributing, check out the source code for each repository [dbt-sqlserver](https://github.com/mikaelene/dbt-sqlserver), [dbt-mssql](https://github.com/jacobm001/dbt-mssql).

</Callout>

## Overview of dbt-oracle
**Status:** Community Contributed
**Author:** Vitor Avancini
**Source Code:** https://github.com/techinidicium/dbt-oracle


Easiest install is to use pip:

    pip install dbt-oracle

You will need Oracle client driver installed. Check this [link](https://cx-oracle.readthedocs.io/en/latest/user_guide/installation.html) for the installation guide for your operating system

### Connecting to Oracle with **dbt-oracle** 

#### User / password authentication

Configure your dbt profile for using Oracle Authentication:

##### Oracle Authentication
```yaml
dbt_oracle:
   target: dev
   outputs:
      dev:
         type: oracle
         host: localhost
         user: system
         pass: oracle
         port: 1521
         dbname: [dbname]
         schema: [schema]
         threads: 4
```
