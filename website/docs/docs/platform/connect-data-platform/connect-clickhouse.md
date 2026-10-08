---
title: "Connect ClickHouse"
id: connect-clickhouse
description: "Configure the ClickHouse platform connection in dbt."
sidebar_label: "Connect ClickHouse"
availability:
  surface: platform
  access: login_required
  engine: v2
---

# Connect ClickHouse <Lifecycle status="private_beta" /> <ProductCard text="Fusion compatible" />

The <Constant name="fusion_engine" /> in <Constant name="dbt_platform" /> supports connecting to [ClickHouse Cloud](https://clickhouse.com/cloud) and to self-managed single-node ClickHouse. Use a <Constant name="fusion" /> release track for the environment that uses this connection.

:::caution ClickHouse private beta
ClickHouse connections on v2 are in private beta and not production-ready. To request access, contact your account representative. Expect some minor bugs, and avoid using them in production environments for now. Refer to [Limitations](#limitations) before you connect.
:::

## Warehouse permissions for <Constant name="fusion" />

import FusionClickHouseWarehousePerms from '/snippets/_fusion-warehouse-permissions-clickhouse.md';

<FusionClickHouseWarehousePerms />

For the full privilege model, refer to [access control in the ClickHouse documentation](https://clickhouse.com/docs/operations/access-rights).

## Connection fields

Configure the following fields when you create a ClickHouse connection.

<SimpleTable>

| Field           | Description                                                                                      | Type   | Required? | Example |
| --------------- | ------------------------------------------------------------------------------------------------ | ------ | --------- | ------- |
| Server Hostname | The ClickHouse Cloud endpoint URL. Do not include `https://` or the port. Copy this from **Connect** in the [ClickHouse Cloud console](https://clickhouse.com/docs/get-started/quickstarts/obtain-your-cloud-connection-details#find-your-connection-details). | String | Required  | `abc123.us-east-1.aws.clickhouse.cloud` |
| Port            | The port to connect to. The dbt ClickHouse adapter connects over HTTPS. Use port `8443`. Port `9440` (native protocol) is not supported by the adapter. | String | Optional  | `8443` |
| Database        | The name of the database to connect to.                                                          | String | Optional  | `default` |

</SimpleTable>

<Lightbox src="/img/docs/dbt-platform/clickhouse-connection.png" title="Example of the ClickHouse connection fields." />

After you save the connection, set up your development environment:

1. Create a new project or open an existing one.
2. In your project settings, select **Environments** from the left menu and open your development environment.
3. Under **Connection**, select the ClickHouse connection you just created.
4. Save the environment.

<Lightbox src="/img/docs/dbt-platform/clickhouse-environment.png" title="Select the ClickHouse connection for the development environment." />

## Development and deployment credentials

Each developer enters personal development credentials in **Your profile** → **Credentials**. For ClickHouse Cloud, copy the username and password from the **Connect** dialog in the [ClickHouse Cloud console](https://clickhouse.com/docs/get-started/quickstarts/obtain-your-cloud-connection-details#find-your-connection-details). The username is typically `default`.

<SimpleTable>

| Field        | Description                                                                                  | Type   | Required? | Example             |
| ------------ | -------------------------------------------------------------------------------------------- | ------ | --------- | ------------------- |
| Username     | The database username.                                                                       | String | Required  | `default`           |
| Password     | The database password.                                                                       | String | Optional  | DatabasePassword123 |
| Schema       | In development, dbt builds your models into a schema with this name. Use a schema unique to your personal development environment. | String | Required  | dbtlabsdocstest     |
| Target name  | The target name for this credential.                                                         | String | Optional  | `default`           |
| Threads      | The number of threads to use for dbt operations.                                             | Integer | Optional | `4`                 |

</SimpleTable>

<Lightbox src="/img/docs/dbt-platform/clickhouse-credentials.png" title="Example of the ClickHouse user credential fields." />

## Configuration

To learn how to optimize performance with data platform-specific configurations in <Constant name="dbt" />, refer to [ClickHouse configurations](/reference/resource-configs/clickhouse-configs).

For a description of the ClickHouse profile fields that the connection maps to, refer to [ClickHouse setup](/docs/local/connect-data-platform/clickhouse-setup).

## Limitations

The ClickHouse connection is in private beta. On the <Constant name="dbt_platform" /> specifically:

- The dbt <Constant name="semantic_layer" /> isn't supported for ClickHouse connections yet.
- Only username and password authentication is available. OAuth, key pair authentication, SSH tunneling, and private connectivity aren't supported for ClickHouse yet.

The <Constant name="fusion" /> ClickHouse adapter limitations apply here too, including the gaps in clusters, grants, `dbt clone`, `dbt source freshness`, and SQL comprehension. For the complete picture, refer to [ClickHouse limitations](/docs/local/connect-data-platform/clickhouse-setup#limitations).
