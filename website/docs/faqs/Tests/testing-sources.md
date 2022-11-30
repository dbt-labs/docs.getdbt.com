---
title: How do I run tests on just my sources?
description: "Use the select source command to test sources"
sidebar_label: 'Run tests on all sources'
id: testing-sources

---

To run tests on all sources, use the following command:

```shell
$ dbt test --select source:*
```

(You can also use the `-s` shorthand here instead of `--select`)

To run tests on one source (and all of its tables):

```shell
$ dbt test --select source:jaffle_shop
```

And, to run tests on one source <Term id="table" /> only:

```shell
$ dbt test --select source:jaffle_shop.orders
```

Yep, we know this syntax is a little less than ideal, so we're hoping to improve it in a future release. Check out the [model selection syntax](node-selection/syntax) for more examples!


:::info Node selection syntax 
In dbt 0.21.0, the node selection syntax [was standardized](https://github.com/dbt-labs/dbt-core/pull/3791) to use `--select` everywhere. Before this, some commands like `dbt run` and `dbt test` used `--models` instead.  

Older versions still show an error because [argparse](https://docs.python.org/3/library/argparse.html#allow-abbrev) is expanding `--select` to `--selector`, which is a different flag.
To fix this issue, either upgrade to dbt 0.21.0 or higher, or use `--models` instead of `--select`.
:::
