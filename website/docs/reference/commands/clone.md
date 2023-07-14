---
title: "About dbt clone command"
sidebar_label: "clone"
id: "clone"
---

The `dbt clone` command clones selected nodes from the specified state to the target schema(s). This command makes use of the `clone` materialization:
- If using a data warehouses that support zero-copy cloning of tables, selected models that are tables will be created as clones
- For views and warehouses that do not support zero-copy cloning, selected models will be created as simple `select * from ...` pointer views

Note: 
- The state to clone from is based on the location of nodes in the manifest provided to `--state`.
- By default, `dbt clone` will not recreate pre-existing relations in the current target. To override this, use the `--full-refresh` flag. 
- You may want to specify a higher number of [threads](/docs/running-a-dbt-project/using-threads) to decrease execution time since individual clone statements are independent of one another.

The `clone` command is useful for:
- blue/green deployment
- cloning current production state into development schema(s)
- handling incremental models in Slim CI dbt Cloud jobs

```bash
# clone all of my models from specified state to my target schema(s)
dbt clone --state path/to/artifacts

# clone one_specific_model of my models from specified state to my target schema(s)
dbt clone --select one_specific_model --state path/to/artifacts

# clone all of my models from specified state to my target schema(s) and recreate all pre-exisiting relations in the current target
dbt clone --state path/to/artifacts --full-refresh

# clone all of my models from specified state to my target schema(s), running up to 50 clone statements in parallel
dbt clone --state path/to/artifacts --threads 50
```