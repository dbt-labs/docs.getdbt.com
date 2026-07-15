---
title: dbt extension features
id: dbt-extension-features
description: "The dbt VS Code extension is backed by the dbt Fusion engine and a powerful LSP."
sidebar_label: "dbt extension features"
pagination_next: "docs/install-dbt-extension"
image: /img/docs/extension/extension-features.png
---

# dbt VS Code extension features <Lifecycle status="preview" />

The dbt VS Code extension is backed by the speed and power of the <Constant name="fusion_engine" /> and a dynamic Language Server Protocol (<Term id="lsp"/>) that enables enhanced workflows, faster development, and easy navigation.

:::info Registration for advanced features

Most dbt VS Code extension features are available to all users for 14 days. After the 14-day trial period, [register](/docs/sign-in-dbt-extension) for a <Constant name="dbt_platform" /> account to keep using advanced features. The vast majority of features remain available without registration. Existing registered users keep access automatically.

Refer to [VS Code extension features](/docs/fusion/fusion-availability?version=1.13#dbt-vs-code-extension-features) for the full list of features and their availability.

:::

<VersionBlock firstVersion="1.13">

In <Constant name="dbt" /> v2.0 and later, authentication is handled by [`dbt login`](/reference/commands/login), so your login state is shared across dbt tools like the dbt VS Code extension and, in supported versions, dbt State.

</VersionBlock>

## Lightning-fast parse times

Parse even the largest projects up to 30x faster than with dbt Core.

**Requires registration** — LSP query cache (for faster incremental compiles).

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

**Available to all users:** 

Syntax-tree diagnostics for Jinja, YAML, and SQL syntax errors (L1):

- Syntax errors (missing commas, misspelled keywords, and more)
- Hover over red squiggles to display errors
- Full diagnostic information is available in the **Problems** panel

**Requires registration:**

L2 Fusion SQL comprehension diagnostics (depends on strict static analysis):

- Missing `group by` clauses, or columns that are neither grouped nor aggregated
- Invalid function names or arguments
- SQL type and schema errors
- Linter warning diagnostics

<video width="100%" height="100%" playsinline muted controls>
  <source src="/img/docs/extension/live-error-detection.mp4" type="video/webm" />
</video>

## Powerful IntelliSense

Autocomplete SQL functions, model names, macros, and more.

**Available to all users:**

- Autocomplete `ref`s and `source` calls. For example, type `{{ ref(`  or `{{ source(` and you will see a list of available resources and their type complete the function call. Autocomplete doesn't trigger when replacing existing model names inside parentheses.
- Dialect-aware SQL function autocomplete

<Lightbox src="/img/docs/extension/vsce-intellisense.gif" width="100%" title="Example of the VS Code extension IntelliSense"/>

## Instant refactoring

Rename models or columns and see references update project-wide.

**Available to all users:** 

Renaming models:

- Right-click on a file in the file tree and select **Rename**.
- After renaming the file, you'll get a prompt asking if you want to make refactoring changes.
  - Select **OK** to apply the changes, or **Show Preview** to display a preview of refactorings.
- After applying your changes, `ref`s should be updated to use the updated model name.

**Requires registration:**

Renaming columns (depends on strict static analysis):

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

**Available to all users:**

- Command or Ctrl-click to go to the definition for an identifier.
- Right-click an identifier and select **Go to Definition** or **Go to References**.
- Jinja LSP go-to-definition for `ref()`, `source()`, and macros.

**Requires registration:**

Column and CTE go-to-definition (depends on `strict` static analysis):

- Go-to-definition for column names
- Go-to-definition for CTE names

<video width="100%" height="100%" playsinline muted controls>
  <source src="/img/docs/extension/go-to-definition.mp4" type="video/webm" />
</video>

## Rich lineage in context

See lineage at the column or table level as you develop — no context switching or breaking flow.

**Available to all users:** 

Table-level lineage:

:::tip Using the lineage tab in Cursor

If you're using the dbt VS Code extension in Cursor, the lineage tab works best in Editor mode and doesn't render in Agent mode. If you're in Agent mode and the lineage tab isn't rendering, just switch to Editor mode to view your project's table and column lineage.

:::

View table lineage:
- Open the **Lineage** tab in your editor. It will reflect table lineage focused on the currently-open file.
- Double-click nodes to open the files in your editor.
- The lineage pane updates as you navigate the files in your dbt project.
- Right-click on a node to update the DAG, or view column lineage for a node.

**Requires registration:** 

Column-level lineage (depends on strict static analysis):

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

**Requires registration:**  

Hover insights depend on strict static analysis, which lets the extension understand column types and function signatures across your project.

Usage:
- Hover over `*` to see expanded list of columns and their types.
- Hover over column name or alias to see its type.

<video width="100%" height="100%" playsinline muted controls>
  <source src="/img/docs/extension/hover-insights.mp4" type="video/webm" />
</video>

## Live preview for models and CTEs

Preview query output directly from inside your editor for faster validation and debugging.

**Available to all users:**

- Click the **table icon** or use keyboard shortcut `cmd+enter` (macOS) / `ctrl+enter` (Windows/Linux) to preview query results for a model or selected SQL snippet.
- Results are displayed in the **Query Results** tab in the bottom panel.
- The preview table is sortable and results are stored until the tab is closed.

**Requires registration:**

CTE preview:

- Click the **Preview CTE** codelens to preview CTE results.

<video width="100%" height="100%" playsinline muted controls>
  <source src="/img/docs/extension/preview-cte.mp4" type="video/webm" />
</video>

## Explore your catalog <Lifecycle status="beta" />

**Requires registration:**  

Open the **Catalog** tab to see information for the model you're working on &mdash; enriched by your <Constant name="dbt_platform" /> account &mdash; without leaving your editor.

For the current model, the catalog tab surfaces:

- The build status, last build time, and run duration from the <Constant name="dbt_platform" />.
- The model's **Description**.
- The model's **Columns**, including each column's type, description, and test results. Sort columns alphabetically or by test name.
- A **View in dbt platform** link to open the resource in the <Constant name="dbt_platform" />.

The **Catalog** tab is an advanced feature. Before your 14-day trial expires, [register](/docs/sign-in-dbt-extension) for a <Constant name="dbt_platform" /> account to continue using it.

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
