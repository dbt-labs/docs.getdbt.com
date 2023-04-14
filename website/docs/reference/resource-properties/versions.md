---
resource_types: [models]
datatype: list
required: no
---


<File name='models/<schema>.yml'>

```yml
version: 2

models:
  - name: model_name
    versions:
      - v: <version_identifier> # required
        defined_in: <file_name> # optional -- default is <model_name>_v<v>
        columns:
          # include/exclude columns from the top-level model properties
          - [include](resource-properties/include-exclude): <include_value>
            [exclude](resource-properties/include-exclude): <exclude_list>
          # specify additional columns
          - name: <column_name> # required
      - v: ...
    
    # optional
    [latest_version](resource-properties/latest-version): <version_identifier> 
```

</File>

The standard convention for naming model versions is `<model_name>_v<v>`. This holds for the file where dbt expects to find the model's definition (SQL or Python), and the alias it will use by default when materializing the model in the database.

### `v`

The version identifier for a version of a model. This value can be numeric (integer or float), or any string.

The value of the version identifier is used to order versions of a model relative to one another. If a versioned model does _not_ explicitly configure a [`latest_version`](resource-properties/latest-version), the highest version number is used as the latest version to resolve `ref` calls to the model without a `version` argument.

In general, we recommend that you use a simple "major versioning" scheme for your models: `v1`, `v2`, `v3`, etc, where each version represents a breaking change from previous versions. However, you are welcome to use other versioning schemes.

### `defined_in`

The name of the model file (excluding the file extension, e.g. `.sql` or `.py`) where the model version is defined.

If `defined_in` is not specified, dbt searches for the definition of a versioned model in a model file named `<model_name>_v<v>`. Model file names must be globally unique, even when they are defining versioned implementations of a model with a different name.

### Alias

The default `alias` for a versioned model is `<model_name>_v<v>`.

This default can be overwritten in two ways:
- Configuring a custom `alias` within the version yaml
- Overwriting dbt's `generate_alias_name` macro, to use different behavior when `node.version`

See ["Custom aliases"](https://docs.getdbt.com/docs/build/custom-aliases) for more details.

Setting a different value of `defined_in` does **not** automatically change the `alias` of the model to match. The two are determined independently. 
