---
title: "Trusted adapters"
id: "trusted-adapters"
---

Trusted adapters are adapters not maintained by dbt Labs, that we feel comfortable recommending to users for use in production.

### to be toggle heading'd

Free and open-source tools for the data professional are increasingly abundant. This is by-and-large a *good thing*, however it requires due dilligence that wasn't required in a paid-license, closed-source software world. Before taking a dependency on an open-source projet is is important to determine the answer to the following questions:

1. Does it work?
2. Does anyone "own" the code, or is anyone liable for ensuring it works?
3. Do bugs get fixed quickly?
4. Does it stay up-to-date with new Core features?
5. Is the usage substantial enough to self-sustain?
6. What risks do I take on by taking a dependency on this library?

### for adapter maintainers

if you're an adapter maintainer interested in joining the trusted adapter program click [Building a Trusted Adapter](8-building-a-trusted-adapter).

### Trusted vs Verified

The Verification program (currently paused) exists to highlight adapters that meets both of the following criteria:

- the guidelines given in the Trusted program,
- formal agreements required for integration with dbt Cloud

For more information on the Verified Adapter program, reach out the [dbt Labs parnterships team](partnerships@dbtlabs.com)


### Trusted adapters

The following are **Trusted adapters** ✓ you can connect to in dbt Core:

<div className="grid--4-col">

<Card
    title="Athena*"
    body="<a href='/docs/core/connect-data-platform/athena-setup'><img src='/img/icons/dbt-bit.svg' width='7%'/>Install using the CLI </a> <br /><br /><a href=https://badge.fury.io/py/dbt-athena><img src=https://badge.fury.io/py/dbt-athena.svg/></a>"
    icon="rocket"/>

<Card
    title="DuckDB"
    body="<a href='/docs/core/connect-data-platform/duckdb-setup'><img src='/img/icons/dbt-bit.svg' width='7%'/>Install using the CLI </a> <br /><br /><a href=https://badge.fury.io/py/dbt-duckdb><img src=https://badge.fury.io/py/dbt-duckdb.svg/></a>"
    icon="rocket"/>

<Card
    title="PlaceholdDB*"
    body="<a href='/docs/core/connect-data-platform/databricks-setup'><img src='/img/icons/dbt-bit.svg' width='7%'/>Install using the CLI </a> <br /><br /><a href=https://badge.fury.io/py/dbt-databricks><img src=https://badge.fury.io/py/dbt-databricks.svg/></a>"
    icon="rocket"/>

<Card
    title="PlaceholdDB*"
    body="<a href='/docs/core/connect-data-platform/databricks-setup'><img src='/img/icons/dbt-bit.svg' width='7%'/>Install using the CLI </a> <br /><br /><a href=https://badge.fury.io/py/dbt-databricks><img src=https://badge.fury.io/py/dbt-databricks.svg/></a>"
    icon="rocket"/>

</div>
