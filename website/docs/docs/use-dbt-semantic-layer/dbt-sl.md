---
title: "dbt Semantic Layer"
id: dbt-sl
description: "Learn how the dbt Semantic Layer enables data teams to centrally define and query metrics."
sidebar_label: "About the dbt Semantic Layer"
tags: [Semantic Layer]
hide_table_of_contents: true
pagination_next: "docs/use-dbt-semantic-layer/quickstart-sl"
pagination_prev: null
---

<VersionBlock firstVersion="1.6">



The dbt Semantic Layer, powered by [MetricFlow](/docs/build/about-metricflow), simplifies the process of defining and using critical business metrics, like `revenue` in the modeling layer (your dbt project). By centralizing metric definitions, data teams can ensure consistent self-service access to these metrics in downstream data tools and applications. The dbt Semantic Layer eliminates duplicate coding by allowing data teams to define metrics on top of existing models and automatically handles data joins. 

Moving metric definitions out of the BI layer and into the modeling layer allows data teams to feel confident that different business units are working from the same metric definitions, regardless of their tool of choice. If a metric definition changes in dbt, it’s refreshed everywhere it’s invoked and creates consistency across all applications. 

Refer to the [Why we need a universal semantic layer](https://www.getdbt.com/blog/universal-semantic-layer/)  blog post to learn more.

## Explore the dbt Semantic Layer
<!-- this partial lives here: https://github.com/dbt-labs/docs.getdbt.com/website/snippets/_sl-plan-info. Use it on diff pages and to tailor the message depending which instance can access the SL and what product lifecycle we're in. -->

import Features from '/snippets/_sl-plan-info.md'

<Features
product="dbt Semantic Layer"
plan="dbt Cloud Team or Enterprise"
/>

<div className="grid--3-col">

<Card
    title="Get started with the dbt Semantic Layer and MetricFlow"
    body="Build and define metrics with MetricFlow, set up the dbt Semantic Layer, and query them using the Semantic Layer API."
    link="/docs/use-dbt-semantic-layer/quickstart-sl"
    icon="dbt-bit"/>

<Card
    title="Set up the dbt Semantic Layer"
    body="Set up the dbt Semantic Layer in dbt Cloud using intuitive navigation."
    link="/docs/use-dbt-semantic-layer/setup-sl"
    icon="dbt-bit"/>

<Card
    title="Architecture"
    body="Learn about the powerful components that make up the dbt Semantic Layer."
    link="/docs/use-dbt-semantic-layer/sl-architecture"
    icon="dbt-bit"/>

<Card
    title="Available integrations"
    body="Review a wide range of partners you can integrate and query with the dbt Semantic Layer."
    link="/docs/use-dbt-semantic-layer/avail-sl-integrations"
    icon="dbt-bit"/>

<Card
    title="dbt Semantic Layer APIs"
    body="Use the dbt Semantic Layer APIs to query metrics in downstream tools for consistent, reliable data metrics."
    link="/docs/dbt-cloud-apis/sl-api-overview"
    icon="dbt-bit"/>

</div>

</VersionBlock>

<VersionBlock lastVersion="1.5">

import LegacyInfo from '/snippets/_legacy-sl-callout.md';

<LegacyInfo />

The dbt Semantic Layer allows your data teams to centrally define essential business metrics like `revenue`, `customer`, and `churn` in the modeling layer (your dbt project) for consistent self-service within downstream data tools like BI and metadata management solutions. The dbt Semantic Layer provides the flexibility to define metrics on top of your existing models and then query those metrics and models in your analysis tools of choice.

Resulting in less duplicate coding for data teams and more consistency for data consumers. 

The dbt Semantic Layer has these main parts:

- Define your metrics in version-controlled dbt project code using [MetricFlow](/docs/build/about-metricflow) 
	* dbt_metrics is now deprecated
- Import your metric definitions using the [Discovery API](/docs/dbt-cloud-apis/discovery-api)
- Query your metric data with the dbt Proxy Server
- Explore and analyze dbt metrics in downstream tools

### What makes the dbt Semantic Layer different?

The dbt Semantic Layer reduces code duplication and inconsistency regarding your business metrics. By moving metric definitions out of the BI layer and into the modeling layer, your data teams can feel confident that different business units are working from the same metric definitions, regardless of their tool of choice. If a metric definition changes in dbt, it’s refreshed everywhere it’s invoked and creates consistency across all applications. You can also use the dbt Semantic Layer to query models and use macros.


## Prerequisites

<Snippet path="sl-prerequisites" />

<Snippet path="sl-considerations-banner" />


## Manage metrics

:::info 📌

New to dbt or metrics? Check out our [quickstart guide](/guides) to build your first dbt project! If you'd like to define your first metrics, try our [Jaffle Shop](https://github.com/dbt-labs/jaffle_shop_metrics) example project.

:::

If you're not sure whether to define a metric in dbt or not, ask yourself the following: 

> *Is this something our teams consistently need to report on?*  

An important business metric should be:

- Well-defined (the definition is agreed upon throughout the entire organization)
- Time-bound (able to be compared across time)

A great example of this is **revenue**. It can be aggregated on multiple levels (weekly, monthly, and so on) and is key for the broader business to understand.

- ✅ `Monthly recurring revenue` or `Weekly active users` or `Average order value` 
- ❌ `1-off experimental metric`


### Design and define metrics

You can design and define your metrics in `.yml` files nested under a metrics key in your dbt project. For more information, refer to these docs: <br />

- [dbt metrics](docs/build/metrics) for in-depth detail on attributes, filters, how to define and query your metrics, and [dbt-metrics package](https://github.com/dbt-labs/dbt_metrics)
- [dbt Semantic Layer quickstart](/docs/use-dbt-semantic-layer/quickstart-semantic-layer) to get started

## Related questions

<details>
  <summary>How do I migrate from the legacy Semantic Layer to the new one?</summary>
  <div>
    <div>If you're using the legacy Semantic Layer, we highly recommend you <a href="https://docs.getdbt.com/docs/dbt-versions/upgrade-core-in-cloud">upgrade your dbt version </a> to dbt v1.6 or higher to use the new dbt Semantic Layer. Refer to the dedicated <a href="https://docs.getdbt.com/guides/sl-migration"> migration guide</a> for more info.</div>
  </div>
</details>
    
<details>
  <summary>How are you storing my data?</summary>
  <div>
    <div>The dbt Semantic Layer doesn't store, cache, or log your data. On each query to the Semantic Layer, the resulting data passes through dbt Cloud servers where it's never stored, cached, or logged. The data from your data platform gets routed through dbt Cloud servers to your connecting data tool.</div>
  </div>
</details>
<details>
  <summary>Is the dbt Semantic Layer open source?</summary>
  <div>
    <div>Some components of the dbt Semantic Layer are open source like dbt-core, the dbt_metrics package, and the BSL-licensed dbt-server. The dbt Proxy Server (what is actually compiling the dbt code) and the Discovery API are not open source. <br></br><br></br>
      
During Public Preview, the dbt Semantic Layer is open to all dbt Cloud tiers &mdash; Developer, Team, and Enterprise.<br></br><br></br>

 </div> </div>
</details>
<details>
    <summary>Is there a dbt Semantic Layer discussion hub?</summary>
  <div>
    <div>Yes, absolutely! Join the <a href="https://getdbt.slack.com">dbt Slack community</a> and <a href="https://getdbt.slack.com/archives/C046L0VTVR6">#dbt-cloud-semantic-layer slack channel</a> for all things related to the dbt Semantic Layer. 
    </div>
  </div>
</details>
      <br></br>
</VersionBlock>
