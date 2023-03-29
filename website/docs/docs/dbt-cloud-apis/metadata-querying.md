---
title: "Query the Metadata API"
id: "metadata-querying"
---

The Metadata API supports ad-hoc queries or lets you browse the schema. If you are new to the API, read the [Metadata API overview](/docs/dbt-cloud-apis/metadata-api) for an introduction to the Metadata API.

<Snippet src="metadata-api-prerequisites" />

## Authorization

Currently, authorization of requests takes place [using a service token](/docs/dbt-cloud-apis/service-tokens). dbt Cloud admin users can generate a Metadata Only service token that is authorized to execute a specific query against the Metadata API.

Once you've created a token, you can use it in the Authorization header of requests to the dbt Cloud Metadata API. Be sure to include the Token prefix in the Authorization header, or the request will fail with a `401 Unauthorized` error. Note that `Bearer` can be used in place of `Token` in the Authorization header. Both syntaxes are equivalent.


## Run queries

You can run queries by sending a `POST` request to the `https://metadata.YOUR_ACCESS_URL/graphql` endpoint, making sure to replace:
* `YOUR_ACCESS_URL` with the [appropriate Access URL](/docs/cloud/about-cloud/regions-ip-addresses) for your region and plan.
* `YOUR_TOKEN` in the Authorization header with your actual API token.
* `QUERY_BODY` with a JSON string, for example `{ "query": "<query text>" }`

  ```shell
  curl 'https://metadata.YOUR_ACCESS_URL/graphql' \
    -H 'authorization: Bearer YOUR_TOKEN' \
    -H 'content-type: application/json'
    -X POST
    --data QUERY_BODY
  ```

Every query will rely on a _jobID_.  You can get the jobID by clicking into the relevant job in dbt Cloud and observing the URL. In this example URL, the jobID would be 917: `https://YOUR_ACCESS_URL/#/accounts/1/projects/665/jobs/917/`

There are several illustrative example queries in this documentation. You can see an example of [queries on the Model node](/docs/dbt-cloud-apis/metadata-schema-model).



## GraphQL API explorer

You can run ad-hoc queries directly in the [GraphQL API explorer](https://metadata.cloud.getdbt.com/graphql) and use the document explorer on the left-hand side, where you can see all possible nodes and fields. 

Refer to the [Apollo explorer documentation](https://www.apollographql.com/docs/graphos/explorer/explorer) for setup and authorization info. 

1. Access the [GraphQL API explorer](https://metadata.cloud.getdbt.com/graphql) and select fields you'd like query. 
2. Go to **Variables** at the bottom of the explorer and replace any `null` fields with your unique fields.
3. [Authenticate](https://www.apollographql.com/docs/graphos/explorer/connecting-authenticating#authentication) via bearer auth with `YOUR_AUTH_TOKEN`. Go to **Headers** at the bottom of the explorer and select **+New header**.
4. Select **Authorization** in the **header key** drop-down list and enter your Bearer auth token in the **value** field. Remember to include the Token prefix. Your header key should look like this `{"Authorization": "Bearer <auth_token>}`
<br />
5. Run your query by pressing the blue query button in the top-right of the Operation editor (to the right of the query). You should see a successful query response on the right side of the explorer.

<Lightbox src="/img/docs/dbt-cloud/metadata-api/graphql.jpg" width="85%" title="Run queries using the Apollo Server GraphQL explorer"/>
