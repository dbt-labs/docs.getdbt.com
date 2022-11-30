---
title: "dbt Semantic Layer"
id: dbt-semantic-layer
description: "Introducing the dbt Semantic Layer"
sidebar_label: "dbt Semantic Layer"
---

<Snippet src="sl-public-preview-banner" />

The dbt Semantic Layer allows data teams to centrally define essential business metrics like `revenue`, `customer`, and `churn` in the modeling layer (your dbt project) for consistent self-service within downstream data tools like BI and metadata management solutions.

The result? You have less duplicative coding for data teams and more consistency for data consumers. 

The dbt Semantic Layer has four main parts:

- Define your metrics in version-controlled dbt project code
- Import your metric definitions via the [Metadata API](/docs/dbt-cloud-apis/metadata-api)
- Query your metric data via the dbt Proxy Server
- Explore and analyze dbt metrics in downstream tools


<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl_architecture.png" title="dbt Semantic Layer architecture" />

### What makes the dbt Semantic Layer different?

The dbt Semantic Layer reduces code duplication and inconsistency regarding your business metrics. By moving metric definitions out of the BI layer and into the modeling layer, data teams can feel confident that different business units are working from the same metric definitions, regardless of their tool of choice. If a metric definition changes in dbt, it’s refreshed everywhere it’s invoked and creates consistency across all applications.


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

## Public Preview

The dbt Semantic Layer is currently available for Public Preview, which means:

&mdash; **Who?** The dbt Semantic Layer is open to all dbt Cloud tiers (Developer, Team, and Enterprise) during Public Preview. Review [Product architecture](/docs/use-dbt-semantic-layer/dbt-semantic-layer#product-architecture) for more info on plan availability.

- Team and Enterprise accounts will be able to set up the Semantic Layer and [Metadata API](/docs/dbt-cloud-apis/metadata-api) in the integrated
partner tool to import metric definition.
- Developer accounts will be able to query the Proxy Server using SQL, but will not be able to browse dbt metrics in external tools, which                  requires access to the Metadata API. 

&mdash; **What?** Public Previews provide early access to new features. The Semantic Layer is stable and you can use it for production deployments, but there may still be some planned additions and modifications to product behaviors before moving to General Availability. We may also introduce new functionality that is not backwards compatible. dbt Labs provides support, and relevant service level objectives (SLOs) apply. We will introduce pricing for the dbt Semantic Layer alongside the General Available (GA) release (future GA date to be announced).
    
&mdash; **When?** Public Preview will end once the dbt Semantic Layer is available for GA. After GA, the dbt Semantic Layer will only be available to dbt Cloud **Team** and **Enterprise** plans.

&mdash; **Where?** Public Preview is enabled at the account level so you don’t need to worry about enabling it per user.

## Product architecture 

The dbt Semantic Layer product architecture includes four primary components:

| Components | Information | Developer plans | Team plans | Enterprise plans | License |
| --- | --- | :---: | :---: | :---: | --- |
| **[dbt metrics](/docs/build/metrics)** | Allows you to define metrics in dbt Core. | ✅ | ✅ |  ✅  | Open source, Core |
| **[dbt Server](https://github.com/dbt-labs/dbt-server)**| A persisted HTTP server that wraps dbt core to handle RESTful API requests for dbt operations. | ✅ | ✅ | ✅ | BSL |
| **SQL Proxy** | Reverse-proxy that accepts dbt-SQL (SQL + Jinja like query models and metrics, use macros), compiles the query into pure SQL, and executes the query against the data platform. | ✅ <br></br>_* Available during Public Preview only_ | ✅ | ✅ | Proprietary, Cloud (Team & Enterprise) |
| **[Metadata API](/docs/dbt-cloud-apis/metadata-api)**  | Accesses metric definitions primarily via integrations and is the source of truth for objects defined in dbt projects (like models, macros, sources, metrics). The Metadata API is updated at the end of every dbt Cloud run. | ❌ | ✅ | ✅ | Proprietary, Cloud (Team & Enterprise |
    
<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-architecture-flow.png" title="dbt Semantic components" />

dbt Semantic Layer integrations will:

- Leverage the Metadata API to fetch a list of objects and their attributes, like metrics
- Generate a dbt-SQL statement
- Then query the SQL proxy to evaluate the results of this statement


## Manage metrics

:::info 📌

New to dbt or metrics? Check out our [Getting Started guide](/docs/get-started/getting-started/overview) to build your first dbt project! If you'd like to define your first metrics, try our [Jaffle Shop](https://github.com/dbt-labs/jaffle_shop_metrics) example project.

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
- [dbt metrics](docs/build/metrics) for in-depth detail on attributes, filters, how to define and query your metrics and [dbt-metrics package](https://github.com/dbt-labs/dbt_metrics)
- [dbt Semantic Layer quickstart](/docs/use-dbt-semantic-layer/quickstart-semantic-layer) to get started
- [Understanding the components of the dbt Semantic Layer](https://docs.getdbt.com/blog/understanding-the-components-of-the-dbt-semantic-layer) blog post to see further examples
    
Review our helpful metrics video below, which explains what metrics are, why they're important and how you can get started:
    
<LoomVideo id="b120ca9d042d46abad1d873a676bf20a" />    

## Related questions
    
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
<li>dbt Core users can define metrics in their dbt Core projects and calculate them using macros from the metrics package. To use the dbt Semantic Layer integrations, users will need to have a dbt Cloud account.</li><br></br>
<li>Developer accounts will be able to query the Proxy Server using SQL, but will not be able to browse pre-populated dbt metrics in external tools, which requires access to the Metadata API.</li><br></br>
<li>Team and Enterprise accounts will be able to set up the Semantic Layer and Metadata API in the integrated partner tool to import metric definition.</li>
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
