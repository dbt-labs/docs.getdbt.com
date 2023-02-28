---
title: "Metadata API"
id: "metadata-api"
---

The dbt Cloud Metadata API helps organizations analyze and improve their data using the outputs of dbt execution. You can use the API and power downstream integrations so users:
 - Discover and understand data for analysis
 - Ensure data quality based on models, tests, and sources
 - Increase the efficiency of dbt operations

Every time dbt Cloud runs a project, it generates and stores information about the dbt project—in other words, metadata. It stores information like how it's executed, including accuracy, recency, configuration, and structure of the <Term id="view">views</Term> and tables in the warehouse. 

<!--dbt Cloud serves a [GraphQL API](https://metadata.cloud.getdbt.com/graphql) which supports arbitrary queries over this metadata. You can use this API to evaluate data health in the long-term or at a moment-in-time. -->

## Prerequisites

- You must have a [multi-tenant](/docs/deploy/regions-ip-addresses) account and [Team or Enterprise plans](https://www.getdbt.com/pricing/)
- Your projects must be on dbt version v0.19.0 or higher. Refer to [Version migration guides](/guides/migration/versions) to upgrade
    
## Use cases

Use the Metadata API to solve the following use cases:

- **Discovery*** &mdash; Find and understand dbt assets to analyze in integrated tools using information like model and metric definitions, column info, and lineage. One example of this is the [dbt Semantic Layer integration](/guides/dbt-ecosystem/sl-partner-integration-guide). 
- **Quality*** &mdash; Make sure users have correct and up-to-date data for their analyses by monitoring test failures, source freshness, run status, exposures, and dependencies.
- **Operations*** &mdash;  Help data teams run dbt efficiently and reduce costs by using historical run data, including information like model build time and run counts.
 

Users may use the API directly or within an integrated tool, and it powers some experiences in dbt Cloud itself. Many Metadata API use cases also benefit from [webhooks](/docs/deploy/webhooks) to access the most up-to-date project and run information. 

*_More detailed use case and integration guides coming soon_

## Browse the API

We provide [a graphical explorer](https://metadata.cloud.getdbt.com/graphql) for this API where you can run ad-hoc queries or browse the schema. As GraphQL provides a self-describing API, the schema shown in the GraphiQL interface is an accurate representation of the graph and fields available to query. To learn how to use GraphiQL, refer to [Query the Metadata API](/docs/dbt-cloud-apis/metadata-querying.md).

 The endpoint to access this API is `https://metadata.{YOUR_ACCESS_URL}/graphql`. Replace `{YOUR_ACCESS_URL}` with the appropriate [Access URL](/docs/deploy/regions-ip-addresses) for your region and plan. For example, if your region is North America using multi tenant, your endpoint is `https://metadata.cloud.getdbt.com/graphql`.


### Retention limits
You can use the metadata API to query data from the previous three months. For example, if today was April 1st, you could query data back to January 1st.

*We are continuously expanding the capabilities of the metadata API and welcome your feedback and suggestions at cloudAPIs@dbtlabs.com.*


<!-- embed iframe of graphiql 
<iframe title="GraphiQL" width="100%" height="100%" src="https://embed.graphql.com/embed?endpointURL=%22https%3A%2F%2Fmetadata.cloud.getdbt.com%2Fgraphiql%22&query=%22%7B%5Cn%20%20feed%20(type%3A%20NEW%2C%20limit%3A%205)%20%7B%5Cn%20%20%20%20repository%20%7B%5Cn%20%20%20%20%20%20owner%20%7B%20login%20%7D%5Cn%20%20%20%20%20%20name%5Cn%20%20%20%20%7D%5Cn%5Cn%20%20%20%20postedBy%20%7B%20login%20%7D%5Cn%20%20%7D%5Cn%7D%5Cn%22&variables=%22%22&response=%22Hit%20run!%5Cn%22&history=true&prettify=true&docs=true" />

-->

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

<!--
<div className="grid--3-col">
<Card
    title="Use case guides"
    body="Read use case guides to see how to use the Metadata API"
link="/docs/dbt-cloud-apis/metadata-use-case-guides"
    icon="pencil-paper"/>

<Card
    title="Query"
    body="Run queries with the Metadata API using the GraphiQL interface"
    link="/docs/dbt-cloud-apis/metadata-querying"
    icon="pencil-paper"/>

  <Card
    title="Schema"
    body="Reference Metadata API schemas to run your queries"
    link="0/docs/dbt-cloud-apis/metadata-schema-model"
    icon="pencil-paper"/>
</div> <br />
-->
## Related docs


- [Use cases for the Metadata API](/docs/dbt-cloud-apis/metadata-use-case-guides)
- [Query the Metadata API](/docs/dbt-cloud-apis/metadata-querying)
- [Schema](/docs/dbt-cloud-apis/metadata-schema-model)


