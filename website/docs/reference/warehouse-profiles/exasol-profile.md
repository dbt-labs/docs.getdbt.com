---
title: "Exasol Profile"
---


:::info Community contributed plugin

This is a Community Contributed plugin for dbt. If you're interested in contributing, check out the source code at [dbt-exasol](https://github.com/tglunde/dbt-exasol).
For more information on Exasol Analytics database visit [exasol home](https://www.exasol.com).
:::

## Overview of dbt-exasol
**Status:** Community Contributed
**Author:** Torsten Glunde, Ilija Kutle
**Source Code:** https://github.com/tglunde/dbt-exasol

**dbt-exasol**
Only supports dbt 0.14 and newer!

Easiest install is to use pip:

    pip install dbt-exasol

### Connecting to Exasol with **dbt-exasol**

#### User / password authentication

Configure your dbt profile for using SQL Server authentication or Integrated Security:

##### Exasol connection information
```yaml
dbt-exasol:
  target: dev
  outputs:
    dev:
      type: exasol
      threads: 1
      dsn: IP:PORT
      user: USERNAME
      pass: PASSWORD
      dbname: db
      schema: SCHEMA
```

------------------------------------------------------------

</File>
