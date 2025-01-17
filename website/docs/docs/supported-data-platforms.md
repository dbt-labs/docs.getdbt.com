---
title: "Supported data platforms"
id: "supported-data-platforms"
sidebar_label: "About supported data platforms"
description: "Connect dbt to any data platform in dbt Cloud or dbt Core, using a dedicated adapter plugin"
hide_table_of_contents: true
pagination_next: "docs/connect-adapters"
pagination_prev: null
---

dbt connects to and runs SQL against your database, warehouse, lake, or query engine. These SQL-speaking platforms are collectively referred to as _data platforms_. dbt connects with data platforms by using a dedicated adapter plugin for each. Plugins are built as Python modules that dbt Core discovers if they are installed on your system. Refer to the [Build, test, document, and promote adapters](/guides/adapter-creation) guide for details.

You can [connect](/docs/connect-adapters) to adapters and data platforms natively in dbt Cloud or install them manually using dbt Core.

You can also further customize how dbt works with your specific data platform via configuration: see [Configuring Postgres](/reference/resource-configs/postgres-configs) for an example.

## Types of Adapters

There are two types of adapters available today:

- **Trusted** &mdash; [Trusted adapters](trusted-adapters) are those where the adapter maintainers have decided to participate in the Trusted Adapter Program and have made a commitment to meeting those requirements. For adapters supported in dbt Cloud, maintainers have undergone an additional rigorous process that covers contractual requirements for development, documentation, user experience, and maintenance.
- **Community** &mdash; [Community adapters](community-adapters) are open-source and maintained by community members. These adapters are not part of the Trusted Adapter Program and could have usage inconsistencies.

<details>
  <summary>Considerations for depending on an open-source project</summary>

  1. Does it work?
  2. Does anyone "own" the code, or is anyone liable for ensuring it works?
  3. Do bugs get fixed quickly?
  4. Does it stay up-to-date with new dbt Core features?
  5. Is the usage substantial enough to self-sustain?
  6. Do other known projects depend on this library?

</details>
