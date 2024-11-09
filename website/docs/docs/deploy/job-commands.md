---
title: "Job commands"
id: "job-commands"
description: "How to use dbt commands to set tasks for your dbt Cloud jobs."
---

A dbt Cloud production job allows you to set up a system to run a dbt job and job commands on a schedule, rather than running dbt commands manually from the command line or [IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud). A job consists of commands that are "chained" together and executed as run steps. Each run step can succeed or fail, which may determine the job's run status (Success, Cancel, or Error). 

Each job allows you to:

- Configure job commands
- View job run details, including timing, artifacts, and detailed run steps
- Access logs to view or help debug issues and historical invocations of dbt
- Set up notifications, and [more](/docs/deploy/deployments#dbt-cloud)

## Job command types

Job commands are specific tasks executed by the job, and you can configure them seamlessly by either adding [dbt commands](/reference/dbt-commands) or using the checkbox option in the **Commands** section. 

During a job run, the commands are "chained" together and executed as run steps. When you add a dbt command in the **Commands** section, you can expect different outcomes compared to the checkbox option.

<Lightbox src ="/img/docs/dbt-cloud/using-dbt-cloud/job-commands.gif" width="85%" title="Configuring checkbox and commands list"/>


### Built-in commands

Every job invocation automatically includes the [`dbt deps`](/reference/commands/deps) command, meaning you don't need to add it to the **Commands** list in your job settings.  You will also notice every job will include a run step to reclone your repository and connect to your data platform, which can affect your job status if these run steps aren't successful.

**Job outcome** &mdash; During a job run, the built-in commands are "chained" together.  This means if one of the run steps in the chain fails, then the next commands aren't executed, and the entire job fails with an "Error" job status.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/fail-dbtdeps.png" width="85%" title="A failed job that had an error during the dbt deps run step."/>

### Checkbox commands

For every job, you have the option to select the [Generate docs on run](/docs/collaborate/build-and-view-your-docs) or [Run source freshness](/docs/deploy/source-freshness) checkboxes, enabling you to run the commands automatically. 

**Job outcome Generate docs on run checkbox** &mdash; dbt Cloud executes the `dbt docs generate` command, _after_ the listed commands. If that particular run step in your job fails, the job can still succeed if all subsequent run steps are successful. Read [Set up documentation job](/docs/collaborate/build-and-view-your-docs) for more info.

**Job outcome Source freshness checkbox** &mdash; dbt Cloud executes the `dbt source freshness` command as the first run step in your job. If that particular run step in your job fails, the job can still succeed if all subsequent run steps are successful. Read [Source freshness](/docs/deploy/source-freshness) for more info.

### Command list

You can add or remove as many dbt commands as necessary for every job. However, you need to have at least one dbt command. There are few commands listed as "dbt Cloud CLI" or "dbt Core" in the [dbt Command reference page](/reference/dbt-commands) page. This means they are meant for use in dbt Core or dbt Cloud CLI, and not in dbt Cloud IDE.


:::tip Using selectors

Use [selectors](/reference/node-selection/syntax) as a powerful way to select and execute portions of your project in a job run. For example, to run tests for one_specific_model, use the selector: `dbt test --select one_specific_model`. The job will still run if a selector doesn't match any models. 

:::

**Job outcome** &mdash; During a job run, the commands are "chained" together and executed as run steps. If one of the run steps in the chain fails, then the subsequent steps aren't executed, and the job will fail.

In the following example image, the first four run steps are successful. However, if the fifth run step (`dbt run --select state:modified+ --full-refresh --fail-fast`) fails, then the next run steps aren't executed, and the entire job fails. The failed job returns a non-zero [exit code](/reference/exit-codes) and "Error" job status:

<Lightbox src ="/img/docs/dbt-cloud/using-dbt-cloud/skipped-jobs.jpg" width="85%" title="A failed job run that had an error during a run step"/>

## Job command failures

Job command failures can mean different things for different commands. Some common reasons why a job command may fail:

- **Failure at`dbt run`** &mdash; [`dbt run`](/reference/commands/run) executes compiled SQL model files against the current target database. It will fail if there is an error in any of the built models. Tests on upstream resources prevent downstream resources from running and a failed test will skip them.

- **Failure at `dbt test`** &mdash;  [`dbt test`](/reference/commands/test) runs tests defined on models, sources, snapshots, and seeds. A test can pass, fail, or warn depending on its [severity](/reference/resource-configs/severity). Unless you set [warnings as errors](/reference/global-configs/warnings), only an error stops the next step. 

- **Failure at `dbt build`** &mdash; [`dbt build`](/reference/commands/build) runs models, tests, snapshots, and seeds. This command executes resources in the DAG-specified order. If any upstream resource fails, all downstream resources are skipped, and the command exits with an error code of 1.

- **Selector failures**
   - If a [`select`](/reference/node-selection/set-operators) matches multiple nodes and one of the nodes fails, then the job will have an exit code `1` and the subsequent command will fail. If you specified the [`—fail-fast`](/reference/global-configs/failing-fast) flag, then the first failure will stop the entire connection for any models that are in progress. 

   - If a selector doesn't match any nodes, it's not considered a failure.


## Related docs
- [Job creation best practices](https://discourse.getdbt.com/t/job-creation-best-practices-in-dbt-cloud-feat-my-moms-lasagna/2980)
- [dbt Command reference](/reference/dbt-commands)
- [Job notifications](/docs/deploy/job-notifications)
- [Source freshness](/docs/deploy/source-freshness)
- [Build and view your docs](/docs/collaborate/build-and-view-your-docs)
