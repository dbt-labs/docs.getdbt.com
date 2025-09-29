---
title: "Quickstart for the dbt Fusion engine"
id: "fusion"
# time_to_complete: '30 minutes' commenting out until we test
level: 'Beginner'
icon: 'Guides'
hide_table_of_contents: true
tags: ['dbt Fusion engine', 'dbt Cloud','Quickstart']
recently_updated: true
---

<div style={{maxWidth: '900px'}}>
import FusionDWH from '/snippets/_fusion-dwh.md';

## Introduction

import FusionBeta from '/snippets/_fusion-beta-callout.md';

<FusionBeta />

The dbt Fusion engine is a powerful new approach to classic dbt ideas! Completely rebuilt from the ground up in Rust, Fusion enables you to compile and run your dbt projects faster than ever. We understand that you may want to see Fusion in action for yourself before you try it out in your development and production environments, and this quickstart guide aims to do just that!

### About the dbt Fusion engine

Fusion and the powerful features that the engine provides are available in the following:

- **dbt Studio:** If you are using the cloud-based dbt Studio IDE, Fusion features and functionality are automatically available, and you don't need to install anything. You will need to [upgrade your environment(s)](/docs/dbt-versions/upgrade-dbt-version-in-cloud#dbt-fusion-engine) to use the Fusion engine.
- **dbt CLI:** If you are using your local machine for development, see the [dbt Fusion engine installation guide](/docs/fusion/install-fusion) for instructions for installing it on your local machine.
- **VS Code extension** If you are using the [Visual Studio Code (VS Code)](https://code.visualstudio.com/) or [Cursor](https://www.cursor.com/en) IDE, you can get hands on with many of Fusions powerful features directly in your editor by installing the [dbt extension](/docs/install-dbt-extension).

Read more [about the dbt Fusion engine](/docs/fusion/about-fusion) to get a better understanding of what's new, what's changed, and what's been deprecated.

This guide will focus on the dbt extension and CLI combined experience.

## Prerequisites

To take full advantage of this guide, you'll need to meet the following prerequisites:
- You should have a basic understanding of dbt projects, git workflows, and data warehouse requirements.
- Make sure you're using a supported adapter and authentication method:
  <FusionDWH /> 
- You need a macOS (Terminal), Linux, or Windows (Powershell) machine to run the dbt Fusion engine. 
- You need to have [Visual Studio Code](https://code.visualstudio.com/) installed. The [Cursor](https://www.cursor.com/en) code editor will also work, but these instructions will focus on VS Code.

### What you'll learn

In this quickstart guide, you'll learn how to install and use the dbt Fusion engine, enabling you to get set up quickly and efficiently. This guide will demonstrate how to:
- Set up a fully functional dbt environment with an operational and executable project.
- Install and use the dbt extension and dbt Fusion engine via VS Code. 
- Run any dbt command from the environment’s terminal.

You can learn more through high-quality [dbt Learn courses and workshops](https://learn.getdbt.com/).

### Related content

- [Create a GitHub repository](/guides/manual-install?step=2)
- [Build your first models](/guides/manual-install?step=3)
- [Test and document your project](/guides/manual-install?step=4)

## Installation

It's easy to think of the dbt Fusion engine and the dbt extension as two different products, but they're a powerful combo that works together to unlock the full potential of dbt. Think of the Fusion engine as exactly that —an engine. The dbt extension and VS Code are the chassis, and together they form a powerful vehicle for transforming your data. It's important to note:
- You can install the dbt Fusion engine and use it standalone with the dbt CLI.
- You _cannot_ install and use the dbt extension without also installing Fusion.

The following are the essential steps from the [dbt Fusion engine](/docs/fusion/install-fusion) and [extension](/docs/install-dbt-extension) installation guides:

### Fusion macOS & Linux installation

Run the following command in the terminal:

```shell
curl -fsSL https://public.cdn.getdbt.com/fs/install/install.sh | sh -s -- --update
```

To use `dbtf` immediately after installation, reload your shell so that the new `$PATH` is recognized:

```shell
exec $SHELL
```

Or, simply close and reopen your terminal window. This will load the updated environment settings into the new session.

### Fusion Windows installation (PowerShell)

Run the following command in PowerShell:

```powershell
irm https://public.cdn.getdbt.com/fs/install/install.ps1 | iex
```

To use `dbtf` immediately after installation, reload your shell so that the new `Path` is recognized:

```powershell
Start-Process powershell
```

Or, simply close and reopen PowerShell. This will load the updated environment settings into the new session.

### Verify the Fusion installation

After installation, open a new command-line window and verify that Fusion is installed correctly by checking the version. You can run these commands using `dbt`, or use `dbtf` as an unambiguous alias for Fusion, if you have another dbt CLI installed on your machine.

```bash
dbtf --version
```

### Install the dbt VS Code extension

The dbt VS Code extension is available in the [Visual Studio extension marketplace](https://marketplace.visualstudio.com/items?itemName=dbtLabsInc.dbt). Download it directly from your VS Code editor:

1. Navigate to the **Extensions** tab of VS Code (or Cursor) and search for `dbt`. Locate the extension from the publisher `dbt Labs Inc`.
    <Lightbox src="/img/docs/extension/extension-marketplace.png" width="60%" title="Search for the extension"/>
2. Click **Install**.
3. You will see a prompt to register the extension. You can skip this step for now, but check out our [installation instructions](/docs/install-dbt-extension) to come back to it later.
4. If you see the **dbt Extension** label in your editor's status bar, then the extension has installed successfully.
    <Lightbox src="/img/docs/extension/extension-lsp-download.png" width="60%" title="Verify installation in the status bar."/>

## Initialize the Jaffle Shop project

1. Run this command from your command line to set up an example project and configure a database connection profile:

If you do **not** already have a connection profile that you want to use, start with this command and prompts will guide you through configuring a profile:

```bash
dbtf init
```

If you do already have a connection profile that you want to use, use the `--skip-profile-setup` flag then edit the generated `dbt_project.yml` to replace `profile: jaffle_shop` with `profile: <YOUR-PROFILE-NAME>`.

```bash
dbtf init --skip-profile-setup
```

If you created new credentials through the interactive prompts, `init` will automatically run `dbtf debug` at the end. This will check to ensure the newly created profile establishes a valid connection with the database.

2. Change directories into your newly created project:

```bash
cd jaffle_shop
```

3. Build your dbt project (which includes creating example data):

```bash
dbtf build
```

The following should now be done:

- Synthetic data loaded into your warehouse
- Development environment set up and ready to go
- The project built and tested

## Explore with the dbt VS Code extension

The dbt VS Code extension compiles and builds your project with the dbt Fusion engine, a powerful and blazing fast rebuild of dbt from the ground up. Using the Jaffle Shop project in VS Code:

You'll want to do a few things to get started:

1. Open the **View** menu and click **Command Palette** and enter `Workspaces: Add Folder to Workspace`. Choose your `jaffle_shop` folder that we created earlier. Without adding the root folder of the dbt project to the workspace, the LSP won't load within the workspace.
1. Open the `models/marts/orders.sql` file to see the definition for the `orders` model. This is the model we'll use in all of the examples below.
1. Locate `Lineage` and `Query Results` in the lower panel and the **dbt icon** in the upper right corner next to your editor groups. If you see all of these, the extension is installed correctly and running!
    <Lightbox src="/img/docs/extension/extension-running.png" width="60%" title="The VS Code UI with the extension running."/>

Now you're ready to see some of these awesome features in action!

### Preview data and code

Gain valuable insights into your data transformation during each step of your developement process. 
You can quickly access model results and underlying data structures directly from your code. These previews help validate your code step-by-step. 

1. Locate the **table icon** for **Preview File** in the upper right corner. Click it to preview results in the **Query Results** tab.
    <Lightbox src="/img/docs/extension/preview-query-results.png" width="60%" title="Preview model query results."/>
1. Click **Preview CTE** above `orders as (` to preview results in the **Query Results** tab.
    <Lightbox src="/img/docs/extension/preview-cte-query-results-3.png" width="60%" title="Preview CTE query results."/>
1. Locate the code icon for **Compile File** in between the dbt and the table icons. Clicking it will open a window with the compiled version of the model.
    <Lightbox src="/img/docs/extension/compile-file-icon.png" width="30%" title="Compile File icon."/>
    <Lightbox src="/img/docs/extension/compile-file.png" width="60%" title="Compile File results."/>

### Navigate your project with lineage tools

Almost as important as where your data is going is where it's been. The lineage tools in the extension let you visualize the lineage of the resources in your models as well as the column-level lineage. These capabilities deepen your understanding of model relationships and dependencies.

1. Open the **Lineage** tab to visualize the model-level lineage of this model.
    <Lightbox src="/img/docs/extension/extension-pane.png" width="60%" title="Visualizing model-level lineage."/>
1. Open the **View** menu, click **Command Palette** and enter `dbt: Show Column Lineage` to visualize the column-level lineage in the **Lineage** tab.
    <Lightbox src="/img/docs/extension/show-cll.png" width="60%" title="Show column-level lineage."/>

### Use the power of SQL understanding

Code smarter, not harder. The autocomplete and context clues help avoid mistakes and enable you to write fast and accurate SQL. Catch issues before you commit them!

1. To see **Autocomplete** in action, delete `ref('stg_orders')`, and begin typing `ref(stg_` to see the subset of matching model names. Use up and down arrows to select `stg_orders`.
    <Lightbox src="/img/docs/extension/autocomplete.png" width="60%" title="Autocomplete for a model name."/>
1. Hover over any `*` to see the list of column names and data types being selected.
    <Lightbox src="/img/docs/extension/hover-star.png" width="60%" title="Hovering over * to see column names and data types."/>

### Speeding up common dbt commands

Testing, testing... is this mic on? It is and it's ready to execute your commands with blazing fast speeds! When you want to test your code against various dbt commands: 

1. The dbt icon in the top right opens a list of extension-specific commands:
    <Lightbox src="/img/docs/extension/run-command.png" width="60%" title="Select a command via the dbt icon."/>
1. Opening the **View** menu, clicking the **Command Palette**, and entering `>dbt:` in the command bar shows all the new commands that are available.
    <Lightbox src="/img/docs/extension/extension-commands-all.png" width="60%" title="dbt commands in the command bar."/>

Try choosing some of them and see what they do 😎

This is just the start. There is so much more available and so much more coming. Be sure to check out our resources for all the information about the dbt Fusion engine and the dbt VS Code extension!

import AboutFusion from '/snippets/_about-fusion.md';

<AboutFusion />

## Troubleshooting

#### Addressing the `dbt language server is not running in this workspace` error

To resolve the `dbt language server is not running in this workspace` error, you need to add your dbt project folder to a workspace: 

1. In VS Code, click **File** in the toolbar then select **Add Folder to Workspace**.
2. Select the dbt project file you want to add to a workspace.
3. To save your workspace, click **File** then select **Save Workspace As**.  
4. Navigate to the location you want to save your workspace.

This should resolve the error and open your dbt project by opening the workspace it belongs to. For more information on workspaces, refer to [What is a VS Code workspace?](https://code.visualstudio.com/docs/editing/workspaces/workspaces).

</div>
