---
title: "Connect Starburst or Trino"
description: "Configure Starburst or Trino connection."
sidebar_label: "Connect Starburst or Trino"
---

The following are the required fields for setting up a connection with a [Starburst Enterprise](https://docs.starburst.io/starburst-enterprise/index.html), [Starburst Galaxy](https://docs.starburst.io/starburst-galaxy/index.html), or [Trino](https://trino.io/) cluster. Unless specified, "cluster" means any of these products' clusters.

| Field | Description | Examples |
| --- | --- | --- |
| **Host** | The hostname of your cluster. Don't include the HTTP protocol prefix. | `mycluster.mydomain.com` |
| **Port** | The port to connect to your cluster. By default, it's 443 for TLS enabled clusters. | `443` |
| **User** | The username (of the account) to log in to your cluster. When connecting to Starburst Galaxy clusters, you must include the role of the user as a suffix to the username.<br/><br/> | Format for Starburst Enterprise or Trino depends on your configured authentication method. <br/>Format for Starburst Galaxy:<br/> <ul><li>`user.name@mydomain.com/role`</li></ul> |
| **Password** | The user's password. |   |
| **Database** | The name of a catalog in your cluster. | `example_catalog` |
| **Schema** | The name of a schema that exists within the specified catalog.  | `example_schema` |

## Roles in Starburst Enterprise

<Snippet path="connect-starburst-trino/roles-starburst-enterprise" />

## Catalogs and schemas

<Snippet path="connect-starburst-trino/schema-db-fields" />

## Configuration

To learn how to optimize performance with data platform-specific configurations in dbt Cloud, refer to [Starburst/Trino-specific configuration](/reference/resource-configs/trino-configs).
