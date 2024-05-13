---
title: "Resource type"
id: "resource-type"
sidebar: "resource type"
---

The `--resource-type` and `--exclude-resource-type` flags include or exclude resource types (such as saved queries and unit tests) from the `dbt run`, `dbt build`, and `dbt clone` commands. For example, to build or run `saved_queries`, use the `--resource-type` flag and run the command `dbt build --resource-type saved_query`.

<File name='Usage'>

```text
$ dbt build --exclude-resource-type UNIT_TEST_NAME

```

</File>
