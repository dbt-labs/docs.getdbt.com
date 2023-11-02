---
title: "CLI overview"
description: "Run your dbt project from the command line."
---

dbt Core ships with a command-line interface (CLI) for running your dbt project. dbt Core and its CLI are free to use and available as an [open source project](https://github.com/dbt-labs/dbt-core).

When using the command line, you can run commands and do other work from the current or _working directory_ on your computer. Before running the dbt project from the command line, make sure the working directory is your dbt project directory. For more details, see "[Creating a dbt project](/docs/build/projects)."


<Lightbox src="/img/docs/running-a-dbt-project/abbd17c-Screen_Shot_2019-11-11_at_12.20.29_PM.png" title="Use `pwd` to ensure that your terminal's working directory is your dbt project."/>

Once you verify your dbt project is your working directory, you can execute dbt commands. A full list of dbt commands can be found in the [reference section](/reference/dbt-commands).

<Lightbox src="/img/docs/running-a-dbt-project/6245b3b-ezgif-4-2bcd214f09db.gif" title=""/>

:::tip Pro tip: Using the --help flag

Most command-line tools, including dbt, have a `--help` flag that you can use to show available commands and arguments. For example, you can use the `--help` flag with dbt in two ways:
• `dbt --help`: Lists the commands available for dbt
• `dbt run --help`: Lists the flags available for the `run` command

:::

