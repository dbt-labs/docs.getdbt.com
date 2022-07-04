---
title: "Databricks Profile"
id: "databricks-profile"
---

## Overview of dbt-databricks

**Maintained by:** some dbt loving Bricksters  
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

dbt-databricks can connect to Databricks all-purpose clusters as well as SQL endpoints.
The latter provides an opinionated way of running SQL workloads with optimal performance and
price, the former provides all the flexibility of Spark.

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: databricks
      schema: [schema name]
      host: [yourorg.databrickshost.com]
      http_path: [/sql/your/http/path]
      token: [dapiXXXXXXXXXXXXXXXXXXXXXXX] # Personal Access Token (PAT)
      threads: [1 or more]  # optional, default 1
```

</File>

See the [Databricks documentation](https://docs.databricks.com/dev-tools/dbt.html#) on how
to obtain the credentials for configuring your profile.

## Caveats

### Supported Functionality

Most dbt Core functionality is supported, but some features are only available
on Delta Lake.

Delta-only features:
1. Incremental model updates by `unique_key` instead of `partition_by` (see [`merge` strategy](spark-configs#the-merge-strategy))
2. [Snapshots](https://docs.getdbt.com/docs/building-a-dbt-project/snapshots)

### Choosing between dbt-databricks and dbt-spark

While `dbt-spark` can be used to connect to Databricks, `dbt-databricks` was created to make it
even easier to use dbt with the Databricks Lakehouse.

`dbt-databricks` includes:
- No need to install additional drivers or dependencies for use on the CLI
- Use of Delta Lake for all models out of the box
- SQL macros that are optimzed to run with [Photon](https://docs.databricks.com/runtime/photon.html)
