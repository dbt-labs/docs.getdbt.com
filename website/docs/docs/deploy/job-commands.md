---
title: "Job commands"
id: "job-commands"
description: "Use dbt commands to set tasks for your dbt Cloud jobs."
---

A dbt Cloud job is a set of commands and configurations that help run it on a schedule and carry out a project task. A job will generally include the following:

- Job name that can understood by yourself or peers,
- Set of guidelines, like dbt version or number of [threads](/docs/get-started/connection-profiles#understanding-threads),
- Optional job-level [environmental variables](/docs/build/environment-variables),
- Available [dbt command](/reference/dbt-commands) list, including [built-in commands](#built-in-commands),
- Option to defer to a [deployment environment](/docs/collaborate/environments/dbt-cloud-environments#types-of-environments),
- Job triggers like an optional schedule, continuous integration, and API.

# Command steps

The commands steps are dbt commands - add link where the tasks are described that the job will carry out. The commands allowed in the steps are - list allowed commands

## Built-in commands

Every invocation will include a `dbt deps` and it is not necessary to include it. 

## Checkbox commands

- Make sure to talk about docs generate + freshness per https://github.com/dbt-labs/docs.getdbt.com/pull/2575/files

## Behavior of multiple commands

dbt Cloud allows adding as many steps as necessary, with at least one command [todo: is there a limit?]. 
 add screenshot of multiple steps

At runtime, the commands are “chained” together - if one of the commands in the chain fails, then the subsequent ones are not executed. This is dictated by the [exit code](https://docs.getdbt.com/reference/exit-codes) of the command. It is quite similar to doing `dbt run --select first && dbt run --select second` in a Unix command line. The second command will only run if the first one succeeds. 

Diagram with example:

- step 1 ✅
- step 2 ✅
- step 3 👎 - fails
- step 4 🚫 - skipped
- step 5 🚫 - skipped

(entire job is considered “failed” )

## Specific commands and their failures

Failures mean different things for different commands

### dbt run

A dbt run will fail if there is an error materializing any of the models built

If a select matches multiple nodes, and one of the nodes fails, then it’s exit code 1 and doesn’t continue to the next command. If the —fail-fast flag [[link](https://docs.getdbt.com/reference/global-configs#failing-fast)] is specified then the first failure will stop the entire pipeline 

- todo what is the exit code for a partial fail?

Tests on upstream resources will block downstream resources from running, and a test failure will cause those downstream resources to skip entirely

### dbt test

A test can pass, fail or warn depending on its configuration - add link 

Only an error will prevent the next step from going forward

### dbt build

how does this work exactly?

https://docs.getdbt.com/reference/commands/build

### Note on Selectors Selectors

Selectors - add link are powerful ways to select portions of your project to be executed. If a selector does not match any models, it will not constitute a failure

## Others

Run slots vs threads: threads vs jobs; run concurrency — ask @Sara Leon about where this should live, she’s got thoughts!