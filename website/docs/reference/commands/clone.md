---
title: "About dbt clone command"
sidebar_label: "clone"
id: "clone"
---

The `dbt clone` command clones selected nodes from the [specified state](/reference/node-selection/syntax#establishing-state) to the target schema(s). This command makes use of the `clone` materialization:
- If your data platform supports zero-copy cloning of tables, and this model exists as a table in the source environment, dbt will create it in your target environment as a clone
- Otherwise, dbt will create a simple pointer view (`select * from` the source object)
- By default, `dbt clone` will not recreate pre-existing relations in the current target. To override this, use the `--full-refresh` flag. 
- You may want to specify a higher number of [threads](/docs/running-a-dbt-project/using-threads) to decrease execution time since individual clone statements are independent of one another.

The `clone` command is useful for:
- blue/green continuous deployment (on data warehouses that support zero-copy cloning tables)
- cloning current production state into development schema(s)
- handling incremental models in dbt Cloud CI jobs (on data warehouses that support zero-copy cloning tables)
- testing code changes on downstream dependencies in your BI tool


```bash
# clone all of my models from specified state to my target schema(s)
dbt clone --state path/to/artifacts

# clone one_specific_model of my models from specified state to my target schema(s)
dbt clone --select "one_specific_model" --state path/to/artifacts

# clone all of my models from specified state to my target schema(s) and recreate all pre-existing relations in the current target
dbt clone --state path/to/artifacts --full-refresh

# clone all of my models from specified state to my target schema(s), running up to 50 clone statements in parallel
dbt clone --state path/to/artifacts --threads 50
```

### When to use `dbt clone` instead of [deferral](/reference/node-selection/defer)?

Unlike deferral, `dbt clone` requires some compute and creation of additional objects in your data warehouse. In many cases, deferral is a cheaper and simpler alternative to `dbt clone`. However, `dbt clone` covers additional use cases where deferral may not be possible.

For example, by creating actual data warehouse objects, `dbt clone` allows you to test out your code changes on downstream dependencies _outside of dbt_ (such as a BI tool). 

As another example, you could `clone` your modified incremental models as the first step of your dbt Cloud CI job to prevent costly `full-refresh` builds for warehouses that support zero-copy cloning.

## Cloning in dbt Cloud

You can clone nodes between states in dbt Cloud using the `dbt clone` command. This is available in the [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) and the [dbt Cloud CLI](/docs/cloud/cloud-cli-installation) and  relies on the [`--defer`](/reference/node-selection/defer) feature. For more details on defer in dbt Cloud, read [Using defer in dbt Cloud](/docs/cloud/about-cloud-develop-defer).

- **Using dbt Cloud CLI** &mdash; The `dbt clone` command in the dbt Cloud CLI automatically includes the `--defer` flag. This means you can use the `dbt clone` command in the dbt Cloud CLI without any additional setup.

- **Using dbt Cloud IDE** &mdash; To use the `dbt clone` command in the dbt Cloud IDE, follow these steps before running the `dbt clone` command:

  - Set up your **Production environment** and have a successful job run.
  - Enable **Defer to production** by toggling the switch in the lower-right corner of the command bar.
    <Lightbox src="/img/docs/dbt-cloud/defer-toggle.jpg" width="80%" title="Select the 'Defer to production' toggle on the bottom right of the command bar to enable defer in the dbt Cloud IDE."/>
  - Run the `dbt clone` command from the command bar.
  
  

