import MCPFaqUvx from '/snippets/_mcp-faq-uvx.md';
import MCPFaqServerNotStarting from '/snippets/_mcp-faq-server-not-starting.md';

This quickstart walks you through connecting dbt MCP server to your local dbt project. This setup gives you dbt command tools (`run`, `build`, `test`, `compile`, and more) inside your AI assistant. 

If you'd like to connect to <Constant name="dbt_platform"/> with the CLI, see the [OAuth quickstart](/docs/dbt-ai/mcp-quickstart-oauth).

To connect to <Constant name="wizard" />, see the [dbt Wizard quickstart](/docs/dbt-ai/wizard-quickstart).

:::tip No clone required
You don't need to clone the dbt-mcp repository. Install [uv](https://docs.astral.sh/uv/getting-started/installation/) and run `uvx dbt-mcp` — it fetches and runs dbt-mcp for you.
:::

## Prerequisites

- [Install uv](https://docs.astral.sh/uv/getting-started/installation/)
- A local dbt project (the folder containing your `dbt_project.yml` file)
- dbt installed locally (<Constant name="dbt_core"/>, <Constant name="fusion_engine"/>, or <Constant name="platform_cli"/>)

For the full list of environment variables and how to enable or disable toolsets, see the [Environment variables reference](/docs/dbt-ai/mcp-environment-variables).

## Step 1: Find your paths

You need two values before configuring your MCP client:

 - `DBT_PROJECT_DIR` — the full path to your dbt project folder (where `dbt_project.yml` lives). For example, if your project name is `jaffle_shop`, the path should be `/Users/yourname/dbt-projects/jaffle_shop`.
 - `DBT_PATH` — the full path to your dbt executable.

<Tabs>
<TabItem value="mac-linux" label="macOS/Linux">

```bash
# Find DBT_PATH
which dbt
# Example output: /opt/homebrew/bin/dbt

# Find DBT_PROJECT_DIR — run from inside your project folder
pwd
# Example output: /Users/yourname/projects/my_dbt_project
```

</TabItem>

<TabItem value="windows" label="Windows">

```bash
# Find DBT_PATH
where dbt
# Example output: C:\Python39\Scripts\dbt.exe

# Find DBT_PROJECT_DIR — run from inside your project folder
cd
# Example output: C:\Users\yourname\projects\my_dbt_project
```

Note: Use forward slashes in your configuration: `C:/Python39/Scripts/dbt.exe`

</TabItem>

</Tabs>

## Step 2: Add to your MCP client

Replace the paths below with the values from Step 1:

<Tabs>

<TabItem value="claude-desktop" label="Claude Desktop">

1. In Claude Desktop, go to **Settings** → **Developer** tab → **Edit Config**.
2. Paste the following configuration, replacing the paths with your actual values:

```json
{
  "mcpServers": {
    "dbt": {
      "command": "uvx",
      "args": ["dbt-mcp"],
      "env": {
        "DBT_PROJECT_DIR": "/path/to/your/dbt/project",
        "DBT_PATH": "/path/to/your/dbt/executable"
      }
    }
  }
}
```

3. Save and restart Claude Desktop.

Config file location:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

</TabItem>

<TabItem value="claude-code" label="Claude Code">

Run this command, replacing the paths with your actual values:

```shell
claude mcp add dbt \
-e DBT_PROJECT_DIR=/path/to/your/dbt/project \
-e DBT_PATH=/path/to/your/dbt/executable \
-- uvx dbt-mcp
```

</TabItem>

<TabItem value="cursor" label="Cursor">

Click the link below with Cursor open to auto-configure:

[Add <Constant name="dbt_core"/> or <Constant name="fusion"/> to Cursor](cursor://anysphere.cursor-deeplink/mcp/install?name=dbt&config=eyJlbnYiOnsiREJUX1BST0pFQ1RfRElSIjoiL3BhdGgvdG8veW91ci9kYnQvcHJvamVjdCIsIkRCVF9QQVRIIjoiL3BhdGgvdG8veW91ci9kYnQvZXhlY3V0YWJsZSJ9LCJjb21tYW5kIjoidXZ4IiwiYXJncyI6WyJkYnQtbWNwIl19)

After clicking:
1. Update `DBT_PROJECT_DIR` with the full path to your dbt project.
2. Update `DBT_PATH` with the full path to your dbt executable (from Step 1).
3. Save the configuration.

</TabItem>

<TabItem value="vscode" label="VS Code">

1. Open **Settings** → **Features** → **Chat** and ensure **MCP** is enabled.
2. Open the Command Palette (`Ctrl/Cmd + Shift + P`) and select **MCP: Open User Configuration**.
3. Add the following configuration to `mcp.json`, replacing the paths with your actual values:

:::note VS Code uses `"servers"`, not `"mcpServers"`
:::

```json
{
  "servers": {
    "dbt": {
      "command": "uvx",
      "args": ["dbt-mcp"],
      "env": {
        "DBT_PROJECT_DIR": "/path/to/your/dbt/project",
        "DBT_PATH": "/path/to/your/dbt/executable"
      }
    }
  }
}
```

4. Save the file.

</TabItem>

</Tabs>

## Step 3: Test your setup

Ask your AI assistant to run a dbt command (for example, _"Run `dbt compile` on my project"_ or _"List all models in my project"_). If dbt MCP is working, the assistant will execute the command against your local project.

<Expandable alt_header="Optional: verify from the command line">

```bash
uvx dbt-mcp
```

If there are no errors, your configuration is correct. Press `Ctrl+C` to stop the server.

</Expandable>

## What's available

With CLI-only setup, your AI assistant can use:
- `dbt run`, `dbt build`, `dbt test`, `dbt compile`, `dbt list`, `dbt parse`, `dbt show`
- Model lineage and node details from your local project
- Codegen tools (when enabled — see [Environment variables reference](/docs/dbt-ai/mcp-environment-variables))

Platform features like <Constant name="semantic_layer" />, Discovery API, and metadata queries require a <Constant name="dbt_platform" /> account. To add them, see [Connect to <Constant name="dbt_platform"/>](/docs/dbt-ai/mcp-quickstart-oauth).

## Troubleshooting

<Expandable alt_header="Can't find the uvx executable">

<MCPFaqUvx />

</Expandable>

<Expandable alt_header="Server not starting">

<MCPFaqServerNotStarting />

</Expandable>

For all troubleshooting topics, see [MCP troubleshooting](/docs/dbt-ai/mcp-troubleshooting).

## Next steps

- Add <Constant name="dbt_platform" /> features: see [Connect to <Constant name="dbt_platform"/>](/docs/dbt-ai/mcp-quickstart-oauth)
- Configure toolsets or disable specific tools: see the [Environment variables reference](/docs/dbt-ai/mcp-environment-variables)
