---
title: How to use prompts for dbt Copilot
description: A cookbook of prompts and real-world examples to use dbt Copilot efficiently.
id: prompt-cookbook
icon: 'dbt-copilot'
hide_table_of_contents: true
tags: ['dbt Copilot', 'AI', 'Best practices']
level: 'Beginner'
---

<div style={{maxWidth: '900px'}}>

## Overview

<IntroText>
Learn how to write effective prompts for dbt <Constant name="copilot" /> to generate accurate SQL, models, metrics, and macros. Each recipe is self-contained with its own realistic example.
</IntroText>

dbt <Constant name="copilot" /> is an AI assistant that generates SQL, YAML, documentation, tests, semantic models, and macros based on your project's context. The quality of output depends on the clarity of your prompts.

This cookbook provides independent recipes for common prompting tasks. Jump to any section that matches your current need.

This cookbook covers the following topics:
<!-- no toc -->
- [Prompt best practices](https://docs.getdbt.com/guides/prompt-cookbook?step=2)
- [Generate SQL queries](https://docs.getdbt.com/guides/prompt-cookbook?step=3)
- [Use what you already have](https://docs.getdbt.com/guides/prompt-cookbook?step=4)
- [Create semantic models and metrics](https://docs.getdbt.com/guides/prompt-cookbook?step=5)
- [Create reusable macros](https://docs.getdbt.com/guides/prompt-cookbook?step=6)
- [Troubleshoot errors and issues](https://docs.getdbt.com/guides/prompt-cookbook?step=7)
- [Conclusion](https://docs.getdbt.com/guides/prompt-cookbook?step=8)

## Prompt best practices

Writing effective prompts is about giving <Constant name="copilot" /> the right context and clear direction. Follow these principles:
- [Provide rich context](#provide-rich-context)
- [Break complex logic into smaller steps](#break-complex-logic-into-smaller-steps)
- [State the business question, not just the output](#state-the-business-question-not-just-the-output)
- [Be clear and explicit about the result](#be-clear-and-explicit-about-the-result)

### Provide rich context

In your prompt, include table names, column types, and example values to describe how they relate to each other.

Include the following:

- Table relationships (such as `orders` connects to `customers` on `customer_id`)
- Data types (such as `signup_date` is a timestamp)
- Sample values (such as `plan_type` can be "monthly" or "annual")

:::tip
The following example uses SQL terminology (like data types and joins) because it's generating a SQL query. However, the principle of providing rich context applies to all <Constant name="copilot" /> tasks—whether you're generating macros, documentation, or YAML configurations.
:::

**Example: Santi's neighborhood café**

Let's say you run a neighborhood café and folks get a free drink after 10 visits:

**Without rich context** (vague):
```text
I need a query using customers, subscriptions, and activity tables to see weekly regulars.
```

**With rich context** (specific):

```text
Context: I run a café loyalty program where customers earn a free drink after 10 visits.

Tables and relationships:

- customers (customer_id INT or integer, name STRING, email STRING, signup_date TIMESTAMP)
- subscriptions (subscription_id INT, customer_id INT, plan_type STRING, start_date DATE, end_date DATE)
  - Joins to customers on customer_id
  - plan_type values: "monthly", "annual", null for non-subscribers
- activity (activity_id INT, customer_id INT, visit_date DATE, visit_count INT)
  - Joins to customers on customer_id
  - visit_count tracks cumulative visits (resets after redemption)

Business question: Show me which customers visit weekly (3+ times per week for 4+ weeks) 
and compare conversion rates: do high-frequency punch-card users convert to our 
'beans of the month' subscription at a higher rate than casual visitors?
```

**Why it works:** The AI now knows exact data types, how tables relate, what values to expect, and the specific business logic (3+ visits/week defines "regulars").

### Break complex logic into smaller steps

:::tip Common misconception
Many users try to ask for everything at once in a single prompt. Breaking your request into smaller, sequential steps consistently produces better results.
:::

For multi-part tasks, write them as a sequence of clear instructions. <Constant name="copilot" /> handles step-by-step logic better than complex, all-in-one requests.

**Example:**

```text
1. Filter the dataset to active users in the last 90 days.
2. Calculate their average session duration.
3. Join to subscription data and group by plan tier.
```

**Why this works:** Each step is clear and actionable. You can always iterate on your prompt to refine results &mdash; start simple, then build complexity.

### State the business question, not just the output

Describe the decision or insight the query supports, and avoid only technical-like prompts. This means, instead of "count users", you can say "count active users per week to analyze engagement trends."

**Example: The sneaker drop**

Let's say you run an online sneaker shop and just launched a new feature: customers can view 3D previews of sneakers before buying.

```text
We launched a 3D preview feature with our latest limited-edition sneaker drop. 
Did customers who used the 3D preview convert to buyers at a higher rate than 
those who only saw photos?

Show me weekly conversion rates: browsers who became buyers, segmented by whether 
they used the 3D preview. If preview users convert 20%+ higher, we'll add 3D 
to all products. If not, we'll improve the feature before expanding.
```

**Why it works:** You've described the feature, the behavior you're measuring, specific success criteria (20%+ lift), and the decision you'll make based on results.

### Be clear and explicit about the result

Define the expected output clearly. Mention the expected columns in the final result and state whether results should be sorted, limited, or filtered.

**What to specify:**

- Expected column names and formats
- Sort order and any limits (for example, "top 10 products by revenue")
- Output format examples (for example, "`conversion_rate` as a percentage")

**Example: The fitness challenge**

In this example, you run a fitness app with a 2-week challenge, Kimiko's kettlebell challenge.

```text
Give me a weekly trend with the date, active folks, and a simple 'engagement per person.' 
Then a summary by launch week with 'trial starts,' 'upgrades in 30 days,' 
and an 'upgrade rate' as a percentage.

Each week, show active challengers and total workouts. By challenge start week, 
show how many upgraded to paid within 30 days and what their average workouts looked like.
```

**Why it works:** Specific metrics that are ready to present.

## Generate SQL queries

Let's say you want to build a query to find top-spending customers.

```text
Context:
I have two tables:
- customers (customer_id, name, email)
- orders (order_id, customer_id, order_total, order_date)

Relationship: orders.customer_id connects to customers.customer_id

Business question:
Show me the top 10 customers by total spending in 2024.

Output:
- customer_id
- customer_name
- total_spent
- order_count

Sort by total_spent descending, limit to 10 rows.
```

**What <Constant name="copilot" /> generates:**

```sql
select
    c.customer_id,
    c.name as customer_name,
    sum(o.order_total) as total_spent,
    count(o.order_id) as order_count
from {{ ref('customers') }} c
inner join {{ ref('orders') }} o
    on c.customer_id = o.customer_id
where year(o.order_date) = 2024
group by c.customer_id, c.name
order by total_spent desc
limit 10
```

**Why it works:**
- Clear context about tables and their relationship
- Specific business question with a defined time period
- Explicit output requirements and sorting logic

**Pro tip:** Start simple, then iterate. If <Constant name="copilot" />'s first attempt isn't perfect, no worries! Refine your prompt with more specific details and let <Constant name="copilot" /> do its magic, it usually gets there in the end ✨

## Use what you already have

You don't need to write everything from scratch. Pull in documentation, definitions, and sample data you already have—it helps <Constant name="copilot" /> understand your specific business context.

:::tip dbt Insights integration
When using <Constant name="copilot" /> in [<Constant name="insights" />](/docs/explore/dbt-insights), you can easily cross-reference between <Constant name="copilot" />'s generated SQL and metadata from [dbt Catalog](/docs/explore/explore-projects). This embedded integration makes it seamless to access documentation, definitions, and sample data while building queries.
:::

### Define your business rules

Instead of just saying "active customer," explain the rule:

```text
Active customer = at least one paid purchase in the last 90 days, excluding refunds
Net revenue = gross sales minus discounts and returns
```

**Pull from:** Metrics glossaries, KPI catalogs, product requirement docs, data dictionaries

### Show sample values

Give <Constant name="copilot" /> examples of what the data actually looks like, especially edge cases:

```text
Order statuses:
- `customer_id: C-12, created_at: 2025-05-03T09:07:00Z, status: 'completed'`
- `customer_id: C-14, created_at: 2025-05-03T09:02:00Z, status: 'cancelled'`
- `customer_id: C-13, created_at: 2020-01-02T06:40:00Z, status: 'pending'`
```

**Pull from:** Data profiling reports, QA test datasets, BI dashboard filters

### Start with a draft, refine later

Frame your model first, then iterate. Start with a clean outline that gets the basic structure right:

```text
From stg_orders and dim_customers, draft a minimal model with order_id, customer_id, 
order_date, net_revenue = gross - coalesce(discount, 0), and join to dim_customers 
on customer_id. Filter to the last 30 days for preview only.
```

**Pull from:** Source-to-target mapping sheets (join keys and transformations), data dictionaries (primary and foreign keys)

## Create semantic models and metrics

Fast-track your semantic layer strategy with AI-generated YAML using <Constant name="copilot" />.

<Constant name="dbt_platform" /> provides built-in generation buttons that automatically  [generate code](/docs/platform/use-dbt-copilot), [documentation](/docs/build/documentation), [data tests](/docs/build/data-tests), [metrics](/docs/build/metrics-overview), and [semantic models](/docs/build/semantic-models) for you with the click of a button in the [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-copilot), [<Constant name="canvas" />](/docs/platform/build-canvas-copilot), and [<Constant name="insights" />](/docs/explore/dbt-insights).

These features understand your model's structure and generate YAML in the correct location.

**How to generate semantic models:**

1. Navigate to the Studio IDE and select a SQL model file in the **File explorer**
2. In the **Console** section (under the **Editor**), click the **dbt Copilot** icon to view AI options
3. Select **Semantic model** to create a semantic model based on your SQL model
4. Review and refine the generated YAML as needed

You can also use <Constant name="copilot" /> to generate documentation, tests, and metrics.

These built-in features automatically understand your model's columns, data types, and relationships, which means you don't need to manually describe your schema or copy-paste between file types.

**Typical workflow:**
1. Build your SQL model using <Constant name="copilot" /> conversational prompts
2. Use built-in buttons to add documentation, tests, and semantic models
3. Refine the generated YAML as needed

For more details, check out the [dbt Copilot](/docs/platform/use-dbt-copilot) docs.

## Create reusable macros

In this section, we'll look at how to create reusable macros using <Constant name="copilot" />.

- [Turn repetitive code into reusable logic](#turn-repetitive-code-into-reusable-logic)
- [Lower the barrier to entry](#lower-the-barrier-to-entry)
- [Accelerate complex logic design](#accelerate-complex-logic-design)

### Turn repetitive code into reusable logic

A junior analyst keeps copy-pasting CASE statements across models.

**What to give <Constant name="copilot" />:**

```text
Turn this CASE pattern into a reusable macro:

CASE 
  WHEN amount >= 1000 THEN 'high'
  WHEN amount >= 500 THEN 'medium'
  ELSE 'low'
END

Macro requirements:
- Name: categorize_amount
- Parameters: column name, high threshold (default 1000), medium threshold (default 500)
- Include docstring with usage example
- Handle null values by returning 'unknown'
```

**Why it works:** Clear input (the CASE statement), clear requirements, clear output expectations.

### Lower the barrier to entry

You need a macro but don't know Jinja syntax well.

**What to ask <Constant name="copilot" />:**

```text
I need a macro that calculates the number of days between two date columns, 
excluding weekends.

Parameters:
- start_date_column (required)
- end_date_column (required)

Include a docstring explaining how to use it.
```

**Outcome:** <Constant name="copilot" /> generates proper Jinja syntax, handles parameters, and includes documentation. You learn Jinja patterns while getting working code.

### Accelerate complex logic design

This is best for advanced users who are comfortable with Jinja.

**What to ask <Constant name="copilot" />:**

```text
I need a macro that builds a grouped aggregation with optional filters.

Parameters:
- relation (the model/table to query)
- group_by (list of columns to group by)
- metrics (list of columns to aggregate)
- where (optional filter condition)

Include defaults and guardrails for empty lists.
Add a docstring with parameter descriptions and usage example.
```
**Why this works:** You've outlined the interface (parameters) and edge cases (empty lists), letting <Constant name="copilot" /> handle the Jinja boilerplate while you focus on design. This approach accelerates iteration so you can refine the structure without getting stuck in syntax details.

## Troubleshoot errors and issues

<Constant name="copilot" /> acts as a fast, context-aware reviewer for failing SQL and macros. It reads errors, inspects your query structure, and suggests minimal fixes. Troubleshooting with <Constant name="copilot" /> gives you:

- Faster diagnosis by using plain-language translation of errors with likely root causes
- Safer fixes by biasing toward small, targeted changes
- Better learning by generating explanations you can paste into docs or PR descriptions

### Troubleshoot errors

When something breaks, give <Constant name="copilot" /> the error message, your code, and what you expected to happen. Here are a couple of examples to show you how to use <Constant name="copilot" /> to troubleshoot errors.

**Example: SQL error**

```text
Error: "SQL compilation error: Column 'product_name' must appear in GROUP BY"

Query:
SELECT 
  product_id,
  product_name,
  SUM(quantity) as total_quantity
FROM inventory
GROUP BY product_id

Warehouse: Snowflake
Expected: Group by product and show product name. What's wrong and how do I fix it?
```

**Example: Macro not working**

```text
This macro should calculate discount but returns wrong values:

{% macro calculate_discount(amount, rate) %}
  {{ amount }} * {{ rate }}
{% endmacro %}

When I call {{ calculate_discount(100, 0.1) }} I expect 10 but get an error.
Show me the rendered SQL from target/compiled and explain what's wrong.
```

**Tip:** Include your warehouse type (Snowflake, BigQuery, Databricks and so on.) &mdash; this is because the syntax can vary across data platforms.

## Conclusion

<ConfettiTrigger>
Congrats, you've now learned some tips on how to create and use prompts for dbt <Constant name="copilot" />  🎉! You can:

- Boost your prompting skills by providing rich context and stating clear business questions. Applicable for SQL, macros, documentation, tests, metrics, and semantic models.
- Amplify your workflow by using existing documentation and project context
- Generate Jinja macros to build more scalable and maintainable systems
- Troubleshoot your code to diagnose issues fast and apply safe, explainable fixes

### Quick reference checklist

When writing prompts for dbt <Constant name="copilot" />:

- ✅ Provide rich context: Table names, columns, data types, relationships, sample values
- ✅ Break down complex logic: Write multi-part queries as a sequence of steps
- ✅ State the business question: What decision or insight you're supporting, not just "write a query"
- ✅ Be clear and explicit: Expected columns, sort order, filters, and output format


For troubleshooting:

- ✅ Include complete error messages: Full warehouse error with line numbers
- ✅ Show the failing code: Both the dbt model and compiled SQL (from `target/compiled/`)
- ✅ Provide sample data: Representative rows that trigger the issue
- ✅ State your warehouse: Snowflake, BigQuery, Databricks, etc.

### Next steps

Start with one task—automating documentation, generating a test, or refactoring a model—and build the habit from there. 

The more you use <Constant name="copilot" />, the more you'll discover ways to accelerate your analytics engineering workflow.


Check out the following docs to learn more about how to use <Constant name="copilot" />:

- [About dbt Copilot](/docs/platform/dbt-copilot)
- [Generate resources](/docs/platform/use-dbt-copilot#generate-resources)
- [Generate and edit SQL inline](/docs/platform/use-dbt-copilot#generate-and-edit-sql-inline)
- [Build visual models](/docs/platform/use-dbt-copilot#build-visual-models)
- [Build queries](/docs/platform/use-dbt-copilot#build-queries)


</ConfettiTrigger>
</div>
