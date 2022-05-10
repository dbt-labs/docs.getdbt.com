---
title: "Running dbt in Production"
id: "running-dbt-in-production"
---

## What does running dbt in production mean?
Running dbt in production simply means **setting up a system to run a dbt job on a schedule**, rather than running dbt commands manually from the command line. These production dbt jobs should create the tables and <Term id="view">views</Term> that your business intelligence tools and end users query. Before continuing, make sure you understand dbt's approach to [managing environments](managing-environments).

:::info dbt commands in production

We've written a guide for the dbt commands we run in production, over on [Discourse](https://discourse.getdbt.com/t/what-are-the-dbt-commands-you-run-in-your-production-deployment-of-dbt/366).

:::

As well as setting up a schedule, there are a number of other things you should consider when setting up dbt to run in production, such as:
* The complexity involved in creating a new dbt job, or editing an existing one.
* Setting up notifications if a step within your job returns an error code (e.g. a model cannot be built, or a test fails).
* Accessing logs to help debug any issues.
* Pulling the latest version of your git repo before running dbt (i.e. continuous deployment).
* Running your dbt project before merging code into master (i.e. continuous integration).
* Allowing access for team members that need to collaborate on your dbt project.

## Ways to run dbt in production
### Using dbt Cloud
We've built [dbt Cloud](https://www.getdbt.com/signup/) from the ground up to empower data teams to easily run dbt in production. With dbt Cloud, you can:
- run your jobs on a schedule
- view logs for any historical invocation of dbt
- configure error notifications
- render your project's documentation

If you're interested in giving dbt Cloud a spin, you can sign up for a *forever free* account [here](https://cloud.getdbt.com/signup/).

<Lightbox src="/img/docs/running-a-dbt-project/8e7a6eb-cloud-img.png" title="dbt Cloud in action"/>

### Using Airflow
If your organization is using [Airflow](https://airflow.apache.org/), there are a number of ways you can run your dbt jobs, including:

* Installing the [dbt Cloud Provider](https://registry.astronomer.io/providers/dbt-cloud) to orchestrate dbt Cloud jobs. This package contains multiple Hooks, Operators, and Sensors to complete various actions within dbt Cloud. See an [example airflow DAG](https://registry.astronomer.io/dags/example-dbt-cloud) to get started!

<Lightbox src="/img/docs/running-a-dbt-project/airflow_dbt_connector.png" title="Airflow DAG using DbtCloudRunJobOperator"/>
<Lightbox src="/img/docs/running-a-dbt-project/dbt_cloud_airflow_trigger.png" title="dbt Cloud job triggered by Airflow"/>

* Invoking dbt Core jobs through the [BashOperator](https://registry.astronomer.io/providers/apache-airflow/modules/bashoperator). In this case, be sure to install dbt into a virtual environment to avoid issues with conflicting dependencies between Airflow and dbt.

For more details on both of these methods, including example implementations, check out [this guide](https://www.astronomer.io/guides/airflow-dbt).

### Using Prefect
If your organization is using [Prefect](https://www.prefect.io), use the [DbtShellTask](https://docs.prefect.io/api/latest/tasks/dbt.html#dbtshelltask) to schedule, execute and monitor your dbt runs.

Alternatively, you can use the supported [ShellTask](https://docs.prefect.io/api/latest/tasks/shell.html#shelltask) to execute dbt commands through the shell.

You can also trigger dbt Cloud jobs with the [DbtCloudRunJob](https://docs.prefect.io/api/latest/tasks/dbt.html#dbtcloudrunjob) task. Running this task will generate a markdown artifact viewable in the Prefect UI. The artifact will contain links to the dbt artifacts generate as a result of the job run.

### Using Dagster
If your organization is using [Dagster](https://dagster.io/), you can use the [dagster_dbt](https://docs.dagster.io/_apidocs/libraries/dagster-dbt) library to integrate dbt commands into your pipelines. Execution through both the dbt CLI and the dbt RPC server is supported, and metadata from dbt runs is automatically aggregated. Check out the [example pipeline](https://dagster.io/blog/dagster-dbt) for details.

### Using an automation server
Automation servers, like CodeDeploy, GitLab CI/CD ([video](https://youtu.be/-XBIIY2pFpc?t=1301)), Bamboo and Jenkins, can be used to schedule bash commands for dbt. They also provide a UI to view logging to the command line, and integrate with your git repository.

### Using cron
Cron is a decent way to schedule bash commands. However, while it may seem like an easy route to schedule a job, writing code to take care of all of the additional features associated with a production deployment often makes this route more complex compared to other options listed here.
