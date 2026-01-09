---
title: "Quickstart for the dbt Fusion engine"
id: "fusion"
# time_to_complete: '30 minutes' commenting out until we test
level: 'Beginner'
icon: 'zap'
hide_table_of_contents: true
tags: ['dbt Fusion engine', 'dbt Cloud','Quickstart']
recently_updated: true
---

<div style={{maxWidth: '900px'}}>
import FusionDWH from '/snippets/_fusion-dwh.md';

## Introduction

import FusionLifecycle from '/snippets/_fusion-lifecycle-callout.md';

<FusionLifecycle />

The <Constant name="fusion_engine" /> is a powerful new approach to classic dbt ideas! Completely rebuilt from the ground up in Rust, <Constant name="fusion" /> lets you compile and run your dbt projects faster than ever — often in seconds. 

This quickstart guide will get you from zero to running your first dbt project with <Constant name="fusion" /> + VS Code. By the end, you’ll have:
- A working dbt project (`jaffle_shop`) built with the <Constant name="fusion_engine" />
- The dbt VS Code extension installed and connected  
- The ability to preview, compile, and run dbt commands directly from your IDE 

### About the dbt Fusion engine

<Constant name="fusion" /> and the features it provides are available in multiple environments:

| Environment | How to use <Constant name="fusion" /> |
|--------------|-------------------|
| **<Constant name="cloud_ide" />** | <Constant name="fusion" /> is automatically enabled; just [upgrade your environment(s)](/docs/dbt-versions/upgrade-dbt-version-in-cloud#dbt-fusion-engine). |
| **dbt CLI (local)** | [Install <Constant name="fusion_engine" />](/docs/fusion/install-fusion-cli) locally following this guide. |
| **VS Code / Cursor IDE** | [Install the dbt extension](/docs/install-dbt-extension) to unlock <Constant name="fusion" />'s interactive power in your editor. |

To learn more about which tool is best for you, see the [Fusion availability](/docs/fusion/fusion-availability) page. To learn about the <Constant name="fusion_engine" /> and how it works, read more [about the dbt Fusion engine](/docs/fusion/about-fusion).


## Prerequisites

To take full advantage of this guide, you'll need to meet the following prerequisites:

- You should have a basic understanding of [dbt projects](/docs/build/projects), [git workflows](/docs/cloud/git/git-version-control), and [data warehouse requirements](/docs/supported-data-platforms).
- Make sure you're using a supported adapter and authentication method:
    <FusionDWH /> 
- You need a macOS (Terminal), Linux, or Windows (Powershell) machine to run the <Constant name="fusion_engine" />. 
- You need to have [Visual Studio Code](https://code.visualstudio.com/) installed. The [Cursor](https://www.cursor.com/en) code editor will also work, but these instructions will focus on VS Code.
- You need admin or install privileges on your machine.  

### What you’ll learn

By following this guide, you will:
- Set up a fully functional dbt environment with an operational project  
- Install and use the <Constant name="fusion_engine" /> + dbt VS Code extension  
- Run dbt commands from your IDE or terminal  
- Preview data, view lineage, and write SQL faster with autocomplete, and more! 

You can learn more through high-quality [dbt Learn courses and workshops](https://learn.getdbt.com/).  

## Installation

It's easy to think of the <Constant name="fusion_engine" /> and the dbt extension as two different products, but they're a powerful combo that works together to unlock the full potential of dbt. Think of the <Constant name="fusion_engine" /> as exactly that — an engine. The dbt extension and VS Code are the chassis, and together they form a powerful vehicle for transforming your data. 

:::info
- You can install the <Constant name="fusion_engine" /> and use it standalone with the CLI.
- You *cannot* use the dbt extension without <Constant name="fusion" /> installed.
:::

The following are the essential steps from the [<Constant name="fusion_engine" />](/docs/fusion/install-fusion-cli) and [extension](/docs/install-dbt-extension) installation guides:

<Tabs queryString="installation">
<TabItem value="mac-linux" label="macOS & Linux">

1. Run the following command in the terminal to install the `dbtf` binary — <Constant name="fusion" />’s CLI command.
    ```shell
    curl -fsSL https://public.cdn.getdbt.com/fs/install/install.sh | sh -s -- --update
    ```
2. To use `dbtf` immediately after installation, reload your shell so that the new `$PATH` is recognized:
    ```shell
    exec $SHELL
    ```
    Or you can close and reopen your terminal window. This will load the updated environment settings into the new session.
</TabItem>
<TabItem value="windows" label="Windows (PowerShell)">

1. Run the following command in PowerShell to install the `dbtf` binary:
    ```powershell
    irm https://public.cdn.getdbt.com/fs/install/install.ps1 | iex
    ```
2. To use `dbtf` immediately after installation, reload your shell so that the new `Path` is recognized:
    ```powershell
    Start-Process powershell
    ```
    Or you can close and reopen your terminal window. This will load the updated environment settings into the new session.
</TabItem>
</Tabs>

### Verify the <Constant name="fusion_engine" /> installation

1. After installation, open a new command-line window to confirm that <Constant name="fusion" /> was installed correctly by checking the version. 
    ```bash
    dbtf --version
    ```
2. You should see output similar to the following:
    ```bash
    dbt-fusion 2.0.0-preview.45
    ```
:::tip
You can run these commands using `dbt`, or use `dbtf` as an unambiguous alias for <Constant name="fusion" />, if you have another dbt CLI installed on your machine.
:::

### Install the dbt VS Code extension

The dbt VS Code extension is available in the [Visual Studio extension marketplace](https://marketplace.visualstudio.com/items?itemName=dbtLabsInc.dbt). Download it directly from your VS Code editor:

1. Navigate to the **Extensions** tab of VS Code (or Cursor).
2. Search for `dbt` and choose the one from the publisher `dbt Labs Inc`.
    <Lightbox src="/img/docs/extension/extension-marketplace.png" width="60%" title="Search for the extension"/>
3. Click **Install**.
4. When the prompt appears, you can register the extension now or skip it (you can register later). You can also check out our [installation instructions](/docs/install-dbt-extension) to come back to it later.
5. Confirm you've installed the extension by looking for the **dbt Extension** label in the status bar. If you see it, the extension was installed successfully!
    <Lightbox src="/img/docs/extension/extension-lsp-download.png" width="60%" title="Verify installation in the status bar."/>

## Initialize the Jaffle Shop project
Now let's create your first dbt project powered by <Constant name="fusion" />!

1. Run `dbt init` to set up an example project and configure a database connection profile.
   - If you *do not* have a connection profile that you want to use, start with `dbt init` and use the prompts to configure a profile:
    - If you already have a connection profile that you want to use, use the `--skip-profile-setup` flag then edit the generated `dbt_project.yml` to replace `profile: jaffle_shop` with `profile: <YOUR-PROFILE-NAME>`.

        ```bash
        dbtf init --skip-profile-setup
        ```

    - If you created new credentials through the interactive prompts, `init` automatically runs `dbtf debug` at the end. This ensures the newly created profile establishes a valid connection with the database.

2. Change directories into your newly created project:
    ```bash
    cd jaffle_shop
    ```

3. Build your dbt project (which includes creating example data):
    ```bash
    dbtf build
    ```

This will:
- Load example data into your warehouse
- Create, build, and test models
- Verify your dbt environment is fully operational

## Explore with the dbt VS Code extension

The dbt VS Code extension compiles and builds your project with the <Constant name="fusion_engine" />, a powerful and blazing fast rebuild of dbt from the ground up. 

Want to see <Constant name="fusion" /> in action? Check out the following video to get a sense of how it works:

<div style={{ position: 'relative', maxWidth: '960px', margin: '2rem auto', overflow: 'hidden', borderRadius: '12px', height: '500px', boxShadow: 'var(--ifm-global-shadow-lw)' }}>
  <iframe
    src="https://app.storylane.io/share/a1rkqx0mbd7a" 
    title="dbt Fusion + VS Code extension walkthrough"
    style={{ position: 'relative', top: '-48px', height: '900px', width: '100%', border: 0, paddingBottom:'calc(42.20% + 25px)',transform: 'scale(1)'}}
    allow="fullscreen; autoplay; encrypted-media"
  />
</div>

Now that your project works, open it in VS Code and see Fusion in action:

1. In VS Code, open the **View** menu and click **Command Palette**. Enter **Workspaces: Add Folder to Workspace**.
2. Select your `jaffle_shop` folder.
        If you don't add the root folder of the dbt project to the workspace, the [dbt language server](https://docs.getdbt.com/blog/dbt-fusion-engine-components#the-dbt-vs-code-extension-and-language-server) (LSP) will not run. The LSP enables features like autocomplete, hover info, and inline error highlights.
4. Open a model file to see the definition for the `orders` model. This is the model we'll use in all of the examples below.
    ```bash
        models/marts/orders.sql
    ```
5. Locate **Lineage** and **Query Results** in the lower panel, and the **dbt icon** in the upper right corner next to your editor groups. If you see all of these, the extension is installed correctly and running!
    <Lightbox src="/img/docs/extension/extension-running.png" width="80%" title="The VS Code UI with the extension running."/>

Now you're ready to see some of these awesome features in action!

<!-- no toc -->
- [Preview data and code](#preview-data-and-code)
- [Navigate your project with lineage tools](#navigate-your-project-with-lineage-tools)
- [Use the power of SQL understanding](#use-the-power-of-sql-understanding)
- [Speed up common dbt commands](#speed-up-common-dbt-commands)

#### Preview data and code

Gain valuable insights into your data transformation during each step of your development process. 
You can quickly access model results and underlying data structures directly from your code. These previews help validate your code step-by-step. 

1. Locate the **table icon** for **Preview File** in the upper right corner. Click it to preview results in the **Query Results** tab.
    <Lightbox src="/img/docs/extension/preview-query-results.png" width="80%" title="Preview model query results."/>
2. Click **Preview CTE** above `orders as (` to preview results in the **Query Results** tab.
    <Lightbox src="/img/docs/extension/preview-cte-query-results-3.png" width="80%" title="Preview CTE query results."/>
3. Locate the code icon for **Compile File** in between the dbt and the table icons. Clicking this icon opens a window with the compiled version of the model.
    <Lightbox src="/img/docs/extension/compile-file-icon.png" width="50%" title="Compile File icon."/>
    <Lightbox src="/img/docs/extension/compile-file.png" width="80%" title="Compile File results."/>

#### Navigate your project with lineage tools

Almost as important as where your data is going is where it's been. The lineage tools in the extension let you visualize the lineage of the resources in your models as well as the column-level lineage. These capabilities deepen your understanding of model relationships and dependencies.

1. Open the **Lineage** tab to visualize the model-level lineage of this model.
    <Lightbox src="/img/docs/extension/extension-pane.png" width="80%" title="Visualizing model-level lineage."/>
1. Open the **View** menu, click **Command Palette** and enter `dbt: Show Column Lineage` to visualize the column-level lineage in the **Lineage** tab.
    <Lightbox src="/img/docs/extension/show-cll.png" width="80%" title="Show column-level lineage."/>

#### Use the power of SQL understanding

Code smarter, not harder. The autocomplete and context clues help avoid mistakes and enable you to write fast and accurate SQL. Catch issues before you commit them!

1. To see **Autocomplete** in action, delete `ref('stg_orders')`, and begin typing `ref(stg_` to see the subset of matching model names. Use up and down arrows to select `stg_orders`.
    <Lightbox src="/img/docs/extension/autocomplete.png" width="80%" title="Autocomplete for a model name."/>
1. Hover over any `*` to see the list of column names and data types being selected.
    <Lightbox src="/img/docs/extension/hover-star.png" width="80%" title="Hovering over * to see column names and data types."/>

#### Speed up common dbt commands

Testing, testing... is this mic on? It is and it's ready to execute your commands with blazing fast speeds! When you want to test your code against various dbt commands: 

1. The dbt icon in the top right opens a list of extension-specific commands:
    <Lightbox src="/img/docs/extension/run-command.png" width="80%" title="Select a command via the dbt icon."/>
1. Opening the **View** menu, clicking the **Command Palette**, and entering `>dbt:` in the command bar shows all the new commands that are available.
    <Lightbox src="/img/docs/extension/extension-commands-all.png" width="80%" title="dbt commands in the command bar."/>

<ConfettiTrigger>
Try choosing some of them and see what they do 😎

This is just the start. There is so much more available and so much more coming. Be sure to check out our resources for all the information about the <Constant name="fusion_engine" /> and the dbt VS Code extension!

</ConfettiTrigger>

## Troubleshooting

import FusionTroubleshooting from '/snippets/_fusion-troubleshooting.md';

<FusionTroubleshooting />

import AboutFusion from '/snippets/_about-fusion.md';

<AboutFusion />

</div>
