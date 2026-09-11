---
title: dbt extension features
id: dbt-extension-features
description: "The dbt VS Code extension is backed by the dbt engine and a powerful LSP."
sidebar_label: "dbt extension features"
pagination_next: "docs/install-dbt-extension"
image: /img/docs/extension/extension-features.png
availability: local_all
---

# dbt VS Code extension features <Lifecycle status="preview" />

<IntroText>
The dbt VS Code extension uses a dynamic Language Server Protocol (<Term id="lsp" />) to provide a fast, intelligent, and cost-efficient dbt development experience with enhanced workflows and easy navigation.
</IntroText>


:::info Feature availability

The extension's editor features are available to all users. Some capabilities depend on your project's [static analysis](/docs/build/about-static-analysis) mode, and a few read data from your <Constant name="dbt_platform" /> account.

See the [feature availability](#feature-availability) tables for the full list of features and what each needs.

:::

import ExtensionFeatures from '/snippets/_extension-features.md';

<ExtensionFeatures />

## Lightning-fast parse times

Parse even the largest projects up to 30x faster than with dbt v1. The LSP query cache makes incremental compiles faster still.

<video width="100%" height="100%" playsinline muted controls>
  <source src="/img/docs/extension/zoomzoom.mp4" type="video/webm" />
</video>

## View compiled code

Get a live view of the SQL code your models will build — right alongside your dbt code.

Usage:
- Click the **code icon** to view compiled code side-by-side with source code.
- Compiled code will update as you save your source code.
- Clicking on a dbt macro will focus the corresponding compiled code.
- Clicking on a compiled code block will focus the corresponding source code.

<video width="100%" height="100%" playsinline muted controls>
  <source src="/img/docs/extension/compiled-code.mp4" type="video/webm" />
</video>

## Build flexibly

Use the command palette to quickly build models using complex selectors.

Usage:
- Click the **dbt icon** or use keyboard shortcut `cmd+shift+enter` (macOS) / `ctrl+shift+enter` (Windows/Linux) to launch a quickpick menu.
- Select a command to run.

<video width="100%" height="100%" playsinline muted controls>
  <source src="/img/docs/extension/build-flexibly.mp4" type="video/webm" />
</video>

## Live error detection

Automatically validate your SQL code to detect errors and surface warnings without hitting the warehouse.

Syntax-tree diagnostics for Jinja, YAML, and SQL syntax errors (L1):

- Syntax errors (missing commas, misspelled keywords, and more)
- Hover over red squiggles to display errors
- Full diagnostic information is available in the **Problems** panel

L2 dbt v2 SQL comprehension diagnostics (requires [`static_analysis: strict`](/reference/resource-configs/static-analysis?version=2)):

- Missing `group by` clauses, or columns that are neither grouped nor aggregated
- Invalid function names or arguments
- SQL type and schema errors
- Linter warning diagnostics

<video width="100%" height="100%" playsinline muted controls>
  <source src="/img/docs/extension/live-error-detection.mp4" type="video/webm" />
</video>

## Powerful IntelliSense

Autocomplete SQL functions, model names, macros, and more.

- Autocomplete `ref`s and `source` calls. For example, type `{{ ref(`  or `{{ source(` and you will see a list of available resources and their type complete the function call. Autocomplete doesn't trigger when replacing existing model names inside parentheses.
- Dialect-aware SQL function autocomplete

<Lightbox src="/img/docs/extension/vsce-intellisense.gif" width="100%" title="Example of the VS Code extension IntelliSense"/>

## Instant refactoring

Rename models or columns and see references update project-wide.

Renaming models:

- Right-click on a file in the file tree and select **Rename**.
- After renaming the file, you'll get a prompt asking if you want to make refactoring changes.
  - Select **OK** to apply the changes, or **Show Preview** to display a preview of refactorings.
- After applying your changes, `ref`s should be updated to use the updated model name.

Renaming columns (requires [`static_analysis: strict`](/reference/resource-configs/static-analysis?version=2)):

Column renaming depends on strict static analysis, which validates column references across your project before the extension updates downstream models.

- Right-click on a column alias and select **Rename Symbol**.
- After renaming the column, you'll get a prompt asking if you want to make refactoring changes.
  - Select **OK** to apply the changes, or **Show Preview** to show a preview of refactorings.
- After applying your changes, downstream references to the column should be updated to use the new column name.

Note: Renaming models and columns is not yet supported for snapshots, or any resources defined in a .yml file.

<video width="100%" height="100%" playsinline muted controls>
  <source src="/img/docs/extension/refactor.mp4" type="video/webm" />
</video>

## Go-to-definition and reference

Jump to the definition of any `ref`, macro, model, or column with a single click. Particularly useful in large projects with many models and macros. Excludes definitions from installed packages.

- Command or Ctrl-click to go to the definition for an identifier.
- Right-click an identifier and select **Go to Definition** or **Go to References**.
- Jinja LSP go-to-definition for `ref()`, `source()`, and macros.

Column and CTE go-to-definition (requires [`static_analysis: strict`](/reference/resource-configs/static-analysis?version=2)):

- Go-to-definition for column names
- Go-to-definition for CTE names

<video width="100%" height="100%" playsinline muted controls>
  <source src="/img/docs/extension/go-to-definition.mp4" type="video/webm" />
</video>

## Rich lineage in context

See lineage at the column or table level as you develop — no context switching or breaking flow.

Table-level lineage:

:::tip Using the lineage tab in Cursor

If you're using the dbt VS Code extension in Cursor, the lineage tab works best in Editor mode and doesn't render in Agent mode. If you're in Agent mode and the lineage tab isn't rendering, just switch to Editor mode to view your project's table and column lineage.

:::

View table lineage:
- Open the **Lineage** tab in your editor. It will reflect table lineage focused on the currently-open file.
- Double-click nodes to open the files in your editor.
- The lineage pane updates as you navigate the files in your dbt project.
- Right-click on a node to update the DAG, or view column lineage for a node.

Column-level lineage (requires [`static_analysis: strict`](/reference/resource-configs/static-analysis?version=2)):

View column lineage:
- Right-click on a filename, or in the SQL contents of a model file.
- Select **dbt: View Lineage** --> **Show column lineage**.
- Select the column to view lineage for.
- Double-click on a node to update the DAG selector.
- You can also use column selectors in the lineage window by adding the `column:` prefix and appending the column name.

<video width="100%" height="100%" playsinline muted controls>
  <source src="/img/docs/extension/lineage.mp4" type="video/webm" />
</video>

## Hover insights

See context on tables, columns, and functions without leaving your code. Simply hover over any SQL element to see details like column names and data types.

Hover insights depend on [`static_analysis: strict`](/reference/resource-configs/static-analysis?version=2), which lets the extension understand column types and function signatures across your project.

Usage:
- Hover over `*` to see expanded list of columns and their types.
- Hover over column name or alias to see its type.

<video width="100%" height="100%" playsinline muted controls>
  <source src="/img/docs/extension/hover-insights.mp4" type="video/webm" />
</video>

## Live preview for models and CTEs

Preview query output directly from inside your editor for faster validation and debugging.

- Click the **table icon** or use keyboard shortcut `cmd+enter` (macOS) / `ctrl+enter` (Windows/Linux) to preview query results for a model or selected SQL snippet.
- Results are displayed in the **Query Results** tab in the bottom panel.
- The preview table is sortable and results are stored until the tab is closed.

CTE preview:

- Click the **Preview CTE** codelens to preview CTE results.

<video width="100%" height="100%" playsinline muted controls>
  <source src="/img/docs/extension/preview-cte.mp4" type="video/webm" />
</video>

## Explore your catalog <Lifecycle status="beta" /> {#explore-your-catalog}

This tab reads metadata from your <Constant name="dbt_platform" /> account, so you need to [sign in](/docs/sign-in-dbt-extension) to use it.

Open the **Catalog** tab to see information for the model you're working on &mdash; enriched by your <Constant name="dbt_platform" /> account &mdash; without leaving your editor.

For the current model, the catalog tab surfaces:

- The build status, last build time, and run duration from the <Constant name="dbt_platform" />.
- The model's **Description**.
- The model's **Columns**, including each column's type, description, and test results. Sort columns alphabetically or by test name.
- A **View in dbt platform** link to open the resource in the <Constant name="dbt_platform" />.

<Lightbox src="/img/docs/extension/vsce-catalog-tab.png" width="100%" title="Example of the Catalog tab in the dbt VS Code extension" />

## Generate a system report

Generate a system report to collect your VS Code extension logs and system information into a zip file. This is useful when troubleshooting issues with the dbt VS Code extension. You can share the zip file with dbt Labs support to help diagnose problems.

To generate and download a system report:

1. Open the Command Palette (`Cmd+Shift+P` on macOS, `Ctrl+Shift+P` on Windows/Linux).
2. Search for and select **dbt: Generate System Report**.
3. Choose a location to save the .zip file when prompted.
4. A notification will confirm where the file was saved.


import CompareChangesTLDR from '/snippets/_compare-changes-tldr.md';

<CompareChangesTLDR />
