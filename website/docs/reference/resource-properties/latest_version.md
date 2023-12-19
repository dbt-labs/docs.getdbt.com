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
    [versions](/reference/resource-properties/versions):
      - v: 2
      - v: 1
```

</File>

## Definition

The latest version of this model. The "latest" version is relevant for:
1. Resolving `ref()` calls to this model that are "unpinned" (a version is not explicitly specified)
2. Selecting model versions using the [`version:` selection method](/reference/node-selection/methods#the-version-method), based on whether a given model version is `latest`, `prerelease`, or `old`

This value can be a string or a numeric (integer or float) value. It must be one of the [version identifiers](/reference/resource-properties/versions#v) specified in this model's list of `versions`.

To run the latest version of a model, you can use the [`--select` flag](/reference/node-selection/syntax). Refer to [Model versions](/docs/collaborate/govern/model-versions#run-a-model-with-multiple-versions) for more information and syntax.

## Default

If not specified for a versioned model, `latest_version` defaults to the largest [version identifier](/reference/resource-properties/versions#v): numerically greatest (if all version identifiers are numeric), otherwise the alphabetically last (if they are strings).

For a non-versioned model (no `versions` list), `latest_version` has no value.

If `latest_version` is not specified for a versioned model, `latest_version` defaults to the largest.


## Example

<File name='models/<schema>.yml'>

```yml
models:
  - name: model_name
    [versions](/reference/resource-properties/versions):
      - v: 3
      - v: 2
      - v: 1
```

</File>

If `latest_version` is not specified, the `latest_version` is `3`. Any unpinned references -- `ref('model_name')` -- will resolve to `model_name.v3`. Both `v1` and `v2` are considered "old" versions.

<File name='models/<schema>.yml'>

```yml
models:
  - name: model_name
    latest_version: 2
    [versions](/reference/resource-properties/versions):
      - v: 3
      - v: 2
      - v: 1
```

</File>

In this case, the `latest_version` is explicitly set to `2`. Any unpinned references will resolve to `model_name.v2`. `v3` is considered "prerelease", and `v1` is considered "old".
