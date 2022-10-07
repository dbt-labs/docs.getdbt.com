---
title: "Quickstart"
id: quickstart-semantic-layer
description: "Define metrics and set up the dbt Semantic Layer"
sidebar_label: "Quickstart"
---

# dbt Semantic Layer quickstart

:::📌 
The dbt Semantic Layer is currently available for public preview! Some of the new features includes removing code duplication and inconsistency when it comes to your business metrics, self-service in downstream tools, and more! Review the [info below]](/docs/integrate/quickstart-semantic-layer#public-preview) to see what public preview means for you.
:::

Try out the features of the dbt Semantic Layer and follow this guide to learn more.

## Introduction

To use the dbt Semantic Layer, you need to have a dbt project set up first. This Quickstart guide will lay out all the steps needed and you'll follow a workflow that demonstrates some of its essential features, including:

- Install dbt metrics package
- Define metrics
- Query, and run metrics
- Configure the dbt Semantic Layer

## Prerequisites
To use the dbt Semantic Layer, you’ll need to meet the following:

- Have multi-tenant [dbt Cloud](https://cloud.getdbt.com/) Teams or Enterprise account. Developer accounts will be able to query the Proxy Server using SQL, but will not be able to browse pre-populated dbt metrics in external tools, which requires access to the Metadata API.
- Have both your production and development environments running dbt version 1.2 (latest) or higher
- Use Snowflake data platfrom 
- Install the metrics package version 0.3.2 or higher in your dbt project
- Set up the Metadata API in the integrated tool to import metric definitions (Depending on your integrated tool)
- Recommended - Review the dbt metrics page and Getting started with the dbt Semantic Layer blog

## Considerations

There are some modifications to consider when using the dbt Semantic Layer during Public preview: 

- Support for Snowflake data platform only (additional data platforms coming soon)
- Support for the deployment environment only (development experience coming soon)
- Do not use environment variables for the job/environment (coming soon)

:::📌 
New to dbt or metrics? Review our [Getting Started guide](https://docs.getdbt.com/guides/getting-started) to build your first dbt project and then our [Jaffle Shop](https://github.com/dbt-labs/jaffle_shop_metrics) project to define your first example metrics!
:::

## Installing dbt metrics package

1. Install the [dbt metrics package](https://hub.getdbt.com/dbt-labs/metrics/latest/) into your dbt project by copying the below code blocks. Make sure you use a dbt metrics package that’s compatible with your dbt environment version. 

<!---
<File name='packages.yml'>

<VersionBlock firstVersion="1.3">

```yaml
packages:
- package: dbt-labs/metrics
  version: [">=1.3.0", "<1.4.0"]
```
</VersionBlock> 

<VersionBlock lastVersion="1.2">

```yaml
packages:
  - package: dbt-labs/metrics
    version: [">=0.3.0", "<0.4.0"]
```
</VersionBlock> 

</File>
--->

1. Paste the dbt metrics package code into your `packages.yml` file.
2. Run the `[dbt deps` command](https://docs.getdbt.com/reference/commands/deps) to install the package.
3. You have now installed the dbt metrics package successfully! 
    1. If you have any errors during the run, review the system logs for more information on how to fix them

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/metrics_package.png" title="Running dbt deps in the dbt Cloud IDE" />

## Defining metrics in your dbt project

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
    - [dbt metrics](/docs/building-a-dbt-project/metrics) for in-depth detail on attributes, properties, filters, and how to define and query metrics
    - [`FUTURE BLOG POST`](URL) to understand best practices for designing and structuring metrics in your dbt project

## Develop and query metrics in your dbt project

You can dynamically query metrics directly in dbt and verify them *before* running a job in the deployment environment.  

1. Review [dbt metrics](/docs/building-a-dbt-project/metrics) to understand when and how to use the `metrics.calculate` macro and `metrics.develop` macro.

:::📌 Note, you need to access to dbt Cloud and the **dbt Semantic Layer** from your integrated tool of choice. :::

## Run your production job

The deployment environment is only supported for the dbt Semantic Layer at this moment. Once you’ve defined metrics in your dbt project, you can now run your metrics in your deployment environment:

1. Go to **Deploy** and then **Jobs** to re-run the job with the most recent code in the deployment environment.
    1. Your metric should appear as red nodes in the dbt Cloud IDE and dbt directed acyclic graphs (DAG).

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/metrics_red_nodes.png" title="DAG with metrics appearing as red nodes" />

:::📌 What’s happening internally?

- Merging the code into your main branch allows dbt Cloud to pull those changes and builds the definition in the resulting manifest.json. *CM: builds the definition in the manifest produced by the run.*
- Re-running the job in the deployment environment helps materialize the models, which the metrics depend on, in the data platform. It also makes sure the dbt Metadata is up to date. *It also makes sure that the manifest is up to date.
- Your dbt Metadata API reflects these changes and allows your integration tool to pull metric information. *Your dbt Metadata API pulls in the most recent manifest and allows your integration information to extract metadata from it.
:::

## Configure dbt Semantic Layer

In order to query your precise and universally-defined metrics in your integration tool, you need to [set up the dbt Semantic Layer](/docs/docs/integrate/setup-dbt-semantic-layer#set-up-dbt-semantic-layer) in dbt Cloud to connect with your integration tool:

1. In your dbt Cloud account, go to **Account Settings** and then **Service Tokens** to create a new [service account API token](/docs/dbt-cloud/dbt-cloud-api/service-tokens). Save your token somewhere safe.
2. Go to **Deploy** and then **Environment.** Select your **Deployment** environment.
3. Click **Settings** and then **Edit** on the upper right side of the page.
4. Select dbt Version 1.2 (latest) or higher.
5. Toggle the Semantic Layer **On.**
6. Copy the Proxy Server URL to connect to your [integrated tool](https://www.getdbt.com/product/semantic-layer-integrations). 
7. If supported by your tool, provide an API service token with metadata access. 
8. You can now run precise and consistent queries with the dbt Semantic Layer.

**Configure dbt Semantic Layer** 

In order to query your precise and universally-defined metrics in your integration tool, you need to [`configure the dbt Semantic Layer`](URL) in dbt Cloud to connect with your integration tool:

1. In your dbt Cloud account, go to **Account Settings** and then **Service Tokens** to create a new [service account API token](https://docs.getdbt.com/docs/dbt-cloud/dbt-cloud-api/service-tokens). Save your token somewhere safe.
2. Go to **Deploy** and then **Environment.** Select your **Deployment** environment.
3. Click **Settings** and then **Edit** on the upper right side of the page.
4. Select dbt Version 1.2 (latest) or higher.
5. Toggle the Semantic Layer **On.**
6. Copy the Proxy Server URL to connect to your [integrated tool](https://www.getdbt.com/product/semantic-layer-integrations). 
7. If supported by your tool, provide an API service token with metadata access. 
8. You can now run precise and consistent queries with the dbt Semantic Layer.

## Troubleshooting
    
<details>
  <summary>How are you storing my data?</summary>
  <div>
    <div>dbt does not store your data. We temporarily ingest the data from the data warehouse, pass it to connecting tool, and then drop the data.</div>
  </div>
</details>
<details>
  <summary>Is the dbt Semantic Layer open source?</summary>
  <div>
    <div>Some components of the dbt Semantic Layer are open source like dbt-core, the dbt_metrics package, and the BSL licensed dbt-server. The dbt Proxy Server (what is actually compiling the dbt code) and the Metadata API are not. During public preview, the dbt Semantic Layer is open to all dbt Cloud tiers (Developer, Team, and Enterprise). Team and Enterprise accounts will be able to set up the Semantic Layer and Metadata API in the integrated tool to import metric definition. Developer accounts will be able to query the Proxy Server using SQL, but will not be able to browse pre-populated dbt metrics in external tools, which requires access to the Metadata API.</div>
  </div>
</details>
<details>
    <summary>The <code>dbt_metrics_calendar_table</code> does not exist or is not authorized?</summary>
  <div>
    <div>All metrics queries are dependent on either the <code>dbt_metrics_calendar_table</code> or a custom calendar set in the users <code>dbt_project.yml</code>. If you have not created this model in the database, these queries will fail and you’ll most likely see the following error message:

<code>Object DATABASE.SCHEMA.DBT_METRICS_DEFAULT_CALENDAR does not exist or not authorized.</code>

<b>Fix</b>
<span>&#8226;</span> If developing locally, run <code>dbt run --select dbt_metrics_default_calendar</code>
<span>&#8226;</span> If you are using this in production, make sure that you perform a full </code>dbt build</code> or <code>dbt run</code> . If you are running specific <code>selects</code> in your production job, then you will not create this required model.<br></br>
    </div>
  </div>
</details>
<details>
  <summary>Ephemeral Models - Object does not exist or is not authorized</summary>
  <div>
    <div>Metrics cannot be defined on <a href="/docs/building-a-dbt-project/metrics">ephemeral models</a> and this is because we reference the underlying table in the query that generates the metric so we need the table/view to exist in the database. If your table/view does not exist in your database, you’ll likely see this error message:

 <code>Object 'DATABASE.SCHEMA.TESTING_EPHEMERAL does not exist or not authorized.</code>

    <b>Fix:</b>

<span>&#8226;</span> You will need to materialize the model that the metric is built on as a table/view/incremental.</div>
  </div>
</details>
   
## Public preview
    
The dbt Semantic Layer is currently available for public preview, which means:
    
- **Who?** The dbt Semantic Layer is open to all dbt Cloud tiers (Developer, Team, and Enterprise) during public preview. Review the [Product architecture](/docs/integrate/dbt-semantic-layer#product-architecture) section for more information.

- **What?** Public preview provides early access to new features, is supported and production ready, but not priced yet. Pricing for the dbt Semantic Layer will be introduced alongside the General Available (GA) release. There may also still be additions or modifications to product behavior. 

- **When?** Public preview will end once the dbt Semantic Layer is available for GA. After GA, the dbt Semantic Layer will only be available to dbt Cloud Team and Enterprise plans.

- **Where?** Public preview is enabled at the account level so you don’t need to worry about enabling it per user.

- **Why?** Public preview is designed to test the functionality and collect feedback from the community on performance, usability, and documentation. 
    
    
## Next steps

dbt Labs provides [example metrics](https://github.com/dbt-labs/jaffle_shop_metrics) that you can use to try out dbt Semantic Layer features. Ready to define your own metrics and bring consistency to data consumers? Review the following documents to understand how to structure, define, and query metrics, and set up the dbt Semantic Layer:

- [dbt metrics](/docs/building-a-dbt-project/metrics) for in-depth detail on attributes, properties, filters, and how to define and query metrics
- [`FUTURE BLOG POST`](URL) to understand best practices for designing and structuring metrics in your dbt project
- [Integrate with dbt](/docs/integrate/setup-dbt-semantic-layer.md#set-up-dbt-semantic-layer)) to learn about the dbt Semantic Layer
- [Getting started with the Semantic Layer](https://docs.getdbt.com/blog/getting-started-with-the-dbt-semantic-layer) blog post to see further examples
