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
This is a practical cookbook sharing how to get consistent, high-quality results with effective prompts for dbt Copilot.
</IntroText>

dbt <Constant name="copilot" /> is an AI assistant that accelerates development by generating SQL, YAML, documentation, tests, semantic models, and macro scaffolding based on your dbt project's metadata.

Like any AI system, the quality of Copilot's output depends heavily on the quality of your prompts.

This cookbook provides clear prompting recipes, example patterns, and troubleshooting steps to help analytics engineers get reliable results—and to set accurate expectations about what Copilot and the MCP server can and cannot do.

## Core principles of effective prompting

In order to get the best results and performance from dbt <Constant name="copilot" />, you need to provide it with the following information during your prompt:

- Table names
- Column types and meanings
- How they relate to each other (like `orders` joins to `customers` on `customer_id`)
- Example values or edge cases

**✅ A strong prompt would include:**

- Describing the business question: "Count active users per week to analyze engagement trends."
- Specifying column types: `created_at` is a timestamp
- Providing example values: `status` is a string with values that can be `active` or `pending`
- Explaining relationships: `orders.customer_id` joins to `customers.customer_id`

**❌ A weak prompt might be:**

- Describing the output instead: "Write a query using table X" or "Count users"
- Omitting column types: just mentioning `created_at` without specifying it's a timestamp
- Omitting example values: just mentioning `status` without specifying it can be `active` or `pending`
- Omitting relationships: mentioning `orders` and `customers` without explaining how they join together

### State the business question, not just the output

Instead of requesting generic SQL:

"Write a query using table X."

Explain why you need the query:

"Count active users per week to analyze engagement trends."

Why this matters: Copilot anchors its logic to the decision or KPI you care about, reducing ambiguity.

### Be clear and explicit about expected output

Specify:

- Required output columns
- Filters, ordering, or grain
- Format expectations (e.g., percentages, date truncation)
- Multi-step logic in sequence

Example: For Kimiko producing a weekly fitness challenge metric:

- "week_start, active_participants, engagement_rate"
- "Sorted ascending by week"
- "Show upgrade rate as a percentage"

### Use external assets to strengthen results

Copilot improves significantly when you include:

- KPI definitions & business logic
- Small, representative sample data ("swatches, not the whole fabric roll")
- Source-to-target mappings
- Upstream documentation

Example: A clear rule like "Active customer = ≥1 paid purchase in last 90 days, excluding refunds" leads to consistent SQL and semantic model generation.

## How to generate SQL queries using dbt Copilot

In this section, you'll learn how to generate SQL queries using dbt <Constant name="copilot" />. Generating SQL queries is a common use case for dbt <Constant name="copilot" />.

### Objectives

After completing this recipe, you'll be able to:

- Write effective prompts that generate accurate SQL queries
- Provide <Constant name="copilot" /> with the context needed to produce reliable results
- Specify output structure and business logic clearly

### Use case

Let's take analytics engineer Santi, who needs to analyze weekly customer engagement by counting active customers with at least one non-returned order. He wants to generate a SQL query that aggregates this data by week.

### Prerequisites

- Access to dbt <Constant name="copilot" />
- Knowledge of table schema and relationships
- Understanding of the business question to be answered

### Steps to generate SQL queries

1. **List the tables and column information**
   - Provide table names and their columns
   - Specify column types (e.g., timestamp, string, integer)
   - Include example values for categorical columns

2. **Describe the business question**
   - Explain why you need the query, not just what output you want
   - Focus on the decision or KPI you're analyzing

3. **Specify the exact columns and grain**
   - List required output columns
   - Define the aggregation level (e.g., weekly, monthly)
   - Specify any calculated fields

4. **Add rules, filters, or edge conditions**
   - Include exclusion criteria
   - Specify sorting requirements
   - Add any business logic rules

### Code snippets

**Example prompt:**

```text
We have two tables:
- orders(order_id, customer_id, order_date, gross, discount, returned)
- customers(customer_id, created_at, status)

created_at is a timestamp. status may be 'active' or 'pending'.
orders.customer_id joins to customers.customer_id.

Business question:
Analyze weekly engagement: active customers with at least one non-returned order.

Please produce a weekly query with:
- week_start
- active_customer_count
- total_net_revenue = gross - coalesce(discount, 0)
Exclude returned = true rows.
Sort by week_start.
```

### Expected output

Copilot should generate a SQL query that:

- Joins `orders` and `customers` tables on `customer_id`
- Filters to active customers (`status = 'active'`)
- Excludes returned orders (`returned != true`)
- Aggregates by week using `date_trunc('week', order_date)`
- Calculates net revenue as `gross - coalesce(discount, 0)`
- Orders results by `week_start` ascending

### Troubleshooting tips

**If Copilot generates incorrect joins:**

- Explicitly state the join key: "orders.customer_id joins to customers.customer_id"
- Specify join type if needed: "left join", "inner join"

**If output columns don't match expectations:**

- List exact column names you need
- Specify aliases if required
- Include format requirements (e.g., "Show as percentage")

**If business logic is incorrect:**

- Provide explicit definitions: "Active customer = customer with status 'active'"
- Include edge case handling: "Handle null discounts as 0"

## How to create model skeletons using dbt Copilot

### Objectives

After completing this recipe, you'll be able to:

- Generate SQL model skeletons quickly
- Jump-start new dbt models with proper structure
- Include temporary filters for preview purposes

### Use case

Analytics engineer Kimiko needs to create a new dbt model that combines order and customer data. She wants a minimal skeleton to preview the results before building out the full model.

### Prerequisites

- Access to dbt Copilot
- Knowledge of source tables (`stg_orders`, `dim_customers`)
- Understanding of which fields are required for the model

### Step-by-step instructions

1. **Identify source tables**
   - List the staging or source tables you'll use
   - Specify the join keys between tables

2. **Define minimal required fields**
   - List only essential columns for the initial skeleton
   - Include any calculated fields needed

3. **Specify basic transformation logic**
   - Define any calculations or transformations
   - Include join conditions

4. **Add temporary filters for preview**
   - Use date ranges or other filters to limit data for testing
   - Clearly mark these as temporary

### Code snippets

**Example prompt:**

```text
Using stg_orders and dim_customers:

Draft a minimal model containing:
- order_id
- customer_id
- order_date
- net_revenue = gross - coalesce(discount, 0)

Join on customer_id.
Filter to last 30 days for preview only.

Return a SQL skeleton plus a short comment block describing assumptions.
```

### Expected output

Copilot should generate:

- A SQL model with SELECT statement
- Proper JOIN syntax on `customer_id`
- Calculated field for `net_revenue`
- Temporary WHERE clause filtering to last 30 days
- Comment block explaining assumptions and temporary filters

### Troubleshooting tips

**If joins are incorrect:**

- Specify exact table aliases: "stg_orders o join dim_customers c on o.customer_id = c.customer_id"
- Clarify join type if left/right join is needed

**If calculated fields are wrong:**

- Provide explicit formulas: "net_revenue = gross - coalesce(discount, 0)"
- Specify null handling: "Use coalesce to handle null discounts"

**If model structure doesn't match dbt conventions:**

- Request dbt-specific syntax: "Use `{{ ref() }}` for model references"
- Ask for proper YAML structure if needed

## How to create semantic models and metrics using dbt Copilot

### Objectives

After completing this recipe, you'll be able to:

- Generate semantic model YAML definitions
- Define measures, dimensions, and time dimensions correctly
- Create metrics that align with business KPIs

### Use case

Analytics engineer Alex needs to create a semantic model for monthly revenue per customer using the `orders` model. They want to define measures, dimensions, and time dimensions with proper descriptions.

### Prerequisites

- Access to dbt Copilot
- Understanding of semantic layer concepts (measures, dimensions, entities)
- Knowledge of the underlying model structure

### Step-by-step instructions

1. **Identify the base model**
   - Specify which dbt model contains the data
   - List available columns and their types

2. **Define measures**
   - Specify calculation formulas
   - Include aggregation types (sum, average, count, etc.)

3. **Define dimensions**
   - List categorical dimensions
   - Specify time dimensions with grain (day, week, month, quarter, year)

4. **Specify calculation rules**
   - Include business logic for measures
   - Define any filters or exclusions

### Code snippets

**Example prompt:**

```text
Create a semantic model for monthly revenue per customer using the `orders` model.

Columns available:
- order_date (timestamp)
- gross (decimal)
- discount (decimal, nullable)
- customer_id (integer)

Define:
- measure: net_revenue = gross - coalesce(discount, 0)
- dimension: customer_id
- time dimension: order_date (month grain)

Return valid YAML and include field descriptions.
```

### Expected output

Copilot should generate YAML that includes:

- Semantic model definition with proper structure
- Measure definition with calculation formula
- Dimension definitions with descriptions
- Time dimension with month grain specified
- Field descriptions for all measures and dimensions

### Troubleshooting tips

**If YAML syntax is incorrect:**

- Request valid dbt semantic layer YAML format
- Ask Copilot to validate against semantic layer schema

**If calculations don't match business logic:**

- Provide explicit formulas: "net_revenue = gross - coalesce(discount, 0)"
- Specify null handling requirements

**If time grain is incorrect:**

- Explicitly state the grain: "month grain", "week grain"
- Clarify if multiple grains are needed

## How to create macros using dbt Copilot

### Objectives

After completing this recipe, you'll be able to:

- Convert repetitive SQL logic into reusable macros
- Define macro parameters with defaults
- Handle edge cases and null values properly

### Use case

Analytics engineer Jordan has repetitive CASE logic in multiple models and wants to convert it into a reusable macro with proper parameter handling and documentation.

### Prerequisites

- Access to dbt Copilot
- Understanding of Jinja templating syntax
- Knowledge of the logic you want to macro-ize

### Step-by-step instructions

1. **Identify repetitive logic**
   - Provide the CASE statement or logic pattern
   - Explain where it's used and why

2. **Define parameters**
   - List required parameters
   - Specify optional parameters with defaults

3. **Specify edge case handling**
   - Define null handling requirements
   - Include error handling needs

4. **Request documentation**
   - Ask for docstring with parameter descriptions
   - Request usage examples

### Code snippets

**Example prompt:**

```text
Turn this CASE logic into a reusable macro:

CASE 
  WHEN revenue > 1000 THEN 'high_value'
  WHEN revenue > 500 THEN 'medium_value'
  ELSE 'low_value'
END

Include:
- a parameter for threshold (default 1000 for high, 500 for medium)
- safe handling of nulls
- a docstring with parameter descriptions
- one usage example
```

### Expected output

Copilot should generate:

- A macro definition with proper Jinja syntax
- Parameter definitions with defaults
- Null handling logic (e.g., `{% if revenue is none %}`)
- Docstring explaining parameters and usage
- Example of how to call the macro

### Troubleshooting tips

**If macro syntax is incorrect:**

- Request valid Jinja/dbt macro syntax
- Ask for proper `{% macro %}` and `{% endmacro %}` tags

**If parameter handling is wrong:**

- Explicitly state parameter requirements: "threshold parameter with default value 1000"
- Specify type expectations if needed

**If null handling is missing:**

- Request explicit null checks: "Handle null revenue values"
- Specify default behavior for nulls

**If documentation is incomplete:**

- Ask for docstring format: "Include parameter descriptions"
- Request usage examples with different scenarios

## How to troubleshoot SQL errors using dbt Copilot

### Objectives

After completing this recipe, you'll be able to:

- Diagnose SQL errors effectively with Copilot
- Create minimal reproduction cases
- Identify and fix schema-related issues

### Use case

Analytics engineer Sam has a SQL query that's failing with a warehouse error. They need help understanding the error and finding the root cause.

### Prerequisites

- Access to dbt Copilot
- The failing SQL query
- Error message from the warehouse
- (Optional) Sample data or schema information

### Step-by-step instructions

#### Recipe: Decode the error

1. **Provide the failing SQL**
   - Include the complete query
   - Highlight the specific line or section causing issues

2. **Include the full warehouse error**
   - Copy the complete error message
   - Include line numbers if available

3. **Ask for explanation and fix**
   - Request a plain-language explanation
   - Ask for the smallest safe fix

#### Recipe: Minimal reproduction

1. **Provide sample data**
   - Include 5–10 representative rows
   - Only include columns that affect the failure

2. **Request reduced query**
   - Ask for a minimal query that still fails
   - Request explanation of root cause

#### Recipe: Align assumptions with schema

1. **Provide schema context**
   - Describe schema changes or fields that now contain nulls
   - Explain expected assumptions

2. **Request analysis**
   - Ask what assumptions broke
   - Request proposed guardrails (e.g., coalesce, validated join keys)

### Code snippets

**Example prompt for decoding errors:**

```text
I have this SQL query that's failing:

[Paste failing SQL]

The error message is:
[Paste error message]

Can you explain what's wrong in plain language and provide the smallest safe fix?
```

**Example prompt for minimal reproduction:**

```text
Here are 5 sample rows from my data:
[Paste sample rows]

This query fails:
[Paste failing query]

Can you create a minimal query that still fails and explain the root cause?
```

**Example prompt for schema alignment:**

```text
The `discount` column in `orders` now contains nulls, but my query assumes it's always a number.

Expected behavior: Calculate net_revenue = gross - discount

What assumptions broke and what guardrails should I add?
```

### Expected output

For error decoding:

- Plain-language explanation of the error
- Specific fix with minimal changes
- Explanation of why the fix works

For minimal reproduction:

- Reduced query that demonstrates the issue
- Root cause analysis
- Explanation of why it fails

For schema alignment:

- List of broken assumptions
- Proposed guardrails (e.g., `coalesce(discount, 0)`)
- Updated query with fixes

### Troubleshooting tips

**If Copilot doesn't understand the error:**

- Provide more context about your database (Snowflake, BigQuery, etc.)
- Include the exact error code if available
- Share relevant schema information

**If the fix doesn't work:**

- Ask Copilot to explain its reasoning
- Provide the new error message if the fix introduces new issues
- Request alternative approaches

**If root cause isn't clear:**

- Provide more sample data showing edge cases
- Include information about data types and constraints
- Ask for a step-by-step analysis

## How to troubleshoot macro issues using dbt Copilot

### Objectives

After completing this recipe, you'll be able to:

- Validate macro inputs and parameters
- Compare intended behavior with rendered SQL
- Fix quoting and whitespace issues
- Add proper documentation and tests

### Use case

Analytics engineer Taylor created a macro but it's not working as expected. The rendered SQL doesn't match their intent, and they need help debugging it.

### Prerequisites

- Access to dbt Copilot
- The macro code
- (Optional) The compiled/rendered SQL output
- (Optional) Error messages

### Step-by-step instructions

#### Recipe: Validate inputs

1. **Provide the macro code**
   - Include the complete macro definition
   - List current parameters

2. **Request validation**
   - Ask for required vs. optional parameters
   - Request reasonable defaults
   - Ask for error handling for edge cases

#### Recipe: Compare intent vs. rendered SQL

1. **Provide both macro and compiled SQL**
   - Include the macro definition
   - Include the compiled SQL output

2. **Request comparison**
   - Ask Copilot to highlight divergence
   - Request explanation of differences

#### Recipe: Sanitize quoting and whitespace

1. **Provide the macro code**
   - Include any identifier quoting
   - Show spacing and concatenation patterns

2. **Request inspection**
   - Ask Copilot to check quoting, spacing, and concatenation
   - Request fixes for any issues

#### Recipe: Add documentation and tests

1. **Provide the macro code**
   - Include current implementation
   - Explain intended use cases

2. **Request documentation**
   - Ask for docstring
   - Request usage examples
   - Ask for at least one success and one edge-case test

### Code snippets

**Example prompt for input validation:**

```text
I have this macro:

[Paste macro code]

Can you:
- Identify required vs. optional parameters
- Suggest reasonable defaults
- Add error handling for empty lists or nulls?
```

**Example prompt for comparing intent:**

```text
Here's my macro:
[Paste macro]

And here's the compiled SQL it produces:
[Paste compiled SQL]

Can you highlight where the rendered SQL diverges from my intent and explain why?
```

**Example prompt for sanitization:**

```text
Can you inspect this macro for identifier quoting, spacing, and concatenation issues?

[Paste macro code]
```

**Example prompt for documentation:**

```text
Can you add to this macro:
- A docstring
- Usage examples
- At least one success test and one edge-case test

[Paste macro code]
```

### Expected output

For input validation:

- List of required vs. optional parameters
- Suggested default values
- Error handling code for edge cases

For intent comparison:

- Highlighted differences between macro and compiled SQL
- Explanation of why divergence occurs
- Suggested fixes

For sanitization:

- Identified quoting issues
- Spacing and concatenation fixes
- Corrected macro code

For documentation:

- Complete docstring
- Multiple usage examples
- Test cases (success and edge cases)

### Troubleshooting tips

**If parameter validation is unclear:**

- Provide example inputs that should work
- Include example inputs that should fail
- Ask Copilot to explain validation logic

**If compiled SQL still doesn't match:**

- Provide more context about how the macro is called
- Include actual parameter values used
- Ask for step-by-step rendering explanation

**If quoting issues persist:**

- Specify your database (different databases have different quoting rules)
- Ask for database-specific quoting recommendations
- Request examples of correct vs. incorrect quoting

## Quick prompting checklist

Use this checklist to ensure your prompts include all necessary context:

- ✔ **Provide context**: Tables · columns · types · relationships · sample rows
- ✔ **Articulate the business question**: Focus on decision-making or the KPI behind the SQL
- ✔ **Specify output explicitly**: Columns · grain · ordering · format
- ✔ **Break down complex logic**: Use stepwise instructions
- ✔ **Add constraints and rules**: Filters · definitions · date grains
- ✔ **Use external assets**: Source-to-target maps · glossary definitions · sample data
- ✔ **After errors: include logs**: Warehouse error · failing line · compiled SQL

</div>
