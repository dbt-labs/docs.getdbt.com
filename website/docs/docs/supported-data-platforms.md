---
title: "Supported data platforms"
id: "supported-data-platforms"
sidebar_label: "Supported data platforms"
description: "Connect dbt to any data platform in dbt Cloud or dbt Core, using a dedicated adapter plugin"
hide_table_of_contents: true
---

dbt connects to and runs SQL against your database, warehouse, lake, or query engine. These SQL-speaking platforms are collectively referred to as _data platforms_. dbt connects with data platforms by using a dedicated adapter plugin for each. Plugins are built as Python modules that dbt Core discovers if they are installed on your system. Read [What are Adapters](/guides/dbt-ecosystem/adapter-development/1-what-are-adapters) for more info.

You can also [further configure](/reference/resource-configs/postgres-configs) your specific data platform to optimize performance. 

## Types of Adapters

You can [connect](/docs/connect-adapters) to adapters and data platforms either directly in the dbt Cloud user interface (UI) or install them manually using the command line (CLI). There are three types of adapters available today. The purpose of differentiation is to provide users with an easier means to evaluate adapter quality.

- **Verified** &mdash; dbt Labs' strict [adapter program](/guides/dbt-ecosystem/adapter-development/7-verifying-a-new-adapter) assures users of trustworthy, tested, and regularly updated adapters for production use. Verified adapters earn a "Verified" status, providing users with trust and confidence.
- **Trusted** &mdash; [Trusted adapters](trusted-adapters) are those where the adapter maintainers have agreed to meet a higher standard of quality.
- **Community** &mdash; [Community adapters](community-adapters) are open-source and maintained by community members. 

### Verified adapters

The following are **Verified adapters** ✓ you can connect to either in dbt Cloud or dbt Core:

import AdaptersVerified from '/snippets/_adapters-verified.md';

<AdaptersVerified />

<br />
* Install these adapters using the CLI as they're not currently supported in dbt Cloud. <br />

### Trusted adapters

The following are **Trusted adapters** ✓ you can connect to in dbt Core:

import AdaptersTrusted from '/snippets/_adapters-trusted.md';

<AdaptersTrusted />
