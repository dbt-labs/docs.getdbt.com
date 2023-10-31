---
title: Productionizing your dbt Databricks project
id: "productionizing-your-dbt-databricks-project"
sidebar_label: "Productionizing your dbt Databricks project"
description: "Learn how to deliver models to end users and use best practices to maintain production data" 
---


Welcome to the third installment of our comprehensive series on optimizing and deploying your data pipelines using Databricks and dbt Cloud. In this guide, we'll dive into delivering these models to end users while incorporating best practices to ensure that your production data remains reliable and timely.

## Prerequisites

If you don't have any of the following requirements, refer to the instructions in the [setup guide](/guides/dbt-ecosystem/databricks-guides/how-to-set-up-your-databricks-dbt-project) to catch up:

- You have [set up your Databricks and dbt Cloud environments](/guides/dbt-ecosystem/databricks-guides/how-to-set-up-your-databricks-dbt-project).
- You have [optimized your dbt models for peak performance](/guides/dbt-ecosystem/databricks-guides/how_to_optimize_dbt_models_on_databricks).
- You have created two catalogs in Databricks: *dev* and *prod*.
- You have created  Databricks Service Principal to run your production jobs.
- You have at least one [deployment environment](/docs/deploy/deploy-environments) in dbt Cloud.

To get started, let's revisit the deployment environment created for your production data.

### Deployment environments

In software engineering, environments play a crucial role in allowing engineers to develop and test code without affecting the end users of their software. Similarly, you can design [data lakehouses](https://www.databricks.com/product/data-lakehouse) with separate environments. The _production_ environment includes the relations (schemas, tables, and views) that end users query or use, typically in a BI tool or ML model.

In dbt Cloud, [environments](/docs/dbt-cloud-environments) come in two flavors:

- Deployment &mdash; Defines the settings used for executing jobs created within that environment.
- Development &mdash; Determine the settings used in the dbt Cloud IDE for a particular dbt Cloud project. 

Each dbt Cloud project can have multiple deployment environments, but only one development environment per user.

## Create and schedule a production job

With your deployment environment set up, it's time to create a production job to run in your *prod* environment.

To deploy our data transformation workflows, we will utilize [dbt Cloud’s built-in job scheduler](/docs/deploy/deploy-jobs). The job scheduler is designed specifically to streamline your dbt project deployments and runs, ensuring that your data pipelines are easy to create, monitor, and modify efficiently.

Leveraging dbt Cloud's job scheduler allows data teams to own the entire transformation workflow. You don't need to learn and maintain additional tools for orchestration or rely on another team to schedule code written by your team. This end-to-end ownership simplifies the deployment process and accelerates the delivery of new data products.

Let’s [create a job](/docs/deploy/deploy-jobs#create-and-schedule-jobs) in dbt Cloud that will transform data in our Databricks *prod* catalog.

1. Create a new job by clicking **Deploy** in the header, click **Jobs** and then **Create job**.
2. **Name** the job “Daily refresh”.
3. Set the **Environment** to your *production* environment.
    - This will allow the job to inherit the catalog, schema, credentials, and environment variables defined in the [setup guide](https://docs.getdbt.com/guides/dbt-ecosystem/databricks-guides/how-to-set-up-your-databricks-dbt-project#defining-your-dbt-deployment-environment).
4. Under **Execution Settings**
    - Check the **Generate docs on run** checkbox to configure the job to automatically generate project docs each time this job runs. This will ensure your documentation stays evergreen as models are added and modified.
    - Select the **Run on source freshness** checkbox to configure dbt [source freshness](/docs/deploy/source-freshness) as the first step of this job. Your sources will need to be configured to [snapshot freshness information](/docs/build/sources#snapshotting-source-data-freshness) for this to drive meaningful insights.
    
    Add the following three **Commands:**
    - `dbt source freshness`
        - This will check if any sources are stale. We don’t want to recompute models with data that hasn’t changed since our last run.
    - `dbt test --models source:*`
        - This will test the data quality our source data, such as checking making sure ID fields are unique and not null. We don’t want bad data getting into production models.
    - `dbt build --exclude source:* --fail-fast`
        - dbt build is more efficient than issuing separate commands for dbt run and dbt test separately because it will run then test each model before continuing.
        - We are excluding source data because we already tested it in step 2.
        - The fail-fast flag will make dbt exit immediately if a single resource fails to build. If other models are in-progress when the first model fails, then dbt will terminate the connections for these still-running models.
5. Under **Triggers**, use the toggle to configure your job to [run on a schedule](/docs/deploy/deploy-jobs#schedule-days). You can enter specific days and timing or create a custom cron schedule. 
    - If you want your dbt Cloud job scheduled by another orchestrator, like Databricks Workflows, see the [Advanced Considerations](#advanced-considerations) section below.

This is just one example of an all-or-nothing command list designed to minimize wasted computing. The [job command list](/docs/deploy/job-commands) and [selectors](/reference/node-selection/syntax) provide a lot of flexibility on how your DAG will execute. You may want to design yours to continue running certain models if others fail. You may want to set up multiple jobs to refresh models at different frequencies. See our [Job Creation Best Practices discourse](https://discourse.getdbt.com/t/job-creation-best-practices-in-dbt-cloud-feat-my-moms-lasagna/2980) for more job design suggestions.

After your job is set up and runs successfully, configure your **[project artifacts](/docs/deploy/artifacts)** to make this job inform your production docs site and data sources dashboard that can be reached from the UI.

This will be our main production job to refresh data that will be used by end users. Another job everyone should include in their dbt project is a continuous integration job.

### Add a CI job

CI/CD, or Continuous Integration and Continuous Deployment/Delivery, has become a standard practice in software development for rapidly delivering new features and bug fixes while maintaining high quality and stability. dbt Cloud enables you to apply these practices to your data transformations.

The steps below show how to create a CI test for your dbt project. CD in dbt Cloud requires no additional steps, as your jobs will automatically pick up the latest changes from the branch assigned to the environment your job is running in. You may choose to add steps depending on your deployment strategy. If you want to dive deeper into CD options, check out [this blog on adopting CI/CD with dbt Cloud](https://www.getdbt.com/blog/adopting-ci-cd-with-dbt-cloud/).

dbt allows you to write [tests](/docs/build/tests) for your data pipeline, which can be run at every step of the process to ensure the stability and correctness of your data transformations. The main places you’ll use your dbt tests are:

1. **Daily runs:** Regularly running tests on your data pipeline helps catch issues caused by bad source data, ensuring the quality of data that reaches your users.
2. **Development**: Running tests during development ensures that your code changes do not break existing assumptions, enabling developers to iterate faster by catching problems immediately after writing code.
3. **CI checks**: Automated CI jobs run and test your pipeline end-to end when a pull request is created, providing confidence to developers, code reviewers, and end users that the proposed changes are reliable and will not cause disruptions or data quality issues

Your CI job will ensure that the models build properly and pass any tests applied to them. We recommend creating a separate *test* environment and having a dedicated service principal. This will ensure the temporary schemas created during CI tests are in their own catalog and cannot unintentionally expose data to other users. Repeat the [steps](/guides/dbt-ecosystem/databricks-guides/how-to-set-up-your-databricks-dbt-project) used to create your *prod* environment to create a *test* environment. After setup, you should have:

- A catalog called *test*
- A service principal called *dbt_test_sp*
- A new dbt Cloud environment called *test* that defaults to the *test* catalog and uses the *dbt_test_sp* token in the deployment credentials

We recommend setting up a dbt Cloud CI job. This will decrease the job’s runtime by running and testing only modified models, which also reduces compute spend on the lakehouse. To create a CI job, refer to [Set up CI jobs](/docs/deploy/ci-jobs) for details.

With dbt tests and SlimCI, you can feel confident that your production data will be timely and accurate even while delivering at high velocity.

### Monitor your jobs

Keeping a close eye on your dbt Cloud jobs is crucial for maintaining a robust and efficient data pipeline. By monitoring job performance and quickly identifying potential issues, you can ensure that your data transformations run smoothly. dbt Cloud provides three entry points to monitor the health of your project: run history, deployment monitor, and status tiles.

The [run history](/docs/deploy/run-visibility#run-history) dashboard in dbt Cloud provides a detailed view of all your project's job runs, offering various filters to help you focus on specific aspects. This is an excellent tool for developers who want to check recent runs, verify overnight results, or track the progress of running jobs. To access it, select **Run History** from the **Deploy** menu.

The deployment monitor in dbt Cloud offers a higher-level view of your run history, enabling you to gauge the health of your data pipeline over an extended period of time. This feature includes information on run durations and success rates, allowing you to identify trends in job performance, such as increasing run times or more frequent failures. The deployment monitor also highlights jobs in progress, queued, and recent failures. To access the deployment monitor click on the dbt logo in the top left corner of the dbt Cloud UI.

<Lightbox src="/img/guides/databricks-guides/deployment_monitor_dbx.png" width="85%" title="The Deployment Monitor Shows Job Status Over Time Across Environments" />

By adding [status tiles](/docs/deploy/dashboard-status-tiles) to your BI dashboards, you can give stakeholders visibility into the health of your data pipeline without leaving their preferred interface. Status tiles instill confidence in your data and help prevent unnecessary inquiries or context switching. To implement dashboard status tiles, you'll need to have dbt docs with [exposures](/docs/build/exposures) defined.

### Notifications

Setting up [notifications](/docs/deploy/job-notifications) in dbt Cloud allows you to receive alerts via email or a Slack channel whenever a run ends. This ensures that the appropriate teams are notified and can take action promptly when jobs fail or are canceled. To set up notifications:

1. Navigate to your dbt Cloud project settings.
2. Select the **Notifications** tab.
3. Choose the desired notification type (Email or Slack) and configure the relevant settings.

If you require notifications through other means than email or Slack, you can use dbt Cloud's outbound [webhooks](/docs/deploy/webhooks) feature to relay job events to other tools. Webhooks enable you to [integrate dbt Cloud with a wide range of SaaS applications](/guides/orchestration/webhooks), extending your pipeline’s automation into other systems.

### Troubleshooting

When a disruption occurs in your production pipeline, it's essential to know how to troubleshoot issues effectively to minimize downtime and maintain a high degree of trust with your stakeholders.

The five key steps for troubleshooting dbt Cloud issues are:

1. Read the error message: dbt error messages usually indicate the error type and the file where the issue occurred.
2. Inspect the problematic file and look for an immediate fix.
3. Isolate the problem by running one model at a time in the IDE or undoing the code that caused the issue.
4. Check for problems in compiled files and logs.

Consult the [Debugging errors documentation](/best-practices/debugging-errors) for a comprehensive list of error types and diagnostic methods.

To troubleshoot issues with a dbt Cloud job, navigate to the "Deploy > Run History" tab in your dbt Cloud project and select the failed run. Then, expand the run steps to view [console and debug logs](/docs/deploy/run-visibility#access-logs) to review the detailed log messages. To obtain additional information, open the Artifacts tab and download the compiled files associated with the run.

If your jobs are taking longer than expected, use the [model timing](/docs/deploy/run-visibility#model-timing) dashboard to identify bottlenecks in your pipeline. Analyzing the time taken for each model execution helps you pinpoint the slowest components and optimize them for better performance. The Databricks [Query History](https://docs.databricks.com/sql/admin/query-history.html) lets you inspect granular details such as time spent in each task, rows returned, I/O performance, and execution plan.

For more on performance tuning, see our guide on [How to Optimize and Troubleshoot dbt Models on Databricks](/guides/dbt-ecosystem/databricks-guides/how_to_optimize_dbt_models_on_databricks).

## Advanced considerations

As you become more experienced with dbt Cloud and Databricks, you might want to explore advanced techniques to further enhance your data pipeline and improve the way you manage your data transformations. The topics in this section are not requirements but will help you harden your production environment for greater security, efficiency, and accessibility.

### Refreshing your data with Databricks Workflows

The dbt Cloud job scheduler offers several ways to trigger your jobs. If your dbt transformations are just one step of a larger orchestration workflow, use the dbt Cloud API to trigger your job from Databricks Workflows.

This is a common pattern for analytics use cases that want to minimize latency between ingesting bronze data into the lakehouse with a notebook, transforming that data into gold tables with dbt, and refreshing a dashboard. It is also useful for data science teams who use dbt for feature extraction before using the updated feature store to train and register machine learning models with MLflow.

The API enables integration between your dbt Cloud jobs and the Databricks workflow, ensuring that your data transformations are effectively managed within the broader context of your data processing pipeline.

Inserting dbt Cloud jobs into a Databricks Workflows allows you to chain together external tasks while still leveraging these benefits of dbt Cloud:

- UI Context: The dbt Cloud UI enables you to define the job within the context of your dbt Cloud environments, making it easier to create and manage relevant configs.
- Logs and Run History: Accessing logs and run history becomes more convenient when using dbt Cloud.
- Monitoring and Notification Features: dbt Cloud comes equipped with monitoring and notification features like the ones described above that can help you stay informed about the status and performance of your jobs.

To trigger your dbt Cloud job from Databricks, follow the instructions in our [Databricks Workflows to run dbt Cloud jobs guide](/guides/orchestration/how-to-use-databricks-workflows-to-run-dbt-cloud-jobs).

### Data masking

Our [Best Practices for dbt and Unity Catalog](/guides/dbt-ecosystem/databricks-guides/dbt-unity-catalog-best-practices) guide recommends using separate catalogs *dev* and *prod* for development and deployment environments, with Unity Catalog and dbt Cloud handling configurations and permissions for environment isolation. Ensuring security while maintaining efficiency in your development and deployment environments is crucial. Additional security measures may be necessary to protect sensitive data, such as personally identifiable information (PII).

Databricks leverages [Dynamic Views](https://docs.databricks.com/data-governance/unity-catalog/create-views.html#create-a-dynamic-view) to enable data masking based on group membership. Because views in Unity Catalog use Spark SQL, you can implement advanced data masking by using more complex SQL expressions and regular expressions. You can now also apply fine grained access controls like row filters in preview and column masks in preview on tables in Databricks Unity Catalog, which will be the recommended approach to protect sensitive data once this goes GA. Additionally, in the near term, Databricks Unity Catalog will also enable Attribute Based Access Control natively, which will make protecting sensitive data at scale simpler.

To implement data masking in a dbt model, ensure the model materialization configuration is set to view. Next, add a case statement using the is_account_group_member function to identify groups permitted to view plain text values. Then, use regex to mask data for all other users. For example:

```sql
CASE
WHEN is_account_group_member('auditors') THEN email
ELSE regexp_extract(email, '^.*@(.*)$', 1)
END
```

It is recommended not to grant users the ability to read tables and views referenced in the dynamic view. Instead, assign your dbt sources to dynamic views rather than raw data, allowing developers to run end-to-end builds and source freshness commands securely.

Using the same sources for development and deployment environments enables testing with the same volumes and frequency you will see in production. However, this may cause development runs to take longer than necessary. To address this issue, consider using the Jinja variable target.name to [limit data when working in the development environment](/reference/dbt-jinja-functions/target#use-targetname-to-limit-data-in-dev).

## Pairing dbt Docs and Unity Catalog

Though there are similarities between dbt docs and Databricks Unity Catalog, they are ultimately used for different purposes and complement each other well. By combining their strengths, you can provide your organization with a robust and user-friendly data management ecosystem.

dbt docs is a documentation site generated from your dbt project that provides an interface for developers and non-technical stakeholders to understand the data lineage and business logic applied to transformations without requiring full access to dbt Cloud or Databricks. It gives you additional options on how you can organize and search for your data. You can automatically [build and view your dbt docs using dbt Cloud](/docs/collaborate/build-and-view-your-docs) to keep the documentation evergreen.

Unity Catalog is a unified governance solution for your lakehouse. It provides a data explorer that can be used for discovery of datasets that have not been defined in dbt. The data explorer also captures [column-level lineage](https://docs.databricks.com/data-governance/unity-catalog/data-lineage.html#capture-and-explore-lineage),  when you need to trace the lineage of a specific column.

To get the most out of both tools, you can use the [persist docs config](/reference/resource-configs/persist_docs) to push table and column descriptions written in dbt into Unity Catalog, making the information easily accessible to both tools' users. Keeping the descriptions in dbt ensures they are version controlled and can be reproduced after a table is dropped.

## Additional resources

- [Advanced deployments course](https://courses.getdbt.com/courses/advanced-deployment) if you want a deeper dive into these topics
- [Autoscaling CI: The intelligent Slim CI](https://docs.getdbt.com/blog/intelligent-slim-ci)
- [Trigger a dbt Cloud Job in your automated workflow with Python](https://discourse.getdbt.com/t/triggering-a-dbt-cloud-job-in-your-automated-workflow-with-python/2573)
- [Databricks + dbt Cloud Quickstart Guide](/guides/databricks)
- Reach out to your Databricks account team to get access to preview features on Databricks.
