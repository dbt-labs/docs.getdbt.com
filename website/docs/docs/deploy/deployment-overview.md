---
title: "About deployments"
id: "deployments"
---

Running dbt in production means setting up a system to run a _dbt job on a schedule_, rather than running dbt commands manually from the command line. Your production dbt jobs should create the tables and <Term id="view">views</Term> that your business intelligence tools and end users query. Before continuing, make sure you understand dbt's approach to [managing environments](/docs/collaborate/environments).

In addition to setting up a schedule, there are other considerations when setting up dbt to run in production:

* The complexity involved in creating a new dbt job or editing an existing one.
* Setting up notifications if a step within your job returns an error code (for example, a model can't be built or a test fails).
* Accessing logs to help debug any issues.
* Pulling the latest version of your git repo before running dbt (continuous deployment).
* Running your dbt project before merging code into master (continuous integration).
* Allowing access for team members that need to collaborate on your dbt project.

## Run dbt in production

If you want to run dbt jobs on a schedule, you can use tools such as dbt Cloud, Airflow, Prefect, Dagster, automation server, or Cron.

## dbt Cloud

We've built dbt Cloud to empower data teams to easily run dbt in production. If you're interested in trying out dbt Cloud, you can [sign up for an account](https://cloud.getdbt.com/signup/).

dbt Cloud enables you to:
- run your jobs on a schedule
- view logs for any historical invocation of dbt
- configure error notifications
- render your project's documentation

In general, the dbt Cloud application deployment models fall into two categories: **Multi Tenant** and **Single Tenant**. These deployments are hosted on infrastructure managed by dbt Labs. Both models leverage AWS infrastructure as described in the [Architecture](/docs/deploy/architecture) section.

For more information on these deployment models, refer to:

- [Multi Tenant](/docs/deploy/multi-tenant)
- [Single Tenant](/docs/deploy/single-tenant)

If you’re interested in learning more about an Enterprise plan, please [contact us](mailto:sales@getdbt.com).

## Airflow

If your organization is using [Airflow](https://airflow.apache.org/), there are a number of ways you can run your dbt jobs, including:

* Installing the [dbt Cloud Provider](https://registry.astronomer.io/providers/dbt-cloud) to orchestrate dbt Cloud jobs. This package contains multiple Hooks, Operators, and Sensors to complete various actions within dbt Cloud.

<Lightbox src="/img/docs/running-a-dbt-project/airflow_dbt_connector.png" title="Airflow DAG using DbtCloudRunJobOperator"/>
<Lightbox src="/img/docs/running-a-dbt-project/dbt_cloud_airflow_trigger.png" title="dbt Cloud job triggered by Airflow"/>

* Invoking dbt Core jobs through the [BashOperator](https://registry.astronomer.io/providers/apache-airflow/modules/bashoperator). In this case, be sure to install dbt into a virtual environment to avoid issues with conflicting dependencies between Airflow and dbt.

For more details on both of these methods, including example implementations, check out [this guide](https://www.astronomer.io/guides/airflow-dbt).

## Prefect

If your organization is using [Prefect](https://www.prefect.io), use the [DbtShellTask](https://docs.prefect.io/api/latest/tasks/dbt.html#dbtshelltask) to schedule, execute and monitor your dbt runs.

Alternatively, you can use the supported [ShellTask](https://docs.prefect.io/api/latest/tasks/shell.html#shelltask) to execute dbt commands through the shell.

You can also trigger dbt Cloud jobs with the [DbtCloudRunJob](https://docs.prefect.io/api/latest/tasks/dbt.html#dbtcloudrunjob) task. Running this task will generate a markdown artifact viewable in the Prefect UI. The artifact will contain links to the dbt artifacts generate as a result of the job run.

## Dagster

If your organization is using [Dagster](https://dagster.io/), you can use the [dagster_dbt](https://docs.dagster.io/_apidocs/libraries/dagster-dbt) library to integrate dbt commands into your pipelines. This library supports the execution of dbt through dbt Cloud, dbt CLI and the dbt RPC server. Running dbt from Dagster automatically aggregates metadata about your dbt runs. Check out the [example pipeline](https://dagster.io/blog/dagster-dbt) for details.

## Automation servers

Automation servers, like CodeDeploy, GitLab CI/CD ([video](https://youtu.be/-XBIIY2pFpc?t=1301)), Bamboo and Jenkins, can be used to schedule bash commands for dbt. They also provide a UI to view logging to the command line, and integrate with your git repository.

## Cron

Cron is a decent way to schedule bash commands. However, while it may seem like an easy route to schedule a job, writing code to take care of all of the additional features associated with a production deployment often makes this route more complex compared to other options listed here.

## Related docs
- [What are the dbt commands you run in your production deployment of dbt?](https://discourse.getdbt.com/t/what-are-the-dbt-commands-you-run-in-your-production-deployment-of-dbt/366)
