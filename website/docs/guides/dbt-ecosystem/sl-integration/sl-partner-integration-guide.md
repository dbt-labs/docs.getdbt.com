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

Contact the [dbt Labs team](mailto:semantic-layer@dbtlabs.com) to share other potential use cases for the dbt Semantic Layer.


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

### Roadmap

Generally, integration partners approach their roadmap as follows:

| Feature  |  Info | Availability |
|----------|-------|:------------:|
|1. **Model metadata**  |  Import/sync model metadata (descriptions, dimensions, test, freshness, and more) via the [dbt Cloud Metadata API](/docs/dbt-cloud-apis/metadata-api). | ✅ |
|2. ** Metric definitions**  | Import/sync metric definitions (metric calculation, dimensions, description, and more) via the [dbt Cloud Metadata API](/docs/dbt-cloud-apis/metadata-api). | ✅ |
|3. **dbt Semantic Layer as a data source**  | Connect to the dbt Semantic Layer as a data source (for example, the Snowflake Proxy Server). Users can execute dbt-SQL to query metrics or models and use macros.* | ✅ |
|4. **Query metrics**  | Query the imported metrics via a metric-centric UI (for example, a user can select a metric, time grain, and dimensions of interest). | ✅ |
|5. **Entity definitions**  | Import/sync entity definitions (descriptions, dimensions, data types, relationships, metrics, and more) and query entities via the dbt Semantic Layer. | _Coming soon, review the [Product Roadmap](#product-roadmap) for more details_ |
|*6. **dbt Semantic Layer connector**  | A dedicated Semantic Layer connector with the ability to query any data platform supported in dbt Cloud. | _Coming soon, review the [Product Roadmap](#product-roadmap) for more details_ |

The _coming soon_ features above are expected to launch in 2023. Review the [Product Roadmap](#product-roadmap) for more details and timelines.

### Integration best practice

A dbt Semantic Layer integration should include the following:

- Have a consistent user experience (UX) &mdash; The integration shouldn’t be a hidden appendage.
- Treat dbt assets (like metrics, models, entities) as first-class objects and indicate that the definitions and resulting dataset come from dbt Cloud.
- Include a self-serve experience so a data consumer can ask questions via the user interface (UI), if applicable.
- Clarify the difference between the dbt Semantic Layer (more efficient) and the current approach in setting up metrics/analyses in the tool.


## Getting started

### Use the Metadata API

**Authorization**

Review the [Metadata API](/docs/dbt-cloud-apis/metadata-querying#authorization) to learn how to authorize requests to the Metadata API. Metrics-specific queries work identically to existing Metadata API queries, so existing integrations used to fetch model metadata will work perfectly in the context of metrics. 

Test out the API using the [GraphQL sandbox](https://studio.apollographql.com/sandbox/explorer?endpoint=https%3A%2F%2Fmetadata.cloud.getdbt.com%2Fgraphql). 

### Fetching models for a project

Fetch and query models, or details about a specific model, for a project from a given job.

<!-- tabs for listing models and fetching details about specific model -->
<Tabs>

<TabItem value="list" label="Listing models">

This is an example of fetching all models that utilize the schema, “analytics” from a given job.

`{
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
}`

</TabItem>

<TabItem value="details" label="Fetch details about a specific model">

This is an example of fetching details about a specific model, “model.jaffle_shop.customers” from a given job.

`{
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
}`

</TabItem>

</Tabs>

<!-- End tabs for listing models and fetching details about specific model -->

### Fetching metrics for a project

Fetch and query metrics for a project from a given job. To fetch the full list of metrics defined in a user’s project via the dbt Cloud Metadata API, use the [Metrics query](/docs/dbt-cloud/dbt-cloud-api/metadata/schema/metadata-schema-metrics). 

Test out the API using the [GraphQL sandbox](https://studio.apollographql.com/sandbox/explorer?endpoint=https%3A%2F%2Fmetadata.cloud.getdbt.com%2Fgraphql). 


Listing metrics

<!-- tabs for listing, fetching, example, and querying metrics -->
<Tabs>

<TabItem value="list" label="Listing metrics">

This is an example listing metrics from a given job.

`{
  metrics(jobId: 123) {
    // the backing model for this metric
    // can be explored via GraphQL selectors for models
    model {
      name
      unique_id
      description
    }

    // the name of the metric
    name

    // a human-readable label for the metric
    label

    // a human-readable description of the metric
    description

    // the calculation method of metric, eg. sum, count, count_distinct, etc
    calculation_method

    // the uniqueId of the metric
    uniqueId

    // the SQL expression used to calculate the metric
    expression

    // the timestamp component of the metric (optional)
    timestamp

    // the filters to apply to the underlying model
    // before calculating the metric (eg. is_active = true)
    filters {
      field
      operator
      value
    }

    // package name
    packageName

    // resource type
    resourceType


    // a list of supported time grains for the metric
    // eg. day, week, month, year
    timeGrains

    // a list of supported dimensions that the metric
    // can be grouped by
    dimensions

    // arbitrary user-supplied key/values, not semantically
    // meaningful to dbt
    meta
  }
}`

</TabItem>

<TabItem value="fetch" label="Fetch details about a specific metric">

As a note, all metric properties shown displayed above are supported in this `metric` query, however, an abbreviated query is used here as an example.

This is an example of fetching details about a specific metric, “metric.jaffle_shop.new_customers” from a given job.

`{
  metric(jobId: 123,uniqueId: “metric.jaffle_shop.new_customers”) {
    label
    description
    calculation_method
    timestamp
    timeGrains
    dimensions
  }
}`

</TabItem>

<TabItem value="example" label="Example metric definition">

`metrics:
  - name: total_claim_charges
    label: Total Claim Charges
    description: total amount charged to the insurance provider
    model: ref('fct_billed_patient_claims')
    calculation_method: sum
    expression: total_charge_amount
    timestamp: created_at
    time_grains: [day, week, month, all_time]


  - name: total_billed_diagnoses
    label: Total Billed Diagnoses
    description: distinct count of primary diagnoses observed in billed claims
    model: ref('fct_billed_patient_claims')
    calculation_method: count_distinct
    expression: diagnosis_id
    timestamp: created_at
    time_grains: [day, week, month]`

</TabItem>

<TabItem value="queryapi" label="Query the Metadata API for metrics">

`{
  metrics(jobId: 123) {
    uniqueId
    name
    packageName
    tags
    label
    runId
    description
    calculation_method
    expression
    timestamp
    timeGrains
    meta
    resourceType
    model {
      name
      …
    }
  }
}`
</TabItem>

<TabItem value="exampleapi" label="Example Metadata API response with metrics">

`{
  "data": {
    "metrics": [
      {
        "uniqueId": "metric.claim_to_fame.total_claim_charges",
        "name": "total_claim_charges",
        "packageName": "claim_to_fame",
        "tags": [],
        "label": "Total Claim Charges",
        "description": "total amount charged to the insurance provider",
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
        "packageName": "claim_to_fame",
        "tags": [],
        "label": "Total Billed Diagnoses",
        "description": "distinct count of primary diagnoses observed in billed claims",
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
}`
</TabItem>
</Tabs>

<!-- End tabs for listing, fetching, example, and querying metrics -->


## Querying the Semantic Layer

**The Proxy (JDBC)**
When the dbt Semantic Layer is configured, dbt Cloud exposes an endpoint (abc123.proxy.cloud.getdbt.com) that presents a programmatic interface identical to the Snowflake API. Users can connect to this endpoint as though it's a Snowflake-hosted endpoint. When queries are submitted to this dbt Proxy, dbt Cloud will:

1. Compile dbt-sql queries into valid Snowflake SQL
2. Execute that compiled SQL against the Snowflake data platform
3. Return the results to the client


In this way, the JDBC shim is a drop-in replacement for an existing Snowflake connection in your product. Replace the Snowflake account name with the relevant dbt Cloud Proxy URL, and all queries submitted through the endpoint will be compiled en route to Snowflake. 


<!-- tabs for running models and running metrics -->
<Tabs>

<TabItem value="models" label="Model queries">

Model queries allow users to query models and use macros from their dbt project.

`select cents_to_dollars('amount_cents') as amount_dollars 
from {{ ref('orders') }}`

</TabItem>

<TabItem value="metrics" label="Metric queries">

Users can compile and execute metric queries using macros defined in the [dbt-metrics package](https://github.com/dbt-labs/dbt_metrics).  This package:
* generates the SQL required to accurately calculate the metric definition,
* supplies helper macros for derived calculations (like month over month, year to date, and so on) time series operations


`select * 
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
) }}`

</TabItem>

</Tabs>

<!-- End tabs for running models and running metrics -->	

## Product Roadmap

The dbt Semantic Layer product roadmap details what features are coming soon and the timelines associated with them. 

### Entities 
_Estimated early 2023_

dbt Labs is introducing a new node type, [the entity](https://github.com/dbt-labs/dbt-core/issues/6379), when dbt Core version 1.5 launches. This introduces a new and efficient way to define metrics by reusing logic, for example, `time_grains`.  Entities are semantic objects made up of curated dimensions from models with more metadata defined. Over time, users can standardize metric and entity definitions with packages to speed up development. 

For integrations, entities will provide information like:

- dimension data type, 
- a way to organize metrics based on the entity they reference, and 
- a new consumable and dynamically generated dataset (versus finding a table in the data platform). 

This information will be available alongside the Metadata API and entities can be directly queried through the Semantic Layer. 

insert image 2 (see toggle below)

<!-- tabs for running entity def, entity metadata response, metric def, metric metadata response, entity queries -->

<Tabs>

<TabItem value="entitydef" label="Entity definition">

Define [entities](add-link-here) in your dbt project 

`entities: ## The top level node path of the new node
  - name: [Required] ## The name of the entity
    model: [Required] ## The name of the model that the entity is depdent on
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
		primary_key: [Optional] ## Whether this dimension is part of the PK`

</TabItem>

<TabItem value="entityapi" label="Entity metadata API response">

Model queries allow users to query models and use macros from their dbt project.

`"entity.project_name.entity_name": {
      "fqn": [ "same behavior as metric"],
      "unique_id": "entity.project_name.entity_name",
      "package_name": "project_name",
      "root_path": "same behavior",
      "path": "same behavior",
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
      "unrendered_config": {},
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
  },`

</TabItem>

<TabItem value="newmetricdef" label="New metric definition">

How to define new [metrics](/docs/build/metrics) in your dbt project.

`metrics: 
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
		
		## Either or
		dimensions:
			include: [Optional] ## The list of dimensions to be included. Either * or list
			exclude: [Optional] ## The list of dimensions to be excluded from the inherited list`

</TabItem>

<TabItem value="newmetricapi" label="New metric metadata API response">


`"metric.project_name.metric_name": {
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
  },`

</TabItem>

<TabItem value="entityquery" label="Entity queries">

How to query an entity using SQL

`select *
from {{ entities.calculate(
	entity_list=[...], [Required, one to start]
       dimensions: [...], [Optional, default is all]
       metrics: [...], [Optional, default is all at finest grain]
       filters: ...
	)}}`

</TabItem>

</Tabs>

<!-- End tabs for running entity def, entity metadata response, metric def, metric metadata response, entity queries -->-->	

### Semantic Layer Connector 
_Estimated early-mid 2023_

To support more data platforms and enhance the user experience, users will be able to connect to a [dbt Cloud-supported data platform](/docs/get-started/connect-your-database)with the dbt Semantic Layer. Integration partners will need to install the Arrow FlightSQL JDBC/ODBC driver which will authenticate with dbt Cloud and the data platform that’s queried. 


New architecture envisioned 

insert image 3 (see toggle below)


### Semantic Layer API 
_Estimated mid-2023_

dbt Cloud will provide a REST-based API that supports:

- Compiling dbt-SQL queries and returning their compiled results
- Executing dbt-SQL queries and returning the queried results from the data platform


The API will represent a viable integration point with the dbt Semantic Layer. It will be authorized by a dbt Cloud service token and will also support the invocation of dbt commands (for example, `dbt run`, `dbt test`, etc) in the future.


Please [reach out](mailto:semantic-layer@dbtlabs.com) if you are interested in this approach or have other suggestions for more easily integrating with the Semantic Layer. 


## Contact us

- If you have any questions or are interested in becoming a formal partner, please contact the [Partnerships team](mailto:partnerships@dbtlabs.com). 

- If you have product feedback please contact the [Product team](mailto:cameron.afzal@dbtlabs.com). 

## Related docs

- Review the [dbt Semantic Layer intro blog](https://www.getdbt.com/blog/dbt-semantic-layer/) and [launch blog](https://www.getdbt.com/blog/frontiers-of-the-dbt-semantic-layer/) to learn more about the product vision and purpose. 
- Review the [dbt Semantic Layer docs](https://docs.getdbt.com/docs/use-dbt-semantic-layer/dbt-semantic-layer) to learn about the product.
- Review the [dbt Metrics docs](https://docs.getdbt.com/docs/building-a-dbt-project/metrics) for more information about its components.
- Review the [dbt Semantic Layer integrations page](https://www.getdbt.com/product/semantic-layer-integrations). 


## Troubleshooting
- 
