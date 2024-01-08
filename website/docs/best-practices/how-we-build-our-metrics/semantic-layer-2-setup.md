---
title: "Set up MetricFlow"
description: Getting started with the dbt and MetricFlow
hoverSnippet: Learn how to get started with the dbt and MetricFlow
pagination_next: "best-practices/how-we-build-our-metrics/semantic-layer-3-build-semantic-models"
---

## Getting started

First, if you want to follow along, we'll need to clone the [example project](https://github.com/dbt-labs/jaffle-sl-template). You will need access to a Snowflake, BigQuery, Databricks, or Postgres warehouse for this, for the time being. The project is our classic Jaffle Shop, a simulated chain restaurant serving [jaffles](https://en.wikipedia.org/wiki/Pie_iron) and tasty beverages.

```shell
git clone git@github.com:dbt-labs/jaffle-sl-template.git
cd path/to/project
```

Next, before you start writing code, you need to install MetricFlow:

<Tabs>

<TabItem value="cloud" label="dbt Cloud">

- [dbt Cloud CLI](/docs/cloud/cloud-cli-installation) &mdash; MetricFlow commands are embedded in the dbt Cloud CLI. You can immediately run them once you install the dbt Cloud CLI. Using dbt Cloud means you won't need to manage versioning — your dbt Cloud account will automatically manage the versioning.

- [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) &mdash; You can create metrics using MetricFlow in the dbt Cloud IDE. However, support for running MetricFlow commands in the IDE will be available soon.

</TabItem>

<TabItem value="core" label="dbt Core">

- Download MetricFlow as an extension of a dbt adapter from PyPI  (dbt Core users only). The MetricFlow is compatible with Python versions 3.8 through 3.11. 
  - **Note**: You'll need to manage versioning between dbt Core, your adapter, and MetricFlow.
- We'll use pip to install MetricFlow and our dbt adapter:

```shell
# activate a virtual environment for your project,
# if you don't have a name you like to use we suggest .venv
python -m venv [virtual environment name]
source [virtual environment name]/bin/activate
# install dbt and MetricFlow
python -m pip install "dbt-metricflow[adapter name]"
# e.g. python -m pip install "dbt-metricflow[snowflake]"
```

</TabItem>
</Tabs>

- Now that you're ready to use MetricFlow, get to the pre-Semantic Layer starting state by checking out the `start-here` branch:

```shell
git checkout start-here
```

For more information, refer to the [MetricFlow commands](/docs/build/metricflow-commands) or the [quickstart guides](/guides) to get more familiar with setting up a dbt project.

## Basic commands

- 💻 This package will install both `dbt` and `mf` as CLIs in our virtual environment. All the regular `dbt` commands like `run`, `build`, and `test` are available.
- 🔍 A less common one that will come in handy with the Semantic Layer is `dbt parse`. This will parse your project and generate a **semantic manifest**, a representation of meaningful connections described by your project. This file gives MetricFlow a **state of the world from which to generate queries**.
- 🧰 In addition to `dbt`, you'll have access to `mf` commands like `query` and `validate-configs`, which operate based on that semantic manifest. We'll dig more into all of these as we go along.
- 🛠️ Lets start off by running a `dbt build` to get the **starting state** of our project built.
