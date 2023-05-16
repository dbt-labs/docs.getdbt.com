---
title: "Connect to an adapter"
id: "connect-adapters"
---

You can connect dbt to a data platform in the following ways:

- **Set up in dbt Cloud** &mdash; A hosted architecture for running dbt Core across your organization, dbt Cloud lets you seamlessly [connect](/docs/about-setup) with a variety of [verified](#verified-adapters) data platform providers directly in the dbt Cloud UI, allowing you to explore the fastest and most reliable way to deploy dbt. 

    Data platforms supported in dbt Cloud are verified and [maintained](#maintainers) by dbt Labs or partners. This level of support ensures that users can trust certain adapters for use in production. 

- **Install adapter with the dbt Core** &mdash; An open-source tool where you can install dbt Core locally using the CLI. dbt communicates with a number of different data platforms by using a dedicated adapter for each. When you install dbt Core, you'll also need to install the specific adapter for your database, [connect to dbt Core](/docs/core/about-core-setup), and set up a `profiles.yml` file. 

    Data platforms supported in dbt Core may be verified or unverified, and maintained by dbt Labs, partners, or community members. 

    - With a few exceptions [^1], you can install all adapters listed under "Verified adapters" from PyPI using `pip install <ADAPTER-NAME>`. The installation will include `dbt-core` and any other required dependencies, which may include both other dependencies and even other adapter plugins. Read more about [installing dbt](/docs/core/installation).


### Maintainers

Who made and maintains an adapter is certainly relevant, but we recommend using an adapter's verification status to determine the quality and health of an adapter. So far there are three categories of maintainers:

| Supported by | Maintained By                                                                                                                                                                                                                                  |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| dbt Labs     | dbt Labs maintains a set of adapter plugins for some of the most common databases, warehouses, and platforms. As for why particular data platforms were chosen, see ["Why Verify an Adapter"](7-verifying-a-new-adapter#why-verify-an-adapter) |
| Partner      | These adapter plugins are built and maintained by the same people who build and maintain the complementary data technology.                                                                                                                    |
| Community    | These adapter plugins are contributed and maintained by members of the community. 🌱                                                                                                                                                          |
