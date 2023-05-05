---
title: "About dbt run-operation command"
sidebar_label: "run-operation"
description: "Read this guide on how dbt's run-operation command can be used to invoke a macro."
id: "run-operation"
---

### Overview

The `dbt run-operation` command is used to invoke a macro. For usage information, consult the docs on [operations](/docs/build/hooks-operations#operations).

### Usage
```
$ dbt run-operation {macro} --args '{args}'
  {macro}        Specify the macro to invoke. dbt will call this macro
                        with the supplied arguments and then exit
  --args ARGS           Supply arguments to the macro. This dictionary will be
                        mapped to the keyword arguments defined in the
                        selected macro. This argument should be a YAML string,
                        eg. '{my_variable: my_value}'
```
### Command line examples

Example 1:

`$ dbt run-operation grant_select --args '{role: reporter}'`

Example 2:

`$ dbt run-operation clean_stale_models --args '{days: 7, dry_run: True}'`
