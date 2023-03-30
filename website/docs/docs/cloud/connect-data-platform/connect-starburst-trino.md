---
title: "Connect Starburst/Trino"
description: "Configure Starburst/Trino connection."
sidebar_label: "Connect Starburst/Trino"
---

The required fields for setting up a connection with Starburst Enterprise, Starburst Galaxy, and Trino cluster are:  

| Field | Description | Examples |
| --- | --- | --- |
| **Host** | The hostname of your cluster. Don't include the HTTP protocol prefix (e.g. `https://`). | `mycluster.mydomain.com` |
| **Port** | The port to connect cluster. By default, it's 443 for TLS enabled clusters. | `443` |
| **User** | The username (of the account) to log in to your cluster. When connecting to Starburst Galaxy clusters, you must include the role of the user as a suffix to the username.<br/><br/> | Format for Starburst Enterprise or Trino: <br/> <ul><li>`user.name`</li><li>`user.name@mydomain.com`</li></ul><br/>Format for Starburst Galaxy:<br/> <ul><li>`user.name@mydomain.com/role`</li></ul> |
| **Password** | The user's password. |   |
| **Database** | The name of a catalog in your cluster. | `my_postgres_catalog` |
| **Schema** | The name of a schema in your cluster that exists within the specified catalog.  | `my_schema` |
