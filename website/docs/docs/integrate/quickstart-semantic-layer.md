---
title: "dbt Semantic Layer quickstart"
id: quickstart-semantic-layer
description: "Define metrics and set up the dbt Semantic Layer"
sidebar_label: "dbt Semantic Layer quickstart"
---


# Quickstart

:::
📌 The dbt Semantic Layer is currently available for public preview! Review the info below to see what this means for you:

1. **Who?** The dbt Semantic Layer is open to all dbt Cloud tiers (Developer, Team, and Enterprise) during public preview. Review the [Product architecture](url) section for more information.

2. **What?** Public preview provides early access to unreleased features, is supported and production ready, but not priced yet.  Pricing for the dbt Semantic Layer will be introduced alongside the Generally Available (GA) release (expected first half of the calendar year 2023). 

3. **When?** Public preview will end once the dbt Semantic Layer is available for GA (expected first half of 2023). During GA, the dbt Semantic Layer will only be available to dbt Cloud Team and Enterprise plans.

4. **Where?** Public preview is enabled at the account level so you don’t need to worry about enabling it per user.

5. **Why?** Public preview is designed to test the functionality and collect feedback from our community on performance, usability, and documentation.
:::

Try out the features of the dbt Semantic Layer and follow this guide to learn more.

**Introduction** 

To use the dbt Semantic Layer, you need to have a dbt project set up first. This Quickstart guide will lay out all the steps needed and you'll follow a workflow that demonstrates some of its essential features, including:

- Install dbt metrics package
- Define metrics
- Query, and run metrics
- Configure the dbt Semantic Layer

**Prerequisites** 
To use the dbt Semantic Layer, you’ll need to meet the following:

**•** Have multi-tenant [dbt Cloud](https://cloud.getdbt.com/) Teams or Enterprise account 
**•** Have both your production and development environments running dbt version 1.2 (latest) or higher
**•** Use Snowflake data warehouse 
**•** [Install](/docs.getdbt.com/docs/building-a-dbt-project/package-management#how-do-i-add-a-package-to-my-project) the [metrics package](https://hub.getdbt.com/dbt-labs/metrics/latest/) version 0.3.2 or higher in your dbt project
**•** Set up the [Metadata API](/docs.getdbt.com/docs/dbt-cloud/dbt-cloud-api/metadata/metadata-overview) in the integrated tool to import metric definitions (Depending on your integrated tool)
**•** Recommended - Review the [dbt metrics](/docs.getdbt.com/docs/building-a-dbt-project/metrics) page and [Getting started with the dbt Semantic Layer](/docs.getdbt.com/blog/getting-started-with-the-dbt-semantic-layer) blog

**Considerations**

There are some modifications to consider when using the dbt Semantic Layer during Public preview: 

- Support for Snowflake data warehouse only (additional warehouses coming soon)
- Support for the deployment environment only (development experience coming soon)
- Do not use environment variables for the job/environment (coming soon)

<aside>
📌 New to dbt or metrics? Review our [Getting Started guide](/docs.getdbt.com/guides/getting-started) to build your first dbt project and then our [Jaffle Shop](https://github.com/dbt-labs/jaffle_shop_metrics) project to define your first example metrics!

</aside>

**Installing dbt** **metrics package** 

1. Install the [dbt metrics package](https://hub.getdbt.com/dbt-labs/metrics/latest/) into your dbt project by copying the below code blocks. Make sure you use a dbt metrics package that’s compatible with your dbt environment version. 

**dbt Version 1.2**

```yaml
packages:
  - package: dbt-labs/metrics
    version: [">=0.3.0", "<0.4.0"]
```

**dbt Version 1.3**

```yaml
packages:
  - package: dbt-labs/metrics
    version: [">=1.3.0", "<1.4.0"]
```

1. Paste the dbt metrics package code into your `packages.yml` file.
2. Run the `[dbt deps` command](https://docs.getdbt.com/reference/commands/deps) to install the package.
3. You have now installed the dbt metrics package successfully! 
    1. If you have any errors during the run, review the system logs for more information on how to fix them.

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/metrics_package.png" title="Running dbt deps in the dbt Cloud IDE" />

**Defining metrics in your dbt project** 

You can define metrics in `.yml` files nested under a `metrics` key.  

1. Using the [Jaffle Shop](https://github.com/dbt-labs/jaffle_shop_metrics) project example, you can use the below example definition in your metrics folder: 

```sql
version: 2

metrics:
  - name: expenses
    label: Expenses
    model: ref('orders')
    description: "The total expenses of our jaffle business"

    type: sum
    sql: amount / 4

    timestamp: order_date
    time_grains: [day, week, month, year]

    dimensions:
      - customer_status
      - had_credit_card_payment
      - had_coupon_payment
      - had_bank_transfer_payment
      - had_gift_card_payment

    filters:
      - field: status
        operator: '='
        value: "'completed'"
```

1. Click **Save** and **Compile.**
2. Commit and merge the code changes that contain the metric definition.
3. Review the following documentation to further design metrics, define your own metrics in your dbt project and understand what attributes to use:
    - [dbt metrics](/docs.getdbt.com/docs/building-a-dbt-project/metrics) for in-depth detail on attributes, properties, filters, and how to define and query metrics
    - [`FUTURE BLOG POST`](URL) to understand best practices for designing and structuring metrics in your dbt project

**Develop and query metrics in your dbt project**

You can dynamically query metrics directly in dbt and verify them *before* running a job in the deployment environment.  

1. Review [dbt metrics](/docs.getdbt.com/docs/building-a-dbt-project/metrics) ****to understand when and how to use the `metrics.calculate` macro and `metrics.develop` macro.

<aside>
📌 Note, you need to access to dbt Cloud and the **dbt Semantic Layer** from your integrated tool of choice.

</aside>

**Run your production job** 

The deployment environment ****is only supported for the dbt Semantic Layer at this moment. Once you’ve defined metrics in your dbt project, you can now run your metrics in your deployment environment:

1. Go to **Deploy** and then **Jobs** to re-run the job with the most recent code in the deployment environment.
    1. Your metric should appear as red nodes in the dbt Cloud IDE and dbt directed acyclic graphs (DAG).

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/metrics_red_nodes.png" title="DAG with metrics appearing as red nodes" />

:::📌 **What’s happening internally?**

- Merging the code into your main branch allows dbt Cloud to pull those changes and builds the definition in the resulting manifest.json. *CM: builds the definition in the manifest produced by the run.*
- Re-running the job in the deployment environment helps materialize the models, which the metrics depend on, in the data warehouse. It also makes sure the dbt Metadata is up to date. *It also makes sure that the manifest is up to date.*
- Your dbt Metadata API reflects these changes and allows your integration tool to pull metric information. *Your dbt Metadata API pulls in the most recent manifest and allows your integration information to extract metadata from it.*
:::

**Configure dbt Semantic Layer** 

In order to query your precise and universally-defined metrics in your integration tool, you need to [`configure the dbt Semantic Layer`](URL) in dbt Cloud to connect with your integration tool:

1. In your dbt Cloud account, go to **Account Settings** and then **Service Tokens** to create a new [service account API token](/docs.getdbt.com/docs/dbt-cloud/dbt-cloud-api/service-tokens). Save your token somewhere safe.
2. Go to **Deploy** and then **Environment.** Select your **Deployment** environment.
3. Click **Settings** and then **Edit** on the upper right side of the page.
4. Select dbt Version 1.2 (latest) or higher.
5. Toggle the Semantic Layer **On.**
6. Copy the Proxy Server URL to connect to your [integrated tool](https://www.getdbt.com/product/semantic-layer-integrations). 
7. If supported by your tool, provide an API service token with metadata access. 
8. You can now run precise and consistent queries with the dbt Semantic Layer.

**Troubleshooting** 

- How are you storing my data?
    
    dbt does not store your data. We temporarily ingest the data from the data warehouse, pass it to connecting tool, and then drop the data.
    
- Is the dbt Semantic Layer open source?
    
    Not entirely. Components of the dbt Semantic Layer are open source like dbt-core, the dbt_metrics package, and the BSL licensed dbt-server. The dbt Proxy Server (what is actually compiling the dbt code) is not. [More info in this post.](/docs.getdbt.com/blog/getting-started-with-the-dbt-semantic-layer)
    
- The `dbt_metrics_calendar_table` does not exist or is not authorized
    
    All metrics queries are dependent on either the `dbt_metrics_calendar_table` or a custom calendar set in the users `dbt_project.yml` . If you have not created this model in the database, these queries will fail and you’ll most likely see the following error message:
    
    > `Object 'DATABASE.SCHEMA.DBT_METRICS_DEFAULT_CALENDAR' does not exist or not authorized.`
    > 
    
    **Fix:**
    
    - If developing locally, run `dbt run --select dbt_metrics_default_calendar`
    - If you are using this in production, make sure that you perform a full `dbt build` or `dbt run` . If you are running specific `selects` in your production job, then you will not create this required model.
- Ephemeral Models - Object does not exist or is not authorized
    
    Metrics cannot be defined on [ephemeral models](/docs.getdbt.com/docs/building-a-dbt-project/metrics) and this is because we reference the underlying table in the query that generates the metric so we need the table/view to exist in the database. If your table/view does not exist in your database, you’ll likely see this error message:
    
    > *`Object 'DATABASE.SCHEMA.TESTING_EPHEMERAL' does not exist or not authorized.`*
    > 
    
    **Fix:**
    
    - You will need to materialize the model that the metric is built on as a table/view/incremental.
- Mismatched Versions - metric type is ‘’
    
    If you’re running `dbt_metrics` ≥v0.3.2 but have `dbt-core` version ≥1.3.0, you’ll likely see these error messages:
    
    Error message 1:
    
    > `The metric NAME also references ... but its type is ''.
    Only metrics of type expression can reference other metrics.`
    > 
    
    Error message 2:
    
    > `Unknown aggregation style:   > in macro default__gen_primary_metric_aggregate (macros/sql_gen/gen_primary_metric_aggregate.sql)`
    > 
    
    **The reason for this is that we changed the `type` property of the metric spec in dbt-core v1.3.0. The new name is `calculation_method` and the package reflects that new name, so it isn’t finding any `type` when we try and run outdated code on it.**
    
    **Fix**
    
    - Have the user upgrade their `dbt_metrics` package to v1.3.0
    
    **Error Message:**
    
    > *The metric NAME also references ... but its type is ''.*
    *Only metrics of type expression can reference other metrics.*
    > 
    
    **Alternative Error Message:**
    
    > `Unknown aggregation style:   > in macro default__gen_primary_metric_aggregate (macros/sql_gen/gen_primary_metric_aggregate.sql)`
    > 
- Prerequisites not met - Not able to connect to the semantic layer or queries running endlessly
    
    **Reason:** 
    
    - There are prerequisites to be able to using the semantic layer. 
    - If these prerequisites are not met then it causes issues. For example, if a production job has not been run then there is no manifest to be pulled into the infrastructure and thus the Semantic Layer cannot compile queries.
    - The Switchboard team is working on encoding all of these pre-reqs into the setup experience but in the meantime these are ones that can trip people up:
        - The metrics package isn’t installed
        - They haven’t run a production job
        - They are on an unsupported version of dbt-core (> 1.2 - latest)
    
    **Fix:**
    
    - Depending on what you believe the issue is after talking with the user, please have them fix the step.
    
    **Error Message -** None as there probably isn’t anything being returned here.
    
- Issues Connecting With Snowflake via snowflake.connector  - https:// in host name
    
    **Reason**
    
    - We’re not entirely sure what is happening here but we **believe** that it arises when you include the `https://` in the host name.
    
    ```python
    con = snowflake.connector.connect(
        account = "name",
        user = "name",
        password = "name",
        database = "name",
        host = 'https://slug.proxy.cloud.getdbt.com'
    )
    ```
    
    - Unfortunately the error message provided doesn’t help debug what is going on
    
    **Fix:**
    
    - Removing the `https://` from the host name solves this issue.
    
    **Error Message:**
    
    > */shared-libs/python3.9/py/lib/python3.9/site-packages/snowflake/connector/options.py:96: UserWarning: You have an incompatible version of 'pyarrow' installed (9.0.0), please install a version that adheres to: 'pyarrow<8.1.0,>=8.0.0; extra == "pandas"’*
    > 
- Trying to run introspective queries - `run_query` doesn’t work
    
    **Reason:**
    
    - The Semantic Layer does not support introspective queries and will block any and all of them.
    - *Internal:* the reason we don’t support these is due to security concerns because introspective queries inherited the credentials from the dbt Cloud user, not the user provided to the JDBC connector. This means that a `drop table x` statement would have been permitted if run with `run_query` even if it was blocked as a general sql statement.
    
    **Fix:**
    
    - Tell the user that this behavior is not supported at the moment for security reasons but we’ll be looking to address them holistically in the future.
    
    **Error Message:**
    
    > `This dbt server environment does not support introspective queries. Hint: typically introspective queries use the 'run_query' jinja command or a macro that invokes that command`
    > 

**Next steps** 

dbt Labs provides [example metrics](https://github.com/dbt-labs/jaffle_shop_metrics) that you can use to try out dbt Semantic Layer features. Ready to define your own metrics and bring consistency to data consumers? Review the following documents to understand how to structure, define, and query metrics, and set up the dbt Semantic Layer:

- [dbt metrics](/docs.getdbt.com/docs/building-a-dbt-project/metrics) for in-depth detail on attributes, properties, filters, and how to define and query metrics
- [`FUTURE BLOG POST`](URL) to understand best practices for designing and structuring metrics in your dbt project
- [`Integrate with dbt`](URL) to learn about the dbt Semantic Layer
- [Getting started with the Semantic Layer](/docs.getdbt.com/blog/getting-started-with-the-dbt-semantic-layer) blog post to see further examples
