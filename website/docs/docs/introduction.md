---
title: "What is dbt?"
id: "introduction"
description: "dbt is the industry standard for data transformation."
pagination_next: null
pagination_prev: null
intro_text: "dbt transforms raw warehouse data into trusted data products. You write simple SQL select statements, and dbt handles the heavy lifting by creating modular, maintainable data models that power analytics, operations, and AI, replacing the need for complex and fragile transformation code."
---

<Snippet path="what-is-dbt-intro" />

dbt brings software engineering best practices like version control, testing, modularity, CI/CD, and documentation to analytics workflows &mdash; helping teams build production-grade data pipelines backed by a 100,000+ member [community](/community/join). 

<Lightbox src="/img/docs/cloud-overview.jpg" width="60%" title="dbt works alongside your ingestion, visualization, and other data tools, so you can transform data directly in your cloud data platform." />

Read more about why we want to enable analysts to work more like software engineers in [The dbt Viewpoint](/community/resources/viewpoint). Learn how other data practitioners around the world are using dbt by [joining the dbt Community](https://www.getdbt.com/community/join-the-community).

## The dbt framework

Use the dbt framework to quickly and collaboratively transform data and deploy analytics code following software engineering best practices like version control, modularity, portability, CI/CD, and documentation. This means anyone on the data team comfortable with SQL can safely contribute to production-grade data pipelines.

The dbt framework is composed of a **language** and an **engine**:

- The dbt **language** is the code you write in your dbt project &mdash; SQL select statements, Jinja templating, YAML configs, and tests. It has become a standard for the data industry.

- The dbt **engine** compiles your project, executes your transformation graph, and produces metadata. dbt supports two engines: [dbt <Constant name="fusion" />](/docs/fusion) and [<Constant name="core" />](/docs/core/installation-overview).

### The dbt Fusion engine

The <Constant name="fusion_engine" /> is a fast, Rust-based engine that delivers a lightning-fast development experience, intelligent cost savings, and improved governance. Fusion understands SQL natively across multiple dialects, catches errors instantly, and optimizes how your models are built. The Fusion engine is the foundation for future investment and innovation in dbt.

Fusion powers dbt in the [<Constant name="dbt_platform" />](/docs/cloud/about-cloud/dbt-cloud-features), [VS Code / Cursor](/docs/about-dbt-extension), and [locally from the command line](/docs/fusion/install-fusion-cli). You do not need to have a <Constant name="dbt_platform" /> project to use <Constant name="fusion_engine" />.

For more information, refer to [About the <Constant name="fusion_engine" />](/docs/fusion), [supported features](/docs/fusion/supported-features), and the [get started with Fusion](/docs/fusion/get-started-fusion) page.

### dbt Core engine

[<Constant name="core" />](/docs/core/installation-overview) is the open-source, Python-based engine that has powered dbt for over a decade. dbt Labs continues to maintain and expand <Constant name="core" /> with new language features and community contributions. <Constant name="core" /> is suitable for users who prefer an open-source tool or have existing workflows built around it.

Learn more with the [quickstart for <Constant name="core" />](/guides/duckdb?step=1).

## How to use dbt
Use dbt to quickly and collaboratively transform data and deploy analytics code following software engineering best practices like version control, modularity, portability, CI/CD, and documentation. This means anyone on the data team comfortable with SQL can safely contribute to production-grade data pipelines.

### The dbt platform

The <Constant name="dbt_platform" /> offers the fastest, most reliable, and scalable way to deploy dbt. It runs either the Fusion engine or <Constant name="core" />, and provides a fully managed service with scheduling, CI/CD, documentation hosting, monitoring, and alerting through a web-based user interface (UI).

You can learn about plans and pricing on [www.getdbt.com](https://www.getdbt.com/pricing/). Learn more about the [<Constant name="dbt_platform" /> features](/docs/cloud/about-cloud/dbt-cloud-features) and try one of the [<Constant name="cloud" /> quickstarts](/docs/get-started-dbt).

### Local development

Use the dbt framework and develop dbt projects from your command line or code editor:

- [Install the dbt VS Code extension](/docs/about-dbt-extension) &mdash; Combines <Constant name="fusion_engine" /> performance with visual features like autocomplete, inline errors, and lineage. Includes <Term id="lsp" /> features and suitable for users with <Constant name="dbt_platform"/> projects or running dbt locally without a <Constant name="dbt_platform" /> project. _Recommended for local development._
- [Install the Fusion CLI](/docs/fusion/install-fusion-cli) &mdash; <Constant name="fusion_engine" /> from the command line, but doesn't include <Term id="lsp" /> features.
- [Install <Constant name="core" />](/docs/core/installation-overview) &mdash; The open-source, Python-based CLI. Doesn't include <Term id="lsp" /> features.

## Why use dbt

As a dbt user, your main focus will be on writing models (select queries) that reflect core business logic – there's no need to write boilerplate code to create tables and views, or to define the order of execution of your models. Instead, dbt handles turning these models into objects in your warehouse for you.

- **No boilerplate** &mdash; Write business logic with just a SQL `select` statement or a Python DataFrame. dbt handles <Term id="materialization" />, transactions, <Term id="ddl" />, and schema changes.
- **Modular and reusable** &mdash; Build data models that can be referenced in subsequent work. Change a model once and the change propagates to all its dependencies, so you can publish canonical business logic without reimplementing it.
- **Fast builds** &mdash; Use [incremental models](/docs/build/incremental-models) and leverage metadata to optimize long-running models.
- **Tested and documented** &mdash; Write [data quality tests](/docs/build/data-tests) on your underlying data and auto-generate [documentation](/docs/build/documentation) alongside your code.
- **Software engineering workflows** &mdash; Version control, branching, pull requests, CI/CD, and [package management](/docs/build/packages) for your data pipelines. Write <Term id="dry" />er code with [macros](/docs/build/jinja-macros) and [hooks](/docs/build/hooks-operations).

Here are some key dbt user features that make it a powerful tool for data transformation:

| Feature               | Description |
|-----------------------|-------------|
| Handle boilerplate code to materialize queries as relations | For each model you create, you can easily configure a *materialization*. A materialization represents a build strategy for your select query – the code behind a materialization is robust, boilerplate SQL that wraps your select query in a statement to create a new, or update an existing, relation. Read more about [Materializations](/docs/build/materializations).|
| Use a code compiler | SQL files can contain Jinja, a lightweight templating language. Using Jinja in SQL provides a way to use control structures in your queries. For example, `if` statements and `for` loops. It also enables repeated SQL to be shared through `macros`. Read more about [Macros](/docs/build/jinja-macros).|
| Determine the order of model execution | Often, when transforming data, it makes sense to do so in a staged approach. dbt provides a mechanism to implement transformations in stages through the [ref function](/reference/dbt-jinja-functions/ref). Rather than selecting from existing tables and views in your warehouse, you can select from another model.|
| Document your dbt project | In the <Constant name="dbt_platform" />, you can auto-generate the documentation when your dbt project runs. dbt provides a mechanism to write, version-control, and share documentation for your dbt models. You can write descriptions (in plain text or markdown) for each model and field. Read more about the [Documentation](/docs/build/documentation).|
| Test your models |   Tests provide a way to improve the integrity of the SQL in each model by making assertions about the results generated by a model. Build, test, and run your project with a button click or by using the [<Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-in-studio) command bar. Read more about writing tests for your models [Testing](/docs/build/data-tests)|
| Manage packages | dbt ships with a package manager, which allows analysts to use and publish both public and private repositories of dbt code which can then be referenced by others. Read more about [Package Management](/docs/build/packages). |
| Load seed files| Often in analytics, raw values need to be mapped to a more readable value (for example, converting a country-code to a country name) or enriched with static or infrequently changing data. These data sources, known as seed files, can be saved as a CSV file in your `project` and loaded into your data warehouse using the `seed` command. Read more about [Seeds](/docs/build/seeds).|
| Snapshot data | Often, records in a data source are mutable, in that they change over time. This can be difficult to handle in analytics if you want to reconstruct historic values. dbt provides a mechanism to snapshot raw data for a point in time, through use of [snapshots](/docs/build/snapshots).|

## Related docs

- [Quickstarts for dbt](/guides)
- [Best practice guides](/best-practices)
- [What is a dbt Project?](/docs/build/projects)
- [dbt run](/docs/running-a-dbt-project/run-your-dbt-projects)
