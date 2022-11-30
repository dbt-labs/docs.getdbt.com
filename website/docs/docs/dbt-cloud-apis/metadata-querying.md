---
title: "Query the Metadata API"
id: "metadata-querying"
---
Accounts on the _Team_ and _Multi-Tenant Enterprise_ plans can query the dbt Metadata API.

## Authorization

Currently, authorization of requests takes place [using a service token](https://docs.getdbt.com/docs/dbt-cloud-apis/service-tokens). dbt Cloud admin users can generate a Metadata Only service token that is authorized to execute a specific query against the Metadata API.

Once you've created a token, you can use it in the Authorization header of requests to the dbt Cloud Metadata API. Be sure to include the Token prefix in the Authorization header, or the request will fail with a `401 Unauthorized` error. Note that `Bearer` can be used in place of `Token` in the Authorization header. Both syntaxes are equivalent.

## Running Queries

You can run queries by sending a `POST` request to the https://metadata.cloud.getdbt.com/graphql endpoint. Be sure to replace your token in the Authorization header with your actual API token.

```
curl 'https://metadata.cloud.getdbt.com/graphql' \
  -H 'authorization: Bearer <your token>' \
  -H ‘content-type: application/json’
  -X POST
  --data <query>
```

The `<query>` body should be a JSON string in the format:

```
{ “query”: “<query text>” }
```

Every query will rely on a *jobID*.  You can get the jobID by clicking into the relevant job in dbt Cloud and observing the URL. In this example URL, the jobID would be 917: `https://cloud.getdbt.com/#/accounts/1/projects/665/jobs/917/`

There are several illustrative example queries in this documentation (examples of queries on the Model node, [here](/docs/dbt-cloud-apis/metadata-schema-model).

## GraphiQL
You can also experiment and run queries directly in the [GraphiQL interface](https://metadata.cloud.getdbt.com/graphiql), which is convenient for exploration. On the right hand side, there is a document explorer where you can see all possible nodes and fields.  Below is an example of what a query looks like in GraphiQL.  Note that you must authenticate via bearer auth with your token.

<Lightbox src="/img/docs/dbt-cloud/GraphiQL.png" title=""/>
