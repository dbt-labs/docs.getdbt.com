---
title: "Get started with the dbt Semantic Layer"
id: quickstart-sl
description: "Use this guide to build and define metrics, set up the dbt Semantic Layer, and query them using the Semantic Layer APIs."
sidebar_label: "Get started with the dbt Semantic Layer"
tags: [Semantic Layer]
meta:
  api_name: dbt Semantic Layer API
---

<VersionBlock firstVersion="1.6">

import NewSLChanges from '/snippets/_new-sl-changes.md';
import InstallMetricFlow from '/snippets/_sl-install-metricflow.md';
import CreateModel from '/snippets/_sl-create-semanticmodel.md';
import DefineMetrics from '/snippets/_sl-define-metrics.md';
import ConfigMetric from '/snippets/_sl-configure-metricflow.md';
import TestQuery from '/snippets/_sl-test-and-query-metrics.md';



<NewSLChanges />

The dbt Semantic Layer, powered by [MetricFlow](/docs/build/about-metricflow), simplifies defining and using critical business metrics. It centralizes metric definitions, eliminates duplicate coding, and ensures consistent self-service access to metrics in downstream tools. 

MetricFlow is a powerful component within the dbt Semantic Layer that helps users define and manage company metrics efficiently. It provides flexible abstractions and SQL query generation and also allows data consumers to retrieve metric datasets quickly and easily from a data platform.

Use this guide to fully experience the power of a universal dbt Semantic Layer. Here are the following steps you'll take:

- [Create a semantic model](#create-a-semantic-model) with MetricFlow
- [Define metrics](#define-metrics) with MetricFlow
- [Test and query metrics locally](#test-and-query-metrics) with MetricFlow 
- [Run a production job](#run-a-production-job) in dbt Cloud
- [Set up dbt Semantic Layer](#setup) in dbt Cloud 
- [Connect and query API](#connect-and-query-api) with dbt Cloud

## Prerequisites

import SetUp from '/snippets/_v2-sl-prerequisites.md';

<SetUp />

:::tip 
New to dbt or metrics? Try our [Jaffle shop example project](https://github.com/dbt-labs/jaffle-sl-template) to help you get started!
:::

## Install MetricFlow

<InstallMetricFlow />

## Create a semantic model

<CreateModel />

## Define metrics

<DefineMetrics />

## Test and query metrics

<TestQuery />

## Run a production job

Once you’ve defined metrics in your dbt project, you can perform a job run in your deployment environment to materialize your metrics. The deployment environment is only supported for the dbt Semantic Layer at this moment. 

1. Go to **Deploy** in the navigation header
2. Select **Jobs** to re-run the job with the most recent code in the deployment environment.
3. Your metric should appear as a red node in the dbt Cloud IDE and dbt directed acyclic graphs (DAG).

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/metrics_red_nodes.png" width="85%" title="DAG with metrics appearing as a red node" />


<details>

<summary>What’s happening internally?</summary>
- Merging the code into your main branch allows dbt Cloud to pull those changes and builds the definition in the manifest produced by the run. <br />
- Re-running the job in the deployment environment helps materialize the models, which the metrics depend on, in the data platform. It also makes sure that the manifest is up to date.<br />
- The Semantic Layer APIs pulls in the most recent manifest and allows your integration information to extract metadata from it.
</details>

## Set up dbt Semantic Layer

import SlSetUp from '/snippets/_new-sl-setup.md';  

<SlSetUp/>


## Connect and query API

You can query your metrics in a JDBC-enabled tool or use existing first-class integrations with the dbt Semantic Layer. In order to do so, you must have a dbt Cloud Team or Enterprise [multi-tenant](/docs/cloud/about-cloud/regions-ip-addresses) deployment, hosted in North America. 

- <span>To learn how to use the JDBC API and what tools you can query it with, refer to the  <a href="https://docs.getdbt.com/docs/dbt-cloud-apis/sl-api-overview" target="_self">{frontMatter.meta.api_name}</a></span>.<br />

    * To authenticate, you need to [generate a service token](/docs/dbt-cloud-apis/service-tokens) with Semantic Layer Only and Metadata Only permissions.
    * Refer to the [SQL query syntax](/docs/dbt-cloud-apis/sl-jdbc#querying-the-api-for-metric-metadata) to query metrics using the API.  

- To learn more about the sophisticated integrations that connect to the dbt Semantic Layer, refer to [Available integrations](/docs/use-dbt-semantic-layer/avail-sl-integrations) for more info.


## FAQs

If you're encountering some issues when defining your metrics or setting up the dbt Semantic Layer, check out a list of answers to some of the questions or problems you may be experiencing.
    
<details>
  <summary>How do I migrate from the legacy Semantic Layer to the new one?</summary>
  <div>
    <div>If you're using the legacy Semantic Layer, we highly recommend you <a href="https://docs.getdbt.com/docs/dbt-versions/upgrade-core-in-cloud">upgrade your dbt version </a> to dbt v1.6 or higher to use the new dbt Semantic Layer. Refer to the dedicated <a href="https://docs.getdbt.com/guides/migration/sl-migration"> migration guide</a> for more info.</div>
  </div>
</details>
<details>
<summary>How are you storing my data?</summary>
User data passes through the Semantic Layer on its way back from the warehouse. dbt Labs ensures security by authenticating through the customer's data warehouse. Currently, we don't cache data for the long term, but it might temporarily stay in the system for up to 10 minutes, usually less. In the future, we'll introduce a caching feature that allows us to cache data on our infrastructure for up to 24 hours.
</details>
<details>
<summary>Is the dbt Semantic Layer open source?</summary>
The dbt Semantic Layer is proprietary, however, some components of the dbt Semantic Layer are open source, like dbt-core and MetricFlow. <br /><br />The universal dbt Semantic Layer is available to all Team and Enterprise Plans during public beta. Users on dbt Cloud Developer plans or dbt Core users can use MetricFlow to only define and test metrics locally.</details>
<br></br> 

## Next steps

Review the following documents to learn more and get started:

- [Build your metrics](/docs/build/build-metrics-intro)
- [Set up dbt Semantic Layer](docs/use-dbt-semantic-layer/setup-dbt-sl)
- [Available integrations](/docs/use-dbt-semantic-layer/avail-sl-integrations)

</VersionBlock>

<VersionBlock lastVersion="1.5">

import LegacyInfo from '/snippets/_legacy-sl-callout.md';

<LegacyInfo />

To try out the features of the dbt Semantic Layer, you first need to have a dbt project set up. This quickstart guide will lay out the following steps, and recommends a workflow that demonstrates some of its essential features:

- Install dbt metrics package 
  * Note: this package will be deprecated very soon and we highly recommend you to use the new [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl?version=1.6), available in dbt v 1.6 or higher. 
- Define metrics
- Query, and run metrics
- Configure the dbt Semantic Layer

## Prerequisites

To use the dbt Semantic Layer, you’ll need to meet the following:

<Snippet path="sl-prerequisites" />

<Snippet path="sl-considerations-banner" />


:::info 📌 

New to dbt or metrics? Check out our [quickstart guide](/quickstarts) to build your first dbt project! If you'd like to define your first metrics, try our [Jaffle Shop](https://github.com/dbt-labs/jaffle_shop_metrics) example project.

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

    - [dbt metrics](/docs/build/metrics) will provide you in-depth detail on attributes, properties, filters, and how to define and query metrics.

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
- Your dbt Discovery API pulls in the most recent manifest and allows your integration information to extract metadata from it.

## Set up dbt Semantic Layer
    
<Snippet path="sl-set-up-steps" />

      
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
    <div>Some components of the dbt Semantic Layer are open source like dbt-core, the dbt_metrics package, and the BSL-licensed dbt-server. The dbt Proxy Server (what is actually compiling the dbt code) and the Discovery API are not open sources. <br></br><br></br>

During Public Preview, the dbt Semantic Layer is open to all dbt Cloud tiers (Developer, Team, and Enterprise).<br></br><br></br>
<ul>    
<li>dbt Core users can define metrics in their dbt Core projects and calculate them using macros from the metrics package. To use the dbt Semantic Layer integrations, you will need to have a dbt Cloud account.</li><br></br><br></br>
<li>Developer accounts will be able to query the Proxy Server using SQL, but will not be able to browse pre-populated dbt metrics in external tools, which requires access to the Discovery API.</li><br></br><br></br>
<li>Team and Enterprise accounts will be able to set up the Semantic Layer and Discovery API in the integrated partner tool to import metric definitions.</li>
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

- [dbt metrics](/docs/build/metrics) for in-depth detail on attributes, properties, filters, and how to define and query metrics
- [dbt Server repo](https://github.com/dbt-labs/dbt-server), which is a persisted HTTP server that wraps dbt core to handle RESTful API requests for dbt operations. 

</VersionBlock>
