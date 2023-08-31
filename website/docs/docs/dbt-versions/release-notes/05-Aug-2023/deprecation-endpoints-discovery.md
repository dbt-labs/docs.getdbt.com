---
title: "Deprecation: Query patterns and endpoints in the dbt Cloud Discovery API"
description: "August 2023: Learn about the upcoming deprecation of certain endpoints and query patterns in the Discovery API."
sidebar_position: 6
sidebar_label: "Deprecation: Certain Dicovery API endpoints and query patterns"
tags: [Aug-2023, API]
date: 2023-08-31
---

dbt Labs has deprecated and will be deprecating certain query patterns and replacing them with new conventions to enhance the performance of the dbt Cloud [Discovery API](/docs/dbt-cloud-apis/discovery-api). 

All these changes will be in effect on _September 7, 2023_. 

We understand that these changes might require adjustments to your existing integration with the Discovery API. Please [contact us](mailto:support@getdbt.com) with any questions. We're here to help you during this transition period.

## Job-based queries

Job-based queries that use the data type `Int` for IDs will be deprecated. They will be marked as deprecated in the [GraphQL explorer](https://metadata.cloud.getdbt.com/graphql). The new convention will be for you to use the data type `BigInt` instead. 

This change will be in effect starting September 7, 2023. 


Example of query before deprecation: 

```graphql
query ($jobId: Int!) {
  models(jobId: $jobId){
    uniqueId
  }
}
```

Example of query after deprecation:

```graphql
query ($jobId: BigInt!) {
  job(id: $jobId) {
    models {
      uniqueId
    }
  }
}
```

## modelByEnvironment queries 

The `modelByEnvironment` object has been renamed and moved into the `environment` object. This change is in effect and has been since August 15, 2023.

Example of query before deprecation: 

```graphql
query ($environmentId: Int!, $uniqueId: String) {
  modelByEnvironment(environmentId: $environmentId, uniqueId: $uniqueId) {
    uniqueId
    executionTime
    executeCompletedAt
  }
}
```

Example of query after deprecation: 

```graphql
query ($environmentId: BigInt!, $uniqueId: String) {
  environment(id: $environmentId) {
    applied {
      modelHistoricalRuns(uniqueId: $uniqueId) {
        uniqueId
        executionTime
        executeCompletedAt
      }
    }
  }
}
```


## Environment and account queries

Environment and account queries that use `Int` as a data type for ID has been deprecated. IDs must now be in `BigInt`. This change is in effect and has been since August 15, 2023.


Example of query before deprecation: 

```graphql
query ($environmentId: Int!, $first: Int!) {
  environment(id: $environmentId) {
    applied {
      models(first: $first) {
        edges {
          node {
            uniqueId
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


Example of query after deprecation: 

```graphql
query ($environmentId: BigInt!, $first: Int!) {
  environment(id: $environmentId) {
    applied {
      models(first: $first) {
        edges {
          node {
            uniqueId
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


