---
title: "dbt tips and tricks"
description: "Check out any dbt-related tips and tricks to help you work faster and be more productive."
sidebar_label: "dbt tips and tricks"
pagination_next: null
---

Use this page for valuable insights and practical advice to enhance your dbt experience. Whether you're new to dbt or an experienced user, these tips are designed to help you work more efficiently and effectively.

The following tips are organized into the following categories:

- [Package tips](#package-tips) to help you streamline your workflow.
- [Advanced tips and techniques](#advanced-tips-and-techniques) to help you get the most out of dbt.


If you're developing with the dbt Cloud IDE, you can refer to the [keyboard shortcuts](/docs/cloud/dbt-cloud-ide/keyboard-shortcuts) page to help make development more productive and easier for everyone.

## Package tips

Leverage these dbt packages to streamline your workflow:

| Package | Description |
|---------|-------------|
| [`dbt_codegen`](https://hub.getdbt.com/dbt-labs/codegen/latest/) |Use the package to help you generate YML files for your models and sources and SQL files for your staging models. |
| [`dbt_utils`](https://hub.getdbt.com/dbt-labs/dbt_utils/latest/) | The package contains macros useful for daily development. For example, `date_spine` generates a table with all dates between the ones provided as parameters. |
| [`dbt_project_evaluator`](https://hub.getdbt.com/dbt-labs/dbt_project_evaluator/latest) | The package compares your dbt project against a list of our best practices and provides suggestions and guidelines on how to update your models. |
| [`dbt_expectations`](https://hub.getdbt.com/calogica/dbt_expectations/latest) | The package contains many tests beyond those built into dbt. |
| [`dbt_audit_helper`](https://hub.getdbt.com/#:~:text=adwords-,audit_helper,-codegen) | The package lets you compare the output of 2 queries. Use it when refactoring existing logic to ensure that the new results are identical. |
| [`dbt_artifacts`](https://hub.getdbt.com/brooklyn-data/dbt_artifacts/latest) | The package saves information about your dbt runs directly to your data platform so that you can track the performance of models over time. |
| [`dbt_meta_testing`](https://hub.getdbt.com/tnightengale/dbt_meta_testing/latest) | This package checks that your dbt project is sufficiently tested and documented. |

## Advanced tips and techniques

- Use your folder structure as your primary selector method. `dbt build --select marts.marketing` is simpler and more resilient than relying on tagging every model.
- Think about jobs in terms of build cadences and SLAs. Run models that have hourly, daily, or weekly build cadences together.
- Use the [where config](/reference/resource-configs/where) for tests to test an assertion on a subset of records.
- [store_failures](/reference/resource-configs/store_failures) lets you examine records that cause tests to fail, so you can either repair the data or change the test as needed.
- Use [severity](/reference/resource-configs/severity) thresholds to set an acceptable number of failures for a test.
- Use [incremental_strategy](/docs/build/incremental-models#about-incremental_strategy) in your incremental model config to implement the most effective behavior depending on the volume of your data and reliability of your unique keys.
- Set `vars` in your `dbt_project.yml` to define global defaults for certain conditions, which you can then override using the `--vars` flag in your commands.
- Use [for loops](/guides/using-jinja?step=3) in Jinja to <Term id="dry">DRY</Term> up repetitive logic, such as selecting a series of columns that all require the same transformations and naming patterns to be applied.
- Instead of relying on post-hooks, use the [grants config](/reference/resource-configs/grants) to apply permission grants in the warehouse resiliently.
- Define [source-freshness](/docs/build/sources#snapshotting-source-data-freshness) thresholds on your sources to avoid running transformations on data that has already been processed.
- Use the `+` operator on the left of a model `dbt build --select +model_name` to run a model and all of its upstream dependencies. Use the `+` operator on the right of the model `dbt build --select model_name+` to run a model and everything downstream that depends on it.
- Use `dir_name` to run all models in a package or directory.
- Use the `@` operator on the left of a model in a non-state-aware CI setup to test it. This operator runs all of a selection’s parents and children, and also runs the parents of its children, which in a fresh CI schema will likely not exist yet.
- Use the [--exclude flag](/reference/node-selection/exclude) to remove a subset of models out of a selection.
- Use the [--full-refresh](/reference/commands/run#refresh-incremental-models) flag to rebuild an incremental model from scratch.
- Use [seeds](/docs/build/seeds) to create manual lookup tables, like zip codes to states or marketing UTMs to campaigns. `dbt seed` will build these from CSVs into your warehouse and make them `ref` able in your models.
- Use [target.name](/docs/build/custom-schemas#an-alternative-pattern-for-generating-schema-names) to pivot logic based on what environment you’re using. For example, to build into a single development schema while developing, but use multiple schemas in production.

## Related docs

- [Quickstart guide](/guides)
- [About dbt Cloud](/docs/cloud/about-cloud/dbt-cloud-features)
- [Develop in the Cloud](/docs/cloud/about-develop-dbt)
