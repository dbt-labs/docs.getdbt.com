---
title: "Access the Metadata API"
id: "access-metadata-api"
---

Use the Metadata API to evaluate data health in the long term or at a moment in time. We provide a [GraphQL explorer](https://metadata.cloud.getdbt.com/graphql) for this API, enabling you to run ad-hoc queries or browse the schema. 

Since GraphQL provides a description of the data in the API, the schema displayed in the GraphQL explorer accurately represents the graph and fields available to query.  

<Snippet src="metadata-api-prerequisites" />

This section will explain how to access and query the Metadata API:

1. Create a [service account token](/docs/dbt-cloud-apis/service-tokens) to authorize requests. dbt Cloud Admin users can generate a _Metadata Only_ service token, which can be used to execute a specific query against the Metadata API for authorization of requests.

2. Find your API URL using the endpoint `https://metadata.{YOUR_ACCESS_URL}/graphql`. 

    * Replace `{YOUR_ACCESS_URL}` with the appropriate [Access URL](/docs/cloud/about-cloud/regions-ip-addresses) for your region and plan. For example, if your multi-tenant region is North America, your endpoint is `https://metadata.cloud.getdbt.com/graphql`. If your multi-tenant region is EMEA, your endpoint is `https://metadata.emea.dbt.com/graphql`.

3. To begin querying the Metadata API, refer to the [query documentation](/docs/dbt-cloud-apis/metadata-querying).

4. For specific query points, refer to the [schema documentation](/docs/dbt-cloud-apis/metadata-schema-model). 


## Retention limits
You can use the metadata API to query data from the previous three months. For example, if today was April 1st, you could query data back to January 1st.

## Related docs


- [Use the Metadata API](/docs/dbt-cloud-apis/metadata-use-case-guides)
- [Query the Metadata API](/docs/dbt-cloud-apis/metadata-querying)
- [Schema](/docs/dbt-cloud-apis/metadata-schema-model)


