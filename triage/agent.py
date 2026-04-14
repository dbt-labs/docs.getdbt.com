"""
Docs triage agent — runs a triage skill prompt using claude_agent_sdk + Runlayer MCP.

Usage:
    python triage/agent.py "your prompt here"

Required env vars:
    ANTHROPIC_API_KEY       — Anthropic API key (or ABS token)
    RUNLAYER_CLIENT_ID      — Runlayer agent account client ID
    RUNLAYER_CLIENT_SECRET  — Runlayer agent account client secret
    RUNLAYER_MCP_SERVER_ID  — MCP server ID from Runlayer dashboard
"""

import asyncio
import httpx
import os
import sys

from claude_agent_sdk import ClaudeAgentOptions, query


def get_runlayer_token(client_id: str, client_secret: str) -> str:
    response = httpx.post(
        "https://dbt.runlayer.com/api/v1/oauth/token",
        data={
            "grant_type": "client_credentials",
            "client_id": client_id,
            "client_secret": client_secret,
        },
        timeout=10,
    )
    response.raise_for_status()
    return response.json()["access_token"]


async def run(prompt: str) -> None:
    client_id = os.environ["RUNLAYER_CLIENT_ID"]
    client_secret = os.environ["RUNLAYER_CLIENT_SECRET"]
    server_id = os.environ["RUNLAYER_MCP_SERVER_ID"]

    token = get_runlayer_token(client_id, client_secret)

    options = ClaudeAgentOptions(
        allowed_tools=["mcp__runlayer__*"],
        mcp_servers={
            "runlayer": {
                "type": "http",
                "url": f"https://dbt.runlayer.com/api/v1/proxy/{server_id}/mcp",
                "headers": {"Authorization": f"Bearer {token}"},
            }
        },
    )

    async for message in query(prompt=prompt, options=options):
        print(message)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python triage/agent.py '<prompt>'")
        sys.exit(1)
    asyncio.run(run(sys.argv[1]))
