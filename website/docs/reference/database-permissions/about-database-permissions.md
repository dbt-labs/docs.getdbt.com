---
title: "Database permissions"
id: about-database-permissions
description: "Database permissions are access rights and privileges granted to users or roles within a database management system."
sidebar_label: "About database permissions"
pagination_next: "reference/database-permissions/databricks-permissions"
pagination_prev: null
---

Database permissions are access rights and privileges granted to users or roles within a database or data platform. They help you specify what actions users or roles can perform on various database objects, like tables, views, schemas, or even the entire database.


### Why are they useful

- Database permissions are essential for security and data access control.
- They ensure that only authorized users can perform specific actions.
- They help maintain data integrity, prevent unauthorized changes, and limit exposure to sensitive data.
- Permissions also support compliance with data privacy regulations and auditing.

### How to use them

- Users and administrators can grant and manage permissions at various levels (such as table, schema, and so on) using SQL statements or through the database system's interface.
- Assign permissions to individual users or roles (groups of users) based on their responsibilities.
  - Typical permissions include "SELECT" (read), "INSERT" (add data), "UPDATE" (modify data), "DELETE" (remove data), and administrative rights like "CREATE" and "DROP."
- Users should be assigned permissions that ensure they have the necessary access to perform their tasks without overextending privileges.

Something to note is that each data platform provider might have different approaches and names for privileges. Refer to their documentation for more details.

### Examples

Refer to the following database permission pages for more info on examples and how to set up database permissions:

- [Databricks](/reference/database-permissions/databricks-permissions)
- [Postgres](/reference/database-permissions/postgres-permissions)
- [Redshift](/reference/database-permissions/redshift-permissions)
- [Snowflake](/reference/database-permissions/snowflake-permissions)

### Fusion engine warehouse privileges

When projects run on the <Constant name="fusion_engine" /> (Fusion CLI or a Fusion-supported connection on the <Constant name="dbt_platform" />), use the **Warehouse permissions** sections in the Fusion adapter setup guides for detailed privilege tables:

- [Snowflake](/docs/fusion/connect-data-platform-fusion/snowflake-setup#warehouse-permissions)
- [BigQuery](/docs/fusion/connect-data-platform-fusion/bigquery-setup#warehouse-permissions)
- [Redshift](/docs/fusion/connect-data-platform-fusion/redshift-setup#warehouse-permissions)
- [Databricks](/docs/fusion/connect-data-platform-fusion/databricks-setup#warehouse-permissions)

The same snippets are included on each platform **Connect** page under **Warehouse permissions for the Fusion engine**.
