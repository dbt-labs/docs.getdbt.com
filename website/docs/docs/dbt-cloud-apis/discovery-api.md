---
title: "About the Discovery API"
pagination_next: "docs/dbt-cloud-apis/discovery-use-cases-and-examples"
---

Every time dbt Cloud runs a project, it generates and stores information about the project. The metadata includes details about your project’s models, sources, and other nodes along with their execution results. With the dbt Cloud Discovery API, you can query this comprehensive information to gain a better understanding of your <Term id="dag">DAG</Term> and the data it produces.

By leveraging the metadata in dbt Cloud, you can create systems for data monitoring and alerting, lineage exploration, and automated reporting. This can help you improve data discovery, data quality, and pipeline operations within your organization.

You can access the Discovery API through [ad hoc queries](/docs/dbt-cloud-apis/discovery-querying), custom applications, a wide range of [partner ecosystem integrations](https://www.getdbt.com/product/integrations/) (like BI/analytics, catalog and governance, and quality and observability), and by using dbt Cloud features like [model timing](/docs/deploy/run-visibility#model-timing) and [data health tiles]/(docs/collaborate/data-tile).

<Lightbox src="/img/docs/dbt-cloud/discovery-api/discovery-api-figure.png" width="80%" title="A rich ecosystem for integration "/>

You can query the dbt Cloud metadata:

- At the [environment](/docs/environments-in-dbt) level for both the latest state (use the `environment` endpoint) and historical run results (use `modelByEnvironment`) of a dbt Cloud project in production.
- At the job level for results on a specific dbt Cloud job run for a given resource type, like `models` or `test`.

<Snippet path="metadata-api-prerequisites" />

## What you can use the Discovery API for

Click the following tabs to learn more about the API's use cases, the analysis you can do, and the results you can achieve by integrating with it.

To use the API directly or integrate your tool with it, refer to [Uses case and examples](/docs/dbt-cloud-apis/discovery-use-cases-and-examples) for detailed information.

<Tabs>

<TabItem value="performance" label="Performance">

Use the API to look at historical information like model build time to determine the health of your dbt projects. Finding inefficiencies in orchestration configurations can help decrease infrastructure costs and improve timeliness. To learn more about how to do this, refer to [Performance](/docs/dbt-cloud-apis/discovery-use-cases-and-examples#performance).

You can use, for example, the [model timing](/docs/deploy/run-visibility#model-timing) tab to help identify and optimize bottlenecks in model builds:

<Lightbox src="/img/docs/dbt-cloud/discovery-api/model-timing.png" width="200%" title="Model timing visualization in dbt Cloud"/>

</TabItem>

<TabItem value="quality" label="Quality">

Use the API to determine if the data is accurate and up-to-date by monitoring test failures, source freshness, and run status. Accurate and reliable information is valuable for analytics, decisions, and monitoring to help prevent your organization from making bad decisions. To learn more about this, refer to [Quality](/docs/dbt-cloud-apis/discovery-use-cases-and-examples#quality).

When used with [webhooks](/docs/deploy/webhooks), it can also help with detecting, investigating, and alerting issues.

</TabItem>

<TabItem value="discovery" label="Discovery">

Use the API to find and understand dbt assets in integrated tools using information like model and metric definitions, and column information. For more details, refer to [Discovery](/docs/dbt-cloud-apis/discovery-use-cases-and-examples#discovery).

Data producers must manage and organize data for stakeholders, while data consumers need to quickly and confidently analyze data on a large scale to make informed decisions that improve business outcomes and reduce organizational overhead. The API is useful for discovery data experiences in catalogs, analytics, apps, and machine learning (ML) tools. It can help you understand the origin and meaning of datasets for your analysis.

<Lightbox src="/img/docs/collaborate/dbt-explorer/example-model-details.png" width="200%" title="Data lineage produced by dbt" />

</TabItem>

<TabItem value="governance" label="Governance">

Use the API to review who developed the models and who uses them to help establish standard practices for better governance. For more details, refer to [Governance](/docs/dbt-cloud-apis/discovery-use-cases-and-examples#governance).

</TabItem>

<TabItem value="development" label="Development">

Use the API to review dataset changes and uses by examining exposures, lineage, and dependencies. From the investigation, you can learn how to define and build more effective dbt projects. For more details, refer to [Development](/docs/dbt-cloud-apis/discovery-use-cases-and-examples#development).



<Lightbox src="/img/docs/collaborate/dbt-explorer/data-tile-pass.jpg" width="60%" title="Use exposures to embed data health tiles in your dashboards to distill trust signals for data consumers." />

</TabItem>


</Tabs>

## Types of project state

There are two types of [project state](/docs/dbt-cloud-apis/project-state) at the environment level that you can query the results of:

- **Definition** &mdash; The logical state of a dbt project’s [resources](/docs/build/projects) that update when the project is changed.
- **Applied** &mdash; The output of successful dbt DAG execution that creates or describes the state of the database (for example: `dbt run`, `dbt test`, source freshness, and so on)

These states allow you to easily examine the difference between a model’s definition and its applied state so you can get answers to questions like, did the model run? or did the run fail? Applied models exist as a table/view in the data platform given their most recent successful run.

## Related docs

- [Use cases and examples for the Discovery API](/docs/dbt-cloud-apis/discovery-use-cases-and-examples)
- [Query the Discovery API](/docs/dbt-cloud-apis/discovery-querying)
- [Schema](/docs/dbt-cloud-apis/discovery-schema-job)
