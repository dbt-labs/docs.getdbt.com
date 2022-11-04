---
title: "About the CLI"
id: "about-the-cli"
---

dbt ships with a Command Line Interface (CLI) for running your dbt project. This way of running dbt a dbt project is free and open source.

To use the CLI, your workflow generally looks like:
* **Build your dbt project in a code editor:** popular choices include VSCode and Atom.
* **Run your project from the command line:**
  * macOS ships with a default Terminal program, however you can also use iTerm or the command line prompt within a code editor to execute dbt commands

The CLI is also available for dbt Cloud.  Additional components must be installed for the CLI to communicate via dbt Cloud APIs.  For more information, visit the [dbt Cloud CLI GitHub repository](https://github.com/data-mie/dbt-cloud-cli)

:::info How we set up our computers for working on dbt projects

We've written a [guide](https://discourse.getdbt.com/t/how-we-set-up-our-computers-for-working-on-dbt-projects/243) for our recommended setup when running dbt projects using the CLI.

:::

If you're using the CLI, we recommend learning some basics of your terminal to help you work more effectively. In particular, it's important to understand `cd`, `ls` and `pwd` to be able to navigate through the directory structure of your computer easily.

You can find more information on installing and setting up the dbt CLI [here](dbt-cli/cli-overview).
