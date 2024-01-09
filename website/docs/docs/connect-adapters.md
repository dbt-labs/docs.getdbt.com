---
title: "How to connect to adapters"
id: "connect-adapters"
---

Adapters are an essential component of dbt. At their most basic level, they are how dbt connects with the various supported data platforms. At a higher-level, adapters strive to give analytics engineers more transferrable skills as well as standardize how analytics projects are structured. Gone are the days where you have to learn a new language or flavor of SQL when you move to a new job that has a different data platform. That is the power of adapters in dbt &mdash; for more detail, refer to the [Build, test, document, and promote adapters](/guides/adapter-creation) guide.

This section provides more details on different ways you can connect dbt to an adapter, and explains what a maintainer is.

### Set up in dbt Cloud

Explore the fastest and most reliable way to deploy dbt using dbt Cloud, a hosted architecture that runs dbt Core across your organization. dbt Cloud lets you seamlessly [connect](/docs/cloud/about-cloud-setup) with a variety of [verified](/docs/supported-data-platforms) data platform providers directly in the dbt Cloud UI.

### Install with dbt Core

Install dbt Core, an open-source tool, locally using the command line. dbt communicates with a number of different data platforms by using a dedicated  adapter plugin for each. When you install dbt Core, you'll also need to install the specific adapter for your database, [connect to dbt Core](/docs/core/about-core-setup), and set up a `profiles.yml` file.

With a few exceptions [^1], you can install all [Verified adapters](/docs/supported-data-platforms) from PyPI using `python -m pip install adapter-name`. For example to install Snowflake, use the command `python -m pip install dbt-snowflake`. The installation will include `dbt-core` and any other required dependencies, which may include both other dependencies and even other adapter plugins. Read more about [installing dbt](/docs/core/installation-overview).

[^1]: Here are the two different adapters. Use the PyPI package name when installing with `pip`

    | Adapter repo name | PyPI package name    |
    | ----------------- | -------------------- |
    | `dbt-athena`      | `dbt-athena-adapter` |
    | `dbt-layer`       | `dbt-layer-bigquery` |
