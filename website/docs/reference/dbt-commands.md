---
title: "dbt Command reference"
---

dbt is typically run one of two ways:
* In [dbt Cloud](/docs/get-started/develop-in-the-cloud)
* On the command line

The following sections outline the commands supported by dbt and their relevant flags. Note that some commands are only supported when using the CLI.

For information about selecting models on the command line, consult the docs on [Model selection syntax](node-selection/syntax).

**Available commands:**

- [build](build): build and test all selected resources (models, seeds, snapshots, tests)
- [clean](clean) (CLI only): deletes artifacts present in the dbt project
- [compile](compile): compiles (but does not run) the models in a project
- [debug](debug) (CLI only): debugs dbt connections and projects
- [deps](deps): downloads dependencies for a project
- [docs](cmd-docs) : generates documentation for a project
- [init](init) (CLI only): initializes a new dbt project
- [list](list) (CLI only): lists resources defined in a dbt project
- [parse](parse) (CLI only): parses a project and writes detailed timing info
- [run](run): runs the models in a project
- [seed](seed): loads CSV files into the database
- [snapshot](snapshot): executes "snapshot" jobs defined in a project
- [source](commands/source): provides tools for working with source data (including validating that sources are "fresh")
- [test](commands/test): executes tests defined in a project
- [rpc](rpc) (CLI only): runs an RPC server that clients can submit queries to
- [run-operation](run-operation): runs arbitrary maintenance SQL against the database

