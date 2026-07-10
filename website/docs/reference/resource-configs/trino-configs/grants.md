---
title: "Grants"
sidebar_label: "Grants"
description: "Use grants to manage access to datasets dbt produces on Starburst, Starburst Galaxy, and Hive connectors."
---

Use [grants](/reference/resource-configs/grants) to manage access to the datasets you're producing with dbt. You can use grants with [Starburst Enterprise](https://docs.starburst.io/latest/security/biac-overview.html), [Starburst Galaxy](https://docs.starburst.io/starburst-galaxy/security/access-control.html), and Hive ([sql-standard](https://trino.io/docs/current/connector/hive-security.html)).


To implement access permissions, define grants as resource configs on each model, seed, and snapshot. Define the default grants that apply to the entire project in your `dbt_project.yml` and define model-specific grants within each model's SQL or YAML file.
<File name='dbt_project.yml'>

```yaml
models:
  - name: NAME_OF_YOUR_MODEL
    config:
      grants:
        select: ['reporter', 'bi']
```
</File>
