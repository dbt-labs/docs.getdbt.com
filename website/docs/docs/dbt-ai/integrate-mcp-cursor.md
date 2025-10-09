---
title: "Integrate Cursor with dbt MCP"
sidebar_label: "Integrate Cursor with MCP"
description: "Guide to set up Cursor with dbt-mcp"
id: "integrate-mcp-cursor"
---

# Integrate Cursor with dbt MCP <Lifecycle status="beta" />

[Cursor](https://docs.cursor.com/context/model-context-protocol) is an AI-powered code editor, powered by Microsoft Visual Studio Code (VS Code). 

After setting up your MCP server, you connect it to Cursor. Log in to Cursor and follow the steps that align with your hosting method.

## Set up with local dbt MCP server

1. Configure your environment variables in an `.env` file locally.
2. Click the following application link with Cursor open:

    [Add to Cursor](cursor://anysphere.cursor-deeplink/mcp/install?name=dbt-mcp&config=eyJjb21tYW5kIjoidXZ4IC0tZW52LWZpbGUgPGVudi1maWxlLXBhdGg%252BIGRidC1tY3AifQ%3D%3D)

3. Update inputs in the template. 
4. Save, and now you have access to the dbt-mcp!

#### Set up with dbt platform authentication <Lifecycle status="managed, managed_plus" />
You can configure the local MCP server for use with the dbt platform via OAuth: 

1. Click one of the following application links with Cursor open:

    - [dbt platform only](cursor://anysphere.cursor-deeplink/mcp/install?name=dbt&config=eyJlbnYiOnsiREJUX0hPU1QiOiJodHRwczovLzx5b3VyLWRidC1ob3N0LXdpdGgtY3VzdG9tLXN1YmRvbWFpbj4iLCJESVNBQkxFX0RCVF9DTEkiOiJ0cnVlIn0sImNvbW1hbmQiOiJ1dnggZGJ0LW1jcCJ9)
    - [dbt platform + CLI](cursor://anysphere.cursor-deeplink/mcp/install?name=dbt&config=eyJlbnYiOnsiREJUX0hPU1QiOiJodHRwczovLzx5b3VyLWRidC1ob3N0LXdpdGgtY3VzdG9tLXN1YmRvbWFpbj4iLCJEQlRfUFJPSkVDVF9ESVIiOiIvcGF0aC90by9wcm9qZWN0IiwiREJUX1BBVEgiOiJwYXRoL3RvL2RidC9leGVjdXRhYmxlIn0sImNvbW1hbmQiOiJ1dnggZGJ0LW1jcCJ9)

2. Update inputs in the template. 
3. Save, and now you have access to the dbt-mcp!



## Set up with remote dbt MCP server

1. Click the following application link with Cursor open:

    [Add to Cursor](cursor://anysphere.cursor-deeplink/mcp/install?name=dbt&config=eyJ1cmwiOiJodHRwczovLzxob3N0Pi9hcGkvYWkvdjEvbWNwLyIsImhlYWRlcnMiOnsiQXV0aG9yaXphdGlvbiI6InRva2VuIDx0b2tlbj4iLCJ4LWRidC1wcm9kLWVudmlyb25tZW50LWlkIjoiPHByb2QtaWQ%252BIn19)

2. Provide your URL/headers by updating the **host**, **production environment ID**, and **service token** in the template. 
3. Save, and now you have access to the dbt MCP server!

