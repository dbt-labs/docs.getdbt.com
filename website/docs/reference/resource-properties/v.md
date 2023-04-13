---
resource_types: [models]
datatype: v
required: no
---


<File name='models/<schema>.yml'>

```yml
version: 2

models:
  - name: model_name
    versions: 
      - v: <version_identifier> # required
```

</File>

## Definition
The version identifier for a version of a model. This value can be either a string or numeric (integer or float) value.

The value of the version identifier is used to order versions of a model relative to one another. If a versioned model does _not_ explicitly configure a [`latest_version`](resource-properties/latest-version), the highest version number is used as the latest version to resolve `ref` calls to the model without a `version` argument. 