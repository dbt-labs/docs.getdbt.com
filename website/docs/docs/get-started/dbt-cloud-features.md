---
title: "About dbt Cloud"
id: "dbt-cloud-features"
---

dbt Cloud is the fastest and most reliable way to deploy dbt. Develop, test, schedule, document, and investigate data models all in one web-based UI. It comes equipped with turnkey support for scheduling jobs, CI/CD, hosting documentation, monitoring & alerting, and an integrated developer environment (IDE). 

dbt Cloud's flexible [plans](https://www.getdbt.com/pricing/) and features make it well-suited for data teams of any size &mdash; sign up for your [free 14 day trial](https://www.getdbt.com/signup/)!

## dbt Cloud IDE

The dbt Cloud integrated development environment (IDE) allows you to build, test, run, and version control your dbt projects directly from your browser. The IDE is the easiest and most efficient way to develop dbt models, allowing you to write, compile, preview and commit your code all in one user-friendly experience - no command line or multiple windows required! Anyone can use the IDE, from new dbt developers to seasoned practitioners.

Learn more about the [dbt Cloud IDE.](/docs/get-started/develop-in-the-cloud)

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/cloud-ide-new.jpg" title="dbt Cloud IDE"/>

## Manage Environments
Set up and manage separate production and development environments in dbt Cloud to help engineers develop and test code more efficiently, without impacting users or data. 

Learn more about [Environments](/docs/collaborate/environments).


## Schedule and run dbt jobs in production

Set up custom schedules to run your production dbt jobs. dbt Cloud's comprehensive scheduling interface makes it possible to schedule jobs by day of the week, time of day, or a recurring interval. 

Decrease operating costs by using webhooks to trigger CI jobs and the API to start jobs from an external orchestrator.

Learn more about [scheduling jobs](/docs/get-started/getting-started/building-your-first-project/schedule-a-job), [API](/docs/dbt-cloud-apis/overview), and [webhooks.](/docs/deploy/cloud-ci-job#using-a-webhook-trigger) 

<Lightbox src="/img/docs/dbt-cloud/overview-job-schedule.gif" title="Scheduling jobs with dbt Cloud"/>

## Host & share documentation

dbt Cloud hosts and authorizes access to dbt project documentation. After enabling documentation for a given job, you can click the "View Documentation" button to see the latest documentation for that job. Because these docs are generated on a schedule, they're always up to date! Simply invite your coworkers to dbt Cloud to share your project's documentation with the rest of your team. 

Learn more about [enabling docs](/docs/collaborate/build-and-view-your-docs) for your jobs.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/viewing-docs.gif" title="Viewing documentation in dbt Cloud"/>

## Notifications

Set up and customize job notifications in dbt Cloud and receive alerts via Email or a chosen Slack channel when a job run succeeds, fails, or is cancelled.

If you enable notifications for dbt Cloud job runs, you can receive a notification when any job run succeeds, fails, or is cancelled. The notification will include the job run name, and the run's status (including successful, failed, and canceled runs). 

Learn more about [job notifications](/docs/deploy/job-notifications).

## Democratize access to logs

dbt Cloud makes it easy to view in-progress and historical logs for your dbt runs. From dbt Cloud, you can view and download the run logs for your dbt invocations. 

<Lightbox src="/img/docs/dbt-cloud/dbt-run-logs.png" title="Viewing logs for a dbt run"/>

## Supports GitHub, GitLab, AzureDevOPs

Seamlessly connect your git account to dbt Cloud and provide another layer of security to dbt Cloud”

- Import new repositories with a couple clicks during dbt Cloud project setup.
- Trigger [Continuous integration](/docs/deploy/cloud-ci-job) builds when pull requests are opened in your git provider.
- Clone repos using HTTPS rather than SSH, and more!

Learn more about our [supported git providers.](/docs/collaborate/git/connect-github)

## Enable Continuous Integration

dbt Cloud can be configured to run your dbt projects in a temporary schema when new commits are pushed to open pull requests. When the Cloud job completes, a status will be shown for the PR inside of GitHub. This build-on-PR functionality is a great way to catch bugs before deploying to production, and an essential tool in any analyst's belt. 

Use dbt Cloud to run Slim CI, which only builds models that were modified in your PR. Slim CI allows you to only run certain portions of your code tree based on the activity of your last job run.

Learn more about [enabling CI workflows](/docs/deploy/cloud-ci-job) and [Slim CI](/docs/deploy/cloud-ci-job#understanding-dbt-cloud-slim-ci) in dbt Cloud.

<Lightbox src="/img/docs/dbt-cloud/813b88c-Screen_Shot_2019-02-08_at_4.54.41_PM.png" title=""/>

## Security

Manage risk with SOC-2 compliance, CI/CD deployment, RBAC, and ELT architecture. 

Refer to our [Security page](https://www.getdbt.com/security/) for more information.

## dbt Semantic Layer
>**📌 Available on [specific plans](https://www.getdbt.com/pricing/)**.


With the dbt Semantic Layer, you can define metrics alongside your dbt models, and query them from any integrated analytics tool. Get the same answers, everywhere, every time.

Definitions like `'revenue'`, `'customer'`, or `'churn` can now be maintained centrally by your team in dbt, and data teams can feel confident that different business units are working from the same metric definitions, regardless of their tool of choice.

Learn more about the [dbt Semantic Layer.](/docs/use-dbt-semantic-layer/dbt-semantic-layer) 

## Metadata API

>**📌 Available on [specific plans](https://www.getdbt.com/pricing/)**.

Use the Metadata API to run ad-hoc queries, browse schema, or query the [dbt Semantic Layer](/docs/use-dbt-semantic-layer/quickstart-semantic-layer). Every time dbt Cloud runs a dbt project, it generates metadata that pertains to the accuracy, recency, configuration, and structure of the [views](https://docs.getdbt.com/terms/view) and tables in the warehouse. dbt Cloud serves a [GraphQL API](https://metadata.cloud.getdbt.com/graphiql), where you can run ad-hoc queries or browse the schema. 

Learn more about the [Metadata API](/docs/dbt-cloud-apis/metadata-api).

## Model timing dashboard

>**📌 Available for multi-tenant Enterprise and Team [plans](https://www.getdbt.com/pricing/)**.

The Model timing dashboard displays the model composition, order, and run time for every job run in dbt Cloud. You can access the dashboard on the ***Run Overview** page in dbt Cloud. The top 1% of model durations are automatically highlighted for quick reference. This visualization is displayed after the run completes.

This is a very visual way to explore your run and surface model bottlenecks. Longest-running models *may* be ripe for further exploration -- which can lead to refactoring or reducing run cadence.

**Considerations:**

The model timing dashboard can only be viewed for jobs that have successfully completed.

<Lightbox src="/img/docs/dbt-cloud/Model-timing-tab.png" title="Model timing tab"/>

## Related questions

<details>
  <summary>How can I contribute to dbt Cloud?</summary>
  <div>
    <div>Anyone can contribute to the dbt project. And whether it's a dbt package, a plugin, dbt-core, or this documentation site, contributing to the open source code that supports the dbt ecosystem is a great way to level yourself up as a developer, and give back to the community. See <a href="https://docs.getdbt.com/community/resources/oss-expectations">Contributing</a> for details on what to expect when contributing to the dbt open source software (OSS). </div>
  </div>
</details>
<details>
  <summary>What type of support is provided with dbt Cloud?</summary>
  <div>
    <div>The global dbt Support team is available to dbt Cloud customers by email or in-product live chat. Developer and Team accounts offer 24x5 support, while Enterprise customers have priority access and options for custom coverage. <br></br><br></br>Additionally, Enterprise plan customers receive implementation assistance, dedicated account management, and a dbt Labs Security and Legal review. <br></br><br></br> If you have project-related or modeling questions, review <a href="https://docs.getdbt.com/docs/dbt-cloud/cloud-dbt-cloud-support">our Support page</a> or <a href="http://getdbt.slack.com/">dbt Community Slack</a> to get help as well. </div>
  </div>
</details>


## Related docs

- [Get started guides](/docs/get-started/getting-started/set-up-dbt-cloud)
- [Run your dbt projects](/docs/get-started/run-your-dbt-projects)
- [Develop in the Cloud](/docs/get-started/develop-in-the-cloud)