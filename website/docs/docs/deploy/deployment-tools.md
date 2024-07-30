---
title: "Integrate with other orchestration tools"
id: "deployment-tools"
sidebar_label: "Integrate with other tools"
pagination_next: null
---

Alongside [dbt Cloud](/docs/deploy/jobs), discover other ways to schedule and run your dbt jobs with the help of tools such as the ones described on this page.

Build and install these tools to automate your data workflows, trigger dbt jobs (including those hosted on dbt Cloud), and enjoy a hassle-free experience, saving time and increasing efficiency.

## Airflow

If your organization uses [Airflow](https://airflow.apache.org/), there are a number of ways you can run your dbt jobs, including:

<Tabs>

<TabItem value="airflowcloud" label="dbt Cloud">

Installing the [dbt Cloud Provider](https://airflow.apache.org/docs/apache-airflow-providers-dbt-cloud/stable/index.html) to orchestrate dbt Cloud jobs. This package contains multiple Hooks, Operators, and Sensors to complete various actions within dbt Cloud.

<Lightbox src="/img/docs/running-a-dbt-project/airflow_dbt_connector.png" title="Airflow DAG using DbtCloudRunJobOperator"/>
<Lightbox src="/img/docs/running-a-dbt-project/dbt_cloud_airflow_trigger.png" title="dbt Cloud job triggered by Airflow"/>

</TabItem>

<TabItem value="airflowcore" label="dbt Core">

Invoking dbt Core jobs through the [BashOperator](https://registry.astronomer.io/providers/apache-airflow/modules/bashoperator). In this case, be sure to install dbt into a virtual environment to avoid issues with conflicting dependencies between Airflow and dbt.

</TabItem>
</Tabs>

For more details on both of these methods, including example implementations, check out [this guide](https://docs.astronomer.io/learn/airflow-dbt-cloud).

## Automation servers

Automation servers (such as CodeDeploy, GitLab CI/CD ([video](https://youtu.be/-XBIIY2pFpc?t=1301)), Bamboo and Jenkins) can be used to schedule bash commands for dbt. They also provide a UI to view logging to the command line, and integrate with your git repository.

## Azure Data Factory

Integrate dbt Cloud and [Azure Data Factory](https://learn.microsoft.com/en-us/azure/data-factory/) (ADF) for a smooth data process from data ingestion to data transformation. You can seamlessly trigger dbt Cloud jobs upon completion of ingestion jobs by using the [dbt API](/docs/dbt-cloud-apis/overview) in ADF.


The following video provides you with a detailed overview of how to trigger a dbt Cloud job via the API in Azure Data Factory.

<LoomVideo id="8dcc1d22a0bf43a1b89ecc6f6b6d0b18" /> 


To use the dbt API to trigger a job in dbt Cloud through ADF:

1. In dbt Cloud, go to the job settings of the daily production job and turn off the scheduled run in the **Trigger** section.
2. You'll want to create a pipeline in ADF to trigger a dbt Cloud job.
3. Securely fetch the dbt Cloud service token from a key vault in ADF, using a web call as the first step in the pipeline.
4. Set the parameters in the pipeline, including the dbt Cloud account ID and  job ID, as well as the name of the key vault and secret that contains the service token. 
    * You can find the dbt Cloud job and account id in the URL, for example, if your URL is `https://YOUR_ACCESS_URL/deploy/88888/projects/678910/jobs/123456`, the account ID is 88888 and the job ID is 123456
5. Trigger the pipeline in ADF to start the dbt Cloud job and monitor the status of the dbt Cloud job in ADF.
6. In dbt Cloud, you can check the status of the job and how it was triggered in dbt Cloud.

## Cron

Cron is a decent way to schedule bash commands. However, while it may seem like an easy route to schedule a job, writing code to take care of all of the additional features associated with a production deployment often makes this route more complex compared to other options listed here.

## Dagster

If your organization uses [Dagster](https://dagster.io/), you can use the [dagster_dbt](https://docs.dagster.io/_apidocs/libraries/dagster-dbt) library to integrate dbt commands into your pipelines. This library supports the execution of dbt through dbt Cloud or dbt Core. Running dbt from Dagster automatically aggregates metadata about your dbt runs. Refer to the [example pipeline](https://dagster.io/blog/dagster-dbt) for details.

## Databricks workflows 

Use Databricks workflows to call the dbt Cloud job API, which has several benefits such as integration with other ETL processes, utilizing dbt Cloud job features, separation of concerns, and custom job triggering based on custom conditions or logic. These advantages lead to more modularity, efficient debugging, and flexibility in scheduling dbt Cloud jobs.

For more info, refer to the guide on [Databricks workflows and dbt Cloud jobs](/guides/how-to-use-databricks-workflows-to-run-dbt-cloud-jobs).

## Kestra

If your organization uses [Kestra](http://kestra.io/), you can leverage the [dbt plugin](https://kestra.io/plugins/plugin-dbt) to orchestrate dbt Cloud and dbt Core jobs. Kestra's user interface (UI) has built-in [Blueprints](https://kestra.io/docs/user-interface-guide/blueprints), providing ready-to-use workflows. Navigate to the Blueprints page in the left navigation menu and [select the dbt tag](https://demo.kestra.io/ui/blueprints/community?selectedTag=36) to find several examples of scheduling dbt Core commands and dbt Cloud jobs as part of your data pipelines. After each scheduled or ad-hoc workflow execution, the Outputs tab in the Kestra UI allows you to download and preview all dbt build artifacts. The Gantt and Topology view additionally render the metadata to visualize dependencies and runtimes of your dbt models and tests. The dbt Cloud task provides convenient links to easily navigate between Kestra and dbt Cloud UI.

## Orchestra

If your organization uses [Orchestra](https://getorchestra.io), you can trigger dbt jobs using the dbt Cloud API. Create an API token from your dbt Cloud account and use this to authenticate Orchestra in the [Orchestra Portal](https://app.getorchestra.io). For details, refer to the [Orchestra docs on dbt Cloud](https://orchestra-1.gitbook.io/orchestra-portal/integrations/transformation/dbt-cloud).

Orchestra automatically collects metadata from your runs so you can view your dbt jobs in the context of the rest of your data stack.

The following is an example of the run details in dbt Cloud for a job triggered by Orchestra:

<Lightbox src="/img/docs/running-a-dbt-project/dbt_cloud_orchestra_trigger.png" title="Example of Orchestra triggering a dbt job"/>

The following is an example of viewing lineage in Orchestra for dbt jobs:

<Lightbox src="/img/docs/running-a-dbt-project/orchestra_lineage_dbt_cloud.png" title="Example of a lineage view for dbt jobs in Orchestra"/>


## Prefect

If your organization uses [Prefect](https://www.prefect.io/), the way you will run your jobs depends on the dbt version you're on, and whether you're orchestrating dbt Cloud or dbt Core jobs. Refer to the following variety of options:

<Lightbox src="/img/docs/running-a-dbt-project/prefect_dag_dbt_cloud.jpg" width="75%" title="Prefect DAG using a dbt Cloud job run flow"/> 


### Prefect 2

<Tabs>

<TabItem value="prefect2cloud" label="dbt Cloud">

- Use the [trigger_dbt_cloud_job_run_and_wait_for_completion](https://prefecthq.github.io/prefect-dbt/cloud/jobs/#prefect_dbt.cloud.jobs.trigger_dbt_cloud_job_run_and_wait_for_completion) flow. 
- As jobs are executing, you can poll dbt to see whether or not the job completes without failures, through the [Prefect user interface (UI)](https://docs.prefect.io/ui/overview/).


<Lightbox src="/img/docs/running-a-dbt-project/dbt_cloud_job_prefect.jpg" title="dbt Cloud job triggered by Prefect"/> 

</TabItem>

<TabItem value="prefect2core" label="dbt Core">

- Use the [trigger_dbt_cli_command](https://prefecthq.github.io/prefect-dbt/cli/commands/#prefect_dbt.cli.commands.trigger_dbt_cli_command) task. 
- For details on both of these methods, see [prefect-dbt docs](https://prefecthq.github.io/prefect-dbt/).

</TabItem>
</Tabs>


### Prefect 1

<Tabs>

<TabItem value="prefect1cloud" label="dbt Cloud">

- Trigger dbt Cloud jobs with the [DbtCloudRunJob](https://docs.prefect.io/api/latest/tasks/dbt.html#dbtcloudrunjob) task. 
- Running this task will generate a markdown artifact viewable in the Prefect UI. 
- The artifact will contain links to the dbt artifacts generated as a result of the job run.

</TabItem>

<TabItem value="prefect1core" label="dbt Core">

- Use the [DbtShellTask](https://docs.prefect.io/api/latest/tasks/dbt.html#dbtshelltask) to schedule, execute, and monitor your dbt runs. 
- Use the supported [ShellTask](https://docs.prefect.io/api/latest/tasks/shell.html#shelltask) to execute dbt commands through the shell.


</TabItem>
</Tabs>


## Related docs

- [dbt Cloud plans and pricing](https://www.getdbt.com/pricing/)
- [Quickstart guides](/guides)
- [Webhooks for your jobs](/docs/deploy/webhooks)
- [Orchestration guides](https://docs.getdbt.com/guides/orchestration)
- [Commands for your production deployment](https://discourse.getdbt.com/t/what-are-the-dbt-commands-you-run-in-your-production-deployment-of-dbt/366)
