---
title: "Connect Starburst/Trino"
description: "Configure Starburst/Trino connection."
sidebar_label: "Connect Starburst/Trino"
---

The following are the required fields for setting up a connection with Starburst Enterprise, Starburst Galaxy, and Trino cluster. Unless specified, "cluster" will mean any of these products' clusters.     

| Field | Description | Examples |
| --- | --- | --- |
| **Host** | The hostname of your cluster. Don't include the HTTP protocol prefix. | `mycluster.mydomain.com` |
| **Port** | The port to connect to your cluster. By default, it's 443 for TLS enabled clusters. | `443` |
| **User** | The username (of the account) to log in to your cluster. When connecting to Starburst Galaxy clusters, you must include the role of the user as a suffix to the username.<br/><br/> | Format for Starburst Enterprise or Trino: <br/> <ul><li>`user.name`</li><li>`user.name@mydomain.com`</li></ul><br/>Format for Starburst Galaxy:<br/> <ul><li>`user.name@mydomain.com/role`</li></ul> |
| **Password** | The user's password. |   |
| **Database** | The name of a catalog in your cluster. | `my_postgres_catalog` |
| **Schema** | The name of a schema in your cluster that exists within the specified catalog.  | `my_schema` |


## Roles in Starburst Enterprise 
When connecting to a Starburst Enterprise cluster with built-in access controls enabled, you won't be able to provide the role as a suffix to the username, so the default role for the provided username will be used instead.

## Schemas and databases 
When selecting the database (catalog) and the schema, make sure the user has read and write access to both the provided database (catalog) and schema. This selection does not limit your ability to query the catalog. Instead, they serve as the default location for where tables and views are materialized. This _default_ can be changed later from within your dbt project.