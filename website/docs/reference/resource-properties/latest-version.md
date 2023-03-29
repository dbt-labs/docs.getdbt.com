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
```

</File>

## Definition
The latest version of the model you are declaring properties for.

## Default

If `latest_version` is not specified for an unversioned model (no `versions` property), `latest_version` defaults to `null`. 

If `latest_version` is not specified for a versioned model, `latest_version` defaults to the largest version identifier.
