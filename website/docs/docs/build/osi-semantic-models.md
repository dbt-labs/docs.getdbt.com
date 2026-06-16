---
title: "OSI semantic layer documents"
id: "osi-semantic-models"
description: "Use Open Semantic Interchange (OSI) JSON documents to define semantic models and metrics in your dbt project."
sidebar_label: "OSI semantic layer documents"
tags: [Metrics, Semantic Layer]
---

# OSI semantic layer documents <Lifecycle status="beta" />

<VersionCallout version="1.12" />

<Constant name="core" /> v1.12 and higher supports the [Open Semantic Interchange (OSI)](https://github.com/open-semantic-interchange/OSI) standard for defining semantic models and metrics. You can place OSI-format `.json` files in an `OSI/` directory at the root of your project, or configure [`osi-paths`](/reference/project-configs/osi-paths) in `dbt_project.yml` to use one or more custom directories relative to your project root. dbt parses them into the manifest alongside any native dbt semantic models. OSI-sourced definitions and native dbt semantic models can coexist in the same project.

## Prerequisites

- You must be on <Constant name="core" /> v1.12 or higher.
- OSI documents must use version `0.1.0` or `0.1.1`. Any other version string raises a parse error.

## Defining semantic models using OSI documents

To define semantic models with OSI documents:

1. Create an `OSI/` directory at the root of your dbt project, at the same level as `dbt_project.yml`. To use one or more custom directories instead, configure [`osi-paths`](/reference/project-configs/osi-paths) in `dbt_project.yml` with paths relative to your project root.
2. Add one or more OSI `.json` files to the directory. You can organize files into subdirectories; dbt scans the entire directory tree.

    The `source` field must be the fully qualified warehouse location of a dbt model in this project, in the form `database.schema.alias` (for example, `my_database.my_schema.fct_orders`). dbt matches each dataset on database, schema, and model alias. Each dataset `source` must resolve to a dbt model. For restrictions on dataset sources, refer to [Limitations](#limitations).
    
    The following is an example OSI document that defines a semantic model on a dbt model called `fct_orders`:

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

    This example defines a semantic model only. To add metrics, include a `metrics` array on the semantic model per the [OSI specification](https://github.com/open-semantic-interchange/OSI).

3. Run any command that triggers compilation, such as `dbt compile` or `dbt run`. dbt automatically discovers and parses OSI files.

The resulting semantic models (and metrics, when defined in your OSI documents) appear in [dbt artifacts](/reference/artifacts/dbt-artifacts) in your `target/` directory, including [`manifest.json`](/reference/artifacts/manifest-json), [`semantic_manifest.json`](/reference/artifacts/sl-manifest), and [`osi_document.json`](/reference/artifacts/sl-manifest#osi-document).

## Limitations

- dbt scans only the root project's OSI directories (configured through [`osi-paths`](/reference/project-configs/osi-paths), default `OSI/`). OSI files in installed dependency packages are ignored.
- Each OSI dataset source must resolve to a dbt model. OSI documents that reference sources, seeds, snapshots, or external tables are not supported.
- If the OSI converter encounters unsupported metric types or other constructs, those elements are dropped and dbt emits a warning (event code `I078`), but parsing continues. Warnings appear in the CLI and in `logs/dbt.log`; for more information, refer to [Events and logs](/reference/events-logging).
