<Expandable alt_header="Toolset unavailable or showing as disabled">

**Symptoms:** A toolset (Semantic Layer, Discovery, Admin API) is not available in your AI client even though you've configured credentials.

**Cause:** Either the required variables are missing, or the toolset has been explicitly disabled.

**Solution:**

1. Check that all required variables for the toolset are set — see [Tool requirements](/docs/dbt-ai/setup-local-mcp#tool-requirements-at-a-glance).
2. Check whether you have any `DISABLE_*` variables set to `true` that might be turning off the toolset.
3. If you're using enable mode (`DBT_MCP_ENABLE_*`), make sure the toolset you need is listed.
4. Set `DBT_MCP_LOG_LEVEL=DEBUG` to see which toolsets are active at startup.
</Expandable>
