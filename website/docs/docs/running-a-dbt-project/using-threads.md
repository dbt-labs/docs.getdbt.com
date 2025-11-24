---
title: "Using threads"
id: "using-threads"
sidebar_label: "Use threads"
description: "Understand what threads mean and how to use them."
pagination_next: null
---
 
When dbt runs, it creates a directed acyclic graph (DAG) of links between models. The number of threads represents the maximum number of paths through the graph dbt may work on at once – increasing the number of threads can minimize the run time of your project.

For example, if you specify `threads: 1`, dbt will start building only one model, and finish it, before moving onto the next. Specifying `threads: 8` means that dbt will work on _up to_ 8 models at once without violating dependencies – the actual number of models it can work on will likely be constrained by the available paths through the dependency graph.

There's no set limit of the maximum number of threads you can set – while increasing the number of threads generally decreases execution time, there are a number of things to consider:
- Increasing the number of threads increases the load on your warehouse, which may impact other tools in your data stack. For example, if your BI tool uses the same compute resources as dbt, their queries may get queued during a dbt run.
- The number of concurrent queries your database will allow you to run may be a limiting factor in how many models can be actively built – some models may queue while waiting for an available query slot.

Generally the optimal number of threads depends on your data warehouse and its configuration. It’s best to test different values to find the best number of threads for your project. We recommend setting this to 4 to start with.

You can use a different number of threads than the value defined in your target by using the `--threads` option when executing a dbt command.

You will define the number of threads in your `profiles.yml` file (when developing locally with dbt Core and the dbt Fusion engine), <Constant name="cloud" /> job definition, and <Constant name="cloud" /> development credentials under your profile.

<VersionBlock firstVersion="1.12">
<!-- versioning for 1.12 so it shows up in Latest eventually we might want to firstVersion="2.0"-->

## Fusion engine thread optimization

The <Constant name="fusion_engine" /> handles threading differently than <Constant name="core" />. The legacy `threads` setting doesn't act as a strict limit on the number of threads created. Instead, Fusion manages parallelism dynamically based on the selected warehouse.

### Redshift

In Redshift, the `threads` setting limits the number of queries or statements that can run in parallel. This behavior is the same as <Constant name="core" />, and is important for managing Redshift's concurrency limits and query queue behavior.

### Other warehouses

In other warehouses, Fusion dynamically optimizes thread usage based on the DAG and warehouse concurrency properties.

For more information about Fusion's approach to parallelism, refer to [the dbt Fusion engine](/docs/fusion) page.

</VersionBlock>

## Related docs
- [About profiles.yml](/docs/core/connect-data-platform/profiles.yml)
- [<Constant name="cloud" /> job scheduler](/docs/deploy/job-scheduler)
