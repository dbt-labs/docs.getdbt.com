<Tabs>

<TabItem value="platform-only" label="dbt platform only">

This option is for users who only want dbt platform features (Discovery API, Semantic Layer, job management) without self-hosted <Constant name="platform_cli" /> commands.

When you use only the dbt platform, the CLI tools are automatically disabled. You can find the `DBT_HOST` field value in your dbt platform account information under **Access URLs**.


```json
{
  "mcpServers": {
    "dbt": {
      "command": "uvx",
      "args": ["dbt-mcp"],
      "env": {
        "DBT_HOST": "YOUR-ACCESS-URL"
      }
    }
  }
}
```

**Note:** Replace `YOUR-ACCESS-URL` with your Access URL hostname (for example, `abc123.us1.dbt.com`). Both `abc123.us1.dbt.com` and `https://abc123.us1.dbt.com` are accepted. This enables OAuth authentication without requiring self-hosted dbt installation.

</TabItem>

<TabItem value="platform-cli" label="dbt platform + CLI">

This option is for users who want both <Constant name="platform_cli" /> commands and dbt platform features (Discovery API, Semantic Layer, job management).

The `DBT_PROJECT_DIR` and `DBT_PATH` fields are required for CLI access. You can find the `DBT_HOST` field value in your dbt platform account information under **Access URLs**.

```json
{
  "mcpServers": {
    "dbt": {
      "command": "uvx",
      "args": ["dbt-mcp"],
      "env": {
        "DBT_HOST": "YOUR-ACCESS-URL",
        "DBT_PROJECT_DIR": "/path/to/project",
        "DBT_PATH": "/path/to/dbt/executable"
      }
    }
  }
}
```

**Note:** Replace `YOUR-ACCESS-URL` with your Access URL hostname (for example, `abc123.us1.dbt.com`). Both `abc123.us1.dbt.com` and `https://abc123.us1.dbt.com` are accepted. This enables OAuth authentication.

</TabItem>

</Tabs>
