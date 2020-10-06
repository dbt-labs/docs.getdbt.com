---
title: Snapshot properties
---

Snapshots properties can be declared in `.yml` files in:
- your `snapshots/` directory (as defined by the [`snapshot-paths` config](snapshot-paths))
- your `models/` directory (as defined by the [`source-paths` config](source-paths))

You can name these files `whatever_you_want.yml`, and nest them arbitrarily deeply in subfolders within the `snapshots/` or `models/` directory.

<File name='snapshots/<filename>.yml'>

```yml
version: 2

snapshots:
  - name: <snapshot name>
    [description](description): <markdown_string>
    [meta](meta): {<dictionary>}
    [docs](resource-properties/docs):
      show: true | false
    [tests](resource-properties/tests):
      - <test>
      - ...
    columns:
      - name: <column name>
        [description](description): <markdown_string>
        [meta](meta): {<dictionary>}
        [quote](quote): true | false
        [tags](resource-properties/tags): [<string>]
        [tests](resource-properties/tests):
          - <test>
          - ... # declare additional tests
      - ... # declare properties of additional columns

    - name: ... # declare properties of additional snapshots

```
</File>

<Changelog>

* `v0.16.0`: The ability to declare snapshot properties was introduced.

</Changelog>
