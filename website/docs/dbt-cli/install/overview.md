---
id: "overview"
title: "How to install dbt"
description: "You can install dbt Core using a few different tested methods."
---

You can install dbt Core on the command line by using one of these recommended methods:

- [Use Homebrew to install dbt](install/homebrew) (recommended for MacOS + most popular plugins)
- [Use pip to install dbt](install/pip)
- [Use a Docker image to install dbt](install/docker)
- [Install dbt from source](install/from-source)


## About dbt adapters

dbt works with a number of different data platforms (databases, query engines, and other SQL-speaking technologies). It does this by using a dedicated _adapter_ for each. When you install dbt, you'll also want to install the specific adapter for your database. For more details, see [Supported Data Platforms](supported-data-platforms).
