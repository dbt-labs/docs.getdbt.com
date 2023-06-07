---
title: How do I build one seed at a time?
description: "Use select flag to build one seed at a time"
sidebar_label: "Build one seed at a time"
id: build-one-seed
---

As of v0.16.0, you can use a `--select` option with the `dbt seed` command, like so:

```shell

$ dbt seed --select country_codes

```

There is also an `--exclude` option.

Check out more in the [model selection syntax](/reference/node-selection/syntax) documentation.

Prior to v0.16.0, there was no way to build one seed at a time.
