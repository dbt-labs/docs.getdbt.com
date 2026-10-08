---
title: "Supported data platforms"
id: "supported-data-platforms"
sidebar_label: "About supported data platforms"
description: "Connect dbt to any data platform in dbt, using a dedicated adapter plugin"
hide_table_of_contents: true
pagination_next: "docs/connect-adapters"
pagination_prev: null
---

import FusionLifecycle from '/snippets/_fusion-lifecycle.md';

dbt connects to and runs SQL against your database, warehouse, lake, or query engine. These SQL-speaking platforms are collectively referred to as _data platforms_. dbt connects with data platforms by using a dedicated adapter plugin for each. Plugins are built as Python modules that <Constant name="core" /> discovers if they are installed on your system. Refer to the [Build, test, document, and promote adapters](/guides/adapter-creation) guide for details.

Adapters are maintained by dbt Labs, partners, and community members. Refer to [community adapters](/docs/trusted-adapters) for the combined list.

<VersionBlock firstVersion="2.0" >

<FusionLifecycle/>

</VersionBlock>

<details>
  <summary>Considerations for depending on an open-source project</summary>

  1. Does it work?
  2. Does anyone "own" the code, or is anyone liable for ensuring it works?
  3. Do bugs get fixed quickly?
  4. Does it stay up-to-date with new <Constant name="core" /> features?
  5. Is the usage substantial enough to self-sustain?
  6. Do other known projects depend on this library?

</details>
