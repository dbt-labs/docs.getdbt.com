---
title: How do I run models downstream of a seed?
description: "You run models downstread using model selection syntax"
sidebar_label: 'Run models downstream of a seed'
id: run-downstream-of-seed

---

You can run models downstream of a seed using the [model selection syntax](/reference/node-selection/syntax), and treating the seed like a model.

For example, the following would run all models downstream of a seed named `country_codes`:

```shell
$ dbt run --select country_codes+
```
