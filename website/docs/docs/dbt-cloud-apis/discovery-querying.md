---
title: "Query the Discovery API"
id: "discovery-querying"
sidebar_label: "Query the Discovery API"
---

The Discovery API supports ad-hoc queries and integrations. If you are new to the API, refer to [About the Discovery API](/docs/dbt-cloud-apis/discovery-api) for an introduction.

Use the Discovery API to evaluate data pipeline health and project state across runs or at a moment in time. dbt Labs provide a [GraphQL explorer](https://metadata.cloud.getdbt.com/graphql) for this API, enabling you to run queries and browse the schema.

Since GraphQL describes the data in the API, the schema displayed in the GraphQL explorer accurately represents the graph and fields available to query.

<Snippet path="metadata-api-prerequisites" />

## Authorization

Currently, authorization of requests takes place [using a service token](/docs/dbt-cloud-apis/service-tokens). dbt Cloud admin users can generate a Metadata Only service token that is authorized to execute a specific query against the Discovery API.

Once you've created a token, you can use it in the Authorization header of requests to the dbt Cloud Discovery API. Be sure to include the Token prefix in the Authorization header, or the request will fail with a `401 Unauthorized` error. Note that `Bearer` can be used instead of `Token` in the Authorization header. Both syntaxes are equivalent.

## Access the Discovery API

1. Create a [service account token](/docs/dbt-cloud-apis/service-tokens) to authorize requests. dbt Cloud Admin users can generate a _Metadata Only_ service token, which can be used to execute a specific query against the Discovery API to authorize requests.

2. Find your API URL using the endpoint `https://metadata.{YOUR_ACCESS_URL}/graphql`.

    * Replace `{YOUR_ACCESS_URL}` with the appropriate [Access URL](/docs/cloud/about-cloud/regions-ip-addresses) for your region and plan. For example, if your multi-tenant region is North America, your endpoint is `https://metadata.cloud.getdbt.com/graphql`. If your multi-tenant region is EMEA, your endpoint is `https://metadata.emea.dbt.com/graphql`.

3. For specific query points, refer to the [schema documentation](/docs/dbt-cloud-apis/discovery-schema-model).


## Run queries using HTTP requests

You can run queries by sending a `POST` request to the `https://metadata.YOUR_ACCESS_URL/graphql` endpoint, making sure to replace:
* `YOUR_ACCESS_URL` with the [appropriate Access URL](/docs/cloud/about-cloud/regions-ip-addresses) for your region and plan.
* `YOUR_TOKEN` in the Authorization header with your actual API token. Be sure to include the Token prefix.
* `QUERY_BODY` with a GraphQL query, for example `{ "query": "<query text>" }`
* `VARIABLES` with a dictionary of your GraphQL query variables, such as a job ID or a filter.
* `ENDPOINT` with the endpoint you're querying, such as environment.

  ```shell
  curl 'https://metadata.YOUR_ACCESS_URL/graphql' \
    -H 'authorization: Bearer YOUR_TOKEN' \
    -H 'content-type: application/json'
    -X POST
    --data QUERY_BODY
  ```

Python example:

```python
response = requests.post(
    'YOUR_ACCESS_URL',
    headers={"authorization": "Bearer "+YOUR_TOKEN, "content-type": "application/json"},
    json={"query": QUERY_BODY, "variables": VARIABLES}
)

metadata = response.json()['data'][ENDPOINT]
```

Every query will require an environment ID or job ID. You can get the ID from a dbt Cloud URL or using the Admin API.

There are several illustrative example queries on this page. For more examples, refer to [Use cases and examples for the Discovery API](/docs/dbt-cloud-apis/discovery-use-cases-and-examples).


## Reasonable use

Discovery (GraphQL) API usage is subject to request rate and response size limits to maintain the performance and stability of the metadata platform and prevent abuse.
- The current request rate limit is 200 requests for a given IP address within a minute. If you exceed this limit, you will receive an HTTP 429 response status.
- Environment-level endpoints will be subject to response size limits in the future. The depth of the graph should not exceed three levels. A user can paginate up to 500 items per query.
- Job-level endpoints are subject to query complexity limits. Nested nodes (like parents), code (like rawCode), and catalog columns are considered as most complex. Overly complex queries should be broken up into separate queries with only necessary fields included. dbt Labs recommends using the environment endpoint instead for most use cases to get the latest descriptive and result metadata for a dbt Cloud project.

## Retention limits
You can use the Discovery API to query data from the previous three months. For example, if today was April 1st, you could query data back to January 1st.

## Run queries with the GraphQL explorer

You can run ad-hoc queries directly in the [GraphQL API explorer](https://metadata.cloud.getdbt.com/graphql) and use the document explorer on the left-hand side, where you can see all possible nodes and fields.

Refer to the [Apollo explorer documentation](https://www.apollographql.com/docs/graphos/explorer/explorer) for setup and authorization info.

1. Access the [GraphQL API explorer](https://metadata.cloud.getdbt.com/graphql) and select fields you'd like query.

2. Go to **Variables** at the bottom of the explorer and replace any `null` fields with your unique values.

3. [Authenticate](https://www.apollographql.com/docs/graphos/explorer/connecting-authenticating#authentication) via Bearer auth with `YOUR_TOKEN`. Go to **Headers** at the bottom of the explorer and select **+New header**.

4. Select **Authorization** in the **header key** drop-down list and enter your Bearer auth token in the **value** field. Remember to include the Token prefix. Your header key should look like this `{"Authorization": "Bearer <YOUR_TOKEN>}`.

TODO: Screenshot needs to be replaced with new one. If we want to show model historical runs, show `environment { applied { modelHistoricalRuns } }`

<br />

<Lightbox src="/img/docs/dbt-cloud/discovery-api/graphql_header.jpg" width="85%" title="Enter the header key and Bearer auth token values"/>

5. Run your query by pressing the blue query button in the top-right of the Operation editor (to the right of the query). You should see a successful query response on the right side of the explorer.

TODO: Screenshot needs to be replaced with new one. If we want to show model historical runs, show `environment { applied { modelHistoricalRuns } }`

<Lightbox src="/img/docs/dbt-cloud/discovery-api/graphql.jpg" width="85%" title="Run queries using the Apollo Server GraphQL explorer"/>

### Fragments

Use the [`...on`](https://www.apollographql.com/docs/react/data/fragments/) notation to query across lineage and retrieve results from specific node types.

```graphql
query ($environmentId: BigInt!, $first: Int!) {
  environment(id: $environmentId) {
    applied {
      models(first: $first, filter: { uniqueIds: "MODEL.PROJECT.MODEL_NAME" }) {
        edges {
          node {
            name
            ancestors(types: [Model, Source, Seed, Snapshot]) {
              ... on ModelAppliedStateNestedNode {
                name
                resourceType
                materializedType
                executionInfo {
                  executeCompletedAt
                }
              }
              ... on SourceAppliedStateNestedNode {
                sourceName
                name
                resourceType
                freshness {
                  maxLoadedAt
                }
              }
              ... on SnapshotAppliedStateNestedNode {
                name
                resourceType
                executionInfo {
                  executeCompletedAt
                }
              }
              ... on SeedAppliedStateNestedNode {
                name
                resourceType
                executionInfo {
                  executeCompletedAt
                }
              }
            }
          }
        }
      }
    }
  }
}
```

### Pagination

Querying large datasets can impact performance on multiple functions in the API pipeline. Pagination eases the burden by returning smaller data sets one page at a time. This is useful for returning a particular portion of the dataset or the entire dataset piece-by-piece to enhance performance. dbt Cloud utilizes cursor-based pagination, which makes it easy to return pages of constantly changing data.

Use the `PageInfo` object to return information about the page. The following fields are available:

- `startCursor` string type - corresponds to the first `node` in the `edge`.
- `endCursor` string type - corresponds to the last `node` in the `edge`.
- `hasNextPage` boolean type - whether there are more `nodes` after the returned results.

There are connection variables available when making the query:

- `first` integer type - will return the first 'n' `nodes` for each page, up to 500.
- `after` string type sets the cursor to retrieve `nodes` after. It's best practice to set the `after` variable with the object ID defined in the `endCursor` of the previous page.

The following example shows that we're returning the `first` 500 models `after` the specified Object ID in the variables. The `PageInfo` object will return where the object ID where the cursor starts, where it ends, and whether there is a next page.

TODO: Update screenshot to use `$environmentId: BigInt!`

<Lightbox src="/img/paginate.png" width="75%" title="Example of pagination"/>

Here is a code example of the `PageInfo` object:

```graphql
pageInfo {
  startCursor
  endCursor
  hasNextPage
}
totalCount # Total number of records across all pages
```

### Filters

Filtering helps to narrow down the results of an API query. Want to query and return only models and tests that are failing? Or find models that are taking too long to run? You can fetch execution details such as [`executionTime`](/docs/dbt-cloud-apis/discovery-schema-models#fields), [`runElapsedTime`](/docs/dbt-cloud-apis/discovery-schema-models#fields), or [`status`](/docs/dbt-cloud-apis/discovery-schema-models#fields). This helps data teams monitor the performance of their models, identify bottlenecks, and optimize the overall data pipeline.

In the following example, we can see that we're filtering results to models that have succeeded on their `lastRunStatus`:

<Lightbox src="/img/filtering.png" width="75%" title="Example of filtering"/>

Here is a code example that filters for models that have an error on their last run and tests that have failed:

TODO: Update screenshot to use `$environmentId: BigInt!`

```graphql
query ModelsAndTests($environmentId: BigInt!, $first: Int!) {
  environment(id: $environmentId) {
    applied {
      models(first: $first, filter: { lastRunStatus: error }) {
        edges {
          node {
            name
            executionInfo {
              lastRunId
            }
          }
        }
      }
      tests(first: $first, filter: { status: "fail" }) {
        edges {
          node {
            name
            executionInfo {
              lastRunId
            }
          }
        }
      }
    }
  }
}
```

## Related content

- [Use cases and examples for the Discovery API](/docs/dbt-cloud-apis/discovery-use-cases-and-examples)
- [Schema](/docs/dbt-cloud-apis/discovery-schema-model)
