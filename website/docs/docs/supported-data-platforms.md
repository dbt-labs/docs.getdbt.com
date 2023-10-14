---
title: "Supported data platforms"
id: "supported-data-platforms"
sidebar_label: "Supported data platforms"
description: "Connect dbt to any data platform in dbt Cloud or dbt Core, using a dedicated adapter plugin"
hide_table_of_contents: true
---

dbt connects to and runs SQL against your database, warehouse, lake, or query engine. These SQL-speaking platforms are collectively referred to as _data platforms_. dbt connects with data platforms by using a dedicated adapter plugin for each. Plugins are built as Python modules that dbt Core discovers if they are installed on your system. Read [What are Adapters](/guides/dbt-ecosystem/adapter-development/1-what-are-adapters) for more info.

You can [connect](/docs/connect-adapters) to adapters and data platforms either directly in the dbt Cloud user interface (UI) or install them manually using the command line (CLI).

You can also further customize how dbt works with your specific data platform via configuration: see [Configuring Postgres](/reference/resource-configs/postgres-configs) for an example.

import MSCallout from '/snippets/_microsoft-adapters-soon.md';

<MSCallout />

## Types of Adapters

There are three types of adapters available today:

- **Verified** &mdash; [Verified adapters](verified-adapters) are those that have completed a rigorous verification process in collaboration with dbt Labs.
- **Trusted** &mdash; [Trusted adapters](trusted-adapters) are those where the adapter maintainers have agreed to meet a higher standard of quality.
- **Community** &mdash; [Community adapters](community-adapters) are open-source and maintained by community members. 

### Verified adapters

The following are **Verified adapters** ✓ you can connect to either in dbt Cloud or dbt Core:

import AdaptersVerified from '/snippets/_adapters-verified.md';

<AdaptersVerified />

### Trusted adapters

The following are **Trusted adapters** ✓ you can connect to in dbt Core:

import AdaptersTrusted from '/snippets/_adapters-trusted.md';

<AdaptersTrusted />

<br/> * Install these adapters using the CLI as they're not currently supported in dbt Cloud. <br />

