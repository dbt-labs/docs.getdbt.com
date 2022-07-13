---
title: How do I build one seed at a time?
---
As of v0.16.0, you can use a `--select` option with the `dbt seed` command, like so:

```
$ dbt seed --select country_codes
```
There is also an `--exclude` option.

Check out more in the [model selection syntax](node-selection/syntax) documentation.

Prior to v0.16.0, there was no way to build one seed at a time.
