---
title: "Quickstarts"
id: get-started-dbt
hide_table_of_contents: true
pagination_next: null
pagination_prev: null
---

Start your dbt journey by trying one of our quickstarts, which provides a step-by-step guide to help you set up dbt Cloud with your data respective data platform. dbt Cloud enables you to develop, test, deploy, and explore data products using a single, fully managed service.

dbt Cloud is designed to empower data teams with advanced capabilities, including:

- Development experiences tailored to multiple personas &mdash; [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) for an in-browser experience or [dbt Cloud CLI](/docs/cloud/cloud-cli-installation) for a local development environment.
- Out-of-the-box [CI/CD workflows](/docs/deploy/ci-jobs)
- The [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl) for consistent metrics
- Domain ownership of data with multi-project [dbt Mesh](/best-practices/how-we-mesh/mesh-1-intro) setups
- [dbt Explorer](/docs/collaborate/explore-projects) for easier data discovery and understanding

Learn more about [dbt Cloud features](/docs/cloud/about-cloud/dbt-cloud-features) and [start with dbt Cloud](https://www.getdbt.com/signup/) today.

<div className="grid--3-col">

<Card
    title="Quickstart for dbt Cloud and BigQuery"
    body="Discover how to leverage dbt Cloud with BigQuery to streamline your analytics workflows."
    link="https://docs.getdbt.com/guides/bigquery"
    icon="bigquery"/>

<Card
    title="Quickstart for dbt Cloud and Databricks"
    body="Learn how to integrate dbt Cloud with Databricks for efficient data processing and analysis."
    link="https://docs.getdbt.com/guides/databricks"
    icon="databricks"/>

<Card
    title="Quickstart for dbt Cloud and Microsoft Fabric"
    body="Explore the synergy between dbt Cloud and Microsoft Fabric to optimize your data transformations."
    link="https://docs.getdbt.com/guides/microsoft-fabric"
    icon="fabric"/>

<Card
    title="Quickstart for dbt Cloud and Redshift"
    body="Learn how to connect dbt Cloud to Redshift for more agile data transformations and streamlined analytics processes."
    link="https://docs.getdbt.com/guides/redshift"
    icon="redshift"/>

<Card
    title="Quickstart for dbt Cloud and Snowflake"
    body="Unlock the full potential of using dbt Cloud with Snowflake for your data transformations."
    link="https://docs.getdbt.com/guides/snowflake"
    icon="snowflake"/>

<Card
    title="Quickstart for dbt Cloud and Starburst Galaxy"
    body="Dive into using dbt Cloud with Starburst Galaxy to supercharge your data analytics."
    link="https://docs.getdbt.com/guides/starburst-galaxy"
    icon="starburst"/>

</div>

### dbt Core
[dbt Core](https://github.com/dbt-labs/dbt-core) is a command-line open-source tool for data transformations that enables data teams to transform data using [analytics engineering best practices](https://docs.getdbt.com/best-practices). It's suitable for ‘single players’ and small technical teams who prefer manual setup and customization.

Refer to the following quickstarts to get started with dbt Core:

- [dbt Core from a manual install](/guides/manual-install) to learn how to install dbt and set up a project.
- [dbt Core using GitHub Codespace](/guides/codespace?step=1) to learn how to create a codespace and execute the `dbt build` command.

## Related docs
<!-- use as an op to link to other useful guides when the query params pr is merged -->
Expand your dbt knowledge and expertise with these additional resources

- [Best practices](https://docs.getdbt.com/best-practices) to learn how dbt Labs approaches building projects through our current viewpoints on structure, style, and setup.
- [Install the dbt Cloud CLI](/docs/cloud/cloud-cli-installation) to learn how to install the dbt Cloud CLI develop in your local environment.
- [Get started with Continuous Integration tests](/guides/set-up-ci) to learn how to set up CI tests for your dbt project.
