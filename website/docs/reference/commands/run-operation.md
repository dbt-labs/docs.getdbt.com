---
title: "run-operation"
id: "run-operation"
---

### Overview

The `dbt run-operation` command is used to invoke a macro. For usage information, consult the docs on [operations](hooks-operations#operations).

### Usage
```
$ dbt run-operation {macro} --args {args}
  {macro}        Specify the macro to invoke. dbt will call this macro
                        with the supplied arguments and then exit
  --args ARGS           Supply arguments to the macro. This dictionary will be
                        mapped to the keyword arguments defined in the
                        selected macro. This argument should be a YAML string,
                        eg. '{my_variable: my_value}'
```
