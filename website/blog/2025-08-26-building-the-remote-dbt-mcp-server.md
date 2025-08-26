---
title: "Building the Remote dbt MCP Server"
description: "Learn about the new remote dbt MCP server, how it was built, and how to use it to build agents."
slug: building-the-remote-dbt-mcp-server
authors: [devon_fulcher]

tags: [ai, data ecosystem, mcp]
hide_table_of_contents: false

date: 2025-08-26
is_featured: true
---

In April, we released the local [dbt MCP (Model Context Protocol) server](/blog/introducing-dbt-mcp-server) as an open source project to connect AI agents and LLMs with direct, governed access to trusted dbt assets. The dbt MCP server provides a [universal, open standard](https://docs.anthropic.com/en/docs/mcp) for bridging AI systems with your structured context that keeps your agents accurate, governed, and trustworthy. Learn more in [About dbt Model Context Protocol](/docs/dbt-ai/about-mcp).

Since releasing the local dbt MCP server, the dbt community has been applying it in incredible ways including agentic conversational analytics, data catalog exploration, and dbt project refactoring. However, a key piece of feedback we received from AI engineers was that the local dbt MCP server isn’t easy to deploy or host for multi-tenanted workloads, making it difficult to build applications on top of the dbt MCP server.

This is why we are excited to announce a new way to integrate with dbt MCP: **the remote dbt MCP server**. The remote dbt MCP server doesn’t require installing dependencies or running the dbt MCP server in your infrastructure, making it easier than ever to build and run agents. It is **available today in public beta** for users with dbt Starter, Enterprise, or Enterprise+ plans, ready for you to start building AI-powered applications.

<!--truncate-->

## What is the Remote dbt MCP Server? <Lifecycle status="self_service,managed,managed_plus,beta" />

Commonly, agents and MCP servers run locally on your computer, but local-first agents are limited in the type of applications that can be built. With remote MCP, new experiences are possible. For instance, remote MCP enables server-side agents to perform long-running tasks, be shared across an organization, and be accessed through web applications -- all experiences that are far more difficult (or impossible) in a local agent architecture.

The remote dbt MCP server brings **structured, governed context** to these experiences and enables you to build innovative data applications on top of them. The remote dbt MCP server makes it possible for your agent to answer business questions with the [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl), discover data assets with the [dbt Discovery API](/docs/dbt-cloud-apis/discovery-api), and run natural-language queries with SQL tools. Check out our docs [here](/docs/dbt-ai/about-mcp) to learn about the full list of supported tools. These capabilities are easy to integrate in various platforms with the standardized MCP specification.

The remote dbt MCP server is great for application builders, but there are still times when you would want to run the dbt MCP server locally. Specifically, **if you are using a local coding agent like Cursor or Claude Code, we recommend the local dbt MCP server.** This ensures that the code you are writing locally matches what the agent has access to.

## The Remote dbt MCP Server Architecture

Hosting your own remote MCP server is non-trivial. While a local MCP server only has to consider a single tenant experience, remote servers need to manage concurrent connections from multiple different users as well as the deployment and maintenance of the server and infrastructure. Additionally, connections need to be securely authenticated and isolated from each other. The latest updates to the MCP spec provides a new way to communicate with MCP servers, [Streamable HTTP](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports), allowing for stateless remote connections with agents. Streamable HTTP makes things easier but there is still a high lift for most data teams to deploy an MCP server. With the remote dbt MCP server, we handle all of this complexity so, if you are building an agentic application, all you need to worry about is making an HTTP connection to our API.

At the same time, we want the remote dbt MCP server to have similar functionality as the local dbt MCP server without entirely reimplementing the tools. We implemented these requirements by running a Streamable HTTP MCP server and adding proxied versions of each dbt MCP tool to this server. The proxied version of each tool has the same tool parameters, description, and implementation as the open source version, ensuring a consistent experience. The difference is that the proxied versions are configured via HTTP headers rather than environment variables and these tools connect directly to our internal APIs which reduces latency.

<Lightbox src="/img/blog/2025-08-26-building-the-remote-dbt-mcp-server/remote-dbt-mcp.png" title="The remote dbt MCP architecture" />

## The Remote dbt MCP Server in Action

Now that we have a better understanding of how the remote dbt MCP server works, let's implement it in practice by creating a simple agent loop with LangGraph in Python. We are using LangGraph as an example here, but you can use whichever language or framework you would like. Check out our [examples directory](https://github.com/dbt-labs/dbt-mcp/tree/main/examples) for more resources on creating agents with the dbt MCP server, including the full example shown here.

The agent we implement here will be able to conduct conversational analytics grounded in **structured, governed context** from your dbt project. This means it can receive a user's question, search for relevant metadata with the dbt Discovery API, find important metrics with dbt Semantic Layer API, explore the data, and return an accurate, trustworthy answer. This shows how the remote dbt MCP server can power AI applications that combine the flexibility of LLMs with the trust and consistency of your dbt assets.

For this example to work, you will need to install LangGraph dependencies and set an environment variable for the Anthropic API key:

```shell
pip install langgraph "langchain[anthropic]" langchain-mcp-adapters
export ANTHROPIC_API_KEY=<your-api-key>
```

First, we need to define the URL & headers that the MCP client will use. These values will depend on your specific dbt Cloud deployment. In this example, we are setting the configuration from environment variables. For more information on this configuration, refer to [About dbt Model Context Protocol ](/docs/dbt-ai/about-mcp).

```python
import os

url = f"https://{os.environ.get('DBT_HOST')}/api/ai/v1/mcp/"
headers = {
  "x-dbt-user-id": os.environ.get("DBT_USER_ID"),
  "x-dbt-prod-environment-id": os.environ.get("DBT_PROD_ENV_ID"),
  "x-dbt-dev-environment-id": os.environ.get("DBT_DEV_ENV_ID"),
  "Authorization": f"token {os.environ.get('DBT_TOKEN')}",
}
```

Next, we need to create an MCP client, so our agent knows how to use the remote dbt MCP server.

```python
from langchain_mcp_adapters.client import MultiServerMCPClient

client = MultiServerMCPClient(
  {
    "dbt": {
      "url": url,
      "headers": headers,
      "transport": "streamable_http",
    }
  }
)
```

Then, we need to get the available tools from the remote dbt MCP server.

```python
tools = await client.get_tools()
```

Now, we can create our LangGraph agent.

```python
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import InMemorySaver

agent = create_react_agent(
  model="anthropic:claude-3-7-sonnet-latest",
  tools=tools,
  # This allows the agent to have conversational memory.
  checkpointer=InMemorySaver(),
)
```

Finally, we can run the agent in a loop. This example relies on `print_stream_item` which you can find in the full example [here](https://github.com/dbt-labs/dbt-mcp/blob/365bc0f4c28b48510d194201370a5500d69cc5ea/examples/langgraph_agent/main.py#L11). You can exit the loop by killing the program with CTRL+C.

```python
# This config maintains the conversation thread.
config = {"configurable": {"thread_id": "1"}}
while True:
  user_input = input("User > ")
  agent_response = agent.invoke(
    {"messages": {"role": "user", "content": user_input}},
    config
  )
  print_stream_item(item)
```

With our agent implemented, we can run the program and ask it a question. You should see an output like this:

```shell
User > How much revenue did we make last month?
Agent > I'll help you find out the revenue for last month. Let me first check what metrics are available in the dbt Semantic Layer.
    using tool: list_metrics
Agent > I see that we have a "revenue" metric available. Let me get the dimensions for this metric to understand how I can query for last month's data:
    using tool: get_dimensions
Agent > Now I'll query the revenue metric for last month. I'll use the "metric_time" dimension with a MONTH grain:
    using tool: query_metrics
Agent > Based on the results, the total revenue for last month was **$102,379.00**.
```

## Future Work

Now that remote dbt MCP is available in public beta, we encourage you to build agents to interact with your dbt resources, bringing **structured, governed context** into AI workflows without the overhead of local setup. Here are some ideas for types of agents you can build with the remote dbt MCP server:

- Answer business-related questions with accurate, governed metrics from dbt
- Identify PII columns and enforcing governance policies automatically
- PR review agent to improve code quality and expedite the review process
- Explore metadata and catalog information to accelerate data discovery and troubleshooting
- On-call incident support agent to remediate issues faster

We are continuing to invest in remote dbt MCP, with upcoming features like OAuth-based authentication to make remote MCP authentication & authorization even easier. If you have any feedback, need help, or just want to chat, join us in the #tools-dbt-mcp channel in [our community Slack](https://www.getdbt.com/community/join-the-community).
