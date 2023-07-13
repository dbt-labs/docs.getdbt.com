---
title: "JDBC"
id: jdbc
description: "Integrate and use the JDBC API to query your metrics."
tags: ["semantic-layer, apis"]
---

<VersionBlock lastVersion="1.5">

:::info Upgrade to access the new dbt Semantic Layer

The new dbt Semantic Layer has been re-released and is now available for users on a [Team or Enterprise plans](https://www.getdbt.com/pricing/) and you must be on dbt v1.6 and higher. 

If you're using the legacy Semantic Layer, we **highly** recommend you [upgrade your dbt version](/docs/dbt-versions/upgrade-core-in-cloud) to dbt v1.6 or higher to use the new dbt Semantic Layer. Refer to the dedicated [migration guide](/guides/migration/sl-migration) for more info.

:::

</VersionBlock>

The dbt Semantic Layer Java Database Connectivity (JDBC) driver enables users to query metrics and dimensions using the JDBC protocol, while also providing standard metadata functionality. 

A JDBC driver is a software component enabling a Java application to interact with a data platform. Here's some more information about the JDBC:

- The Semantic Layer JDBC API utilizes the open-source JDBC driver with ArrowFlight SQL protocol.
- You can download the JDBC driver from [Maven](https://search.maven.org/remotecontent?filepath=org/apache/arrow/flight-sql-jdbc-driver/12.0.0/flight-sql-jdbc-driver-12.0.0.jar). 
- The dbt Semantic Layer supports ArrowFlight SQL driver version 12.0.0 and higher. 
- You can embed the driver into your application stack as needed, and you can use dbt Labs' [example project](https://github.com/dbt-labs/example-semantic-layer-clients) for reference.

## Installation

- Install an AWS root CA to the Java Trust Store [documentation](https://www.amazontrust.com/repository/).

## Connection parameters
The JDBC connection requires a few different connection parameters. We provide the full JDBC string that you can connect with as well as the individual components required.

This is an example of a URL connection string: 


```
jdbc:arrow-flight-sql://semantic-layer.cloud.getdbt.com:443?&environmentId=202339&token=SERVICE_TOKEN
```

The components of the JDBC string are as follows:

- `jdbc:arrow-flight-sql://` &mdash; The protocol for the JDBC driver.
- `dbt Cloud access URL` &mdash; The [access URL](/docs/cloud/about-cloud/regions-ip-addresses) for your account's dbt Cloud region. You must always add the `semantic-layer` prefix before the access URL. For example, `semantic-layer.cloud.getdbt.com`
- `environmentId` &mdash; The unique identifier for the dbt environment, you can retrieve this from the dbt Cloud URL when you navigate to your environment under Deployments. 
- `SERVICE_TOKEN` &mdash; dbt Cloud Service Token with “Semantic Layer Only” permissions at least. Customer can get the service token by navigating to your account settings and creating a new Service Token. The value must be encoded prior to being put into the string.


## Querying the API
The Semantic Layer JDBC API has built-in metadata calls that can provide a user with information about their metrics and dimensions.

**Metadata Commands and Examples**


Fetching all metrics defined

```
select * from {{ 
	semantic_layer.metrics() 
}}
```


Fetching all dimensions for a metric

```
select * from {{ 
	semantic_layer.dimensions(metrics=['food_order_amount'])}}
```
Required arguments: `metrics` list with one or multiple metrics in it.


Fetching dimension values for one or multiple metrics and single dimension

```
select * from {{ 
semantic_layer.dimension_values(metrics=["food_order_amount"], group_by="customer__customer_name")}}
```
Required arguments: `metrics` list with one or multiple metrics in it, a single dimension


## Querying Parameters

| Parameter | Description                                                                                                                                                                                                                    | Example                                                                         | Required or Optional |
|-----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------|----------------------|
| metrics   | The metric name as defined in your dbt metric configuration                                                                                                                                                                    | `metrics=[revenue]`                                                             | Required             |
| group_by  | Dimension names or entities to group by. We require a reference to the entity of the dimension (other than for the primary time dimension), which is pre-appended to the front of the dimension name with a double underscore. | `group_by=[user__country, metric_time]`                                         | Optional             |
| grain     | A paremeter specific to any time dimension and changes the grain of the data from the default for the metric.                                                                                                                  | `group_by=[`Dimension('metric_time').grain('week\|day\|month\|quarter\|year')]` | Optional             |
| where     | A where clause that allows you to filter on dimensions                                                                                                                                                                         | `where="metric_time >= '2022-03-08'"`                                           | Optional             |
| limit     | Limit the data returned                                                                                                                                                                                                        | `limit=10`                                                                      | Optional             |
| order     | Order the data returned                                                                                                                                                                                                        | `order_by=['-order_gross_profit']` (remove `-` for ascending order)             | Optional             |
| explain   | If true, returns generated SQL for the data platform but does not execute it.                                                                                                                                                  | `explain=True`                                                                  | Optional             |



## Examples

**Fetching Metadata for Metrics. You can filter/add any SQL outside of the templating** 

```
select name, dimensions from {{ 
	semantic_layer.metrics() 
	}}
WHERE name='food_order_amount'
``` 


**Selecting Common Dimensions for multiple metrics**

```
select * from {{ 
semantic_layer.dimensions(metrics=['food_order_amount', 'order_gross_profit'])
}}
``` 


**Querying Metrics**
Revenue and new customers grouped by time

```
select * from {{
semantic_layer.query(metrics=['food_order_amount','order_gross_profit'],									    group_by=['metric_time'])
    }}
``` 

**Multiple metrics and adding granularity** 

```
select * from {{
semantic_layer.query(metrics=['food_order_amount', 'order_gross_profit'],
	group_by=[Dimension('metric_time').grain('month')])
    }}
```

**Grouping by a categorical dimension**

```
select * from {{
semantic_layer.query(metrics=['food_order_amount', 'order_gross_profit'],
group_by=[Dimension('metric_time').grain('month'), 'customer__customer_type'])
    }}
``` 


**Where Filter Example**

``` 
select * from {{
semantic_layer.query(metrics=['food_order_amount', 'order_gross_profit'],
group_by=[Dimension('metric_time').grain('month'),'customer__customer_type'],
where="metric_time__month >= '2017-03-09' AND customer__customer_type in ('new')")}}
``` 

**Limit & Order**

```
select * from {{
semantic_layer.query(metrics=['food_order_amount', 'order_gross_profit'],
  group_by=[Dimension('metric_time')],
  limit=10,
  order_by=['order_gross_profit'])}}
``` 

**Explain a query**

```
select * from {{
semantic_layer.query(metrics=['food_order_amount', 'order_gross_profit'],
		group_by=[Dimension('metric_time').grain('month'),'customer__customer_type'],
		where="metric_time__month >= '2017-03-09' AND customer__customer_type in ('new')",
		explain=True)
}}
```

## Remarks

* You may notice that sometimes we use dimensions on their own – like metric_time, and sometimes we use the object syntax you see like Dimension(’metric_time’). When we are selecting the item alone (e.g., metric_time), we don’t require the “Dimension” syntax, but when we are operating on the object (e.g., adding granularity), the object syntax is required.
* You may see some dimensions include the following syntax with a double underscore "__" . This denotes a mapping from an entity to a dimension, and this signifies where the dimension in question lives — example (user__country), which indicates someone is looking at the country dimension from the user table.
* The default output for when you add granularity is {time_dimension_name}__{granularity_level}. If you are doing yearly granularity and the time dimension name is ds, you can expect ds__year.


