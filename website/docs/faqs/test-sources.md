---
title: How do I run tests on sources only?
---

Test selection syntax predates sources. It is based on model selection syntax:
```
$ dbt test --models source:<source_name>.<table_name>  # run tests on a single source table
$ dbt test --models source:<source_name>               # run tests on a source
$ dbt test --models 'source:*'                         # run all tests for all sources
```
On some systems, the slash, or escape character may be necessary. Some command prompts parse the * not as a character but as a [wildcard](https://tldp.org/LDP/GNU-Linux-Tools-Summary/html/x11655.htm). Sometimes single quoting disables the wildcard feature. Sometimes, \* may be necessary.

See our [test selection examples](node-selection/test-selection-examples) for more operators and examples.
