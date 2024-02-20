---
title: "dbt Command reference"
---

You can run dbt using the following tools:

- In your browser with the [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) 
- On the command line interface using the [dbt Cloud CLI](/docs/cloud/cloud-cli-installation) or open-source [dbt Core](/docs/core/installation-overview), both of which enable you to execute dbt commands. The key distinction is the dbt Cloud CLI is tailored for dbt Cloud's infrastructure and integrates with all its [features](/docs/cloud/about-cloud/dbt-cloud-features).

The following sections outline the commands supported by dbt and their relevant flags. For information about selecting models on the command line, consult the docs on [Model selection syntax](/reference/node-selection/syntax).

## Available commands

All commands in the table are compatible with either the dbt Cloud IDE, dbt Cloud CLI, or dbt Core.  You can run dbt commands in your specific tool by prefixing them with `dbt`.  For example, to run the `test` command, type `dbt test`.

When you're managing your dbt project, it's important to understand that dbt commands are categorized into the following types and can be [executed in parallel](#execute-commands) with each other. The two types are as follows:

- Write commands: These commands perform actions that modify data or metadata in your data platform.
- Read commands: These commands involve operations that fetch or read data without making any modifications to your data platform.

The following table lists all the dbt commands, compatibility, whether you can execute them in parallel with each other. Note that some have 'N/A" since they're not relevant to the parallelization of dbt commands.

| Command | Description | <div style={{width:'200px'}}>Compatible tools and version</div>  | Type | Parallel execution |
|---------|-------------|-------------------------------|------| :---------------------------------------:|
| [build](/reference/commands/build) | Build and test all selected resources (models, seeds, snapshots, tests) | All tools <br /> All [supported versions](/docs/dbt-versions/core) | Write | ❌ |
| cancel | Cancels the most recent invocation. | dbt Cloud CLI <br /> Requires [dbt v1.6 or higher](/docs/dbt-versions/core) | N/A | N/A |
| [clean](/reference/commands/clean) | Deletes artifacts present in the dbt project | All tools <br /> All [supported versions](/docs/dbt-versions/core) | Read | ✅ |
| [clone](/reference/commands/clone) | Clone selected models from the specified state | All tools <br /> Requires [dbt v1.6 or higher](/docs/dbt-versions/core) | Write | ❌ |
| [compile](/reference/commands/compile) | Compiles (but does not run) the models in a project | All tools <br /> All [supported versions](/docs/dbt-versions/core) | Read | ✅ |
| [debug](/reference/commands/debug) | Debugs dbt connections and projects | dbt Cloud IDE, dbt Core <br /> All [supported versions](/docs/dbt-versions/core) | Read | ✅ |
| [deps](/reference/commands/deps) | Downloads dependencies for a project | All tools <br /> All [supported versions](/docs/dbt-versions/core) | Read | ✅ |
| [docs](/reference/commands/cmd-docs) | Generates documentation for a project | All tools <br /> All [supported versions](/docs/dbt-versions/core) | Read | ✅ |
| [environment](/reference/commands/dbt-environment) | Enables you to interact with your dbt Cloud environment. | dbt Cloud CLI <br /> Requires [dbt v1.5 or higher](/docs/dbt-versions/core) | N/A | N/A |
| help | Displays help information for any command | dbt Core, dbt Cloud CLI <br /> All [supported versions](/docs/dbt-versions/core) | N/A | N/A |
| [init](/reference/commands/init) | Initializes a new dbt project | dbt Core<br /> All [supported versions](/docs/dbt-versions/core) | Read | ✅ |
| [list](/reference/commands/list) | Lists resources defined in a dbt project | All tools <br /> All [supported versions](/docs/dbt-versions/core) | Read | ✅ |
| [parse](/reference/commands/parse) | Parses a project and writes detailed timing info | All tools <br /> All [supported versions](/docs/dbt-versions/core) | Read | ✅ |
| reattach | Reattaches to the most recent invocation to retrieve logs and artifacts. | dbt Cloud CLI <br /> Requires [dbt v1.6 or higher](/docs/dbt-versions/core) | N/A | N/A |
| [retry](/reference/commands/retry) | Retry the last run `dbt` command from the point of failure | All tools <br /> Requires [dbt v1.6 or higher](/docs/dbt-versions/core) | Write | ❌ |
| [run](/reference/commands/run) | Runs the models in a project | All tools <br /> All [supported versions](/docs/dbt-versions/core) | Write | ❌ |
| [run-operation](/reference/commands/run-operation) | Invoke a macro, including running arbitrary maintenance SQL against the database | All tools <br /> All [supported versions](/docs/dbt-versions/core) | Write | ❌ |
| [seed](/reference/commands/seed) | Loads CSV files into the database | All tools <br /> All [supported versions](/docs/dbt-versions/core) | Write | ❌ |
| [show](/reference/commands/show) | Preview table rows post-transformation | All tools <br /> All [supported versions](/docs/dbt-versions/core) | Read | ✅ |
| [snapshot](/reference/commands/snapshot) | Executes "snapshot" jobs defined in a project | All tools <br /> All [supported versions](/docs/dbt-versions/core) | Write | ❌ |
| [source](/reference/commands/source) | Provides tools for working with source data (including validating that sources are "fresh") | All tools<br /> All [supported versions](/docs/dbt-versions/core) | Read | ✅ |
| [test](/reference/commands/test) | Executes tests defined in a project  | All tools <br /> All [supported versions](/docs/dbt-versions/core) | Read | ✅ |
| [--version](/reference/commands/version) | Displays the currently installed version of dbt CLI | dbt Core, dbt Cloud CLI  <br />  All [supported versions](/docs/dbt-versions/core) |  N/A  | N/A |

<VersionBlock firstVersion="1.6">

<!--
All commands in the table are compatible with either the dbt Cloud IDE, dbt Cloud CLI, or dbt Core.  

You can run dbt commands in your specific tool by prefixing them with `dbt`.  For example, to run the `test` command, type `dbt test`.

| Command | Description | Compatible tools | <div style={{width:'220px'}}>Version</div> | 
| ------- | ----------- | ---------------- | ------- | 
| [build](/reference/commands/build) | Build and test all selected resources (models, seeds, snapshots, tests) | All | All [supported versions](/docs/dbt-versions/core) | 
| cancel  | Cancels the most recent invocation.| dbt Cloud CLI | Requires [dbt v1.6 or higher](/docs/dbt-versions/core) |
| [clean](/reference/commands/clean) | Deletes artifacts present in the dbt project | All | All [supported versions](/docs/dbt-versions/core) |
| [clone](/reference/commands/clone) | Clone selected models from the specified state | All | Requires [dbt v1.6 or higher](/docs/dbt-versions/core)  |
| [compile](/reference/commands/compile) | Compiles (but does not run) the models in a project | All | All [supported versions](/docs/dbt-versions/core) |
| [debug](/reference/commands/debug)  | Debugs dbt connections and projects  | dbt Cloud IDE <br /> dbt Core  | All [supported versions](/docs/dbt-versions/core) |
| [deps](/reference/commands/deps) | Downloads dependencies for a project  | All | All [supported versions](/docs/dbt-versions/core) |
| [docs](/reference/commands/cmd-docs) | Generates documentation for a project | All | All [supported versions](/docs/dbt-versions/core) |
| [environment](/reference/commands/dbt-environment)  | Enables you to interact with your dbt Cloud environment.  | dbt Cloud CLI | Requires [dbt v1.5 or higher](/docs/dbt-versions/core) |
| help | Displays help information for any command | dbt Core <br /> dbt Cloud CLI | All [supported versions](/docs/dbt-versions/core) |
| [init](/reference/commands/init)  | Initializes a new dbt project  | dbt Core | All [supported versions](/docs/dbt-versions/core) |
| [list](/reference/commands/list) | Lists resources defined in a dbt project | All | All [supported versions](/docs/dbt-versions/core) |
| [parse](/reference/commands/parse) | Parses a project and writes detailed timing info | All | All [supported versions](/docs/dbt-versions/core) |
| reattach | Reattaches to the most recent invocation to retrieve logs and artifacts. | dbt Cloud CLI | Requires [dbt v1.6 or higher](/docs/dbt-versions/core) |
| [retry](/reference/commands/retry) | Retry the last run `dbt` command from the point of failure | All | Requires [dbt v1.6 or higher](/docs/dbt-versions/core) |
| [run](/reference/commands/run) | Runs the models in a project | All | All [supported versions](/docs/dbt-versions/core) |
| [run-operation](/reference/commands/run-operation) | Invoke a macro, including running arbitrary maintenance SQL against the database | All | All [supported versions](/docs/dbt-versions/core) |
| [seed](/reference/commands/seed) | Loads CSV files into the database  | All | All [supported versions](/docs/dbt-versions/core) |
| [show](/reference/commands/show) | Preview table rows post-transformation  | All | All [supported versions](/docs/dbt-versions/core) |
| [snapshot](/reference/commands/snapshot) | Executes "snapshot" jobs defined in a project  | All | All [supported versions](/docs/dbt-versions/core) |
| [source](/reference/commands/source) | Provides tools for working with source data (including validating that sources are "fresh")  | All | All [supported versions](/docs/dbt-versions/core) |
| [test](/reference/commands/test) | Executes tests defined in a project  | All | All [supported versions](/docs/dbt-versions/core) |
| [--version](/reference/commands/version) | Displays the currently installed version of dbt CLI | dbt Core <br /> dbt Cloud CLI | All [supported versions](/docs/dbt-versions/core) |
-->
</VersionBlock>

<VersionBlock lastVersion="1.5">

Select the tabs that are relevant to your development workflow. For example, if you develop in the dbt Cloud IDE, select **dbt Cloud**.  

<Tabs>
<TabItem value="cloud" label="dbt Cloud IDE">

Use the following dbt commands in the [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) and use the `dbt` prefix. For example, to run the `test` command, type `dbt test`.

- [build](/reference/commands/build): build and test all selected resources (models, seeds, snapshots, tests)
- [clone](/reference/commands/clone): clone selected nodes from the specified state (requires dbt 1.6 or higher)
- [compile](/reference/commands/compile): compiles (but does not run) the models in a project
- [deps](/reference/commands/deps): downloads dependencies for a project
- [docs](/reference/commands/cmd-docs) : generates documentation for a project
- [retry](/reference/commands/retry): retry the last run `dbt` command from the point of failure (requires dbt 1.6 or later)
- [run](/reference/commands/run): runs the models in a project
- [run-operation](/reference/commands/run-operation): invoke a macro, including running arbitrary maintenance SQL against the database
- [seed](/reference/commands/seed): loads CSV files into the database
- [show](/reference/commands/show): preview table rows post-transformation
- [snapshot](/reference/commands/snapshot): executes "snapshot" jobs defined in a project
- [source](/reference/commands/source): provides tools for working with source data (including validating that sources are "fresh")
- [test](/reference/commands/test): executes tests defined in a project

</TabItem>

<TabItem value="cli" label="dbt Core">

Use the following dbt commands in [dbt Core](/docs/core/installation-overview) and use the `dbt` prefix. For example, to run the `test` command, type `dbt test`.

- [build](/reference/commands/build): build and test all selected resources (models, seeds, snapshots, tests)
- [clean](/reference/commands/clean): deletes artifacts present in the dbt project
- [clone](/reference/commands/clone): clone selected models from the specified state (requires dbt 1.6 or higher)
- [compile](/reference/commands/compile): compiles (but does not run) the models in a project
- [debug](/reference/commands/debug): debugs dbt connections and projects
- [deps](/reference/commands/deps): downloads dependencies for a project
- [docs](/reference/commands/cmd-docs) : generates documentation for a project
- [init](/reference/commands/init): initializes a new dbt project
- [list](/reference/commands/list): lists resources defined in a dbt project
- [parse](/reference/commands/parse): parses a project and writes detailed timing info
- [retry](/reference/commands/retry): retry the last run `dbt` command from the point of failure (requires dbt 1.6 or higher)
- [rpc](/reference/commands/rpc): runs an RPC server that clients can submit queries to
- [run](/reference/commands/run): runs the models in a project
- [run-operation](/reference/commands/run-operation): invoke a macro, including running arbitrary maintenance SQL against the database
- [seed](/reference/commands/seed): loads CSV files into the database
- [show](/reference/commands/show): preview table rows post-transformation
- [snapshot](/reference/commands/snapshot): executes "snapshot" jobs defined in a project
- [source](/reference/commands/source): provides tools for working with source data (including validating that sources are "fresh")
- [test](/reference/commands/test): executes tests defined in a project

</TabItem>

</Tabs>
</VersionBlock>

## Execute commands

If you're using dbt Cloud, you can run multiple dbt commands at the same time, but it's important to understand which commands can be run in parallel and which can't. We call this 'parallel execution' and it's important when distinguishing between write and read commands:

- Write commands &mdash; Commands such as `dbt build` and `dbt run` are limited to one invocation at any given time (1 parallelism). This is to prevent any potential conflicts, such as overwriting the same table in your data platform, at the same time.
- Read commands &mdash; Commands such as `dbt parse` and `dbt source snapshot-freshness` can have multiple invocations in parallel and aren't limited to one invocation at any given time. This means read commands can run in parallel with both other read commands and write commands.

To ensure your dbt workflows are both efficient and safe, you can run different types of dbt commands at the same time (in parallel). 
- For example, `dbt build` (write operation) can safely run alongside `dbt parse` (read operation) at the same time. However, you can't run `dbt build` and `dbt run` (both write operations) at the same time.
