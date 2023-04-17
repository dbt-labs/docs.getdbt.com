---
title: "dbt Command reference"
---

dbt is typically run one of two ways:
* In [dbt Cloud](/docs/cloud/develop-in-the-cloud)
* On the [command line interface](/docs/core/about-the-cli) (CLI)

The following sections outline the commands supported by dbt and their relevant flags. Note that some commands are only supported when using the CLI. Select the tabs that are relevant to the your development workflow. For example, if you develop in the dbt Cloud IDE, select the "Available commands in dbt Cloud" tab. 

For information about selecting models on the command line, consult the docs on [Model selection syntax](node-selection/syntax).


<Tabs>
<TabItem value="cloud" label="Available commands in dbt Cloud">

Use the following dbt commands in the [dbt Cloud IDE](/docs/cloud/develop-in-the-cloud)

- [build](/reference/commands/build): build and test all selected resources (models, seeds, snapshots, tests)
- [compile](/reference/commands/compile): compiles (but does not run) the models in a project
- [deps](/reference/commands/deps): downloads dependencies for a project
- [docs](/reference/commands/cmd-docs) : generates documentation for a project
- [run](/reference/commands/run): runs the models in a project
- [run-operation](/reference/commands/run-operation): invoke a macro, including running arbitrary maintenance SQL against the database
- [seed](/reference/commands/seed): loads CSV files into the database
- [show](/reference/commands/show): preview table rows post-transformation
- [snapshot](/reference/commands/snapshot): executes "snapshot" jobs defined in a project
- [source](/reference/commands/source): provides tools for working with source data (including validating that sources are "fresh")
- [test](/reference/commands/test): executes tests defined in a project

</TabItem>

<TabItem value="cli" label="Available commands in the CLI">

Use the following dbt commands in the [CLI](/docs/core/about-the-cli)

- [build](/reference/commands/build): build and test all selected resources (models, seeds, snapshots, tests)
- [clean](/reference/commands/clean): deletes artifacts present in the dbt project
- [compile](/reference/commands/compile): compiles (but does not run) the models in a project
- [debug](/reference/commands/debug): debugs dbt connections and projects
- [deps](/reference/commands/deps): downloads dependencies for a project
- [docs](/reference/commands/cmd-docs) : generates documentation for a project
- [init](/reference/commands/init): initializes a new dbt project
- [list](/reference/commands/list): lists resources defined in a dbt project
- [parse](/reference/commands/parse): parses a project and writes detailed timing info
- [rpc](/reference/commands/rpc): runs an RPC server that clients can submit queries to
- [run](/reference/commands/run): runs the models in a project
- [run-operation](/reference/commands/run-operation): invoke a macro, including running arbitrary maintenance SQL against the database
- [seed](/reference/commands/seed): loads CSV files into the database
- [show](/reference/commands/show): preview table rows post-transformation
- [snapshot](/reference/commands/snapshot): executes "snapshot" jobs defined in a project
- [source](/reference/commands/commands/source): provides tools for working with source data (including validating that sources are "fresh")
- [test](/reference/commands/commands/test): executes tests defined in a project

</TabItem>

</Tabs>
