---
title: "TiDB Profile"
---

:::info Vendor-supported plugin

Some core functionality may be limited. If you're interested in contributing, check out the source code for each repository listed below.

:::

## Overview of dbt-tidb
**Maintained by:** PingCAP      
**Author:** Xiang Zhang and Qiang Wu
**Source:** https://github.com/pingcap/dbt-tidb   
**Core version:** v1.0.0 and newer   
**dbt Cloud:** Not Supported

The easiest way to install it is to use pip:

```
    pip install dbt-tidb
```

## Connecting to TiDB with **dbt-tidb**

#### User / password authentication

Configure your dbt profile for using TiDB:

##### TiDB connection profile
<File name='profiles.yml'>

```yaml
dbt-tidb:
  target: dev
  outputs:
    dev:
      type: tidb
      server: 127.0.0.1
      port: 4000
      schema: database_name
      username: tidb_username
      password: tidb_password
```

</File>
