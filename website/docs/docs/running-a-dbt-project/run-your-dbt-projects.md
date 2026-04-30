---
title: "Run your dbt projects"
id: "run-your-dbt-projects"
pagination_prev: null
---

You can run your dbt projects locally or using the [<Constant name="dbt_platform" />](/docs/platform/about-platform/dbt-cloud-features) with the dbt framework.

## Common commands

In dbt, the commands you commonly use are:

- [dbt run](/reference/commands/run) &mdash; Run the models you defined in your project
- [dbt build](/reference/commands/build) &mdash; Build and test your selected resources such as models, seeds, snapshots, and tests
- [dbt test](/reference/commands/test) &mdash; Execute the tests you defined for your project

For all dbt commands and their arguments (flags), see the [dbt command reference](/reference/dbt-commands). To list all dbt commands from the command line, run `dbt --help`. To list a specific command's arguments, run `dbt COMMAND_NAME --help`.

<Expandable alt_header="New to the command line?">

If you're new to the command line:
1. Open your computer's terminal application (such as Terminal or iTerm) to access the command line. 
2. Make sure you navigate to your dbt project directory before running any dbt commands. 
3. These terminal commands help you navigate your file system: `cd` (change directory), `ls` (list directory contents), and `pwd` (present working directory).

</Expandable>

## Where to run dbt

import DbtFramework from '/snippets/_dbt-framework.md';

<DbtFramework />

### dbt platform

The <Constant name="dbt_platform" /> is a fully managed service that gives you a complete environment to build, test, deploy, and collaborate on dbt projects. You can develop in the browser or locally using the <Constant name="fusion_engine" /> or <Constant name="core" /> engine.

- [Develop in your browser using the <Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio)
- [Seamless drag-and-drop development with <Constant name="canvas" />](/docs/platform/canvas)
- [Run dbt commands from your local command line](#dbt-local-development) using dbt VS Code extension or <Constant name="platform_cli" /> (both which integrate seamlessly with the <Constant name="dbt_platform" /> project(s)).

For more details, see [About dbt plans](https://www.getdbt.com/pricing).

### dbt local development

You can run dbt locally with the <Constant name="fusion_engine" /> or the <Constant name="core" /> engine:

- [Install the dbt VS Code extension](/docs/about-dbt-extension) &mdash; Combines <Constant name="fusion_engine" /> performance with visual features like autocomplete, inline errors, and lineage. Includes [<Term id="lsp" /> features](/docs/about-dbt-lsp) and suitable for users with <Constant name="dbt_platform"/> projects or running dbt locally without a <Constant name="dbt_platform" /> project. _Recommended for local development._
- [Install the Fusion CLI](/docs/local/install-dbt?version=2#get-started) &mdash; <Constant name="fusion_engine" /> from the command line, but doesn't include <Term id="lsp" /> features.
- [Install the <Constant name="platform_cli" />](/docs/platform/cloud-cli-installation) &mdash; The <Constant name="dbt_platform" /> CLI, which allows you to run dbt commands against your <Constant name="dbt_platform" /> development environment from your local command line. Requires a <Constant name="dbt_platform" /> project.
- [Install <Constant name="core" />](/docs/local/install-dbt) &mdash; The open-source, Python-based CLI that uses the <Constant name="core" /> engine. Doesn't include <Term id="lsp" /> features.

## Related docs

- [About the dbt VS Code extension](/docs/about-dbt-extension)
- [<Constant name="dbt" /> features](/docs/platform/about-platform/dbt-cloud-features)
- [Model selection syntax](/reference/node-selection/syntax)
- [<Constant name="dbt" /> CLI](/docs/platform/cloud-cli-installation)
- [<Constant name="studio_ide" /> features](/docs/platform/studio-ide/develop-in-studio#ide-features)
- [Does dbt offer extract and load functionality?](/faqs/Project/transformation-tool)
- [Why does dbt compile need a data platform connection](/faqs/Warehouse/db-connection-dbt-compile)
