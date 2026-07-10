---
title: "Grants with auto provisioning"
sidebar_label: "Grants"
description: "Use the grants config and auto-provisioning to manage access with Microsoft Entra ID authentication in dbt-sqlserver."
---

dbt 1.2 introduced the capability to grant/revoke access using the `grants` [configuration option](/reference/resource-configs/grants).
In dbt-sqlserver, you can additionally set `auto_provision_aad_principals` to `true` in your model configuration if you are using Microsoft Entra ID authentication with an Azure SQL Database or Azure Synapse Dedicated SQL Pool.

This will automatically create the Microsoft Entra ID principal inside your database if it does not exist yet.
Note that the principals need to exist in your Microsoft Entra ID, this just makes them available to use in your database.

Principals are not removed again when they are removed from the grants configuration.

<File name="dbt_project.yml">

```yaml
models:
  your_project_name:
    auto_provision_aad_principals: true
```

</File>
