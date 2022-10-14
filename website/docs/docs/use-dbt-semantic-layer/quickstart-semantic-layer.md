---
title: "Quickstart"
id: quickstart-semantic-layer
description: "Define metrics and set up the dbt Semantic Layer"
sidebar_label: "Quickstart"
---

# dbt Semantic Layer quickstart

:::info 📌

The dbt Semantic Layer is currently available in Public Preview for multi-tenant dbt Cloud accounts hosted in North America. 

With the dbt Semantic Layer, you'll be able to centrally define business metrics, reduce code duplication and inconsistency, create self-service in downstream tools, and more! 


For more info on Public Preview and plan availability, check out the [Public Preview](/docs/use-dbt-semantic-layer/quickstart-semantic-layer#public-preview) and [product architecture](/docs/use-dbt-semantic-layer/dbt-semantic-layer#product-architecture) section.

:::


## Public Preview
    
We're excited to announce the dbt Semantic Layer is currently available for Public Preview, which means:

&mdash; **Who?** The dbt Semantic Layer is open to all dbt Cloud tiers (Developer, Team, and Enterprise) during Public Preview. Team and Enterprise accounts will be able to set up the Semantic Layer and [Metadata API](/docs/dbt-cloud/dbt-cloud-api/metadata/metadata-overview) in the integrated partner tool to import metric definition. Developer accounts will be able to query the Proxy Server using SQL, but will not be able to browse dbt metrics in external tools, which requires access to the Metadata API. For more info on plan availability, check out our [product architecture](/docs/use-dbt-semantic-layer/dbt-semantic-layer#product-architecture) section.

&mdash; **What?** Public Previews provide early access to new features. The Semantic Layer is stable and you can use it for production deployments, but there may still be some planned additions and modifications to product behaviors before moving to General Availability. We may also introduce new functionality that is not backwards compatible. dbt Labs provides support, and relevant service level objectives (SLOs) apply. We will introduce pricing for the dbt Semantic Layer will alongside the General Available (GA) release.

&mdash; **When?** Public Preview will end once the dbt Semantic Layer is available for GA. After GA, the dbt Semantic Layer will only be available to dbt Cloud **Team** and **Enterprise** plans.

&mdash; **Where?** Public Preview is enabled at the account level so you don’t need to worry about enabling it per user.


## Introduction

To try out the features of the dbt Semantic Layer, you first need to have a dbt project set up. This quickstart guide will lay out the following steps, and recommends a workflow that demonstrates some of its essential features:

- Install dbt metrics package
- Define metrics
- Query, and run metrics
- Configure the dbt Semantic Layer

## Prerequisites
To use the dbt Semantic Layer, you’ll need to meet the following:

<VersionBlock firstVersion="1.3" >

- Have a multi-tenant dbt Cloud account, <a href="https://docs.getdbt.com/docs/deploy/regions">hosted</a> in North America. 
  * Developer accounts will be able to query the Proxy Server using SQL, but will not be able to browse pre-populated dbt metrics in external tools, which requires access to the Metadata API. <br />
- Have both your production and development environments running dbt version 1.3 or higher <br />
- Use Snowflake data platform <br />
- Install the <a href="https://hub.getdbt.com/dbt-labs/metrics/latest/">dbt metrics package</a> version <code>">=1.3.0", "<1.4.0"</code> in your dbt project <br />
- Set up the <a href="https://docs.getdbt.com/docs/dbt-cloud/dbt-cloud-api/metadata/metadata-overview">Metadata API</a> in the integrated tool to import metric definitions <br />
- Recommended - Review the <a href="https://docs.getdbt.com/docs/building-a-dbt-project/metrics">dbt metrics page</a> and <a href="https://docs.getdbt.com/blog/getting-started-with-the-dbt-semantic-layer">Getting started with the dbt Semantic Layer</a> blog <br />

</VersionBlock>

<VersionBlock lastVersion="1.2">

- Have a multi-tenant dbt Cloud account, <a href="https://docs.getdbt.com/docs/deploy/regions">hosted</a> in North America. 
  * Developer accounts will be able to query the Proxy Server using SQL, but will not be able to browse pre-populated dbt metrics in external tools, which requires access to the Metadata API. <br /> 
- Have both your production and development environments running dbt version 1.2 (latest) <br />
- Use Snowflake data platform <br />
- Install the <a href="https://hub.getdbt.com/dbt-labs/metrics/latest/">dbt metrics package</a> version <code>">=0.3.0", "<0.4.0"</code> in your dbt project <br />
- Set up the <a href="https://docs.getdbt.com/docs/dbt-cloud/dbt-cloud-api/metadata/metadata-overview">Metadata API</a> in the integrated tool to import metric definitions <br />
- Recommended - Review the <a href="https://docs.getdbt.com/docs/building-a-dbt-project/metrics">dbt metrics page</a> and <a href="https://docs.getdbt.com/blog/getting-started-with-the-dbt-semantic-layer">Getting started with the dbt Semantic Layer</a> blog <br />

</VersionBlock>

:::caution Considerations

Some important considerations to know about during the Public Preview:

- Support for Snowflake data platform only (_additional data platforms coming soon_)
- Support for the deployment environment only (_development experience coming soon_)
- Do not use environment variables for the job/environment (_coming soon_)

:::


:::info 📌 

New to dbt or metrics? Check out our [Getting Started guide](/guides/getting-started) to build your first dbt project! If you'd like to define your first metrics, try our [Jaffle Shop](https://github.com/dbt-labs/jaffle_shop_metrics) example project.

:::

## Installing dbt metrics package
The dbt Semantic Layer supports the calculation of metrics by using the dbt-metrics package. You can install the [dbt metrics package](https://hub.getdbt.com/dbt-labs/metrics/latest/) into your dbt project by copying the below code blocks. Make sure you use a dbt metrics package that’s compatible with your dbt environment version. 


<VersionBlock firstVersion="1.3" lastVersion="1.3">

```yml
packages:
  - package: dbt-labs/metrics
    version: [">=1.3.0", "<1.4.0"]
```

</VersionBlock>

<VersionBlock firstVersion="1.2" lastVersion="1.2">

```yml
packages:
  - package: dbt-labs/metrics
    version: [">=0.3.0", "<0.4.0"]
```

</VersionBlock>

<VersionBlock firstVersion="1.1" lastVersion="1.1">

```yml
packages:
  - package: dbt-labs/metrics
    version: [">=0.2.0", "<0.3.0"]
```

</VersionBlock>  


1. Paste the dbt metrics package code in your `packages.yml` file.
2. Run the [`dbt deps` command](/reference/commands/deps) to install the package.
3. If you see successful result, you have now installed the dbt metrics package successfully! 
4. If you have any errors during the `dbt deps` command run, review the system logs for more information on how to resolve them.

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/metrics_package.png" title="Running dbt deps in the dbt Cloud IDE" />

## Design and define metrics in your dbt project
    
If you're new or curious about metrics, review our [Get started with metrics] intro video, which  explains what metrics are, why they're important and how you can get started with them.
    
<div style="position: relative; padding-bottom: 59.227467811158796%; height: 0;"><iframe src="https://www.loom.com/embed/b120ca9d042d46abad1d873a676bf20a" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div><br />
    
### Design metrics
    
To understand how to structure and organize your metrics, and best practices, review our [How to design and structure dbt metrics: Recommendations for getting started](https://docs.getdbt.com/blog/how-to-design-and-structure-metrics) blog post first.

### Define metrics
Now that you've organized your metrics folder and files, you can define your metrics in `.yml` files nested under a `metrics` key.  

1. Add the metric definitions found in the [Jaffle Shop](https://github.com/dbt-labs/jaffle_shop_metrics) example to your dbt project. For example, to add an expenses metric, reference the following metrics you can define directly in your metrics folder: 
      
<VersionBlock firstVersion="1.3">

```sql
version: 2

metrics:
  - name: expenses
    label: Expenses
    model: ref('orders')
    description: "The total expenses of our jaffle business"

    calculation_method: sum
    expression: amount / 4

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
</VersionBlock> 

<VersionBlock lastVersion="1.2">

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
</VersionBlock>       

1. Click **Save** and **Compile** the code.
2. Commit and merge the code changes that contain the metric definitions.
3. If you'd like to further design and define your own metrics, review the following documentation:

    - [dbt metrics](/docs/building-a-dbt-project/metrics) will povide you in-depth detail on attributes, properties, filters, and how to define and query metrics.
   
    - Visit the [How to design and structure dbt metrics: Recommendations for getting started](https://docs.getdbt.com/blog/how-to-design-and-structure-metrics) blog to understand best practices for designing and structuring metrics in your dbt project.

## Develop and query metrics

You can dynamically develop and query metrics directly in dbt and verify their accuracy *before* running a job in the deployment environment by using the `metrics.calculate` and `metrics.develop` macros.

To understand when and how to use the macros above, review [dbt metrics](/docs/building-a-dbt-project/metrics) and make sure you install the [dbt_metrics package](https://github.com/dbt-labs/dbt_metrics) first before using the above macros.

:::info 📌 

**Note:** you will need access to dbt Cloud and the dbt Semantic Layer from your integrated partner tool of choice. 

:::

## Run your production job

Once you’ve defined metrics in your dbt project, you can perform a job run in your deployment environment to materialize your metrics. The deployment environment is only supported for the dbt Semantic Layer at this moment. 

1. Go to **Deploy** in the navigation and select **Jobs** to re-run the job with the most recent code in the deployment environment.
2. Your metric should appear as a red node in the dbt Cloud IDE and dbt directed acyclic graphs (DAG).

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/metrics_red_nodes.png" title="DAG with metrics appearing as a red node" />


**What’s happening internally?**

- Merging the code into your main branch allows dbt Cloud to pull those changes and builds the definition in the manifest produced by the run.
- Re-running the job in the deployment environment helps materialize the models, which the metrics depend on, in the data platform. It also makes sure that the manifest is up to date.
- Your dbt Metadata API pulls in the most recent manifest and allows your integration information to extract metadata from it.

## Set up dbt Semantic Layer

Before continuing, you must have a multi-tenant dbt Cloud account hosted in North America to set up the dbt Semantic Layer in dbt Cloud.  Team and Enterprise accounts will be able to set up the Semantic Layer and [Metadata API](/docs/dbt-cloud/dbt-cloud-api/metadata/metadata-overview) in the integrated partner tool to import metric definition. Developer accounts will be able to query the Proxy Server using SQL but will not be able to browse dbt metrics in external tools, which requires access to the Metadata API.

To query your dbt metrics in an integrated partner tool, you need to [set up the dbt Semantic Layer](/docs/use-dbt-semantic-layer/setup-dbt-semantic-layer#set-up-dbt-semantic-layer) in dbt Cloud to connect with your integration tool:

1. In your dbt Cloud account, go to **Account Settings** and then **Service Tokens** to create a new [service account API token](/docs/dbt-cloud/dbt-cloud-api/service-tokens). 
2. You won't be able to see your token again so we recommend you copy it somewhere safe.
3. Go to **Deploy** and then **Environment**, and select your **Deployment** environment.
4. In the upper right side of the page, click **Settings** and then **Edit**.
5. Select dbt Version 1.2 (latest) or higher.
6. Toggle the Semantic Layer **On.**
7. Copy the Proxy Server URL to connect to your [integrated partner tool](https://www.getdbt.com/product/semantic-layer-integrations). 
8. If supported by your tool, provide an API service token with metadata access. 
9. You can now run precise and consistent queries with the dbt Semantic Layer.
      
## Troubleshooting

If you're encountering some issues when defining your metrics or setting up the dbt Semantic Layer, check out a list of answers to some of the questions or problems you may be experiencing.
    
<details>
  <summary>How are you storing my data?</summary>
  <div>
    <div>dbt does not store your data, we temporarily ingest the data from the cloud data platform, pass it to connecting tool, and then drop the data.</div>
  </div>
</details>
<details><summary>Is the dbt Semantic Layer open source?</summary>
  <div>
    <div>Some components of the dbt Semantic Layer are open source like dbt-core, the dbt_metrics package, and the BSL licensed dbt-server. The dbt Proxy Server (what is actually compiling the dbt code) and the Metadata API are not open source. <br></br>
      
During Public Preview, the dbt Semantic Layer is open to all dbt Cloud tiers (Developer, Team, and Enterprise). <br></br>
      
Team and Enterprise accounts will be able to set up the Semantic Layer and Metadata API in the integrated partner tool to import metric definition.<br></br> 
     
Developer accounts will be able to query the Proxy Server using SQL, but will not be able to browse pre-populated dbt metrics in external tools, which requires access to the Metadata API.</div></div>
</details>
<details>
    <summary>The <code>dbt_metrics_calendar_table</code> does not exist or is not authorized? </summary>
  <div>
    <div>All metrics queries are dependent on either the <code>dbt_metrics_calendar_table</code> or a custom calendar set in the users <code>dbt_project.yml</code>. If you have not created this model in the database, these queries will fail and you'll most likely see the following error message:

<code>Object DATABASE.SCHEMA.DBT_METRICS_DEFAULT_CALENDAR does not exist or not authorized.</code><br></br>

<b>Fix</b>
      
- If developing locally, run <code>dbt run --select dbt_metrics_default_calendar</code>
- If you are using this in production, make sure that you perform a full <code>dbt build</code> or <code>dbt run</code>. If you are running specific <code>selects</code> in your production job, then you will not create this required model.
    </div>
  </div>
</details>
<details>
  <summary>Ephemeral Models - Object does not exist or is not authorized</summary>
  <div>
    <div>Metrics cannot be defined on <a href="/docs/building-a-dbt-project/metrics">ephemeral models</a> because we reference the underlying table in the query that generates the metric so we need the table/view to exist in the database. If your table/view does not exist in your database, you'll likely see this error message:

 <code>Object 'DATABASE.SCHEMA.TESTING_EPHEMERAL does not exist or not authorized.</code><br></br>

<b>Fix:</b>

- You will need to materialize the model that the metric is built on as a table/view/incremental.

</div>
  </div>
</details>
        
<details>
  <summary>Mismatched Versions - metric type is ‘’</summary>
  <div>
    <div>If you’re running <code>dbt_metrics </code> ≥v0.3.2 but have <code>dbt-core</code> version ≥1.3.0, you’ll likely see these error messages:

- Error message 1: <code>The metric NAME also references ... but its type is ''. Only metrics of type expression can reference other metrics.</code>
- Error message 2: <code>Unknown aggregation style:   > in macro default__gen_primary_metric_aggregate (macros/sql_gen/gen_primary_metric_aggregate.sql)</code>

The reason you're experiencing this error is because we changed the <code>type</code> property of the metric spec in dbt-core v1.3.0. The new name is <code>calculation_method</code> and the package reflects that new name, so it isn’t finding any <code>type</code> when we try and run outdated code on it.**

<b>Fix:</b>

 - Upgrade your <a href="https://hub.getdbt.com/dbt-labs/metrics/latest/">dbt_metrics</a> package to v1.3.0

</div>
  </div>
</details>        
      <br></br>   

   
## Next steps

Are you ready to define your own metrics and bring consistency to data consumers? Review the following documents to understand how to structure, define, and query metrics, and set up the dbt Semantic Layer: 

- [How to design and structure dbt metrics: Recommendations for getting started](https://docs.getdbt.com/blog/how-to-design-and-structure-metrics) to understand best practices for designing and structuring metrics in your dbt project
- [dbt metrics](/docs/building-a-dbt-project/metrics) for in-depth detail on attributes, properties, filters, and how to define and query metrics
- [dbt Semantic Layer](/docs/use-dbt-semantic-layer/setup-dbt-semantic-layer#set-up-dbt-semantic-layer) to learn about the dbt Semantic Layer
- [Getting started with the Semantic Layer](https://docs.getdbt.com/blog/getting-started-with-the-dbt-semantic-layer) blog post to see further examples
