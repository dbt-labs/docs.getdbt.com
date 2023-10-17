--- 
title: "Billing"
id: billing 
description: "dbt Cloud billing information." 
sidebar_label: Billing
pagination_next: null
pagination_prev: null
---

dbt Cloud offers a variety of [plans and pricing](https://www.getdbt.com/pricing/) to fit your organization’s needs. With flexible billing options that appeal to large enterprises and small businesses and [server availability](/docs/cloud/about-cloud/regions-ip-addresses) worldwide, dbt Cloud is the fastest and easiest way to begin transforming your data.

## How does dbt Cloud pricing work?

As a customer, you pay for the number of seats you have and the amount of usage consumed each month. Usage is based on the number of Successful Models Built, and seats are billed primarily on the amount of Developer licenses purchased. All billing computations are conducted in Coordinated Universal Time (UTC).

### What counts as a Successful Model Built?

dbt Cloud considers a Successful Model Built as any model that is successfully built via a run through dbt Cloud’s orchestration functionality in a dbt Cloud deployment environment. Models are counted when built and run. This includes any jobs run via dbt Cloud's scheduler, CI builds (jobs triggered by pull requests), runs kicked off via the dbt Cloud API, and any successor dbt Cloud tools with similar functionality. This also includes models that are successfully built even when a run may fail to complete. For example, you may have a job that contains 100 models and on one of its runs, 51 models are successfully built and then the job fails. In this situation, only 51 models would be counted.

Any models built in a dbt Cloud development environment (for example, via the IDE) do not count towards your usage. Tests, seeds, ephemeral models, and snapshots also do not count. 


### What counts as a seat license? 

There are three types of possible seat licenses:

* **Developer** &mdash; for roles and permissions that require interaction with the dbt Cloud environment day-to-day.
* **Read-Only** &mdash; for access to view certain documents and reports. 
* **IT** &mdash; for access to specific features related to account management (for example, configuring git integration). 

### Viewing usage in the product 

Viewing usage in the product is restricted to specific roles:

* Team plan &mdash; Owner group
* Enterprise plan &mdash; Account and billing admin roles

For an account-level view of usage, if you have access to the **Billing** and **Usage** pages, you can see an estimate of the usage for the month. In the Billing page of the **Account Settings**, you can see how your account tracks against its usage. You can also see which projects are building the most models. 

As a Team and Developer plan user, you can see how the account is tracking against the included models built. As an Enterprise plan user, you can see how much you have drawn down from your annual commit and how much remains. 

On each Project Home page, any user with access to that project can see how many models are built each month. From there, additional details on top jobs by models built can be found on each Environment page. 

In addition, you can look at the Job Details page's Insights tab to show how many models are being built per month for that particular job and which models are taking the longest to build. 

Any usage data is only an estimate of your usage, and there may be a delay in showing usage data in the product &mdash; your final usage for the month will be visible on your monthly statements (statements applicable to Team and Enterprise plans).


## Plans and Billing

dbt Cloud offers several [plans](https://www.getdbt.com/pricing) with different features that meet your needs. We may make changes to our plan details from time to time. We'll always let you know in advance, so you can be prepared. The following section explains how billing works in each plan.

### Developer plan billing

Developer plans are free and include one Developer license and 3,000 models each month. Models are refreshed at the beginning of each calendar month. If you exceed 3,000 models, any subsequent runs will be canceled until models are refreshed or until you upgrade to a paid plan. The rest of the dbt Cloud platform is still accessible, and no work will be lost.

All included successful models built numbers above reflect our most current pricing and packaging. Based on your usage terms when you signed up for the Developer Plan, the included model entitlements may be different from what’s reflected above.


### Team plan billing 

Team customers pay monthly via credit card for seats and usage, and accounts include 15,000 models monthly. Seats are charged upfront at the beginning of the month. If you add seats during the month, seats will be prorated and charged on the same day. Seats removed during the month will be reflected on the next invoice and are not eligible for refunds. You can change the credit card information and the number of seats from the billings section anytime. Accounts will receive one monthly invoice that includes the upfront charge for the seats and the usage charged in arrears from the previous month.

Usage is calculated and charged in arrears for the previous month. If you exceed 15,000 models in any month, you will be billed for additional usage on your next invoice. Additional use is billed at the rates on our [pricing page](https://www.getdbt.com/pricing). 


Included models that are not consumed do not roll over to future months. You can estimate your bill with a simple formula:

`($100 x number of developer seats) + ((models built - 15,000) x $0.01)`

All included successful models built numbers above reflect our most current pricing and packaging. Based on your usage terms when you signed up for the Team Plan, the included model entitlements may be different from what’s reflected above.

:::note Legacy pricing plans
 
Customers who purchased the dbt Cloud Team plan before August 11, 2023, remain on a legacy pricing plan as long as their account is in good standing. The legacy pricing plan is based on seats and includes unlimited models subject to reasonable use. dbt Labs may institute use limits if reasonable use is exceeded. Additional features, upgrades, or updates may be subject to separate charges. Any changes to your current plan pricing will be communicated in advance according to our Terms of Use. 

:::

### Enterprise plan billing

As an Enterprise customer, you pay annually via invoice, monthly in arrears for additional usage (if applicable), and may benefit from negotiated usage rates. Please refer to your order form or contract for your specific pricing details, or [contact the account team](https://www.getdbt.com/contact-demo) with any questions. 

## Managing usage

From anywhere in the dbt Cloud account, click the **gear icon** and click **Account settings**. The **Billing** option will be on the left side menu under the **Account Settings** heading. Here, you can view individual available plans and the features provided for each. 

### Usage notifications 

Every plan automatically sends email alerts when 75%, 90%, and 100% of usage estimates have been reached. In the Team plan, all users within the Owner group will receive alerts. In Enterprise plans, all users with the Account Admin and Billing Admin permission sets will receive alerts. Users cannot opt out of these emails. If you would like additional users to receive these alert emails, please provide them with the applicable permissions mentioned above. Note that your usage may already be higher than the percentage indicated in the alert due to your usage pattern and minor latency times. 

### How do I stop usage from accruing?

There are 2 options to disable models from being built and charged:

1. Open the **Job Settings** of every job and navigate to the **Triggers** section. Disable the **Run on Schedule** and set the **Continuous Integration** feature **Run on Pull Requests?**  to **No**. Check your workflows to ensure that you are not triggering any runs via the dbt Cloud API. This option will enable you to keep your dbt Cloud jobs without building more models. 
2. Alternatively, you can delete some or all of your dbt Cloud jobs. This will ensure that no runs are kicked off, but you will permanently lose your job(s). 


## Optimize costs in dbt Cloud

dbt Cloud offers ways to optimize your model’s built usage and warehouse costs. 

### Best practices for optimizing successful models built

When thinking of ways to optimize your costs from successful models built, there are methods to reduce those costs while still adhering to best practices. To ensure that you are still utilizing tests and rebuilding views when logic is changed, it's recommended to implement a combination of the best practices that fit your needs. More specifically, if you decide to exclude views from your regularly scheduled dbt Cloud job runs, it's imperative that you set up a merge job (with a link to the section) to deploy updated view logic when changes are detected.

#### Exclude views in a dbt Cloud job

Many dbt Cloud users utilize views, which don’t always need to be rebuilt every time you run a job. For any jobs that contain views that _do not_ include macros that dynamically generate code (for example, case statements) based on upstream tables and also _do not_ have tests, you can implement these steps:

1. Go to your current production deployment job in dbt Cloud.
2. Modify your command to include: `-exclude config.materialized:view`.
3. Save your job changes.

If you have views that contain macros with case statements based on upstream tables, these will need to be run each time to account for new values. If you still need to test your views with each run, follow the [Exclude views while still running tests](#exclude-views-while-running-tests) best practice to create a custom selector. 

#### Exclude views while running tests

Running tests for views in every job run can help keep data quality intact and save you from the need to rerun failed jobs. To exclude views from your job run while running tests, you can follow these steps to create a custom [selector](https://docs.getdbt.com/reference/node-selection/yaml-selectors) for your job command. 

1. Open your dbt project in the dbt Cloud IDE.
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
5. Modify your dbt Cloud jobs to include `--selector skip_views_but_test_views`.

#### Build only changed views

If you want to ensure that you're building views whenever the logic is changed, create a merge job that gets triggered when code is merged into main: 

1. Ensure you have a [CI job setup](/docs/deploy/ci-jobs) in your environment.
2. Create a new [deploy job](/docs/deploy/deploy-jobs#create-and-schedule-jobs) and call it “Merge Job".
3. Set the  **Environment** to your CI environment. Refer to [Types of environments](/docs/deploy/deploy-environments#types-of-environments) for more details.
4. Set **Commands** to: `dbt run -s state:modified+`.
    Executing `dbt build` in this context is unnecessary because the CI job was used to both run and test the code that just got merged into main.
5. Under the **Execution Settings**, select the default production job to compare changes against:
    - **Defer to a previous run state** &mdash; Select the “Merge Job” you created so the job compares and identifies what has changed since the last merge.
6. In your dbt project, follow the steps in [Run a dbt Cloud job on merge](/guides/orchestration/custom-cicd-pipelines/3-dbt-cloud-job-on-merge) to create a script to trigger the dbt Cloud API to run your job after a merge happens within your git repository or watch this [video](https://www.loom.com/share/e7035c61dbed47d2b9b36b5effd5ee78?sid=bcf4dd2e-b249-4e5d-b173-8ca204d9becb).

The purpose of the merge job is to:

- Immediately deploy any changes from PRs to production.
- Ensure your production views remain up-to-date with how they’re defined in your codebase while remaining cost-efficient when running jobs in production.

The merge action will optimize your cloud data platform spend and shorten job times, but you’ll need to decide if making the change is right for your dbt project.

### Rework inefficient models

#### Job Insights tab

To reduce your warehouse spend, you can identify what models, on average, are taking the longest to build in the **Job** page under the **Insights** tab. This chart looks at the average run time for each model based on its last 20 runs. Any models that are taking longer than anticipated to build might be prime candidates for optimization, which will ultimately reduce cloud warehouse spending. 

#### Model Timing tab

To understand better how long each model takes to run within the context of a specific run, you can look at the **Model Timing** tab. Select the run of interest on the **Run History** page to find the tab. On that **Run** page, click **Model Timing**. 

Once you've identified which models could be optimized, check out these other resources that walk through how to optimize your work: 
* [Build scalable and trustworthy data pipelines with dbt and BigQuery](https://services.google.com/fh/files/misc/dbt_bigquery_whitepaper.pdf) 
* [Best Practices for Optimizing Your dbt and Snowflake Deployment](https://www.snowflake.com/wp-content/uploads/2021/10/Best-Practices-for-Optimizing-Your-dbt-and-Snowflake-Deployment.pdf) 
* [How to optimize and troubleshoot dbt models on Databricks](/guides/dbt-ecosystem/databricks-guides/how_to_optimize_dbt_models_on_databricks)

## FAQs

* What happens if I need more than 8 seats on the Team plan? 
_If you need more than 8 developer seats, select the Contact Sales option from the billing settings to talk to our sales team about an Enterprise plan._  

* What if I go significantly over my included free models on the Team or Developer plan?
_Consider upgrading to a Team or Enterprise plan. Team plans include more models and allow you to exceed the monthly usage limit. Enterprise accounts are supported by a dedicated account management team and offer annual plans, custom configurations, and negotiated usage rates._ 

* I want to upgrade my plan. Will all of my work carry over?
_Yes. Your dbt Cloud account will be upgraded without impacting your existing projects and account settings._

* How do I determine the right plan for me?
 _The best option is to consult with our sales team. They'll help you figure out what is right for your needs. We also offer a free two-week trial on the Team plan._
