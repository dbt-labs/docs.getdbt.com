---
title: "dbt Command reference"
---

dbt is typically run one of two ways:
* In [dbt Cloud](/docs/cloud/develop-in-the-cloud)
* On the [command line interface](/docs/core/about-the-cli) (CLI)

The following sections outline the commands supported by dbt and their relevant flags. Note that some commands are only supported when using the CLI.

For information about selecting models on the command line, consult the docs on [Model selection syntax](/reference/node-selection/syntax).

**Available commands:**

- [build](/reference/commands/build): build and test all selected resources (models, seeds, snapshots, tests)
- [clean](/reference/commands/clean) (CLI only): deletes artifacts present in the dbt project
- [compile](/reference/commands/compile): compiles (but does not run) the models in a project
- [debug](/reference/dbt-jinja-functions/debug-method) (CLI only): debugs dbt connections and projects
- [deps](/reference/commands/deps): downloads dependencies for a project
- [docs](/reference/commands/cmd-docs) : generates documentation for a project
- [init](/reference/commands/init) (CLI only): initializes a new dbt project
- [list](/reference/commands/list) (CLI only): lists resources defined in a dbt project
- [parse](/reference/commands/parse) (CLI only): parses a project and writes detailed timing info
- [run](/reference/commands/run): runs the models in a project
- [seed](/reference/commands/seed): loads CSV files into the database
- [snapshot](/reference/commands/snapshot): executes "snapshot" jobs defined in a project
- [source](/reference/commands/source): provides tools for working with source data (including validating that sources are "fresh")
- [test](/reference/commands/test): executes tests defined in a project
- [rpc](/reference/commands/rpc) (CLI only): runs an RPC server that clients can submit queries to
- [run-operation](/reference/commands/run-operation): runs arbitrary maintenance SQL against the database

