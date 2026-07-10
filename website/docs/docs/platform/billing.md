---
title: "Billing"
id: billing 
description: "dbt billing information." 
sidebar_label: Billing
pagination_next: null
pagination_prev: null
---

<Constant name="dbt" /> offers a variety of [plans and pricing](https://www.getdbt.com/pricing/) to fit your organization’s needs. With flexible billing options that appeal to large enterprises and small businesses and [server availability](/docs/platform/about-platform/access-regions-ip-addresses) worldwide, <Constant name="dbt_platform" /> is the fastest and easiest way to begin transforming your data.

## How does dbt pricing work?

As a customer, you pay for the number of seats you have and the amount of usage consumed each month.  Seats are billed primarily on the amount of Developer and Read licenses purchased. 

Usage is based on the number of [Successful Models Built](#what-counts-as-a-successful-model-built) and, if purchased and used, <Constant name="semantic_layer" /> [Queried Metrics](#what-counts-as-a-queried-metric) subject to reasonable usage. All billing computations are conducted in Coordinated Universal Time (UTC).

### What counts as a seat license?
You can learn more about allocating users to your account in [Users and licenses](/docs/platform/manage-access/seats-and-users).
There are four types of possible seat licenses:
* **Analyst**\* &mdash; for permission sets assigned and shared amongst those who don't need day-to-day access.
* **Developer** &mdash; for permission sets that require day-to-day interaction with the <Constant name="dbt_platform" />.
* **IT** &mdash; for access to specific features related to account management (for example, configuring git integration).
* **Read-Only** &mdash; for access to view certain documents and reports.

\* The [Analyst license type](/docs/platform/manage-access/about-user-access?version=1.12#licenses) is not available for new purchase.

### What counts as a Successful Model Built?

A Successful Model Built is any <Term id="model">model</Term> successfully built in a <Constant name="dbt" /> deployment environment through <Constant name="dbt" />’s orchestration. This includes jobs run via the scheduler, CI builds (triggered by pull requests), and runs kicked off via the <Constant name="dbt" /> API. Models that build successfully are counted even if the overall run later fails. For example, if a job containing 100 models fails after 51 are built, only those 51 are counted.

Any models built in a <Constant name="dbt" /> development environment (for example, via the <Constant name="studio_ide" />) do not count towards your usage. Tests, seeds, ephemeral models, and snapshots also do not count. 

When a dynamic table is initially created, the model is counted (if the creation is successful). However, in subsequent runs, dbt skips these models unless the definition of the dynamic table has changed. This refers not to changes in the SQL logic but to changes in dbt's logic, specifically those governed by [`on_configuration_change config`](/reference/resource-configs/on_configuration_change)). The dynamic table continues to update on a cadence because the adapter is orchestrating that refresh rather than <Constant name="dbt" />. 


| What counts towards Successful Models Built |                     |
|---------------------------------------------|---------------------|
| View                                        | ✅                  |
| Table                                       | ✅                  |
| Incremental                                 | ✅                  |
| Ephemeral Models                            | ❌                  |
| Tests                                       | ❌                  |
| Seeds                                       | ❌                  |
| Snapshots                                   | ❌                  |

### What counts as a Queried Metric?

The <Constant name="semantic_layer" />, powered by MetricFlow, measures usage in distinct Queried Metrics.

- Every successful request you make to render or run SQL to the <Constant name="semantic_layer" /> API counts as at least one queried metric, even if no data is returned. 
- If the query calculates or renders SQL for multiple metrics, each calculated metric will be counted as a queried metric.
- If a request to run a query is not executed successfully in the data platform or if a query results in an error without completion, it is not counted as a queried metric. 
- Requests for metadata from the <Constant name="semantic_layer" /> are also not counted as queried metrics.

Examples of queried metrics include:

- Querying one metric, grouping by one or more dimensions → 1 queried metric

  ```shell
  dbt sl query --metrics revenue --group-by metric_time
  ```

- Querying two metrics, grouping by two dimensions → 2 queried metrics

  ```shell
  dbt sl query --metrics revenue,gross_sales --group-by metric_time,user__country
  ```

Compiling metrics counts the same way — one queried metric per metric compiled (for example, `dbt sl query --metrics revenue --compile` → 1 queried metric).

### Viewing usage in the product 

Viewing usage in the product is restricted to specific roles:

* Starter plan &mdash; Owner group
* Enterprise and Enterprise+ plans &mdash; Account and billing admin roles

If you have access to the **Billing** and **Usage** pages in **Account settings**, you can see an estimate of the month's usage, how your account tracks against it, and which projects are building the most models.

<Lightbox src="/img/docs/building-a-dbt-project/billing-usage-page.jpg" width="80%" title="To view account-level estimated usage, go to 'Account settings' and then select 'Billing'."/>

As a Starter and Developer plan user, you can see how the account is tracking against the included models built. As an Enterprise plan user, you can see how much you have drawn down from your annual commit and how much remains.

On each **Project home** page, any user with project access can see how many models are built each month, with top jobs by models built available on each **Environment** page.

<Lightbox src="/img/docs/building-a-dbt-project/billing-project-page.jpg" width="80%" title="Your Project home page displays how many models are built each month."/>

The **Job details** page's **Insights** tab shows models built per month for that job and which take longest to build. 

<Lightbox src="/img/docs/building-a-dbt-project/billing-job-page.jpg" width="80%" title="View how many models are being built per month for a particular job by going to the 'Insights' tab in the 'Job details' page."/>

Usage data shown in <Constant name="dbt" /> is only an estimate and may be delayed, and some visualizations aren't available on legacy plans. Your final monthly usage appears on your monthly statements (Starter and Enterprise-tier plans).

## dbt State usage

[dbt state](/docs/deploy/dbt-state-about) enables dbt to reuse nodes by cloning from another location or skipping a rebuild when the logic and data haven't changed.

### About free trial

Eligible new organizations receive 30 days of free use with no usage limit. After the free period, a credit card or enterprise contract (for dbt platform managed plans) is required to continue.

### dbt State pricing

dbt State is a separate, usage-based product available to dbt Core, dbt platform, and dbt Fusion engine users.

### Cancellation

Usage is tracked through your cancellation date. You're billed at month end for usage incurred before cancellation and not charged for usage after.

### Daily active target tables

For purposes of pricing, daily active target tables (DATT) are measured as the number of distinct target tables (as defined below) for which dbt State performs at least one of the following unique operations on a given day (based on UTC time): a skip, clone, or test reuse.

A target table is a database object managed by your dbt project for a given database and schema name. It includes seeds, snapshots, dbt models (including incremental models). It also includes each distinct test (even if the tests are not built into the database because `store_failures` is disabled). For example, if `stg_customers` has `not_null` and `unique` tests on its `id` column, that's three target tables: the model and its two tests.

When you run `dbt build` or a similar command, a target table is selected for execution. It counts as an active target table if dbt State is able to reuse it based on your configuration rules. All reuses of the same active target table in a single day (based on UTC time) are counted as a single daily active target table (DATT).

### Monthly cost calculation

dbt State cost per billing period is the unit price multiplied by the sum of daily active target tables (DATT) across all account users and all days in that billing period. Refer to the [pricing page](https://www.getdbt.com/pricing) for current rates.

## dbt AI: Usage metering and limiting <Lifecycle status="Starter, Enterprise, Enterprise+" />

dbt AI usage is measured based on the number of completed AI requests, known as dbt Copilot actions. Usage limits are enforced to ensure fair access and system performance.

A defined number of dbt Copilot invocations is allocated monthly based on your [subscription plan](https://www.getdbt.com/pricing). Once the usage limit is reached, access to dbt AI will be temporarily disabled until the start of the next billing cycle. Pricing and usage are subject to change.

### Usage and metering information 

<Expandable alt_header="AI usage tracking by dbt Copilot actions">

dbt Copilot actions refer to requests made to the dbt Copilot assistant through the <Constant name="dbt" /> interface. These actions are recorded and displayed on the billing page alongside other usage metrics by accessing the **Copilot Actions** tab in the **Billing** page.

The following interactions count as dbt Copilot actions:

- **Each inline generation** &mdash; Every time dbt AI writes or suggests code in your file, it counts toward your usage limit.

- **Each generation of documentation, tests, semantic models, or metrics** &mdash; Any time you ask dbt AI to automatically create things like documentation, tests, data models, or metrics, it counts as one interaction.

- **Each generation within dbt AI chats on <Constant name="canvas" /> or <Constant name="insights" />** &mdash; Any time you use dbt Copilot chat in <Constant name="canvas" /> or <Constant name="insights" /> to generate something, it counts as an interaction.

</Expandable>

<Expandable alt_header="Allowed limits on number of dbt Copilot actions per month per license">

The following table outlines the limits of dbt Copilot actions by plan per month:

<SimpleTable>
|Plan                       |Limit |
|---------------------------|------|
|Developer                  | ❌   |
|Starter*                   |100   |
|Enterprise                 |5,000 |
|Enterpise+                 |10,000|
</SimpleTable>

*Team plan customers who enrolled in dbt Copilot Beta prior to March 19, 2025 have access to dbt Copilot. All other legacy Team plan customers must move to the [Starter plan or above](https://www.getdbt.com/pricing) to get access. 

</Expandable>

<Expandable alt_header="Notifications when limitations are reached ">

When usage limits are reached, a notification appears in the UI. Additionally, an email notification is sent to the designated recipient. 

For users on the Starter plan, the account owner receives an email notification when the usage limit is reached. 

For users enrolled on the Enterprise and Enterprise+ plans, both the billing administrator and the account administrator are notified by email when the usage limit is reached.

Once usage limits are reached, attempts to perform an action in dbt Copilot triggers a banner notification indicating that the limit has been exceeded.

Under Bring Your Own Key (BYOK), usage is not tracked by dbt AI and is subject to your OpenAI limits.

</Expandable>

### Viewing usage in the product

To view the usage in your account:

1. Navigate to [**Account settings**](/docs/platform/account-settings).

2. Select **Billing** under the Settings header.
3. On the billing page, click the **Copilot Actions** tab to view your usage.

<Lightbox src="/img/docs/dbt-platform/view-usage-in-copilot.gif" title="View usage in dbt Copilot" />


## Plans and billing

<Constant name="dbt" /> offers several [plans](https://www.getdbt.com/pricing) with different features that meet your needs. We may make changes to our plan details from time to time. We'll always let you know in advance, so you can be prepared. The following section explains how billing works in each plan.

### Developer plan billing

Developer plans are free and include one Developer license and 3,000 models each month. Models are refreshed at the beginning of each calendar month. If you exceed 3,000 models, any subsequent runs will be canceled until models are refreshed or until you upgrade to a paid plan. The rest of the <Constant name="dbt" /> platform is still accessible, and no work will be lost.

Included model entitlements may differ from what's shown here, depending on the terms when you signed up.

### Starter plan billing 

Starter customers pay monthly via credit card for seats and usage, and accounts include 15,000 models monthly. Seats are charged upfront at the beginning of the month. If you add seats during the month, seats will be prorated and charged on the same day. Seats removed during the month will be reflected on the next invoice and are not eligible for refunds. You can change the credit card information and the number of seats from the billings section anytime. Accounts will receive one monthly invoice that includes the upfront charge for the seats and the usage charged in arrears from the previous month.

Usage is calculated and charged in arrears for the previous month. If you exceed 15,000 models in any month, you will be billed for additional usage on your next invoice. Additional usage is billed at the rates on our [pricing page](https://www.getdbt.com/pricing). 


Included models that are not consumed do not roll over to future months.

Included model entitlements may differ from what's shown here, depending on the terms when you signed up.

### Enterprise plan billing

As an Enterprise customer, you pay annually via invoice, monthly in arrears for additional usage (if applicable), and may benefit from negotiated usage rates. Please refer to your order form or contract for your specific pricing details, or [contact the account team](https://www.getdbt.com/contact-demo) with any questions. 

Enterprise plan billing information is not available in the <Constant name="dbt" /> UI.  Changes are handled through your dbt Labs Solutions Architect or account team manager.

### Legacy plans

Customers who purchased the <Constant name="dbt" /> Starter plan (formerly Team) plan before August 11, 2023, remain on a legacy pricing plan as long as your account is in good standing. The legacy pricing plan is based on seats and includes unlimited models, subject to reasonable use. 

:::note Legacy <Constant name="semantic_layer" />

For customers using the legacy <Constant name="semantic_layer" /> with dbt_metrics package, this product will be deprecated in December 2023. Legacy users may choose to upgrade at any time to the revamped version, <Constant name="semantic_layer" /> powered by MetricFlow. The revamped version is available to most customers (see [prerequisites](/guides/sl-snowflake-qs#prerequisites)) for a limited time on a free trial basis, subject to reasonable use.

:::

dbt Labs may institute use limits if reasonable use is exceeded. Additional features, upgrades, or updates may be subject to separate charges. Any changes to your current plan pricing will be communicated in advance according to our Terms of Use.


## Managing usage

From <Constant name="dbt" />, click on your account name in the left side menu and select **Account settings**. The **Billing** option will be on the left side menu under the **Settings** heading. Here, you can view individual available plans and the features provided for each. 

### Usage notifications 

Every plan automatically sends email alerts when 75%, 90%, and 100% of usage estimates have been reached.
- Starter plan &mdash; All users within the Owner group receive alerts. 
- Enterprise-tier plans &mdash; All users with the Account Admin and Billing Admin [permission sets](/docs/platform/manage-access/enterprise-permissions#permission-sets) receive alerts. 

Users cannot opt out of these emails. To have additional users to receive these alert emails, assign them the applicable permissions mentioned earlier. Note that your usage may already be higher than the percentage indicated in the alert due to your usage pattern and minor latency times.

### How do I stop usage from accruing?

There are 2 options to disable models from being built and charged:

1. Open the **Job Settings** of every job and navigate to the **Triggers** section. Disable the **Run on Schedule** and set the **Continuous Integration** feature **Run on Pull Requests?**  to **No**. Check your workflows to ensure that you are not triggering any runs via the <Constant name="dbt" /> API. This option will enable you to keep your <Constant name="dbt" /> jobs without building more models. 
2. Alternatively, you can delete some or all of your <Constant name="dbt" /> jobs. This will ensure that no runs are kicked off, but you will permanently lose your job(s). 

## Optimize costs in dbt

<Constant name="dbt" /> offers ways to optimize your model’s built usage and warehouse costs. 

### Best practices for optimizing cost with dbt State

#### Use `lag_tolerance` to reduce unnecessary model execution

You can save even more time and compute by defining how old your data can be before a model should be triggered. We’ve introduced lag_tolerance so that you can do things like differentiate local development needs vs prod. 

For example:

<File name="dbt_project.yml">

```yaml
models:
  +state:
    lag_tolerance: "{{ '4h' if target.name == 'prod' else '7d' }}"
```

</File>

In this example, models in the `prod` target rebuild only when upstream data is more than 4 hours old. In all other environments, models wait 7 days before rebuilding.

For more details, refer to the [`lag_tolerance` config reference](/reference/resource-configs/lag-tolerance).

#### Use selectors with `dbt build` to run limited upstream nodes

In development, use [selectors](/reference/node-selection/yaml-selectors) with `dbt build` to limit how many upstream nodes run. Nodes that are not selected can be [deferred](/reference/node-selection/defer) instead of rebuilt, which avoids extra dbt State activity on those targets. Automatic `state:modified` selection in development may be supported in a future release.

#### Avoid conditional materializations

Avoid conditional materialization patterns such as `table` in production and `view` in development for the same model. Different materializations between environments can prevent dbt State from matching targets correctly and reduce skip/clone effectiveness.

### Best practices for optimizing successful models built

You can reduce costs from successful models built while still following best practices. Combine the approaches below to fit your needs. If you exclude views from your scheduled job runs, set up a [merge job](#exclude-views-while-running-tests) to deploy updated view logic when changes are detected.

#### Exclude views in a dbt job

Many <Constant name="dbt" /> users utilize views, which don’t always need to be rebuilt every time you run a job. For any jobs that contain views that _do not_ include macros that dynamically generate code (for example, case statements) based on upstream tables and also _do not_ have tests, you can implement these steps:

1. Go to your current production deployment job in <Constant name="dbt" />.
2. Modify your command to include: `--exclude config.materialized:view`.
3. Save your job changes.

If you have views that contain macros with case statements based on upstream tables, these will need to be run each time to account for new values. If you still need to test your views with each run, follow the [Exclude views while still running tests](#exclude-views-while-running-tests) best practice to create a custom selector. 

#### Exclude views while running tests

Running tests for views in every job run can help keep data quality intact and save you from the need to rerun failed jobs. To exclude views from your job run while running tests, you can follow these steps to create a custom [selector](/reference/node-selection/yaml-selectors) for your job command. 

1. Open your dbt project in the <Constant name="studio_ide" />.
2. Add a file called `selectors.yml` in your top-level project folder.
3. In the file, add the following code:

   ```yaml 
    selectors:
      - name: skip_views_but_test_views
        description: >
          A default selector that will exclude materializing views
          without skipping tests on views.
        default: true
        definition:
          union:
            - union: 
              - method: path
                value: "*"
              - exclude: 
                - method: config.materialized
                  value: view
            - method: resource_type
              value: test

    ```
    
4. Save the file and commit it to your project.
5. Modify your dbt jobs to include <VersionBlock lastVersion="1.11">`dbt run --selector skip_views_but_test_views`</VersionBlock><VersionBlock firstVersion="1.12">`dbt run --select selector:skip_views_but_test_views`</VersionBlock>.

#### Build only changed views

If you want to ensure that you're building views whenever the logic is changed, create a merge job that gets triggered when code is merged into main: 

1. Ensure you have a [CI job setup](/docs/deploy/ci-jobs) in your environment.
2. Create a new [deploy job](/docs/deploy/deploy-jobs#create-and-schedule-jobs) and call it “Merge Job".
3. Set the  **Environment** to your CI environment. Refer to [Types of environments](/docs/deploy/deploy-environments#types-of-environments) for more details.
4. Set **Commands** to: `dbt run -s state:modified+`.
    Executing `dbt build` in this context is unnecessary because the CI job was used to both run and test the code that just got merged into main.
5. Under the **Execution Settings**, select the default production job to compare changes against:
    - **Defer to a previous run state** &mdash; Select the “Merge Job” you created so the job compares and identifies what has changed since the last merge.
6. Follow [Customizing CI/CD with custom pipelines](/guides/custom-cicd-pipelines) to create a script that triggers the <Constant name="dbt" /> API to run your job after a merge, or watch this [video](https://www.loom.com/share/e7035c61dbed47d2b9b36b5effd5ee78?sid=bcf4dd2e-b249-4e5d-b173-8ca204d9becb).

The merge job immediately deploys PR changes to production and keeps production views current with your codebase while staying cost-efficient. Decide whether this change is right for your dbt project.

### Rework inefficient models

#### Job Insights tab

To reduce warehouse spend, use the **Insights** tab on the **Job** page to find which models take longest to build. The chart shows each model's average run time over its last 20 runs; the slowest models are prime candidates for optimization. 

#### Model Timing tab

To see how long each model takes within a specific run, select that run on the **Run History** page and click the **Model Timing** tab. 

Once you've identified which models could be optimized, check out these other resources that walk through how to optimize your work: 
* [Build scalable and trustworthy data pipelines with dbt and BigQuery](https://services.google.com/fh/files/misc/dbt_bigquery_whitepaper.pdf) 
* [Best Practices for Optimizing Your dbt and Snowflake Deployment](https://www.snowflake.com/wp-content/uploads/2021/10/Best-Practices-for-Optimizing-Your-dbt-and-Snowflake-Deployment.pdf) 
* [How to optimize and troubleshoot dbt models on Databricks](/guides/optimize-dbt-models-on-databricks)

For answers to common plan and billing questions, refer to [Billing FAQs](/docs/platform/billing-faqs).
