---
title: "dbt Quickstarts"
id: get-started-dbt
hide_table_of_contents: true
pagination_next: null
pagination_prev: null
---

Begin your dbt journey by choosing how you want to develop:

- [**<Constant name="dbt_platform" />** ](#the-dbt-platform) &mdash; Develop in your browser (<Constant name="studio_ide" /> or <Constant name="canvas" />) or use local tools (VS Code extension, <Constant name="platform_cli" />) that connect to your platform account. The platform provides hosted CI/CD, documentation, and more. Supports both the [<Constant name="fusion_engine" />](/docs/fusion) and [<Constant name="core" />](/docs/local/install-dbt) engines.
- [**Local only**](#dbt-local-installations) &mdash; Use local tools ([VS Code extension](/docs/about-dbt-extension), [Fusion CLI](/docs/local/install-dbt?version=2#get-started), or [<Constant name="core" />](/docs/local/install-dbt)) to develop and run dbt on your own infrastructure. You can use local tools with or without a <Constant name="dbt_platform" /> account.
- **Local + <Constant name="dbt_platform" />** &mdash; Use the VS Code extension or <Constant name="platform_cli" /> with a <Constant name="dbt_platform" /> account to develop locally while leveraging platform features like CI/CD, documentation hosting, <Constant name="insights" />, <Constant name="canvas" />, and more.

## The dbt platform

<Constant name="dbt" /> provides a fully managed environment to develop, run, and deploy dbt projects—with CI/CD, documentation hosting, and more. Learn more about [<Constant name="dbt" /> features](/docs/platform/about-platform/dbt-platform-features) and [start your free trial](https://www.getdbt.com/signup/) today. 

The <Constant name="fusion_engine" /> adds managed execution, [state-aware orchestration](/docs/deploy/state-aware-about), and a unified development experience so you can focus on building rather than infrastructure.

Choose your warehouse to get started with a quickstart:

<div className="grid--3-col">

<Card
    title="Quickstart for dbt and Amazon Athena"
    body="Integrate dbt with Amazon Athena for your data transformations."
    link="https://docs.getdbt.com/guides/athena"
    icon="athena"/>

<Card
    title="Quickstart for dbt and Azure Synapse Analytics"
    body="Discover how to integrate dbt with Azure Synapse Analytics for your data transformations."
    link="https://docs.getdbt.com/guides/azure-synapse-analytics"
    icon="azure-synapse-analytics-2"/>

<Card
    title="Quickstart for dbt and BigQuery"
    body="Discover how to leverage dbt with BigQuery to streamline your analytics workflows."
    link="https://docs.getdbt.com/guides/bigquery"
    icon="bigquery"/>

<Card
    title="Quickstart for dbt and Databricks"
    body="Learn how to integrate dbt with Databricks for efficient data processing and analysis."
    link="https://docs.getdbt.com/guides/databricks"
    icon="databricks"/>

<Card
    title="Quickstart for dbt and Microsoft Fabric"
    body="Explore the synergy between dbt and Microsoft Fabric to optimize your data transformations."
    link="https://docs.getdbt.com/guides/microsoft-fabric"
    icon="fabric"/>

<Card
    title="Quickstart for dbt and Redshift"
    body="Learn how to connect dbt to Redshift for more agile data transformations."
    link="https://docs.getdbt.com/guides/redshift"
    icon="redshift"/>

<Card
    title="Quickstart for dbt and Snowflake"
    body="Unlock the full potential of using dbt with Snowflake for your data transformations."
    link="https://docs.getdbt.com/guides/snowflake"
    icon="snowflake"/>

<Card
    title="Quickstart for dbt and Starburst Galaxy"
    body="Leverage dbt with Starburst Galaxy to enhance your data transformation workflows."
    link="https://docs.getdbt.com/guides/starburst-galaxy"
    icon="starburst"/>

<Card
    title="Quickstart for dbt and Teradata"
    body="Discover and use dbt with Teradata to enhance your data transformation workflows."
    link="https://docs.getdbt.com/guides/teradata"
    icon="teradata"/>

</div>

## dbt local installations

When you install dbt locally, you get command-line tools and the VS Code extension that enable you to transform data using analytics engineering best practices.

You can use local tools with or without a <Constant name="dbt_platform" /> account. With an account, the VS Code extension and <Constant name="platform_cli" /> sync with your platform project for CI/CD, documentation, and more. Without an account, you run dbt entirely on your own infrastructure.

Develop locally using the <Constant name="fusion_engine" /> or <Constant name="core" /> engine.

<div className="grid--3-col">

<Card
    title="dbt Fusion engine from a manual install"
    body="Learn how to install dbt Fusion and set up a project."
    link="/guides/fusion?step=2"
    icon="dbt-bit"/>
<Card
    title="dbt Core from a manual install"
    body="Learn how to install dbt Core and set up a project."
    link="/guides/manual-install"
    icon="dbt-bit"/>

<Card
    title="Quickstart for dbt with DuckDB"
    body="Learn how to connect dbt to DuckDB."
    link="/guides/duckdb?step=1"
    icon="duckdb-seeklogo"/>
</div>

## Related docs

Expand your dbt knowledge and expertise with these additional resources:

- [Join the monthly demos](https://www.getdbt.com/resources/webinars/dbt-cloud-demos-with-experts) to see <Constant name="dbt" /> in action and ask questions.
- [<Constant name="dbt" /> AWS marketplace](https://aws.amazon.com/marketplace/pp/prodview-tjpcf42nbnhko) contains information on how to deploy <Constant name="dbt" /> on AWS, user reviews, and more.
- [Best practices](/best-practices) contains information on how dbt Labs approaches building projects through our current viewpoints on structure, style, and setup.
- [dbt Learn](https://learn.getdbt.com) offers free online courses that cover dbt fundamentals, advanced topics, and more.
- [Join the dbt Community](https://www.getdbt.com/community/join-the-community) to learn how other data practitioners globally are using dbt, share your own experiences, and get help with your dbt projects.
