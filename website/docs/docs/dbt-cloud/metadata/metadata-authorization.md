---
title: "Authorizing Requests"
id: "metadata-authorization"
---

Currently, authorization of requests takes place [using a service token](https://docs.getdbt.com/docs/dbt-cloud/dbt-cloud-api/service-tokens). Personal API tokens are not permitted access to the Metadata API. dbt Cloud admin users can generate a Metadata Only service token that is authorized to execute a specific query against the Metadata API.

Once you've created a token, you can use it in the Authorization header of requests to the dbt Cloud Metadata API. Be sure to include the Token prefix in the Authorization header, or the request will fail with a `401 Unauthorized` error. Note: Bearer can be used in place of Token in the Authorization header. Both syntaxes are equivalent.

## Example

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

There are several example queries below, for example...
