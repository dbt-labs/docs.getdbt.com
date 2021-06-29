---
title: "Example Queries"
id: "metadata-examples"
---

#### Finding parent models and sources

The example query below uses the `parentsModels` and `parentsSources` fields to fetch information about a model’s parent models and parent sources.

```graphql
{
  model(jobId: 123, uniqueId: "model.jaffle_shop.dim_user") {
    parentsModels {
      runId
      uniqueId
      executionTime
    }
    parentsSources {
      runId
      uniqueId
      state
    }
  }
}
```

#### Model Timing

The example query below pulls back information on a dim_user model. This could be useful if we wanted to understand information around execution timing on that model (start, end, completion).

```graphql
{
  model(jobId: 123, uniqueId: "model.jaffle_shop.dim_user") {
    runId
    projectId
    name
    uniqueId
    resourceType
    executeStartedAt
    executeCompletedAt
    executionTime
  }
}
```

#### Finding models by their database, schema, and identifier

The example query below finds a model by its unique database, schema, and identifier.

```graphql
{
  model(
    jobId: 123
    database: "analytics"
    schema: "analytics_debug"
    identifier: "dim_customers"
  ) {
    uniqueId
  }
}
```

#### Finding models by their schema

The example query below finds a model by its schema.

```graphql
{
  models(jobId: 123, schema: "analytics_debug") {
    uniqueId
  }
}
```

#### Source Information

The query below pulls relevant information about a given source. For example, we could see the load time and the state (“pass”, “fail”, “error”) of the source.

```graphql
{
  source(jobId: 123, uniqueId: "source.jaffle_shop.snowplow.event") {
    uniqueId
    sourceName
    name
    state
    maxLoadedAt
    criteria {
      warnAfter {
        period
        count
      }
      errorAfter {
        period
        count
      }
    }
    maxLoadedAtTimeAgoInS
  }
}
```
