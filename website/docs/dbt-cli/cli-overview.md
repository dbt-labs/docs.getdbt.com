---
title: CLI overview

---
dbt ships with a Command Line Interface (CLI) for running your dbt project. The dbt CLI is free to use and [open source](https://github.com/dbt-labs/dbt).

Your command line has a concept of a "working directory": each command that you run is executed from a directory on your computer. To run your dbt project using the command line, you'll need to ensure that your command line's working directory is within your dbt project.


<Lightbox src="/img/docs/running-a-dbt-project/abbd17c-Screen_Shot_2019-11-11_at_12.20.29_PM.png" title="Use `pwd` to ensure that your terminal's working directory is your dbt project."/>

Once your working directory is your dbt project, you can execute dbt commands:

<Lightbox src="/img/docs/running-a-dbt-project/6245b3b-ezgif-4-2bcd214f09db.gif" title=""/>

:::tip Pro tip: Using the --help flag

Most command line tools (dbt included) have a `--help` flag. This flag is useful if you ever want to check which commands and arguments you can use. For example:
• `dbt --help`: this will list the commands available
• `dbt run --help`: this will the flags available for the `run` command

:::

A full list of dbt commands can be found in the [reference section](dbt-commands)
