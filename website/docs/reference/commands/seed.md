---
title: "About dbt seed command"
sidebar_label: "seed"
id: "seed"
---

The `dbt seed` command loads static CSV files from your project’s `seed-paths` into your <Term id="data-warehouse" /> as tables. Use seeds for small, version-controlled reference datasets you want to keep alongside your project, such as country codes, region mappings, or a list of business-defined categories.

After you load seeds, you can reference the resulting tables in downstream models, and rerun `dbt seed` when the CSVs change.

Seeds are configured in the `dbt_project.yml` file, where you can define options like seed file directories and column interpretation. The `dbt seed` command then loads those CSVs into your warehouse so you can reference them in downstream models.

## Overview

This section covers common `dbt seed` results (artifacts and CLI output) and options you might use when running seeds.

Use artifacts when you want to inspect or troubleshoot what happened during execution:
- Artifacts: Running `dbt seed` produces dbt execution artifacts, including `run_results.json` for executed seeds. For details on what’s included and how to interpret it, refer to [Run results JSON file](/reference/artifacts/run-results-json).<br />

Use resource selection when you want to run only a subset of seeds:
- Selecting resources: For advanced selection patterns (tags, paths, graph operators, and more), read [Syntax overview](/reference/node-selection/syntax).<br />

Use global flags when you want to control command behavior, logging, and runtime settings:
- Flags: `dbt seed` supports dbt global flags. For the full list, refer to [Command line options](/reference/global-configs/command-line-options) and [Available flags](/reference/global-configs/about-global-configs#available-flags).

## Selecting seeds

You can run specific seeds using the `--select` flag when executing the `dbt seed` command. For example: 


```shell
dbt seed --select "country_codes"
Found 2 models, 3 tests, 0 archives, 0 analyses, 53 macros, 0 operations, 2 seed files

14:46:15 | Concurrency: 1 threads (target='dev')
14:46:15 |
14:46:15 | 1 of 1 START seed file analytics.country_codes........................... [RUN]
14:46:15 | 1 of 1 OK loaded seed file analytics.country_codes....................... [INSERT 3 in 0.01s]
14:46:16 |
14:46:16 | Finished running 1 seed in 0.14s.
```

Examples of common `dbt seed` invocations:

```shell
# Run all seeds
dbt seed

# Run one seed
dbt seed --select "country_codes"

# Rebuild selected seeds from scratch
dbt seed --select "country_codes state_codes" --full-refresh
```

## The --full-refresh flag

Use `--full-refresh` to force a full reload of seed data (rather than an incremental update) when you need to rebuild seed tables from scratch. This is useful when:

- You want to force a clean reload of seed data:

  ```shell
  dbt seed --full-refresh
  ```

- You have changed the seed structure (for example, column names or types):

  ```shell
  dbt seed --select "country_codes" --full-refresh
  ```

- You need consistent behavior across environments after a seed change:

  ```shell
  dbt seed --select "country_codes state_codes" --full-refresh
  ```

For information about configuring seeds (for example, column types and quoting behavior), refer to [Seed configurations](/reference/seed-configs).

<VersionBlock firstVersion="1.12">

## The --empty flag

Use `--empty` to create seed tables with the correct schema but without loading any data. dbt infers column names and types from the CSV file but inserts zero rows. This is useful in development or CI environments where downstream models and unit tests need the table structure to exist without the overhead of loading full datasets. For example:

- Build schema-only seed tables so downstream models and unit tests can compile and run:

  ```shell
  dbt seed --empty
  ```

- Target a specific seed when you only need one table's structure:

  ```shell
  dbt seed --select "country_codes" --empty
  ```

For more information, refer to [The empty flag](/docs/build/empty-flag).

</VersionBlock>

## Related docs

- [Seed configurations](/reference/seed-configs)
- [Add Seeds to your DAG](/docs/build/seeds)
- [Syntax overview](/reference/node-selection/syntax)
- [`dbt build` command](/reference/commands/build)