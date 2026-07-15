---
title: "Optimize costs in dbt"
id: optimize-costs
description: "Best practices to optimize model build usage and warehouse costs in dbt."
sidebar_label: "Optimize costs"
---

<Constant name="dbt" /> offers ways to optimize your model’s built usage and warehouse costs. 

### Best practices for optimizing cost with dbt State

#### Use `lag_tolerance` to reduce unnecessary model execution

You can save even more time and compute by defining how old your data can be before a model should be triggered. We’ve introduced lag_tolerance so that you can do things like differentiate development needs vs prod. 

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
2. Modify your command to include: `--exclude config.materialized:view`.
3. Save your job changes.

If you have views that contain macros with case statements based on upstream tables, these will need to be run each time to account for new values. If you still need to test your views with each run, follow the [Exclude views while still running tests](#exclude-views-while-running-tests) best practice to create a custom selector. 

#### Exclude views while running tests

Running tests for views in every job run can help keep data quality intact and save you from the need to rerun failed jobs. To exclude views from your job run while running tests, you can follow these steps to create a custom [selector](/reference/node-selection/yaml-selectors) for your job command. 

1. Open your dbt project in the <Constant name="studio_ide" />.
2. Add a file called `selectors.yml` in your top-level project folder.
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
5. Modify your dbt jobs to include <VersionBlock lastVersion="1.11">`dbt run --selector skip_views_but_test_views`</VersionBlock><VersionBlock firstVersion="1.12">`dbt run --select selector:skip_views_but_test_views`</VersionBlock>.

#### Build only changed views

If you want to ensure that you're building views whenever the logic is changed, create a merge job that gets triggered when code is merged into main: 

1. Ensure you have a [CI job setup](/docs/deploy/ci-jobs) in your environment.
2. Create a new [deploy job](/docs/deploy/deploy-jobs#create-and-schedule-jobs) and call it “Merge Job".
3. Set the  **Environment** to your CI environment. Refer to [Types of environments](/docs/deploy/deploy-environments#types-of-environments) for more details.
4. Set **Commands** to: `dbt run -s state:modified+`.
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
