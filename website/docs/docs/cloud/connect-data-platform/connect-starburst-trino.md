---
title: "Connect Starburst/Trino"
description: "Configure Starburst/Trino connection."
sidebar_label: "Connect Starburst/Trino"
---

The required fields for setting up a connection with Starburst Enterprise, Starburst Galaxy, and Trino cluster are:  

| Field | Description | Examples |
| --- | --- | --- |
| **Host** | The hostname of your Starburst Enterprise, Starburst Galaxy, or Trino cluster. Don't include the HTTP protocol. | `mycluster.mydomain.com` |
| **Port** | The port to connect to for your Starburst Enterprise, Starburst Galaxy or Trino cluster. By default, it's 443 for TLS enabled clusters. | `443` |
| **User** | The username (of the account) to log in to your Starburst Enterprise, Starburst Galaxy, or Trino cluster. The user must have permissions to create and drop tables. When connecting to Starburst Galaxy clusters, you must include the role of the user as a suffix to the username.<br/><br/>When connecting to a Starburst Enterprise cluster with built-in access controls enabled, you will not be able to provide the role as a suffix to the username, so the default role for the provided username will be used instead. | Format for Starburst Enterprise or Trino: <br/> <ul><li>`user.name`</li><li>`user.name@mydomain.com`</li></ul><br/>Format for Starburst Galaxy:<br/> <ul><li>`user.name@mydomain.com/role`</li></ul> |
| **Password** | The user's password. |   |
| **Database** | The name of a catalog in your Starburst Enterprise, Starburst Galaxy, or Trino cluster. The user must have read/write access to this catalog. The selection you make doesn't limit the data you can access through dbt to the specified catalog in Starburst/Trino. It's only used for the initial connection to your cluster. | `my_postgres_catalog` |
| **Schema** | The name of a schema in your Starburst Enterprise, Starburst Galaxy, or Trino cluster that exists within the specified catalog. The user must have read/write access to this schema. The selection you make doesn't limit the data you can access through dbt to the specified schema in Starburst/Trino. It's only used for the initial connection to your cluster. | `my_schema` |
