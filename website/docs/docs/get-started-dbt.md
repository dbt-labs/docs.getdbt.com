---
title: "Get started with dbt"
id: get-started-dbt
description: "Choose the best path to start developing with dbt, whether you use the dbt platform, local development tools, or open source workflows."
hide_table_of_contents: true
pagination_next: "docs/about-setup"
pagination_prev: null
---

dbt helps you build, test, document, and deploy reliable data transformations. Choose the path that matches how you want to work, then follow a quickstart or setup guide to build your first project.

## Choose your path

<div className="grid--3-col">

<Card
    title="Start in the dbt platform"
    body="Develop in your browser or locally with platform-connected tools, then use hosted CI/CD, documentation, orchestration, and more."
    link="/docs/platform/about-platform/dbt-platform-features"
    icon="rocket"/>

<Card
    title="Develop locally"
    body="Use VS Code or your terminal with the dbt Fusion engine or dbt Core, with or without a dbt platform account."
    link="#develop-locally"
    icon="vsce"/>

<Card
    title="Follow a quickstart"
    body="Choose your data platform and build a first project end to end."
    link="#quickstarts"
    icon="compass"/>

</div>

## Quickstarts

Quickstarts are the fastest way to build your first dbt project. Pick the data platform you want to use:

<div className="grid--3-col">

<Card
    title="Quickstart for dbt and Snowflake"
    body="Build your first dbt project on Snowflake."
    link="/guides/snowflake?step=1"
    icon="snowflake"/>

<Card
    title="Quickstart for dbt and Databricks"
    body="Build your first dbt project on Databricks."
    link="/guides/databricks?step=1"
    icon="databricks"/>

<Card
    title="Quickstart for dbt and BigQuery"
    body="Build your first dbt project on BigQuery."
    link="/guides/bigquery?step=1"
    icon="bigquery"/>

<Card
    title="Quickstart for dbt and Redshift"
    body="Build your first dbt project on Redshift."
    link="/guides/redshift?step=1"
    icon="redshift"/>

<Card
    title="Quickstart for dbt with DuckDB"
    body="Build a local dbt project with DuckDB."
    link="/guides/duckdb?step=1"
    icon="duckdb-seeklogo"/>

<Card
    title="More quickstarts"
    body="Browse quickstarts for Athena, Azure Synapse, Microsoft Fabric, Starburst, Teradata, and more."
    link="/guides"
    icon="compass"/>

</div>

## Develop locally

Local development means you run dbt from your own machine or editor. You can work locally with a dbt platform account, or you can use open source workflows without one.

<div className="grid--3-col">

<Card
    title="Install the dbt VS Code extension"
    body="Develop locally in VS Code or Cursor with the dbt Fusion engine, live validation, lineage, and project-aware tooling."
    link="/docs/about-dbt-extension"
    icon="vsce"/>

<Card
    title="Install the dbt Fusion engine"
    body="Set up the Fusion CLI locally and develop from your terminal."
    link="/docs/local/install-dbt?version=2"
    icon="dbt-bit"/>

<Card
    title="Install dbt Core"
    body="Set up dbt Core locally and run open source dbt workflows from your terminal."
    link="/docs/local/install-dbt"
    icon="dbt-bit"/>

</div>

## Build with dbt

After you choose a setup path, use these docs to build the core pieces of a dbt project:

<div className="grid--3-col">

<Card
    title="Build your first model"
    body="Turn SQL into modular, version-controlled models."
    link="/docs/build/models"
    icon="dbt-bit"/>

<Card
    title="Add tests"
    body="Validate assumptions about your data and catch issues earlier."
    link="/docs/build/data-tests"
    icon="settings"/>

<Card
    title="Document your project"
    body="Add descriptions and generate docs so your team can understand and trust your project."
    link="/docs/build/documentation"
    icon="book"/>

</div>

## Build with AI

Once you have a working project, <Constant name="wizard" /> can help you build, refactor, validate, and document it.

<div className="grid--3-col">

<Card
    title="Use dbt Wizard in the dbt platform"
    body="Use dbt Wizard in the Studio IDE or home app to develop with project context."
    link="/docs/platform/wizard-overview"
    icon="dbt-copilot"/>

<Card
    title="Use dbt Wizard from your terminal"
    body="Install the dbt Wizard CLI and run the agent locally against a dbt project."
    link="/docs/dbt-ai/wizard-quickstart"
    icon="dbt-copilot"/>

</div>

## Explore more

- Learn [what dbt is](/docs/introduction) and how it fits into analytics engineering.
- Explore [dbt platform features](/docs/platform/about-platform/dbt-platform-features).
- Review [dbt best practices](/best-practices).
- Browse [reference docs](/reference/references-overview).
- Join the [dbt Community](https://www.getdbt.com/community/join-the-community) to learn from other data practitioners.
