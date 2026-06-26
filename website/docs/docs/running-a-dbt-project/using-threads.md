---
title: "Using threads"
id: "using-threads"
sidebar_label: "Use threads"
description: "Understand what threads mean and how to use them."
pagination_next: null
---
import FusionThreads from '/snippets/_fusion-threads.md';
 
When dbt runs, it creates a directed acyclic graph (DAG) of links between models. The number of threads represents the maximum number of paths through the graph dbt may work on at once – increasing the number of threads can minimize the run time of your project.

For example, if you specify `threads: 1`, dbt will start building only one model, and finish it, before moving onto the next. Specifying `threads: 8` means that dbt will work on _up to_ 8 models at once without violating dependencies – the actual number of models it can work on will likely be constrained by the available paths through the dependency graph.

There's no set limit of the maximum number of threads you can set – while increasing the number of threads generally decreases execution time, there are a number of things to consider:
- Increasing the number of threads increases the load on your warehouse, which may impact other tools in your data stack. For example, if your BI tool uses the same compute resources as dbt, their queries may get queued during a dbt run.
- The number of concurrent queries your database will allow you to run may be a limiting factor in how many models can be actively built – some models may queue while waiting for an available query slot.

Generally the optimal number of threads depends on your data warehouse and its configuration. It’s best to test different values to find the best number of threads for your project. We recommend setting this to 4 to start with.

You can use a different number of threads than the value defined in your target by using the `--threads` option when executing a dbt command.

You will define the number of threads in your `profiles.yml` file (when developing locally with dbt Core and the dbt Fusion engine), <Constant name="dbt" /> job definition, and <Constant name="dbt" /> development credentials under your profile.


## Fusion engine thread optimization

In the context of <Constant name="fusion"/>, a thread is an open connection to your data warehouse, not the number of parallel threads on your local machine's CPU. Data platforms vary in how many concurrent connections they allow; exceeding those limits causes the platform to reject new connections.

Historically, analytics engineers set `threads:` to ensure dbt never opened more connections than the platform could handle.

<Constant name="fusion"/> works well without configuring `threads`. Rather than treating `threads` as a strict limit, <Constant name="fusion"/> automatically manages connection parallelism based on platform limits and uses backpressure to avoid overloading your warehouse. In general, we recommend not setting `threads` when using <Constant name="fusion"/>.

However, if <Constant name="fusion"/> still opens more connections than your warehouse can handle, configure `threads` to cap the maximum number of concurrent connections.

Project parsing runs separately and automatically uses all available CPUs. To disable parallel parsing and run one operation at a time, use the `--no-parallel` flag. This is useful for debugging parse errors and does not affect threads.

### Adapter-specific behavior

<FusionThreads />

For more information about <Constant name="fusion"/>'s approach to parallelism, refer to [the <Constant name="fusion_engine"/>](/docs/fusion) page.

## Related docs
- [About profiles.yml](/docs/local/profiles.yml)
- [<Constant name="dbt" /> job scheduler](/docs/deploy/job-scheduler)
