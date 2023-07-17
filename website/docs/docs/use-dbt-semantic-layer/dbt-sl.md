---
title: "dbt Semantic Layer"
id: dbt-sl
description: "Introducing the improved dbt Semantic Layer, which allows data teams to centrally define and query metrics."
sidebar_label: "About the dbt Semantic Layer"
hide_table_of_contents: true
---

<VersionBlock firstVersion="1.6">

import NewSLChanges from '/snippets/_new-sl-changes.md';

<NewSLChanges />


The dbt Semantic Layer, powered by MetricFlow, simplifies the process of defining and using critical business metrics, like `revenue` in the modeling layer (your dbt project). By centralizing metric definitions, data teams can ensure consistent self-service access to these metrics in downstream data tools and applications. The dbt Semantic Layer eliminates duplicate coding by allowing you to define metrics on top of existing models and automatically handles data joins. 

Moving metric definitions out of the BI layer and into the modeling layer allows data teams to feel confident that different business units are working from the same metric definitions, regardless of their tool of choice. If a metric definition changes in dbt, it’s refreshed everywhere it’s invoked and creates consistency across all applications. 

To read more about why you need a universal Semantic Layer, read this [blog post](https://www.getdbt.com/blog/universal-semantic-layer/).

<Lightbox src="/img/sl-architecture.jpg" width="70%" title="Define and query metrics with the dbt Semantic Layer and seamlessly connect with integration tools for reliable organization-wide metrics." />

## Explore the dbt Semantic Layer

The dbt Semantic Layer is available to all Team and Enterprise Plans during [public beta](/docs/dbt-versions/release-notes/July-2023/sl-revamp-beta#public-beta). Those on dbt Cloud Developer plans or dbt core users can use MetricFlow for defining and testing metrics locally. Start exploring the dbt Semantic Layer by visiting the following pages:

<div className="grid--3-col">

<Card
    title="Get started with the dbt Semantic Layer and MetricFlow"
    body="Build and define metrics with MetricFlow, set up the dbt Semantic Layer, and query them using the Semantic Layer APIs."
    link="/docs/use-dbt-semantic-layer/quickstart-sl"
    icon="dbt-bit"/>

<Card
    title="Set up the dbt Semantic Layer"
    body="Seamlessly set up the dbt Semantic Layer in dbt Cloud using intuitive navigation."
    link="/docs/use-dbt-semantic-layer/setup-sl"
    icon="dbt-bit"/>

<Card
    title="Available integrations"
    body="Review a wide range of partners you can integrate and query with the dbt Semantic Layer."
    link="/docs/use-dbt-semantic-layer/avail-sl-integrations"
    icon="dbt-bit"/>
    
<Card
    title="Semantic Layer APIs"
    body="Use the Semantic Layer APIs to query metrics in downstream tools for consistent, reliable data metrics."
    link="/docs/use-dbt-semantic-layer/sl-api-overview"
    icon="dbt-bit"/>

<Card
    title="Product architecture"
    body="Learn about the powerful components that make up the dbt Semantic Layer."
    link="/docs/use-dbt-semantic-layer/sl-architecture"
    icon="dbt-bit"/>

</div>

</VersionBlock>

<VersionBlock lastVersion="1.5">

import LegacyInfo from '/snippets/_legacy-sl-callout.md';

<LegacyInfo />

The dbt Semantic Layer allows data teams to centrally define essential business metrics like `revenue`, `customer`, and `churn` in the modeling layer (your dbt project) for consistent self-service within downstream data tools like BI and metadata management solutions. The dbt Semantic Layer provides the flexibility to define metrics on top of your existing models and then query those metrics and models in your analysis tools of choice.

The result? You have less duplicate coding for data teams and more consistency for data consumers. 

The dbt Semantic Layer has four main parts:

- Define your metrics in version-controlled dbt project code using MetricFlow 
	* dbt_metrics is now deprecated
- Import your metric definitions via the [Discovery API](/docs/dbt-cloud-apis/discovery-api)
- Query your metric data via the dbt Proxy Server
- Explore and analyze dbt metrics in downstream tools


<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl_architecture.png" title="dbt Semantic Layer architecture" />

### What makes the dbt Semantic Layer different?

The dbt Semantic Layer reduces code duplication and inconsistency regarding your business metrics. By moving metric definitions out of the BI layer and into the modeling layer, data teams can feel confident that different business units are working from the same metric definitions, regardless of their tool of choice. If a metric definition changes in dbt, it’s refreshed everywhere it’s invoked and creates consistency across all applications. You can also use the dbt Semantic Layer to query models and use macros.


## Prerequisites
To use the dbt Semantic Layer, you’ll need to meet the following:

<Snippet path="sl-prerequisites" />

<Snippet path="sl-considerations-banner" />


## Manage metrics

:::info 📌

New to dbt or metrics? Check out our [quickstart guide](/quickstarts) to build your first dbt project! If you'd like to define your first metrics, try our [Jaffle Shop](https://github.com/dbt-labs/jaffle_shop_metrics) example project.

:::

If you're not sure whether to define a metric in dbt or not, ask yourself the following: 

> *Is this something our teams consistently need to report on?*  

An important business metric should be:

- Well-defined (the definition is agreed upon throughout the entire organization)
- Time-bound (able to be compared across time)

A great example of this is **revenue** &mdash; it can be aggregated on multiple levels (weekly, monthly, etc) and is key for the broader business to understand.

- ✅ `Monthly recurring revenue` or `Weekly active users` or `Average order value` 
- ❌ `1-off experimental metric`


### Design and define metrics

**Design metrics**
To read about best practices on structuring and organizing your metrics, review our [How to design and structure dbt metrics: Recommendations for getting started](https://docs.getdbt.com/blog/how-to-design-and-structure-metrics) blog post first.

**Define metrics**
You can define your metrics in `.yml` files nested under a metrics key and to design or define your own metrics in your dbt project, review the following documents: <br />

- [How to design and structure dbt metrics: Recommendations for getting started](https://docs.getdbt.com/blog/how-to-design-and-structure-metrics) blog to understand best practices for designing and structuring metrics in your dbt project
- [dbt metrics](docs/build/metrics) for in-depth detail on attributes, filters, how to define and query your metrics, and [dbt-metrics package](https://github.com/dbt-labs/dbt_metrics)
- [dbt Semantic Layer quickstart](/docs/use-dbt-semantic-layer/quickstart-semantic-layer) to get started
- [Understanding the components of the dbt Semantic Layer](https://docs.getdbt.com/blog/understanding-the-components-of-the-dbt-semantic-layer) blog post to see further examples
    
Review our helpful metrics video below, which explains what metrics are, why they're important, and how you can get started:
    
<LoomVideo id="b120ca9d042d46abad1d873a676bf20a" />    

## Related questions

<details>
  <summary>How do I migrate from the legacy Semantic Layer to the new one?</summary>
  <div>
    <div>If you're using the legacy Semantic Layer, we highly recommend you <a href="https://docs.getdbt.com/docs/dbt-versions/upgrade-core-in-cloud">upgrade your dbt version </a> to dbt v1.6 or higher to use the new dbt Semantic Layer. Refer to the dedicated <a href="https://docs.getdbt.com/guides/migration/sl-migration"> migration guide</a> for more info.</div>
  </div>
</details>
    
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
<li>dbt Core users can define metrics in their dbt Core projects and calculate them using macros from the metrics package. To use the dbt Semantic Layer integrations, users will need to have a dbt Cloud account.</li><br></br>
<li>Developer accounts will be able to query the Proxy Server using SQL, but will not be able to browse pre-populated dbt metrics in external tools, which requires access to the Discovery API.</li><br></br>
<li>Team and Enterprise accounts will be able to set up the Semantic Layer and Discovery API in the integrated partner tool to import metric definition.</li>
    </ul></div> </div>
</details>
<details>
    <summary>Is there a dbt Semantic Layer discussion hub?</summary>
  <div>
    <div>Yes absolutely! Join the <a href="https://getdbt.slack.com">dbt Slack community</a> and <a href="https://getdbt.slack.com/archives/C046L0VTVR6">#dbt-cloud-semantic-layer slack channel</a> for all things related to the dbt Semantic Layer. 
    </div>
  </div>
</details>
      <br></br>
</VersionBlock>
