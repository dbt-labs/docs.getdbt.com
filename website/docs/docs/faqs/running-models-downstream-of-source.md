---
title: How do I run models downstream of one source?
---
To run models downstream of a source, use the `source:` selector:

```
$ dbt run --select source:jaffle_shop+
```
(You can also use the `-s` shorthand here instead of `--select`)

To run models downstream of one source <Term id="table" />:

```
$ dbt run --select source:jaffle_shop.orders+
```

Check out the [model selection syntax](node-selection/syntax) for more examples!
