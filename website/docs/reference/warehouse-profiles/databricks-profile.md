---
title: "Databricks Profile"
id: "databricks-profile"
---

## Overview of dbt-spark

**Maintained by:** some dbt loving bricksters
**Author:** Databricks
**Source:** [Github](https://github.com/databricks/dbt-databricks)    
**dbt Cloud:** Coming Soon    
**dbt Slack channel** [Link to channel](https://getdbt.slack.com/archives/CNGCW8HKL)     


![dbt-databricks stars](https://img.shields.io/github/stars/databricks/dbt-databricks?style=for-the-badge)

## Installation and Distribution

The easiest way to install dbt-databricks is to use `pip`:

```zsh
pip install dbt-databricks
```

### Set up a Databricks Target

dbt-databricks can connect to a Databricks all-purpose cluster as well as a SQL endpoints.

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: databricks
      schema: [database/schema name]
      host: [yourorg.databrickshost.com]
      http_path: [/sql/your/http/path]
      token: [dapiXXXXXXXXXXXXXXXXXXXXXXX]
```

</File>


## Caveats

### Supported Functionality

Most dbt Core functionality is supported, but some features are only available
on Delta Lake (Databricks).

Delta-only features:
1. Incremental model updates by `unique_key` instead of `partition_by` (see [`merge` strategy](spark-configs#the-merge-strategy))
2. [Snapshots](snapshots)

Some dbt features, available on the core adapters, are not yet supported on Spark:
1. [Persisting](persist_docs) column-level descriptions as database comments
