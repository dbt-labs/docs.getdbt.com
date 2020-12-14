---
title: "Presto Profile"
---

:::info Community plugin

Some core functionality may be limited. If you're interested in contributing, check out the source code for each repository listed below.

:::

## Overview of dbt-presto
**Maintained by:** core dbt maintainers    
**Author:** Fishtown Analytics    
**Source:** https://github.com/fishtown-analytics/dbt-presto    
**Core version:** v0.13.0 and newer     

![dbt-presto stars](https://img.shields.io/github/stars/fishtown-analytics/dbt-presto?style=for-the-badge)

## Set up a Presto Target

Presto targets should be set up using the following configuration in your `profiles.yml` file.

<File name='~/.dbt/profiles.yml'>

```yaml
my-presto-db:
  target: dev
  outputs:
    dev:
      type: presto
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

## Installation and Distribution

dbt's Presto adapter is managed in its own repository, [dbt-presto](https://github.com/fishtown-analytics/dbt-presto). To use the Presto adapter, you must install the `dbt-presto` plugin:

### Using pip
The following command will install the latest version of `dbt-presto` as well as the requisite version of `dbt-core`:

```
pip install dbt-presto
```

## Caveats

### Unsupported Functionality

Due to the nature of Presto, not all core dbt functionality is supported. The following features of dbt are not implemented on Presto:

1. [Snapshots](snapshots)
2. [Incremental models](configuring-incremental-models)

If you are interested in helping to add support for this functionality in dbt on Presto, please [open an issue](https://github.com/fishtown-analytics/dbt-presto/issues/new).

### Required configuration

dbt fundamentally works by dropping and creating tables and views in databases. As such, the following Presto configs must be set for dbt to work properly on Presto:

```
hive.metastore-cache-ttl=0s
hive.metastore-refresh-interval = 5s
hive.allow-drop-table=true
hive.allow-rename-table=true
```
