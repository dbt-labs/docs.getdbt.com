---
title: "What is dbt?"
id: "introduction"
description: "dbt is the industry standard for data transformation."
pagination_next: null
pagination_prev: null
intro_text: "dbt transforms raw warehouse data into trusted data products. You write simple SQL select statements, and dbt handles the heavy lifting by creating modular, maintainable data models that power analytics, operations, and AI -- replacing the need for complex and fragile transformation code."
---


<Snippet path="what-is-dbt-intro" />


<Lightbox src="/img/docs/platform-overview.jpg" width="60%" title="dbt works alongside your ingestion, visualization, and other data tools, so you can transform data directly in your cloud data platform." />

Read more about why we want to enable analysts to work more like software engineers in [The dbt Viewpoint](/community/resources/viewpoint). Learn how other data practitioners around the world are using dbt by [joining the dbt Community](https://www.getdbt.com/community/join-the-community).

## dbt framework

import DbtFramework from '/snippets/_dbt-framework.md';

<DbtFramework />

### dbt Fusion engine

The <Constant name="fusion_engine" /> is a Rust-based engine that delivers a lightning-fast development experience, intelligent cost savings, and improved governance. <Constant name="fusion" /> understands SQL natively across multiple dialects, catches errors instantly, and optimizes how your models are built &mdash; bringing SQL comprehension and state awareness, instant feedback, <Term id="lsp"/>, and more to every dbt workflow.

<Constant name="fusion" /> powers dbt in the [<Constant name="dbt_platform" />](/docs/platform/about-platform/dbt-cloud-features), [VS Code / Cursor](/docs/about-dbt-extension), and [locally from the command line](/docs/local/install-dbt?version=2#get-started). You don't need to have a <Constant name="dbt_platform" /> project to use the <Constant name="fusion_engine" />.

For more information, refer to [About the <Constant name="fusion_engine" />](/docs/fusion), [supported features](/docs/fusion/supported-features), and the [get started with Fusion](/docs/fusion/get-started-fusion) pages.

### dbt Core engine

[<Constant name="core" />](/docs/local/install-dbt) is the open-source, Python-based engine that enables data practitioners to transform data. <Constant name="core" /> surfaces feedback when you run or build your project. It doesn't include <Constant name="fusion"/> features like the <Term id="lsp"/>, for example, which provides instant feedback as you type.

Learn more with the [quickstart for <Constant name="core" />](/guides/duckdb?step=1).

## How to use dbt

You can deploy dbt projects in different ways depending on your needs: 
- Using the [<Constant name="dbt_platform" />](#dbt-platform) (recommended for most users)
- [Locally from your command line or code editor](#dbt-local-development)

All ways support using the <Constant name="fusion_engine" /> or <Constant name="core" /> engine.

### dbt platform

The <Constant name="dbt_platform" /> offers the fastest, most reliable, and scalable way to deploy dbt. It can be powered by the <Constant name="fusion_engine" /> or <Constant name="core" /> engine, and provides a fully managed service with scheduling, CI/CD, documentation hosting, monitoring, development, and alerting through a web-based user interface (UI).

The <Constant name="dbt_platform" /> offers [multiple ways](/docs/platform/about-platform/dbt-cloud-features) to develop and collaborate on dbt projects:
- [Develop in your browser using the <Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio)
- [Seamless drag-and-drop development with <Constant name="canvas" />](/docs/platform/canvas)
- [Run dbt commands from your local command line](#dbt-local-development) using the dbt VS Code extension or <Constant name="platform_cli" /> (both which integrate seamlessly with the <Constant name="dbt_platform" /> project(s)).

Learn more about the [<Constant name="dbt_platform" /> features](/docs/platform/about-platform/dbt-cloud-features) and try one of the [<Constant name="dbt" /> Quickstarts](/guides).

You can learn about plans and pricing on [www.getdbt.com](https://www.getdbt.com/pricing/). 

### dbt local development

Use the dbt framework and develop dbt projects from your command line or code editor:

- [Install the dbt VS Code extension](/docs/about-dbt-extension) &mdash; Combines the <Constant name="fusion_engine" /> performance with visual features like autocomplete, inline errors, and lineage. Includes [<Term id="lsp" /> features](/docs/about-dbt-lsp) and suitable for users with <Constant name="dbt_platform"/> projects or running dbt locally without a <Constant name="dbt_platform" /> project. _Recommended for local development._
- [Install the Fusion CLI](/docs/local/install-dbt?version=2#get-started) &mdash; The <Constant name="fusion_engine" /> from the command line, but doesn't include <Term id="lsp" /> features.
- [Install the <Constant name="platform_cli" />](/docs/platform/cloud-cli-installation) &mdash; The <Constant name="dbt_platform" /> CLI, which allows you to run dbt commands against your <Constant name="dbt_platform" /> development environment from your local command line.
- [Install <Constant name="core" />](/docs/local/install-dbt) &mdash; The open-source, Python-based CLI that uses the <Constant name="core" /> engine. Doesn't include <Term id="lsp" /> features.

## Why use dbt

As a dbt user, your main focus will be on writing models (select queries) that reflect core business logic – there's no need to write boilerplate code to create tables and views, or to define the order of execution of your models. Instead, dbt handles turning these models into objects in your warehouse for you

- **No boilerplate** &mdash; Write business logic with just a SQL `select` statement or a Python DataFrame. dbt handles <Term id="materialization" />, transactions, <Term id="ddl" />, and schema changes.
- **Modular and reusable** &mdash; Build data models that can be referenced in subsequent work. Change a model once and the change propagates to all its dependencies, so you can publish canonical business logic without reimplementing it.
- **Fast builds** &mdash; Use [incremental models](/docs/build/incremental-models) and leverage metadata to optimize long-running models.
- **Tested and documented** &mdash; Write [data quality tests](/docs/build/data-tests) on your underlying data and auto-generate [documentation](/docs/build/documentation) alongside your code.
- **Software engineering workflows** &mdash; Version control, branching, pull requests, CI/CD, and [package management](/docs/build/packages) for your data pipelines. Write <Term id="dry" />er code with [macros](/docs/build/jinja-macros) and [hooks](/docs/build/hooks-operations).
- **State-aware orchestration** &mdash; Use the <Constant name="fusion_engine" /> to orchestrate your dbt projects and models with [state-awareness orchestration](/docs/deploy/state-aware-about), which automatically determines which models to build by detecting changes in code or data. This reduces runtime and costs by only building the models that have changed.

## Related docs

- [Quickstarts for dbt](/guides)
- [Best practice guides](/best-practices)
- [What is a dbt Project?](/docs/build/projects)
- [dbt run](/docs/running-a-dbt-project/run-your-dbt-projects)
