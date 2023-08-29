---
title: "dbt Semantic Layer integration best practices" 
id: "sl-partner-integration-guide"
description: Learn about partner integration guidelines, roadmap, and connectivity. 
---


import NewChanges from '/snippets/_new-sl-changes.md';

<NewChanges/>

To fit your tool within the world of the Semantic Layer, dbt Labs offers some best practice recommendations for how to expose metrics and allow users to interact with them seamlessly. 

:::note
This is an evolving guide that is meant to provide recommendations based on our experience. If you have any feedback, we'd love to hear it!
:::


## Requirements

To build a dbt Semantic Layer integration: 

- We offer a [JDBC](/docs/dbt-cloud-apis/sl-jdbc) API (and will soon offer a GraphQL API). Refer to the dedicated [dbt Semantic Layer API](/docs/dbt-cloud-apis/sl-api-overview) for more technical integration details.

- Familiarize yourself with the [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl) and [MetricFlow](/docs/build/about-metricflow)'s key concepts. There are two main objects: 

  - [Semantic models](/docs/build/semantic-models) &mdash; Nodes in your semantic graph, connected via entities as edges. MetricFlow takes semantic models defined in YAML configuration files as inputs and creates a semantic graph that you can use to query metrics. 
  - [Metrics](/docs/build/metrics-overview) &mdash; Can be defined in the same YAML files as your semantic models, or split into separate YAML files into any other subdirectories (provided that these subdirectories are also within the same dbt project repo).

### Connection parameters

The dbt Semantic Layer APIs authenticate with `environmentId`, `SERVICE_TOKEN`, and `host`.

We recommend you provide users with separate input fields with these components for authentication (dbt Cloud will surface these parameters for the user). 


## Best practices on exposing metrics

Best practices for exposing metrics are summarized into five themes:

- [Governance](#governance-and-traceability) &mdash; Recommendations on how to establish guardrails for governed data work.
- [Discoverability](#discoverability) &mdash; Recommendations on how to make user-friendly data interactions.
- [Organization](#organization) &mdash; Organize metrics and dimensions for all audiences.
- [Query flexibility](#query-flexibility) &mdash; Allow users to query either one metric alone without dimensions or multiple metrics with dimensions.
- [Context and interpretation](#context-and-interpretation) &mdash; Contextualize metrics for better analysis; expose definitions, metadata, lineage, and freshness.

### Governance and traceability

When working with more governed data, it's essential to establish clear guardrails. Here are some recommendations:

- **Aggregations control** &mdash; Users shouldn't generally be allowed to modify aggregations unless they perform post-processing calculations on Semantic Layer data (such as year-over-year analysis).

- **Time series alignment and using metric_time** &mdash; Make sure users view metrics across the correct time series. When displaying metric graphs, using a non-default time aggregation dimension might lead to misleading interpretations. While users can still group by other time dimensions, they should be careful not to create trend lines with incorrect time axes.<br /><br />When looking at one or multiple metrics, users should use `metric_time` as the main time dimension to guarantee they are looking at the right time series for the metric(s). <br /><br /> As such, when building an application, we recommend exposing `metric_time` as a separate, "special" time dimension on its own. This dimension is always going to align with all metrics and be common across them. Other time dimensions can still be looked at and grouped by, but having a clear delineation between the `metric_time` dimension and the other time dimensions is clarifying so that people do not confuse how metrics should be plotted. <br /><br /> Also, when a user requests a time granularity change for the main time series, the query that your application runs should use `metric_time` as this will always give you the correct slice. Note that when looking at a single metric, the primary time dimension and `metric_time` are equivalent. 

- **Units consistency** &mdash; If units are supported, it's vital to avoid plotting data incorrectly with different units. Ensuring consistency in unit representation will prevent confusion and misinterpretation of the data.

- **Traceability of metric and dimension changes** &mdash; When users change names of metrics and dimensions for reports, it's crucial to have a traceability mechanism in place to link back to the original source metric name.


### Discoverability 

- Consider treating [metrics](/docs/build/metrics-overview) as first-class objects rather than measures. Metrics offer a higher-level and more contextual way to interact with data, reducing the burden on end-users to manually aggregate data.

- Easy metric interactions: Provide users with an intuitive approach to:
    * Search for Metrics &mdash; Users should be able to easily search and find relevant metrics. Metrics can serve as the starting point to lead users into exploring dimensions.
    * Search for Dimensions &mdash; Users should be able to query metrics with associated dimensions, allowing them to gain deeper insights into the data.
    * Filter by Dimension Values &mdash; Expose and enable users to filter metrics based on dimension values, encouraging data analysis and exploration.
    * Filter additional metadata &mdash; Allow users to filter metrics based on other available metadata, such as metric type and default time granularity.

- Suggested Metrics: Ideally, the system should intelligently suggest relevant metrics to users based on their team's activities. This approach encourages user exposure, facilitates learning, and supports collaboration among team members.

By implementing these recommendations, the data interaction process becomes more user-friendly, empowering users to gain valuable insights without the need for extensive data manipulation.

### Organization 

We recommend organizing metrics and dimensions in ways that a non-technical user can understand the data model, without needing much context:

- **Organizing Dimensions** &mdash; To help non-technical users understand the data model better, we recommend organizing dimensions based on the entity they originated from. For example, consider dimensions like `user__country` and `product__category`.<br /><br />  You can create groups by extracting `user` and `product` and then nest the respective dimensions under each group. This way, dimensions align with the entity or semantic model they belong to and make them more user-friendly and accessible.

- **Organizing Metrics** &mdash; The goal is to organize metrics into a hierarchy in our configurations, instead of presenting them in a long list.<br /><br /> This hierarchy helps you organize metrics based on specific criteria, such as business unit or team. By providing this structured organization, users can find and navigate metrics more efficiently, enhancing their overall data analysis experience.

### Query flexibility

Allow users to query either one metric alone without dimensions or multiple metrics with dimensions.

- Allow toggling between metrics/dimensions seamlessly.

- Be clear on exposing what dimensions are queryable with what metrics and hide things that don’t apply, and vice versa.

- Only expose time granularities (monthly, daily, yearly) that match the available metrics. 
  * For example, if a dbt model and its resulting semantic model have a monthly granularity, make sure querying data with a 'daily' granularity isn't available to the user. Our APIs have functionality that will help you surface the correct granularities

- We recommend that time granularity is treated as a general time dimension-specific concept and that it can be applied to more than just the primary aggregation (or `metric_time`). Consider a situation where a user wants to look at `sales` over time by `customer signup month`; in this situation, having the ability to apply granularities to both time dimensions is crucial. Note: Initially, as a starting point, it makes sense to only support `metric_time` or the primary time dimension, but we recommend expanding that as your solution evolves. 

- You should allow users to filter on date ranges and expose a calendar and nice presets for filtering these. 
  * For example, last 30 days, last week, and so on.

### Context and interpretation

For better analysis, it's best to have the context of the metrics close to where the analysis is happening. We recommend the following:

- Expose business definitions of the metrics as well as logical definitions.

- Expose additional metadata from the Semantic layer (measures, type parameters).

- Use the [Discovery API](/docs/dbt-cloud-apis/discovery-api) to enhance the metric and build confidence in its accuracy:
  * Check if the metric is fresh and when it was last updated.
  * Include lineage information to understand the metric's origin.

- Allow for creating other metadata that’s useful for the metric. We can provide some of this information in our configuration (Display name, Default Granularity for View, Default Time range), but there may be other metadata that your tool wants to provide to make the metric richer.

## Example stages of an integration

These are recommendations on how to evolve a Semantic Layer integration and not a strict runbook.

**Stage 1 - The basic**
* Supporting and using the new [JDBC](/docs/dbt-cloud-apis/sl-jdbc) is the first step. Refer to the [dbt Semantic Layer API](/docs/dbt-cloud-apis/sl-api-overview) for more technical details. 

**Stage 2 - More discoverability and basic querying**
* Support listing metrics defined in the project
* Listing available dimensions based on one or many metrics
* Querying defined metric values on their own or grouping by available dimensions
* Display metadata from [Discovery API](/docs/dbt-cloud-apis/discovery-api) and other context

**Stage 3 - More querying flexibility and better user experience (UX)**
* More advanced filtering
  * Time filters with good presets/calendar UX
  * Filtering metrics on a pre-populated set of dimension values
* Make dimension values more user-friendly by organizing them effectively
* Intelligent filtering of metrics based on available dimensions and vice versa

**Stage 4 - More custom user interface (UI) / Collaboration**
* A place where users can see all the relevant information about a given metric
* Organize metrics by hierarchy and more advanced search features (such as filter on the type of metric or other metadata)
* Use and expose more metadata 
* Querying dimensions without metrics and other more advanced querying functionality
* Suggest metrics to users based on teams/identity, and so on.

### A note on transparency and using explain

For transparency and additional context, we recommend you have an easy way for the user to obtain the SQL that MetricFlow generates. Depending on what API you are using, you can do this by using our explain parameter (JDBC) or compileSQL mutation (GraphQL). This is incredibly powerful because we want to be very transparent to the user about what we're doing and do not want to be a black box. This would be mostly beneficial to a technical user.


### A note on where filters

In the cases where our APIs support either a string or a filter list for the `where` clause, we always recommend that your application utilizes the filter list in order to gain maximum pushdown benefits. The `where` string may be more intuitive for users writing queries during testing, but it will not have the performance benefits of the filter list in a production environment.

## Related docs

- [Use the dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl) to learn about the product.
- [Build your metrics](/docs/build/build-metrics-intro) for more info about MetricFlow and its components. 
- [dbt Semantic Layer integrations page](https://www.getdbt.com/product/semantic-layer-integrations) for information about the available partner integrations.
