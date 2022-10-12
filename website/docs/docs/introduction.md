---
title: "What is dbt?"
id: "introduction"
---

## About dbt

dbt is a transformation workflow that helps you get more work done while producing higher quality results. You can use dbt to modularize and centralize your analytics code, while also providing your data team with guardrails typically found in software engineering workflows. Collaborate on data models, version them, and test and document your queries before safely deploying them to production, with monitoring and visibility.

dbt compiles and runs your analytics code against your data platform, enabling you and your team to collaborate on a single source of truth for metrics, insights, and business definitions. This single source of truth, combined with the ability to define tests for your data, reduces errors when logic changes, and alerts you when issues arise.

To read more about why we want to enable analysts to work more like software engineers, check out our [The dbt Viewpoint](/community/resources/viewpoint).

## dbt optimizes your workflow

- Avoid writing boilerplate <Term id="dml" /> and <Term id="ddl" /> by managing transactions, dropping tables, and managing schema changes. Write business logic with just a SQL `select` statement that returns the dataset you need, and dbt takes care of <Term id="materialization" />.
- Build up reusable, or modular, data models that can be referenced in subsequent work instead of starting at the raw data with every analysis.
- Dramatically reduce the time your queries take to run: Leverage metadata to find long-running models that you want to optimize and use [incremental models](/docs/build/incremental-models) which dbt makes easy to configure and use.
- Write <Term id="dry" />er code by leveraging [macros](/docs/build/jinja-macros), [hooks](/docs/build/hooks-operations), and [package management](/docs/build/packages).

## dbt provides more reliable analysis

- No longer copy and paste SQL, which can lead to errors when logic changes. Instead, build reusable data models that get pulled into subsequent models and analysis. Change a model once and that change will propagate to all its dependencies.
- Publish the canonical version of a particular data model, encapsulating all complex business logic. All analysis on top of this model will incorporate the same business logic without needing to reimplement it.
- Use mature source control processes like branching, pull requests, and code reviews.
- Write data quality tests quickly and easily on the underlying data. Many analytic errors are caused by edge cases in the data: testing helps analysts find and handle those edge cases.

## dbt products

You can access dbt using dbt Core or dbt Cloud. dbt Cloud is built around dbt Core, but it also provides:

- Web-based UI so it’s more accessible
- Hosted environment so it’s faster to get up and running
- Differentiated features, such as metadata, in-app job scheduler, observability, integrations with other tools, integrated development environment (IDE), and more.

You can learn about plans and pricing on [www.getdbt.com]([https://www.getdbt.com/pricing/](https://www.getdbt.com/pricing/)).

### dbt Cloud

dbt Cloud is the fastest and most reliable way to deploy dbt. Develop, test, schedule, and investigate data models all in one web-based UI. Read more about [Getting started with dbt Cloud](/docs/get-started/getting-started/set-up-dbt-cloud) and [dbt Cloud features](/docs/get-started/getting-started/dbt-cloud-features).

### dbt Core

dbt Core is an open-source tool that enables data teams to transform data using analytics engineering best practices. You can install and use dbt Core on the command line. Read more about [Getting started with dbt Core](/docs/get-started/getting-started-dbt-core).

## The power of dbt

As a dbt user, your main focus will be on writing models (i.e. select queries) that reflect core business logic – there’s no need to write boilerplate code to create tables and views, or to define the order of execution of your models. Instead, dbt handles turning these models into objects in your warehouse for you.

| Feature | Description |
|-----------|--------------|
| Handles boilerplate code to materialize queries as relations |For each model you create, you can easily configure a *materialization*. A materialization represents a build strategy for your select query – the code behind a materialization is robust, boilerplate SQL that wraps your select query in a statement to create a new, or update an existing, relation. Read more about [Materializations](/docs/build/materializations).|
| Provides a code compiler | SQL files can contain Jinja, a lightweight templating language. Using Jinja in SQL provides a way to use control structures in your queries. For example, `if` statements and `for` loops. It also enables repeated SQL to be shared through `macros`. Read more about [Macros](/docs/build/jinja-macros).|
|-----------|--------------|

### Related docs

- [Getting started with dbt Cloud](/docs/get-started/getting-started/set-up-dbt-cloud)
- [Getting started with dbt Core](/docs/get-started/getting-started-dbt-core)
- [Best practice guides](/guides/best-practices)
- [What is a dbt Project?](/docs/build/projects)
- [dbt run](/docs/get-started/run-your-dbt-projects)
