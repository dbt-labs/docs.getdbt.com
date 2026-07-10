---
title: "Permissions"
sidebar_label: "Permissions"
description: "Review the permissions required for the user executing dbt against Microsoft SQL Server."
---

The following permissions are required for the user executing dbt:

* `CREATE SCHEMA` on the database level (or you can create the schema in advance)
* `CREATE TABLE` on the database level (or on the user's own schema if the schema is already created)
* `CREATE VIEW` on the database level (or on the user's own schema if the schema is already created
* `SELECT` on the tables/views being used as dbt sources

The 3 `CREATE` permissions above are required on the database level if you want to make use of tests or snapshots in dbt. You can work around this by creating the schemas used for testing and snapshots in advance and granting the right roles.
