---
title: "Configure jobs"
id: "configure-jobs"
description: "An overview of jobs and how to use dbt commands to set tasks for your dbt Cloud jobs."
---

A dbt Cloud job is a set of commands and configurations that help you to run it on a schedule and carry out a project task. When you configure a job, it'll generally include the following:

- A clear job name that's understood by yourself or peers
- Set of guidelines, like dbt version, target name, number of [threads](/docs/get-started/connection-profiles#understanding-threads)
- Optional job-level [environmental variables](/docs/build/environment-variables)
- Configurable [dbt commands](/reference/dbt-commands), including [built-in commands](#job-commands)
- Option to defer to a [deployment environment](/docs/collaborate/environments/dbt-cloud-environments#types-of-environments)
- Job triggers, like an optional schedule, [continuous integration](/docs/deploy/cloud-ci-job), and [API](/docs/dbt-cloud-apis/overview)

## Prerequisites

To successfully configure a job, you'll need to have the following:

- Active dbt Cloud account and project connected to a [data platform](/docs/get-started/connect-your-database) and [git provider](/docs/collaborate/git/connect-github)
- [Access permission](/docs/collaborate/manage-access/about-access) to create, edit, and run jobs
- A [deployment environment](/docs/collaborate/environments/dbt-cloud-environments#create-a-deployment-environment), which determines the settings for the executed job(s)

## Configure a job

Once you create your deployment environment in dbt Cloud, you'll be directed to the new environment page to create a new job. Jobs are a set of dbt commands that you want to run on a schedule to carry out a project task, for example, `dbt run` and `dbt test`.

Review the following steps to create a job:

1. Click **Create One** and then provide a job name, for example "Production run" 

2. Under **Environment**, add the following:
    * **Environment** &mdash; Link to the environment you just created
    * **dbt Version** &mdash; Select the environment version. We recommend the most recent version
    * **Target Name** &mdash; Define the [target name](/docs/build/custom-target-names) for any dbt cloud job to correspond to settings in your project
    * **Threads** &mdash; The default value will be 4 [threads](/docs/get-started/connection-profiles#understanding-threads)


3. Define [environment variables](/docs/build/environment-variables) if you wish to customize the behavior of your project

<Lightbox src ="/img/docs/dbt-cloud/using-dbt-cloud/create-new-job.jpg" title="Configuring your environment job settings"/>

4. Under **Execution Settings**, you can configure the fields needed to execute your job:

    * **Run Timeout** &mdash; Configure the number of seconds a run will execute before it's cancelled by dbt Cloud. Setting this to 0 means it'll never time out runs for that job.   
    * **Defer to a previous run state** &mdash; Select a production job you want to [defer](/docs/deploy/cloud-ci-job#deferral-and-state-comparison) to. This enables dbt Cloud to examine the artifacts from the most recent, successful run of that job and determine new and modified resources. 
    * **Generate docs on run** checkbox &mdash; Configure the job to automatically [generate project docs](/docs/collaborate/build-and-view-your-docs) each time this job runs
    * **Run on source freshness** checkbox &mdash;  Configure [dbt source freshness](/docs/deploy/source-freshness) as the first step of this job, without breaking subsequent steps
    * **Commands** &mdash; Add or remove [commands](#job-commands), which are specific tasks you set in your dbt Cloud jobs

<Lightbox src ="/img/docs/dbt-cloud/using-dbt-cloud/execution-settings.jpg" title="Configuring your execution job settings"/>

5. Under the **Triggers** section, you can configure when and how dbt should trigger the job: 

    * **Schedule** tab &mdash; Use the **Run on schedule** toggle to configure your job to run on scheduled days and time, or enter a [custom cron schedule](/docs/deploy/job-triggers)
    * **Continuous Integration** tab &mdash; Configure [continuous integration (CI)](/docs/deploy/cloud-ci-job) to run when someone opens a new pull request in your dbt repository
    * **API** tab &mdash; Use the [API](/docs/dbt-cloud-apis/overview) to trigger a job or send events to other systems

<Lightbox src ="/img/docs/dbt-cloud/using-dbt-cloud/triggers.jpg" title="Configuring your job triggers"/>

6. Select **Save**, then click **Run Now** to run your job. Click the run and watch its progress under "Run history." You can also view logs for any historical invocation of dbt, configure errors, and view project documentation. 

## Job commands

Commands are specific tasks you set in your dbt Cloud jobs.  Jobs come with built-in commands, however you can also configure them using the checkbox or adding [certain dbt commands](/reference/dbt-commands), which are executed by the job. You can expect different outcomes when adding the command as a run steps compared to selecting a checkbox. 

<Lightbox src ="/img/docs/dbt-cloud/using-dbt-cloud/job-commands.gif" title="Configuring checkbox and commands list"/>

Here is some more details on job commands and the different outcomes:

- **Built-in command** &mdash; Every job invocation includes [`dbt deps`](/reference/commands/deps), meaning you don't need to add it to the **Commands** list in your job settings. `dbt deps` pulls the most recent version of the dependencies listed in your packages.yml from git.

- **Checkbox commands** &mdash; You have the option to select the [**Generate docs on run**](/docs/collaborate/build-and-view-your-docs) or [**Run on source freshness**](/docs/deploy/source-freshness) checkboxes for every job. These checkboxes enable you to generate project docs or enable source freshness automatically. 

- **Commands list** &mdash; You can add or remove [dbt commands](/reference/dbt-commands) for every job.  You need to have at least one dbt command and can add as many as necessary.

    * Use [selectors](/reference/node-selection/syntax) as a powerful way to select and execute portions of your project in a job run. If a selector doesn't match any models, the job run won't consider it a failure. For example, to run tests for one_specific_model, use the selector: `dbt test --select one_specific_model`

     - IF THE SELECTOR DOESN'T MATCH NODES, WILL IT BE CONSIDERED? CANCELLED? CAN YOU PROVIDE AN EXAMPLE? NEED MORE INFO

- **Command outcomes** &mdash; During a job run, the commands are “chained” together. This means if one of the commands in the chain fails, then the next ones aren't executed. In the following example, if the 5th step fails (`dbt run --select state:modified+ --full-refresh --fail-fast`), then the subsequent commands aren't executed, and the entire job fails. The failed job returns an [exit code](https://docs.getdbt.com/reference/exit-codes) and "Error" job status:

    <Lightbox src ="/img/docs/dbt-cloud/using-dbt-cloud/skipped-jobs.jpg" title="An errored dbt Cloud job"/>


## Troubleshooting

Job failures can mean different things for different commands. Here are some reasons why a job may fail:

1. **Failure at`dbt run`** &mdash; [`dbt run`](/reference/commands/run) executes compiled sql model files against the current target database. It will fail if there is an error in any of the built models. 
    - If a [`select`](/reference/node-selection/set-operators) matches multiple nodes and one of the nodes fails, then the job will have an exit code `1` and the subsequent command will fail. If you specified the [`—fail-fast`](/reference/global-configs#failing-fast) flag, then the first failure will stop the entire connection for any models that are in-progress.  
    - Tests on upstream resources prevent downstream resources from running and a failed test will skip them.
    - TODO what is the exit code for a partial fail?

2. **Failure at `dbt test`** &mdash;  [`dbt test`](/reference/commands/test) runs tests defined on models, sources, snapshots, and seeds. A test can pass, fail, or warn depending on its [configuration](/reference/test-configs). Only an error stops the next step. 

3. **Failure at `dbt build`** &mdash; [`dbt build`](/reference/commands/build) runs models, tests, snapshots, and seeds. NEED MORE INFO ON THIS - what info do you want to convey? 