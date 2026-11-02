---
title: "Set up analytics credentials"
id: "analytics-credentials"
description: "Set up one shared warehouse credential on a connection so read-only users can query in dbt Wizard Explore mode and remote MCP without their own credentials."
sidebar_label: "Analytics credentials"
tags: [AI, Wizard, Platform]
keywords: ["analytics credential", "read-only users", "warehouse credentials", "remote MCP", "explore mode", "dbt Wizard"]
availability: platform_usage
---

# Set up analytics credentials

To run a query, <Constant name="wizard" /> Explore mode and remote MCP need warehouse credentials. Most read-only users don't have their own, so an admin sets up an **analytics credential**: a shared, project-level warehouse credential that read-only users fall back to when they haven't configured personal credentials. Read-only users that have their own credentials can use the [Analyst read](/docs/platform/manage-access/enterprise-permissions#analyst-read) permission set.

The analytics credential also works with the [remote dbt MCP server](/docs/dbt-ai/setup-remote-mcp#read-only-users-and-warehouse-credentials). Once an admin sets it up, read-only users can query metrics through their MCP client without logging in to <Constant name="dbt_platform" /> to set up their own credentials.

At query time, <Constant name="wizard" /> and remote MCP resolve credentials in this order:

1. The user's personal warehouse credentials if they have them.
2. The project's analytics credential, if an admin has [set one up](#add-an-analytics-credential-to-a-connection).
3. If neither exists, the query returns an error asking the user to set up personal credentials or contact an admin.

:::note
Only an admin can set up the analytics credential. End users can't set it up themselves.
:::

## Prerequisites

- An [account admin](/docs/platform/manage-access/about-user-access) role.
- A [connection](/docs/platform/connect-data-platform/about-connections) to one of the supported warehouses: Snowflake, BigQuery, Redshift, or Databricks.

## Add an analytics credential to a connection

1. In <Constant name="dbt_platform" />, go to **Account settings** --> **Connections** and select the connection.
2. Scroll to the **Analytics credential** card and click **Edit**. A connection can have one analytics credential.
3. Pick an **Auth method** and enter the warehouse credentials <Constant name="wizard" /> should query with, then click **Save**.

The fields you see depend on the connection's warehouse and the auth method you pick. The following example uses Snowflake with key pair authentication:

1. Enter the **Username** and **Private key** for the warehouse user <Constant name="wizard" /> queries as. 
2. Add the **Private key passphrase** if your key is encrypted.
3. Optionally add a **Role** and **Warehouse** to pin which ones queries run with.

<Lightbox src="/img/docs/dbt-platform/analytics-credential-keypair.png" width="95%" title="Analytics credentials with Key pair selected as the auth method" />


<!-- Username and password auth is labeled "(deprecated)" in the platform UI, so we're not publicizing it. Uncomment if PM confirms it should be documented.

<TabItem value="userpass" label="Username and password">

1. Enter the **Username** and **Password** for the warehouse user <Constant name="wizard" /> queries as.
2. Optionally add a **Role** and **Warehouse** to pin which ones queries run with.

<Lightbox src="/img/docs/dbt-platform/analytics-credential-username-password.png" width="95%" title="Analytics credentials with Username and password selected as the auth method" />

-->


Give the credential the _least privilege_ it needs to answer questions &mdash; read-only access to the data read-only users should see, and nothing more. It's a shared credential, so anyone querying through it sees whatever it can see, without a per-user trail. If you need per-user access control or auditing at the warehouse, have users configure personal credentials instead &mdash; that requires the [Analyst read](/docs/platform/manage-access/enterprise-permissions#analyst-read) permission set.


## Assign the connection to a project

1. Go to **Account settings** --> **Projects** and select the project.
2. In the **Analytics configuration** section, select a connection that has an analytics credential. Only connections with one appear in the picker.
3. Click **Save**. 

Read-only users on that project now query through this credential in Explore mode.

You can reuse the same connection across projects, but each project uses one analytics connection at a time.

## Related docs

- [Invite read-only users to dbt Wizard](/docs/platform/wizard-read-only-users)
- [Set up remote MCP](/docs/dbt-ai/setup-remote-mcp#read-only-users-and-warehouse-credentials)
- [Analyst read permission set](/docs/platform/manage-access/enterprise-permissions#analyst-read)
- [About data platform connections](/docs/platform/connect-data-platform/about-connections)
