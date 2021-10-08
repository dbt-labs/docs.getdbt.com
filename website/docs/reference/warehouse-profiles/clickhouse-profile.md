---
title: "ClickHouse Profile"
---

:::info Community plugin

Some core functionality may be limited. If you're interested in contributing, check out the source code for each repository listed below.

:::

## Overview of dbt-clickhouse
**Maintained by:** Community      
**Author:** Dmitriy Sokolov    
**Source:** https://github.com/silentsokolov/dbt-clickhouse    
**Core version:** v0.19.0 and newer
**dbt Cloud:** Not Supported    

![dbt-clickhouse stars](https://img.shields.io/github/stars/silentsokolov/dbt-clickhouse?style=for-the-badge)

The easiest way to install it is to use pip:

    pip install dbt-clickhouse

## Connecting to ClickHouse with **dbt-clickhouse**

#### User / password authentication

Configure your dbt profile for using ClickHouse:

##### ClickHouse connection information
<File name='profiles.yml'>

```yaml
dbt-clickhouse:
  target: dev
  outputs:
    dev:
      type: clickhouse
      schema: [database name]
      host: [db.clickhouse.com]
      port: 9000
      user: [user]
      password: [abc123]
```

</File>
