---
title: "Access the Metadata API"
id: "access-metadata-api"
---

Use the Metadata API to evaluate data health in the long term or at a moment in time. We provide a [GraphQL explorer](https://metadata.cloud.getdbt.com/graphql) for this API, enabling you to run ad-hoc queries or browse the schema. 

Since GraphQL provides a description of the data in the API, the schema displayed in the GraphiQL IDE accurately represents the graph and fields available to query.  

<Snippet src="metadata-api-prerequisites" />

This section will explain how to access and query the Metadata API:

1. Create a [service account token](/docs/dbt-cloud-apis/service-tokens) to authorize requests. dbt Cloud Admin users can generate a _Metadata Only_ service token, which can be used to execute a specific query against the Metadata API for authorization of requests.

2. Access the API by using the endpoint `https://metadata.{YOUR_ACCESS_URL}/graphql`. 
    * Replace `{YOUR_ACCESS_URL}` with the appropriate [Access URL](/docs/cloud/about-cloud/regions-ip-addresses) for your region and plan. For example, if your multi-tenant region is North America, your endpoint is `https://metadata.cloud.getdbt.com/graphql`. If your multi-tenant region is EMEA, your endpoint is `https://metadata.emea.dbt.com/graphql`.

3. Go to the [GraphQL API](https://metadata.cloud.getdbt.com/graphql) sandbox, which supports arbitrary queries. 

4. To begin querying the Metadata API, refer to the [query documentation](/docs/dbt-cloud-apis/metadata-querying.md) for details on how to use GraphiQL.

5. For specific query points, refer to the [schema documentation](/docs/dbt-cloud-apis/metadata-schema-model). 


## Retention limits
You can use the metadata API to query data from the previous three months. For example, if today was April 1st, you could query data back to January 1st.


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


- [Use the Metadata API](/docs/dbt-cloud-apis/metadata-use-case-guides)
- [Query the Metadata API](/docs/dbt-cloud-apis/metadata-querying)
- [Schema](/docs/dbt-cloud-apis/metadata-schema-model)


