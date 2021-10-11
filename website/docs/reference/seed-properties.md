---
title: Seed properties
---

<Changelog>
    - **v0.21.0** introduced the `config` property, thereby allowing you to configure seeds in all `.yml` files
</Changelog>

Seed properties can be declared in `.yml` files in:
- your `seeds/` directory (as defined by the [`seed-paths` config](seed-paths))
- your `models/` directory (as defined by the [`source-paths` config](source-paths)), for backwards compatibility

We recommend that you put them in the `seeds/` directory. You can name these files `whatever_you_want.yml`, and nest them arbitrarily deeply in subfolders within that directory.

<File name='seeds/<filename>.yml'>

```yml
version: 2

seeds:
  - name: <string>
    [description](description): <markdown_string>
    [docs](resource-properties/docs):
      show: true | false
    [config](resource-properties/config):
      [<seed_config>](seed-configs): <config_value>
    [tests](resource-properties/tests):
      - <test>
      - ... # declare additional tests
    columns:
      - name: <column name>
        [description](description): <markdown_string>
        [meta](meta): {<dictionary>}
        [quote](quote): true | false
        [tags](resource-configs/tags): [<string>]
        [tests](resource-properties/tests):
          - <test>
          - ... # declare additional tests

      - name: ... # declare properties of additional columns

  - name: ... # declare properties of additional seeds
```
</File>

<Changelog>

* `v0.16.0`: The ability to declare seed properties was introduced. Prior to this, you could declare seed properties under the `models:` key (confusing, right?). Support for declaring seed properties under a `models:` key will be removed in a future release.

</Changelog>
