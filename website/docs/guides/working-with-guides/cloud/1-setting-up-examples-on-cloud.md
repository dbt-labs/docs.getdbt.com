---
title: "Setting up example projects in dbt Cloud"
id: 1-setting-up-examples-on-cloud
slug: working-with-guides/cloud/1-setting-up
description: Learn how to set up Guides example projects in dbt Cloud.
displayText: dbt Cloud setup
hoverSnippet: Learn how to set up Guides example projects in dbt Cloud.
---

## Getting started

1. 🔀 **Fork the repo**. Go to the repo specificed as the example project in the guide you're working through, or start from [the base template](https://github.com/dbt-labs/jaffle-shop-template). Click `Use this template` and `Create new repository`.
2. 🆕 **Create a new project** in dbt Cloud.
   1. 🏭 **Select your warehouse**. If you don't have a warehouse, we highly suggest either working through the [GitHub Codespaces path](/guides/working-with-guides/core/1-setting-up-examples-on-core-recommended) **OR** first working through the [BigQuery Quickstart](docs/get-started/getting-started/getting-set-up/setting-up-bigquery), which can help you set up a free account on Google's BigQuery warehouse platform. If you choose the latter, use the same credentials you connect to from that Quickstart to connect your new project.
   2. 🍴 **Connect to the forked repo** you made from the template project in Step 1. Make sure you're connecting to your fork, not the original, so that you can push changes and develop.
3. 🛠️ **Go to the dbt Develop interface** and run a `dbt build`.
