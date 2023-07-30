---
title: "Refactor an existing mart"
description: Getting started with the dbt Semantic Layer
displayText: "dbt Cloud Semantic Layer best practices"
hoverSnippet: Learn how to get started with the dbt Semantic Layer
---

## A new approach

We've covered the basics, now it's time to dig in to the fun and messy part: how do we refactor an existing mart in dbt into semantic models and metrics?

Let's look at the differences we can observe in how we might approach this with MetricFlow supercharging dbt versus how we work without a Semantic Layer. These differences can then inform our structure.

- 🍊 In dbt, we tend to create **highly denormalized datasets** that bring **everything you want around a certain entity or process into a single table**.
- 💜 The problem is, this **limits the dimensionality available to MetricFlow**. The more we pre-compute and 'freeze' into place, the less flexible our data is.
- 🚰 In MetricFlow, we ideally want **highly normalized**, star schema-like data that then allows MetricFlow to shine as a **denormalization engine**.
- ∞ Another way to think about this is that instead of moving down a list of requested priorities trying to pre-make as many combinations of our marts as possible — increasing lines of code and complexity — we can **let MetricFlow present every combination possible without specifically coding it**.
- 🏗️ To resolve these approaches optimally, we'll need to shift some **fundamental aspects of our modeling strategy**.

## Refactor steps outlined

We recommend an incremental implementation process that looks something like this:

1. 👉 Identify **an important output** (a revenue chart on a dashboard for example, and the mart model(s) that supplies this output.
2. 🔍 Examine all the **entities that are components** of this mart (for instance, an orders mart may include customers, shipping, and product data).
3. 🛠️ **Build semantic models and metrics** for all the required components.
4. 👯 Create a **clone of the output** on top of the Semantic Layer.
5. 💻 Audit to **ensure you get accurate outputs**.
6. 👉 Identify **any other outputs** that point to the mart and **move them to the Semantic Layer**.
7. ✌️ Put a **deprecation plan** in place for the mart.

You would then **continue this process** on other outputs and marts moving down a list of **priorities**. Each model as you go along will be faster and easier as you'll **reuse many of the same components** that will already have been semantically modeled.

## Let's refactor `orders`

So far we've been working in new pointing at a staging model to simplify things as we build new mental models for MetricFlow. In reality, unless you're implementing MetricFlow in a green-field dbt project, you probably are going to have some refactoring to do. So let's get into that in detail.

1. Per the above steps, we've identified our target, now we need to identify all the components we need, these will be all the 'import' CTEs at the top our mart. For orders this is: `orders`, `order_items`, `products`, `locations`, and `supplies`.
2. We'll next make semantic models for all of these. Let's walk through a straightforward conversion first with `locations`.
3. We'll want to first decide if we need to do any joining to get this into the shape we want for our semantic model. The biggest determinants of this are two factors:
   - Does this semantic model contain measures?
   - Does this semantic model have a primary timestamp?
   - If a semantic model has measures but no timestamp (for example, supplies in the example project, which has static costs of supplies), you'll likely want to sacrifice some normalization and join it on to another model that has a primary timestamp to allow for metric aggregation.
4. If we _don't_ need any joins, we'll just go straight to the staging model for our semantic model's `ref`. Locations is a purely dimensional table
5. Before we dive into implementing the refactor, lets use a new command `mf list dimensions` to check the dimensionality of our current mart for comparison to our refactor. We can use this to ensure we're **increasing the dimensionality as we refactor**, that's our goal.

## Checking your work

- We always will start our auditing with a `dbt parse && mf validate-configs` to ensure our code works before we examine its output.
- If we're working there, we'll move to trying out an `mf query` that replicates the logic of the output we're trying to refactor.
- For our example we want to audit monthly revenue, to do that we'd run the query below. You can [read more about the MetricFlow CLI](https://docs.getdbt.com/docs/build/metricflow-cli).

### Example query

```shell
mf query --metrics revenue --group-by metric_time__month
```

### Example query results

```shell
✔ Success 🦄 - query completed after 1.02 seconds
| METRIC_TIME__MONTH   |   REVENUE |
|:---------------------|----------:|
| 2016-09-01 00:00:00  |  17032.00 |
| 2016-10-01 00:00:00  |  20684.00 |
| 2016-11-01 00:00:00  |  26338.00 |
| 2016-12-01 00:00:00  |  10685.00 |
```
