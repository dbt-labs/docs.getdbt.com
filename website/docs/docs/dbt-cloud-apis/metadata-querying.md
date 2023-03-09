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
* `YOUR_ACCESS_URL` with the [appropriate Access URL](/docs/deploy/regions-ip-addresses) for your region and plan.
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

## GraphiQL

You can experiment and run queries directly in the [GraphiQL interface](https://metadata.cloud.getdbt.com/graphiql), making sure to use the [appropriate Access URL](/docs/deploy/regions-ip-addresses) for your region and plan. On the right-hand side, there is a document explorer where you can see all possible nodes and fields.  Below is an example of what a query looks like in GraphiQL.  Note that you must authenticate via bearer auth with your token.

<Lightbox src="/img/docs/dbt-cloud/GraphiQL.png" title=""/>

