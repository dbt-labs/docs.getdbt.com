---
title: "About dbt Core installation"
description: "Install dbt Core locally to begin transforming your data."
pagination_next: "docs/core/pip-install"
pagination_prev: null
---

[<Constant name="core" />](https://github.com/dbt-labs/dbt-core) is an open-source project where you can develop from the command line and run your dbt project.

To use <Constant name="core" />, your workflow generally looks like:

1. **Build your dbt project in a code editor &mdash;** popular choices include VS Code and Atom.

2. **Run your project from the command line &mdash;** macOS ships with a default Terminal program, however you can also use iTerm or the command line prompt within a code editor to execute dbt commands.

:::info How we set up our computers for working on dbt projects

We've written a [guide](https://discourse.getdbt.com/t/how-we-set-up-our-computers-for-working-on-dbt-projects/243) for our recommended setup when running dbt projects using <Constant name="core" />.

:::

If you're using the command line, we recommend learning some basics of your terminal to help you work more effectively. In particular, it's important to understand `cd`, `ls` and `pwd` to be able to navigate through the directory structure of your computer easily.

## Install dbt Core

You can install <Constant name="core" /> on the command line by using one of these methods:

- [Use pip to install dbt](/docs/core/pip-install) (recommended)
- [Use a Docker image to install dbt](/docs/core/docker-install)
- [Install dbt from source](/docs/core/source-install)
- You can also develop locally using the [<Constant name="cloud" /> CLI](/docs/cloud/cloud-cli-installation). The <Constant name="cloud" /> CLI and <Constant name="core" /> are both command line tools that let you run dbt commands. The key distinction is the <Constant name="cloud" /> CLI is tailored for <Constant name="cloud" />'s infrastructure and integrates with all its [features](/docs/cloud/about-cloud/dbt-cloud-features).

## Upgrading dbt Core

dbt provides a number of resources for understanding [general best practices](/blog/upgrade-dbt-without-fear) while upgrading your dbt project as well as detailed [migration guides](/docs/dbt-versions/core-upgrade) highlighting the changes required for each [minor and major release](/docs/dbt-versions/core).

In addition to reviewing those resources, upgrading <Constant name="core" /> depends on how you installed it.

<Expandable alt_header="Upgrading with pip">

If you installed dbt using [pip](/docs/core/pip-install) (recommended for local development), upgrade <Constant name="core" /> first:

```
python -m pip install --upgrade dbt-core
```

Then upgrade your installed adapter package:

```
python -m pip install --upgrade dbt-ADAPTER_NAME
```

For example:
```
python -m pip install --upgrade dbt-postgres
```

Most users should upgrade both <Constant name="core" /> and their adapter to keep versions aligned.

</Expandable>

<Expandable alt_header="Upgrading with docker">

dbt publishes [Docker](/docs/core/docker-install) images per adapter. To upgrade, pull a newer tag for your adapter image:

```
docker pull ghcr.io/dbt-labs/<db_adapter_name>:<version_tag>
```

For example:

```
docker pull ghcr.io/dbt-labs/dbt-postgres:1.10.latest
```

</Expandable>

## About dbt data platforms and adapters

dbt works with a number of different data platforms (databases, query engines, and other SQL-speaking technologies). It does this by using a dedicated _adapter_ for each. When you install <Constant name="core" />, you'll also want to install the specific adapter for your database. For more details, see [Supported Data Platforms](/docs/supported-data-platforms).

:::tip Pro tip: Using the --help flag

Most command-line tools, including dbt, have a `--help` flag that you can use to show available commands and arguments. For example, you can use the `--help` flag with dbt in two ways:<br /><br />
&mdash; `dbt --help`: Lists the commands available for dbt<br />
&mdash; `dbt run --help`: Lists the flags available for the `run` command

:::

## Create a project

After installing <Constant name="core" />, create your first [dbt project](/docs/build/projects) using the [`dbt init`](/reference/commands/init) command. This initializes a new project with the standard dbt directory structure and helps verify that your installation is working as expected.

## Related content

- [Quickstart for dbt Core from a manual install](https://docs.getdbt.com/guides/manual-install?step=1)


