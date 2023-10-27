---
title: "Materializations best practices"
id: materializations-guide-1-guide-overview
slug: 1-guide-overview
description: Read this guide to understand how using materializations in dbt is a crucial skill for effective analytics engineering.
displayText: Materializations best practices
hoverSnippet: Read this guide to understand how using materializations in dbt is a crucial skill for effective analytics engineering.
---

What _really_ happens when you type `dbt build`? Contrary to popular belief, a crack team of microscopic data elves do _not_ construct your data row by row, although the truth feels equally magical. This guide explores the real answer to that question, with an introductory look at the objects that get built into your warehouse, why they matter, and how dbt knows what to build.

The configurations that tell dbt how to construct these objects are called _materializations,_ and knowing how to use them is a crucial skill for effective analytics engineering. When you’ve completed this guide, you will have that ability to use the three core materializations that cover most common analytics engineering situations.

:::info
😌 **Materializations abstract away DDL and DML**. Typically in raw SQL- or python-based [data transformation](https://www.getdbt.com/analytics-engineering/transformation/), you have to write specific imperative instructions on how to build or modify your data objects. dbt’s materializations make this declarative, we tell dbt how we want things to be constructed and it figures out how to do that given the unique conditions and qualities of our warehouse.
:::

### Learning goals

By the end of this guide you should have a solid understanding of:

- 🛠️ what **materializations** are
- 👨‍👨‍👧 how the three main materializations that ship with dbt — **table**, **view**, and **incremental** — differ
- 🗺️ **when** and **where** to use specific materializations to optimize your development and production builds
- ⚙️ how to **configure materializations** at various scopes, from an individual model to entire folder

### Prerequisites

- 📒 You’ll want to have worked through the [quickstart guide](/guides) and have a project setup to work through these concepts.
- 🏃🏻‍♀️ Concepts like dbt runs, `ref()` statements, and models should be familiar to you.
- 🔧 [**Optional**] Reading through the [How we structure our dbt projects](guides/best-practices/how-we-structure/1-guide-overview) Guide will be beneficial for the last section of this guide, when we review best practices for materializations using the dbt project approach of staging models and marts.

### Guiding principle

We’ll explore this in-depth throughout, but the basic guideline is **start as simple as possible**. We’ll follow a tiered approached, only moving up a tier when it’s necessary.

- 🔍 **Start with a view.** When the view gets too long to _query_ for end users,
- ⚒️ **Make it a table.** When the table gets too long to _build_ in your dbt Jobs,
- 📚 **Build it incrementally.** That is, layer the data on in chunks as it comes in.
