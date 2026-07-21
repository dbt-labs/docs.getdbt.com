---
title: About dbt self-hosted installations
id: about-local
description: "dbt tools and resources that can be installed on your local machine"
sidebar_label: "About self-hosted installation"
pagination_next: "docs/local/install-dbt"
pagination_prev: null
---

dbt enables data teams to transform data using analytics engineering best practices. You can run self-hosted dbt through a command line interface (CLI) to build, test, and deploy your data transformations, and install additional tools to enhance your workflows. 

## dbt Fusion engine

For the best self-hosted dbt development experience, we recommend the <Constant name="fusion_engine" />. Built in Rust, <Constant name="fusion" /> delivers:

- **Faster performance:** Up to 10x faster parsing, compilation, and execution.
- **SQL comprehension:** Dialect-aware validation catches errors before they reach your warehouse.
- **Column-level lineage:** Trace data flow across your entire project.

[Install <Constant name="fusion"/> now!](/docs/local/install-dbt)

### dbt VS Code extension

The [dbt VS Code extension](/docs/dbt-extension-features) combines <Constant name="fusion" />'s performance with powerful <Term id="lsp"/> editor features:

- **IntelliSense:** Autocomplete for models, macros, and columns.
- **Inline errors:** See SQL errors as you type.
- **Hover insights:** View model definitions and column info without leaving your code.
- **Refactoring tools:** Rename models and columns across your project.

This is the fastest way to get started with self-hosted dbt.

[Install <Constant name="fusion" /> with the dbt VS Code extension](/docs/local/install-dbt)

## dbt Core

<Constant name="core" /> is the open-source engine for running dbt. It is available in two versions:

- [<Constant name="core_v1" />](/docs/local/install-dbt?version=1): The original Python-based dbt engine with a rich set of features.
- [<Constant name="core_v2" />](/docs/dbt-versions/core-upgrade/upgrading-to-v2) <Lifecycle status="alpha" />: The next major version, built on the <Constant name="fusion"/> runtime. Currently in alpha.

[<Constant name="core_v1" />](/docs/local/install-dbt?version=1) includes:

- **Apache License 2.0:** <Constant name="core" /> is open source now and forever.
- **Community adapters:** An amazing community of contributors has built adapters for a vast [catalog of data warehouses](/docs/supported-data-platforms).
- **Code editor support:** Build your dbt project in popular editors like VS Code or Cursor.
- **Command line interface:** Run your project from the terminal using macOS Terminal, iTerm, or the integrated terminal in your code editor.

[Install <Constant name="core" />now!](/docs/local/install-dbt)

## dbt Wizard

[dbt Wizard](/docs/dbt-ai/wizard-quickstart) is a natural next step for self-hosted dbt development. It works with both <Constant name="fusion_engine" /> and <Constant name="core" />. dbt Wizard adds an AI agent that understands your full project through dbt's [native metadata engine](/docs/dbt-ai/about-dbt-ai), a structured index of your [lineage](/docs/explore/explore-projects), model health, test coverage, and semantic definitions.


- **Build and refactor from natural language**: Describe the change, get a reviewable diff, approve before anything is written.
- **Validate in a tight loop**: Every proposed change compiles and runs against your warehouse, catching issues before production.
- **Navigate with full project context**: Traverse the [DAG](/docs/explore/explore-projects), surface downstream impact, and keep tests and YAML in sync as models evolve.

For data practitioners, <Constant name="wizard"/> adds an AI layer that knows your project, not just your code. Refer to the [dbt Wizard quickstart](/docs/dbt-ai/wizard-quickstart) to get started.


## dbt MCP server

The dbt MCP server connects your local dbt project to AI assistants using the [Model Context Protocol](https://modelcontextprotocol.io/). It works with both <Constant name="fusion_engine" /> and <Constant name="core" />, and requires no repository clone.

- **<Constant name="platform_cli" /> tools:** Run `dbt run`, `build`, `test`, `compile`, `list`, `parse`, and `show` directly from your AI assistant's chat interface.
- **Local project context:** Surface model lineage, node details, and dependency graphs from your local `manifest.json` without leaving your editor.
- **Code generation:** Auto-generate model YAML, source definitions, and staging SQL from your warehouse schema (requires the codegen toolset to be enabled).
- **Zero-clone install:** Install [uv](https://docs.astral.sh/uv/getting-started/installation/) and run `uvx dbt-mcp`. No repository clone needed!

[Connect dbt MCP server to your local project](/docs/dbt-ai/mcp-quickstart-cli)
