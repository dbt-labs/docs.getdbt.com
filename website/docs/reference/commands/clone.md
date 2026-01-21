---
title: "About dbt clone command"
sidebar_label: "clone"
id: "clone"
---

The `dbt clone` command clones selected nodes from the [specified state](/reference/node-selection/syntax#establishing-state) to the target schema(s). This command makes use of the `clone` materialization:
- If your data platform supports zero-copy cloning of tables (Snowflake, Databricks, or BigQuery), and this model exists as a table in the source environment, dbt will create it in your target environment as a clone.
- Otherwise, dbt will create a simple pointer view (`select * from` the source object)
- By default, `dbt clone` will not recreate pre-existing relations in the current target. To override this, use the `--full-refresh` flag. 
- You may want to specify a higher number of [threads](/docs/running-a-dbt-project/using-threads) to decrease execution time since individual clone statements are independent of one another.

The `clone` command is useful for:
- blue/green continuous deployment (on data warehouses that support zero-copy cloning tables)
- cloning current production state into development schema(s)
- handling incremental models in <Constant name="cloud" /> CI jobs (on data warehouses that support zero-copy cloning tables)
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

As another example, you could `clone` your modified incremental models as the first step of your <Constant name="cloud" /> CI job to prevent costly `full-refresh` builds for warehouses that support zero-copy cloning.

## Cloning in dbt

You can clone nodes between states in <Constant name="cloud" /> using the `dbt clone` command. This is available in the [<Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-in-studio) and the [<Constant name="cloud_cli" />](/docs/cloud/cloud-cli-installation) and  relies on the [`--defer`](/reference/node-selection/defer) feature. For more details on defer in <Constant name="cloud" />, read [Using defer in <Constant name="cloud" />](/docs/cloud/about-cloud-develop-defer).

- **Using <Constant name="cloud_cli" />** &mdash; The `dbt clone` command in the <Constant name="cloud_cli" /> automatically includes the `--defer` flag. This means you can use the `dbt clone` command without any additional setup.

- **Using <Constant name="cloud_ide" />** &mdash; To use the `dbt clone` command in the <Constant name="cloud_ide" />, follow these steps before running the `dbt clone` command:

  - Set up your **Production environment** and have a successful job run.
  - Enable **Defer to production** by toggling the switch in the lower-right corner of the command bar.
    <Lightbox src="/img/docs/dbt-cloud/defer-toggle.png" width="80%" title="Select the 'Defer to production' toggle on the bottom right of the command bar to enable defer in the Studio IDE."/>
  - Run the `dbt clone` command from the command bar.
  
  
Check out [this Developer blog post](/blog/to-defer-or-to-clone) for more details on best practices when to use `dbt clone` vs. deferral.
