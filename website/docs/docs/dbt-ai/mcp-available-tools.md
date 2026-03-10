---
title: "Available tools"
sidebar_label: "Available tools"
description: "Complete list of tools available in the dbt MCP server."
id: "mcp-available-tools"
---

The dbt MCP server has access to many parts of the dbt experience related to development, deployment, and discovery. The following sections list every tool by category, along with which server type (local or remote) supports it.

| Tools | Local | Remote |
| --- | --- | --- |
| [dbt CLI](#dbt-cli-commands)  | ✅ | ❌ |
| [Semantic Layer](#semantic-layer) | ✅ | ✅ |
| [SQL](#sql)  | ✅ | ✅ |
| [Metadata Discovery](#metadata-discovery) | ✅ | ✅ |
| [Administrative API](#administrative-api) | ✅ | ❌ |
| [Codegen Tools](#codegen-tools) | ✅ | ❌ |
| [Fusion Tools](#fusion-tools-remote) | ✅ | ✅ |

Note that access to the Discovery API and the Semantic Layer API is limited depending on your [plan type](https://www.getdbt.com/pricing).

## dbt CLI commands

- `build`: Executes models, tests, snapshots, and seeds in dependency order
- `compile`: Generates executable SQL from models, tests, and analyses without running them
- `docs`: Generates documentation for the dbt project
- `list`: Lists resources in the dbt project, such as models and tests
- `parse`: Parses and validates the project's files for syntax correctness
- `run`: Executes models to materialize them in the database
- `test`: Runs tests to validate data and model integrity
- `show`: Runs a query against the data warehouse
- `get_model_lineage_dev`: Gets the lineage of a model from the local development environment
- `get_node_details_dev`: Gets details about a specific node from the local development environment

Allowing your client to utilize dbt commands through the MCP tooling could modify your data models, sources, and warehouse objects. Proceed only if you trust the client and understand the potential impact.

## Semantic Layer

To learn more about the dbt Semantic layer, click [here](/docs/use-dbt-semantic-layer/dbt-sl).

- `list_metrics`: Retrieves all defined metrics
- `list_saved_queries`: Retrieves all saved queries
- `get_dimensions`: Gets dimensions associated with specified metrics
- `get_entities`: Gets entities associated with specified metrics
- `query_metrics`: Query metrics with optional grouping, ordering, filtering, and limiting
- `get_metrics_compiled_sql`: Returns the compiled SQL generated for specified metrics and groupings without executing the query

## Metadata Discovery

To learn more about the dbt Discovery API, click [here](/docs/dbt-cloud-apis/discovery-api).

- `get_mart_models`: Gets all mart models
- `get_all_models`: Gets all models
- `get_model_details`: Gets details for a specific model
- `get_model_parents`: Gets the parent nodes of a specific model
- `get_model_children`: Gets the children models of a specific model
- `get_model_health`: Gets health signals for a specific model
- `get_model_performance`: Gets execution information for models (including tests)
- `get_all_sources`: Gets all source tables with metadata and freshness information
- `get_lineage`:  Gets complete lineage (ancestors/descendants) for a dbt resource with depth control and type filtering (excludes macros by default).
- `get_source_details`: Gets details for a specific source
- `get_exposures`: Gets all exposures
- `get_exposure_details`: Gets details for a specific exposure or a list of exposures
- `get_related_models`: Uses semantic search to find dbt models that are similar to the query, even if there isn't an exact string match.
- `get_macro_details`: Gets details for a specific macro
- `get_seed_details`: Gets details for a specific seed
- `get_semantic_model_details`: Gets details for a specific semantic model
- `get_snapshot_details`: Gets details for a specific snapshot
- `get_test_details`: Gets details for a specific test

## Administrative API

To learn more about the dbt Administrative API, click [here](/docs/dbt-cloud-apis/admin-cloud-api).

- `list_jobs`: List all jobs in a dbt account
- `get_job_details`: Get detailed information for a specific job including configuration and settings
- `get_project_details`: Get project information for a specific dbt project
- `trigger_job_run`: Trigger a job run with optional parameter overrides like Git branch, schema, or execution parameters
- `list_jobs_runs`: List runs in an account with optional filtering by job, status, or other criteria
- `get_job_run_details`: Get comprehensive run information including execution details, steps, artifacts, and debug logs
- `cancel_job_run`: Cancel a running job to stop execution
- `retry_job_run`: Retry a failed job run to attempt execution again
- `list_job_run_artifacts`: List all available artifacts for a job run (manifest.json, catalog.json, logs, etc.)
- `get_job_run_artifact`: Download specific artifact files from job runs for analysis or integration
- `get_job_run_error`: Retrieves error details for failed job runs to help troubleshoot errors (includes option to return warning and deprecation details)

## SQL

- `text_to_sql`: Generate SQL from natural language requests
- `execute_sql`: Execute SQL on the <Constant name="dbt_platform"/>'s backend infrastructure with support for Semantic Layer SQL syntax. **Requires a [Personal Access Token (PAT)](/docs/dbt-cloud-apis/user-tokens) — service tokens do not work for this tool.**

## Codegen tools

These tools help automate boilerplate code generation for dbt project files. To use them, install the [dbt-codegen](https://hub.getdbt.com/dbt-labs/codegen/latest/) in your dbt project. These tools are disabled by default. To enable them, set the `DISABLE_DBT_CODEGEN` environment variable to `false`.

- `generate_source`: Creates source YAML definitions from database schemas.
- `generate_model_yaml`: Generates documentation YAML for existing dbt models, including column names, data types, and description placeholders.
- `generate_staging_model`: Creates staging SQL models from sources to transform raw source data into clean staging models.

## Fusion tools (remote)

A set of tools that leverage the <Constant name="fusion" /> engine for advanced SQL compilation and column-level lineage analysis.

- `compile_sql`: Compiles a SQL statement in the context of the current project and environment.
- `get_column_lineage`: <Constant name="fusion" /> exclusive! Get column lineage information across a project DAG for a specific column.

## Fusion tools (local)

A set of tools that leverage the <Constant name="fusion" /> engine through a locally running <Constant name="fusion" /> Language Server Protocol (LSP) in VS Code or Cursor with the dbt VS Code extension.

- `get_column_lineage`: <Constant name="fusion" /> exclusive! Get column lineage information across a project DAG for a specific column.

## MCP server metadata

These tools provide information about the MCP server itself. They are disabled by default. To enable them, set the `DISABLE_MCP_SERVER_METADATA` environment variable to `false`.

- `get_mcp_server_version`: Returns the current version of the dbt MCP server.
