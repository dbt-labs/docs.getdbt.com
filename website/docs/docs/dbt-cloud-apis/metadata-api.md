---
title: "About the Metadata API"
id: "metadata-api"
---

Every time dbt Cloud runs a project, it generates and stores information about the dbt project — in other words, metadata. It stores information on how it's executed, including accuracy, recency, configuration, the structure of the <Term id="view">views</Term>, and tables in the warehouse.  

The dbt Metadata API helps organizations analyze and improve their data using the outputs of dbt execution. You can use the Metadata API to perform freshness analysis, catalog metrics, power downstream integrations, and more:

 - Discover and understand data for analysis
 - Ensure data quality based on models, tests, and sources
 - Increase the efficiency of dbt operations

dbt Cloud provides two APIs:

- The [dbt Metadata API](#use-cases) &mdash;  Use it to fetch metadata related to the state and health of your dbt project. 
- The [dbt Cloud Administrative API](/docs/dbt-cloud-apis/admin-cloud-api) &mdash; Use it to administrate a dbt Cloud account. For example, manually retrieve the JSON artifact files, check job status, and run jobs. 

<Snippet src="metadata-api-prerequisites" />

    
## Use cases

Use the Metadata API directly or via an integrated tool to enable experiences in dbt Cloud. It addresses [use cases](/docs/dbt-cloud-apis/metadata-use-case-guides) that need [webhooks](/docs/deploy/webhooks) for accessing up-to-date project and run information:

- [**Discovery**](/docs/dbt-cloud-apis/metadata-use-case-guides#discovery)* &mdash; Find and understand dbt assets to analyze in integrated tools using information like model and metric definitions, column info, and lineage. One example of this is the [dbt Semantic Layer integration](/guides/dbt-ecosystem/sl-partner-integration-guide). 
- [**Quality**](/docs/dbt-cloud-apis/metadata-use-case-guides#quality)* &mdash; Make sure users have correct and up-to-date data for their analyses by monitoring test failures, source freshness, run status, exposures, and dependencies.
- [**Operations**](/docs/dbt-cloud-apis/metadata-use-case-guides#operations)* &mdash;  Help data teams run dbt efficiently and reduce costs by using historical run data, including information like model build time and run counts.

*_Refer to [Using the Metadata API](/docs/dbt-cloud-apis/metadata-use-case-guides) for more info; additional detailed use case and integration guides are coming soon_.


## Product roadmap

The Metadata API roadmap includes initiatives to improve each of the API's main use cases: data discovery, data quality, and dbt operations

<!--- tabs for discovery, quality, operations --->
<Tabs>

<TabItem value="discovery" label="Discovery">

To improve discovery experiences, we’ll make it easier for API users to access the latest production state of a project. This is our primary focus in 2023. 

- Rather than querying for each job or run, retrieve the logical state (definitions), execution results, and applied state (what exists in the database) of each node in the project based on their most recent runs in the production environment.
- dbt v1.6: Use public models to enable [multi-project deployments](https://github.com/dbt-labs/dbt-core/discussions/6725) and access the global lineage
- dbt v1.6: New and revised model and entity endpoints to unlock Semantic Layer use cases
- Pagination for manageable responses and performance when querying long lists of dbt objects


</TabItem>

<TabItem value="quality" label="Quality">

To improve customers’ data quality, we’re enhancing the ability for data teams to configure dbt and monitor for issues in dbt Cloud and integrated tools. This will be more of a focus in 2024.

- Add Metadata API support for dbt Core 1.5 elements of data contracts like model owners, access, and constraints.
- Streaming results so users can access real-time metadata during a run, such as notifications about specific events like model builds and test failures.

</TabItem>

<TabItem value="operations" label="Operations">


To improve dbt operations, we’ll enable API users to access and query richer information about execution on dbt Cloud in more ergonomic ways. This is our primary focus in the second half of 2023. 

- Enable easier queries across runs to analyze performance over time, such as time aggregation for execution results of individual models and the project as a whole.
- Provide granular execution information from dbt Cloud, such as invocation history.
- Later &mdash; Streaming results to see the DAG as it builds during a run.

</TabItem>
</Tabs>



## Related docs

- [Use the Metadata API](/docs/dbt-cloud-apis/metadata-use-case-guides)
- [Access the Metadata API](/docs/dbt-cloud-apis/access-metadata-api)
- [Query the Metadata API](/docs/dbt-cloud-apis/metadata-querying)
- [Schema](/docs/dbt-cloud-apis/metadata-schema-model)

