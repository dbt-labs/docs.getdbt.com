---
title: Other Artifacts
---

### index.html

_Produced by:_ `dbt docs generate`

This file is the skeleton of the [auto-generated dbt documentation website](documentation). The contents of the site are populated by the [manifest](manifest-json) and [catalog](catalog-json).

Note: the source code for `index.json` comes from the [dbt-docs repo](https://github.com/dbt-labs/dbt-docs). Head over there if you want to make a bug report, suggestion, or contribution relating to the documentation site.

### partial_parse.msgpack

_Produced by: all commands_

This file is used to store a compressed representation of files dbt has parsed. If you have [partial parsing](parsing#partial-parsing) enabled, dbt will use this file to identify the files that have changed and avoid re-parsing the rest.

### graph.gpickle

_Produced by: all commands_

Stores the networkx representation of the dbt resource DAG.
