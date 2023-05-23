---
title: "Use cases and examples for the Discovery API"
id: "metadata-use-case-guides" 
sidebar_label: "Common uses and scenarios"
---

With the Discovery API, you can query the metadata in dbt Cloud to learn more about your dbt deployments and the data it generates to analyze them and make improvements. 

You can use the API in a variety of ways to get answers to your business questions. Below describes some of the uses of the API. It's not a complete list and is meant to give you an idea of the questions this API can help you answer.  

| Use Case | Outcome | Example Questions |
| --- | --- | --- |
| Performance | Identify inefficiencies in pipeline execution to reduce infrastructure costs and improve timeliness. | <ul><li>What’s the latest status of each model?</li> <li>Do I need to run this model?</li><li>How long did my DAG take to run?</li> </ul>|
| Quality | Monitor data source freshness and test results to resolve issues and drive trust in data. | <ul><li>How fresh are my data sources?</li><li>Which tests and models failed?</li><li>What’s my project’s test coverage?</li></ul>  |
| Discovery | Find and understand relevant datasets and semantic nodes with rich context and metadata. | <ul><li>What do these tables and columns mean?</li><li>What’s the full data lineage?</li><li>Which metrics can I query?</li> </ul> |
| Governance | Audit data development and facilitate collaboration within and between teams. | <ul><li>Who is responsible for this model?</li><li>How do I contact the model’s owner?</li><li>Who can use this model?</li></ul>|
| Development | Understand dataset changes and usage and gauge impacts to inform project definition. | <ul><li>How is this metric used in BI tools?</li><li>Which nodes depend on this data source?</li><li>How has a model changed? What impact?</li> </ul>|

## Performance

## Discovery

It can help you answer questions such as:

- What does this table mean? 
- What columns are included in this table?
- Which metrics can I query? 

### Data catalog 

The Metadata API provides access to [model](/docs/build/models), [metric](/docs/build/metrics), and [source](/docs/build/sources) definitions and statuses in a dbt project. Column names and descriptions offer valuable context to help data consumers understand the data's meaning and what is worth analyzing. This descriptive metadata can also be useful for machine learning algorithms.

 To access catalog info like columns, you must [generate project documentation](/docs/collaborate/build-and-view-your-docs#set-up-a-documentation-job) in the job being queried.

<Tabs>

<TabItem value="querydatacatalog" label="Example query">

```
models(jobId: $jobId) {
    name
    uniqueId
    type
    description
    columns {
      name
      description
      type
    }
    status
    runGeneratedAt
    compiledSql
    owner
  }

```

</TabItem>

<TabItem value="responsedatacatalog" label="Example response">

 ```
 {
        "name": "customers",
        "uniqueId": "model.demo_data.customers",
        "type": "BASE TABLE",
        "description": "Customer overview data mart, offering key details for each unique customer. One row per customer.",
        "owner": "John Smith"
        "columns": [
          {
            "name": "CUSTOMER_ID",
            "description": "The unique key of the orders mart.",
            "type": "TEXT"
          },
          {
            "name": "CUSTOMER_NAME",
            "description": "Customers' full name.",
            "type": "TEXT"
          },
          {
            "name": "COUNT_LIFETIME_ORDERS",
            "description": "Total number of orders a customer has ever placed.",
            "type": "NUMBER"
          },
          {
            "name": "LIFETIME_SPEND",
            "description": "The sum of all the order totals (including tax) that a customer has ever placed.",
            "type": "FLOAT"
          },
          {
            "name": "CUSTOMER_TYPE",
            "description": "Options are 'new' or 'returning', indicating if a customer has ordered more than once or has only placed their first order to date.",
            "type": "TEXT"
          }
        ],
        "status": "success",
        "runGeneratedAt": "2023-02-24T18:02:06.551Z",
        "compiledSql": "with customers as select * from analytics.semantic_layer_demo.stg_customers ... select * from joined",
}
 ```

</TabItem>
</Tabs>


### Query dbt Metrics

The dbt Semantic Layer integrates tools that import [metric](/docs/build/metrics) definitions with time grain and dimensions, allowing users to query them. The Metadata API provides context about the metrics to power these user experiences. See the [dbt Semantic Layer integration guide](/guides/dbt-ecosystem/sl-partner-integration-guide) for more information about how to action these queries.

<Tabs>

<TabItem value="querymetrics" label="Example query">

```
metrics(jobId: $jobId) {
    name
    description
    dependsOn
    calculation_method
    expression
    dimensions
    timeGrains
  }
  ```
</TabItem>

<TabItem value="responsemetrics" label="Example response">

```
{
        "name": "expenses",
        "description": "Total expenses per order",
        "dependsOn": [
          "model.demo_data.orders"
        ],
        "calculation_method": "sum",
        "expression": "order_cost",
        "dimensions": [
          "location_name",
          "is_first_order"
        ],
        "timeGrains": [
          "week",
          "month",
        ]
}
```
</TabItem>

</Tabs>

### Project lineage

Users can use a project [graph](/terms/data-lineage) to explore lineage in catalogs and development tools. This helps them find existing objects, track down the root causes of issues, and understand the effects of changes to dbt project nodes. Although the [dbt Docs](/docs/collaborate/documentation) offer a lineage graph, the API allows for customized solutions. By traversing the DAG downstream through children or upstream through dependencies such as `dependsOn` and `parents`, users can tailor their experience to meet their specific needs.

*Note: Column-level lineage is not currently supported and usage of downstream tools like dashboards needs to be manually added as [exposures](/docs/build/exposures).*

<Tabs>

<TabItem value="querylineage" label="Example query">

```
query Lineage($jobId: Int!) {
  sources(jobId: $jobId) {
    uniqueId
    childrenL1
  }
  models(jobId: $jobId) {
    uniqueId
    dependsOn
    childrenL1
    parentsModels {
      uniqueId
      dependsOn
    }
    parentsSources {
      uniqueId
    }
  }
  metrics(jobId: $jobId) {
    uniqueId
    dependsOn
    model {
      uniqueId
      dependsOn
    }
  }
}
```

</TabItem>

<TabItem value="responselineage" label="Example response">

```
"sources": [
      {
        "name": "customers",
        "uniqueId": "source.demo_data.ecommerce.customers"
      },
      {
        "name": "locations",
        "uniqueId": "source.demo_data.ecommerce.locations"
      },
      {
        "name": "order_items",
        "uniqueId": "source.demo_data.ecommerce.order_items"
      },
      {
        "name": "orders",
        "uniqueId": "source.demo_data.ecommerce.orders"
      },
      {
        "name": "products",
        "uniqueId": "source.demo_data.ecommerce.products"
      },
      {
        "name": "supplies",
        "uniqueId": "source.demo_data.ecommerce.supplies"
      }
    ],
    "models": [
      {
        "name": "customers",
        "uniqueId": "model.demo_data.customers",
        "dependsOn": [
          "model.demo_data.stg_customers",
          "model.demo_data.orders"
        ],
        "parentsModels": [
          {
            "name": "orders",
            "uniqueId": "model.demo_data.orders",
            "dependsOn": [
              "model.demo_data.stg_orders",
              "model.demo_data.stg_order_items",
              "model.demo_data.stg_products",
              "model.demo_data.stg_locations",
              "model.demo_data.stg_supplies"
            ]
          },
          {
            "name": "stg_customers",
            "uniqueId": "model.demo_data.stg_customers",
            "dependsOn": [
              "source.demo_data.ecommerce.customers"
            ]
          },
          {
            "name": "stg_locations",
            "uniqueId": "model.demo_data.stg_locations",
            "dependsOn": [
              "source.demo_data.ecommerce.locations",
              "macro.dbt_utils.current_timestamp"
            ]
          },
          {
            "name": "stg_order_items",
            "uniqueId": "model.demo_data.stg_order_items",
            "dependsOn": [
              "source.demo_data.ecommerce.order_items"
            ]
          },
          {
            "name": "stg_orders",
            "uniqueId": "model.demo_data.stg_orders",
            "dependsOn": [
              "source.demo_data.ecommerce.orders",
              "macro.dbt_utils.current_timestamp"
            ]
          },
          {
            "name": "stg_products",
            "uniqueId": "model.demo_data.stg_products",
            "dependsOn": [
              "source.demo_data.ecommerce.products"
            ]
          },
          {
            "name": "stg_supplies",
            "uniqueId": "model.demo_data.stg_supplies",
            "dependsOn": [
              "source.demo_data.ecommerce.supplies",
              "macro.dbt_utils.surrogate_key"
            ]
          }
        ],
        "parentsSources": [
          {
            "name": "customers",
            "uniqueId": "source.demo_data.ecommerce.customers"
          },
          {
            "name": "locations",
            "uniqueId": "source.demo_data.ecommerce.locations"
          },
          {
            "name": "order_items",
            "uniqueId": "source.demo_data.ecommerce.order_items"
          },
          {
            "name": "orders",
            "uniqueId": "source.demo_data.ecommerce.orders"
          },
          {
            "name": "products",
            "uniqueId": "source.demo_data.ecommerce.products"
          },
          {
            "name": "supplies",
            "uniqueId": "source.demo_data.ecommerce.supplies"
          }
        ]
      },
      {
        "name": "orders",
        "uniqueId": "model.demo_data.orders",
        "dependsOn": [
          "model.demo_data.stg_orders",
          "model.demo_data.stg_order_items",
          "model.demo_data.stg_products",
          "model.demo_data.stg_locations",
          "model.demo_data.stg_supplies"
        ],
        "parentsModels": [
          {
            "name": "stg_locations",
            "uniqueId": "model.demo_data.stg_locations",
            "dependsOn": [
              "source.demo_data.ecommerce.locations",
              "macro.dbt_utils.current_timestamp"
            ]
          },
          {
            "name": "stg_order_items",
            "uniqueId": "model.demo_data.stg_order_items",
            "dependsOn": [
              "source.demo_data.ecommerce.order_items"
            ]
          },
          {
            "name": "stg_orders",
            "uniqueId": "model.demo_data.stg_orders",
            "dependsOn": [
              "source.demo_data.ecommerce.orders",
              "macro.dbt_utils.current_timestamp"
            ]
          },
          {
            "name": "stg_products",
            "uniqueId": "model.demo_data.stg_products",
            "dependsOn": [
              "source.demo_data.ecommerce.products"
            ]
          },
          {
            "name": "stg_supplies",
            "uniqueId": "model.demo_data.stg_supplies",
            "dependsOn": [
              "source.demo_data.ecommerce.supplies",
              "macro.dbt_utils.surrogate_key"
            ]
          }
        ],
        "parentsSources": [
          {
            "name": "locations",
            "uniqueId": "source.demo_data.ecommerce.locations"
          },
          {
            "name": "order_items",
            "uniqueId": "source.demo_data.ecommerce.order_items"
          },
          {
            "name": "orders",
            "uniqueId": "source.demo_data.ecommerce.orders"
          },
          {
            "name": "products",
            "uniqueId": "source.demo_data.ecommerce.products"
          },
          {
            "name": "supplies",
            "uniqueId": "source.demo_data.ecommerce.supplies"
          }
        ]
      },
      {
        "name": "stg_customers",
        "uniqueId": "model.demo_data.stg_customers",
        "dependsOn": [
          "source.demo_data.ecommerce.customers"
        ],
        "parentsModels": [],
        "parentsSources": [
          {
            "name": "customers",
            "uniqueId": "source.demo_data.ecommerce.customers"
          }
        ]
      },
      {
        "name": "stg_locations",
        "uniqueId": "model.demo_data.stg_locations",
        "dependsOn": [
          "source.demo_data.ecommerce.locations",
          "macro.dbt_utils.current_timestamp"
        ],
        "parentsModels": [],
        "parentsSources": [
          {
            "name": "locations",
            "uniqueId": "source.demo_data.ecommerce.locations"
          }
        ]
      },
      {
        "name": "stg_order_items",
        "uniqueId": "model.demo_data.stg_order_items",
        "dependsOn": [
          "source.demo_data.ecommerce.order_items"
        ],
        "parentsModels": [],
        "parentsSources": [
          {
            "name": "order_items",
            "uniqueId": "source.demo_data.ecommerce.order_items"
          }
        ]
      },
      {
        "name": "stg_orders",
        "uniqueId": "model.demo_data.stg_orders",
        "dependsOn": [
          "source.demo_data.ecommerce.orders",
          "macro.dbt_utils.current_timestamp"
        ],
        "parentsModels": [],
        "parentsSources": [
          {
            "name": "orders",
            "uniqueId": "source.demo_data.ecommerce.orders"
          }
        ]
      },
      {
        "name": "stg_products",
        "uniqueId": "model.demo_data.stg_products",
        "dependsOn": [
          "source.demo_data.ecommerce.products"
        ],
        "parentsModels": [],
        "parentsSources": [
          {
            "name": "products",
            "uniqueId": "source.demo_data.ecommerce.products"
          }
        ]
      },
      {
        "name": "stg_supplies",
        "uniqueId": "model.demo_data.stg_supplies",
        "dependsOn": [
          "source.demo_data.ecommerce.supplies",
          "macro.dbt_utils.surrogate_key"
        ],
        "parentsModels": [],
        "parentsSources": [
          {
            "name": "supplies",
            "uniqueId": "source.demo_data.ecommerce.supplies"
          }
        ]
      },
      {
        "name": "dbt_metrics_default_calendar",
        "uniqueId": "model.metrics.dbt_metrics_default_calendar",
        "dependsOn": [
          "macro.metrics.metric_date_spine",
          "macro.dbt.date_trunc"
        ],
        "parentsModels": [],
        "parentsSources": []
      }
    ],
    "metrics": [
      {
        "name": "customers",
        "uniqueId": "metric.demo_data.customers",
        "dependsOn": [
          "model.demo_data.orders"
        ],
        "model": {
          "name": "orders",
          "uniqueId": "model.demo_data.orders",
          "dependsOn": [
            "model.demo_data.stg_orders",
            "model.demo_data.stg_order_items",
            "model.demo_data.stg_products",
            "model.demo_data.stg_locations",
            "model.demo_data.stg_supplies"
          ]
        }
      },
      {
        "name": "expenses",
        "uniqueId": "metric.demo_data.expenses",
        "dependsOn": [
          "model.demo_data.orders"
        ],
        "model": {
          "name": "orders",
          "uniqueId": "model.demo_data.orders",
          "dependsOn": [
            "model.demo_data.stg_orders",
            "model.demo_data.stg_order_items",
            "model.demo_data.stg_products",
            "model.demo_data.stg_locations",
            "model.demo_data.stg_supplies"
          ]
        }
      },
      {
        "name": "gross_profit",
        "uniqueId": "metric.demo_data.gross_profit",
        "dependsOn": [
          "metric.demo_data.revenue",
          "metric.demo_data.expenses"
        ],
        "model": null
      },
      {
        "name": "revenue",
        "uniqueId": "metric.demo_data.revenue",
        "dependsOn": [
          "model.demo_data.orders"
        ],
        "model": {
          "name": "orders",
          "uniqueId": "model.demo_data.orders",
          "dependsOn": [
            "model.demo_data.stg_orders",
            "model.demo_data.stg_order_items",
            "model.demo_data.stg_products",
            "model.demo_data.stg_locations",
            "model.demo_data.stg_supplies"
          ]
        }
      }
    ]
```
</TabItem>
</Tabs>

## Quality

It can help you answer questions such as:

- How fresh are sources used by this model? 
- When was each model last run? 
- What’s the test coverage and status?  

When used with [webhooks](/docs/deploy/webhooks), can also help with detecting, investigating, and alerting issues.

### Tests

Data teams use the Metadata API to check the quality of their existing [tests](https://docs.getdbt.com/docs/build/tests) and fix any problems. They can see things like how many tests have failed and which fail often. This information can also be useful for other data users.

Test failures may show degraded data quality. In the following example query, one of the tests failed and the user should review upstream dependencies to make sure the data is valid and fix the problem there.

<Tabs>

<TabItem value="querytests" label="Example query">

```
tests(jobId: $jobId) {
    name
    skip
    state
    resourceType
    fail
    error
	columnName
    dependsOn
 }
 ```
 </TabItem>

 <TabItem value="responsetests" label="Example response">

```
{
        "name": "not_null_orders_order_id",
        "skip": false,
        "state": "ERROR",
        "resourceType": "test",
        "fail": true,
        "error": "Ensure orders are properly entered.",
        "columnName": "order_id",
        "dependsOn": [
          "model.demo_data.orders",
          "macro.dbt.test_not_null",
          "macro.dbt.get_where_subquery"
        ]
      },
{
        "name": "relationships_orders_customer_id__customer_id__ref_stg_customers_",
        "skip": false,
        "state": "pass",
        "resourceType": "test",
        "fail": false,
        "error": null,
        "columnName": "customer_id",
        "dependsOn": [
          "model.demo_data.stg_customers",
          "model.demo_data.orders",
          "macro.dbt.test_relationships",
          "macro.dbt.get_where_subquery"
        ]
      },
{
        "name": "unique_customers_customer_id",
        "skip": false,
        "state": "pass",
        "resourceType": "test",
        "fail": false,
        "error": null,
        "columnName": "customer_id",
        "dependsOn": [
          "model.demo_data.customers",
          "macro.dbt.test_unique",
          "macro.dbt.get_where_subquery"
        ]
      }
 ```
 </TabItem>
 </Tabs>

 ### Source freshness

Monitoring [source freshness](/docs/build/sources#snapshotting-source-data-freshness) can help users make sure that they're not using stale data or information. Similar to test failures, stale data can indicate a problem with the data pipeline and process. Data teams can check load time and freshness state to identify and fix issues with the data pipeline so that consumers have the most up-to-date data.

Data consumers can see how fresh the data is in their analytics tool using [status tiles](/docs/deploy/dashboard-status-tiles#setup), which helps them make sure they're making accurate conclusions based on the data.

*Note: To check whether data meets the requirements for freshness and SLAs, you can use a job that's set up to monitor [source freshness](/docs/deploy/source-freshness).*

<Tabs>

<TabItem value="queryfreshness" label="Example query">

```
source(jobId: $jobId, uniqueId: $uniqueId) {
    name
    description
    uniqueId
    type
    database
    freshnessChecked
    state
    identifier
    loader
    snapshottedAt
    maxLoadedAt
    stats {
      label
      description
      value
    }
}
 ```
 </TabItem>

 <TabItem value="responsefreshness" label="Example response">

```
"source": {
      "name": "customers",
      "description": "One record per person who has purchased one or more items",
      "uniqueId": "source.demo_data.ecommerce.customers",
      "type": "EXTERNAL TABLE",
      "database": "DBT_DEMO_DATA",
      "freshnessChecked": false,
      "state": "pass",
      "identifier": "customers",
      "loader": "manual",
      "snapshottedAt": "2022-12-03T10:15:30Z",
      "maxLoadedAt": "2022-12-04T07:31:28Z",
      "stats": [
        {
          "label": "Approximate Size",
          "description": "Approximate size of the table as reported by Snowflake",
          "value": 132733
        }
      ]
    }
 ```
 </TabItem>
 </Tabs>

 ### Dataset statistics

The Metadata API provides statistics about a dataset, such as how many rows and columns it has, null values, and when it was last updated. API users, like data quality tools, can use this information to check if the dataset is accurate and usable. This is helpful when the dataset doesn't come with this information already. Tools can add extra information such as the model owner and metadata tags to give more meaning and structure to analyses.

<Tabs>

<TabItem value="querydataset" label="Example query">

```
model(jobId: $jobId, uniqueId: $uniqueId) {
    database
    schema
    name
    status
    executeCompletedAt
    executionTime
    stats {
      id
      label
      description
      include
      value
    }
  }
 ```
 </TabItem>

 <TabItem value="responsedataset" label="Example response">

```
"model": {
      "database": "analytics",
      "schema": "semantic_layer_demo",
      "name": "customers",
      "status": "success",
      "executeCompletedAt": "2023-03-06T17:02:01.216Z",
      "executionTime": 3.737823247909546,
      "stats": [
        {
          "id": "bytes",
          "label": "Approximate Size",
          "description": "Approximate size of the table as reported by Snowflake",
          "include": true,
          "value": 184832
        },
        {
          "id": "last_modified",
          "label": "Last Modified",
          "description": "The timestamp for last update/change",
          "include": true,
          "value": "2023-03-06 17:02UTC"
        },
        {
          "id": "row_count",
          "label": "Row Count",
          "description": "An approximate count of rows in this table",
          "include": true,
          "value": 2702
        },
        {
          "id": "has_stats",
          "label": "Has Stats?",
          "description": "Indicates whether there are statistics for this table",
          "include": false,
          "value": true
        }
      ]
    }
 ```
 </TabItem>
 </Tabs>

 ## Operations

Operations are at the heart of dbt Cloud. Understanding how dbt works is essential for developing projects and configuring orchestration. By keeping an eye on the system's health through observability, data teams can use dbt with precision, cutting down on infrastructure and time costs for your organization. 

Users often use the [model timing](/docs/dbt-versions/release-notes/January-2022/model-timing-more) tab (example below) which demonstrates how the Metadata API helps identify and optimize bottlenecks in "model builds". 

<Lightbox src="/img/docs/dbt-cloud/metadata-api/model-timing.jpg" width="200%" title="Model timing visualization in dbt Cloud"/>

### Run performance

The Metadata API allows users to analyze deployment activity by monitoring higher-level statistics such as run count and success rate. The data team can use this information to better understand dbt Cloud usage, and identify issues that cause run failures and outdated data. 

Users can query up to the last 10 runs for a given environment to track trends in run statistics.

<Tabs>

<TabItem value="queryperformance" label="Example query">

```
modelByEnvironment(environmentId: $environmentId, uniqueId: $uniqueId, lastRunCount: $lastRunCount) {
    uniqueId
    status
    database
    schema
    name
    resourceType
    type
    materializedType
    tests{
      columnName
      error
      fail
      status
    }
    runResults {
      executionTime
      runGeneratedAt
      runElapsedTime
      error
      status
      skip
      compileStartedAt
      compileCompletedAt
      executeStartedAt
      executeCompletedAt
    }  
  }
}
 ```
 </TabItem>

 <TabItem value="responseperformance" label="Example response">

```
"modelByEnvironment": [
      {
        "uniqueId": "model.demo_data.customers",
        "status": "success",
        "database": "analytics",
        "schema": "semantic_layer_demo",
        "name": "customers",
        "resourceType": "model",
        "type": "BASE TABLE",
        "materializedType": "table",
        "tests": [
          {
            "columnName": "customer_type",
            "error": null,
            "fail": false,
            "status": "pass"
          },
          {
            "columnName": "customer_id",
            "error": null,
            "fail": false,
            "status": "pass"
          },
          {
            "columnName": "customer_id",
            "error": null,
            "fail": false,
            "status": "pass"
          }
        ],
        "runResults": [
          {
            "executionTime": 3.737823247909546,
            "runGeneratedAt": "2023-03-06T17:02:02.713Z",
            "runElapsedTime": 72.83101916313171,
            "error": null,
            "status": "success",
            "skip": false,
            "compileStartedAt": "2023-03-06T17:01:57.656Z",
            "compileCompletedAt": "2023-03-06T17:01:57.662Z",
            "executeStartedAt": "2023-03-06T17:01:57.662Z",
            "executeCompletedAt": "2023-03-06T17:02:01.216Z"
          }
        ]
      },
      {
        "uniqueId": "model.demo_data.customers",
        "status": "success",
        "database": "analytics",
        "schema": "semantic_layer_demo",
        "name": "customers",
        "resourceType": "model",
        "type": "BASE TABLE",
        "materializedType": "table",
        "tests": [
          {
            "columnName": "customer_type",
            "error": null,
            "fail": false,
            "status": "pass"
          },
          {
            "columnName": "customer_id",
            "error": null,
            "fail": false,
            "status": "pass"
          },
          {
            "columnName": "customer_id",
            "error": null,
            "fail": false,
            "status": "pass"
          }
        ],
        "runResults": [
          {
            "executionTime": 2.966937780380249,
            "runGeneratedAt": "2023-03-06T16:02:31.295Z",
            "runElapsedTime": 73.83759474754333,
            "error": null,
            "status": "success",
            "skip": false,
            "compileStartedAt": "2023-03-06T16:02:27.002Z",
            "compileCompletedAt": "2023-03-06T16:02:27.007Z",
            "executeStartedAt": "2023-03-06T16:02:27.007Z",
            "executeCompletedAt": "2023-03-06T16:02:29.710Z"
          }
        ]
      },
      {
        "uniqueId": "model.demo_data.customers",
        "status": "success",
        "database": "analytics",
        "schema": "semantic_layer_demo",
        "name": "customers",
        "resourceType": "model",
        "type": "BASE TABLE",
        "materializedType": "table",
        "tests": [
          {
            "columnName": "customer_type",
            "error": null,
            "fail": false,
            "status": "pass"
          },
          {
            "columnName": "customer_id",
            "error": null,
            "fail": false,
            "status": "pass"
          },
          {
            "columnName": "customer_id",
            "error": null,
            "fail": false,
            "status": "pass"
          }
        ],
        "runResults": [
          {
            "executionTime": 3.0948281288146973,
            "runGeneratedAt": "2023-03-06T15:02:20.175Z",
            "runElapsedTime": 73.74312734603882,
            "error": null,
            "status": "success",
            "skip": false,
            "compileStartedAt": "2023-03-06T15:02:15.719Z",
            "compileCompletedAt": "2023-03-06T15:02:15.727Z",
            "executeStartedAt": "2023-03-06T15:02:15.727Z",
            "executeCompletedAt": "2023-03-06T15:02:18.622Z"
          }
        ]
      },
      {
        "uniqueId": "model.demo_data.customers",
        "status": "success",
        "database": "analytics",
        "schema": "semantic_layer_demo",
        "name": "customers",
        "resourceType": "model",
        "type": "BASE TABLE",
        "materializedType": "table",
        "tests": [
          {
            "columnName": "customer_type",
            "error": null,
            "fail": false,
            "status": "pass"
          },
          {
            "columnName": "customer_id",
            "error": null,
            "fail": false,
            "status": "pass"
          },
          {
            "columnName": "customer_id",
            "error": null,
            "fail": false,
            "status": "pass"
          }
        ],
        "runResults": [
          {
            "executionTime": 3.014812469482422,
            "runGeneratedAt": "2023-03-06T14:01:58.360Z",
            "runElapsedTime": 71.57624459266663,
            "error": null,
            "status": "success",
            "skip": false,
            "compileStartedAt": "2023-03-06T14:01:53.994Z",
            "compileCompletedAt": "2023-03-06T14:01:54.000Z",
            "executeStartedAt": "2023-03-06T14:01:54.000Z",
            "executeCompletedAt": "2023-03-06T14:01:56.809Z"
          }
        ]
      },
      {
        "uniqueId": "model.demo_data.customers",
        "status": "success",
        "database": "analytics",
        "schema": "semantic_layer_demo",
        "name": "customers",
        "resourceType": "model",
        "type": "BASE TABLE",
        "materializedType": "table",
        "tests": [
          {
            "columnName": "customer_type",
            "error": null,
            "fail": false,
            "status": "pass"
          },
          {
            "columnName": "customer_id",
            "error": null,
            "fail": false,
            "status": "pass"
          },
          {
            "columnName": "customer_id",
            "error": null,
            "fail": false,
            "status": "pass"
          }
        ],
        "runResults": [
          {
            "executionTime": 3.4301769733428955,
            "runGeneratedAt": "2023-03-06T13:02:16.868Z",
            "runElapsedTime": 72.33108758926392,
            "error": null,
            "status": "success",
            "skip": false,
            "compileStartedAt": "2023-03-06T13:02:11.908Z",
            "compileCompletedAt": "2023-03-06T13:02:11.913Z",
            "executeStartedAt": "2023-03-06T13:02:11.914Z",
            "executeCompletedAt": "2023-03-06T13:02:15.145Z"
          }
        ]
      }
    ]
 ```
 </TabItem>
 </Tabs>

 ### Model builds

By analyzing the model build times, users can identify bottlenecks and optimize code and orchestration settings to reduce costs and speed up data access. The data team can use this information to improve models and reduce data platform query consumption, meeting downstream consumer freshness SLAs. Additionally, they can adjust the orchestration schedule to run slower models less frequently to avoid bottlenecks.

<Tabs>

<TabItem value="querybuilds" label="Example query">

```
{
  modelByEnvironment(environmentId: $environmentId, uniqueId: $uniqueId, lastRunCount: $lastRunCount) {
    uniqueId
    status
    runResults {
      executionTime
      runGeneratedAt
      runElapsedTime
      error
      status
      skip
      compileStartedAt
      compileCompletedAt
      executeStartedAt
      executeCompletedAt
    }  
  }
 ```
 </TabItem>

 <TabItem value="responsebuilds" label="Example response">

```
"modelByEnvironment": [
      {
        "uniqueId": "model.demo_data.customers",
        "status": "success",
        "runResults": [
          {
            "executionTime": 2.692153215408325,
            "runGeneratedAt": "2023-02-27T02:01:55.593Z",
            "runElapsedTime": 76.84831595420837,
            "error": null,
            "status": "success",
            "skip": false,
            "compileStartedAt": "2023-02-27T02:01:51.210Z",
            "compileCompletedAt": "2023-02-27T02:01:51.216Z",
            "executeStartedAt": "2023-02-27T02:01:51.216Z",
            "executeCompletedAt": "2023-02-27T02:01:53.723Z"
          }
        ]
      },
      {
        "uniqueId": "model.demo_data.customers",
        "status": "success",
        "runResults": [
          {
            "executionTime": 3.1301932334899902,
            "runGeneratedAt": "2023-02-27T01:02:22.586Z",
            "runElapsedTime": 71.21909546852112,
            "error": null,
            "status": "success",
            "skip": false,
            "compileStartedAt": "2023-02-27T01:02:18.012Z",
            "compileCompletedAt": "2023-02-27T01:02:18.017Z",
            "executeStartedAt": "2023-02-27T01:02:18.017Z",
            "executeCompletedAt": "2023-02-27T01:02:20.935Z"
          }
        ]
      },
      {
        "uniqueId": "model.demo_data.customers",
        "status": "success",
        "runResults": [
          {
            "executionTime": 3.045269250869751,
            "runGeneratedAt": "2023-02-27T00:02:31.981Z",
            "runElapsedTime": 72.81425666809082,
            "error": null,
            "status": "success",
            "skip": false,
            "compileStartedAt": "2023-02-27T00:02:27.267Z",
            "compileCompletedAt": "2023-02-27T00:02:27.275Z",
            "executeStartedAt": "2023-02-27T00:02:27.275Z",
            "executeCompletedAt": "2023-02-27T00:02:30.073Z"
          }
        ]
      }
    ]
 ```
 </TabItem>
 </Tabs>

 ## Related docs

- [Metadata API product roadmap](/docs/dbt-cloud-apis/metadata-api#product-roadmap)
- [Query Metadata API](/docs/dbt-cloud-apis/discovery-querying)
- [dbt Semantic Layer integration guide](/guides/dbt-ecosystem/sl-partner-integration-guide)
