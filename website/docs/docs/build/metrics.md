---
title: "Metrics"
id: "metrics"
description: "When you define metrics in dbt projects, you encode crucial business logic in tested, version-controlled code. The dbt metrics layer helps you standardize metrics within your organization."
keywords:
  - dbt metrics layer
---

<Changelog>

* **v1.3.0**: Metrics have been moved out of the experimental phase
* **v1.0.0**: Metrics are new and experimental

</Changelog>

## About Metrics 

A metric is a timeseries aggregation over a <Term id="table" /> that supports zero or more dimensions. Some examples of metrics include:
- active users
- monthly recurring revenue (mrr)

In v1.0, dbt supports metric definitions as a new node type. Like [exposures](exposures), metrics appear as nodes in the directed acyclic graph (DAG) and can be expressed in YAML files. Defining metrics in dbt projects encodes crucial business logic in tested, version-controlled code. Further, you can expose these metrics definitions to downstream tooling, which drives consistency and precision in metric reporting.

Review the video below to learn more about metrics, why they're important, and how to get started:
    
<LoomVideo id="b120ca9d042d46abad1d873a676bf20a" />    

### Benefits of defining metrics

**Use metric specifications in downstream tools**  
dbt's compilation context can access metrics via the [`graph.metrics` variable](graph). The [manifest artifact](manifest-json) includes metrics for downstream metadata consumption.

**See and select dependencies**   
As with Exposures, you can see everything that rolls up into a metric (`dbt ls -s +metric:*`), and visualize them in [dbt documentation](documentation). For more information, see "[The `metric:` selection method](node-selection/methods#the-metric-method)."

<Lightbox src="/img/docs/building-a-dbt-project/dag-metrics.png" title="Metrics appear as pink nodes in the DAG (for now)"/>

## Defining a metric

You can define metrics in `.yml` files nested under a `metrics:` key. Metric names must:
- contain only letters, numbers, and underscores (no spaces or special characters)
- begin with a letter
- contain no more than 250 characters

For a short human-friendly name with title casing, spaces, and special characters, use the `label` property. More examples and guidance for how to [define and structure metrics can be found here.](https://docs.getdbt.com/blog/how-to-design-and-structure-metrics).

### Example definition

<File name='models/<filename>.yml'>

<VersionBlock firstVersion="1.3">

```yaml
# models/marts/product/schema.yml

version: 2

models:
 - name: dim_customers
   ...

metrics:
  - name: rolling_new_customers
    label: New Customers
    model: ref('dim_customers')
    [description](description): "The 14 day rolling count of paying customers using the product"

    calculation_method: count_distinct
    expression: user_id 

    timestamp: signup_date
    time_grains: [day, week, month, quarter, year, all_time]

    dimensions:
      - plan
      - country
    
    window:
      count: 14
      period: day

    filters:
      - field: is_paying
        operator: 'is'
        value: 'true'
      - field: lifetime_value
        operator: '>='
        value: '100'
      - field: company_name
        operator: '!='
        value: "'Acme, Inc'"
      - field: signup_date
        operator: '>='
        value: "'2020-01-01'"
        
    # general properties
    [config](resource-properties/config):
      enabled: true | false
      treat_null_values_as_zero: true | false

    [meta](resource-configs/meta): {team: Finance}
```
</VersionBlock> 

<VersionBlock lastVersion="1.2">

```yaml
# models/marts/product/schema.yml

version: 2

models:
 - name: dim_customers
   ...

metrics:
  - name: rolling_new_customers
    label: New Customers
    model: ref('dim_customers')
    description: "The 14 day rolling count of paying customers using the product"

    type: count_distinct
    sql: user_id 

    timestamp: signup_date
    time_grains: [day, week, month, quarter, year, all_time]

    dimensions:
      - plan
      - country
    
    filters:
      - field: is_paying
        operator: 'is'
        value: 'true'
      - field: lifetime_value
        operator: '>='
        value: '100'
      - field: company_name
        operator: '!='
        value: "'Acme, Inc'"
      - field: signup_date
        operator: '>='
        value: "'2020-01-01'"

    meta: {team: Finance}
```
</VersionBlock> 

</File>   

:::caution

- You cannot define metrics on [ephemeral models](https://docs.getdbt.com/docs/building-a-dbt-project/building-models/materializations#ephemeral). To define a metric, the materialization must have a representation in the data warehouse.

:::


### Available properties
Metrics can have many declared **properties**, which define aspects of your metric. More information on [properties and configs can be found here](https://docs.getdbt.com/reference/configs-and-properties).

<VersionBlock firstVersion="1.3">

| Field       | Description                                                 | Example                         | Required? |
|-------------|-------------------------------------------------------------|---------------------------------|-----------|
| name        | A unique identifier for the metric                          | new_customers                   | yes       |
| model       | The dbt model that powers this metric                       | dim_customers                   | yes (no for `derived` metrics)|
| label       | A short for name / label for the metric                     | New Customers                   | yes        |
| description | Long form, human-readable description for the metric        | The number of customers who.... | no        |
| calculation_method | The method of calculation (aggregation or derived) that is applied to the expression  | count_distinct | yes       |
| expression  | The expression to aggregate/calculate over | user_id, cast(user_id as int) | yes       |
| timestamp   | The time-based component of the metric                      | signup_date                     | yes       |
| time_grains | One or more "grains" at which the metric can be evaluated. For more information, see the "Custom Calendar" section.   | [day, week, month, quarter, year]              | yes       |
| dimensions  | A list of dimensions to group or filter the metric by       | [plan, country]                 | no        |
| window      | A dictionary for aggregating over a window of time. Used for rolling metrics such as 14 day rolling average. Acceptable periods are: [`day`,`week`,`month`, `year`, `all_time`] |  {count: 14, period: day}        | no        |
| filters     | A list of filters to apply before calculating the metric    | See below                       | no        |
| config      | [Optional configurations](https://github.com/dbt-labs/dbt_metrics#accepted-metric-configurations) for calculating this metric         | {treat_null_values_as_zero: true} | no      |
| meta        | Arbitrary key/value store                                   | {team: Finance}                 | no        |

</VersionBlock>

<VersionBlock lastVersion="1.2">

| Field       | Description                                                 | Example                         | Required? |
|-------------|-------------------------------------------------------------|---------------------------------|-----------|
| name        | A unique identifier for the metric                          | new_customers                   | yes       |
| model       | The dbt model that powers this metric                       | dim_customers                   | yes (no for `derived` metrics)|
| label       | A short for name / label for the metric                     | New Customers                   |yes        |
| description | Long form, human-readable description for the metric        | The number of customers who.... | no        |
| type | The method of calculation (aggregation or derived) that is applied to the expression  | count_distinct | yes       |
| sql | The expression to aggregate/calculate over | user_id, cast(user_id as int) | yes       |
| timestamp   | The time-based component of the metric                      | signup_date                     | yes       |
| time_grains | One or more "grains" at which the metric can be evaluated   | [day, week, month, quarter, year, all_time]              | yes       |
| dimensions  | A list of dimensions to group or filter the metric by       | [plan, country]                 | no        |
| filters     | A list of filters to apply before calculating the metric    | See below                       | no        |
| meta        | Arbitrary key/value store                                   | {team: Finance}                 | no        |

</VersionBlock>


### Available calculation methods

<VersionBlock firstVersion="1.3">
The method of calculation (aggregation or derived) that is applied to the expression.
</VersionBlock> 
<VersionBlock lastVersion="1.2">
The type of calculation (aggregation or expression) that is applied to the sql property.
</VersionBlock> 
 

|  <VersionBlock firstVersion="1.3">Metric Calculation Method </VersionBlock>  <VersionBlock lastVersion="1.1">Metric Type </VersionBlock>    |  Description                                                               |
|----------------|----------------------------------------------------------------------------|
| count          | This metric type will apply the `count` aggregation to the specified field |
| count_distinct | This metric type will apply the `count` aggregation to the specified field, with an additional distinct statement inside the aggregation |
| sum            | This metric type will apply the `sum` aggregation to the specified field |
| average        | This metric type will apply the `average` aggregation to the specified field |
| min            | This metric type will apply the `min` aggregation to the specified field |
| max            | This metric type will apply the `max` aggregation to the specified field |
|<VersionBlock firstVersion="1.3">derived </VersionBlock> <VersionBlock lastVersion="1.2">expression </VersionBlock>  | <VersionBlock firstVersion="1.2"> This metric type is defined as any _non-aggregating_ calculation of 1 or more metrics </VersionBlock> |

<VersionBlock firstVersion="1.3">

### Derived Metrics
In v1.2, support was added for `derived` metrics (previously named `expression`), which are defined as non-aggregating calculations of 1 or more metrics. An example of this would be `{{metric('total_revenue')}} / {{metric('count_of_customers')}}`.

 By defining these metrics, you are able to create metrics like:
- ratios
- subtractions 
- any arbitrary calculation

As long as the two (or more) base metrics (metrics that comprise the `derived` metric) share the specified `time_grains` and `dimensions`, those attributes can be used in any downstream metrics macro.

An example definition of an `derived` metric is:
</VersionBlock>

<VersionBlock firstVersion="1.3">

```yaml
# models/marts/product/schema.yml
version: 2

models:
 - name: dim_customers
   ...

metrics:
  - name: average_revenue_per_customer
    label: Average Revenue Per Customer
    description: "The average revenue received per customer"

    calculation_method: derived
    expression: "{{metric('total_revenue')}} / {{metric('count_of_customers')}}"

    timestamp: order_date
    time_grains: [day, week, month, quarter, year, all_time]
    dimensions:
      - had_discount
      - order_country

```

</VersionBlock> 

<VersionBlock lastVersion="1.2">

### Expression Metrics
In v1.2, support was added for `expression` metrics, which are defined as non-aggregating calculations of 1 or more metrics. By defining these metrics, you are able to create metrics like:
- ratios
- subtractions 
- any arbitrary calculation

As long as the two+ base metrics (the metrics that comprise the `expression` metric) share the specified `time_grains` and `dimensions`, those attributes can be used in any downstream metrics macro.

An example definition of an `expression` metric is:
</VersionBlock>

<VersionBlock lastVersion="1.2">

```yaml
# models/marts/product/schema.yml
version: 2

models:
 - name: dim_customers
   ...

metrics:
  - name: average_revenue_per_customer
    label: Average Revenue Per Customer
    description: "The average revenue received per customer"

    type: expression
    sql: "{{metric('total_revenue')}} / {{metric('count_of_customers')}}"

    timestamp: order_date
    time_grains: [day, week, month, quarter, year, all_time]
    dimensions:
      - had_discount
      - order_country

```
</VersionBlock>

### Filters
Filters should be defined as a list of dictionaries that define predicates for the metric. Filters are combined using AND clauses. For more control, users can (and should) include the complex logic in the model powering the metric. 

All three properties (`field`, `operator`, `value`) are required for each defined filter.

Note that `value` must be defined as a string in YAML, because it will be compiled into queries as part of a string. If your filter's value needs to be surrounded in quotes inside the query (e.g. text or dates), use `"'nested'"` quotes:

```yml
    filters:
      - field: is_paying
        operator: 'is'
        value: 'true'
      - field: lifetime_value
        operator: '>='
        value: '100'
      - field: company_name
        operator: '!='
        value: "'Acme, Inc'"
      - field: signup_date
        operator: '>='
        value: "'2020-01-01'"
```

## Querying Your Metric
You can dynamically query metrics directly in dbt and verify them before running a job in the deployment environment.  To query your defined metric, you must have the [dbt_metrics package](https://github.com/dbt-labs/dbt_metrics) installed. Information on how to [install packages can be found here](https://docs.getdbt.com/docs/building-a-dbt-project/package-management#how-do-i-add-a-package-to-my-project).

Use the following [metrics package](https://hub.getdbt.com/dbt-labs/metrics/latest/) installation code in your packages.yml file and run `dbt deps` to install the metrics package:

<VersionBlock firstVersion="1.3" lastVersion="1.3">

```yml
packages:
  - package: dbt-labs/metrics
    version: [">=1.3.0", "<1.4.0"]
```

</VersionBlock>

<VersionBlock firstVersion="1.2" lastVersion="1.2">

```yml
packages:
  - package: dbt-labs/metrics
    version: [">=0.3.0", "<0.4.0"]
```

</VersionBlock>

<VersionBlock firstVersion="1.1" lastVersion="1.1">

```yml
packages:
  - package: dbt-labs/metrics
    version: [">=0.2.0", "<0.3.0"]
```

</VersionBlock>

Once the package has been installed with `dbt deps`, make sure to run the `dbt_metrics_calendar_model` model as this is required for macros used to query metrics. More information on this, and additional calendar functionality, can be found in the [project README](https://github.com/dbt-labs/dbt_metrics#calendar).

### Querying metrics with `metrics.calculate`
Use the `metrics.calculate` macro along with defined metrics to generate a SQL statement that runs the metric aggregation to return the correct metric dataset. Example below:

<VersionBlock firstVersion="1.2" >

```sql
select * 
from {{ metrics.calculate(
    metric('new_customers'),
    grain='week',
    dimensions=['plan', 'country']
) }}
``` 

</VersionBlock>

<VersionBlock lastVersion="1.1">

```sql
select * 
from {{ metrics.calculate(
    metric_name='new_customers',
    grain='week',
    dimensions=['plan', 'country']
) }}
``` 

</VersionBlock>

### Supported inputs
The example above doesn't display all the potential inputs you can provide to the macro.

You may find some pieces of functionality, like secondary calculations, complicated to use. We recommend reviewing the [package README](https://github.com/dbt-labs/dbt_metrics) for more in-depth information about each of the inputs that are not covered in the table below.


| Input       | Example     | Description | Required   |
| ----------- | ----------- | ----------- | -----------|
| <VersionBlock firstVersion="1.2">metric_list</VersionBlock><VersionBlock lastVersion="1.1">metric_name</VersionBlock>  | <VersionBlock firstVersion="1.2">`metric('some_metric)'`, <br />[`metric('some_metric)'`, <br />`metric('some_other_metric)'`]<br /></VersionBlock><VersionBlock lastVersion="1.1">`'metric_name'`<br /></VersionBlock> | <VersionBlock firstVersion="1.2">The metric(s) to be queried by the macro. If multiple metrics required, provide in list format.</VersionBlock><VersionBlock lastVersion="1.1">The name of the metric</VersionBlock>  | Required |
| grain       | `'day'`, `'week'`, <br />`'month'`, `'quarter'`, <br />`'year'`, `'all_time'`<br /> | The time grain that the metric will be aggregated to in the returned dataset | Required |
| dimensions  | [`'plan'`,<br /> `'country'`] | The dimensions you want the metric to be aggregated by in the returned dataset | Optional |
| secondary_calculations  | [`metrics.period_over_period( comparison_strategy="ratio", interval=1, alias="pop_1wk")`] | Performs the specified secondary calculation on the metric results. Examples include period over period calculations, rolling calcultions, and period to date calculations. | Optional |
| start_date  | `'2022-01-01'` | Limits the date range of data used in the metric calculation by not querying data before this date | Optional |
| end_date    | `'2022-12-31'` | Limits the date range of data used in the metric claculation by not querying data after this date | Optional |
| where       | `plan='paying_customer'` | A sql statment, or series of sql statements, that alter the **final** CTE in the generated sql. Most often used to limit the data to specific values of dimensions provided | Optional |

#### Secondary Calculations
Secondary calculations are window functions you can add to the metric calculation and perform on the primary metric or metrics. 

You can use them to compare values to an earlier period, calculate year-to-date sums, and return rolling averages. You can add custom secondary calculations into dbt projects - for more information on this, reference the [package README](https://github.com/dbt-labs/dbt_metrics#secondary-calculations).

### Developing metrics with `metrics.develop`

<VersionBlock firstVersion="1.3" >

There may be times you want to test what a metric might look like before defining it in your project. In these cases, use the `develop` metric, which allows you to provide metric(s) in a contained yml so you can simulate what a defined metric might look like in your project.

```sql
{% set my_metric_yml -%}
{% raw %}

metrics:
    -- The name of the metric does not need to be develop_metric
  - name: develop_metric
    model: ref('fact_orders')
    label: Total Discount ($)
    timestamp: order_date
    time_grains: [day, week, month, quarter, year, all_time]
    calculation_method: average
    expression: discount_total
    dimensions:
      - had_discount
      - order_country

{% endraw %}
{%- endset %}

select * 
from {{ metrics.develop(
        develop_yml=my_metric_yml,
        metric_list=['develop_metric'],
        grain='month'
        )
    }}
```

**Important caveat** - The metric list input for the `metrics.develop` macro takes in the metric names themselves, not the `metric('name')` statement that the `calculate` macro uses. Using the example above:

- ✅ `['develop_metric']`
- ❌ `[metric('develop_metric')]`

</VersionBlock>

<VersionBlock firstVersion="1.2" lastVersion="1.2" >

There may be times you want to test what a metric might look like before defining it in your project. In these cases, the `develop` metric, which allows you to provide a single metric in a contained yml so you can simulate what a defined metric might look like in your project.


```sql
{% set my_metric_yml -%}
{% raw %}

metrics:
  - name: develop_metric
    model: ref('fact_orders')
    label: Total Discount ($)
    timestamp: order_date
    time_grains: [day, week, month, quarter, year, all_time]
    type: average
    sql: discount_total
    dimensions:
      - had_discount
      - order_country

{% endraw %}
{%- endset %}

select * 
from {{ metrics.develop(
        develop_yml=my_metric_yml,
        grain='month'
        )
    }}
```

</VersionBlock>

<VersionBlock lastVersion="1.1" >

Functionality for `develop` is only supported in v1.2 and higher. Please navigate to those versions for information about this method of metric development.

</VersionBlock>


<Snippet src="discourse-help-feed-header" />
<DiscourseHelpFeed tags="metrics"/>
