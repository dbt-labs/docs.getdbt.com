---
title: "dbt Command reference"
---

dbt is typically run one of two ways:
* In [dbt Cloud](the-dbt-ide)
* On the command line

The following sections outline the commands supported by dbt and their relevant flags. Note that some commands are only supported when using the CLI.

For information about selecting models on the command line, consult the docs on [Model selection syntax](model-selection-syntax).

**Available commands:**

- [debug](debug) (CLI only): debugs dbt connections and projects
- [init](init) (CLI only): initializes a new dbt project
- [compile](compile): compiles (but does not run) the models in a project
- [run](commands/run): runs the models in a project
- [test](commands/test): executes tests defined in a project
- [deps](deps): downloads dependencies for a project
- [snapshot](snapshot): executes "snapshot" jobs defined in a project
- [clean](clean): deletes artifacts present in the dbt project
- [seed](seed): loads CSV files into the database
- [docs](cmd-docs) (CLI only): generates documentation for a project
- [source](commands/source): provides tools for working with source data (including validating that sources are "fresh")
- [run-operation](run-operation): runs arbitrary maintenance SQL against the database
- [rpc](rpc) (CLI only): runs an RPC server that clients can submit queries to
- [list](list) (CLI only): lists resources defined in a dbt project
