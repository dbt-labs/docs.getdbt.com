---
title: How do I run models downstream of one source?
description: "Use source selector to run models downstream of a source"
sidebar_label: 'Run  models downstream of one source'
id: running-model-downstream-of-source

---
To run models downstream of a source, use the `source:` selector:

```shell
$ dbt run --select source:jaffle_shop+
```
(You can also use the `-s` shorthand here instead of `--select`)

To run models downstream of one source <Term id="table" />:

```shell
$ dbt run --select source:jaffle_shop.orders+
```

Check out the [model selection syntax](/reference/node-selection/syntax) for more examples!
