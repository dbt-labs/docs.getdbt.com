---
title: "Available adapters"
id: "community-adapters"
sidebar_label: "Available adapters"
description: "Find an adapter to connect dbt to your data platform. Adapters are maintained by dbt Labs, partners, and the community."
hide_table_of_contents: true
availability: all_users
---

<VersionBlock lastVersion="1.99">

:::note
The Trusted Adapter Program for v1 has ended. All dbt, partner, and community maintained adapters are listed together on this page.
:::

</VersionBlock>

Adapters connect dbt to data platforms. They are maintained by dbt Labs, partners, and community members.

We welcome [contributions to an existing adapter](/docs/contribute-dbt-adapters#contribute-to-a-pre-existing-adapter). Many adapters are maintained by volunteers, so be kind and help where you can.

<VersionBlock lastVersion="1.99">

To build a v1 adapter, refer to [Build, test, document, and promote adapters](/guides/adapter-creation).

</VersionBlock>

<VersionBlock firstVersion="2.0">

To contribute a v2 adapter, refer to [Contribute a dbt v2 adapter](/guides/adapter-creation-v2?step=1).

### Adapter designations

Every v2 adapter lives in the [`dbt-labs/dbt`](https://github.com/dbt-labs/dbt) repository and ships in the same dbt binary. Each adapter card shows a designation that tells you who maintains the adapter's warehouse-specific code:

- `first-party`: dbt Labs builds, tests, releases, and maintains the adapter, and triages its issues. dbt downloads the adapter's ADBC driver from the dbt Labs CDN automatically. First-party adapters move through lifecycle stages: alpha, beta, preview, and general availability (GA).
- `community-maintained`: A community member or the data platform vendor contributes the adapter through pull requests and maintains its warehouse-specific code. dbt Labs reviews and merges those pull requests and maintains the code that all adapters share. Community-maintained adapters don't have a lifecycle stage, so their pages show a `community-maintained` label instead. dbt Labs doesn't guarantee that its CDN hosts their ADBC driver.

A designation doesn't decide whether an adapter is available in the <Constant name="dbt_platform" />. For more details, refer to the [adapter designations FAQ](#adapter-designations-faq).

</VersionBlock>

import CommunityAdapters from '/snippets/_community-adapters.md';

<CommunityAdapters />

<VersionBlock lastVersion="1.99">

### Additional adapters

<SimpleTable>

| Data platform |  |  |
| --- | --- | --- |
| [Confluent Cloud](/docs/local/connect-data-platform/confluent-setup) | [CrateDB](/docs/local/connect-data-platform/cratedb-setup) | [Databend Cloud](/docs/local/connect-data-platform/databend-setup) |
| [DeltaStream](/docs/local/connect-data-platform/deltastream-setup) | [Doris & SelectDB](/docs/local/connect-data-platform/doris-setup) | [Extrica](/docs/local/connect-data-platform/extrica-setup) |
| [Firebird](/docs/local/connect-data-platform/firebird-setup) | [Hologres](/docs/local/connect-data-platform/hologres-setup) | [IBM watsonx.data - Spark](/docs/local/connect-data-platform/watsonx-spark-setup) |
| [Infer](/docs/local/connect-data-platform/infer-setup) | [iomete](/docs/local/connect-data-platform/iomete-setup) | [MaxCompute](/docs/local/connect-data-platform/maxcompute-setup) |
| [MindsDB](/docs/local/connect-data-platform/mindsdb-setup) | [MySQL](/docs/local/connect-data-platform/mysql-setup) | [Redis](/docs/local/connect-data-platform/redis-setup) |
| [Rockset](/docs/local/connect-data-platform/rockset-setup) | [Sail](/docs/local/connect-data-platform/sail-setup) | [SQL Server & Azure SQL](/docs/local/connect-data-platform/mssql-setup) |
| [SQLite](/docs/local/connect-data-platform/sqlite-setup) | [Starrocks](/docs/local/connect-data-platform/starrocks-setup) | [TiDB](/docs/local/connect-data-platform/tidb-setup) |
| [TimescaleDB](https://dbt-timescaledb.debruyn.dev/) | [Upsolver](/docs/local/connect-data-platform/upsolver-setup) | [Vertica](/docs/local/connect-data-platform/vertica-setup) |
| [Watsonx-Presto](/docs/local/connect-data-platform/watsonx-presto-setup) | [Yellowbrick](/docs/local/connect-data-platform/yellowbrick-setup) |  |

</SimpleTable>

</VersionBlock>

<VersionBlock firstVersion="2.0">

### Adapter designations FAQ

Each v2 adapter on this page is labeled `first-party` or `community-maintained`. These questions explain what the labels mean for you as a user or a contributor.

<Expandable alt_header="What's the difference between first-party and community-maintained adapters?">

The difference is who maintains the adapter's warehouse-specific code. Both kinds live in the [`dbt-labs/dbt`](https://github.com/dbt-labs/dbt) repository and ship in the same dbt binary.

- `first-party`: dbt Labs builds, tests, releases, and maintains the adapter, and triages its issues.
- `community-maintained`: A community member or the data platform vendor contributes the adapter through pull requests and maintains its warehouse-specific code. dbt Labs reviews and merges those pull requests and maintains the code that all adapters share.

</Expandable>

<Expandable alt_header="Does the designation change how I install an adapter?">

It depends on the designation. The dbt binary doesn't bundle ADBC drivers. For a first-party adapter, dbt downloads the driver from the dbt Labs CDN the first time you run a dbt command, so you don't install it yourself. For a community-maintained adapter, dbt Labs doesn't guarantee that its CDN hosts the driver. Check the adapter's setup guide to find out whether you need to install it yourself.

For the network access that driver downloads need, and how to install drivers in a restricted network, refer to [dbt v2 networking requirements](/docs/local/dbt-networking-requirements?version=2#adapter-drivers).

</Expandable>

<Expandable alt_header="Do community-maintained adapters have a lifecycle stage?">

No. Only first-party adapters move through lifecycle stages: alpha, beta, preview, and general availability (GA). A first-party adapter's setup page shows a label, such as Beta or Preview, until the adapter reaches GA.

Community-maintained adapters don't have a lifecycle stage. Their pages show a `community-maintained` label in place of a lifecycle label.
</Expandable>

<Expandable alt_header="Where do I report a problem with an adapter?">

Open an issue in the [`dbt-labs/dbt` repository](https://github.com/dbt-labs/dbt/issues) for either designation. For a community-maintained adapter, the adapter's maintainers respond to issues about its warehouse-specific behavior, and dbt Labs handles issues in the shared code.

</Expandable>

<Expandable alt_header="Can I use a community-maintained adapter in the dbt platform?">

The designation doesn't decide availability in the <Constant name="dbt_platform" />. To check whether an adapter is available today, look for a **Set up in the dbt platform** link on its card on this page.

dbt Labs is working toward a future where any v2 adapter, first-party or community-maintained, can be supported in the <Constant name="dbt_platform" />. A v2 adapter with a working ADBC driver is the starting point.

</Expandable>

<Expandable alt_header="How do I get an adapter into the dbt platform?">

dbt Labs is still defining this process. Today, the path looks like this:

1. Get an ADBC driver for your data platform. You need a working driver before anything else. Build one yourself, work with a driver specialist such as [Columnar](https://columnar.tech/), or combine both approaches. For where to look first, refer to [Contribute a dbt v2 adapter](/guides/adapter-creation-v2).
2. Contribute a v2 adapter. Open pull requests against [`dbt-labs/dbt`](https://github.com/dbt-labs/dbt) and get the adapter merged.
3. Ask for <Constant name="dbt_platform" /> support. Reach out through the [Fivetran contact page](https://www.fivetran.com/contact), or explore the [Fivetran Partner Program](https://www.fivetran.com/partners/become-a-partner) if you represent the data platform vendor. Requests are prioritized partly on business impact, so it helps to bring details such as your total addressable market (TAM), expected annual recurring revenue (ARR), and customer demand. The `dbt-labs/dbt` repository is for the open source code only, so don't open an issue there for <Constant name="dbt_platform" /> requests.

New <Constant name="dbt_platform" /> support is for v2 adapters only. If your adapter isn't in the <Constant name="dbt_platform" /> today, a v1 adapter alone isn't enough.

</Expandable>

<Expandable alt_header="If I contribute a new adapter, which designation does it get?">

A new adapter that you contribute is `community-maintained`. You, or your organization, maintain its warehouse-specific code, and the dbt Labs adapters team reviews your pull requests. To get started, refer to [Contribute a dbt v2 adapter](/guides/adapter-creation-v2).

</Expandable>

</VersionBlock>
