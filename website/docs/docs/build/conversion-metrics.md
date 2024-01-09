---
title: "Conversion metrics"
id: conversion
description: "Use Conversion metrics to measure conversion events."
sidebar_label: Conversion
tags: [Metrics, Semantic Layer]
---

Conversion metrics allow us to define when a base event happens and a subsequent conversion event happens for a specific entity within some time range.

- **Example**: Track how often a user (entity) completes a visit (base event) and then makes a purchase (conversion event) within 7 days (time window).
- **Requirements**: A time range and an entity to join on.
- **How it differs from [Ratio metrics](/docs/build/ratio)**: Includes an entity in the pre-aggregated join.

## Parameters

The specification for conversion metrics is as follows:

| Parameter | Description | Type | Required/Optional |
| --- | --- | --- | --- |
| name | The name of the metric. | String | Required |
| description | The description of the metric. | String | Optional |
| type | The type of the metric (such as derived, ratio, and so on). In this case, set as 'conversion' | String | Required |
| label | Displayed value in downstream tools. | String | Required |
| type_parameters | Specific configurations for each metric type. | List | Required |
| conversion_type_params | Additional configuration specific to conversion metrics. | List  | Required |
| entity | The entity for each conversion event. | Entity | Required |
| calculation | Method of calculation. Either `conversion_rate` or `conversions`. Default is `conversion_rate`. | String | Required |
| base_measure | The base conversion event measure. | Measure | Required |
| conversion_measure | The conversion event measure. | Measure | Required |
| window | The time window for the conversion event, such as 7 days, 1 week, 3 months. Defaults to infinity.  | String | Required |
| constant_properties | List of constant properties. Defaults to None.  | List | Optional |
| base_property | The property from the base semantic model that you want to hold constant.  | Entity or Dimension | Optional |
| conversion_property | The property from the conversion semantic model that you want to hold constant.  | Entity or Dimension | Optional |

The following code example displays the complete specification for conversion metrics and details how they're applied:

```yaml
metrics:
  - name: The metric name # Required
    description: the metric description # Required
    type: conversion
    type_params:
      conversion_type_params:
        entity: _entity_ # Required
        calculation: _calculation_type_ # Optional. default: conversion_rate. options: conversions(buys) or conversion_rate (buys/visits) and more to come.
        base_measure: _measure_ # Required
        conversion_measure: _measure_ # Required
        window: _time_window_ # Optional. default: inf. window to join the two events on. Follows similar format as time windows elsewhere (such as, 7 days)
        constant_properties: # Optional. List of constant properties default: None
          - base_property: _dimension_or_entity_ # Required. A reference to a dimension/entity of the semantic model linked to the base_measure
            conversion_property: _dimension_or_entity_ # Same as base above, but to the semantic model of the conversion_measure
```

### Conversion metric example

The following example will measure conversions from website visits (_Visits_ table) to order completions (_Buys_ table).Let's go through how to calculate a conversion metric step by step. 

1. Suppose we have two semantic models, _Visits_ and _Buys_:

- The _Visits_ table represents visits to an e-commerce site
- The _Buys_ table represents someone completing an order on that site.  

The underlying tables look like the following: 

**VISITS**

| DS | USER_ID | REFERRER_ID |
| --- | --- | --- |
| 2020-01-01 | bob | facebook |
| 2020-01-04 | bob | google |
| 2020-01-07 | bob | amazon |

**BUYS**

| DS | USER_ID | REFERRER_ID |
| --- | --- | --- |
| 2020-01-02 | bob | facebook |
| 2020-01-07 | bob | amazon |

Next, we define a conversion metric as follows:

```yaml
- name: visit_to_buy_conversion_rate_7d
    description: "Conversion rate from visiting the website to completing a transaction in 7 days"
    type: conversion
    label: Visit to Buy Conversion Rate (7 day window)
    type_params:
      conversion_type_params:
        base_measure: visits
        conversion_measure: sellers
        entity: user
        window: 7 days
```

To calculate the conversion, we need to be able to link the BUYS event to a VISITS event. Our approach is that a conversion will be linked to its closest base event. We walk through how the conversion is calculated in the following steps:

### Step 1:

This step joins the `buys` table to the `visits` table and gets all combinations of visits-buys events that match the join condition (any rows that have the same user and the buy happened at most 7 days after the visit).

The SQL generated in these steps looks like the following:

```sql
SELECT
  v.ds
  , v.user_id
  , v.referrer_id
  , b.ds
  , b.uuid
  , 1 AS buys
FROM VISITS v
INNER JOIN (
    SELECT *, UUID_STRING() AS uuid FROM BUYS -- Adds a UUID column to uniquely identify the different rows
) b
ON
v.user_id = b.user_id AND v.ds <= b.ds AND v.ds > b.ds - INTERVAL '7 day';
```

The data set returns look like this. Note that there are two potential conversion events for the first visit.

| V.DS | V.USER_ID | V.REFERRER_ID | B.DS | UUID | BUYS |
| --- | --- | --- | --- | --- | --- |
| 2020-01-01 | bob | facebook | 2020-01-02 | uuid1 | 1 |
| 2020-01-01 | bob | facebook | 2020-01-07 | uuid2 | 1 |
| 2020-01-04 | bob | google | 2020-01-07 | uuid2 | 1 |
| 2020-01-07 | bob | amazon | 2020-01-07 | uuid2 | 1 |

### Step 2:

Now in step 1, instead of returning the raw visit values, we can instead use a window function, we can partition by the conversion source and get the first_value ordered by visit ds descending to get the closest base event from the conversion event.

```sql
SELECT
  first_value(v.ds) OVER (PARTITION BY b.ds, b.user_id, b.uuid ORDER BY v.ds DESC NULLS FIRST) AS v.ds
  , first_value(v.user_id) OVER (PARTITION BY b.ds, b.user_id, b.uuid ORDER BY v.ds DESC NULLS FIRST) AS user_id
  , first_value(v.referrer_id) OVER (PARTITION BY b.ds, b.user_id, b.uuid ORDER BY v.ds DESC NULLS FIRST) AS referrer_id
  , b.ds
  , b.uuid
  , 1 AS buys
FROM VISITS v
INNER JOIN (
    SELECT *, UUID_STRING() AS uuid FROM BUYS
) b
ON
v.user_id = b.user_id AND v.ds <= b.ds AND v.ds > b.ds - INTERVAL '7 day';
```

**Returns**

| V.DS | V.USER_ID | V.REFERRER_ID | B.DS | UUID | BUYS |
| --- | --- | --- | --- | --- | --- |
| 2020-01-01 | bob | facebook | 2020-01-02 | uuid1 | 1 |
| 2020-01-07 | bob | amazon | 2020-01-07 | uuid2 | 1 |
| 2020-01-07 | bob | amazon | 2020-01-07 | uuid2 | 1 |
| 2020-01-07 | bob | amazon | 2020-01-07 | uuid2 | 1 |

As you can see we successfully linked the 2 conversions to the correct visit events. Now because of the join, we got every combination so there is a fanout result and after the window function, we get duplicates. To resolve this, we can use a distinct select to remove the duplicates and the UUID here helps identify which conversion is unique.

### Step 3:

Instead of regular select in the step 2, we use a distinct select to remove the duplicates.

```sql
SELECT DISTINCT
  first_value(v.ds) OVER (PARTITION BY b.ds, b.user_id, b.uuid ORDER BY v.ds DESC NULLS FIRST) AS v.ds
  , first_value(v.user_id) OVER (PARTITION BY b.ds, b.user_id, b.uuid ORDER BY v.ds DESC NULLS FIRST) AS user_id
  , first_value(v.referrer_id) OVER (PARTITION BY b.ds, b.user_id, b.uuid ORDER BY v.ds DESC NULLS FIRST) AS referrer_id
  , b.ds
  , b.uuid
  , 1 AS buys
FROM VISITS v
INNER JOIN (
    SELECT *, UUID_STRING() AS uuid FROM BUYS
) b
ON
v.user_id = b.user_id AND v.ds <= b.ds AND v.ds > b.ds - INTERVAL '7 day';
```

| V.DS | V.USER_ID | V.REFERRER_ID | B.DS | UUID | BUYS |
| --- | --- | --- | --- | --- | --- |
| 2020-01-01 | bob | facebook | 2020-01-02 | uuid1 | 1 |
| 2020-01-07 | bob | amazon | 2020-01-07 | uuid2 | 1 |

Now we have a data set that contains each conversion linked to a visit event.

1. aggregate the "conversions" table to get the total number of conversions
2. join the aggregated base measure table "opportunities" to the "conversions" table using the group by keys
3. calculate the conversion

### **Step 4:**

Now that we’ve tied each conversion event to a visit we can calculate the aggregated conversions and opportunities measures, and join them to calculate the actual conversion rate. The SQL to calculate the conversion rate is as follows: 

```sql
SELECT
  COALESCE(subq_3.metric_time__day, subq_13.metric_time__day) AS metric_time__day
, CAST(MAX(subq_13.buys) AS DOUBLE) / CAST(NULLIF(MAX(subq_3.visits), 0) AS DOUBLE) AS visit_to_buy_conversion_rate_7d
FROM ( -- Base Measure
  SELECT
    metric_time__day
    , SUM(visits) AS mqls
  FROM (
    SELECT
      DATE_TRUNC('day', first_contact_date) AS metric_time__day
      , 1 as visits
    FROM visits
  ) subq_2
  GROUP BY
    metric_time__day
) subq_3
FULL OUTER JOIN ( -- Conversion Measure
  SELECT
    metric_time__day
    , SUM(buys) AS sellers
  FROM (
	.....
#The output of this subquery is the table produced in Step 3. The SQL is hidden for legibility. 
#To see the full SQL output and --explain to your conversion metric query. 
  ) subq_10
  GROUP BY
    metric_time__day
) subq_13
ON
  subq_3.metric_time__day = subq_13.metric_time__day
GROUP BY
```

**Set the value of null conversion events**

You may want to set the value of a null conversion event to zero instead of null, so the final data set returns zero. You can add the `fill_nulls_with` parameter to your conversion metric definition like this:

```yaml
- name: vist_to_buy_conversion_rate_7_day_window
    description: "Conversion rate from MQL to seller"
    type: conversion
    label: MQL to Seller Conversion Rate (1 week day window)
    type_params:
      conversion_type_params:
        # calculation: CONVERSIONS
        base_measure: mqls
        conversion_measure: 
          name: sellers
          fill_nulls_with: 0
        entity: mql
        window: 1 week
```

This will return the following result set:

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/conversion-metrics-fill-null.png" width="85%" title="Conversion metric with fill nulls with parameter"/>

**Setting the calculation type:**

The conversion calculation parameter can be used to either show the raw number of conversions or the conversion rate. The default value is the conversion rate. I can change the default to show the number of conversions by setting the `calculation: conversion` parameter:

```yaml
- name: vist_to_buy_conversions_1_week_window
    description: "Visit to Buy Conversions"
    type: conversion
    label: Visit to Buy Conversions (1 week window)
    type_params:
      conversion_type_params:
        calculation: conversions
        base_measure: visits
        conversion_measure: 
          name: buys
          fill_nulls_with: 0
        entity: user
        window: 1 week
```

**Setting a constant property for a conversion metric**

*If you’re not sure what a constant property is [Amplitude has a great blog post on constant properties. I recommend](https://amplitude.com/blog/holding-constant) reading this to get up to speed on the concept.*

It's possible to add a constant property to a conversion metric to only count a conversions if this dimension or entity is the same for both the base and conversion event. For example, say you work at an e-commerce company and want to answer the following questions:

*How often did visitors convert from View Item Details to Complete Purchase with the same product in each step?*

What makes this question tricky to answer is users could have completed these two conversion milestones across many products. For example, viewed a pair of shoes, then a T-shirt,  and eventually checked out with a bow tie. This would still count as a conversion, even tho the conversion event only happened for the bow tie. 

Back to our initial questions, we want to see how many customers viewed an item detail page and then completed *a purchase for the same product.* In this case, we would want to set product_id as the constant property. We would specify this in the configs as follows:

```yaml
- name: view_item_detail_to_purchase_with_same_item
    description: "Conversion rate for users who viewed the item detail page and purchased the item"
    type: Conversion
    label: View Item Detail > Purchase 
    type_params:
      conversion_type_params:
        calculation: conversions
        base_measure: view_item_detail
        conversion_measure: purchase
        entity: user
        window: 1 week
				constant_properties:
        - base_property: product
          conversion_property: product
```

We will add an additional condition to the join to make sure the constant property is the same across conversion. 

```sql
SELECT DISTINCT
        first_value(v.ds) OVER (PARTITION BY buy_source.ds, buy_source.user_id, buy_source.session_id ORDER BY v.ds DESC ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS ds
        , first_value(v.user_id) OVER (PARTITION BY buy_source.ds, buy_source.user_id, buy_source.session_id ORDER BY v.ds DESC ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS user_id
        , first_value(v.referrer_id) OVER (PARTITION BY buy_source.ds, buy_source.user_id, buy_source.session_id ORDER BY v.ds DESC ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS referrer_id
        , buy_source.uuid
        , 1 AS buys
        FROM {{ source_schema }}.fct_view_item_details v
        INNER JOIN
        (
          SELECT *, {{ generate_random_uuid() }} AS uuid FROM {{ source_schema }}.fct_purchases
        ) buy_source
        ON
         v.user_id = buy_source.user_id
         v.user_id = b.user_id AND v.ds <= b.ds AND v.ds > b.ds - INTERVAL '7 day';
         AND buy_source.product_id = v.product_id #Joining on the constant property product ID
```
