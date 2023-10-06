---
title: About developing in dbt Cloud
id: about-cloud-develop
description: "Learn how to develop your dbt projects using dbt Cloud."
sidebar_label: "About developing in dbt Cloud"
pagination_next: "docs/cloud/cloud-cli-installation"
hide_table_of_contents: true
---

dbt Cloud offers a fast and reliable way to work on your dbt project. It runs dbt Core in a hosted (single or multi-tenant) environment with a browser-based integrated development environment (IDE) or a dbt Cloud-powered command line interface (CLI)[^1]. This allows you to seamlessly develop, test, and run dbt commands in the dbt Cloud IDE or through the dbt Cloud CLI.

<div className="grid--3-col">

<Card
    title="dbt Cloud CLI"
    body="Allows you to develop and run dbt commands from your local command line or code editor against your dbt Cloud development environment."
    link="/docs/cloud/cloud-cli-installation"
    icon="dbt-bit"/>

  <Card
    title="dbt Cloud IDE"
    body="Develop directly in your browser, making dbt project development efficient by compiling code into SQL and managing project changes seamlessly using an intuitive user interface (UI)."
    link="/docs/cloud/dbt-cloud-ide/develop-in-the-cloud"
    icon="dbt-bit"/>

</div><br />

This documentation section provides detailed instructions on setting up the dbt Cloud CLI and dbt Cloud IDE. To get started with dbt development, you'll need a [developer](/docs/cloud/manage-access/seats-and-users) account. For a more comprehensive setup guide, refer to our [quickstart guides](/quickstarts).

[^1]: The dbt Cloud CLI and the open-sourced dbt Core are both command line tools that let you run dbt commands. The key distinction is the dbt Cloud CLI is tailored for dbt Cloud's infrastructure and integrates with all its [features](/docs/cloud/about-cloud/dbt-cloud-features).
