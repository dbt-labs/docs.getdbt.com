---
title: About developing in dbt
id: about-develop-dbt
description: "Learn how to develop your dbt projects using dbt Cloud."
sidebar_label: "About developing in dbt"
pagination_next: "docs/cloud/cloud-cli-installation"
hide_table_of_contents: false
---

Develop dbt projects using dbt Cloud or dbt Core. There are a few key differences between the two options: 

## dbt Cloud

- dbt Cloud offers a fast and reliable way to work on your dbt project. It runs dbt Core in a hosted (single or multi-tenant) environment. 
- You can develop in your browser using an integrated development environment (IDE) or in a dbt Cloud-powered command line interface (CLI).

<div className="grid--2-col" >

<Card
    title="dbt Cloud CLI"
    body="Allows you to develop and run dbt commands from your local command line or code editor against your dbt Cloud development environment."
    link="/docs/cloud/cloud-cli-installation"
    icon="dbt-bit"/>

  <Card
    title="dbt Cloud IDE"
    body="Develop directly in your browser, making dbt project development efficient by compiling code into SQL and managing project changes seamlessly using an intuitive user interface."
    link="/docs/cloud/dbt-cloud-ide/develop-in-the-cloud"
    icon="dbt-bit"/>

</div><br />

To get started with dbt development, you'll need a [developer](/docs/cloud/manage-access/seats-and-users) account. For a more comprehensive guide about developing in dbt, refer to our [quickstart guides](/guides).

## dbt Core

- Install dbt Core, the open-sourced version of dbt, on your local machine to develop your dbt project locally. 
- You can install dbt Core on the command line with pip install, Homebrew, Docker image, or from source. For more information, see [About dbt Core installation](/docs/core/installation-overview).

---------
**Note**: The dbt Cloud CLI and the open-sourced dbt Core are both command line tools that let you run dbt commands. The key distinction is the dbt Cloud CLI is tailored for dbt Cloud's infrastructure and integrates with all its [features](/docs/cloud/about-cloud/dbt-cloud-features).

