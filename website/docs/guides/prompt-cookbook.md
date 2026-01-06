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
- [Leveraging external assets](#leveraging-external-assets)
- [Create semantic models and metrics](#create-semantic-models-and-metrics)
- [Create reusable macros](#create-reusable-macros)
- [Troubleshoot errors and issues](#troubleshoot-errors-and-issues)
- [Conclusion](#conclusion)

## Prompt best practices

Writing effective prompts is about giving Copilot the right context and clear direction. Follow these three principles:

### 1. Provide rich context

Include table names, column types, and example values. Describe how they relate to each other.

**What to include:**

- Table relationships (e.g., orders joins to customers on customer_id)
- Data types (e.g., created_at is a timestamp)
- Sample values (e.g., status is a string with values like "active" or "pending")

**Example:** Coffee Shop Punch Card

You run a neighborhood café. Folks get a free drink after 10 visits.

```text
We've got customers, their subscriptions, and their app activity. 
Customers connect to subscriptions, and activity shows what they do week to week.

Help me see weekly regulars and which punch-card folks become subscribers 
to our 'Beans of the Month.'
```

**Why it works:** Clear people, clear behavior, clear relationship. Copilot knows what to count and how to connect it.

### 2. State the business question, not just the output

Describe the decision or insight the query supports. Avoid purely technical prompts.

**Instead of:** "Count users"

**Say:** "Count active users per week to analyze engagement trends"

**Example:** The Sneaker Drop

You run an online sneaker shop with a new limited-time drop.

```text
We launched a 14-day trial. Did it lift weekly engagement and upgrades? 
If yes, we'll scale it. If not, we'll tweak the message.

Show me weekly browsers who became buyers, and whether trying the 3D preview 
led to more purchases.
```

**Why it works:** You've described the moment, the behavior, and the decision: keep the 3D preview or not.

### 3. Be clear and explicit about the result

Define the expected output clearly. Mention the expected columns in the final result and state whether results should be sorted, limited, or filtered.

**What to specify:**

- Expected column names and formats
- Sort order and any limits (e.g., "top 10 products by revenue")
- Output format examples (e.g., "conversion_rate as a percentage")

**Example:** The Fitness Challenge

You run a fitness app with a 2-week challenge.

```text
Give me a weekly trend with the date, active folks, and a simple 'engagement per person.' 
Then a summary by launch week with 'trial starts,' 'upgrades in 30 days,' 
and an 'upgrade rate' as a percentage.

Each week, show active challengers and total workouts. By challenge start week, 
show how many upgraded to paid within 30 days and what their average workouts looked like.
```

**Why it works:** Specific metrics that are ready to present.

### Break complex logic into smaller steps

For multi-part queries, write them as a sequence of instructions:

**Example:**

```text
First, filter the dataset to active users in the last 90 days.
Then, calculate their average session duration.
Finally, join to subscription data and group by plan tier.
```

Avoid asking for everything at once—iterative prompting yields better results.

## Generate SQL queries

**Use case:** Build a customers model for an e-commerce platform.

**What to give Copilot:**

```text
Context:
We have customers, orders, and payments tables. 
- customers (customer_id, first_name, last_name, email)
- orders (order_id, customer_id, order_date, status)
- payments (payment_id, order_id, amount, payment_method)

Relationships: 
- orders.customer_id → customers.customer_id
- payments.order_id → orders.order_id

Sample values: 
- status in ('completed', 'pending', 'cancelled')
- payment_method in ('credit_card', 'paypal', 'bank_transfer')

Business question:
Create a customer summary showing total orders and revenue per customer.

Output:
- customer_id
- first_name
- last_name  
- first_order_date
- most_recent_order_date
- total_orders
- total_revenue

Filter: Only completed orders
Sort: total_revenue descending
```

**Why it works:**
You're giving Copilot a clear map of how data connects, what values to expect, and what decision this supports.

**Pro tip:** Start simple, then iterate. If Copilot's first attempt isn't perfect, refine your prompt with more specific details.

## Leveraging external assets

When you have existing documentation, sample data, or business logic definitions, bring them into your prompts. This helps Copilot understand your specific context.

### Surface business logic and transformations

**Concept:** An "active customer" badge is not a metric definition. The rule behind it is.

**What to give Copilot:**

```text
Active customer means at least one paid purchase in the last 90 days, excluding refunds. 
Net revenue = gross minus discounts and returns.
```

**External assets to reference:**

- Metrics glossary or KPI catalog from your wiki
- Product requirement docs with business rules
- Data dictionaries with field definitions

### Include relevant sample data

Small, representative slices of data illustrate edge cases without overwhelming the prompt.

**What to give Copilot:**

```text
Sample order statuses we need to handle:
- 'completed': Paid and fulfilled
- 'pending': Awaiting payment
- 'cancelled': Customer cancelled before shipping
- 'returned': Delivered but customer returned
```

**External assets to reference:**

- Data profiling reports showing value distributions
- QA test datasets with edge cases
- BI dashboard filters and their definitions

### Capture dependencies and lineage

Source-to-target mappings and upstream model references guide join logic.

**What to give Copilot:**

```text
This model depends on:
- {{ ref('stg_orders') }} - raw order data, deduplicated
- {{ ref('stg_customers') }} - customer master data
- {{ ref('dim_products') }} - product catalog with current prices

Join orders to customers on customer_id (inner join, every order must have a customer).
Join orders to products on product_id (left join, some orders have deleted products).
```

**External assets to reference:**

- dbt lineage graphs or documentation
- Data warehouse ERD diagrams
- Data flow documentation

## Create semantic models and metrics

**Use case:** Fast-track your semantic layer strategy with AI-generated YAML.

**What to give Copilot:**

```text
Create a semantic model for order revenue tracking.

Base model: {{ ref('fct_orders') }}

Available columns:
- order_date (timestamp)
- order_amount (decimal)
- customer_id (integer)
- product_id (integer)
- region (string - 'north', 'south', 'east', 'west')

Requirements:
- Entity: customer
- Measures: total_revenue (sum of order_amount), order_count
- Dimensions: region, order_date as metric_time (support day, week, month)
- Metric: monthly_revenue (total revenue by month)

Return valid YAML with descriptions.
```

**What Copilot generates:**

- Valid semantic model YAML structure
- Properly defined entities, measures, and dimensions
- Time dimension with multiple grains
- Metric definitions

**Pro tip:** Use Copilot to reduce time spent writing boilerplate YAML. It leverages context from common metrics and dimensions across projects to ensure consistency.

## Create reusable macros

### Use case 1: Turn repetitive code into reusable logic

A junior analyst keeps copy-pasting CASE statements across models.

**What to give Copilot:**

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

### Use case 2: Lower the barrier to entry

**Scenario:** You need a macro but don't know Jinja syntax well.

**What to ask Copilot:**

```text
I need a macro that calculates the number of days between two date columns, 
excluding weekends.

Parameters:
- start_date_column (required)
- end_date_column (required)

Include a docstring explaining how to use it.
```

**Outcome:** Copilot generates proper Jinja syntax, handles parameters, and includes documentation. You learn Jinja patterns while getting working code.

### Use case 3: Accelerate complex logic design (for advanced users)

**What to ask Copilot:**

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

**Think of it like:** Writer's room sprint. You pitch the premise, Copilot drafts the scene beats.

**Pro tip:** After generating the macro, ask Copilot to add usage examples and document edge cases. This makes it easier for your team to adopt.

## Troubleshoot errors and issues

Copilot acts as a fast, context-aware reviewer for failing SQL and macros. It reads errors, inspects your query structure, and suggests minimal fixes.

### Why troubleshoot with Copilot?

- **Faster diagnosis:** Plain-language translation of errors with likely root causes
- **Safer fixes:** Bias toward small, targeted changes
- **Better learning:** Generates explanations you can paste into docs or PR descriptions

### Troubleshoot SQL errors

**Step 1: Decode errors and ambiguity**

Error text is a clue, not the crime. Pair the message with the context that produced it.

**What to give Copilot:**

```text
Here's the failing SQL, the exact warehouse error, and which line it points to. 
Explain in plain terms and propose the smallest fix.

Error: "SQL compilation error: Column 'product_name' must appear in GROUP BY"

Query:
SELECT 
  product_id,
  product_name,
  SUM(quantity) as total_quantity
FROM inventory
GROUP BY product_id

Warehouse: Snowflake
What's wrong?
```

**What Copilot provides:**

- Plain-language explanation
- Minimal fix
- Why it works

**Step 2: Align assumptions with current schema**

Queries encode assumptions. When the schema shifts, assumptions need a tune-up.

**What to give Copilot:**

```text
The discount_amount column now contains NULLs (was always populated before).

My calculation breaks:
net_revenue = gross_revenue - discount_amount

Error: "Invalid argument types for function '-'"

What assumptions broke? What guardrails should I add?
```

**What Copilot provides:**

- Broken assumption identified (assumed non-null)
- Fix using `coalesce(discount_amount, 0)`
- Additional safety checks (data tests, documentation)

**Step 3: Reproduce with a minimal example**

Shrink the surface area. If you can break it down, you can fix it fast.

**What to give Copilot:**

```text
Create a reduced query using 5-10 sample rows that still triggers the error. 
Keep columns only if they influence the failure.

Sample data that breaks:
| order_id | customer_id | amount  | discount |
|----------|-------------|---------|----------|
| 1001     | 501         | 100.00  | NULL     |
| 1002     | NULL        | 150.00  | 10.00    |

Failed query calculates net_amount = amount - discount
```

**What Copilot provides:**

- Minimal reproduction using VALUES clause
- Root cause analysis
- Recommended fixes with NULL handling

### Troubleshoot macros

**Step 1: Validate parameters and defaults**

Most macro bugs start with assumptions about inputs.

**What to give Copilot:**

```text
List required vs optional parameters. 
Suggest sensible defaults, type checks, and early error messages. 
Propose guards for empty lists and nulls.

Macro:
{% macro calculate_discount(amount, rate) %}
  {{ amount }} * {{ rate }}
{% endmacro %}
```

**What Copilot provides:**

- Parameter validation suggestions
- Default values
- Null/empty guards

**Step 2: Confirm what was actually rendered**

Compare intent to the SQL your macro produced.

**What to give Copilot:**

```text
Here's the macro and the rendered SQL side-by-side. 
Highlight where the SQL diverges from the intended parameters.

Macro call: {{ my_macro('order_date', 'ship_date') }}

Rendered SQL: (check target/compiled)
...paste rendered SQL here...

Expected behavior: Should calculate days between dates, but getting wrong result
```

**What Copilot provides:**

- Side-by-side comparison
- Identifies where macro logic diverges
- Minimal fix to align output with intent

**Step 3: Sanitize identifiers, quoting, and whitespace**

Jinja often fails quietly when quoting or spacing is off.

**What to give Copilot:**

```text
Review identifier quoting, string quoting, and whitespace in this macro.
Replace brittle concatenation with safer helpers.

{% macro filter_by_status(column, status) %}
  where {{ column }} = '{{ status }}'
{% endmacro %}

Warehouse: Snowflake (case-sensitive identifiers)
```

**What Copilot provides:**

- Quoting fixes
- Whitespace corrections
- Recommendations for using adapter.quote() or other built-in helpers

**Step 4: Make logic testable and documented**

Fix the bug, then add bumpers so it doesn't return.

**What to give Copilot:**

```text
After the minimal code change, draft a docstring with parameter descriptions, 
a usage example, and propose two tests: one success case, one edge case.
```

## Conclusion

<ConfettiTrigger>
You've now learned how to use dbt Copilot as your AI co-pilot. You can:

- **Master SQL prompting** by providing rich context and stating clear business questions
- **Amplify your workflow** by leveraging existing documentation and project context
- **Generate Jinja macros** to build more scalable and maintainable systems
- **Troubleshoot your code** to diagnose issues fast and apply safe, explainable fixes

### Quick reference checklist

When writing prompts for dbt Copilot:

- ✅ **Provide rich context**: Table names, columns, data types, relationships, sample values
- ✅ **State the business question**: What decision or insight you're supporting, not just "write a query"
- ✅ **Be clear and explicit**: Expected columns, sort order, filters, and output format
- ✅ **Break down complex logic**: Write multi-part queries as a sequence of steps

For troubleshooting:

- ✅ **Include complete error messages**: Full warehouse error with line numbers
- ✅ **Show the failing code**: Both the dbt model and compiled SQL (from `target/compiled/`)
- ✅ **Provide sample data**: Representative rows that trigger the issue
- ✅ **State your warehouse**: Snowflake, BigQuery, Databricks, etc.

### Next steps

Start with one task—automating documentation, generating a test, or refactoring a model—and build the habit from there. The more you use Copilot, the more you'll discover ways to accelerate your analytics engineering workflow.

</ConfettiTrigger>
</div>
