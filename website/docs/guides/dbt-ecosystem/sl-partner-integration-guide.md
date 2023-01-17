---
title: "dbt Semantic Layer integration" 
id: "sl-partner-integration-guide"
description: Learn about partner integration guidelines, roadmap, and connectivity. 
---

# dbt Semantic Layer partner integration

:::info Contact us

This guide is for dbt Semantic Layer integration partners and explains integration guidelines, product roadmap, and connectivity.<br />

To become a formal partner, integrate with the API, or have questions/feedback &mdash; **[contact us](mailto:semantic-layer@dbtlabs.com)** for more info.

:::


## Overview

The dbt Semantic Layer allows users to dynamically generate and query datasets in downstream tools based on their dbt governed assets, such as metrics, models, and entities. It helps organizations manage complexities such as data, tools, and teams to make more efficient and trustworthy decisions.

The rapid growth of different tools in the modern data stack has helped data professionals address the diverse needs of different teams. The downside of this growth is the fragmentation of business logic across teams, tools, and workloads. 

To solve this, the dbt Semantic Layer provides a platform where users can confidently leverage their data from within their tools. dbt Cloud's change management capabilities ensure that any user modifications made to core business constructs, like metrics or entities, are distributed into all the tools connected to the data platform.

The dbt Semantic Layer can be used for a variety of tools and applications of data. Here are some common use cases

* Business intelligence (BI), reporting, and analytics,
* Data quality and monitoring,
* Governance and privacy,
* Data discovery and cataloging,
* Machine learning and data science.

<!-- rewrite below little and would like to see if i can include a button or callout -->

:::info Share your use case

If you'd like to share other use cases for the dbt Semantic Layer, contact the [dbt Labs team](mailto:semantic-layer@dbtlabs.com).

:::


## Product overview

The dbt Semantic Layer product architecture includes four primary components:

| Components | Information | Developer plans | Team plans | Enterprise plans | License |
| --- | --- | :---: | :---: | :---: | --- |
| **[dbt Project](/docs/build/metrics)** | Define models and metrics in dbt Core. | ✅ | ✅ |  ✅  | Open source in dbt Core |
| **[dbt Server](https://github.com/dbt-labs/dbt-server)**| A persisted HTTP server that wraps dbt Core to handle RESTful API requests for dbt operations. | ✅ | ✅ | ✅ | BSL |
| **SQL Proxy** | Reverse-proxy that accepts dbt-SQL (SQL + Jinja-like query models and metrics, use macros), compiles the query into pure SQL, executes the query in the data platform, and returns the data. | ✅ <br></br>_* Available during Public Preview only_ | ✅ | ✅ | Proprietary in dbt Cloud |
| **[Metadata API](/docs/dbt-cloud-apis/metadata-api)**  | Accesses metric definitions primarily via integrations and is the source of truth for objects defined in dbt projects (like models, macros, sources, and metrics). The Metadata API is updated at the end of every dbt Cloud run. | ❌ | ✅ | ✅ | Proprietary in dbt Cloud |
    
Review the following current architecture to understand how the components work together:
  
<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-architecture-flow.png" title="Current product architecture" />


## Integration guidelines

In collaboration with dbt Labs, partners and users can build dbt Semantic Layer integrations that can import model metadata and metric definitions, query metrics, use macros, and more. 

For more details, refer to the [Integration roadmap](#integration) and [Integration best practices](#best-practices) guidance.

**Integration roadmap <a id="integration"></a>** 

Integration partners generally build and approach their roadmap in the following stages:

| Feature  |  Info | Availability |
|----------|-------|:------------:|
| **Model metadata**  |  Import/sync model metadata (descriptions, dimensions, test, freshness, and more) via the [dbt Cloud Metadata API](/docs/dbt-cloud-apis/metadata-api). | ✅ |
| **Metric definitions**  | Import/sync metric definitions (metric calculation, dimensions, description, and more) via the [dbt Cloud Metadata API](/docs/dbt-cloud-apis/metadata-api). | ✅ |
| **dbt Semantic Layer as a data source**  | Connect to the dbt Semantic Layer as a data source (for example, the Snowflake Proxy Server). Users can execute dbt-SQL to query metrics or models and use macros.* | ✅ |
| **Query metrics**  | Query the imported metrics via a metric-centric UI (for example, a user can select a metric, time grain, and dimensions of interest). | ✅ |
| **Entity definitions**   | Import/sync entity definitions (descriptions, dimensions, data types, relationships, metrics, and more) and query entities via the dbt Semantic Layer. | _*Coming soon, see the [Product Roadmap](#product-roadmap) for details_ |
| **dbt Semantic Layer Connector**   | A dedicated connector with the ability to query any data platform supported in dbt Cloud. (Will replace (3).) | _*Coming soon, see the [Product Roadmap](#product-roadmap) for details_ |

_*The coming soon features are expected to launch in 2023. Refer to the [Product Roadmap](#product-roadmap) for more details and timelines._

**Integration best practices <a id="best-practices"></a>**

To build a successful and seamless dbt Semantic Layer integration, it should express the following:

- **Consistent**: Have a consistent user experience (UX) incorporated into existing core user workflows.
- **Trustworthy**: Treat dbt assets (metrics, models, and entities) as first-class objects and indicate that their definitions and resulting datasets come from dbt Cloud.
- **Efficient**: Provide a clear advantage over the current approach to setting up metrics and analyses, and finding dimensions/datasets in the tool.
- **Accessible**: Include a self-serve component so a data consumer can ask questions via the user interface (UI), if applicable.


## Use the Metadata API

This section will explain how to connect to and query the [Metadata API](/docs/dbt-cloud-apis/metadata-api) for model and metric definitions. 

To use the dbt Semantic Layer, you must meet the [prerequisites](/docs/use-dbt-semantic-layer/dbt-semantic-layer#prerequisites). 

<details>
  <summary><b>Metadata API authorization</b></summary>
  <div>
    <div>Refer to our <a href="/docs/dbt-cloud-apis/metadata-querying#authorization">Authorization documentation</a> to learn how to authorize requests to the Metadata API.<br></br><br></br>
    
    Metrics-specific queries work identical to existing Metadata API queries. This means existing integrations that query model metadata will work perfectly in the context of metrics.
    </div>
    </div>
    </details>

  <details>
  <summary><b>Query the Metadata API</b></summary>
  <div>
    <div>Test out the Metadata API by using the <a href="https://studio.apollographql.com/sandbox/explorer?endpoint=https%3A%2F%2Fmetadata.cloud.getdbt.com%2Fgraphql">GraphQL sandbox</a> and use this <a href="https://github.com/transform-data/dbt-metadata-client">Python client</a> as a starting point to develop.
    </div>
    </div>
    </details>
    <br></br>

<!-- the following content was used for the <details> portion above. leaving this here for legacy purposes 
**Metadata API authorization**

To learn how to authorize requests to the Metadata API, review the [documentation](/docs/dbt-cloud-apis/metadata-querying#authorization) for more details. Metrics-specific queries work identically to existing Metadata API queries, so existing integrations used to query model metadata will work perfectly in the context of metrics. 

**Query the Metadata API**

Test out the Metadata API by using the [GraphQL sandbox](https://studio.apollographql.com/sandbox/explorer?endpoint=https%3A%2F%2Fmetadata.cloud.getdbt.com%2Fgraphql) and use this [Python client](https://github.com/transform-data/dbt-metadata-client) as a starting point to develop. 

-->

### Query models for a project

You can query model definitions or details about a specific model for a project from a given job.

 
<!--- tabs for listing models and fetching details about specific model --->
<Tabs>

<TabItem value="list" label="Listing models for a job">

This is an example of querying all models that utilize the schema`analytics` from a given job.

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
```
</TabItem>

<TabItem value="exampleresponse" label="Example response with models">

```
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

<TabItem value="details" label="Query details about a specific model">

This is an example of querying details about a specific model, `model.jaffle_shop.customers`, from a given job.

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

### Query metrics for a project

Query metrics definitions or details for a project from a given job and refer to the following resources: 

- [Metrics query](/docs/dbt-cloud-apis/metadata-schema-metrics) &mdash; Information on how to query the full list of metrics defined in a user’s project with the dbt Cloud Metadata API. 
- [dbt Metrics docs](https://docs.getdbt.com/docs/build/metrics#available-properties) &mdash; Information on the available metric properties. 
- [GraphQL sandbox](https://studio.apollographql.com/sandbox/explorer?endpoint=https%3A%2F%2Fmetadata.cloud.getdbt.com%2Fgraphql) &mdash; Access to test the dbt Cloud Metadata API testing environment.

<!--- tabs for listing, fetching, example, and querying metrics --->
<Tabs>

<TabItem value="list" label="Listing metrics">

This is an example listing metrics from a given job:

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

<TabItem value="query" label="Query details about a specific metric">

The `metric` query supports all metric properties listed in **Listing metrics**. 
The following abbreviated example is querying details about the metric `new_customers` from job `123`:

This is an example of querying details about a specific metric `new_customers` from a given job `123`.

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

</Tabs>

<!--- End tabs for listing, fetching, example, and querying metrics --->


## Query the dbt Semantic Layer

This section explains how to connect to or query the dbt Semantic Layer Proxy Server to return model data, metric data, and so on. 

When you configure the dbt Semantic Layer, dbt Cloud provides a Proxy Server endpoint that users can connect to as though it's a Snowflake-hosted endpoint. Once the queries are submitted, dbt Cloud will:

1. Compile dbt-sql queries into valid Snowflake SQL,
2. Execute the compiled SQL against the Snowflake data platform,
3. Return the results to the client.

Replace the hostname in your existing data platform connection with the relevant dbt Cloud Proxy Server URL (for example, `abc123.proxy.cloud.getdbt.com`). All queries you submit through the endpoint will be compiled en route to the data platform.* 

*_Note: This approach will change with the new Semantic Layer connection in mid-2023, which will be able to query all data platforms supported in dbt Cloud through dedicated JDBC/ODBC drivers, and eventually an API._


<!--- tabs for running models and running metrics --->
<Tabs>

<TabItem value="metrics" label="Metric queries">

Users can compile and execute metric queries using macros defined in the [dbt-metrics package](https://github.com/dbt-labs/dbt_metrics).  This package:

- Generates the SQL required to accurately calculate the metric definition,
- Supplies helper macros for derived calculations (like month over month, year to date, and so on) time series operations


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

<TabItem value="models" label="Model queries">

Model queries allow users to query models and use macros from their dbt project.

```
select cents_to_dollars('amount_cents') as amount_dollars 
from {{ ref('orders') }}
```
</TabItem>
</Tabs>

## Product Roadmap

The dbt Semantic Layer product roadmap details what features are coming soon and the timelines associated with them. 

| Product | Estimated launch |
| ------- | ---------------- |
| [Entities](#entities) | Early 2023 |
| [dbt Semantic Layer Connector](#dbt-semantic-layer-connector) | Early-mid 2023 |
| [dbt Semantic Layer API](#dbt-semantic-layer-api) | Mid 2023 |

### Entities 
<!-- rewrite a little and include a summary for each tab entry -->

dbt Labs will introduce a new node type, **[entity](https://github.com/dbt-labs/dbt-core/issues/6379)**, when dbt Core version 1.5 launches. It introduces a new and efficient way to define metrics by reusing logic (for example, `time_grains`).  

Entities are semantic objects made up of curated dimensions from models with more metadata defined. Over time, users can standardize metric and entity definitions with packages to speed up development. 

For integrations, entities will provide information like:

- a way to organize metrics based on the entity they reference, and 
- a new consumable and dynamically generated dataset (versus finding a table in the data platform). 

This information will be available alongside the Metadata API, and entities can be directly queried through the dbt Semantic Layer. 

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/entity-lineage.jpg" title="Entity lineage graph" />

:::caution 🚧

Entities are a work in progress &mdash; expect continuous changes and improvements. To stay up-to-date, refer to the [entity discussions](https://github.com/dbt-labs/dbt-core/issues/6379) page. 

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

Query entities via the Metadata API.

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

In order to support more data platforms and enhance the user experience, users will be able to connect to a [dbt Cloud-supported data platform](/docs/get-started/connect-your-database) with the dbt Semantic Layer. 

Integration partners need to install the [Arrow FlightSQL](https://arrow.apache.org/docs/format/FlightSql.html) JDBC/ODBC driver, which will authenticate with dbt Cloud and the data platform that it queries. 


<Lightbox src="/img/docs/dbt-cloud/semantic-layer/connection-architecture.jpg" title="Envisioned connection architecture" />


### dbt Semantic Layer API 

dbt Cloud will provide a web API that supports:

- Compiling dbt-SQL queries to return their compiled SQL.
- Executing dbt-SQL queries and returning the queried results from the data platform.

The API will be a viable integration point with the dbt Semantic Layer. It will be authorized by a [dbt Cloud service token](/docs/dbt-cloud-apis/service-tokens) and eventually support the invocation of dbt commands (e.g., `dbt run`, `dbt test`, etc.) in the future.


## Contact us

[Reach out](mailto:semantic-layer@dbtlabs.com) to us if you:

- would like to become a formal partner, 
- have product feedback or questions, or 
- are interested in integrating, including via the API

<!-- rewrite a little and would like to see if i can include a button -->

## Related docs

- [dbt Semantic Layer docs](https://docs.getdbt.com/docs/use-dbt-semantic-layer/dbt-semantic-layer) to learn about the product.
- [dbt Metrics docs](https://docs.getdbt.com/docs/building-a-dbt-project/metrics) for more information about its components.
- [dbt Semantic Layer intro blog](https://www.getdbt.com/blog/dbt-semantic-layer/) and [launch blog](https://www.getdbt.com/blog/frontiers-of-the-dbt-semantic-layer/) to learn more about the product vision and purpose. 
- [dbt Semantic Layer integrations page](https://www.getdbt.com/product/semantic-layer-integrations) for information about the available partner integrations.


