---
title: "Exasol Profile"
---

:::info Community plugin

Some core functionality may be limited. If you're interested in contributing, check out the source code for each repository listed below.

:::

## Overview of dbt-exasol
**Maintained by:** Community    
**Author:** Torsten Glunde, Ilija Kutle    
**Source:** https://github.com/tglunde/dbt-exasol    
**Core version:** v0.14.0 and newer    
**dbt Cloud:** Not Supported    
**Supported Version:** Exasol 6.x and later

![dbt-exasol stars](https://img.shields.io/github/stars/tglunde/dbt-exasol?style=for-the-badge)

Easiest install is to use pip:

    pip install dbt-exasol

### Connecting to Exasol with **dbt-exasol**

#### User / password authentication

Configure your dbt profile for using Exasol:

##### Exasol connection information
<File name='profiles.yml'>

```yaml
dbt-exasol:
  target: dev
  outputs:
    dev:
      type: exasol
      threads: 1
      dsn: HOST:PORT
      user: USERNAME
      password: PASSWORD
      dbname: db
      schema: SCHEMA
```

</File>
