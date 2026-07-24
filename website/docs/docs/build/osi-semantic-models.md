---
title: "Apache Ossie semantic layer documents"
id: "osi-semantic-models"
description: "Use Apache Ossie JSON documents to define semantic models and metrics in your dbt project."
sidebar_label: "Apache Ossie semantic layer documents"
tags: [Metrics, Semantic Layer]
availability: all_users
---

# Apache Ossie semantic layer documents

<VersionCallout version="1.12" />

<Constant name="core" /> v1.12 and higher supports the [Apache Ossie](https://github.com/apache/ossie) standard for defining semantic models and metrics. You can place Ossie-format `.json` files in an `osi/` directory at the root of your project, or configure [`osi-paths`](/reference/project-configs/osi-paths) in `dbt_project.yml` to use one or more custom directories relative to your project root. dbt parses them into the manifest alongside any native dbt semantic models. Ossie-sourced definitions and native dbt semantic models can coexist in the same project.

## Prerequisites

- You must be on <Constant name="core" /> v1.12 or higher.
- Ossie documents must use version `0.1.0` or `0.1.1`. Any other version string raises a parse error.

## Defining semantic models using Ossie documents

To define semantic models with Ossie documents:

1. Create an `osi/` directory at the root of your dbt project, at the same level as `dbt_project.yml`. To use one or more custom directories instead, configure [`osi-paths`](/reference/project-configs/osi-paths) in `dbt_project.yml` with paths relative to your project root.
2. Add one or more Ossie `.json` files to the directory. You can organize files into subdirectories; dbt scans the entire directory tree.

    The `source` field must be the fully qualified warehouse location of a dbt model in this project, in the form `database.schema.alias` (for example, `my_database.my_schema.fct_orders`). dbt matches each dataset on database, schema, and model alias. Each dataset `source` must resolve to a dbt model. For restrictions on dataset sources, refer to [Limitations](#limitations).

    The following is an example Ossie document that defines a semantic model on a dbt model called `fct_orders`:

    ```json
    {
      "version": "0.1.1",
      "semantic_model": [
        {
          "name": "orders",
          "datasets": [
            {
              "name": "orders",
              "source": "my_database.my_schema.fct_orders"
            }
          ]
        }
      ]
    }
    ```

    This example defines a semantic model only. To add metrics, include a `metrics` array on the semantic model per the [Ossie specification](https://github.com/apache/ossie).

3. Run any command that triggers compilation, such as `dbt compile` or `dbt run`. dbt automatically discovers and parses Ossie files.

The resulting semantic models (and metrics, when defined in your Ossie documents) appear in [dbt artifacts](/reference/artifacts/dbt-artifacts) in your `target/` directory, including [`manifest.json`](/reference/artifacts/manifest-json), [`semantic_manifest.json`](/reference/artifacts/sl-manifest), and [`osi_document.json`](/reference/artifacts/sl-manifest#osi-document).

## Limitations

- dbt scans only the root project's Ossie directories (configured through [`osi-paths`](/reference/project-configs/osi-paths), default `osi/`). Ossie files in installed dependency packages are ignored.
- Each Ossie dataset source must resolve to a dbt model. Ossie documents that reference sources, seeds, snapshots, or external tables are not supported.
- If the Ossie converter encounters unsupported metric types or other constructs, those elements are dropped and dbt emits a warning (event code `I078`), but parsing continues. Warnings appear in the CLI and in `logs/dbt.log`; for more information, refer to [Events and logs](/reference/events-logging).
