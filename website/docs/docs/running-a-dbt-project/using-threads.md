---
title: "Using threads"
id: "using-threads"
sidebar_label: "Use threads"
description: "Understand what threads mean and how to use them."
pagination_next: null
availability: all_users
---
import FusionThreads from '/snippets/_fusion-threads.md';
 
When dbt runs, it creates a directed acyclic graph (DAG) of links between models. The number of threads represents the maximum number of paths through the graph dbt may work on at once – increasing the number of threads can minimize the run time of your project.

For example, if you specify `threads: 1`, dbt will start building only one model, and finish it, before moving on to the next. Specifying `threads: 4` means that dbt will work on _up to_ 4 models at once without violating dependencies; the actual number of models it can work on will likely be constrained by the available paths through the dependency graph.

Here's the difference between running a project with 1 thread and 4 threads. With 1 thread, dbt builds one model at a time in dependency order. With 4 threads, dbt builds as many ready models in parallel as the graph allows, finishing much sooner. 

<Lightbox src="/img/docs/running-a-dbt-project/threads-1-vs-4-animated.gif" title="Increase threads to parallelize builds and finish faster. The colors have different meanings: gray means waiting, orange means building, and green means done." />

There's no set limit of the maximum number of threads you can set – while increasing the number of threads generally decreases execution time, there are a number of things to consider:
- Increasing the number of threads increases the load on your warehouse, which may impact other tools in your data stack. For example, if your BI tool uses the same compute resources as dbt, their queries may get queued during a dbt run.
- The number of concurrent queries your database will allow you to run may be a limiting factor in how many models can be actively built – some models may queue while waiting for an available query slot.

Generally the optimal number of threads depends on your data warehouse and its configuration. It’s best to test different values to find the best number of threads for your project. 

<VersionBlock lastVersion="1.99">

We recommend setting this to 4 to start with.

</VersionBlock>

<VersionBlock firstVersion="2.0">

In dbt v2, start with the maximum and lower it if needed. For the recommended values, check out the [dbt v2 thread optimization](#dbt-v2-thread-optimization) section.

</VersionBlock>

You can use a different number of threads than the value defined in your target by using the `--threads` option when executing a dbt command.

You will define the number of threads in your `profiles.yml` file (when developing locally with <Constant name="core" /> and <Constant name="fusion_engine" />), <Constant name="dbt" /> job definition, and <Constant name="dbt" /> development credentials under your profile.


## <Constant name="fusion_engine" /> thread optimization {#dbt-v2-thread-optimization}

In the context of <Constant name="fusion"/>, a thread is an open connection to your data warehouse, not the number of parallel threads on your local machine's CPU. Data platforms vary in how many concurrent connections they allow; exceeding those limits causes the platform to reject new connections.

In dbt v2, `threads` sets the maximum number of SQL queries dbt runs on your warehouse at the same time. To let dbt v2 run as many queries at once as your project allows:

- **When running in <Constant name="dbt_platform"/>**: Set `threads` to `256` in your [job settings](/docs/deploy/deploy-jobs?version=2#create-and-schedule-jobs).
- **When running locally**: Set `threads: 0` (or pass `--threads 0`).

If your warehouse rejects connections or you hit rate limits, lower `threads` to reduce concurrent load.

Project parsing runs separately and automatically uses all available CPUs. To disable parallel parsing and run one operation at a time, use the `--no-parallel` flag. This is useful for debugging parse errors and does not affect `threads`.

### Adapter-specific behavior

<FusionThreads />

For more information about <Constant name="fusion"/>'s approach to parallelism, refer to [the <Constant name="fusion_engine"/>](/docs/introduction) page.

## Related docs
- [About profiles.yml](/docs/local/profiles.yml)
- [<Constant name="dbt" /> job scheduler](/docs/deploy/job-scheduler)
