<Tabs>

<TabItem value="dbt platform + CLI">

The `DBT_PROJECT_DIR` and `DBT_PATH` fields are required.

You can find the `DBT_HOST` field value in your dbt platform account information under **Access URLs**.

```json
{
  "mcpServers": {
    "dbt": {
      "command": "uvx",
      "args": [
        "dbt-mcp"
      ],
      "env": {
        "DBT_HOST": "https://<your-dbt-host-with-custom-subdomain>",
        "DBT_PROJECT_DIR": "/path/to/project",
        "DBT_PATH": "path/to/dbt/executable"
      }
    }
  }
}
```

</TabItem>
<TabItem value="dbt platform only" >

When you use only the dbt platform, you can disable the CLI tools. You can find the `DBT_HOST` field value in your dbt platform account information under **Access URLs**.


```json
{
  "mcpServers": {
    "dbt": {
      "command": "uvx",
      "args": [
        "dbt-mcp"
      ],
      "env": {
        "DBT_HOST": "https://<your-dbt-host-with-custom-subdomain>",
        "DISABLE_DBT_CLI": "true"
      }
    }
  }
}
```

</TabItem>
</Tabs>