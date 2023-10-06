---
title: "Run your dbt projects"
id: "run-your-dbt-projects"
---
You can run your dbt projects with [dbt Cloud](/docs/cloud/about-cloud/dbt-cloud-features) or [dbt Core](https://github.com/dbt-labs/dbt-core):

- **dbt Cloud**: A hosted application where you can develop directly from a web browser using the [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud). It also natively supports developing using a command line, [dbt Cloud CLI](/docs/cloud/cloud-cli-installation). Among other features, dbt Cloud provides: 

  - Development environment to help you build, test, run, and [version control](/docs/collaborate/git-version-control) your project faster.
  - Share your [dbt project's documentation](/docs/collaborate/build-and-view-your-docs) with your team.
  - Integrates with the dbt Cloud IDE, allowing you to run development tasks and environment in the dbt Cloud UI for a seamless experience.
  - Use the dbt Cloud CLI to develop and run dbt commands against your dbt Cloud development environment from your local command line.
  - For more details, refer to [Develop in the Cloud](/docs/cloud/about-cloud-develop).

- **dbt Core**: An open source project where you can develop from the command line.

The dbt Cloud CLI and dbt Core are both command line tools that enable you to run dbt commands. The key distinction is the dbt Cloud CLI is tailored for dbt Cloud's infrastructure and integrates with all its [features](/docs/cloud/about-cloud/dbt-cloud-features).

The command line is available from your computer's terminal application such as Terminal and iTerm. With the command line, you can run commands and do other work from the current working directory on your computer. Before running the dbt project from the command line, make sure you are working in your dbt project directory. Learning terminal commands such as `cd` (change directory), `ls` (list directory contents), and `pwd` (present working directory) can help you navigate the directory structure on your system.

In dbt Cloud or dbt Core, the commands you commonly use are:

- [dbt run](/reference/commands/run) &mdash; Runs the models you defined in your project
- [dbt build](/reference/commands/build) &mdash; Builds and tests your selected resources such as models, seeds, snapshots, and tests
- [dbt test](/reference/commands/test) &mdash; Executes the tests you defined for your project

For information on all dbt commands and their arguments (flags), see the [dbt command reference](/reference/dbt-commands). If you want to list all dbt commands from the command line, run `dbt --help`. To list a dbt command’s specific arguments, run `dbt COMMAND_NAME --help` .

## Related docs

- [How we set up our computers for working on dbt projects](https://discourse.getdbt.com/t/how-we-set-up-our-computers-for-working-on-dbt-projects/243)
- [Model selection syntax](/reference/node-selection/syntax)
- [dbt Cloud CLI](/docs/cloud/cloud-cli-installation)
- [Cloud IDE features](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud#ide-features)
- [Does dbt offer extract and load functionality?](/faqs/Project/transformation-tool)
- [Why does dbt compile need a data platform connection](/faqs/Warehouse/db-connection-dbt-compile)
