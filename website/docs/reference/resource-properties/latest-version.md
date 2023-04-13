---
resource_types: [models]
datatype: latest_version
required: no
---

<File name='models/<schema>.yml'>

```yml

models:
  - name: model_name
    latest_version: 2
    versions:
      - v: 2
      - v: 1
```

</File>

## Definition
The latest version of the model you are declaring properties for. This value can be either a string or numeric (integer or float) value, and must be one of the [version identifier](resource-properties/v) values in the versions list of the model.

## Default
If `latest_version` is not specified for an unversioned model (no `versions` list), `latest_version` defaults to `null`.

If `latest_version` is not specified for a versioned model, `latest_version` defaults to the largest [version identifier](resource-properties/v).
