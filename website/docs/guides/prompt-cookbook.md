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

This is a practical cookbook for getting consistent, high-quality results.

## Overview

<Constant name="copilot" /> is a context-aware AI assistant that accelerates development by generating SQL, YAML, documentation, tests, semantic models, and macro scaffolding based on your dbt project’s metadata.

However, like any AI system, the quality of Copilot’s output depends heavily on the quality of your prompts. This cookbook provides clear prompting recipes, example patterns, and troubleshooting steps to help analytics engineers get reliable results—and to set accurate expectations about what Copilot and the MCP server can and cannot do.

## Core principles of effective prompting

<Constant name="copilot" /> performs best when it understands:

- Table names
- Column types and meanings
- Relationships (like `orders.customer_id → customers.customer_id`)
- Example values or edge cases

Why this matters:
It gives Copilot a map, so it doesn’t need to guess unfamiliar connections.

Example:
Let’s take analytics engineer Santi, who is preparing a query using orders and customers.
A strong prompt would include:

"created_at is a timestamp"

"status can be active or pending"

"orders.customer_id joins to customers.customer_id"

1.2 State the Business Question, Not Just the Output

(Slides p.15–18) 

Accelerating Development with d…

Instead of requesting generic SQL:

“Write a query using table X.”

Explain why you need the query:

“Count active users per week to analyze engagement trends.”

Why this matters:
Copilot anchors its logic to the decision or KPI you care about, reducing ambiguity.

1.3 Be Clear and Explicit About Expected Output

(Slides p.16) 

Accelerating Development with d…

Specify:

Required output columns

Filters, ordering, or grain

Format expectations (e.g., percentages, date truncation)

Multi-step logic in sequence

Example:
For Kimiko producing a weekly fitness challenge metric:

"week_start, active_participants, engagement_rate"

“Sorted ascending by week”

“Show upgrade rate as a percentage”

1.4 Use External Assets to Strengthen Results

(Slides p.23–26) 

Accelerating Development with d…

Copilot improves significantly when you include:

KPI definitions & business logic

Small, representative sample data (“swatches, not the whole fabric roll”)

Source-to-target mappings

Upstream documentation

Example:
A clear rule like “Active customer = ≥1 paid purchase in last 90 days, excluding refunds” leads to consistent SQL and semantic model generation.

1. Prompting Recipes

This section gives reusable prompting patterns.

2.1 SQL Generation Recipe

When to use: drafting or refactoring SQL queries.

Ingredients

Table names and join keys

Column meanings

Business objective

Explicit output structure

Instructions

Start by listing the tables and column information.

Describe the business question.

Specify the exact columns and grain.

Add rules, filters, or edge conditions.

Example

Let’s take analytics engineer Santi analyzing engagement:

We have two tables:

orders(order_id, customer_id, order_date, gross, discount, returned)
customers(customer_id, created_at, status)

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

2.2 Model Skeleton Creation Recipe

(Slides p.27) 

Accelerating Development with d…

When to use: jump-starting new models.

Ingredients

Source tables

Minimal required fields

Basic transformation logic

Temporary filters (e.g., preview ranges)

Example
Using stg_orders and dim_customers:

Draft a minimal model containing:
- order_id
- customer_id
- order_date
- net_revenue = gross - coalesce(discount, 0)

Join on customer_id.
Filter to last 30 days for preview only.

Return a SQL skeleton plus a short comment block describing assumptions.

2.3 Semantic Model / Metrics Recipe
Ingredients

Measures and dimensions

Grain definitions

Calculation rules

Example
Create a semantic model for monthly revenue per customer using the `orders` model.

Columns available:
order_date, gross, discount, customer_id

Define:
- measure: net_revenue = gross - coalesce(discount, 0)
- dimension: customer_id
- time dimension: order_date (month grain)

Return valid YAML and include field descriptions.

2.4 Macro Creation Recipe

(Slides p.34–36) 

Accelerating Development with d…

Ingredients

Repetitive logic or CASE patterns

Parameters and defaults

Desired edge-case handling

Documentation expectations

Example
Turn this CASE logic into a reusable macro.
Include:
- a parameter for threshold
- safe handling of nulls
- a docstring with parameter descriptions
- one usage example

3. Troubleshooting with Copilot

Copilot helps diagnose SQL and Jinja issues when provided with complete context.
(Slides p.42–48) 

Accelerating Development with d…

3.1 Troubleshooting SQL
Recipe: Decode the Error

Provide:

The failing SQL

The full warehouse error

The line number or job log snippet

Ask for:

A plain-language explanation

The smallest safe fix

Recipe: Minimal Reproduction

(Slide p.46)

Provide:

5–10 representative rows

Only columns that affect the failure

Ask for:

A reduced query that still fails

Explanation of the root cause

Recipe: Align Assumptions with Schema

(Slide p.47)

Provide:

Schema changes or fields that now contain nulls

Expected assumptions

Ask for:

What assumptions broke

Proposed guardrails (e.g., coalesce, validated join keys)

3.2 Troubleshooting Macros

(Slides p.51–56)

Recipe: Validate Inputs

Ask for:

Required vs. optional parameters

Reasonable defaults

Error handling for empty lists or nulls

Recipe: Compare Intent vs. Rendered SQL

Provide both the macro and the compiled SQL, and ask Copilot to highlight divergence.

Recipe: Sanitize Quoting and Whitespace

Ask Copilot to inspect identifier quoting, spacing, and concatenation.

Recipe: Add Documentation & Tests

Ask Copilot to draft:

a docstring

usage examples

at least one success and one edge-case test

4. Quick Prompting Checklist
✔ Provide context

Tables · columns · types · relationships · sample rows

✔ Articulate the business question

Focus on decision-making or the KPI behind the SQL

✔ Specify output explicitly

Columns · grain · ordering · format

✔ Break down complex logic

Use stepwise instructions

✔ Add constraints and rules

Filters · definitions · date grains

✔ Use external assets

Source-to-target maps · glossary definitions · sample data

✔ After errors: include logs

Warehouse error · failing line · compiled SQL

5. Quick Examples for Docs
Example A — SQL Analysis Scenario

“Let’s take analytics engineer Santi working on weekly engagement.
He provides table relationships, column meanings, and a clear business objective.
Copilot returns a correct weekly aggregated query because the prompt specifies output columns, grain, and logic.”

Example B — Documentation & Semantic Model Scenario

“Let’s take analytics engineer Kimiko enriching an orders_enriched model.
She includes business rules (exclude returned orders) and asks Copilot for YAML plus documentation.
Copilot produces consistent semantic model definitions aligned with team KPIs.”

</div>
