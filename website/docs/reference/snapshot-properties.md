---
title: Snapshot properties
---

<Changelog>
    - **v0.21.0** introduced the `config` property, thereby allowing you to configure snapshots in all `.yml` files
</Changelog>

Snapshots properties can be declared in `.yml` files in:
- your `snapshots/` directory (as defined by the [`snapshot-paths` config](snapshot-paths))
- your `models/` directory (as defined by the [`model-paths` config](model-paths))

We recommend that you put them in the `snapshots/` directory. You can name these files `whatever_you_want.yml`, and nest them arbitrarily deeply in subfolders within the `snapshots/` or `models/` directory.

<File name='snapshots/<filename>.yml'>

```yml
version: 2

snapshots:
  - name: <snapshot name>
    [description](description): <markdown_string>
    [meta](meta): {<dictionary>}
    [docs](/reference/resource-configs/docs):
      show: true | false
    [config](resource-properties/config):
      [<snapshot_config>](snapshot-configs): <config_value>
    [tests](resource-properties/tests):
      - <test>
      - ...
    columns:
      - name: <column name>
        [description](description): <markdown_string>
        [meta](meta): {<dictionary>}
        [quote](quote): true | false
        [tags](resource-configs/tags): [<string>]
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
