---
title: "Supported data platforms"
id: "supported-data-platforms"
sidebar_label: "About supported data platforms"
description: "Connect dbt to any data platform in dbt, using a dedicated adapter plugin"
hide_table_of_contents: true
pagination_next: "docs/community-adapters"
pagination_prev: null
---

import FusionLifecycle from '/snippets/_fusion-lifecycle.md';

dbt connects to and runs SQL against your database, warehouse, lake, or query engine. These SQL-speaking platforms are collectively referred to as _data platforms_. dbt connects with data platforms by using a dedicated adapter plugin for each. Plugins are built as Python modules that <Constant name="core" /> discovers if they are installed on your system. Refer to the [Build, test, document, and promote adapters](/guides/adapter-creation) guide for details.

Adapters are maintained by dbt Labs, partners, and community members. Refer to [community adapters](/docs/community-adapters) for the combined list.

### Install an adapter

To use dbt from the command line, install the adapter for your data platform and set up a `profiles.yml` file. Refer to [installing dbt](/docs/local/install-dbt).

<VersionBlock lastVersion="1.99">

With a few exceptions [^1], you can install adapters from PyPI with `python -m pip install adapter-name`. To install the Snowflake adapter, use `python -m pip install dbt-snowflake`. The installation includes <Constant name="core" /> and any other required dependencies.

[^1]: Use the PyPI package name when installing with `pip`.

| Adapter repo name | PyPI package name |
| --- | --- |
| `dbt-layer` | `dbt-layer-bigquery` |

</VersionBlock>

<VersionBlock firstVersion="2.0">

Adapters ship with <Constant name="fusion" />. When you [install dbt](/docs/local/install-dbt), the supported data platforms are available with no separate `pip install` for each adapter.

Refer to [Contribute a dbt v2 adapter](/guides/adapter-creation-v2?step=1) for more information.

</VersionBlock>

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
