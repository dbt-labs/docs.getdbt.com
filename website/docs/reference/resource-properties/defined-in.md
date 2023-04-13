---
resource_types: [models]
datatype: string
title: defined_in
required: no
---


<File name='models/<schema>.yml'>

```yml
version: 2

models:
  - name: model_name
    versions: 
      - v: <version_identifier> # required
        defined_in: <definition_file_name>
```

</File>

## Definition
The name of the model file (excluding the file extension, e.g. .sql or .py) where the model version is defined. Regardless of the value of `defined_in`, the versioned model will have the alias `<model_name>_v<v>`. The default alias of a versioned model can be overwritten by setting the [`alias`](resource-configs/alias) config within the version definition.

## Default
By default, `defined_in` is `null`. When `defined_in` is `null`, dbt searches for the definition of a versioned model in a model file named `<model_name>_v<v>`.
