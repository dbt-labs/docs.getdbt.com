---
title: "Contribute to dbt Core adapters"
id: "contribute-core-adapters"
description: "Contribute to existing dbt Core adapters or open a pull request for a new v1 or v2 adapter."
pagination_next: null
---

The dbt Community helps analytics practitioners share their knowledge, help others, and collectively drive forward the discipline of analytics engineering. There are opportunities here for everyone to contribute, whether you're at the beginning of your analytics engineering journey or you are a seasoned data professional.

This section explains how you can contribute to existing adapters or create a new adapter.

### Contribute to a pre-existing adapter

Community-supported plugins are works in progress, and you can contribute by testing and writing code. If you're interested in contributing:

- Join both the dedicated channel, [#adapter-ecosystem](https://getdbt.slack.com/archives/C030A0UF5LM), in [dbt Slack](https://community.getdbt.com/) and the channel for your adapter's data store. See the **Slack Channel** link in the [<Constant name="core_v1" /> platform](/docs/local/profiles.yml) pages.
- Review open issues in the plugin's source repository. Use the relevant **GitHub repo** link in the [<Constant name="core_v1" /> platform](/docs/local/profiles.yml) pages.

### Create a new dbt Core v1 adapter

If you see something missing from the lists above and you're interested in developing an integration, read more about adapters and how they're developed in [Build, test, document, and promote adapters](/guides/adapter-creation).

If you have a new adapter, add it to this list using a pull request. See [Build, test, document, and promote adapters](/guides/adapter-creation) for more information on documenting your adapter.

### Create a new dbt Core v2 adapter

dbt Core v2 is a Rust-based rewrite of the dbt engine built around a single monorepo. Instead of maintaining a separate Python package per warehouse, all adapters live together, organized by feature area rather than warehouse, inside `dbt-labs/dbt-core`. A bug fix in authentication or relation logic benefits every adapter at once, and your contribution makes the entire ecosystem stronger.

ADBC drivers handle connection management—pre-compiled binaries you register, not write. You build the warehouse-specific logic: credentials, relation naming, SQL macros, and catalog queries across roughly 13 files in total.

Contributing a dbt Core v2 adapter means opening a pull request directly against the monorepo. You'll register your warehouse in the `AdapterType` enum, implement credential and relation types in Rust, write Jinja macros for your SQL dialect, and wire up basic integration tests against a real warehouse. The Rust compiler's match exhaustiveness enforcement acts as your to-do list — every unhandled variant is a compile error until your adapter is complete. For a step-by-step walkthrough, see [Contribute a dbt Core v2 adapter](/guides/adapter-creation-v2).
