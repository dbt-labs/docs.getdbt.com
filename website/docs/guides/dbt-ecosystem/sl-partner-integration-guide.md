---
title: "Semantic Layer integration" 
id: "sl-partner-integration-guide"
---

# dbt Semantic Layer partner integration guide

The dbt Semantic Layer allows users to dynamically generate and query datasets in downstream tools based on their dbt governed assets, like metrics, models, and entities. It helps organizations manage complexities like data, tools, and teams to make more efficient and trustworthy decisions.

## Overview

The rapid growth of different tools in the modern data stack has largely been a good thing for data professionals - the many different tools address the different needs of different teams. The downside of this growth is the fragmentation of business logic across teams, tools, and workloads. 

To solve this, the dbt Semantic Layer provides a platform where users can confidently leverage their data from within their tools. dbt Cloud's change management capabilities ensure that any user modifications made to core business constructs, like metrics or entities, are distributed into all the tools connected to the data platform.

The dbt Semantic Layer is unopinionated about specific tools, use cases, or applications of data. Review some of the common use cases for the  dbt Semantic Layer below:

* BI, analytics, and data science
* Data quality and monitoring
* Governance and privacy
* Data discovery and cataloging

<!-- rewrite below little and would like to see if i can include a button or callout -->

:::info Share your use case

To share other use cases for the dbt Semantic Layer, contact the [dbt Labs team](mailto:semantic-layer@dbtlabs.com).

:::


## Product overview

The dbt Semantic Layer product architecture includes four primary components:

| Components | Information | Developer plans | Team plans | Enterprise plans | License |
| --- | --- | :---: | :---: | :---: | --- |
| **[dbt Project](/docs/build/metrics)** | Define models and metrics in dbt Core. | ✅ | ✅ |  ✅  | Open source, Core |
| **[dbt Server](https://github.com/dbt-labs/dbt-server)**| A persisted HTTP server that wraps dbt core to handle RESTful API requests for dbt operations. | ✅ | ✅ | ✅ | BSL |
| **SQL Proxy** | Reverse-proxy that accepts dbt-SQL (SQL + Jinja-like query models and metrics, use macros), compiles the query into pure SQL, and executes the query against the data platform. | ✅ <br></br>_* Available during Public Preview only_ | ✅ | ✅ | Proprietary, Cloud (Team & Enterprise) |
| **[dbt Cloud Metadata API](/docs/dbt-cloud-apis/metadata-api)**  | Accesses metric definitions primarily via integrations and is the source of truth for objects defined in dbt projects (like models, macros, sources, and metrics). The Metadata API is updated at the end of every dbt Cloud run. | ❌ | ✅ | ✅ | Proprietary, Cloud (Team & Enterprise |
    
Review the current architecture below to understand how the components work together:
  
<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-architecture-flow.png" title="dbt Semantic Layer components" />


## Integration guidelines

In collaboration with dbt Labs, partners can build a dbt Semantic Layer integration that can import model metadata and metric definitions, connect with the dbt Semantic Layer, query metrics, and more. For more details, review the Roadmap and Integration best practices guidance below.

### Partner integration roadmap

Integration partners generally build and approach their roadmap as follows:

| Feature  |  Info | Availability |
|----------|-------|:------------:|
| **Model metadata**  |  Import/sync model metadata (descriptions, dimensions, test, freshness, and more) via the [dbt Cloud Metadata API](/docs/dbt-cloud-apis/metadata-api). | ✅ |
| ** Metric definitions**  | Import/sync metric definitions (metric calculation, dimensions, description, and more) via the [dbt Cloud Metadata API](/docs/dbt-cloud-apis/metadata-api). | ✅ |
| **dbt Semantic Layer as a data source**  | Connect to the dbt Semantic Layer as a data source (for example, the Snowflake Proxy Server). Users can execute dbt-SQL to query metrics or models and use macros. Review **dbt Semantic Layer connector** for more info. | ✅ |
| **Query metrics**  | Query the imported metrics via a metric-centric UI (for example, a user can select a metric, time grain, and dimensions of interest). | ✅ |
| **Entity definitions**  | Import/sync entity definitions (descriptions, dimensions, data types, relationships, metrics, and more) and query entities via the dbt Semantic Layer. | _Coming soon, review the [Product Roadmap](#product-roadmap) for more details_ |
|**dbt Semantic Layer connector** * | A dedicated Semantic Layer connector with the ability to query any data platform supported in dbt Cloud. | _Coming soon, review the [Product Roadmap](#product-roadmap) for more details_ |

The _coming soon_ features above are expected to launch in 2023. Review the [Product Roadmap](#product-roadmap) for more details and timelines.

### Integration best practice

To build a successful and seamless dbt Semantic Layer integration, it should include the following:

- Have a consistent user experience (UX) &mdash; The integration shouldn’t be a hidden appendage.
- Treat dbt assets (like metrics, models, entities) as first-class objects and indicate that the definitions and resulting dataset come from dbt Cloud.
- Include a self-serve experience so a data consumer can ask questions via the user interface (UI), if applicable.
- Clarify the difference between the dbt Semantic Layer (more efficient) and the current approach in setting up metrics/analyses in the tool.


## Connect and query the Metadata API

To get started, you must meet the dbt Semantic Layer [prerequisites](/docs/use-dbt-semantic-layer/dbt-semantic-layer#prerequisites). This section will explain how to connect to and query the [Metadata API](/docs/dbt-cloud-apis/metadata-api) for model and metric definitions.

### Metadata API authorization

To learn how to authorize requests to the Metadata API, review the [documentation](/docs/dbt-cloud-apis/metadata-querying#authorization). Metrics-specific queries work identically to existing Metadata API queries, so existing integrations used to fetch model metadata will work perfectly in the context of metrics. 

Test out the Metadata API by using the [GraphQL sandbox](https://studio.apollographql.com/sandbox/explorer?endpoint=https%3A%2F%2Fmetadata.cloud.getdbt.com%2Fgraphql). 


### Fetch models for a project

You can fetch and query models, or details about a specific model, for a project from a given job.

<!--- tabs for listing models and fetching details about specific model --->
<Tabs>

<TabItem value="list" label="Listing models">

This is an example of fetching all models that utilize the schema, “analytics” from a given job.

```
{  
 models(jobId: 181329, schema: "analytics") {
   name
   status
   compileCompletedAt
   database
   dbtVersion
   runGeneratedAt
   }
}
{
   "data": {
       "models": [
           {
               "name": "customers",
               "status": "success",
               "compileCompletedAt": "2022-12-15T06:37:24.186Z",
               "database": "analytics",
               "dbtVersion": "1.3.1",
               "runGeneratedAt": "2022-12-15T06:37:25.187Z"
           },
           {
               "name": "stg_customers",
               "status": "success",
               "compileCompletedAt": "2022-12-15T06:37:22.509Z",
               "database": "analytics",
               "dbtVersion": "1.3.1",
               "runGeneratedAt": "2022-12-15T06:37:25.187Z"
           },
           {
               "name": "stg_orders",
               "status": "success",
               "compileCompletedAt": "2022-12-15T06:37:22.509Z",
               "database": "analytics",
               "dbtVersion": "1.3.1",
               "runGeneratedAt": "2022-12-15T06:37:25.187Z"
           }
       ]
   }
}
```

</TabItem>

<TabItem value="details" label="Fetch details about a specific model">

This is an example of fetching details about a specific model, “model.jaffle_shop.customers” from a given job.

```
{
 model(jobId: 181329, uniqueId: "model.jaffle_shop.customers") {
   parentsModels {
     runId
     uniqueId
     executionTime
   }
 }
}
{
   "data": {
       "model": {
           "parentsModels": [
               {
                   "runId": 105297555,
                   "uniqueId": "model.jaffle_shop.stg_customers",
                   "executionTime": 1.676571846008301
               },
               {
                   "runId": 105297555,
                   "uniqueId": "model.jaffle_shop.stg_orders",
                   "executionTime": 1.631831407546997
               }
           ]
       }
   }
}
```

</TabItem>

</Tabs>

<!--- End tabs for listing models and fetching details about specific model --->

### Fetch metrics for a project

Fetch and query metrics for a project from a given job. To fetch the full list of metrics defined in a user’s project via the dbt Cloud Metadata API, use the [Metrics query](/docs/dbt-cloud-apis/metadata-schema-metrics). Review the [metrics docs](https://docs.getdbt.com/docs/build/metrics#available-properties) for information about the metric properties. 

Test out the API using the [GraphQL sandbox](https://studio.apollographql.com/sandbox/explorer?endpoint=https%3A%2F%2Fmetadata.cloud.getdbt.com%2Fgraphql). 

<!--- tabs for listing, fetching, example, and querying metrics --->
<Tabs>

<TabItem value="list" label="Listing metrics">

This is an example listing metrics from a given job.

```
{
  metrics(jobId: 123) {
    name
    label
    description
		model
		dependsOn
    calculation_method
    expression
    timestamp
		timeGrains
    dimensions
		window
    filters
    tags
    meta
  }
}
```

</TabItem>

<TabItem value="fetch" label="Fetch details about a specific metric">

As a note, all metric properties shown displayed above are supported in this `metric` query, however, an abbreviated query is used here as an example.

This is an example of fetching details about a specific metric "new_customers" from a given job "123".

```
{
  metric(jobId: 123) {
    label
    calculation_method
    timestamp
    timeGrains
    dimensions
  }
}
```

</TabItem>

<TabItem value="example" label="Example metric definition">

```
metrics:
  - name: total_claim_charges
    label: Total Claim Charges
    model: ref('fct_billed_patient_claims')
    calculation_method: sum
    expression: total_charge_amount
    timestamp: created_at
    time_grains: [day, week, month, all_time]


  - name: total_billed_diagnoses
    label: Total Billed Diagnoses
    model: ref('fct_billed_patient_claims')
    calculation_method: count_distinct
    expression: diagnosis_id
    timestamp: created_at
    time_grains: [day, week, month]
```

</TabItem>

<TabItem value="queryapi" label="Query the Metadata API for metrics">

```
{
  metric(jobId: 123) {
    label
    calculation_method
    timestamp
    timeGrains
    dimensions
  }
}
```
</TabItem>

<TabItem value="exampleapi" label="Example Metadata API response with metrics">

```
{
  "data": {
    "metrics": [
      {
        "uniqueId": "metric.claim_to_fame.total_claim_charges",
        "name": "total_claim_charges",
        "tags": [],
        "label": "Total Claim Charges",
        "calculation_method": "sum",
        "expression": "total_charge_amount",
        "timestamp": "created_at",
        "timeGrains":[
          "day",
          "week",
          "month"
        ],
        "meta": {},  
        "resourceType": "metric",
        "model": {
          "name": "fct_billed_patient_claims"
        }
       },
      {
        "uniqueId": "metric.claim_to_fame.total_billed_diagnoses",
        "name": "total_billed_diagnoses",
        "tags": [],
        "label": "Total Billed Diagnoses",
        "calculation_method": "count_distinct",
        "expression": "diagnosis_id",
        "timestamp": "created_at",
        "timeGrains":[
          "week",
          "month",
          "year"
        ],
        "meta": {},  
        "resourceType": "metric",
        "model": {
          "name": "fct_billed_patient_claims"
        },
      }
     ]
  }
}
```

</TabItem>
</Tabs>

<!--- End tabs for listing, fetching, example, and querying metrics --->


## Query the Semantic Layer

This section explains how to connect to or query the dbt Semantic Layer Proxy Server to return model data, metric data, and so on. 

When the dbt Semantic Layer is configured, dbt Cloud provides a Proxy Server endpoint that users can connect to as though it's a Snowflake-hosted endpoint. When queries are submitted, dbt Cloud will:

1. Compile dbt-sql queries into valid Snowflake SQL
2. Execute that compiled SQL against the Snowflake data platform
3. Return the results to the client

Replace the hostname in your existing Snowflake connection with the relevant dbt Cloud Proxy Server URL (for example, abc123.proxy.cloud.getdbt.com), and all queries submitted through the endpoint will be compiled en route to the data platform. 

_Note: This approach will change with the new Semantic Layer connection, which will be able to query all data platforms supported in dbt Cloud via dedicated JDBC/ODBC drivers (and eventually an API)._


<!--- tabs for running models and running metrics --->
<Tabs>

<TabItem value="models" label="Model queries">

Model queries allow users to query models and use macros from their dbt project.

```
select cents_to_dollars('amount_cents') as amount_dollars 
from {{ ref('orders') }}
```

</TabItem>

<TabItem value="metrics" label="Metric queries">

Users can compile and execute metric queries using macros defined in the [dbt-metrics package](https://github.com/dbt-labs/dbt_metrics).  This package:
* generates the SQL required to accurately calculate the metric definition,
* supplies helper macros for derived calculations (like month over month, year to date, and so on) time series operations


```
select * 
from {{ metrics.calculate(
    metric_list=[metric('customers'), metric(‘revenue’)],
    grain='week',
    dimensions=['plan', 'country'],
    secondary_calculations=[
        metrics.period_to_date(aggregate="sum", period="year"),
        metrics.rolling(aggregate="average", interval=4, alias="avg_past_4wks")
    ],
    start_date='2020-01-01',
    end_date="date_trunc('day', getdate())"
) }}
```

</TabItem>

</Tabs>

## Product Roadmap

The dbt Semantic Layer product roadmap details what features are coming soon and the timelines associated with them. 

| Product | Estimated launch |
| ------- | ---------------- |
| [Entities](#entities) | Estimated launch &mdash; early 2023 |
| [dbt Semantic Layer connector](##dbt-semantic-layer-connector) | Estimated launch &mdash; early-mid 2023 |
| [dbt Semantic Layer API](#dbt-semantic-layer-api) | Estimated launch &mdash; mid 2023 |

### Entities 
<!-- rewrite a little and include a summary for each tab entry -->

dbt Labs is introducing a new node type, [the entity](https://github.com/dbt-labs/dbt-core/issues/6379), when dbt Core version 1.5 launches. This introduces a new and efficient way to define metrics by reusing logic, for example, `time_grains`.  Entities are semantic objects made up of curated dimensions from models with more metadata defined. Over time, users can standardize metric and entity definitions with packages to speed up development. 

For integrations, entities will provide information like:

- a way to organize metrics based on the entity they reference, and 
- a new consumable and dynamically generated dataset (versus finding a table in the data platform). 

This information will be available alongside the Metadata API and entities can be directly queried through the Semantic Layer. 

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/entity-lineage.jpg" title="Entity lineage" />

:::caution 🚧

Note this is a work in progress and you can exoect continuous changes and improvements.

:::

<!--- tabs for running entity def, entity metadata response, metric def, metric metadata response, entity queries --->

<Tabs>

<TabItem value="entitydef" label="Entity definition">

Define entities in your dbt project.

```
entities: ## The top-level path of the new node
  - name: [Required] ## The name of the entity
    model: [Required] ## The name of the model that the entity is dependent on
    description: [Optional] ## The description of the entity
    
    dimensions: [Optional] ## The list of dimensions & properties associated with the entity. 
      - include: [Optional] *
      - exclude: [Optional]
      - name: [Required] ## The name of the dimension 
		column_name: [Optional] ## The name of the column in the model if not 1:1. Serves as mapping
		data_type: [Optional] ## The data type of the dimension
		description: [Optional] ## Description of the dimension
		default_timestamp: [Optional] ## Setting datetime dimension as default for metrics
		time_grains: [Optional] ## Acceptable time grains for the datetime dimension
		primary_key: [Optional] ## Whether this dimension is part of the primary key
```

</TabItem>

<TabItem value="entityapi" label="Entity metadata API response">

Fetch entities via the Metadata API.

```
"entity.project_name.entity_name": {
      "unique_id": "entity.project_name.entity_name",
      "package_name": "project_name",
      "original_file_path": "models/metric_definitions/ratio_metric.yml",
      "name": "entity_name",
      "model": "ref('model_name')",
      "description": "some description",
      "dimensions": {
				"dimension_name": {
            "name": "dimension_name",
						"column_name": "column_name",
						"default_timestamp": "true",
						"time_grains": "[day, week, month, year]"
            "primary_key": true,
            "data_type": null,
            "description": "TBD",
            "meta": {},
						}
      },
      "resource_type": "entity",
      "meta": {},
      "tags": [],
      "config": {
          "enabled": true,
      },
      "depends_on": {
          "macros": [],
          "nodes": [
              "model.project_name.model_name",
          ]
      },
			"docs": {
        "show": true,
        "node_color": null
      },
      "refs": [
					[
						"model_name",
					]
			],
      "created_at": 1669653016.522599
  },
  ```
  </TabItem>

<TabItem value="newmetricdef" label="New metric definition">

How to define new [metrics](/docs/build/metrics) in your dbt project. The metric definition and metadata response will change accordingly once entities are introduced, notably with metrics referencing entities instead of models and inheriting entity dimensions. 

```
metrics: 
		## Always required
	     - name: [Required] ## The name of the metric
		label: [Required] ## The human-readable name of the metric
		calculation_method: [Required] ## The calculation/aggregation used for the metric
		expression: [Required] ## The SQL expression being aggregated/calculated
		entity: [Required] ## The entity being used as the source of the metric

		## Always optional
		description: [Optional] ## Any description about the metric
		timestamp: [Optional] ## The name of the timestamp field to use
		time_grains: [Optional] ## The list of time grains that are permitted
		filters: [Optional] ## The filters of the metric
		window: [Optional] ## The ability to make a metric cumulative over a time period
		config: [Optional] ## Additional information for configuring the output
		
		## Either or dimensions:
			include: [Optional] ## The list of dimensions to be included. Either * or list
			exclude: [Optional] ## The list of dimensions to be excluded from the inherited list
      ```
      </TabItem>
      
<TabItem value="newmetricapi" label="New metric metadata API response">

```
"metric.project_name.metric_name": {
      "fqn": [
          "project_name",
          "folder_name",
          "metric_name"
      ],
      "unique_id": "metric.project_name.metric_name",
      "package_name": "project_name",
      "root_path": "file_path",
      "path": "file_path",
      "original_file_path": "file_path",
      "name": "metric_name",
      "description": "description",
			"entity": "entity_name",
      "label": "Human readable version",
      "calculation_method": "the calc method",
      "timestamp": "the timestamp field",
      "time_grains": [
          "day",
          "week"
      ],
      "expression": "a field name or sql expression",
      "dimensions": [
				{
				"entity_name": [
          "had_discount",
          "order_country"
					]
				}
      ],
      "window": null,
      "resource_type": "metric",
      "filters": [],
      "meta": {},
      "tags": [],
      "config": {
          "enabled": true
      },
      "unrendered_config": {},
      "sources": [],
      "depends_on": {
          "macros": [],
          "nodes": [
              "entity.projet_name.entity_name",
          ]
      },
      "entities": [
				[
					"entity_name"
				]
			],
      "metrics": ["used for derived metrics"],
      "created_at": 1669653027.290001
  },
  ```
  </TabItem>

<TabItem value="entityquery" label="Entity queries">

Query an entity using dbt-SQL. Eventually, users will be able to query entities and dynamically generate datasets using a macro (like with metrics), without having to find specific tables or columns. 

```
select *
from {{ entities.calculate(
	entity_list=[...], [Required, one to start]
       dimensions: [...], [Optional, default is all]
       metrics: [...], [Optional, default is all at finest grain]
       filters: ...
	)}}
  ```
  </TabItem>
  </Tabs>

### dbt Semantic Layer Connector 

To support more data platforms and enhance the user experience, users will be able to connect to a [dbt Cloud-supported data platform](/docs/get-started/connect-your-database) with the dbt Semantic Layer. Integration partners will need to install the [Arrow FlightSQL](https://arrow.apache.org/docs/format/FlightSql.html) JDBC/ODBC driver which will authenticate with dbt Cloud and the data platform that it queries. 


<Lightbox src="/img/docs/dbt-cloud/semantic-layer/connection-architecture.jpg" title="New architecture envisioned" />


### dbt Semantic Layer API 

dbt Cloud will provide a REST-based API that supports:

- Compiling dbt-SQL queries to return their compiled SQL
- Executing dbt-SQL queries and returning the queried results from the data platform

The API will be a viable integration point with the dbt Semantic Layer. It will be authorized by a dbt Cloud service token. It will eventually also support the invocation of dbt commands (e.g., `dbt run`, `dbt test`, etc.) in the future.


## Contact us

Please [reach out](mailto:semantic-layer@dbtlabs.com) if you:

- would like to be a formal partner, 
- have product feedback or questions, or 
- are interested in integrating, including via the API

<!-- rewrite a little and would like to see if i can include a button -->

## Related docs

- Review the [dbt Semantic Layer docs](https://docs.getdbt.com/docs/use-dbt-semantic-layer/dbt-semantic-layer) to learn about the product.
- Review the [dbt Metrics docs](https://docs.getdbt.com/docs/building-a-dbt-project/metrics) for more information about its components.
- Review the [dbt Semantic Layer intro blog](https://www.getdbt.com/blog/dbt-semantic-layer/) and [launch blog](https://www.getdbt.com/blog/frontiers-of-the-dbt-semantic-layer/) to learn more about the product vision and purpose. 
- Review the [dbt Semantic Layer integrations page](https://www.getdbt.com/product/semantic-layer-integrations). 


## Troubleshooting

<!-- would really want to add common questions or troubleshooting -->

This is a troubleshooting section - tbd
