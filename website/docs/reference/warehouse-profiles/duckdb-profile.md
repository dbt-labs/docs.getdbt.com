---
title: "DuckDB Profile"
---

:::info Community plugin

Some core functionality may be limited. If you're interested in contributing, check out the source code for each repository listed below.

:::

## Overview of dbt-duckdb

**Maintained by:** Community  
**Author:** [Josh Wills](https://github.com/jwills)   
**Source:** [GitHub](https://github.com/jwills/dbt-duckdb)  
**Core version:** v1.0.1     
**dbt Cloud:** Not Supported     
**dbt Slack channel:** [Link to channel](https://getdbt.slack.com/archives/C039D1J1LA2)

![dbt-duckdb stars](https://img.shields.io/github/stars/jwills/dbt-duckdb?style=for-the-badge)
![latest version on PyPI](https://img.shields.io/pypi/v/dbt-duckdb?style=for-the-badge)

The package can be installed from PyPI with:

```python
pip3 install dbt-duckdb
```


## Connecting to DuckDB with dbt-duckdb

[DuckDB](http://duckdb.org) is an embedded database, similar to SQLite, but designed for OLAP-style analytics instead of OLTP. The only configuration parameter that is required in your profile (in addition to `type: duckdb`) is the `path` field, which should refer to a path on your local filesystem where you would like the DuckDB database file (and it's associated write-ahead log) to be written. You can also specify the `schema` parameter if you would like to use a schema besides the default (which is called `main`).

There is also a `database` field defined in the `DuckDBCredentials` class for consistency with the parent `Credentials` class, but it defaults to `main` and setting it to be something else will likely cause strange things to happen that cannot be fully predicted, so please avoid changing it.

Example:

<File name='profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: duckdb
      path: 'file_path/database_name.duckdb'
      #optional fields
      schema: schema_name 
```

</File>


