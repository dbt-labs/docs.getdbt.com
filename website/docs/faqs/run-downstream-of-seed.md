---
title: How do I run models downstream of a seed?
---

You can run models downstream of a seed using the [model selection syntax](docs/running-a-dbt-project/command-line-interface/model-selection-syntax.md), and treating the seed like a model.

For example, the following would run all models downstream of a seed named `country_codes`:

```
$ dbt run --models country_codes+
```
