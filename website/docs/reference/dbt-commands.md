---
title: "dbt Command reference"
---

You can run dbt using the following tools:

- In your browser with the [<Constant name="cloud_ide" />](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) 
- On the command line interface using the [<Constant name="cloud_cli" />](/docs/cloud/cloud-cli-installation) or open-source [<Constant name="core" />](/docs/core/installation-overview).
  
A key distinction with the tools mentioned, is that <Constant name="cloud_cli" /> and <Constant name="cloud_ide" /> are designed to support safe parallel execution of dbt commands, leveraging <Constant name="cloud" />'s infrastructure and its comprehensive [features](/docs/cloud/about-cloud/dbt-cloud-features). In contrast, <Constant name="core" /> _doesn't support_ safe parallel execution for multiple invocations in the same process. Learn more in the [parallel execution](#parallel-execution) section.

## Parallel execution

<Constant name="cloud" /> allows for concurrent execution of commands, enhancing efficiency without compromising data integrity. This enables you to run multiple commands at the same time. However, it's important to understand which commands can be run in parallel and which can't.

In contrast, [`dbt-core` _doesn't_ support](/reference/programmatic-invocations#parallel-execution-not-supported) safe parallel execution for multiple invocations in the same process, and requires users to manage concurrency manually to ensure data integrity and system stability.

To ensure your dbt workflows are both efficient and safe, you can run different types of dbt commands at the same time (in parallel) &mdash; for example, `dbt build` (write operation) can safely run alongside `dbt parse` (read operation) at the same time. However, you can't run `dbt build` and `dbt run` (both write operations) at the same time.

dbt commands can be `read` or `write` commands:

| Command type | Description | <div style={{width:'200px'}}>Example</div> |
|------|-------------|---------|
| **Write** | These commands perform actions that change data or metadata in your data platform.<br /><br /> Limited to one invocation at any given time, which prevents any potential conflicts, such as overwriting the same table in your data platform at the same time. | `dbt build`<br />`dbt run` |
| **Read** | These commands involve operations that fetch or read data without making any changes to your data platform.<br /><br /> Can have multiple invocations in parallel and aren't limited to one invocation at any given time. This means read commands can run in parallel with other read commands and a single write command.| `dbt parse`<br />`dbt compile`|

## Available commands

The following sections outline the commands supported by dbt and their relevant flags. They are available in all tools and all [supported versions](/docs/dbt-versions/core) unless noted otherwise. You can run these commands in your specific tool by prefixing them with `dbt` &mdash; for example, to run the `test` command, type `dbt test`.

For information about selecting models on the command line, refer to [Model selection syntax](/reference/node-selection/syntax).

Commands with a ('❌') indicate write commands, commands with a ('✅') indicate read commands, and commands with a (N/A) indicate it's not relevant to the parallelization of dbt commands.

:::info
Some commands are not yet supported in the <Constant name="fusion_engine" /> or have limited functionality. See the [Fusion supported features](/docs/fusion/supported-features) page for details.
:::


| Command | Description | Parallel execution |  <div style={{width:'250px'}}>Caveats</div> |
|---------|-------------| :-----------------:| ------------------------------------------ |
| [build](/reference/commands/build) | Builds and tests all selected resources (models, seeds, tests, and more) |  ❌ | All tools <br /> All [supported versions](/docs/dbt-versions/core) | 
| cancel | Cancels the most recent invocation. | N/A | <Constant name="cloud_cli" /> <br /> Requires [dbt v1.6 or higher](/docs/dbt-versions/core) |
| [clean](/reference/commands/clean) | Deletes artifacts present in the dbt project |  ✅ | All tools <br /> All [supported versions](/docs/dbt-versions/core) |
| [clone](/reference/commands/clone) | Clones selected models from the specified state |  ❌ | All tools <br /> Requires [dbt v1.6 or higher](/docs/dbt-versions/core) |
| [compile](/reference/commands/compile) | Compiles (but does not run) the models in a project |  ✅ | All tools <br /> All [supported versions](/docs/dbt-versions/core) |
| [debug](/reference/commands/debug) | Debugs dbt connections and projects | ✅ | All tools <br /> All [supported versions](/docs/dbt-versions/core) |
| [deps](/reference/commands/deps) | Downloads dependencies for a project |  ✅ |  All tools <br /> All [supported versions](/docs/dbt-versions/core) |
| [docs](/reference/commands/cmd-docs) | Generates documentation for a project |   ✅ | All tools <br /> All [supported versions](/docs/dbt-versions/core) <br /> Not yet supported in <Constant name="fusion" /> |
| [environment](/reference/commands/dbt-environment) | Enables you to interact with your <Constant name="cloud" /> environment. |   N/A | <Constant name="cloud_cli" /> <br /> Requires [dbt v1.5 or higher](/docs/dbt-versions/core) |
| help | Displays help information for any command | N/A | <Constant name="core" />, <Constant name="cloud_cli" /> <br /> All [supported versions](/docs/dbt-versions/core) |
| [init](/reference/commands/init) | Initializes a new dbt project |   ✅ | <Constant name="fusion" /> <br /> <Constant name="core" /><br /> All [supported versions](/docs/dbt-versions/core) |
| [invocation](/reference/commands/invocation) | Enables users to debug long-running sessions by interacting with active invocations.|  N/A | <Constant name="cloud_cli" /> <br /> Requires [dbt v1.5 or higher](/docs/dbt-versions/core) |
| [list](/reference/commands/list) | Lists resources defined in a dbt project |  ✅ | All tools <br /> All [supported versions](/docs/dbt-versions/core) |
| [parse](/reference/commands/parse) | Parses a project and writes detailed timing info |  ✅ | All tools <br /> All [supported versions](/docs/dbt-versions/core) |
| reattach | Reattaches to the most recent invocation to retrieve logs and artifacts. |   N/A | <Constant name="cloud_cli" /> <br /> Requires [dbt v1.6 or higher](/docs/dbt-versions/core) |
| [retry](/reference/commands/retry) | Retry the last run `dbt` command from the point of failure |  ❌ | All tools <br /> Requires [dbt v1.6 or higher](/docs/dbt-versions/core)<br /> Not yet supported in <Constant name="fusion" /> |
| [run](/reference/commands/run) | Runs the models in a project |   ❌ | All tools <br /> All [supported versions](/docs/dbt-versions/core) |
| [run-operation](/reference/commands/run-operation) | Invokes a macro, including running arbitrary maintenance SQL against the database | ❌ | All tools <br /> All [supported versions](/docs/dbt-versions/core) |
| [seed](/reference/commands/seed) | Loads CSV files into the database |  ❌ | All tools <br /> All [supported versions](/docs/dbt-versions/core) |
| [show](/reference/commands/show) | Previews table rows post-transformation | ✅ |  All tools <br /> All [supported versions](/docs/dbt-versions/core) |
| [snapshot](/reference/commands/snapshot) | Executes "snapshot" jobs defined in a project |  ❌ | All tools <br /> All [supported versions](/docs/dbt-versions/core) |
| [source](/reference/commands/source) | Provides tools for working with source data (including validating that sources are "fresh") | ✅ | All tools<br /> All [supported versions](/docs/dbt-versions/core) |
| [test](/reference/commands/test) | Executes tests defined in a project  |  ✅ | All tools <br /> All [supported versions](/docs/dbt-versions/core) <br /> <Constant name="fusion" /> flags `--store-failures`, `--fail-fast`, `--warn-error` not yet supported |

Note, use the [`--version`](/reference/commands/version) flag to display the installed <Constant name="core" /> or <Constant name="cloud_cli" /> version. (Not applicable for the <Constant name="cloud_ide" />). Available on all [supported versions](/docs/dbt-versions/core).
