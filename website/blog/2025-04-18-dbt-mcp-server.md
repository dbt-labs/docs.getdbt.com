---
title: "Introducing the dbt MCP Server – Bringing Structured Data to AI Workflows and Agents"
description: "We’re open‑sourcing an experimental dbt MCP server so LLMs and agents can discover, query, and run your dbt project."
slug: introducing-dbt-mcp-server
image: /img/blog/2025-04-18-dbt-mcp-server/mcp_architecture_overview.png
authors: [jason_ganz]
tags: [ai, data ecosystem]
hide_table_of_contents: false
date: 2025-04-21
is_featured: true
---

# Introducing the dbt MCP Server - Bringing Structured Data to AI Workflows and Agents

dbt is the standard for creating governed, trustworthy datasets on top of your structured data. [MCP](https://www.anthropic.com/news/model-context-protocol) is showing increasing promise as the standard for providing context to LLMs to allow them to function at a high level in real world, operational scenarios.

Today, we are open sourcing an experimental version of the [dbt MCP server](https://github.com/dbt-labs/dbt-mcp/tree/main). We expect that over the coming years, structured data is going to become heavily integrated into AI workflows and that dbt will play a key role in building and provisioning this data.

<!-- truncate -->

In particular, we expect both [Business Intelligence](https://roundup.getdbt.com/p/how-ai-will-disrupt-bi-as-we-know) and [Data Engineering](https://roundup.getdbt.com/p/how-ai-will-disrupt-data-engineering) will be driven by AI operating on top of the context defined in your dbt projects.

**We are committed to building the data control plane that enables AI to reliably access structured data from across your entire data lineage.** Over the coming months and years, data teams will increasingly focus on building the rich context that feeds into the dbt MCP server.  Both AI agents and business stakeholders will then operate on top of LLM-driven systems hydrated by the dbt MCP context.

<LoomVideo id="28cd33da8bcc41ccbe43338d327e73d8"/>

Today’s system is not a full realization of the vision in the posts shared above, but it is a meaningful step towards safely integrating your structured enterprise data into AI workflows. In this post, we’ll walk through what the dbt MCP server can do today, some tips for getting started and some of the limitations of the current implementation.

We believe it is important for the industry to start coalescing on best practices for safe and trustworthy ways to access your business data via LLM.

**What is MCP?**

MCP stands for Model Context Protocol - it is an open protocol released by Anthropic in [November of last year](https://www.anthropic.com/news/model-context-protocol) to allow AI systems to dynamically pull in context and data. Why does this matter?

> 
> 
> 
> Even the most sophisticated models are constrained by their isolation from data—trapped behind information silos and legacy systems. Every new data source requires its own custom implementation, making truly connected systems difficult to scale.
> 
> MCP addresses this challenge. It provides a universal, open standard for connecting AI systems with data sources, replacing fragmented integrations with a single protocol. - Anthropic
> 

Since then, MCP has become widely supported, with Google, Microsoft and OpenAI all committing to support MCP. 

**What does the dbt MCP Server do?**

Think of it as the missing glue between:

- **Your dbt project** (models, docs, lineage, Semantic Layer)
- **Any MCP‑enabled [client](https://modelcontextprotocol.io/clients)** (Claude Desktop Projects, Cursor, agent frameworks, custom apps, etc.)

We’ve [known for a while](https://roundup.getdbt.com/p/semantic-layer-as-the-data-interface) that the combination of structured data from your dbt project + LLMs is a potent combo (particularly when using the dbt Semantic Layer). The question has been, what is the best way to provision this across a wide variety of LLM applications in a way that puts the power in the hands of the Community and the ecosystem, rather than us building out a series of one-off integrations.

The dbt MCP server provides access to a set of *tools* that operate on top of your dbt project. These tools can be called by LLM systems to learn about your data and metadata.

**Remember, as with any AI workflows, to make sure that you are taking appropriate caution in terms of giving these access to production systems and data. Consider starting in a sandbox environment or only granting read permissions.**

There are three primary functions of the dbt MCP server today.

<Lightbox src="/img/blog/2025-04-18-dbt-mcp-server/mcp_use_cases.png" title="Three use‑case pillars of the dbt MCP server" width="100%" />

- Data discovery: Understand what data assets exist in your dbt project.
- Data querying: Directly query the data in your dbt project. This has two components:
    - Use the dbt Semantic Layer for trustworthy, single source of truth reporting on your metrics
    - Execution of SQL queries for more freewheeling data exploration and development
- Run and perform commands within dbt: Access the dbt CLI to run a project and perform other operations

<Lightbox src="/img/blog/2025-04-18-dbt-mcp-server/mcp_architecture_overview.png" title="How the dbt MCP server fits between data sources and MCP‑enabled clients" width="100%" />


❓Do I need to be a dbt Cloud customer to use the dbt MCP server?

- No - there is functionality for both <Constant name="cloud" /> and dbt Core users included in the MCP. Over time, Cloud-specific services will be built into the MCP server where they provide differentiated value.

Let’s walk through examples of these and why each of them can be helpful in human driven and agent driven use cases:

## **Using the dbt MCP Server for Data Asset Discovery**

dbt has knowledge about the data assets that exist across your entire data stack, from raw staging models to polished analytical marts. The dbt MCP server exposes this knowledge in a way that makes it accessible to LLMs and AI agents, enabling powerful discovery capabilities:

- **For human stakeholders**: Learn about your production dbt project interactively through natural language. Business users can ask questions like "What customer data do we have?" or "Where do we store marketing spend information?" and receive accurate information based on your dbt project's documentation and structure.
- **For AI agent workflows**: Automatically discover and understand the available data models, their relationships, and their structures without human intervention. This allows agents to autonomously navigate complex data environments and produce accurate insights. This can be useful context for any agent that needs to operate on top of information in a data platform.

The data discovery tools allow LLMs to understand what data exists, how it's structured, and how different data assets relate to each other. This contextual understanding is essential for generating accurate SQL, answering business questions, and providing trustworthy data insights.

### **Data Asset Discovery Tools:**

*note - for all of these tools, you do not need to directly access them in your workflow. Rather, the MCP client will use the context you have provided to determine which is the most accurate tool to use at a given time.*

| Tool Name | Purpose | Output |
| --- | --- | --- |
| `get_all_models` | Provides a complete inventory of all models in the dbt project, regardless of type | List of all model names and their descriptions |
| `get_mart_models` | Identifies presentation layer models specifically designed for end-user consumption | List of mart model names and descriptions (models in the reporting layer) |
| `get_model_details` | Retrieves comprehensive information about a specific model | Compiled SQL, description, column names, column descriptions, and column data types |
| `get_model_parents` | Identifies upstream dependencies for a specific model | List of parent models that the specified model depends on |

## **Using the dbt MCP server for querying data via the dbt Semantic Layer**

The [dbt Semantic Layer](https://www.getdbt.com/product/semantic-layer) defines your organization's metrics and dimensions in a consistent, governed way. With the dbt MCP server, LLMs can understand and query these metrics directly, ensuring that AI-generated analyses are consistent with your organization's definitions.

- **For human stakeholders**: Request metrics using natural language. Users can ask for "monthly revenue by region" and get accurate results that match your organization's standard metric definitions, with a [higher baseline of accuracy than LLM generated SQL queries](https://roundup.getdbt.com/p/semantic-layer-as-the-data-interface).
- **For AI agent workflows**: As agentic systems take action in the real world over a longer time horizon, they will need ways to understand the underlying reality of your business. From feeding into deep research style reports to feeding operational agents, the dbt Semantic Layer can provide a trusted underlying interface for LLM systems.

By leveraging the dbt Semantic Layer through the MCP server, you ensure that LLM-generated analyses are based on rigorous definitions instantiated as code, flexibly available in any MCP-supported client.

### Semantic Layer Tools:

| Tool Name | Purpose | Output |
| --- | --- | --- |
| `list_metrics` | Provides an inventory of all available metrics in the dbt Semantic Layer | Complete list of metric names, types, labels, and descriptions |
| `get_dimensions` | Identifies available dimensions for specified metrics | List of dimensions that can be used to group/filter the specified metrics |
| `query_metrics` | Executes queries against metrics in the dbt Semantic Layer | Query results based on specified metrics, dimensions, and filters |

## **Using the dbt MCP server for sql execution to power text to sql**

While the dbt Semantic Layer provides a governed, metrics-based approach to data querying, there are many analytical needs that require more flexible, exploratory SQL queries. The dbt MCP server will soon include SQL validation and querying capabilities with rich context awareness.

- **For human stakeholders**: Ask complex analytical questions that go beyond predefined metrics. Users can explore data freely while still benefiting from the LLM's understanding of their specific data models, ensuring that generated SQL is correct and optimized for your environment.
- **For AI agent workflows**: Generate and validate SQL against your data models automatically. Agents can create and execute complex queries that adapt to schema changes, optimize for performance, and follow your organization's SQL patterns and conventions.

Unlike traditional SQL generation, queries created through the dbt MCP server will be aware of your specific data models, making them more accurate and useful for your particular environment. This capability is particularly valuable for data exploration, one-off analyses, and prototype development that might later be incorporated into your dbt project.

Currently SQL execution is managed through the dbt Show tool, over the near term we expect to release tooling that is more performant and fit to this precise use case. 

## **Using the dbt MCP server for project execution**

The dbt MCP server doesn't just provide access to data—it also allows LLMs and AI agents to interact directly with dbt, executing commands and managing your project. 

- **For human stakeholders**: Trigger dbt commands through conversational interfaces without CLI knowledge. Users can ask to "run the daily models" or "test the customer models" and get clear explanations of the results, including suggestions for fixing any issues that arise.
- **For AI agent workflows**: Autonomously run dbt processes in response to events. Agents can manage project execution, automatically test and validate model changes, and even debug common issues without human intervention.

While the discovery and query tools operate on top of *environments* as the context source, these execution tools interact directly with the CLI, both dbt Core and the Cloud CLI.

### Project Execution Tools

| Tool Name | Purpose | Output |
| --- | --- | --- |
| `build` | Executes the dbt build command to build the entire project | Results of the build process including success/failure status and logs |
| `compile` | Executes the dbt compile command to compile the project's SQL | Results of the compilation process including success/failure status and logs |
| `list` | Lists all resources in the dbt project | Structured list of resources within the project |
| `parse` | Parses the dbt project files | Results of the parsing process including success/failure status and logs |
| `run` | Executes the dbt run command to run models in the project | Results of the run process including success/failure status and logs |
| `test` | Executes tests defined in the dbt project | Results of test execution including success/failure status and logs |

## Getting Started

The dbt MCP server is now available as an experimental release. To get started:

1. Clone the repository from GitHub: [dbt-labs/dbt-mcp](https://github.com/dbt-labs/dbt-mcp)
2. Follow the installation instructions in the README
3. Connect your dbt project and start exploring the capabilities

We're excited to see how the community builds with and extends the dbt MCP server. Whether you're building an AI-powered BI tool, an autonomous data agent, or just exploring the possibilities of LLMs in your data workflows, the dbt MCP server provides a solid foundation for bringing your dbt context to AI applications.

## What is the best workflow for the current iteration of the MCP server?

This early release is primarily meant to be used *on top of an existing dbt project to answer questions about your data and metadata -* roughly tracking towards the set of use cases described in this [post](https://roundup.getdbt.com/p/how-ai-will-disrupt-bi-as-we-know) on the future of BI and data consumption. 

*Chat use case:*

We suggest using Claude Desktop for this and creating a custom [project](https://www.anthropic.com/news/projects) that includes a prompt explaining the use cases you are looking to cover. 

To get this working:

- Follow the instructions in the Readme to install the MCP server
- Validate that you have added the MCP config to your Claude desktop config. You should see ‘dbt’ when you go to Claude→Settings→Developer
<Lightbox src="/img/blog/2025-04-18-dbt-mcp-server/claudedesktop_settings_dbt_mcp.png" title="Claude Desktop – MCP server running in Developer settings" width="100%" />

- Create a new project called “analytics”. Give it a description of how an end user might interact with it.

<Lightbox src="/img/blog/2025-04-18-dbt-mcp-server/claudedesktop_project_card.png" title="Example Claude Desktop project connected to the dbt MCP server" width="100%" />

- **Add a custom prompt explaining that questions in this project will likely be routed through the dbt MCP server.** You’ll likely want to customize this to your particular organizational context.
    - For example: This conversation is connected to and knows about the information in your dbt Project via the dbt MCP server. When you receive a question that plausibly needs data from an external data source, you will likely want to use the tools available via the dbt MCP server to provide it.

*Deployment considerations:*

- This is an *experimental release*. We recommend that initial use should be focused on prototyping and proving value before rolling out widely across your organization.
- Be particularly mindful with the project execution tools - remember that LLMs make mistakes and begin with permissions scoped so that you can experiment but not disrupt your data operations.
- Start with the smallest possible use case that provides tangible value. Instead of giving this access to your entire production dbt Project, consider creating an upstream project that inherits a smaller subset of models and metrics that will power the workflow.
- As of right now we don’t have perfect adherence for tool selection. In our testing, the model will sometimes cycle through several unnecessary tool calls or call them in the wrong order. While this can usually be fixed by more specific prompting by the end user, that goes against the spirit of allowing the model to dynamically select the right tool for the job. We expect this to be addressed over time via improvements in the dbt MCP Server, as well as client interfaces and the protocol itself.
- Think carefully about the use cases for Semantic Layer tool vs. using the SQL execution tool. SQL execution is powerful but less controllable. We’re looking to do a lot of hands on testing to begin to develop heuristics about when SQL execution is the best option, when to bake logic into the Semantic Layer and whether there are new abstractions that might be needed for AI workflows.
- Tool use is powerful because it can link multiple tools together. What tools complement the dbt MCP Server? How can we use this to tie our structured data into other workflows?

## The future of the dbt MCP and the correct layers of abstraction for interfacing with your data

We are in the *very* early days of MCP as a protocol and determining how best to connect your structured data to LLM systems. This is an extremely exciting, dynamic time where we are working out, in real time, how to best serve this data and context.

We have high confidence that the approach of serving context to your AI systems via dbt will prove a durable piece of this stack. As we work with the Community on implementing this in real world use cases, it is quite likely that the details of the implementation and how you access it may change. Here are some of the areas we expect this to evolve.

**Determining the best source of context for the dbt MCP**
You’ll notice that these tools have two broad information inputs - dbt Cloud APIs and the dbt CLI. We expect to continue to build on both of these, specifically with dbt Cloud APIs to serve the abstraction of choice when it is desirable to operate off of a specific [environment](https://docs.getdbt.com/docs/dbt-cloud-environments). 

There will be other use cases, specifically for dbt development, when you’ll want to operate based off of your current working context, we’ll be releasing tooling for that in the near future (and welcome Community submitted ideas and contributions). We’re looking forward to trying out alternative methods here and looking forward to hearing from the Community how you would like to have this context loaded in. Please feel free to experiment and share your findings with us.

**Determining the most useful tools for the dbt MCP**

What are the best and most useful set of tools to enable human in the loop and AI driven LLM access to structured data? The dbt MCP server presents our early explorations, but we anticipate that the Community will find many more.

**How to handle hosting, authentication, RBAC and more**

Currently the dbt MCP server is locally hosted, with access management via scoped service tokens from dbt Cloud or locally configured via your CLI. We expect there to be three levels via which we will continue to build out systems to make this not only safe and secure, but tailored to the needs of the specific user (human or agent) accessing the MCP.

1. Hosting of the MCP: In the near future we will have a Cloud hosted version of the MCP alongside the current local MCP
2. Managing data access with the MCP: We are committed to offering safe and trustworthy data and data asset access (think OAuth support and more)
3. User and domain level context: Over the longer run we are looking into ways to provide user and domain specific knowledge about your data assets to the systems as they are querying it. 

Expect to hear more on this front on [5/28](https://www.getdbt.com/resources/webinars/2025-dbt-cloud-launch-showcase).

This is a new frontier for the whole Community. We need to be having open, honest discussions about how to integrate these systems into our existing workflows and open up new use cases.

To join the conversation, head over to #tools-dbt-mcp in the dbt Community Slack.
