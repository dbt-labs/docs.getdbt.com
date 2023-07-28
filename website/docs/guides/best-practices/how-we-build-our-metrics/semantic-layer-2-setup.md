---
title: "Setup the Semantic Layer"
description: Getting started with the dbt Semantic Layer
displayText: "dbt Cloud Semantic Layer best practices"
hoverSnippet: Learn how to get started with the dbt Semantic Layer
---

## Getting started

Before we start writing code, we'll need to install the MetricFlow CLI as an extension of a dbt adapter from PyPI. The MetricFlow CLI is compatible with Python versions 3.8, 3.9, 3.10 and 3.11.

We'll use pip to install MetricFlow and our dbt adapter:

```shell
# activate a virtual environment for your project,
# if you don't have a name you like to use we suggest .venv
python -m venv [virtual environment name]
# e.g. dbt-metricflow[snowflake]
# Currently, the supported adapters are Snowflake and Postgres (BigQuery, Databricks, and Redshift coming soon).
pip install dbt-metricflow[adapter name]
```

## Basic commands

This package will install both `dbt` and `mf` as CLIs in our virtual environment. All the regular `dbt` commands like `run`, `build`, and `test` are available. A less common one that will come in handy with the Semantic Layer is `dbt parse`. This will parse your project and generate a _semantic manifest_, a representation of meaningful connections described by your project. This file gives MetricFlow a state of the world from which to generate queries. In addition to `dbt`, you'll have access to `mf` commands like `query` and `validate-configs`, which operate based on that semantic manifest. We'll dig more into all of these as we go along, but lets start off by running a `dbt build` to get the starting state of our project built.
