---
title: "Databricks permissions"
---

In Databricks, permissions are used to control who can perform certain actions on different database objects. Use SQL statements to manage permissions in a Databricks database.

## Example Databricks permissions

The following example provides you with the SQL statements you can use to manage permissions. 

**Note that you can grant permissions on `securable_objects` to `principals` (This can be user, service principal, or group). For example, `grant privilege_type` on `securable_object` to `principal`.

```
-- NOTE: in general permissions can be granted on securable_objects to
principals (can be user, service principal, or group)
-- e.g.: grant privilege_type on securable_object to principal

grant all privileges on schema schema_name to principal;
grant create table on schema schema_name to principal;
grant create view on schema schema_name to principal;
```

Check out the [official documentation](https://docs.databricks.com/en/data-governance/unity-catalog/manage-privileges/privileges.html#privilege-types-by-securable-object-in-unity-catalog) for more information.
