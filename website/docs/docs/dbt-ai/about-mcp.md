---
title: "dbt Model Context Protocol"
sidebar_label: "Model Context Protocol"
description: "Learn about the dbt MCP server"
id: "about-mcp"
---

# About dbt Model Context Protocol (MCP) <Lifecycle status="beta" />

As AI becomes more deeply integrated into data workflows, dbt users need a seamless way to access and integrate dbt's structured metadata and execution context effectively. This page provides an overview of dbt's MCP Server, which exposes this context, supporting use cases such as conversational access to data, agent-driven automation of dbt workflows, and AI-assisted development.

The [dbt Model Context Protocol (MCP) server](https://github.com/dbt-labs/dbt-mcp) provides a standardized framework that enables users to seamlessly integrate AI applications with dbt-managed data assets regardless of the underlying data platforms. This ensures consistent, governed access to models, metrics, lineage, and freshness across various AI tools.

The MCP server provides access to the dbt CLI, [API](/docs/dbt-cloud-apis/overview), the [Discovery API](/docs/dbt-cloud-apis/discovery-api), and [Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl). It provides access to private APIs, text-to-SQL, and SQL execution.

For more information on MCP, have a look at [Get started with the Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction).

<!--TODO need to create>
## Architecture

There are two ways to access the dbt-mcp server: locally hosted or remotely hosted on the cloud-based dbt platform.

<-->

## Server Access

There are two ways to install dbt MCP: [local](#local) and [remote](#remote).

- [Local MCP server setup guide](/docs/dbt-ai/setup-local-mcp)
- [Remote MCP server setup guide](/docs/dbt-ai/setup-remote-mcp)

## Available Tools

### Supported
The dbt MCP server has access to many parts of the dbt experience related to development, deployment, and discovery.
Here are the categories of tools supported based on what form of the MCP Server you connect to as well as detailed information on exact commands or queries available to the LLM.

| Tools | Local | Remote |
| --- | --- | --- |
| dbt CLI  | ✅ | ❌ |
| Semantic Layer | ✅ | ✅ |
| SQL  | ✅ | ✅ |
| Metadata Discovery| ✅ | ✅ |
| Administrative API | ✅ | ❌ |
| Disable tools | ✅ | ✅ |

Note that access to the Discovery API and the Semantic Layer API is limited depending on your [plan type](https://www.getdbt.com/pricing).

### dbt CLI commands

- `build`: Executes models, tests, snapshots, and seeds in dependency order
- `compile`: Generates executable SQL from models, tests, and analyses without running them
- `docs`: Generates documentation for the dbt project
- `ls` (list): Lists resources in the dbt project, such as models and tests
- `parse`: Parses and validates the project’s files for syntax correctness
- `run`: Executes models to materialize them in the database
- `test`: Runs tests to validate data and model integrity
- `show`: Runs a query against the data warehouse

Allowing your client to utilize dbt commands through the MCP tooling could modify your data models, sources, and warehouse objects. Proceed only if you trust the client and understand the potential impact.


### Semantic Layer

To learn more about the dbt Semantic layer, click [here](/docs/use-dbt-semantic-layer/dbt-sl)

- `list_metrics`: Retrieves all defined metrics
- `get_dimensions`: Gets dimensions associated with specified metrics
- `get_entities`: Gets entities associated with specified metrics
- `query_metrics`: Query metrics with optional grouping, ordering, filtering, and limiting
- `get_metrics_compiled_sql`: Returns the compiled SQL generated for specified metrics and groupings without executing the query

### Metadata Discovery

To learn more about the dbt Discovery API, click [here](/docs/dbt-cloud-apis/discovery-api)

- `get_mart_models`: Gets all mart models
- `get_all_models`: Gets all models
- `get_model_details`: Gets details for a specific model
- `get_model_parents`: Gets the parent nodes of a specific model
- `get_model_children`: Gets the children models of a specific model
- `get_model_health`: Get health signals for a specific model


### Administrative API

To learn more about the dbt Administrative API, click [here](/docs/dbt-cloud-apis/admin-cloud-api)

- `list_jobs`: List all jobs in a dbt account
- `get_job_details`: Get detailed information for a specific job including configuration and settings
- `trigger_job_run`: Trigger a job run with optional parameter overrides like Git branch, schema, or execution parameters
- `list_jobs_runs`: List runs in an account with optional filtering by job, status, or other criteria
- `get_job_run_details`: Get comprehensive run information including execution details, steps, artifacts, and debug logs
- `cancel_job_run`: Cancel a running job to stop execution
- `retry_job_run`: Retry a failed job run to attempt execution again
- `list_job_run_artifacts`: List all available artifacts for a job run (manifest.json, catalog.json, logs, etc.)
- `get_job_run_artifact`: Download specific artifact files from job runs for analysis or integration

### SQL
⚠️ The SQL tools access the dbt platform endpoints. While MCP usage of the tools doesn't consume dbt Copilot credits, access to the tools is impacted by dbt Copilot credit overages from direct usage of Copilot in dbt.

- `text_to_sql`: Generate SQL from natural language requests
- `execute_sql`: Execute SQL on the dbt platform's backend infrastructure with support for Semantic Layer SQL syntax. Note: using a PAT instead of a service token for `DBT_TOKEN` is required for this tool.


## MCP integrations

The dbt MCP server integrates with any [MCP client](https://modelcontextprotocol.io/clients) that supports token authentication and tool use capabilities.

We have also created integration guides for the following clients:
- [Claude](/docs/dbt-ai/integrate-mcp-claude)
- [Cursor](/docs/dbt-ai/integrate-mcp-cursor)
- [VS Code](/docs/dbt-ai/integrate-mcp-vscode)

## Troubleshooting

- Some MCP clients may be unable to find `uvx` from the JSON config. This will result in error messages like `Could not connect to MCP server dbt-mcp`. If this happens, try finding the full path to `uvx` with `which uvx` on Unix systems and placing this full path in the JSON. For instance: `"command": "/the/full/path/to/uvx"`.

## Resources
- Refer to our blog on [Introducing the dbt MCP Server](/blog/introducing-dbt-mcp-server#getting-started) for more information.
