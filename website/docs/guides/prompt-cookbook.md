---
title: How to use prompts for dbt Copilot
description: A cookbook of prompts and real-world examples to use dbt Copilot efficiently.
id: prompt-cookbook
icon: 'guides'
hide_table_of_contents: true
tags: ['dbt Copilot', 'AI', 'Best practices']
level: 'Beginner'
---

<div style={{maxWidth: '900px'}}>

## Overview

<IntroText>
Learn how to write effective prompts for dbt Copilot to generate accurate SQL, models, metrics, and macros. Each recipe is self-contained with its own realistic example.
</IntroText>

dbt <Constant name="copilot" /> is an AI assistant that generates SQL, YAML, documentation, tests, semantic models, and macros based on your project's context. The quality of output depends on the clarity of your prompts.

This cookbook provides independent recipes for common prompting tasks. Jump to any section that matches your current need.

This cookbook covers the following topics:
<!-- no toc -->
- [Prompt best practices](#prompt-best-practices)
- [Generate SQL queries](#generate-sql-queries)
- [Create dbt model skeletons](#create-dbt-model-skeletons)
- [Create semantic models and metrics](#create-semantic-models-and-metrics)
- [Create reusable macros](#create-reusable-macros)
- [Troubleshoot errors and issues](#troubleshoot-errors-and-issues)
- [Conclusion](#conclusion)

## Prompt best practices

Every strong prompt should include rich context, be super clear and explicit about the output you want. For example:

- **Table and column names** with data types
- **Relationships**: How tables join together
- **Sample values**: Especially for categorical fields, for example: status in ('completed', 'pending', 'cancelled')
- **Business logic**: Clear definitions and rules for example: "Active user = login in last 30 days"

**✅ Strong prompt example:**

```text
Context:
E-commerce subscription business tracking user engagement and churn.

Tables:
- orders (order_id, user_id, order_date timestamp, amount decimal, status string)
- users (user_id, signup_date timestamp, plan_tier string)
- sessions (session_id, user_id, session_date timestamp, page_views int)

Relationships: 
- orders.user_id → users.user_id
- sessions.user_id → users.user_id

Sample values: 
- status in ('completed', 'pending', 'cancelled')
- plan_tier in ('free', 'pro', 'enterprise')

Business question: 
Calculate monthly active users (users with at least 1 session or order) and 
monthly recurring revenue (MRR) from completed orders, grouped by plan tier.

Output: month, plan_tier, active_users, mrr, avg_revenue_per_user
Sort by month descending, plan_tier
```

**❌ Weak prompt example:**

```text
Write a query to calculate MRR and active users.
```

**Why the strong prompt works:**

- Clear context about the business (subscription e-commerce)
- Specific table relationships (how users connect to orders and sessions)
- Defined metrics (MAU = at least 1 session or order)
- Business goal stated (track revenue and engagement by plan tier)

### State the business goal, not just the output

Frame your request around the business question or decision you're supporting. Copilot anchors its logic to the decision or KPI you care about.

**Instead of:** "Write a query using the orders table"  
**Say:** "Calculate weekly revenue and order counts by product category to identify which products drive repeat purchases for our merchandising team"

### Be explicit about output structure

Specify:

- Column names and order
- Aggregation level (daily, weekly, monthly)
- Filters and sorting
- Formatting (percentages, decimals, date formats)

**Example:**

```text
Output columns:
- month (YYYY-MM format)
- product_category
- total_revenue (sum of order amounts)
- order_count (distinct orders)
- repeat_customer_rate (percentage with 2+ orders, 2 decimals)

Filter: Last 12 months, completed orders only
Sort: month descending, total_revenue descending
```

## Generate SQL queries

**Use case:** Track feature adoption in a SaaS product to identify which trial users convert to paid plans.

**What to give Copilot:**

"We've got users, their subscription plans, and their feature usage events. Users connect to subscriptions, and events show which features they use each week."

**What you ask Copilot:**

```text
Context:
- events (event_id int, user_id int, event_date timestamp, 
         feature_name string, event_type string)
- users (user_id int, signup_date timestamp, account_type string)
- subscriptions (subscription_id int, user_id int, plan_name string, start_date timestamp)

Relationships: 
- events.user_id → users.user_id
- subscriptions.user_id → users.user_id

Sample values: 
- account_type in ('trial', 'paid', 'churned')
- plan_name in ('starter', 'professional', 'enterprise')
- feature_name in ('export', 'collaboration', 'api_access', 'reporting')

Business question:
Identify weekly active users (users with 3+ feature usage events that week) and track 
which trial users convert to paid subscriptions.

Output:
- week_start (ISO Monday start)
- active_trial_users (distinct trial users with 3+ events)
- active_paid_users (distinct paid users with 3+ events)
- trial_to_paid_conversions (count of trial users who started paid subscription that week)
- top_features_used (most common features used by converters)

Filters: Last 12 weeks only, exclude churned accounts
Sort: week_start descending
```

**Why it works:**
Clear entities (users, subscriptions), clear behavior (feature usage patterns), clear relationship (trial to paid conversion). Copilot knows what to count and how to connect it.

**What Copilot generates:**

- Proper joins on `user_id` across events, users, and subscriptions
- `date_trunc('week', event_date)` for weekly aggregation
- Logic to identify active users (3+ events per week)
- Filters for trial/paid users and conversion tracking
- Output sorted as requested

**Example output:**

```sql
with events_filtered as (
  select 
    event_id,
    user_id,
    event_date,
    feature_name
  from events
  where event_date >= current_date - interval '12 weeks'
),

users_active as (
  select 
    user_id,
    account_type
  from users
  where account_type != 'churned'
),

weekly_events as (
  select
    date_trunc('week', e.event_date)::date as week_start,
    e.user_id,
    u.account_type,
    count(*) as event_count,
    array_agg(distinct e.feature_name) as features_used
  from events_filtered e
  inner join users_active u
    on e.user_id = u.user_id
  group by 1, 2, 3
),

weekly_active_users as (
  select
    week_start,
    user_id,
    account_type,
    features_used
  from weekly_events
  where event_count >= 3  -- Definition of "active user"
),

conversions as (
  select
    date_trunc('week', s.start_date)::date as week_start,
    count(distinct s.user_id) as trial_to_paid_conversions,
    array_agg(distinct wau.features_used) as converter_features
  from subscriptions s
  inner join users u
    on s.user_id = u.user_id
  left join weekly_active_users wau
    on s.user_id = wau.user_id
    and date_trunc('week', s.start_date) = wau.week_start
  where u.account_type = 'trial'
    and s.plan_name in ('starter', 'professional', 'enterprise')
    and s.start_date >= current_date - interval '12 weeks'
  group by 1
),

final as (
  select
    wau.week_start,
    count(distinct case when wau.account_type = 'trial' then wau.user_id end) as active_trial_users,
    count(distinct case when wau.account_type = 'paid' then wau.user_id end) as active_paid_users,
    coalesce(c.trial_to_paid_conversions, 0) as trial_to_paid_conversions,
    c.converter_features[1:5] as top_features_used
  from weekly_active_users wau
  left join conversions c
    on wau.week_start = c.week_start
  group by 1, c.trial_to_paid_conversions, c.converter_features
)

select * from final
order by week_start desc
```

**Troubleshooting:**

- **Wrong joins?** Specify join type: "Use inner join on events.user_id = users.user_id"
- **Missing definition?** Add explicit rules: "Active user = 3 or more feature usage events in the same week"
- **Wrong grain?** State clearly: "Aggregate to week level (Monday start), not day"

## Create dbt model skeletons

**Use case:** You need a starter model for a healthcare analytics project that combines patient appointments with provider data.

**Effective prompt:**

```text
Create a dbt model skeleton that joins patient appointments with provider information.

Source tables:
- {{ ref('stg_appointments') }} (appointment_id, patient_id, provider_id, appointment_date, duration_minutes, appointment_type)
- {{ ref('dim_providers') }} (provider_id, provider_name, specialty, department)

Join: stg_appointments.provider_id = dim_providers.provider_id (inner join)

Output columns:
- appointment_id
- patient_id
- provider_id
- provider_name
- specialty
- appointment_date
- duration_minutes
- appointment_type
- appointments_with_provider (count partitioned by patient and provider)

Add a temporary filter for last 90 days (mark as TEMP for removal later).
Include a comment block explaining this tracks patient-provider appointment patterns.
```

**What Copilot generates:**

- Proper `{{ ref() }}` syntax for sources
- Correct join with CTEs
- Calculated `net_revenue` field
- Temporary date filter with comment
- Header comment explaining purpose

**Example output:**

```sql
{#
  Model: patient_appointment_history
  Purpose: Tracks patient-provider appointment patterns for healthcare analytics
  
  TEMP: Filtered to last 90 days for preview - remove before production
#}

with appointments as (
  select
    appointment_id,
    patient_id,
    provider_id,
    appointment_date,
    duration_minutes,
    appointment_type
  from {{ ref('stg_appointments') }}
  where appointment_date >= current_date - interval '90 days'  -- TEMP: Remove this filter
),

providers as (
  select
    provider_id,
    provider_name,
    specialty,
    department
  from {{ ref('dim_providers') }}
),

final as (
  select
    a.appointment_id,
    a.patient_id,
    a.provider_id,
    p.provider_name,
    p.specialty,
    a.appointment_date,
    a.duration_minutes,
    a.appointment_type,
    count(*) over (
      partition by a.patient_id, a.provider_id
      order by a.appointment_date
      rows between unbounded preceding and current row
    ) as appointments_with_provider
  from appointments a
  inner join providers p
    on a.provider_id = p.provider_id
)

select * from final
```

**Troubleshooting:**

- **Missing `{{ ref() }}`?** Explicitly request: "Use `{{ ref() }}` syntax for all model references"
- **Wrong join type?** Specify: "Use inner join to keep only appointments with matching providers"
- **Missing window function?** Add: "Use count() window function to track appointment sequence per patient-provider pair"

## Create semantic models and metrics

**Use case:** Define metrics for an e-commerce marketplace to track seller performance and buyer engagement.

**Effective prompt:**

```text
Create a semantic model for an e-commerce marketplace to track transaction and seller metrics.

Base model: {{ ref('fct_marketplace_transactions') }}

Available columns:
- transaction_date (timestamp)
- transaction_amount (decimal)
- seller_id (integer)
- buyer_id (integer)
- product_category (string)
- is_repeat_buyer (boolean - true if buyer has 2+ transactions with this seller)
- seller_tier (string - 'bronze', 'silver', 'gold')

Semantic model requirements:
- Entities: 
  * seller (based on seller_id)
  * buyer (based on buyer_id)
- Measures:
  * total_gmv (sum of transaction_amount - Gross Merchandise Value)
  * transaction_count (count of transactions)
  * unique_buyers (count distinct buyer_id)
  * repeat_buyer_count (count distinct buyers where is_repeat_buyer = true)
- Dimensions:
  * product_category (categorical)
  * seller_tier (categorical - bronze/silver/gold)
  * transaction_date as metric_time (support day, week, month, quarter grains)

Create metrics:
1. monthly_gmv: Total GMV aggregated by month
2. repeat_buyer_rate: Percentage of buyers who made repeat purchases

Return valid YAML with descriptions for all fields.
```

**What Copilot generates:**

- Valid semantic model YAML structure
- Properly defined entity, measures, and dimensions
- Time dimension with multiple grains
- Metric definition referencing the measure
- Descriptions for each field

**Example output:**

```yaml
semantic_models:
  - name: marketplace_transactions
    description: Transaction and seller performance metrics for e-commerce marketplace
    model: ref('fct_marketplace_transactions')
    
    entities:
      - name: seller
        type: foreign
        expr: seller_id
      
      - name: buyer
        type: foreign
        expr: buyer_id
    
    measures:
      - name: total_gmv
        description: Total Gross Merchandise Value from all transactions
        agg: sum
        expr: transaction_amount
      
      - name: transaction_count
        description: Count of all marketplace transactions
        agg: count
        expr: transaction_date
      
      - name: unique_buyers
        description: Count of distinct buyers
        agg: count_distinct
        expr: buyer_id
      
      - name: repeat_buyer_count
        description: Count of buyers with 2+ transactions with same seller
        agg: count_distinct
        expr: case when is_repeat_buyer then buyer_id end
    
    dimensions:
      - name: product_category
        type: categorical
        description: Product category for the transaction
      
      - name: seller_tier
        type: categorical
        description: Seller tier level (bronze, silver, gold)
      
      - name: metric_time
        type: time
        type_params:
          time_granularity: day
        expr: transaction_date

metrics:
  - name: monthly_gmv
    description: Total Gross Merchandise Value aggregated by month
    type: simple
    type_params:
      measure: total_gmv
  
  - name: repeat_buyer_rate
    description: Percentage of buyers who made repeat purchases with same seller
    type: ratio
    type_params:
      numerator: repeat_buyer_count
      denominator: unique_buyers
```

**Troubleshooting:**

- **YAML errors?** Request: "Validate against dbt semantic layer schema version [X]"
- **Wrong aggregation?** Specify: "Use count_distinct for buyer counts, sum for GMV"
- **Missing grain?** State: "Support day, week, month, and quarter grains for transaction_date"

## Create reusable macros

**Use case:** You need to categorize financial transactions by risk level across multiple compliance models.

**Effective prompt:**

```text
Convert this CASE statement into a reusable dbt macro for transaction risk categorization:

CASE 
  WHEN transaction_amount >= 10000 THEN 'high_risk'
  WHEN transaction_amount >= 5000 THEN 'medium_risk'
  WHEN transaction_amount >= 1000 THEN 'low_risk'
  ELSE 'minimal_risk'
END

Macro requirements:
- Name: categorize_transaction_risk
- Parameters:
  * amount_column (required): column name with transaction amount
  * high_risk_threshold (optional, default=10000 - triggers additional review)
  * medium_risk_threshold (optional, default=5000)
  * low_risk_threshold (optional, default=1000)
- Null handling: Return 'unknown' for null amounts
- Include docstring explaining this categorizes financial transaction risk levels
- Return proper SQL CASE statement

Example usage in model:
{{ categorize_transaction_risk('transaction_amount') }}
{{ categorize_transaction_risk('daily_total', high_risk_threshold=15000) }}
```

**What Copilot generates:**

- Macro with `{% macro %}` and `{% endmacro %}` tags
- Default parameter values
- Null check at the start
- Complete docstring
- Working usage examples

**Example output:**

```sql
{% macro categorize_transaction_risk(
    amount_column,
    high_risk_threshold=10000,
    medium_risk_threshold=5000,
    low_risk_threshold=1000
) %}
{#
  Categorizes financial transactions by risk level for compliance monitoring.
  High risk transactions (10000+) trigger additional review and approval workflows.
  
  Parameters:
    - amount_column: The column name containing transaction amount
    - high_risk_threshold: Minimum amount for high_risk tier (default: 10000 - requires review)
    - medium_risk_threshold: Minimum amount for medium_risk tier (default: 5000)
    - low_risk_threshold: Minimum amount for low_risk tier (default: 1000)
  
  Returns: SQL CASE statement that returns risk category as string
  
  Example usage:
    {{ categorize_transaction_risk('transaction_amount') }}
    {{ categorize_transaction_risk('daily_total', high_risk_threshold=15000) }}
#}

case
  when {{ amount_column }} is null then 'unknown'
  when {{ amount_column }} >= {{ high_risk_threshold }} then 'high_risk'
  when {{ amount_column }} >= {{ medium_risk_threshold }} then 'medium_risk'
  when {{ amount_column }} >= {{ low_risk_threshold }} then 'low_risk'
  else 'minimal_risk'
end

{% endmacro %}
```

**Troubleshooting:**

- **Jinja syntax errors?** Request: "Use valid Jinja2 syntax with proper spacing"
- **Parameters not working?** Specify: "Use default parameter syntax: `high_risk_threshold=10000`"
- **Wrong thresholds?** Clarify: "High risk = 10000+ (requires review), medium risk = 5000+"

## Troubleshoot errors and issues

### Debug SQL errors

**Use case:** Your retail inventory query fails with a warehouse error and you need to understand why.

**Effective prompt:**

```text
I'm getting this error in Snowflake tracking product inventory:

"SQL compilation error: error line 8 at position 45
invalid identifier 'PRODUCT_NAME'"

Query:
SELECT 
  i.inventory_id,
  i.product_id,
  p.product_name,
  SUM(i.quantity_on_hand) as total_quantity
FROM inventory i
LEFT JOIN products p ON i.product_id = p.id
GROUP BY 1, 2, 3

Expected: Join inventory and products, aggregate quantity by product
What's wrong and how do I fix it?
```

**What Copilot provides:**

- Plain-language explanation (customer_name not in GROUP BY)
- Minimal fix (add `c.customer_name` to GROUP BY)
- Why it works (all non-aggregated columns must be grouped)

**Example output:**

```sql
-- Issue: product_name is in SELECT but not in GROUP BY
-- In SQL, all non-aggregated columns must be included in GROUP BY

-- Fixed query:
SELECT 
  i.inventory_id,
  i.product_id,
  p.product_name,
  SUM(i.quantity_on_hand) as total_quantity
FROM inventory i
LEFT JOIN products p ON i.product_id = p.product_id  -- Also fixed: was p.id, should be p.product_id
GROUP BY i.inventory_id, i.product_id, p.product_name  -- Added p.product_name

-- Alternative: Use positional references carefully
-- GROUP BY 1, 2, 3 can be fragile if column order changes
```

### Fix schema changes

**Use case:** Your shipping cost model broke after a schema change.

**Effective prompt:**

```text
The insurance_fee column in stg_shipments now contains NULLs (was always populated before).

My calculation breaks:
total_cost = base_rate + insurance_fee

Error: "Invalid argument types for function '+'; expecting (NUMBER, NUMBER)"

Sample data showing the issue:
| shipment_id | carrier_id | base_rate | insurance_fee |
|-------------|------------|-----------|---------------|
| 8001        | 201        | 25.00     | 5.00          |
| 8002        | 202        | 18.00     | NULL          |
| 8003        | 203        | 32.00     | 8.00          |
| 8004        | 204        | 22.00     | NULL          |

What assumptions broke? What guardrails should I add?
```

**What Copilot provides:**

- Broken assumption identified (assumed non-null)
- Fix: `coalesce(discount_amount, 0)`
- Additional safety checks recommended

**Example output:**

```sql
-- Broken assumption: insurance_fee was always non-null
-- Fix: Use COALESCE to handle NULLs

select
  shipment_id,
  carrier_id,
  base_rate,
  insurance_fee,
  base_rate + coalesce(insurance_fee, 0) as total_cost
from stg_shipments

-- Additional guardrails to consider:
-- 1. Add a data test to track NULL rate for insurance_fee
-- 2. Consider if NULL means "no insurance" or "insurance not recorded"
-- 3. Document assumption: NULL insurance_fee defaults to 0 (uninsured shipment)
-- 4. Alert if NULL rate exceeds 10% (may indicate data pipeline issue)
```

### Reproduce with minimal example

**Use case:** Your ad campaign ROI query fails on production data, and you need to isolate the issue.

**Effective prompt:**

```text
My ROI calculation query for ad campaigns fails on some records. Create a minimal reproduction case.

Sample rows that trigger the error:
| campaign_id | advertiser_id | campaign_date | spend       | conversions | conversion_value |
|-------------|---------------|---------------|-------------|-------------|------------------|
| 7001        | 301           | 2024-01-15    | 5000.00     | NULL        | 8000.00          |
| 7002        | 302           | 2024-01-16    | 3200.00     | 45          | NULL             |
| 7003        | NULL          | 2024-01-17    | 2100.00     | 28          | 4200.00          |
| 7004        | 304           | NULL          | 1800.00     | 32          | 3600.00          |

Failed query:
SELECT 
  advertiser_id,
  SUM((conversion_value - spend) / spend) as roi
FROM campaigns
GROUP BY advertiser_id

Error: "NULL value in arithmetic operation"

Which rows cause the failure and what's the minimal fix for campaign ROI calculation?
```

**What Copilot provides:**

- Problematic rows identified (NULL discount, NULL customer_id)
- Minimal reproduction query using only problem rows
- Root cause analysis for each failure
- Recommended fixes with COALESCE and filters

**Example output:**

```sql
-- Problematic rows identified:
-- Row 7001: conversions is NULL (causes arithmetic issues)
-- Row 7002: conversion_value is NULL (causes arithmetic failure)
-- Row 7003: advertiser_id is NULL (causes GROUP BY issue)
-- Row 7004: campaign_date is NULL (may indicate bad data)

-- Minimal reproduction (using just problem rows):
select 
  advertiser_id,
  sum(
    case 
      when spend > 0 and conversion_value is not null 
      then (conversion_value - spend) / spend 
      else 0 
    end
  ) as roi
from (
  values
    (301, 5000.00, NULL),
    (302, 3200.00, NULL),
    (NULL, 2100.00, 4200.00)
) as campaigns(advertiser_id, spend, conversion_value)
where advertiser_id is not null  -- Filter out NULL advertiser_ids
group by advertiser_id

-- Recommended fixes for campaign ROI:
-- 1. Add NULL check: Only calculate ROI when both spend and conversion_value exist
-- 2. Add zero-spend check: Prevent division by zero when spend = 0
-- 3. Filter out NULL advertiser_ids before aggregation
-- 4. Add data quality test: conversion_value should not be NULL for active campaigns
-- 5. Add test: advertiser_id must be present for all campaign records
```

### Debug macros

**Use case:** Your macro for calculating business days renders incorrect SQL.

**Effective prompt:**

```text
My macro generates wrong SQL for business days calculation:

Macro code:
{% macro get_business_days_between(start_date, end_date) %}
  datediff('day', {{ start_date }}, {{ end_date }}) - 
  (datediff('week', {{ start_date }}, {{ end_date }}) * 2)
{% endmacro %}

Called as: {{ get_business_days_between('order_date', 'ship_date') }}

Compiled SQL output:
datediff('day', order_date, ship_date) - 
(datediff('week', order_date, ship_date) * 2)

Expected: This logic doesn't account for partial weeks correctly.
How should I fix the business days calculation?
```

**What Copilot provides:**

- Identifies current_date() should be current_date
- Corrected macro code
- Explanation of the difference

**Example output:**

```sql
-- Issue: The formula doesn't handle partial weeks correctly
-- It assumes every week has exactly 5 business days, which fails at month/week boundaries

-- Corrected macro:
{% macro get_business_days_between(start_date, end_date) %}
  -- Calculate total days
  datediff('day', {{ start_date }}, {{ end_date }}) 
  -- Subtract full weekends (2 days per complete week)
  - (datediff('week', {{ start_date }}, {{ end_date }}) * 2)
  -- Adjust for partial weeks at start/end
  - case 
      when dayofweek({{ start_date }}) = 1 then 1  -- Started on Sunday
      when dayofweek({{ end_date }}) = 7 then 1    -- Ended on Saturday
      else 0
    end
{% endmacro %}

-- Compiled output (corrected):
datediff('day', order_date, ship_date) 
- (datediff('week', order_date, ship_date) * 2)
- case 
    when dayofweek(order_date) = 1 then 1
    when dayofweek(ship_date) = 7 then 1
    else 0
  end

-- Explanation:
-- Business days calculation needs to handle edge cases
-- Must account for partial weeks when date range starts/ends mid-week
-- Consider using a date dimension table for more complex holiday calendars
```

## Conclusion

<ConfettiTrigger>
Well done! You've now learned how to write effective prompts for dbt Copilot to generate accurate SQL, models, metrics, and macros with realistic examples.

To summarize, when writing prompts for dbt Copilot, you should:

- Include essential context
- State the business goal, not just the output
- Be explicit about output structure
- Debug SQL errors
- Fix schema changes
- Debug macros

Here's a quick reference checklist to help you write effective prompts for dbt Copilot:

- ✅ **Context**: Table names, columns, data types, join relationships
- ✅ **Sample values**: Examples for categorical fields (e.g., `status in ('active', 'pending')`)
- ✅ **Business goal**: What decision or KPI you're supporting, not just technical output
- ✅ **Output specification**: Column names, aggregation level, sort order, format
- ✅ **Business rules**: Clear definitions (e.g., "Active user = login in last 30 days")
- ✅ **Edge cases**: Null handling, exclusions, date ranges

For troubleshooting, also include:

- ✅ **Complete error messages**: Full warehouse error with line numbers
- ✅ **Compiled SQL**: What dbt actually generated (from `target/compiled/`)
- ✅ **Database context**: Snowflake, BigQuery, Databricks, etc.

</ConfettiTrigger>
</div>
