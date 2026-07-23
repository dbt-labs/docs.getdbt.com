---
title: About dbt self-hosted installations
id: about-local
description: "dbt tools and resources that can be installed on your local machine"
sidebar_label: "About self-hosted installation"
pagination_next: "docs/local/install-dbt"
pagination_prev: null
---

<!-- TODO: sidebar location may change in Phase 3 -->
<!-- BADGE: platform_login (added in phase 2) -->

You can run <Constant name="dbt" /> locally from your terminal with the dbt CLI, or from your code editor with the dbt VS Code extension. Local development lets you build, test, and run dbt projects from your own machine while connecting to your data platform.

<VersionBlock firstVersion="2.0">

## Install dbt

Install <Constant name="dbt" /> locally to run dbt commands from your terminal. You can install it with `pip`:

```shell
python -m pip install --pre dbt-<adapter>
```

Or with `curl`:

```shell
curl -fsSL https://public.cdn.getdbt.com/fs/install/install.sh | sh
```

For full installation instructions, including adapter-specific setup, refer to [Install dbt](/docs/local/install-dbt).

</VersionBlock>

<VersionBlock lastVersion="1.99">

:::tip Ready for the current version?
v2 is the current generation of dbt and the recommended choice for most users &mdash; it's faster, adds richer developer tooling, and is free to use with <Constant name="fusion" />. [Upgrade to v2](/docs/dbt-versions/core-upgrade/upgrading-to-v2).
:::

## Install dbt Core v1.x

dbt Core v1.x is the Python-based distribution and remains maintained. For full installation instructions, refer to [Install dbt](/docs/local/install-dbt?version=1.0).

</VersionBlock>

## dbt VS Code extension

The [dbt VS Code extension](/docs/about-dbt-extension) lets you develop dbt projects from VS Code, Cursor, or Windsurf. Use the extension if you want an editor-based local development experience. For installation and setup, refer to the [extension docs](/docs/about-dbt-extension).

## dbt Wizard

[<Constant name="wizard" />](/docs/dbt-ai/wizard-quickstart) is a natural next step for local dbt development. It works with <Constant name="dbt" /> and adds an AI agent that understands your full project through dbt's [native metadata engine](/docs/dbt-ai/about-dbt-ai), a structured index of your [lineage](/docs/explore/explore-projects), model health, test coverage, and semantic definitions.

- **Build and refactor from natural language:** Describe the change, get a reviewable diff, approve before anything is written.
- **Validate in a tight loop:** Every proposed change compiles and runs against your warehouse, catching issues before production.
- **Navigate with full project context:** Traverse the [DAG](/docs/explore/explore-projects), surface downstream impact, and keep tests and YAML in sync as models evolve.

For data practitioners, <Constant name="wizard" /> adds an AI layer that knows your project, not just your code. Refer to the [dbt Wizard quickstart](/docs/dbt-ai/wizard-quickstart) to get started.

## dbt MCP server

The dbt MCP server connects your local dbt project to AI assistants using the [Model Context Protocol](https://modelcontextprotocol.io/). It works with <Constant name="dbt" /> and requires no repository clone.

- **<Constant name="platform_cli" /> tools:** Run `dbt run`, `build`, `test`, `compile`, `list`, `parse`, and `show` directly from your AI assistant's chat interface.
- **Local project context:** Surface model lineage, node details, and dependency graphs from your local `manifest.json` without leaving your editor.
- **Code generation:** Auto-generate model YAML, source definitions, and staging SQL from your warehouse schema (requires the codegen toolset to be enabled).
- **Zero-clone install:** Install [uv](https://docs.astral.sh/uv/getting-started/installation/) and run `uvx dbt-mcp`. No repository clone needed!

[Connect dbt MCP server to your local project](/docs/dbt-ai/mcp-quickstart-cli).


## Licensing info
dbt framework has two distributions which can both be installed locally for free, powered by a single engine:

- dbt Core is completely open-source and the code behind Fusion. Its code and binary are subject to the Apache 2.0 license.
  - Includes dbt Core v1.x and dbt Core 2.0
- dbt Fusion extends dbt Core with additional advanced capabilities &mdash; some are free to use, and other premium features (under proprietary code) are unlocked with a free login or payment method.

Refer to [licensing](/docs/dbt-licensing) for more info.
