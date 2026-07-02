---
title: "What is dbt?"
id: "introduction"
description: "dbt transforms raw warehouse data into trusted data products and brings purpose-built AI to every stage of the analytics development lifecycle."
pagination_next: null
pagination_prev: null
intro_text: "dbt is the industry standard for data transformation. Write SQL select statements; dbt handles the rest — materializing models, managing dependencies, testing data quality, and generating documentation — so your team ships trusted data products faster."
---

<Snippet path="what-is-dbt-intro" />

<Lightbox src="/img/docs/platform-overview.jpg" width="60%" title="dbt works alongside your ingestion, visualization, and other data tools, so you can transform data directly in your cloud data platform." />

Read more about why we want to enable analysts to work more like software engineers in [The dbt Viewpoint](/community/resources/viewpoint). Learn how other data practitioners around the world are using dbt by [joining the dbt Community](https://www.getdbt.com/community/join-the-community).

## dbt framework

import DbtFramework from '/snippets/_dbt-framework.md';

<DbtFramework />

- [**<Constant name="fusion_engine" />**](/docs/fusion) &mdash; A Rust-based engine with native SQL comprehension, instant error feedback, <Term id="lsp"/> support, and state-aware orchestration. Powers dbt in the <Constant name="dbt_platform" />, VS Code / Cursor, and locally from the command line.
- [**<Constant name="core_v1" />**](/docs/local/install-dbt) &mdash; The open-source, Python-based engine. Surfaces feedback when you run or build your project; doesn't include LSP features.
- [**<Constant name="core_v2" />**](/docs/dbt-versions/core-upgrade/upgrading-to-v2) &mdash; The open-source foundation the <Constant name="fusion_engine" /> builds on, delivering a faster Rust-based runtime while preserving the familiar dbt experience. Currently in alpha.

## How to use dbt

You can use dbt in different ways depending on your needs:

- Using the [<Constant name="dbt_platform" />](#dbt-platform) (recommended for most users)
- [Locally from your command line or code editor](#dbt-local-development)
- [With <Constant name="wizard" />](#dbt-wizard) for agentic governed data development in dbt
All options support using the <Constant name="fusion_engine" /> or <Constant name="core" /> engine.

### dbt platform

The <Constant name="dbt_platform" /> offers the fastest, most reliable, and scalable way to deploy dbt. It can be powered by the <Constant name="fusion_engine" /> or <Constant name="core" /> engine, and provides a fully managed service with scheduling, CI/CD, documentation hosting, monitoring, development, and alerting through a web-based user interface (UI).

The <Constant name="dbt_platform" /> offers [multiple ways](/docs/platform/about-platform/dbt-platform-features) to develop and collaborate on dbt projects:
- [Develop in your browser using the <Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio)
- [Seamless drag-and-drop development with <Constant name="canvas" />](/docs/platform/canvas)
- [Run dbt commands from your local command line](#dbt-local-development) using the dbt VS Code extension or <Constant name="platform_cli" /> (both which integrate seamlessly with the <Constant name="dbt_platform" /> project(s)).

Learn more about the [<Constant name="dbt_platform" /> features](/docs/platform/about-platform/dbt-platform-features) and try one of the [<Constant name="dbt" /> Quickstarts](/guides).

You can learn about plans and pricing on [www.getdbt.com](https://www.getdbt.com/pricing/).

### dbt local development

Use the dbt framework and develop dbt projects from your command line or code editor:

- [Install the dbt VS Code extension](/docs/about-dbt-extension) &mdash; Combines the <Constant name="fusion_engine" /> performance with visual features like autocomplete, inline errors, and lineage. Includes [<Term id="lsp" /> features](/docs/about-dbt-lsp) and suitable for users with <Constant name="dbt_platform"/> projects or running dbt locally without a <Constant name="dbt_platform" /> project. _Recommended for local development._
- [Install the <Constant name="fusion" /> CLI](/docs/local/install-dbt?version=2) &mdash; The <Constant name="fusion_engine" /> from the command line, but doesn't include <Term id="lsp" /> features.
- [Install the <Constant name="platform_cli" />](/docs/platform/dbt-cli-installation) &mdash; The <Constant name="dbt_platform" /> CLI, which allows you to run dbt commands against your <Constant name="dbt_platform" /> development environment from your local command line.
- [Install <Constant name="core" />](/docs/local/install-dbt) &mdash; The open-source, Python-based CLI that uses the <Constant name="core_v1" /> engine. Doesn't include <Term id="lsp" /> features.

### dbt Wizard

<Constant name="wizard" /> is an AI agent purpose-built for governed data development in dbt &mdash; not just code generation, but the entire development lifecycle: investigating, building, validating, and shipping. 

It's grounded in your dbt project's structured context through a [native metadata engine](/docs/dbt-ai/wizard-how-it-works#native-metadata-engine) that gives the agent high-precision access to your full project graph, including lineage, tests, contracts, and metric definitions. The context is like a map of your city: <Constant name="wizard" /> knows how everything connects before it starts, rather than walking every street to figure out the layout.

<Constant name="wizard" /> is different from coding agents in that it _validates_ its own work against your project before you see the final diff, coordinates multi-file changes (rename a model and the refs follow), and ships with governance and audit trails on by default &mdash; nothing to configure or maintain.

<Constant name="wizard" /> is available in two surfaces:

- **In the <Constant name="dbt_platform" />**: Available as a dedicated workspace and embedded in [<Constant name="studio_ide" />](/docs/dbt-ai/wizard-ide) for development. 
- **From your terminal**: [<Constant name="wizard" /> CLI](/docs/dbt-ai/about-dbt-wizard-cli) is a terminal-native agent for local development, with or without a <Constant name="dbt_platform" /> account.

Learn more about [<Constant name="wizard" />](/docs/platform/wizard-overview) and its [key capabilities](/docs/dbt-ai/about-dbt-ai).

## Why use dbt

As a dbt user, your main focus will be on writing models (select queries) that reflect core business logic – there's no need to write boilerplate code to create tables and views, or to define the order of execution of your models. Instead, dbt handles turning these models into objects in your warehouse for you.

- **No boilerplate**: Write business logic with just a SQL `select` statement or a Python DataFrame. dbt handles <Term id="materialization" />, transactions, <Term id="ddl" />, and schema changes.
- **Modular and reusable**: Build data models that can be referenced in subsequent work. Change a model once and the change propagates to all its dependencies, so you can publish canonical business logic without reimplementing it.
- **Fast builds**: Use [incremental models](/docs/build/incremental-models) and leverage metadata to optimize long-running models.
- **Tested and documented** &mdash; Write [data quality tests](/docs/build/data-tests) on your underlying data and auto-generate [documentation](/docs/build/documentation) alongside your code.
- **Software engineering workflows**: Version control, branching, pull requests, CI/CD, and [package management](/docs/build/packages) for your data pipelines. Write <Term id="dry" />er code with [macros](/docs/build/jinja-macros) and [hooks](/docs/build/hooks-operations).
- **State-aware orchestration**: Use the <Constant name="fusion_engine" /> to orchestrate your dbt projects and models with [state-awareness orchestration](/docs/deploy/state-aware-about), which automatically determines which models to build by detecting changes in code or data. This reduces runtime and costs by only building the models that have changed.
- **AI-powered development**: Use [<Constant name="wizard" />](/docs/platform/wizard-overview) to investigate, build, validate, and ship from natural language. <Constant name="wizard" /> is grounded in your project's full context, validates its own work against lineage and tests, and includes governance and audit trails by default.

## Related docs

- [Quickstarts for dbt](/guides)
- [Best practice guides](/best-practices)
- [What is a dbt project?](/docs/build/projects)
- [dbt run](/docs/running-a-dbt-project/run-your-dbt-projects)
- [<Constant name="wizard" /> overview](/docs/platform/wizard-overview)
- [AI and agents](/docs/dbt-ai/about-dbt-ai)
- [dbt MCP server](/docs/dbt-ai/about-mcp)
