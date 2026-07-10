---
title: "Default file format configurations"
sidebar_label: "Default file format"
description: "Set Delta as the default file format to access advanced features such as snapshots and the merge incremental strategy."
---

To access advanced incremental strategies features, such as 
[snapshots](/docs/build/snapshots) and the `merge` incremental strategy, you will want to
use the Delta file format as the default file format when materializing models as tables.

It's quite convenient to do this by setting a top-level configuration in your
project file:

<File name='dbt_project.yml'>

```yml
models:
  +file_format: delta
  
seeds:
  +file_format: delta
  
snapshots:
  +file_format: delta
```

</File>
