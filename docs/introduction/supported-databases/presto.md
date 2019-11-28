---
title: "Presto"
description: "Installation and profile configuration instructions for Presto"
---
[block:callout]
{
  "type": "info",
  "title": "New in 0.13.0",
  "body": "Support for Presto was added in dbt v0.13.0"
}
[/block]
# Set up a Presto Target

Presto targets should be set up using the following configuration in your `profiles.yml` file.
[block:code]
{
  "codes": [
    {
      "code": "my-presto-db:\n  target: dev\n  outputs:\n    dev:\n      type: presto\n      method: none # One of {none | kerberos}\n      database: [database name]\n      host: [hostname]\n      port: [port number]\n      schema: [your dbt schema]\n      threads: [1 or more]\n",
      "language": "yaml",
      "name": "~/.dbt/profiles.yml"
    }
  ]
}
[/block]
## Installation and Distribution

dbt's Presto adapter is managed in its own repository, [dbt-presto](https://github.com/fishtown-analytics/dbt-presto). To use the Presto adapter, you must install the `dbt-presto` package in addition to installing `dbt` on your system.

### Using pip
The following command will install `dbt-presto` as well as `dbt-core`.

```
pip install dbt-presto
```

# Caveats

## Supported Functionality

Due to the nature of Presto, not all core dbt functionality is supported. The following features of dbt are not implemented on Presto:

1. [Archival](doc:archival)
2. [Incremental models](doc:configuring-incremental-models)

If you are interested in helping to add support for this functionality in dbt on Presto, please [open an issue](https://github.com/fishtown-analytics/dbt/issues/new)

## Required configuration

dbt fundamentally works by dropping and creating tables and views in databases. As such, the following Presto configs must be set for dbt to work properly on Presto:

```
hive.metastore-cache-ttl=0s
hive.metastore-refresh-interval = 5s
hive.allow-drop-table=true
hive.allow-rename-table=true
```
