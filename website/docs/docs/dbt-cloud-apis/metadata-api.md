---
title: "About the Discovery API"
id: "metadata-api"
---

Every time dbt Cloud runs a project, it generates and stores metadata information about the project. The metadata includes all your project’s history on your models, sources, and other nodes. With the dbt Cloud Discovery API, you can query this comprehensive information to gain a better understanding of your <Term id="dag">DAG</Term> and the data it generates. 

By leveraging the metadata in dbt Cloud, you can create systems for data monitoring and alerting, lineage exploration, and automated reporting with machine learning. This can help you improve data discovery, data quality, and pipeline operations within your organization. 

You can access the Discovery API through ad hoc queries, custom applications, a wide range of [partner ecosystem integrations](https://www.getdbt.com/product/integrations/) (like BI/analytics, catalog and governance, and quality and observability), and by using dbt Cloud features like [model timing](/docs/deploy/dbt-cloud-job#model-timing) and [Dashboard status](/docs/deploy/dashboard-status-tiles).

When viewing the metadata:

- **At the job level** &mdash; You can examine information about a specific job or run.
- **At the environment level** &mdash; You can examine information about the dbt project state. And, you don’t need to query multiple jobs or parse artifact files because dbt Cloud does that for you.

:::tip Public Preview
ACTION ITEM: add language about new Discovery API functionality which is in public preview and Metadata API functionality which is GA 
:::

## Types of project state
If you want to do environment-level analysis, there are two types of [project state](/docs/deploy/project-state) in the Discovery API that help facilitate this:

- **Definition** — The logical state of a dbt project’s [resources](/docs/build/projects) that update when the project is changed.
- **Applied** — The output of successful dbt DAG execution that creates or describes the state of the database (for example: `dbt run`, `dbt test`, source freshness, and so on)

These states allow you to easily examine the difference between a model’s definition and its applied state so you can get answers to questions like, did the model run? or did the run fail? Applied models exist as a table/view in the data platform given their most recent successful run.
    
## What you can use the Discovery API for

Use the API directly or with an integrated tool to enable experiences in dbt Cloud. Refer to [Common uses and scenarios for the Discovery API](/docs/dbt-cloud-apis/metadata-use-case-guides) for detailed information.

<Tabs>

<TabItem value="performance" label="Performance">

Use the API to look at historical information like model build time, job runs, run counts, and latest state of each model to determine the health of your dbt projects. Finding inefficiencies in orchestration configurations can help decrease infrastructure costs and improve timeliness. To learn more about how to do this, refer to [Performance](/docs/dbt-cloud-apis/metadata-use-case-guides#performance).

You can use, for example, the [model timing](/docs/dbt-versions/release-notes/January-2022/model-timing-more) tab to help identify and optimize bottlenecks in model builds: 

<Lightbox src="/img/docs/dbt-cloud/discovery-api/model-timing.jpg" width="200%" title="Model timing visualization in dbt Cloud"/>

</TabItem>

<TabItem value="quality" label="Quality">

Use the API to determine if the data is accurate and up-to-date by monitoring test failures, source freshness, and run status. Accurate and reliable information is valuable for analytics, decisions, and monitoring to help prevent your organization from making bad decisions. To learn more about this, refer to [Quality](/docs/dbt-cloud-apis/metadata-use-case-guides#quality).

When used with [webhooks](/docs/deploy/webhooks), it can also help with detecting, investigating, and alerting issues.

</TabItem>

<TabItem value="discovery" label="Discovery">

Use the API to find and understand dbt assets in integrated tools using information like model and metric definitions, and column information. For more details, refer to [Discovery](/docs/dbt-cloud-apis/metadata-use-case-guides#discovery).

Data producers must manage and organize data for stakeholders, while data consumers need to quickly and confidently analyze data on a large scale to make informed decisions that improve business outcomes and reduce organizational overhead. The API is useful for discovery data experiences in catalogs, analytics, apps, and machine learning (ML) tools. It can help you understand the origin and meaning of datasets for your analysis.

<Lightbox src="/img/docs/dbt-cloud/discovery-api/dbt-dag.jpg" width="175%" title="Data lineage produced by dbt"/>  
</TabItem>

<TabItem value="governance" label="Governance">

Use the API to review who developed the models and who uses them to help establish standard practices for better governance. For more details, refer to [Governance](/docs/dbt-cloud-apis/metadata-use-case-guides#governance).

</TabItem>

<TabItem value="development" label="Development">

Use the API to review dataset changes and uses by examining exposures, lineage, and dependencies. From the investigation, you can learn how to define and build more effective dbt projects. For more details, refer to [Development](/docs/dbt-cloud-apis/metadata-use-case-guides#development).


<Lightbox src="/img/docs/dbt-cloud/discovery-api/data-freshness-metadata.jpg" width="25%" title="Quality and freshness dashboard status tile defined via exposures"/>
</TabItem>


</Tabs>


## Related docs

- [Common uses and scenarios for the Discovery API](/docs/dbt-cloud-apis/metadata-use-case-guides)
- [Query the Discovery API](/docs/dbt-cloud-apis/discovery-querying)
- [Schema](/docs/dbt-cloud-apis/metadata-schema-model)

