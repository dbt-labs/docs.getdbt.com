---
title: How do I run models downstream of one source?
---
To run models downstream of a source, use the `source:` selector:

```
$ dbt run --models source:jaffle_shop+
```
(You can also use the `-m` shorthand here instead of `--models`)

To run models downstream of one source table:

```
$ dbt run --models source:jaffle_shop.orders+
```

Check out the [model selection syntax](node-selection/syntax) for more examples!
