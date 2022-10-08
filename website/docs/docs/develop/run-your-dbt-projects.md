---
title: "Run your dbt projects"
id: "run-your-dbt-projects"
---
You can run your dbt projects with [dbt Cloud](docs/develop/dbt-cloud-features) and [dbt Core](https://github.com/dbt-labs/dbt-core). dbt Cloud is a hosted application where you can develop directly from a web browser. dbt Core is an open source project where you can develop from the command line.

dbt Cloud provides a hosted development environment (among other features) to help you build, test, and version control your project faster and more easily. These development tasks are directly built in to dbt Cloud. See [dbt Cloud IDE] (link to one of the IDE pages mirna is working on) for more details.

With dbt Core, you can run your dbt projects from the command line. The command line interface (CLI) is available from your computer's terminal program such as Terminal and iTerm. When using the command line, you can run commands and do other work from the current working directory on your computer. Before running the dbt project from the command line, make sure you are working in your dbt project directory. Learning terminal commands such as `cd` (change directory), `ls` (list directory contents), and `pwd` (present working directory) can help you navigate the directory structure on your system.

When working with a project, the dbt commands you commonly execute are:

- [dbt run](/reference/commands/run) &mdash; Runs the models you defined in your project
- [dbt build](/reference/commands/build) &mdash; Builds and tests your selected resources such as models, seeds, snapshots, and tests
- [dbt test](/reference/commands/test) &mdash; Executes the tests you defined for your project

See the [dbt command reference](https://docs.getdbt.com/reference/dbt-commands) for complete help information on all dbt commands and their arguments (flags). If you want to list all dbt commands from the command line, run `dbt --help`. To list a dbt command’s specific arguments, run `dbt COMMAND_NAME --help` .

## Related docs

- [How we set up our computers for working on dbt projects](https://discourse.getdbt.com/t/how-we-set-up-our-computers-for-working-on-dbt-projects/243)
- [Model selection syntax](https://docs.getdbt.com/reference/node-selection/syntax)
