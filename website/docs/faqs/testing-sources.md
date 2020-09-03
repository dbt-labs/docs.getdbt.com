---
title: How do I run tests on just my sources?
---

To run tests on all sources, use the following command:

```
$ dbt test --models source:*
```
(You can also use the `-m` shorthand here instead of `--models`)

To run tests on one source (and all of its tables):

```
$ dbt test --models source:jaffle_shop
```

And, to run tests on one source table only:

```
$ dbt test --models source:jaffle_shop.orders
```

Yep, we know this syntax is a little less than ideal, so we're hoping to improve it in a future release. Check out the [model selection syntax](node-selection/syntax) for more examples!
