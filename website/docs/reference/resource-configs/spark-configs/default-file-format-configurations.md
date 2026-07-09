---
title: "Default file format configurations"
sidebar_label: "Default file format"
description: "How to set Delta, Iceberg, or Hudi as the default file format to unlock advanced incremental strategies in Apache Spark."
---

To access advanced incremental strategies features, such as 
[snapshots](/docs/build/snapshots) and the `merge` incremental strategy, you will want to
use the Delta, Iceberg or Hudi file format as the default file format when materializing models as tables.

It's quite convenient to do this by setting a top-level configuration in your
project file:

<File name='dbt_project.yml'>

```yml
models:
  +file_format: delta # or iceberg or hudi
  
seeds:
  +file_format: delta # or iceberg or hudi
  
snapshots:
  +file_format: delta # or iceberg or hudi
```

</File>
