---
title: "init"
id: "init"
---

`dbt init [project_name]` performs several actions necessary to create a new dbt project:

- creates a `~/.dbt/profiles.yml` file if one does not already exist
- creates a new folder called `[project_name]`
- generates directories and sample files necessary to get started with dbt

### Adapter-specific profile
<Changelog>New in v0.18.0</Changelog>

You may optionally specify an `--adapter`. If you do, dbt will create `~/.dbt/profiles.yml` 
(if one does not already exist) in accordance with the intended adapter type.

```bash
dbt init [project_name] --adapter bigquery
```

**Note for plugin authors:** The `--adapter` flag looks for a file named
`dbt/include/[adapter_name]/sample_profiles.yml`. Check out [dbt-spark](https://github.com/dbt-labs/dbt-spark/tree/master/dbt/include/spark/sample_profiles.yml)
and [dbt-presto](https://github.com/dbt-labs/dbt-presto/blob/master/dbt/include/presto/sample_profiles.yml) as examples.
