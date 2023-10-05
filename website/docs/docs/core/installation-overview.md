---
title: "About installing dbt"
id: "installation"
description: "You can install dbt Core using a few different tested methods."
pagination_next: "docs/core/homebrew-install"
pagination_prev: null
---

You can install dbt Core on the command line by using one of these methods:

- [Use pip to install dbt](/docs/core/pip-install) (recommended)
- [Use Homebrew to install dbt](/docs/core/homebrew-install)
- [Use a Docker image to install dbt](/docs/core/docker-install)
- [Install dbt from source](/docs/core/source-install)

## Upgrading dbt Core

dbt provides a number of resources for understanding [general best practices](/blog/upgrade-dbt-without-fear) while upgrading your dbt project as well as detailed [migration guides](/guides/migration/versions/upgrading-to-v1.4) highlighting the changes required for each minor and major release, and [core versions](/docs/dbt-versions/core)

- [Upgrade Homebrew](/docs/core/homebrew-install#upgrading-dbt-and-your-adapter)
- [Upgrade `pip`](/docs/core/pip-install#change-dbt-core-versions)


## About dbt data platforms and adapters

dbt works with a number of different data platforms (databases, query engines, and other SQL-speaking technologies). It does this by using a dedicated _adapter_ for each. When you install dbt Core, you'll also want to install the specific adapter for your database. For more details, see [Supported Data Platforms](/docs/supported-data-platforms).
