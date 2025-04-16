---
title: "Set up the dbt Semantic Layer"
description: Getting started with the dbt Semantic Layer
hoverSnippet: Learn how to get started with the dbt Semantic Layer
pagination_next: "best-practices/how-we-build-our-metrics/semantic-layer-3-build-semantic-models"
---

## Getting started

There are two options for developing a dbt project, including the <Constant name="semantic_layer" />:

- [<Constant name="cloud_cli" />](/docs/cloud/cloud-cli-installation) &mdash; MetricFlow commands are embedded in the <Constant name="cloud_cli" /> under the `dbt sl` subcommand. This is the easiest, most full-featured way to develop <Constant name="semantic_layer" /> code for the time being. You can use the editor of your choice and run commands from the terminal.

- [<Constant name="cloud_ide" />](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) &mdash; You can create semantic models and metrics in the <Constant name="cloud_ide" />. 

## Basic commands

- 🔍 A less common command that will come in handy with the <Constant name="semantic_layer" /> is `dbt parse`. This will parse your project and generate a **semantic manifest**, a representation of meaningful connections described by your project. This is uploaded to <Constant name="cloud" />, and used for running `dbt sl` commands in development. This file gives MetricFlow a **state of the world from which to generate queries**.
- 🧰 `dbt sl query` is your other best friend, it will execute a query against your semantic layer and return a sample of the results. This is great for testing your semantic models and metrics as you build them. For example, if you're building a revenue model you can run `dbt sl query --metrics revenue --group-by metric_time__month` to validate that monthly revenue is calculating correctly.
- 📝 Lastly, `dbt sl list dimensions --metrics [metric name]` will list all the dimensions available for a given metric. This is useful for checking that you're increasing dimensionality as you progress. You can `dbt sl list` other aspects of your <Constant name="semantic_layer" /> as well, run `dbt sl list --help` for the full list of options.

For more information on the available commands, refer to the [MetricFlow commands](/docs/build/metricflow-commands) reference, or use `dbt sl --help` and `dbt sl [subcommand] --help` on the command line. If you need to set up a dbt project first, check out the [quickstart guides](/docs/get-started-dbt).

## Onward!

Throughout the rest of the guide, we'll show example code based on the Jaffle Shop project, a fictional chain of restaurants. You can check out the code yourself and try things out in the [Jaffle Shop repository](https://github.com/dbt-labs/jaffle-shop). So if you see us calculating metrics like `food_revenue` later in this guide, this is why!
