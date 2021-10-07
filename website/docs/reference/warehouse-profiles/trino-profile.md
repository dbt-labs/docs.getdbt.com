---
title: "Trino Profile"
---

:::info Community plugin

Some core functionality may be limited. If you're interested in contributing, check out the source code for each repository listed below.

:::

## Overview of dbt-trino

**Maintained by:** Community
**Author:** findinpath       
**Source:** [Github](https://github.com/findinpath/dbt-trino)
**Core version:** v0.20.0 and newer    
**dbt Slack channel** [Link to channel](https://getdbt.slack.com/archives/CNNPBQ24R)   

![dbt-presto stars](https://img.shields.io/github/stars/findinpath/dbt-trino?style=for-the-badge)

## Installation and Distribution

dbt's Trino adapter is managed in its own repository, [dbt-trino](https://github.com/findinpath/dbt-trino). To use the Trino adapter, you must install the `dbt-trino` plugin:

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

```

</File>

## Caveats

### Unsupported Functionality

Due to the nature of Trino, not all core dbt functionality is supported. The following features of dbt are not implemented on Trino:

1. [Snapshots](snapshots)
2. [Incremental models](configuring-incremental-models)

