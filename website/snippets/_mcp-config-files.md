<Tabs>

<TabItem value="platform-only" label="dbt platform only">

This option is for users who only want dbt platform features (Discovery API, Semantic Layer, job management) without local CLI commands.

When you use only the dbt platform, the CLI tools are automatically disabled. You can find the <VersionBlock lastVersion="1.10">`DBT_HOST`</VersionBlock><VersionBlock firstVersion="1.11">`DBT_ENGINE_HOST`</VersionBlock> field value in your dbt platform account information under **Access URLs**.

<VersionBlock lastVersion="1.10">

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

**Note:** Replace `YOUR-ACCESS-URL` with your Access URL hostname (for example, `abc123.us1.dbt.com`). Both `abc123.us1.dbt.com` and `https://abc123.us1.dbt.com` are accepted. This enables OAuth authentication without requiring local dbt installation.
</VersionBlock>

<VersionBlock firstVersion="1.11">

```json
{
  "mcpServers": {
    "dbt": {
      "command": "uvx",
      "args": ["dbt-mcp"],
      "env": {
        "DBT_ENGINE_HOST": "https://<your-dbt-host-with-custom-subdomain>",
      }
    }
  }
}
```

</VersionBlock>

**Note:** Replace `<your-dbt-host-with-custom-subdomain>` with your actual host (for example, `abc123.us1.dbt.com`). This enables OAuth authentication without requiring local dbt installation.

</TabItem>

<TabItem value="platform-cli" label="dbt platform + CLI">

This option is for users who want both dbt CLI commands and dbt platform features (Discovery API, Semantic Layer, job management).

The <VersionBlock lastVersion="1.10">`DBT_PROJECT_DIR`</VersionBlock><VersionBlock firstVersion="1.11">`DBT_ENGINE_PROJECT_DIR`</VersionBlock> and `DBT_PATH` fields are required for CLI access. You can find the <VersionBlock lastVersion="1.10">`DBT_HOST`</VersionBlock><VersionBlock firstVersion="1.11">`DBT_ENGINE_HOST`</VersionBlock> field value in your dbt platform account information under **Access URLs**.

<VersionBlock lastVersion="1.10">

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
</VersionBlock>

<VersionBlock firstVersion="1.11">

```json
{
  "mcpServers": {
    "dbt": {
      "command": "uvx",
      "args": ["dbt-mcp"],
      "env": {
        "DBT_ENGINE_HOST": "https://<your-dbt-host-with-custom-subdomain>",
        "DBT_ENGINE_PROJECT_DIR": "/path/to/project",
        "DBT_PATH": "/path/to/dbt/executable"
      }
    }
  }
}
```

</VersionBlock>

**Note:** Replace `<your-dbt-host-with-custom-subdomain>` with your actual host (for example, `https://abc123.us1.dbt.com`). This enables OAuth authentication.

</TabItem>

</Tabs>
