---
title: "Metadata API"
id: "metadata-api"
---

<!--Summary: types of usage and info
Why overview -> link to use case guide for more detail
How overview (like a quickstart) -> links to:
sandbox, schema, etc. to start using including prereqs, retention info etc.
integrations and features using the API for end-users (non-developers)-->

The dbt Cloud Metadata API helps organizations analyze and improve their data using the outputs of dbt execution. You can use the API to perform freshness analysis, catalog metrics, power downstream integrations and more:

 - Discover and understand data for analysis
 - Ensure data quality based on models, tests, and sources
 - Increase the efficiency of dbt operations

Every time dbt Cloud runs a project, it generates and stores information about the dbt project—in other words, metadata. It stores information on how it's executed, including accuracy, recency, configuration, and structure of the <Term id="view">views</Term> and tables in the warehouse. 

    
## Use cases

Use the Metadata API to solve the following use cases: 

- **Discovery*** &mdash; Find and understand dbt assets to analyze in integrated tools using information like model and metric definitions, column info, and lineage. One example of this is the [dbt Semantic Layer integration](/guides/dbt-ecosystem/sl-partner-integration-guide). 
- **Quality*** &mdash; Make sure users have correct and up-to-date data for their analyses by monitoring test failures, source freshness, run status, exposures, and dependencies.
- **Operations*** &mdash;  Help data teams run dbt efficiently and reduce costs by using historical run data, including information like model build time and run counts.
 

Users may use the API directly or within an integrated tool, and it powers some experiences in dbt Cloud itself. Many Metadata API use cases also benefit from [webhooks](/docs/deploy/webhooks) to access the most up-to-date project and run information. 

*_More detailed use case and integration guides coming soon_


## Quickstart


This section will explain how to use the Metadata API, what you need, and how to query. You can use the Metadata API to evaluate data health in the long-term or at a moment-in-time. 

### Prerequisites

- You must have a [multi-tenant](/docs/deploy/regions-ip-addresses) account 
- You must be on a [Team or Enterprise plan](https://www.getdbt.com/pricing/)
- Your projects must be on dbt version 0.19.0 or higher. Refer to [Version migration guides](/guides/migration/versions) to upgrade


### Access the API

We provide [a graphical explorer](https://metadata.cloud.getdbt.com/graphql) for this API where you can run ad-hoc queries or browse the schema. As GraphQL provides a self-describing API, the schema shown in the GraphiQL interface is an accurate representation of the graph and fields available to query. 

1. Go to [GraphQL API](https://metadata.cloud.getdbt.com/graphql) sandbox, which supports arbitrary queries over this metadata. 

2. Create a [Metadata Only service token](/docs/dbt-cloud-apis/service-tokens) to authorize requests takes place using a service token. Refer to [Query the Metadata API](/docs/dbt-cloud-apis/metadata-querying.md) for details on how to use GraphiQL.

3. Access the API by using the endpoint `https://metadata.{YOUR_ACCESS_URL}/graphql`. 
    * Replace `{YOUR_ACCESS_URL}` with the appropriate [Access URL](/docs/deploy/regions-ip-addresses) for your region and plan. For example, if your region is North America using multi tenant, your endpoint is `https://metadata.cloud.getdbt.com/graphql`.


### Retention limits
You can use the metadata API to query data from the previous three months. For example, if today was April 1st, you could query data back to January 1st.

## Product Roadmap

The product roadmap for the Metadata API focuses on three use cases to help organizations analyze and improve their data using the outputs of dbt execution:


- Discover &mdash; Enhance the discovery experience for users and make it easier to access the latest production state of a project
- Quality &mdash; Improve data quality and make it easier for data teams to configure dbt and monitor issues in dbt Cloud and integrated tools
 - Operations &mdash; Optimize dbt operations by enabling API users to access and query richer information about execution on dbt Cloud in more ergonomic ways


<!--- tabs for discovery, quality, operations --->
<Tabs>

<TabItem value="discovery" label="Discovery">

To improve discovery experiences, we’ll make it easier for API users to access the latest production state of a project. This is our primary focus in the first half of 2023. 

- Q1 &mdash; dbt v1.5: New model fields like owner, version, and constraints.
- Q2 &mdash; dbt v1.6: Use public models to enable [multi-project deployments](https://github.com/dbt-labs/dbt-core/discussions/6725) and access the global lineage.
- Q2 &mdash; dbt v1.6: New and revised model and entity endpoints to unlock Semantic Layer use cases.
- Q2 &mdash; Pagination for manageable responses and performance when querying long lists of dbt objects.
- Q2 &mdash; Get the DAG state based on its environment’s latest production runs instead of querying per job.
- Q3 &mdash; Access additional information about the project from the dbt logs. For instance, get catalog info without needing to generate docs.


</TabItem>

<TabItem value="quality" label="Quality">

To improve customers’ data quality, we’re enhancing the ability for data teams to configure dbt and monitor for issues in dbt Cloud and integrated tools.  

- Q1 &mdash; Metadata API support for dbt Core 1.5 elements of data contracts like model owners and constraints.
- Q4 &mdash; Improvements to webhooks to support notifications about tests, freshness, and events per model rather than per run.
- Q4 &mdash; Streaming results so users can access real-time metadata during a run.
- Q4 &mdash; Integrate with model freshness SLAs for intelligent scheduling.

</TabItem>

<TabItem value="operations" label="Operations">


To improve dbt operations, we’ll enable API users to access and query richer information about execution on dbt Cloud in more ergonomic ways. This is our primary focus in the second half of 2023. 

- Q3 &mdash; Enable easier queries across runs to analyze performance over time, such as time aggregation for execution results of individual models and the project as a whole.
- Q3 &mdash; Provide granular execution information from dbt Cloud, such as invocation history.
- Q3 &mdash; Improvements to webhooks for notifications about run events.
- Q4 &mdash; Streaming results to see the DAG as it builds during a run.

</TabItem>
</Tabs>

If you have ideas about the use cases and roadmap or want to share feedback in general, please reach out to [CloudAPIs@dbtlabs.com](mailto:CloudAPIs@dbtlabs.com) or join the conversation in the [#metadata channel](https://getdbt.slack.com/archives/C01F91XJ5PY) in dbt Community Slack.


**Discovery**
To improve discovery experiences, we’ll make it easier for API users to access the latest production state of a project. This is our primary focus in the first half of 2023. 

- [Q2] Pagination for manageable responses and performance when querying long lists of dbt objects.
- [Q2] Get the DAG state based on its environment’s latest production runs instead of querying per job.
- [Q3] Access additional information about the project from the dbt logs. For instance, get catalog info without needing to generate docs.
- [Q1] dbt v1.5: New model fields like owner, version, and constraints.
- [Q2] dbt v1.6: Use public models to enable [multi-project deployments](https://github.com/dbt-labs/dbt-core/discussions/6725) and access the global lineage.
- [Q2] dbt v1.6: New and revised model and entity endpoints to unlock Semantic Layer use cases.

**Quality**

To improve customers’ data quality, we’re enhancing the ability for data teams to configure dbt and monitor for issues in dbt Cloud and integrated tools.  

- [Q1] Metadata API support for dbt Core 1.5 elements of data contracts like model owners and constraints.
- [Q4] Improvements to webhooks to support notifications about tests, freshness, and events per model rather than per run.
- [Q4] Streaming results so users can access real-time metadata during a run.
- [Q4] Integrate with model freshness SLAs for intelligent scheduling.

**Operations**

To improve dbt operations, we’ll enable API users to access and query richer information about execution on dbt Cloud in more ergonomic ways. This is our primary focus in the second half of 2023. 

- [Q3] Enable easier queries across runs to analyze performance over time, such as time aggregation for execution results of individual models and the project as a whole.
- [Q3] Provide granular execution information from dbt Cloud, such as invocation history.
- [Q3] Improvements to webhooks for notifications about run events.
- [Q4] Streaming results to see the DAG as it builds during a run.


<!-- embed iframe of graphiql 
<iframe title="GraphiQL" width="100%" height="100%" src="https://embed.graphql.com/embed?endpointURL=%22https%3A%2F%2Fmetadata.cloud.getdbt.com%2Fgraphiql%22&query=%22%7B%5Cn%20%20feed%20(type%3A%20NEW%2C%20limit%3A%205)%20%7B%5Cn%20%20%20%20repository%20%7B%5Cn%20%20%20%20%20%20owner%20%7B%20login%20%7D%5Cn%20%20%20%20%20%20name%5Cn%20%20%20%20%7D%5Cn%5Cn%20%20%20%20postedBy%20%7B%20login%20%7D%5Cn%20%20%7D%5Cn%7D%5Cn%22&variables=%22%22&response=%22Hit%20run!%5Cn%22&history=true&prettify=true&docs=true" />



<!--cdn code for graphaql sandbox 
link here: https://studio.apollographql.com/sandbox/explorer?overlay=embed-sandbox
docs link here: https://www.apollographql.com/docs/graphos/explorer/embed-explorer


<div style="width: 100%; height: 100%;" id='embedded-sandbox'></div>
<script src="https://embeddable-sandbox.cdn.apollographql.com/_latest/embeddable-sandbox.umd.production.min.js"></script> 
<script>
  new window.EmbeddedSandbox({
    target: '#embedded-sandbox',
    initialEndpoint: 'https://metadata.cloud.getdbt.com/graphql',
    initialState: {
      document: `query ExampleQuery {
  id
}`,
      variables: {},
      headers: {},
      includeCookies: false,
    },
  });
</script>
  
-->
## Related docs


- [Use cases for the Metadata API](/docs/dbt-cloud-apis/metadata-use-case-guides)
- [Query the Metadata API](/docs/dbt-cloud-apis/metadata-querying)
- [Schema](/docs/dbt-cloud-apis/metadata-schema-model)


