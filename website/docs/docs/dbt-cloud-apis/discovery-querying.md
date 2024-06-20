---
title: "Query the Discovery API"
id: "discovery-querying"
sidebar_label: "Query the Discovery API"
pagination_next: "docs/dbt-cloud-apis/discovery-schema-environment"
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

2. Find the API URL to use from the [Discovery API endpoints](#discovery-api-endpoints) table.

3. For specific query points, refer to the [schema documentation](/docs/dbt-cloud-apis/discovery-schema-job).

## Run queries using HTTP requests

You can run queries by sending a `POST` request to the Discovery API, making sure to replace:
* `YOUR_API_URL` with the appropriate [Discovery API endpoint](#discovery-api-endpoints) for your region and plan.
* `YOUR_TOKEN` in the Authorization header with your actual API token. Be sure to include the Token prefix.
* `QUERY_BODY` with a GraphQL query, for example `{ "query": "<query text>", "variables": "<variables in json>" }`
* `VARIABLES` with a dictionary of your GraphQL query variables, such as a job ID or a filter.
* `ENDPOINT` with the endpoint you're querying, such as environment.

  ```shell
  curl 'YOUR_API_URL' \
    -H 'authorization: Bearer YOUR_TOKEN' \
    -H 'content-type: application/json'
    -X POST
    --data QUERY_BODY
  ```

Python example:

```python
response = requests.post(
    'YOUR_API_URL',
    headers={"authorization": "Bearer "+YOUR_TOKEN, "content-type": "application/json"},
    json={"query": QUERY_BODY, "variables": VARIABLES}
)

metadata = response.json()['data'][ENDPOINT]
```

Every query will require an environment ID or job ID. You can get the ID from a dbt Cloud URL or using the Admin API.

There are several illustrative example queries on this page. For more examples, refer to [Use cases and examples for the Discovery API](/docs/dbt-cloud-apis/discovery-use-cases-and-examples).


## Discovery API endpoints

The following are the endpoints for accessing the Discovery API. Use the one that's appropriate for your region and plan.

| Deployment type |	Discovery API URL |
| --------------- | ------------------- |
| North America multi-tenant	|	https://metadata.cloud.getdbt.com/graphql |
| EMEA multi-tenant	|	https://metadata.emea.dbt.com/graphql |
| APAC multi-tenant	|	https://metadata.au.dbt.com/graphql |
| Multi-cell	| `https://YOUR_ACCOUNT_PREFIX.metadata.REGION.dbt.com/graphql`<br /><br />  Replace `YOUR_ACCOUNT_PREFIX` with your specific account identifier and `REGION` with your location, which could be `us1.dbt.com`. |<br />
| Single-tenant | `https://metadata.YOUR_ACCESS_URL/graphql`<br /><br />  Replace `YOUR_ACCESS_URL` with your specific account prefix with the appropriate [Access URL](/docs/cloud/about-cloud/access-regions-ip-addresses) for your region and plan.|

## Reasonable use

Discovery (GraphQL) API usage is subject to request rate and response size limits to maintain the performance and stability of the metadata platform and prevent abuse.

Job-level endpoints are subject to query complexity limits. Nested nodes (like parents), code (like rawCode), and catalog columns are considered as most complex. Overly complex queries should be broken up into separate queries with only necessary fields included. dbt Labs recommends using the environment endpoint instead for most use cases to get the latest descriptive and result metadata for a dbt Cloud project.

## Retention limits
You can use the Discovery API to query data from the previous three months. For example, if today was April 1st, you could query data back to January 1st.

## Run queries with the GraphQL explorer

You can run ad-hoc queries directly in the [GraphQL API explorer](https://metadata.cloud.getdbt.com/graphql) and use the document explorer on the left-hand side to see all possible nodes and fields.

Refer to the [Apollo explorer documentation](https://www.apollographql.com/docs/graphos/explorer/explorer) for setup and authorization info.

1. Access the [GraphQL API explorer](https://metadata.cloud.getdbt.com/graphql) and select fields you want to query.

2. Select **Variables** at the bottom of the explorer and replace any `null` fields with your unique values.

3. [Authenticate](https://www.apollographql.com/docs/graphos/explorer/connecting-authenticating#authentication) using Bearer auth with `YOUR_TOKEN`. Select **Headers** at the bottom of the explorer and select **+New header**.

4. Select **Authorization** in the **header key** dropdown list and enter your Bearer auth token in the **value** field. Remember to include the Token prefix. Your header key should be in this format: `{"Authorization": "Bearer <YOUR_TOKEN>}`.

<!-- TODO: Screenshot needs to be replaced with new one. If we want to show model historical runs, show `environment { applied { modelHistoricalRuns } }` -->
<!-- However we can choose to leave this be, since the important info from the screenshot is to show how the GraphQL API canbe used -- the content (request and response) doesn't matter too much` -->

<br />

<Lightbox src="/img/docs/dbt-cloud/discovery-api/graphql_header.jpg" width="85%" title="Enter the header key and Bearer auth token values"/>

1. Run your query by clicking the blue query button in the top right of the **Operation** editor (to the right of the query). You should see a successful query response on the right side of the explorer.

<!-- TODO: Screenshot needs to be replaced with new one. If we want to show model historical runs, show `environment { applied { modelHistoricalRuns } }` -->
<!-- However we can choose to leave this be, since the important info from the screenshot is to show how the GraphQL API canbe used -- the content (request and response) doesn't matter too much` -->

<Lightbox src="/img/docs/dbt-cloud/discovery-api/graphql.jpg" width="85%" title="Run queries using the Apollo Server GraphQL explorer"/>

### Fragments

Use the [`... on`](https://www.apollographql.com/docs/react/data/fragments/) notation to query across lineage and retrieve results from specific node types.

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

Use the `PageInfo` object to return information about the page. The available fields are:

- `startCursor` string type &mdash; Corresponds to the first `node` in the `edge`.
- `endCursor` string type &mdash; Corresponds to the last `node` in the `edge`.
- `hasNextPage` boolean type &mdash; Whether or not there are more `nodes` after the returned results.

There are connection variables available when making the query:

- `first` integer type &mdash; Returns the first n `nodes` for each page, up to 500.
- `after` string type &mdash; Sets the cursor to retrieve `nodes` after. It's best practice to set the `after` variable with the object ID defined in the `endCursor` of the previous page.

Below is an example that returns the `first` 500 models `after` the specified Object ID in the variables. The `PageInfo` object returns where the object ID where the cursor starts, where it ends, and whether there is a next page.

<!-- TODO: Update screenshot to use `$environmentId: BigInt!, or remove it` -->
<!-- However we can choose to leave this be, since the important info from the screenshot is to show how the GraphQL API canbe used -- the content (request and response) doesn't matter too much` -->

<Lightbox src="/img/Paginate.png" width="75%" title="Example of pagination"/>

Below is a code example of the `PageInfo` object:

```graphql
pageInfo {
  startCursor
  endCursor
  hasNextPage
}
totalCount # Total number of records across all pages
```

### Filters

Filtering helps to narrow down the results of an API query. If you want to query and return only models and tests that are failing or find models that are taking too long to run, you can fetch execution details such as [`executionTime`](/docs/dbt-cloud-apis/discovery-schema-job-models#fields), [`runElapsedTime`](/docs/dbt-cloud-apis/discovery-schema-job-models#fields), or [`status`](/docs/dbt-cloud-apis/discovery-schema-job-models#fields). This helps data teams monitor the performance of their models, identify bottlenecks, and optimize the overall data pipeline.

Below is an example that filters for results of models that have succeeded on their `lastRunStatus`:

<Lightbox src="/img/Filtering.png" width="75%" title="Example of filtering"/>

Below is an example that filters for models that have an error on their last run and tests that have failed:

<!-- TODO: Update screenshot to use `$environmentId: BigInt!, or remove it` -->
<!-- However we can choose to leave this be, since the important info from the screenshot is to show how the GraphQL API canbe used -- the content (request and response) doesn't matter too much` -->

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
- [Schema](/docs/dbt-cloud-apis/discovery-schema-job)
