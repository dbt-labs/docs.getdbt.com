---
title: "Workflow"
id: "using-the-command-line-interface"
---

A dbt project can be executed via the Command Line Interface (CLI). To use dbt, your workflow generally looks like:
* **Build your dbt project in a code editor:** popular choices include VSCode and Atom.
* **Run your project from the command line:**
  * macOS ships with a default Terminal program, however you can also use iTerm or the command line prompt within a code editor to execute dbt commands

<Callout type="info" title="How we set up our projects for working on dbt projects">

We've written a [guide](https://discourse.getdbt.com/t/how-we-set-up-our-computers-for-working-on-dbt-projects/243) for our recommended setup when running dbt projects using the CLI.

</Callout>

Your command line has a concept of a "working directory": each command that you run is executed from a directory on your computer. To run your dbt project using the command line, you'll need to ensure that your command line's working directory is within your dbt project.


<Lightbox src="/img/docs/running-a-dbt-project/abbd17c-Screen_Shot_2019-11-11_at_12.20.29_PM.png" title="Use `pwd` to ensure that your terminal's working directory is your dbt project."/>

Once your working directory is your dbt project, you can execute dbt commands:


<Lightbox src="/img/docs/running-a-dbt-project/6245b3b-ezgif-4-2bcd214f09db.gif" title=""/>



<Callout type="success" title="Pro tip: Using the --help flag">

Most command line tools (dbt included) have a `--help` flag. This flag is useful if you ever want to check which commands and arguments you can use. For example:
• `dbt --help`: this will list the commands available
• `dbt run --help`: this will the flags available for the `run` command

</Callout>

If you're using the CLI, we recommend learning some basics of your terminal to help you work more effectively. In particular, it's important to understand `cd`, `ls` and `pwd` to be able to navigate through the directory structure of your computer easily.

To install the CLI, check out our OS-specific guides in this section.

For a full list of dbt commands, see the [dbt Command reference](command-line-interface) section.