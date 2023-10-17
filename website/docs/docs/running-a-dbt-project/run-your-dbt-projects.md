---
title: "Run your dbt projects"
id: "run-your-dbt-projects"
pagination_prev: null
---
You can run your dbt projects with [dbt Cloud](/docs/cloud/about-cloud/dbt-cloud-features) and [dbt Core](https://github.com/dbt-labs/dbt-core). dbt Cloud is a hosted application where you can develop directly from a web browser. dbt Core is an open source project where you can develop from the command line.

Among other features, dbt Cloud provides a development environment to help you build, test, run, and [version control](/docs/collaborate/git-version-control) your project faster. It also includes an easier way to share your [dbt project's documentation](/docs/collaborate/build-and-view-your-docs) with your team. These development tasks are directly built into dbt Cloud for an _integrated development environment_ (IDE). Refer to [Develop in the Cloud](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) for more details.

With dbt Core, you can run your dbt projects from the command line. The command line interface (CLI) is available from your computer's terminal application such as Terminal and iTerm. When using the command line, you can run commands and do other work from the current working directory on your computer. Before running the dbt project from the command line, make sure you are working in your dbt project directory. Learning terminal commands such as `cd` (change directory), `ls` (list directory contents), and `pwd` (present working directory) can help you navigate the directory structure on your system.

When running your project from dbt Core or dbt Cloud, the commands you commonly use are:

- [dbt run](/reference/commands/run) &mdash; Runs the models you defined in your project
- [dbt build](/reference/commands/build) &mdash; Builds and tests your selected resources such as models, seeds, snapshots, and tests
- [dbt test](/reference/commands/test) &mdash; Executes the tests you defined for your project

For information on all dbt commands and their arguments (flags), see the [dbt command reference](/reference/dbt-commands). If you want to list all dbt commands from the command line, run `dbt --help`. To list a dbt command’s specific arguments, run `dbt COMMAND_NAME --help` .

## Related docs

- [How we set up our computers for working on dbt projects](https://discourse.getdbt.com/t/how-we-set-up-our-computers-for-working-on-dbt-projects/243)
- [Model selection syntax](/reference/node-selection/syntax)
- [Cloud IDE features](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud#ide-features)
- [Does dbt offer extract and load functionality?](/faqs/Project/transformation-tool)
- [Why does dbt compile need a data platform connection](/faqs/Warehouse/db-connection-dbt-compile)
