---
title: "Configure jobs"
id: "configure-jobs"
description: "An overview of jobs and how to use dbt commands to set tasks for your dbt Cloud jobs."
---

A dbt Cloud job is a set of commands and configurations that help you to run it on a schedule and carry out a project task. A job will generally include the following:

- Job name understood by yourself or peers
- Set of guidelines, like dbt version, target name, number of [threads](/docs/get-started/connection-profiles#understanding-threads)
- Optional job-level [environmental variables](/docs/build/environment-variables)
- Configurable [dbt commands](/reference/dbt-commands), including [built-in commands](#command-types)
- Option to defer to a [deployment environment](/docs/collaborate/environments/dbt-cloud-environments#types-of-environments)
- Job triggers, like an optional schedule, [continuous integration](/docs/deploy/cloud-ci-job), and [API](/docs/dbt-cloud-apis/overview)

## Prerequisites

To successfully configure a job, you'll need to have the following:

- Active dbt Cloud account and project connected to a [data platform](/docs/get-started/connect-your-database) and [git provider](/docs/collaborate/git/connect-github)
- [Access permission](/docs/collaborate/manage-access/about-access) to create, edit, and run jobs
- A [deployment environment](/docs/collaborate/environments/dbt-cloud-environments#create-a-deployment-environment), which determines the settings for the executed job(s)

## Configure a job

Jobs are a set of dbt commands that you want to run on a schedule. For example, dbt run and dbt test.

After creating your deployment environment, you should be directed to the page for new environment. If not, select Deploy in the upper left, then click Jobs.
Click Create one and provide a name, for example "Production run", and link to the Environment you just created.
Scroll down to "Execution Settings" and select Generate docs on run.
Under "Commands," add these commands as part of your job if you don't see them:
dbt run
dbt test
For this exercise, do NOT set a schedule for your project to run -- while your organization's project should run regularly, there's no need to run this project on a schedule.
Select Save, then click Run now to run your job.
Click the run and watch its progress under "Run history."




## Command types

Commands are specific tasks you set in your dbt Cloud jobs.  Jobs come with built-in commands and you can also configure [certain dbt commands](/reference/dbt-commands), which are executed by the job. 

- **Built-in commands** &mdash; Every job invocation includes [`dbt deps`](/reference/commands/deps), meaning you don't need to add it to the **Commands** list in your job settings. `dbt deps` pulls the most recent version of the dependencies listed in your packages.yml from git.

- **Checkbox commands** &mdash; Every job includes the option to select the [**Generate docs on run**](/docs/collaborate/build-and-view-your-docs) or [**Run on source freshness**](/docs/deploy/source-freshness) checkboxes. These enable you to generate project docs or enable source freshness automatically. 

- **Commands list** &mdash; Every job gives you the option to configure and add [dbt commands](/reference/dbt-commands), under the **Execution Settings** --> **Commands** section of the job settings.  You need to have at least one dbt command and can add as many as necessary.

    USe [selectors](/reference/node-selection/syntax) as a powerful way to select and execute portions of your project in a job run. If a selector doesn't match any models, the job run won't consider it a failure. For example, to run tests for one_specific_model, use the selector: `dbt test --select one_specific_model`

     - IF THE SELECTOR DOESN'T MATCH NODES, WILL IT BE CONSIDERED? CANCELLED? CAN YOU PROVIDE AN EXAMPLE? NEED MORE INFO


<Lightbox src ="/img/docs/dbt-cloud/using-dbt-cloud/job-commands.gif" title="Configuring checkbox and commands list"/>

## How commands interact

During a job run, the commands are “chained” together. This means if one of the commands in the chain fails, then the next ones aren't executed. 

For example:

- `dbt command 1` ✅
- `dbt command 2` ✅
- `dbt command 3` ❌ - fails
- `dbt command 4` 🚫 - skipped
- `dbt command 5` 🚫 - skipped

In this example, if `dbt command 3` fails, then the subsequent commands aren't executed, and the entire job fails. The failed job returns an [exit code](https://docs.getdbt.com/reference/exit-codes) and "Error" job status. 

## Troubleshooting

Job failures can mean different things for different commands. Here are some reasons why a job may fail:

- **`dbt run` fail** &mdash; [`dbt run`](/reference/commands/run) executes compiled sql model files against the current target database. It will fail if there is an error in any of the built models. 

    * If a [`select`](/reference/node-selection/set-operators) matches multiple nodes and one of the nodes fails, then the job will have an exit code `1` and the subsequent command will fail. If you specified the [`—fail-fast`](/reference/global-configs#failing-fast) flag, then the first failure will stop the entire connection for any models that are in-progress. 

    * TODO what is the exit code for a partial fail?

    * Tests on upstream resources prevent downstream resources from running and a failed test will skip them.

- **`dbt test` fail** &mdash; [`dbt test`](/reference/commands/test) runs tests defined on models, sources, snapshots, and seeds. A test can pass, fail, or warn depending on its [configuration](/reference/test-configs). Only an error stops the next step.

- **`dbt build` fail** &mdash; [`dbt build`](/reference/commands/build) runs models, tests, snapshots, and seeds. NEED MORE INFO ON THIS - what info do you want to convey?

