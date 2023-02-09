---
title: "Job commands"
id: "job-commands"
description: "Use dbt commands to set tasks for your dbt Cloud jobs."
---

A dbt Cloud job is a set of commands and configurations that help you to run it on a schedule and carry out a project task. A job will generally include the following:

- Job name understood by yourself or peers
- Set of guidelines, like dbt version or number of [threads](/docs/get-started/connection-profiles#understanding-threads)
- Optional job-level [environmental variables](/docs/build/environment-variables)
- Configurable [dbt commands](/reference/dbt-commands), including [built-in commands](#commands)
- Option to defer to a [deployment environment](/docs/collaborate/environments/dbt-cloud-environments#types-of-environments)
- Job triggers, like an optional schedule, continuous integration, and API

## Type of Commands

Commands are specific tasks you set in your dbt Cloud jobs. You can configure [certain dbt commands](/reference/dbt-commands), which are executed by the job.  dbt Cloud jobs also come with built-in commands. 

- **Built-in commands** &mdash; Every job invocation includes [`dbt deps`](/reference/commands/deps), meaning you don't need to add it to the **Commands** list in your job settings. `dbt deps` pulls the most recent version of the dependencies listed in your packages.yml from git.

- **Checkbox commands** &mdash; Every job includes the option to select the [**Generate docs on run**](/docs/collaborate/build-and-view-your-docs) or [**Run on source freshness**](/docs/deploy/source-freshness) checkboxes. These enable you to generate project docs or enable source freshness automatically. 

<Lightbox src ="/img/docs/dbt-cloud/using-dbt-cloud/job-commands.gif" title="Configuring checkbox and commands list"/>

## How Commands interact

When you configure your job under **Commands**, you can add as many dbt commands as necessary, with at least one command listed. 

During a job run, the commands are “chained” together. This means if one of the commands in the chain fails, then the next ones are not executed. This is dictated by the [exit code](https://docs.getdbt.com/reference/exit-codes) of the command. It is quite similar to doing `dbt run --select first && dbt run --select second` in a Unix command line. The second command will only run if the first one succeeds. 

Diagram with example:

- step 1 ✅
- step 2 ✅
- step 3 👎 - fails
- step 4 🚫 - skipped
- step 5 🚫 - skipped

(entire job is considered “failed” )

## Command troubleshooting

Failures mean different things for different commands

- **`dbt run`** &mdash; A dbt run will fail if there is an error materializing any of the models built. If a select matches multiple nodes, and one of the nodes fails, then it’s exit code 1 and doesn’t continue to the next command. If the —fail-fast flag [[link](https://docs.getdbt.com/reference/global-configs#failing-fast)] is specified then the first failure will stop the entire pipeline 

Todo what is the exit code for a partial fail?

Tests on upstream resources will block downstream resources from running, and a test failure will cause those downstream resources to skip entirely

- **`dbt test`** &mdash; A test can pass, fail or warn depending on its configuration - add link  Only an error will prevent the next step from going forward

- **`dbt build`** &mdash; how does this work exactly? https://docs.getdbt.com/reference/commands/build

### Note on selectors

Selectors - add link are powerful ways to select portions of your project to be executed. If a selector does not match any models, it will not constitute a failure

## Others

Run slots vs threads: threads vs jobs; run concurrency — ask Sara Leon about where this should live, she’s got thoughts!