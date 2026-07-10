---
title: "Default file format configurations"
sidebar_label: "Default file format configurations"
description: "Set Delta or Hudi as the default file format to enable advanced incremental strategies and snapshots in Databricks."
---

To access advanced incremental strategies features, such as 
[snapshots](/reference/commands/snapshot) and the `merge` incremental strategy, you will want to
use the Delta or Hudi file format as the default file format when materializing models as tables.

It's quite convenient to do this by setting a top-level configuration in your
project file:

<File name='dbt_project.yml'>

```yml
models:
  +file_format: delta # or hudi
  
seeds:
  +file_format: delta # or hudi
  
snapshots:
  +file_format: delta # or hudi
```

</File>
