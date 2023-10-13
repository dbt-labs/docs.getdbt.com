---
title: "dbt Command reference"
---

You can run dbt using the following tools:

- In your browser with the [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) 
- On the command line interface using the [dbt Cloud CLI](/docs/cloud/cloud-cli-installation) or open-source [dbt Core](/docs/core/about-dbt-core), both of which enable you to execute dbt commands. The key distinction is the dbt Cloud CLI is tailored for dbt Cloud's infrastructure and integrates with all its [features](/docs/cloud/about-cloud/dbt-cloud-features).

The following sections outline the commands supported by dbt and their relevant flags. For information about selecting models on the command line, consult the docs on [Model selection syntax](/reference/node-selection/syntax).

### Available commands


<VersionBlock firstVersion="1.5">

All commands in the table are compatible with either the dbt Cloud IDE, dbt Cloud CLI, or dbt Core.  

You can run dbt commands in your specific tool by prefixing them with `dbt`.  For example, to run the `test` command, type `dbt test`.

| Command | Description | Compatible tools | Version |
| ------- | ----------- | ---------------- | ------- |
| [build](/reference/commands/build) | Build and test all selected resources (models, seeds, snapshots, tests) | All | All [supported versions](/docs/dbt-versions/core) |
| cancel  | Cancels the most recent invocation.| dbt Cloud CLI | Requires [dbt v1.6 or higher](/docs/dbt-versions/core) |
| [clean](/reference/commands/clean) | Deletes artifacts present in the dbt project | All | All [supported versions](/docs/dbt-versions/core) |
| [clone](/reference/commands/clone) | Clone selected models from the specified state | dbt Cloud CLI <br /> dbt Core | Requires [dbt v1.6 or higher](/docs/dbt-versions/core)  |
| [compile](/reference/commands/compile) | Compiles (but does not run) the models in a project | All | All [supported versions](/docs/dbt-versions/core) |
| [debug](/reference/commands/debug)  | Debugs dbt connections and projects  | dbt Core | All [supported versions](/docs/dbt-versions/core) |
| [deps](/reference/commands/deps) | Downloads dependencies for a project  | All | All [supported versions](/docs/dbt-versions/core) |
| [docs](/reference/commands/cmd-docs) | Generates documentation for a project | All | All [supported versions](/docs/dbt-versions/core) |
| help | Displays help information for any command | dbt Core <br /> dbt Cloud CLI | All [supported versions](/docs/dbt-versions/core) |
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
| [init](/reference/commands/init)  | Initializes a new dbt project  | dbt Core | All [supported versions](/docs/dbt-versions/core) |

</VersionBlock>

<VersionBlock lastVersion="1.5">

Select the tabs that are relevant to your development workflow. For example, if you develop in the dbt Cloud IDE, select **dbt Cloud**.  

<Tabs>
<TabItem value="cloud" label="dbt Cloud IDE">

Use the following dbt commands in the [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) and use the `dbt` prefix. For example, to run the `test` command, type `dbt test`.

- [build](/reference/commands/build): build and test all selected resources (models, seeds, snapshots, tests)
- [clone](/reference/commands/clone): clone selected nodes from specified state (requires dbt 1.6 or higher)
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

Use the following dbt commands in the [dbt COre](/docs/core/about-dbt-core) and use the `dbt` prefix. For example, to run the `test` command, type `dbt test`.

- [build](/reference/commands/build): build and test all selected resources (models, seeds, snapshots, tests)
- [clean](/reference/commands/clean): deletes artifacts present in the dbt project
- [clone](/reference/commands/clone): clone selected models from specified state (requires dbt 1.6 or higher)
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
