---
title: How do I run tests on just my sources?
description: "Use the select source command to test sources"
sidebar_label: 'Run tests on all sources'
id: testing-sources

---

To run tests on all sources, use the following command:

```shell
$ dbt test --select "source:*"
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

