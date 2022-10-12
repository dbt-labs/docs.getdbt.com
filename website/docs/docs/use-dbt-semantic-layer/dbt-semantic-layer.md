---
title: "dbt Semantic Layer"
id: dbt-semantic-layer
description: "Introducing the dbt Semantic Layer"
sidebar_label: "dbt Semantic Layer"
---

:::info 📌

The dbt Semantic Layer is currently available in Public Preview for North American multi-tenant dbt Cloud accounts. With the dbt Semantic Layer, you'll be able to centrally define business metrics, reduce code duplication and inconsistency, create self-service in downstream tools, and more! 

For more info on Public Preview and plan availability, check out the [Public Preview](/docs/use-dbt-semantic-layer/dbt-semantic-layer#public-preview) and [product architecture](/docs/use-dbt-semantic-layer/dbt-semantic-layer#product-architecture) section.
    
:::

The dbt Semantic Layer allows data teams to centrally define essential business metrics like `revenue`, `customer`, and `churn` in the modeling layer (your dbt project) for consistent self-service within downstream data tools like BI and metadata management solutions.

The result? You have less duplicative coding for data teams and more consistency for data consumers. The dbt Semantic Layer has four main parts:

- Define your metrics in version-controlled dbt project code
- Import your metric definitions via the [Metadata API](/docs/dbt-cloud/dbt-cloud-api/metadata/metadata-querying)
- Query your metric data via the dbt Proxy Server
- Explore and analyze dbt metrics in downstream tools


<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl_architecture.png" title="dbt Semantic Layer architecture" />

### What makes the dbt Semantic Layer different?

The dbt Semantic Layer reduces code duplication and inconsistency regarding your business metrics. By moving metric definitions out of the BI layer and into the modeling layer, data teams can feel confident that different business units are working from the same data definitions, regardless of their tool of choice. If a metric definition changes in dbt, it’s refreshed everywhere it’s invoked and creates consistency across all applications.


## Prerequisites
To use the dbt Semantic Layer, you’ll need to meet the following:


<VersionBlock firstVersion="1.3" >

- Have a North American multi-tenant <a href="https://cloud.getdbt.com/">dbt Cloud</a> account. 
  * Developer accounts will be able to query the Proxy Server using SQL, but will not be able to browse pre-populated dbt metrics in external tools, which requires access to the Metadata API. <br />
- Have both your production and development environments running dbt version 1.3 or higher <br />
- Use Snowflake data platform <br />
- Install the <a href="https://hub.getdbt.com/dbt-labs/metrics/latest/">dbt metrics package</a> version <code>">=1.3.0", "<1.4.0"</code> in your dbt project <br />
- Set up the <a href="https://docs.getdbt.com/docs/dbt-cloud/dbt-cloud-api/metadata/metadata-overview">Metadata API</a> in the integrated tool to import metric definitions <br />
- Recommended - Review the <a href="https://docs.getdbt.com/docs/building-a-dbt-project/metrics">dbt metrics page</a> and <a href="https://docs.getdbt.com/blog/getting-started-with-the-dbt-semantic-layer">Getting started with the dbt Semantic Layer</a> blog <br />

</VersionBlock>

<VersionBlock lastVersion="1.2">

- Have a North American multi-tenant <a href="https://cloud.getdbt.com/">dbt Cloud</a> account. 
  * Developer accounts will be able to query the Proxy Server using SQL, but will not be able to browse pre-populated dbt metrics in external tools, which requires access to the Metadata API. <br /> 
- Have both your production and development environments running dbt version 1.2 (latest) <br />
- Use Snowflake data platform <br />
- Install the <a href="https://hub.getdbt.com/dbt-labs/metrics/latest/">dbt metrics package</a> version <code>">=1.3.0", "<1.4.0"</code> in your dbt project <br />
- Set up the <a href="https://docs.getdbt.com/docs/dbt-cloud/dbt-cloud-api/metadata/metadata-overview">Metadata API</a> in the integrated tool to import metric definitions <br />
- Recommended - Review the <a href="https://docs.getdbt.com/docs/building-a-dbt-project/metrics">dbt metrics page</a> and <a href="https://docs.getdbt.com/blog/getting-started-with-the-dbt-semantic-layer">Getting started with the dbt Semantic Layer</a> blog <br />

</VersionBlock>

:::caution Considerations

Some important considerations to know about during the Public Preview:

- Support for Snowflake data platform only (_additional data platforms coming soon_)
- Support for the deployment environment only (_development experience coming soon_)
- Do not use environment variables for the job/environment (_coming soon_)

:::

## Public Preview

The dbt Semantic Layer is currently available for Public Preview, which means:

&mdash; **Who?** The dbt Semantic Layer is open to all dbt Cloud tiers (Developer, Team, and Enterprise) during Public Preview. Team and Enterprise accounts will be able to set up the Semantic Layer and [Metadata API](/docs/dbt-cloud/dbt-cloud-api/metadata/metadata-overview) in the integrated partner tool to import metric definition. Developer accounts will be able to query the Proxy Server using SQL, but will not be able to browse dbt metrics in external tools, which requires access to the Metadata API. For more info on plan availability, check out our [product architecture](/docs/use-dbt-semantic-layer/dbt-semantic-layer#product-architecture) section.

&mdash; **What?** Public Previews provide early access to new features. The Semantic Layer is stable and you can use it for production deployments, but there may still be some planned additions and modifications to product behaviors before moving to General Availability. We may also introduce new functionality that is not backwards compatible. dbt Labs provides support, and relevant service level objectives (SLOs) apply. We will introduce pricing for the dbt Semantic Layer will alongside the General Available (GA) release.

&mdash; **When?** Public Preview will end once the dbt Semantic Layer is available for GA. After GA, the dbt Semantic Layer will only be available to dbt Cloud **Team** and **Enterprise** plans.

&mdash; **Where?** Public Preview is enabled at the account level so you don’t need to worry about enabling it per user.

## Product architecture 

The dbt Semantic Layer product architecture includes four primary components:

| Components | Information | Developer plans | Team plans | Enterprise plans | License |
| --- | --- | :---: | :---: | :---: | --- |
| **dbt metrics** | Allows you to define metrics in dbt Core. | ✅ | ✅ |  ✅  | Open source, Core |
| **dbt Server**| HTTP server that is able to quickly compile metric queries per environment using dbt project code. | ✅ | ✅ | ✅ | BSL |
| **SQL Proxy** | Reverse-proxy that accepts dbt-SQL (SQL + Jinja like query models and metrics, use macros), compiles the query into pure SQL, and executes the query against the data platform. | ✅ <br></br>_* Available during Public Preview only_ | ✅ | ✅ | Proprietary, Cloud (Team & Enterprise) |
| **Metadata API**  | Accesses metric definitions primarily via integrations and is the source of truth for objects defined in dbt projects (like models, macros, sources, metrics). The Metadata API is updated at the end of every dbt Cloud run. | ❌ | ✅ | ✅ | Proprietary, Cloud (Team & Enterprise |

dbt Semantic Layer integrations will:

- Leverage the Metadata API to fetch a list of objects and their attributes, like metrics
- Generate a dbt-SQL statement
- Then query the SQL proxy to evaluate the results of this statement


## Manage metrics

:::info 📌

New to dbt or metrics? Check out our [Getting Started guide](/guides/getting-started) to build your first dbt project! If you'd like to define your first metrics, try our [Jaffle Shop](https://github.com/dbt-labs/jaffle_shop_metrics) example project.

:::

If you're not sure whether to define a metric in dbt or not, ask yourself the following: 

> *Is this something our teams consistently need to report on?*  

An important business metric should be:

- Well-defined (the definition is agreed upon throughout the entire organization)
- Time-bound (able to be compared across time)

A great example of this is **revenue** &mdash; it can be aggregated on multiple levels (weekly, monthly, etc) and is key for the broader business to understand:

- ✅ `Monthly Recurring Revenue` or `Weekly Active Users` or `Average Order Value` 
- ❌ `1-off experimental metric`


### Design and define metrics

You can define your metrics in `.yml` files nested under a metrics key. To start designing or defining your own metrics in your dbt project, review the following documents:

- [Structuring and designing your metrics](URL) blog to understand best practices for designing and structuring metrics in your dbt project
- [dbt metrics](/docs/building-a-dbt-project/metrics) for in-depth detail on attributes, filters, how to define and query your metrics and [dbt-metrics package](https://github.com/dbt-labs/dbt_metrics)
- [dbt Semantic Layer](/docs/use-dbt-semantic-layer/setup-dbt-semantic-layer#set-up-dbt-semantic-layer) to learn about the dbt Semantic Layer
- [Getting started with the Semantic Layer](/docs.getdbt.com/blog/getting-started-with-the-dbt-semantic-layer) blog post to see further examples
