---
title: "dbt Cloud tips"
id: dbt-cloud-tips
description: "Check out any dbt Cloud and IDE-related tips."
sidebar_label: "dbt Cloud tips"
---

# dbt Cloud tips

The Cloud IDE provides keyboard shortcuts, features, and development tips to help you work faster and be more productive. Use this Cloud IDE cheat sheet to help you quickly reference some common operations.

## Most popular

**Organize tabs**

You can move your tabs around to reorganize your work in the IDE. You can also right-click on a tab to close multiple tabs or view and select a list of actions to take. Right-click in the editor to access other options, including text wrap.

**Drag and drop**

You can also drag and drop files in the file tree or in the editor. Use the file breadcrumb on the top of the IDE for quicker navigation. You can access adjacent files in the same file by right-clicking on the breadcrumb file.

**Search across files**

You can quickly search over all files in the IDE on your current project. To search, open the search bar by pressing Command-O to find text across all files in your current project and write your filename. You can view the results under the search text, which are grouped into files containing the match. You can click on the results to view them in the IDE.

**Command bar and status**

You can run commands from the command bar at the bottom of the IDE or by using the **Build** button. Use the [rich model selection syntax](/docs/reference/node-selection/syntax) to run [dbt commands](/docs/reference/dbt-commands) directly within dbt Cloud. You can also view the history, status, and logs of previous runs by clicking **Runs**.

The status icon on the lower right corner of the IDE gives you an indicator of the health of your project. You can identify errors by clicking on the status icon for more details or by clicking **Restart the IDE**.

**Find and replace**

Press Command-F or Control-F to open the find-and-replace bar in the upper right corner of the current file in the IDE. The IDE highlights your search results in the current file and code outline. You can use the up and down arrows to see the match highlighted in the current file when there are multiple matches. To replace the text with something else, use the left arrow.

**DAG in the IDE**

Double-click a node in the directed acyclic graph (DAG) to open that file in a new tab. Click **Expand** on the upper right side of the DAG and use node selection syntax (`select` or `exclude`) to view a subset of your DAG.

## IDE Keyboard shortcuts

There are default keyboard shortcuts that can help make development more productive and easier for everyone.

- Command-O or Control-O to select a file to open
- Command-P or Control-P to see command palette
- Hold Option-click-on-an-area to select multiple lines and perform a multi-edit. You can also press Command-E to perform this operation on the command line.
- Press Fn-F1 to view a list of the other editor shortcuts
-  Command-Enter or Control-Enter to Preview your code
- Command-Shift-Enter or Control-Shift-Enter to Compile
- Highlight a portion of code and use the above shortcuts to Preview or Compile code
- Enter two underscores (__) in the IDE to reveal a list of dbt functions

## Multiple selections

You can make multiple selections for small and simultaneous edits. The below commands are a common way to add more cursors and allow you to insert cursors below or above with ease.

- Option-Command-Down  arrow
- Option-Command-Up arrow
- Press Option and click on an area

## Package tips

- Use the [dbt_codegen](https://hub.getdbt.com/dbt-labs/codegen/latest/) package to help you generate YML files for your models and sources and SQL files for your staging models.
- The [dbt_utils](https://hub.getdbt.com/dbt-labs/dbt_utils/latest/) package contains macros useful for daily development. For example, `date_spine` generates a table with all dates between the ones provided as parameters.
- The [dbt_project_evaluator](https://hub.getdbt.com/dbt-labs/dbt_project_evaluator/latest) package compares your dbt project against a list of our best practices and provides suggestions and guidelines on how to update your models.
- The [dbt_expectations](https://hub.getdbt.com/calogica/dbt_expectations/latest) package contains many tests beyond those built into dbt Core.
- The [dbt_audit_helper](https://hub.getdbt.com/#:~:text=adwords-,audit_helper,-codegen) package lets you compare the output of 2 queries. Use it when refactoring existing logic to ensure that the new results are identical.
- The [dbt_artifacts](https://hub.getdbt.com/brooklyn-data/dbt_artifacts/latest) package saves information about your dbt runs directly to your data platform so that you can track the performance of models over time.
- The [dbt_meta_testing](https://hub.getdbt.com/tnightengale/dbt_meta_testing/latest) package checks that your dbt project is sufficiently tested and documented.

## Advanced tips

- Use your folder structure as your primary selector method. `dbt build --select marts.marketing` is simpler and more resilient than relying on tagging every model.
- Think about jobs in terms of build cadences and SLAs. Run models that have hourly, daily, or weekly build cadences together.
- Use the [where config](/docs/reference/resource-configs/where) for tests to test an assertion on a subset of records.
- [store_failures](/docs/reference/resource-configs/store_failures) lets you examine records that cause tests to fail, so you can either repair the data or change the test as needed.
- Use [severity](/docs/reference/resource-configs/severity) thresholds to set an acceptable number of failures for a test.
- Use [incremental_strategy](/docs/build/incremental-models#about-incremental_strategy) in your incremental model config to implement the most effective behavior depending on the volume of your data and reliability of your unique keys.
- Set `vars` in your `dbt_project.yml` to define global defaults for certain conditions, which you can then override using the `--vars` flag in your commands.
- Use [for loops](/docs/get-started/learning-more/using-jinja#use-a-for-loop-in-models-for-repeated-sql) in Jinja to [DRY](https://docs.getdbt.com/terms/dry) up repetitive logic, such as selecting a series of columns that all require the same transformations and naming patterns to be applied.
- Instead of relying on post-hooks, use the [grants config](/docs/reference/resource-configs/grants) to apply permission grants in the warehouse resiliently.
- Define [source-freshness](/docs/build/sources#snapshotting-source-data-freshness) thresholds on your sources to avoid running transformations on data that has already been processed.
- Use the `+` operator on the left of a model `dbt build --select +model_name` to run a model and all of its upstream dependencies. Use the `+` operator on the right of the model `dbt build --select model_name+` to run a model and everything downstream that depends on it.
- Use `dir_name` to run all models in a package or directory.
- Use the `@` operator on the left of a model in a non-state-aware CI setup to test it. This operator runs all of a selection’s parents and children, and also runs the parents of its children, which in a fresh CI schema will likely not exist yet.
- Use the [--exclude flag](/docs/reference/node-selection/exclude) to remove a subset of models out of a selection.
- Use [state and deferral](/docs/deploy/cloud-ci-job#deferral-and-state-comparison) to create a slim CI setup.
- Use the [--full-refresh](/docs/reference/commands/run#refresh-incremental-models) flag to rebuild an incremental model from scratch.
- Use [seeds](/docs/build/seeds) to create manual lookup tables, like zip codes to states or marketing UTMs to campaigns. `dbt seed` will build these from CSVs into your warehouse and make them `ref` able in your models.
- Use [target.name](/docs/build/custom-schemas#an-alternative-pattern-for-generating-schema-names) to pivot logic based on what environment you’re using. For example, to build into a single development schema while developing, but use multiple schemas in production.

## Related docs

- [Getting started](/docs/get-started/getting-started/overview)
- [Develop in the Cloud](/docs/get-started/develop-in-the-cloud)
