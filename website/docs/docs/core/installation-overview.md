---
title: "About dbt Core and installation"
description: "You can install dbt Core using a few different tested methods."
pagination_next: "docs/core/homebrew-install"
pagination_prev: null
---

[dbt Core](https://github.com/dbt-labs/dbt-core) is an open sourced project where you can develop from the command line and run your dbt project.

To use dbt Core, your workflow generally looks like:

1. **Build your dbt project in a code editor &mdash;** popular choices include VSCode and Atom.

2. **Run your project from the command line &mdash;** macOS ships with a default Terminal program, however you can also use iTerm or the command line prompt within a code editor to execute dbt commands.

:::info How we set up our computers for working on dbt projects

We've written a [guide](https://discourse.getdbt.com/t/how-we-set-up-our-computers-for-working-on-dbt-projects/243) for our recommended setup when running dbt projects using dbt Core.

:::

If you're using the command line, we recommend learning some basics of your terminal to help you work more effectively. In particular, it's important to understand `cd`, `ls` and `pwd` to be able to navigate through the directory structure of your computer easily.

## Install dbt Core

You can install dbt Core on the command line by using one of these methods:

- [Use pip to install dbt](/docs/core/pip-install) (recommended)
- [Use Homebrew to install dbt](/docs/core/homebrew-install)
- [Use a Docker image to install dbt](/docs/core/docker-install)
- [Install dbt from source](/docs/core/source-install)

**Note** &mdash; The [dbt Cloud CLI](/docs/cloud/cloud-cli-installation) and the open-sourced dbt Core are both command line tools that let you run dbt commands. The key distinction is the dbt Cloud CLI is tailored for dbt Cloud's infrastructure and integrates with all its [features](/docs/cloud/about-cloud/dbt-cloud-features).

:::tip Pro tip: Using the --help flag

Most command-line tools, including dbt, have a `--help` flag that you can use to show available commands and arguments. For example, you can use the `--help` flag with dbt in two ways:<br /><br />
&mdash; `dbt --help`: Lists the commands available for dbt<br />
&mdash; `dbt run --help`: Lists the flags available for the `run` command

:::

## Upgrading dbt Core

dbt provides a number of resources for understanding [general best practices](/blog/upgrade-dbt-without-fear) while upgrading your dbt project as well as detailed [migration guides](/docs/dbt-versions/core-upgrade/upgrading-to-v1.4) highlighting the changes required for each minor and major release, and [core versions](/docs/dbt-versions/core)

- [Upgrade Homebrew](/docs/core/homebrew-install#upgrading-dbt-and-your-adapter)
- [Upgrade `pip`](/docs/core/pip-install#change-dbt-core-versions)


## About dbt data platforms and adapters

dbt works with a number of different data platforms (databases, query engines, and other SQL-speaking technologies). It does this by using a dedicated _adapter_ for each. When you install dbt Core, you'll also want to install the specific adapter for your database. For more details, see [Supported Data Platforms](/docs/supported-data-platforms).
