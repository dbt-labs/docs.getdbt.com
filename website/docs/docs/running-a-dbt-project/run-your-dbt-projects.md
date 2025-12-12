---
title: "Run your dbt projects"
id: "run-your-dbt-projects"
pagination_prev: null
---
You can run your dbt projects with [<Constant name="cloud" />](/docs/cloud/about-cloud/dbt-cloud-features) or [<Constant name="core" />](https://github.com/dbt-labs/dbt-core):

- **<Constant name="cloud" />**: A hosted application where you can develop directly from a web browser using the [<Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-in-studio). It also natively supports developing using a command line interface, [<Constant name="cloud" /> CLI](/docs/cloud/cloud-cli-installation). Among other features, <Constant name="cloud" /> provides: 

  - Development environment to help you build, test, run, and [version control](/docs/cloud/git/git-version-control) your project faster.
  - Share your [dbt project's documentation](/docs/build/documentation) with your team.
  - Integrates with the <Constant name="cloud_ide" />, allowing you to run development tasks and environment in the <Constant name="cloud" /> UI for a seamless experience.
  - The <Constant name="cloud" /> CLI to develop and run dbt commands against your <Constant name="cloud" /> development environment from your local command line.
  - For more details, refer to [Develop dbt](/docs/cloud/about-develop-dbt).

- **<Constant name="core" />**: An open source project where you can develop from the [command line](/docs/core/installation-overview).

The <Constant name="cloud" /> CLI and <Constant name="core" /> are both command line tools that enable you to run dbt commands. The key distinction is the <Constant name="cloud" /> CLI is tailored for <Constant name="cloud" />'s infrastructure and integrates with all its [features](/docs/cloud/about-cloud/dbt-cloud-features).

The command line is available from your computer's terminal application such as Terminal and iTerm. With the command line, you can run commands and do other work from the current working directory on your computer. Before running the dbt project from the command line, make sure you are working in your dbt project directory. Learning terminal commands such as `cd` (change directory), `ls` (list directory contents), and `pwd` (present working directory) can help you navigate the directory structure on your system.

In <Constant name="cloud" /> or <Constant name="core" />, the commands you commonly use are:

- [dbt run](/reference/commands/run) &mdash; Runs the models you defined in your project
- [dbt build](/reference/commands/build) &mdash; Builds and tests your selected resources such as models, seeds, snapshots, and tests
- [dbt test](/reference/commands/test) &mdash; Executes the tests you defined for your project

For information on all dbt commands and their arguments (flags), see the [dbt command reference](/reference/dbt-commands). If you want to list all dbt commands from the command line, run `dbt --help`. To list a dbt command’s specific arguments, run `dbt COMMAND_NAME --help` .

## Related docs

- [How we set up our computers for working on dbt projects](https://discourse.getdbt.com/t/how-we-set-up-our-computers-for-working-on-dbt-projects/243)
- [Model selection syntax](/reference/node-selection/syntax)
- [<Constant name="cloud" /> CLI](/docs/cloud/cloud-cli-installation)
- [Cloud <Constant name="cloud_ide" /> features](/docs/cloud/studio-ide/develop-in-studio#ide-features)
- [Does dbt offer extract and load functionality?](/faqs/Project/transformation-tool)
- [Why does dbt compile need a data platform connection](/faqs/Warehouse/db-connection-dbt-compile)
