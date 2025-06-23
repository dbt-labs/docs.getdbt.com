---
title: About the dbt VS Code extension
id: about-dbt-extension
description: "Bring all the speed and power of the dbt Fusion engine to your local development workflow."
sidebar_label: "About the dbt VS Code extension"
pagination_next: "docs/install-dbt-extension"
---

# About the dbt VS Code Extension <Lifecycle status="beta" />

The dbt extension brings a hyper-fast, intelligent, and cost-efficient dbt development experience to VS Code.
This is the only way to enjoy all the power of the new dbt Fusion engine while developing locally.

_Save time and resources_ with near-instant parsing, live error detection, powerful IntelliSense capabilities, and more.

_Stay in flow_ with a seamless, end-to-end dbt development experience designed from scratch for local dbt development.

_This is a public beta release. Behavior may change ahead of the broader generally available (GA) release._

## Productivity features

The following extension features help you get more done, fast:

- **[Live error detection](#live-error-detection):** Automatically validate your SQL code to detect errors and surface warnings, without hitting the warehouse. This includes both dbt errors (like invalid `ref`) and SQL errors (like invalid column name or SQL syntax).
- **[Lightning-fast parse times](#lightning-fast-parse-times):** Parse even the largest projects up to 30x faster than dbt Core.
- **[Powerful IntelliSense](#powerful-intellisense):** Autocomplete SQL functions, model names, columns, macros, and more.
- **[Instant refactoring](#instant-refactoring):** Rename models or columns and see references update project-wide.
- **[Go-to-definition](#go-to-definition-and-reference):** Jump to the definition of any `ref`, macro, model, or column with a single click. Particularly useful in large projects with many models and macros.
- **[Hover insights](#hover-insights):** See context on tables, columns, and functions without leaving your code. Simply hover over any SQL element to see details like column names and data types.
- **[Live CTE previews](#live-preview-for-models-and-ctes):** Preview a CTE’s output directly from inside your dbt model for faster validation and debugging.
- **[Rich lineage in context](#rich-lineage-in-context):** See lineage at the column or table level as you develop with no context switching or breaking the flow.
- **[View compiled code](#view-compiled-code):** Get a live view of the SQL code your models will build alongside your dbt code.
- **[Build flexibly](#build-flexibly):** Use the command palette to build models with complex selectors.
 
### Live error detection

Automatically validate your SQL code to detect errors and surface warnings without hitting the warehouse.

- Displays diagnostics (red squiggles) for:
  - Syntax errors (missing commas, misspelled keywords, etc).
  - Invalid / missing column names (for example, `select not_a_column from {{ ref('real_model') }}`).
  - Missing `group by` clauses, or columns that are neither grouped nor aggregated.
  - Invalid function names or arguments
- Hover over red squiggles to display errors.
- Full diagnostic information is available in the “Problems”.

<video width="100%" height="100%" playsinline muted controls>
  <source src="/img/docs/extension/live-error-detection.webm" type="video/webm" />
</video>

### Lightning-fast parse times

Parse even the largest projects up to 30x faster than with dbt Core.

<video width="100%" height="100%" playsinline muted controls>
  <source src="/img/docs/extension/zoomzoom.webm" type="video/webm" />
</video>

### Powerful IntelliSense

Autocomplete SQL functions, model names, columns, macros and more.

Usage:
- Autocomplete `ref`s and `source` calls. For example, type `{{ ref(`  or `{{ source(` and you will see a list of available resources and their type complete the function call.
- Autocomplete dialect-specific function names.

<video width="100%" height="100%" playsinline muted controls>
  <source src="/img/docs/extension/intellisense.webm" type="video/webm" />
</video>

### Instant refactoring

Renaming models:
 - Right-click on a file in the file tree and select **Rename**.
 - After renaming the file, you'll get a prompt asking if you want to make refactoring changes.
  - Select **OK** to apply the changes, or **Show Preview** to display a preview of refactorings.
 - After applying your changes, `ref`s should be updated to use the updated model name.

Renaming columns:
- Right-click on a column alias and select **Rename Symbol**.
- After renaming the column, you'll get a prompt asking if you want to make refactoring changes.
  - Select **OK** to apply the changes, or **Show Preview** to show a preview of refactorings.
- After applying your changes, downstream references to the column should be updated to use the new column name.

Note: Renaming models and columns is not yet supported for snapshots, or any resources defined in a .yml file.

<video width="100%" height="100%" playsinline muted controls>
  <source src="/img/docs/extension/refactor.webm" type="video/webm" />
</video>

### Go-to-definition and reference

Jump to the definition of any `ref`, macro, model, or column with a single click. Particularly useful in large projects with many models and macros.

Usage:
- Command or Ctrl-click to go to the definition for an identifier.
- You can also right-click an identifier or and select **Go to Definition** or **Go to References**.
- Supports CTE names, column names, `*`, macro names, and dbt `ref()` and `source()` call.

<video width="100%" height="100%" playsinline muted controls>
  <source src="/img/docs/extension/go-to-definition.webm" type="video/webm" />
</video>

### Hover insights

See context on tables, columns, and functions without leaving your code. Simply hover over any SQL element to see details like column names and data types.

Usage:
- Hover over `*` to see expanded list of columns and their types.
- Hover over column name or alias to see its type.

<video width="100%" height="100%" playsinline muted controls>
  <source src="/img/docs/extension/hover-insights.webm" type="video/webm" />
</video>

### Live preview for models and CTEs

Preview a CTE’s output, or an entire model, directly from inside your editor for faster validation and debugging.

Usage:
- Click the **table icon** or use keyboard shortcut `cmd+enter` (macOS) / `ctrl+enter` (Windows/Linux) to preview query results.
- Click the **Preview CTE** codelens to preview CTE results.
- Results will be displayed in the **Query Results** tab in the bottom panel.
- The preview table is sortable and results are stored until the tab is closed.
- You can also select a range of SQL to preview the results of a specific SQL snippet.

<video width="100%" height="100%" playsinline muted controls>
  <source src="/img/docs/extension/preview-cte.webm" type="video/webm" />
</video>

### Rich lineage in context

See lineage at the column or table level as you develop — no context switching or breaking flow.

View table lineage:
- Open the **Lineage** tab in your editor. It will reflect table lineage focused on the currently-open file.
- Double-click nodes to open the files in your editor.
- The lineage pane updates as you navigate the files in your dbt project.
- Right-click on a node to update the DAG, or view column lineage for a node.

View column lineage:
- Right-click on a filename, or in the SQL contents of a model file.
- Select **dbt: View Lineage** --> **Show column lineage**.
- Select the column to view lineage for.
- Double-click on a node to update the DAG selector.
- You can also use column selectors in the lineage window by adding the `column:` prefix and appending the column name. 
  - For example, if you want the lineage for the `AMOUNT` column of your `stg_payments` model, edit the `+model.jaffle_shop.stg_payments+` to `+column:model.jaffle_shop.stg_payments.AMOUNT+`.

<video width="100%" height="100%" playsinline muted controls>
  <source src="/img/docs/extension/lineage.webm" type="video/webm" />
</video>

### View compiled code

Get a live view of the SQL code your models will build — right alongside your dbt code.

Usage:
- Click the **code icon** to view compiled code side-by-side with source code.
- Compiled code will update as you save your source code.
- Clicking on a dbt macro will focus the corresponding compiled code.
- Clicking on a compiled code block will focus the corresponding source code.

<video width="100%" height="100%" playsinline muted controls>
  <source src="/img/docs/extension/compiled-code.webm" type="video/webm" />
</video>

### Build flexibly

Use the command palette to quickly build models using complex selectors. 

Usage:
- Click the **dbt icon** or use keyboard shortcut `cmd+shift+enter` (macOS) / `ctrl+shift+enter` (Windows/Linux) to launch a quickpick menu.
- Select a command to run.

<video width="100%" height="100%" playsinline muted controls>
  <source src="/img/docs/extension/build-flexibly.webm" type="video/webm" />
</video>

## Using the extension

Your dbt environment must be using the dbt Fusion engine in order to use this extension. See [the Fusion documentation](/docs/fusion/about-fusion) for more on eligibility and upgrading.

Once installed, the dbt extension automatically activates when you open any `.sql` or `.yml` file inside of a dbt project directory. 

## Configuration

After installation, you may want to configure the extension to better fit your development workflow:

1. Open the VS Code settings by pressing `Ctrl+,` (Windows/Linux) or `Cmd+,` (Mac).
2. Search for `dbt`. On this page, you can adjust the extension’s configuration options as to fit your needs.

## FAQs

**Can I use the dbt extension with my monorepo?**

The dbt extension will not activate unless it finds a `dbt_project.yml` file in the root folder of a workspace. If you develop in a monorepo, consider using a  [.code-workspace](https://code.visualstudio.com/docs/editing/workspaces/workspaces#_singlefolder-workspaces) file to create a workspace for your dbt project folder. You can do this easily by running the `Add folder to workspace` commmand in your editor.


## Known limitations

The following are currently known limitations of the dbt extension:

- **Remote development:** The dbt extension does not yet support remote development sessions over SSH. Support will be added in a future release. For more information on remote development, refer to [Supporting Remote Development and GitHub Codespaces](https://code.visualstudio.com/api/advanced-topics/remote-extensions) and [Visual Studio Code Server](https://code.visualstudio.com/docs/remote/vscode-server).

- **Working with YAML files:** Today, the dbt extension has the following limitations with operating on YAML files:
  - Go-to-definition is not supported for nodes defined in YAML files (like snapshots).
  - Renaming models and columns will not update references in YAML files.
  - Future releases of the dbt extension will address these limitations

- **Renaming models:** When a model file is renamed, the dbt extension will apply edits to update all `ref()` calls that reference the renamed model. Due to limitations of VS Code's Language Server Client, we are not able to auto-save these edit files. As a result, you may see that renaming a model file results in compiler errors in your project. To fix these errors, you must either manually save each file that was edited by the dbt extension, or click **File** --> **Save All** to save all edited files.


## Support

dbt platform customers can contact dbt Labs support at [support@getdbt.com](mailto:support@getdbt.com). You can also get in touch with us by reaching out to your Account Manager directly.

For organizations that are not customers of the dbt platform, the best place for questions and discussion is the [dbt Community Slack](https://www.getdbt.com/community/join-the-community).

We welcome feedback as we work to continuously improve the extension, and would love to hear from you!
