---
title: "Connector properties"
sidebar_label: "Connector properties"
description: "Use Starburst and Trino table properties to configure how dbt represents your data, including recommended Hive settings."
---

You can use Starburst/Trino table properties to configure how you want your data to be represented.

For details on what's supported for each supported data source, refer to either the [Trino Connectors](https://trino.io/docs/current/connector.html) or [Starburst Catalog](https://docs.starburst.io/starburst-galaxy/catalogs/).



### Hive catalogs

At target catalog that uses the Hive connector and a metastore service (HMS) is typical when working with Starburst and dbt. The following settings are recommended for working with dbt. The intent is to ensure that dbt can perform the frequently executed `DROP` and `RENAME` statements.

```java
hive.metastore-cache-ttl=0s
hive.metastore-refresh-interval=5s
```
