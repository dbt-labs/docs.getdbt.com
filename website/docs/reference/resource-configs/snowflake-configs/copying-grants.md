---
title: "Copying grants"
sidebar_label: "Copying grants"
description: "Use the copy_grants config to add the copy grants qualifier when dbt rebuilds Snowflake tables, views, and dynamic tables."
---

When the `copy_grants` config is set to `true`, dbt will add the `copy grants` <Term id="ddl" /> qualifier when rebuilding tables, <Term id="view">views</Term>, and [dynamic tables](/reference/resource-configs/snowflake-configs/dynamic-tables#copy-grants-dynamic-tables) (`dbt-snowflake` v1.11 and later). The default value is `false`.

<File name='dbt_project.yml'>

```yaml
models:
  +copy_grants: true
```

</File>
