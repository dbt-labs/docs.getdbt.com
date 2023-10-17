---
title: "What is dbt?"
id: "introduction"
pagination_next: null
pagination_prev: null
---

<Snippet path="what-is-dbt-intro" />

dbt compiles and runs your analytics code against your data platform, enabling you and your team to collaborate on a single source of truth for metrics, insights, and business definitions. This single source of truth, combined with the ability to define tests for your data, reduces errors when logic changes, and alerts you when issues arise.

Read more about why we want to enable analysts to work more like software engineers in [The dbt Viewpoint](/community/resources/viewpoint).

## dbt optimizes your workflow

- Avoid writing boilerplate <Term id="dml" /> and <Term id="ddl" /> by managing transactions, dropping tables, and managing schema changes. Write business logic with just a SQL `select` statement, or a Python DataFrame, that returns the dataset you need, and dbt takes care of <Term id="materialization" />.
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
- dbt Cloud-powered command line (CLI) to develop, test, version control dbt projects, and run dbt commands
- Hosted environment so it’s faster to get up and running
- Differentiated features, such as metadata, in-app job scheduler, observability, integrations with other tools, integrated development environment (IDE), and more.

You can learn about plans and pricing on [www.getdbt.com](https://www.getdbt.com/pricing/).

### dbt Cloud

dbt Cloud is the fastest and most reliable way to deploy dbt. Develop, test, schedule, and investigate data models all in one web-based UI. It also natively supports developing using a command line with the [dbt Cloud CLI](/docs/cloud/cloud-cli-installation).
Learn more about [dbt Cloud features](/docs/cloud/about-cloud/dbt-cloud-features) and try one of the [dbt Cloud quickstarts](/quickstarts).

### dbt Core

dbt Core is an open-source tool that enables data teams to transform data using analytics engineering best practices. You can install and use dbt Core on the command line. Learn more with the [quickstart for dbt Core](/quickstarts/codespace).

## The power of dbt

As a dbt user, your main focus will be on writing models (i.e. select queries) that reflect core business logic – there’s no need to write boilerplate code to create tables and views, or to define the order of execution of your models. Instead, dbt handles turning these models into objects in your warehouse for you.

| Feature               | Description |
|-----------------------|-------------|
| Handle boilerplate code to materialize queries as relations | For each model you create, you can easily configure a *materialization*. A materialization represents a build strategy for your select query – the code behind a materialization is robust, boilerplate SQL that wraps your select query in a statement to create a new, or update an existing, relation. Read more about [Materializations](/docs/build/materializations).|
| Use a code compiler | SQL files can contain Jinja, a lightweight templating language. Using Jinja in SQL provides a way to use control structures in your queries. For example, `if` statements and `for` loops. It also enables repeated SQL to be shared through `macros`. Read more about [Macros](/docs/build/jinja-macros).|
| Determine the order of model execution | Often, when transforming data, it makes sense to do so in a staged approach. dbt provides a mechanism to implement transformations in stages through the [ref function](/reference/dbt-jinja-functions/ref). Rather than selecting from existing tables and views in your warehouse, you can select from another model.|
| Document your dbt project | dbt provides a mechanism to write, version-control, and share documentation for your dbt models. You can write descriptions (in plain text or markdown) for each model and field. In dbt Cloud, you can auto-generate the documentation when your dbt project runs. Read more about the [Documentation](/docs/collaborate/documentation).|
| Test your models |  Tests provide a way to improve the integrity of the SQL in each model by making assertions about the results generated by a model. Read more about writing tests for your models [Testing](/docs/build/tests)|
| Manage packages | dbt ships with a package manager, which allows analysts to use and publish both public and private repositories of dbt code which can then be referenced by others. Read more about [Package Management](/docs/build/packages). |
| Load seed files| Often in analytics, raw values need to be mapped to a more readable value (for example, converting a country-code to a country name) or enriched with static or infrequently changing data. These data sources, known as seed files, can be saved as a CSV file in your `project` and loaded into your data warehouse using the `seed` command. Read more about [Seeds](/docs/build/seeds).|
| Snapshot data | Often, records in a data source are mutable, in that they change over time. This can be difficult to handle in analytics if you want to reconstruct historic values. dbt provides a mechanism to snapshot raw data for a point in time, through use of [snapshots](/docs/build/snapshots).|

### Related docs

- [Quickstarts for dbt](/quickstarts)
- [Best practice guides](/guides/best-practices)
- [What is a dbt Project?](/docs/build/projects)
- [dbt run](/docs/running-a-dbt-project/run-your-dbt-projects)
