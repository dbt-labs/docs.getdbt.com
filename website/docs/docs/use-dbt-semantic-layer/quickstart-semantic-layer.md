---
title: "Quickstart"
id: quickstart-semantic-layer
description: "Define metrics and set up the dbt Semantic Layer"
sidebar_label: "Quickstart"
---

# dbt Semantic Layer quickstart

<Snippet src="sl-public-preview-banner" />

## Public Preview 
    
We're excited to announce the dbt Semantic Layer is currently available for Public Preview, which means:

&mdash; **Who?** The dbt Semantic Layer is open to all dbt Cloud tiers (Developer, Team, and Enterprise) during Public Preview. Review [Product architecture](/docs/use-dbt-semantic-layer/dbt-semantic-layer#product-architecture) for more info on plan availability.

- Team and Enterprise accounts will be able to set up the Semantic Layer and [Metadata API](/docs/dbt-cloud-apis/metadata-api) in the integrated
partner tool to import metric definition.
- Developer accounts will be able to query the Proxy Server using SQL, but will not be able to browse dbt metrics in external tools, which                  requires access to the Metadata API. 

&mdash; **What?** Public Previews provide early access to new features. The Semantic Layer is stable and you can use it for production deployments, but there may still be some planned additions and modifications to product behaviors before moving to General Availability. We may also introduce new functionality that is not backwards compatible. dbt Labs provides support, and relevant service level objectives (SLOs) apply. We will introduce pricing for the dbt Semantic Layer alongside the General Available (GA) release (future GA date to be announced).
    
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

- Have a multi-tenant dbt Cloud account, <a href="https://docs.getdbt.com/docs/deploy/regions">hosted</a> in North America <br />
- Have both your production and development environments running dbt version 1.3 or higher <br />
- Use Snowflake data platform <br />
- Install the <a href="https://hub.getdbt.com/dbt-labs/metrics/latest/">dbt metrics package</a> version <code>">=1.3.0", "<1.4.0"</code> in your dbt project <br />
- Set up the <a href="https://docs.getdbt.com/docs/dbt-cloud-apis/metadata-api">Metadata API</a> in the integrated tool to import metric definitions
    * Developer accounts will be able to query the Proxy Server using SQL, but won't be able to browse pre-populated dbt metrics in external tools, which requires access to the Metadata API <br />
- Recommended - Review the <a href="https://docs.getdbt.com/docs/build/metrics">dbt metrics page</a> and <a href="https://docs.getdbt.com/blog/understanding-the-components-of-the-dbt-semantic-layer">Understanding the components of the dbt Semantic Layer</a> blog <br />

</VersionBlock>

<VersionBlock lastVersion="1.2">

- Have a multi-tenant dbt Cloud account, <a href="https://docs.getdbt.com/docs/deploy/regions">hosted</a> in North America <br /> 
- Have both your production and development environments running dbt version 1.2 (latest) <br />
- Use Snowflake data platform <br />
- Install the <a href="https://hub.getdbt.com/dbt-labs/metrics/latest/">dbt metrics package</a> version <code>">=0.3.0", "<0.4.0"</code> in your dbt project <br />
- Set up the <a href="https://docs.getdbt.com/docs/dbt-cloud-apis/metadata-api">Metadata API</a> in the integrated tool to import metric definitions 
    * Developer accounts will be able to query the Proxy Server using SQL, but won't be able to browse pre-populated dbt metrics in external tools, which requires access to the Metadata API <br />
- Recommended - Review the <a href="https://docs.getdbt.com/docs/build/metrics">dbt metrics page</a> and <a href="https://docs.getdbt.com/blog/understanding-the-components-of-the-dbt-semantic-layer">Understanding the components of the dbt Semantic Layer</a> blog <br />

</VersionBlock>

<Snippet src="sl-considerations-banner" />


:::info 📌 

New to dbt or metrics? Check out our [Getting Started guide](/docs/get-started/getting-started/overview) to build your first dbt project! If you'd like to define your first metrics, try our [Jaffle Shop](https://github.com/dbt-labs/jaffle_shop_metrics) example project.

:::

## Installing dbt metrics package
The dbt Semantic Layer supports the calculation of metrics by using the [dbt metrics package](https://hub.getdbt.com/dbt-labs/metrics/latest/). You can install the dbt metrics package in your dbt project by copying the below code blocks.


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
3. If you see a successful result, you have now installed the dbt metrics package successfully! 
4. If you have any errors during the `dbt deps` command run, review the system logs for more information on how to resolve them.  Make sure you use a dbt metrics package that’s compatible with your dbt environment version. 

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/metrics_package.png" title="Running dbt deps in the dbt Cloud IDE" />

## Design and define metrics

Review our helpful metrics video below, which explains what metrics are, why they're important and how you can get started:
    
<LoomVideo id="b120ca9d042d46abad1d873a676bf20a" />    

### Design metrics
    
To read about best practices on structuring and organizing your metrics, review our [How to design and structure dbt metrics: Recommendations for getting started](https://docs.getdbt.com/blog/how-to-design-and-structure-metrics) blog post first.

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

1. Click **Save** and then **Compile** the code.
2. Commit and merge the code changes that contain the metric definitions.
3. If you'd like to further design and define your own metrics, review the following documentation:

    - [dbt metrics](/docs/build/metrics) will povide you in-depth detail on attributes, properties, filters, and how to define and query metrics.
   
    - Review [How to design and structure dbt metrics: Recommendations for getting started](https://docs.getdbt.com/blog/how-to-design-and-structure-metrics) blog to understand best practices for designing and structuring metrics in your dbt project.

## Develop and query metrics

You can dynamically develop and query metrics directly in dbt and verify their accuracy _before_ running a job in the deployment environment by using the `metrics.calculate` and `metrics.develop` macros.

To understand when and how to use the macros above, review [dbt metrics](/docs/build/metrics) and make sure you install the [dbt_metrics package](https://github.com/dbt-labs/dbt_metrics) first before using the above macros.

:::info 📌 

**Note:** You will need access to dbt Cloud and the dbt Semantic Layer from your integrated partner tool of choice. 

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
    
<Snippet src="sl-set-up-steps" />

      
## Troubleshooting

If you're encountering some issues when defining your metrics or setting up the dbt Semantic Layer, check out a list of answers to some of the questions or problems you may be experiencing.
    
<details>
  <summary>How are you storing my data?</summary>
  <div>
    <div>The dbt Semantic Layer does not store, or cache, or log your data. On each query to the Semantic Layer, the resulting data passes through dbt Cloud servers where it is never stored, cached, or logged. The data from your data platform gets routed through dbt Cloud servers, to your connecting data tool.</div>
  </div>
</details>
<details>
    <summary>Is the dbt Semantic Layer open source?</summary>
  <div>
    <div>Some components of the dbt Semantic Layer are open source like dbt-core, the dbt_metrics package, and the BSL licensed dbt-server. The dbt Proxy Server (what is actually compiling the dbt code) and the Metadata API are not open source. <br></br><br></br>

During Public Preview, the dbt Semantic Layer is open to all dbt Cloud tiers (Developer, Team, and Enterprise).<br></br><br></br>
<ul>    
<li>dbt Core users can define metrics in their dbt Core projects and calculate them using macros from the metrics package. To use the dbt Semantic Layer integrations, you will need to have a dbt Cloud account.</li><br></br><br></br>
<li>Developer accounts will be able to query the Proxy Server using SQL, but will not be able to browse pre-populated dbt metrics in external tools, which requires access to the Metadata API.</li><br></br><br></br>
<li>Team and Enterprise accounts will be able to set up the Semantic Layer and Metadata API in the integrated partner tool to import metric definitions.</li>
    </ul>
    </div>
    </div>
</details>
<details>
    <summary>The <code>dbt_metrics_calendar_table</code> does not exist or is not authorized?</summary>
  <div>
    <div>All metrics queries are dependent on either the <code>dbt_metrics_calendar_table</code> or a custom calendar set in the users <code>dbt_project.yml</code>. If you have not created this model in the database, these queries will fail and you'll most likely see the following error message:

<code>Object DATABASE.SCHEMA.DBT_METRICS_DEFAULT_CALENDAR does not exist or not authorized.</code><br></br>

<b>Fix:</b>
    
<ul>      
    <li>If developing locally, run <code>dbt run --select dbt_metrics_default_calendar</code></li><br></br>
    <li> If you are using this in production, make sure that you perform a full <code>dbt build</code> or <code>dbt run</code>. If you are running specific <code>selects</code> in your production job, then you will not create this required model.</li>
    </ul>
    </div>
  </div>
</details>
<details>
  <summary>Ephemeral Models - Object does not exist or is not authorized</summary>
  <div>
    <div>Metrics cannot be defined on <a href="https://docs.getdbt.com/docs/build/materializations#ephemeral">ephemeral models</a> because we reference the underlying table in the query that generates the metric so we need the table/view to exist in the database. If your table/view does not exist in your database, you might see this error message:

 <code>Object 'DATABASE.SCHEMA.METRIC_MODEL_TABLE' does not exist or not authorized.</code><br></br>

<b>Fix:</b>
    <ul>
<li>You will need to materialize the model that the metric is built on as a table/view/incremental.</li>
    </ul>
</div>
  </div>
</details>
        
<details>
  <summary>Mismatched Versions - metric type is ‘’</summary>
  <div>
    <div>If you’re running <code>dbt_metrics </code> ≥v0.3.2 but have <code>dbt-core</code> version ≥1.3.0, you’ll likely see these error messages:

<ul>
<li>Error message 1: <code>The metric NAME also references ... but its type is ''. Only metrics of type expression can reference other metrics.</code></li>
<li>Error message 2: <code>Unknown aggregation style:   > in macro default__gen_primary_metric_aggregate (macros/sql_gen/gen_primary_metric_aggregate.sql)</code></li>
    </ul>
The reason you're experiencing this error is because we changed the <code>type</code> property of the metric spec in dbt-core v1.3.0. The new name is <code>calculation_method</code> and the package reflects that new name, so it isn’t finding any <code>type</code> when we try and run outdated code on it.<br></br>

<b>Fix:</b>

<ul>
    <li>Upgrade your <a href="https://hub.getdbt.com/dbt-labs/metrics/latest/">dbt_metrics</a> package to v1.3.0</li>
    </ul>

</div>
  </div>
</details>        
      <br></br>   

   
## Next steps

Are you ready to define your own metrics and bring consistency to data consumers? Review the following documents to understand how to structure, define, and query metrics, and set up the dbt Semantic Layer: 

- [How to design and structure dbt metrics: Recommendations for getting started](https://docs.getdbt.com/blog/how-to-design-and-structure-metrics) to understand best practices for designing and structuring metrics in your dbt project
- [dbt metrics](/docs/build/metrics) for in-depth detail on attributes, properties, filters, and how to define and query metrics
- [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-semantic-layer) to learn about the dbt Semantic Layer
- [Understanding the components of the dbt Semantic Layer](https://docs.getdbt.com/blog/understanding-the-components-of-the-dbt-semantic-layer) blog post to see further examples
- [Integrated partner tools](https://www.getdbt.com/product/semantic-layer-integrations) for info on the different integration partners and their documentation
- [dbt Server repo](https://github.com/dbt-labs/dbt-server), which is a persisted HTTP server that wraps dbt core to handle RESTful API requests for dbt operations.
