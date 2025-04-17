---
title: "Record timing info"
id: "record-timing-info"
---

The `-r` or `--record-timing-info` flag saves performance profiling information to a file. This file can be visualized with `snakeviz` to understand the performance characteristics of a dbt invocation.

<File name='Usage'>

```text
$ dbt -r timing.txt run
...

$ snakeviz timing.txt
```

</File>

Alternatively, you can use [`py-spy`](https://github.com/benfred/py-spy) to collect [speedscope](https://github.com/jlfwong/speedscope) profiles of dbt commands like this:

```shell
python -m pip install py-spy
sudo py-spy record -s -f speedscope -- dbt parse
```
