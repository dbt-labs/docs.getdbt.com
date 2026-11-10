---
title: "Analyze your data in dbt"
id: "analyze-your-data"
icon: 'dbt'
hide_table_of_contents: true
tags: ['Analyst', 'dbt platform', 'Quickstart']
intro_text: "Start with a stakeholder question and analyze the data to answer that question without writing any SQL"
recently_updated: true
---

## Introduction

As a data analyst, you play a key role in transforming complex data into trusted, actionable insights for your team. With <Constant name="dbt" />, you can use built-in, AI-powered tools to build governed data models, explore how they’re built, and even run your own analysis.

In this quickstart, you’ll learn how to:

* Use <Constant name="catalog" /> to browse and understand data models across both dbt and Snowflake data assets
* Use <Constant name="canvas" /> to visually build your own data models
* Build confidence using <Constant name="dbt" /> as your workspace enhanced with AI

Here's more about the tools you will use on your journey:
* <Constant name="catalog" />: View your project's resources (such as models, tests, and metrics), their lineage, and query patterns to gain a better understanding of its latest production state.
* <Constant name="canvas" />: Quickly access and transform data through a visual, drag-and-drop experience and with a built-in AI for custom code generation.


## Prerequisites

Before you begin, make sure:

* You have access to and credentials configured for a <Constant name="dbt" /> project
* Your team has already run a successful dbt job, so models are built and ready
* You have a a git provider connected and authenticated

## Analyst workflows

Kimiko, an analyst at the Jaffle Shop, notices they've been doing a lot of new sales and wants to investigate the most critical data they have in their warehouse.

**Question: A stakeholder is curious how many customers you've acquired month by month, in the last 12 months.**

Kimiko wonders, "How do I find data in our project that will help me answer their question?"

### Explore a stakeholder question

She navigates to the data catalog, <Constant name="catalog" />, by signing into <Constant name="dbt" /> and clicking <Constant name="catalog" /> in the left panel. Because the question was about customers, Kimiko begins by searching for "customers" in <Constant name="catalog" />:

<Lightbox src="/img/guides/analyst-qs/catalog-search.png" width="90%" title="Catalog search for customers" />

She finds a "customers" model, which might be what she needs. She clicks **customers** to open the model. The description reads, “Customer overview data Mart offering key details for each unique customer, one row per customer.”

Next, Kimiko selects **Columns** to see which columns this model uses. 

<Lightbox src="/img/guides/analyst-qs/columns.png" width="90%" title="Columns in customers table" />

She notices these columns: `customer_ID`, `customer_names`, and `first_ordered_at`. 

The `first_ordered_at` column stands out to Kimiko, and she wonders if she might use it to see how many customers they've acquired based on when they placed their first order.

### Visualize results

Kimiko wants to answer the stakeholder's question by building on the `customers` model, and she wants to share the result with her team so they don't repeat the same one-off work. To do this, she turns her analysis into a full-fledged dbt model using <Constant name="canvas" />. From the **Customer model page** in <Constant name="catalog" />, she selects **Develop** then **Develop in** <Constant name="canvas" />. This opens the model in a visual form, represented in a DAG.


She adds steps to filter for 2024, show dates by month, and aggregate new customers over that month. She runs it in her development environment and clicks **Commit** to submit a pull request. 



Now Kimiko's entire team, those who have the same access as her, can run this model and see the same results she does! What's more is they can help her improve the model as the stakeholder requests get more complicated, and she will benefit from their help.

### The query becomes a model

Going forward, Kimiko is able to return to her project in <Constant name="catalog" /> and run the model to get the most current results. From here, she can:

* Manually run the model, which also runs tests and is versioned so Kimiko can track changes over time
* Trigger a scheduled job to run the dbt model, like every Monday for her stakeholder report
* Set up a Slack notification in case the job fails so she can rectify any problems

