---
title: "Record timing info"
id: "record-timing-info"
---

<VersionBlock firstVersion="2.0">

:::info Not supported in the <Constant name="fusion_engine" />
The `--record-timing-info` (`-r`) flag is not supported in the <Constant name="fusion_engine" />. It will be silently ignored if passed. [Learn more about deprecated flags](/docs/dbt-versions/core-upgrade/upgrading-to-fusion#deprecated-flags).
:::

</VersionBlock>

The `-r` or `--record-timing-info` flag saves performance profiling information to a file. This file can be visualized with `snakeviz` to understand the performance characteristics of a dbt invocation.

<File name='Usage'>

```text
$ dbt run -r timing.txt
...

$ snakeviz timing.txt
```

</File>

Alternatively, you can use [`py-spy`](https://github.com/benfred/py-spy) to collect [speedscope](https://github.com/jlfwong/speedscope) profiles of dbt commands like this:

```shell
python -m pip install py-spy
sudo py-spy record -s -f speedscope -- dbt parse
```
