---
title: "Connect ClickHouse"
id: connect-clickhouse
description: "Setup instructions for connecting ClickHouse to dbt"
sidebar_label: "Connect ClickHouse"
availability:
  surface: platform
  access: login_required
---

# Connect ClickHouse <Lifecycle status="private_beta" /> <ProductCard text="Fusion compatible" />

<Constant name="dbt_platform" /> supports connecting to [ClickHouse Cloud](https://clickhouse.com/cloud) and to self-managed single-node ClickHouse on v2 with <Constant name="fusion" />.

:::caution ClickHouse private beta
ClickHouse connections on v2 are in private beta and not production-ready. To request access, contact your account representative. Expect some minor bugs, and avoid using them in production environments for now. Refer to [Limitations](#limitations) before you connect.
:::

## Warehouse permissions for <Constant name="fusion" />

import FusionClickHouseWarehousePerms from '/snippets/_fusion-warehouse-permissions-clickhouse.md';

<FusionClickHouseWarehousePerms />

For the full privilege model, refer to [access control in the ClickHouse documentation](https://clickhouse.com/docs/operations/access-rights).

## Connection fields

To set up the ClickHouse connection, supply the following fields:

| Field | Description | Required? | Examples |
| ----- | ----------- | --------- | -------- |
| Server Hostname | The hostname of the ClickHouse service, without a scheme. For ClickHouse Cloud, use the endpoint shown in the console. | Required | `abc123.us-east-1.aws.clickhouse.cloud` |
| Port | The HTTPS interface port. Defaults to 8443. | Optional | `8443` |
| Database | The ClickHouse database where dbt creates its objects. ClickHouse has no separate schema level, so this maps to a database. Defaults to `default`. | Optional | `analytics` |

### Development credentials

Enter your _development_ (not deployment) credentials with the following fields:

| Field | Option | Description | Type | Required | Example |
| ----- | ------ | ----------- | ---- | -------- | ------- |
| Username | `user` | The ClickHouse user dbt connects as | String | Required | `default` |
| Password | `password` | The password for that user | String | Required | |
| Schema | `schema` | The ClickHouse database to build your development models into. ClickHouse has no separate schema level, so this is a database and overrides the connection's Database for your development environment | String | Required | `dbt_dev_database` |
| Target name | `target` | The [target name](/docs/build/custom-target-names) for your development environment | String | Optional | `dev` |
| Threads | `threads` | Number of models dbt builds concurrently | Integer | Optional | `4` |

## Configuration

To optimize performance with data platform-specific configurations in <Constant name="dbt" />, refer to [ClickHouse-specific configuration](/reference/resource-configs/clickhouse-configs).

For a description of the ClickHouse profile fields that the connection maps to, refer to [ClickHouse setup](/docs/local/connect-data-platform/clickhouse-setup).

## Limitations

The ClickHouse connection is in private beta. On the <Constant name="dbt_platform" /> specifically:

- The dbt <Constant name="semantic_layer" /> isn't supported for ClickHouse connections yet.
- Only username and password authentication is available. OAuth, key pair authentication, SSH tunneling, and private connectivity aren't supported for ClickHouse yet.

The <Constant name="fusion" /> ClickHouse adapter limitations apply here too, including the gaps in clusters, grants, `dbt clone`, `dbt source freshness`, and SQL comprehension. For the complete picture, refer to [ClickHouse limitations](/docs/local/connect-data-platform/clickhouse-setup#limitations).
