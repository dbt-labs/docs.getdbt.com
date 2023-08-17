---
title: "Databricks Permissions"
---

## Example Databricks permissions

```
-- NOTE: in general permissions can be granted on securable_objects to
principals (can be user, service principal, or group)
-- e.g.: grant privilege_type on securable_object to principal

grant all privileges on schema schema_name to principal;
grant create table on schema schema_name to principal;
grant create view on schema schema_name to principal;
```

Check out the [Official Documentation](https://docs.databricks.com/en/data-governance/unity-catalog/manage-privileges/privileges.html#privilege-types-by-securable-object-in-unity-catalog) for more information.
