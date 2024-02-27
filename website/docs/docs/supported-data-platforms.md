---
title: "Supported data platforms"
id: "supported-data-platforms"
sidebar_label: "Supported data platforms"
description: "Connect dbt to any data platform in dbt Cloud or dbt Core, using a dedicated adapter plugin"
hide_table_of_contents: true
pagination_next: "docs/connect-adapters"
pagination_prev: null
---

dbt connects to and runs SQL against your database, warehouse, lake, or query engine. These SQL-speaking platforms are collectively referred to as _data platforms_. dbt connects with data platforms by using a dedicated adapter plugin for each. Plugins are built as Python modules that dbt Core discovers if they are installed on your system. Refer to the [Build, test, document, and promote adapters](/guides/adapter-creation) guide. for more info.

You can [connect](/docs/connect-adapters) to adapters and data platforms natively in dbt Cloud or install them manually using dbt Core.

You can also further customize how dbt works with your specific data platform via configuration: see [Configuring Postgres](/reference/resource-configs/postgres-configs) for an example.

import MSCallout from '/snippets/_microsoft-adapters-soon.md';

<MSCallout />

## Types of Adapters

There are two types of adapters available today:

- **Trusted** &mdash; [Trusted adapters](trusted-adapters) are those where the adapter maintainers have decided to participate in the dbt Labs adapter program and have made a commitment to meeting those requirements. For adapters supported in dbt Cloud, maintainers have gone through an additional rigorous process that cover contractual requirements for development, documentation, user experience, and maintenance.
- **Community** &mdash; [Community adapters](community-adapters) are open-source and maintained by community members. Any adapter requirements are managed by the maintainers and/or the community themselves.
