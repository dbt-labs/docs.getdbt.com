---
title: "Starburst & Trino Profile"
---

:::info Vendor-supported plugin

Certain core functionality may vary. If you would like to report a bug, request a feature, or contribute, you can check out the linked repository and open an issue.

:::

## Overview of dbt-trino

**Maintained by:** Starburst Data, Inc.          
**Source:** [Github](https://github.com/starburstdata/dbt-trino)    
**Core version:** v0.20.0 and newer      
**dbt Cloud:** Not Supported      
**dbt Slack channel:** [Slack](https://getdbt.slack.com/archives/CNNPBQ24R)       

![dbt-presto stars](https://img.shields.io/github/stars/starburstdata/dbt-trino?style=for-the-badge)

## Installation and Distribution

dbt's Trino adapter is managed in its own repository, [dbt-trino](https://github.com/starburstdata/dbt-trino). To use the Trino adapter, you must install the `dbt-trino` plugin:

### Using pip
The following command will install the latest version of `dbt-trino` as well as the requisite version of `dbt-core`:

```
pip install dbt-trino
```


## Set up a Trino Target

Trino targets should be set up using the following configuration in your `profiles.yml` file.

<File name='~/.dbt/profiles.yml'>

```yaml
trino:
  target: dev
  outputs:
    dev:
      type: trino
      method: none  # optional, one of {none | ldap | kerberos}
      user: [user]
      password: [password]  # required if method is ldap or kerberos
      database: [database name]
      host: [hostname]
      port: [port number]
      schema: [your dbt schema]
      threads: [1 or more]
      http_scheme: [http or https]
      session_properties:
        query_max_run_time: 5d
        exchange_compression: True
  

```

</File>

## Incremental models

The incremental strategy supported by the adapter is to append new records without updating/overwriting any existing data from the target model.

## Caveats

### Unsupported Functionality

Due to the nature of Trino, not all core dbt functionality is supported. The following features of dbt are not implemented on Trino:

1. [Snapshots](snapshots)

