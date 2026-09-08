---
title: "What is dbt?"
id: "introduction"
sidebar_label: "About dbt"
description: "dbt transforms raw warehouse data into trusted data products and brings purpose-built AI to every stage of the analytics development lifecycle."
pagination_next: null
pagination_prev: null
intro_text: "dbt transforms raw warehouse data into trusted data products. You write simple SQL select statements, and dbt handles the heavy lifting by creating modular, maintainable data models that power analytics, operations, and AI -- replacing the need for complex and fragile transformation code."
availability: all_users
---

<Snippet path="what-is-dbt-intro" />

<Lightbox src="/img/docs/platform-overview.jpg" width="60%" title="dbt works alongside your ingestion, visualization, and other data tools, so you can transform data directly in your cloud data platform." />

Read more about why we want to enable analysts to work more like software engineers in [The dbt Viewpoint](/community/resources/viewpoint). Learn how other data practitioners around the world are using dbt by [joining the dbt Community](https://www.getdbt.com/community/join-the-community).

## dbt framework

import DbtFramework from '/snippets/_dbt-framework.md';
import DbtVersionOverview from '/snippets/_dbt-version-overview.md';

<DbtFramework />

### dbt versions

<DbtVersionOverview />

Refer to the [Licensing FAQs](https://www.getdbt.com/licenses-faq) for more info.

## The dbt engine

The current generation of the dbt is written in Rust with a native understanding of SQL across multiple engine dialects. That comprehension lets dbt catch errors before they reach your warehouse and powers editor features like autocomplete and inline errors as you type.

v2 is the default experience when you [install dbt](/docs/local/install-dbt). It builds on the Apache 2.0 open-source runtime CLI foundation for the dbt framework. dbt is free to use, with some capabilities unlocked when you sign in with any <Constant name="dbt_platform" /> account.

### Enhance your development workflows

As a developer, dbt can:

- Immediately catch incorrect SQL in your dbt models, before they ever hit the warehouse
- Give you autocomplete, hover info, and inline errors as you type
- Preview inline <Term id="cte">CTEs</Term> for faster debugging
- Trace model and column definitions across your entire project

Get all of this, free, in the [dbt extension for VS Code](/docs/about-dbt-extension), built on v2.


## How to use dbt

You can use dbt in different ways depending on your needs:

- [With the <Constant name="dbt_platform" />](#dbt-platform) (recommended for most users)
- [Locally from your command line or code editor](#dbt-local-development)

### dbt platform

The <Constant name="dbt_platform" /> is the fastest way to run dbt: scheduling, CI/CD, documentation hosting, monitoring, and alerting, all in one place. It works with both v1 and v2, on every plan from Developer (free) through Enterprise+.

Develop directly in the platform with the [Studio IDE](/docs/platform/studio-ide/develop-in-studio) or connect from your local machine with the dbt VS Code extension or <Constant name="platform_cli" />. 

Learn more about [dbt platform features](/docs/platform/about-platform/dbt-platform-features), explore [plans and pricing](https://www.getdbt.com/pricing/), or try a [quickstart](/guides).


### dbt local development

[Install dbt](/docs/local/install-dbt) to run v2 locally from the command line, powered by an open-source runtime.

For the best development experience, we recommend pairing v2 with the [dbt VS Code extension](/docs/about-dbt-extension) for autocomplete, inline errors, and lineage as you work. You can also run [`dbt login`](/reference/commands/login?version=2.0) to unlock additional capabilities and create a free <Constant name="dbt_platform" /> account.

To get started quickly, try the [dbt quickstart](/guides/dbt).

Other ways to run self-hosted dbt:
- [<Constant name="core_v1" />](/docs/local/install-dbt?version=1.0): The original Python-based CLI. 
- [<Constant name="core_v2" />](/docs/local/install-dbt-v2): <Constant name="core_v2" />, the free, fully open-source (Apache 2.0) distribution of the new Rust-based dbt engine. Typically for organizations with a strict requirement to use this OSS runtime.

To contribute to the open-source project, refer to the [GitHub repo](https://github.com/dbt-labs/dbt-core).

## Why use dbt

As a dbt user, your main focus will be on writing models (select queries) that reflect core business logic – there's no need to write boilerplate code to create tables and views, or to define the order of execution of your models. Instead, dbt handles turning these models into objects in your warehouse for you.

- **No boilerplate**: Write business logic with just a SQL `select` statement or a Python DataFrame. dbt handles <Term id="materialization" />, transactions, <Term id="ddl" />, and schema changes.
- **Modular and reusable**: Build data models that can be referenced in subsequent work. Change a model once and the change propagates to all its dependencies, so you can publish canonical business logic without reimplementing it.
- **Fast builds**: Use [incremental models](/docs/build/incremental-models) and leverage metadata to optimize long-running models.
- **Tested and documented** &mdash; Write [data quality tests](/docs/build/data-tests) on your underlying data and auto-generate [documentation](/docs/build/documentation) alongside your code.
- **Software engineering workflows**: Version control, branching, pull requests, CI/CD, and [package management](/docs/build/packages) for your data pipelines. Write <Term id="dry" />er code with [macros](/docs/build/jinja-macros) and [hooks](/docs/build/hooks-operations).
- **AI-powered development**: Use [<Constant name="wizard" />](/docs/platform/wizard-overview) to investigate, build, validate, and ship from natural language. <Constant name="wizard" /> is grounded in your project's full context, validates its own work against lineage and tests, and includes governance and audit trails by default.

## Related docs

- [Quickstarts for dbt](/guides)
- [Best practice guides](/best-practices)
- [What is a dbt project?](/docs/build/projects)
- [Supported features matrix](/docs/dbt/supported-features)
- [AI and agents](/docs/dbt-ai/about-dbt-ai)
- [Licensing](/docs/dbt-licensing)
- [v2 license agreement](https://www.getdbt.com/dbt-fusion-engine-license-agreement)
