---
title: "Run your dbt projects"
id: "run-your-dbt-projects"
pagination_prev: null
---

You can run your dbt projects on the [<Constant name="dbt_platform" />](/docs/cloud/about-cloud/dbt-cloud-features) (hosted) or locally. The dbt framework uses a single language for your project code and two engines that compile and execute it: the [<Constant name="fusion_engine" />](/docs/fusion/about-fusion) and [<Constant name="core" />](https://github.com/dbt-labs/dbt-core). The <Constant name="dbt_platform" /> supports both engines; locally, you can use either.

<Expandable alt_header="About the dbt framework">

The **dbt language** is the code you write in your dbt project and has become the industry standard for data transformation. The **dbt engine** compiles that code, executes the transformation graph, and produces metadata. <Constant name="core_engine" /> (Python) is the engine that has powered dbt for years. The <Constant name="fusion_engine" /> (Rust) is the next-generation engine, designed for faster compilation and execution. dbt Labs maintains and expands the dbt language across both engines.

</Expandable>

## <Constant name="dbt_platform" />

The <Constant name="dbt_platform" /> is a hosted application that gives you a complete environment to build, test, deploy, and collaborate on dbt projects. You can develop in the browser or locally and still use the platform: the <Constant name="cloud_ide" />, <Constant name="cloud" /> CLI, and VS Code extension all connect to the platform and run on the <Constant name="fusion_engine" /> or <Constant name="core" /> engine.

- **[<Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-in-studio)** &mdash; Develop in your browser. Build, test, run, and [version control](/docs/cloud/git/git-version-control) your project in a fully managed environment.
- **[<Constant name="cloud" /> CLI](/docs/cloud/cloud-cli-installation)** &mdash; Run dbt from your local terminal against your <Constant name="cloud" /> development environment with full access to <Constant name="cloud" /> features.
- **[dbt VS Code extension](/docs/about-dbt-extension)** &mdash; Develop locally in VS Code with the <Constant name="fusion_engine" />. You can connect it to the <Constant name="dbt_platform" /> (if you have an account) for deployment and collaboration, or run it locally without a platform project.

For more details, see [Develop dbt](/docs/cloud/about-develop-dbt).

## Without the <Constant name="dbt_platform" />

If you're not using the platform, you can run dbt locally with the <Constant name="fusion_engine" /> or the <Constant name="core" /> engine:

- **[dbt VS Code extension](/docs/about-dbt-extension)** &mdash; VS Code with the <Constant name="fusion_engine" />; no platform project needed for core workflows.
- **[<Constant name="fusion_engine" /> CLI](/docs/fusion/install-fusion-cli)** &mdash; Install the <Constant name="fusion_engine" /> and run dbt from the command line. Fusion is source-available (ELv2) and includes open-source and proprietary components; see [licensing](https://www.getdbt.com/licenses-faq) for more info.
- **[<Constant name="core" />](/docs/core/installation-overview)** &mdash; Open source, install <Constant name="core" /> locally to run dbt from the command line using the <Constant name="core" /> engine.


#### Command-line tools

To further explain the command-line tools you can use with or without a <Constant name="dbt_platform" /> project, here's a table of the tools and their use cases:

| Tool | Use case |
|------|----------|
| VS Code extension | Powered by the <Constant name="fusion_engine" />, integrates with the <Constant name="dbt_platform" /> or runs locally without a <Constant name="dbt_platform" /> project. For the best experience, pair the CLI with the [VS Code extension](/docs/about-dbt-extension) to use the <Term id="lsp" /> features. |
| <Constant name="cloud_cli" /> | Integrates with the <Constant name="dbt_platform" /> features available, powered by the <Constant name="core"/> engine. |
| <Constant name="fusion" /> CLI | Powered by the <Constant name="fusion_engine" /> locally (source-available), doesn't integrate with the <Constant name="dbt_platform" /> features available. |
| <Constant name="core" /> | Powered by the <Constant name="core_engine" /> engine locally (open source), doesn't integrate with the <Constant name="dbt_platform" /> features available. |


## Common commands

In dbt, the commands you commonly use are:

- [dbt run](/reference/commands/run) &mdash; Run the models you defined in your project
- [dbt build](/reference/commands/build) &mdash; Build and test your selected resources such as models, seeds, snapshots, and tests
- [dbt test](/reference/commands/test) &mdash; Execute the tests you defined for your project

For all dbt commands and their arguments (flags), see the [dbt command reference](/reference/dbt-commands). To list all dbt commands from the command line, run `dbt --help`. To list a specific command's arguments, run `dbt COMMAND_NAME --help`.

<Expandable alt_header="New to the command line?">

Open your computer's terminal application (such as Terminal or iTerm) to access the command line. Make sure you navigate to your dbt project directory before running any dbt commands. These terminal commands help you navigate your file system: `cd` (change directory), `ls` (list directory contents), and `pwd` (present working directory).

</Expandable>

## Related docs

- [About the dbt VS Code extension](/docs/about-dbt-extension)
- [<Constant name="cloud" /> features](/docs/cloud/about-cloud/dbt-cloud-features)
- [Model selection syntax](/reference/node-selection/syntax)
- [<Constant name="cloud" /> CLI](/docs/cloud/cloud-cli-installation)
- [<Constant name="cloud_ide" /> features](/docs/cloud/studio-ide/develop-in-studio#ide-features)
- [Does dbt offer extract and load functionality?](/faqs/Project/transformation-tool)
- [Why does dbt compile need a data platform connection](/faqs/Warehouse/db-connection-dbt-compile)
