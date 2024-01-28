---
title: "Record timing info"
id: "record-timing-info"
---

The `-r` or `--record-timing-info` flag saves performance profiling information to a file. This file can be visualized with `snakeviz` to understand the performance characteristics of a dbt invocation

<File name='Usage'>

```text
$ dbt -r timing.txt run
...

$ snakeviz timing.txt
```

</File>
