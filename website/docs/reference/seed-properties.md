---
title: Seed properties
---

<Changelog>
  
  **v1.0.0:** The default path for [`seed-paths`](/reference/project-configs/seed-paths) (formerly `data-paths`) is now `seeds`.
  
</Changelog>

Seed properties can be declared in `.yml` files under a `seed` key.

We recommend that you put them in the `seeds/` directory. You can name these files `whatever_you_want.yml`, and nest them arbitrarily deeply in subfolders within that directory.

<File name='seeds/<filename>.yml'>

```yml
version: 2

seeds:
  - name: <string>
    [description](/reference/resource-properties/description): <markdown_string>
    [docs](/reference/resource-configs/docs):
      show: true | false
    [config](resource-properties/config):
      [<seed_config>](/reference/seed-configs): <config_value>
    [tests](/reference/resource-properties/tests):
      - <test>
      - ... # declare additional tests
    columns:
      - name: <column name>
        [description](/reference/resource-properties/description): <markdown_string>
        [meta](/reference/resource-configs/meta): {<dictionary>}
        [quote](/reference/resource-properties/quote): true | false
        [tags](/reference/resource-configs/tags): [<string>]
        [tests](/reference/resource-properties/tests):
          - <test>
          - ... # declare additional tests

      - name: ... # declare properties of additional columns

  - name: ... # declare properties of additional seeds
```
</File>

<Changelog>

* `v0.16.0`: The ability to declare seed properties was introduced. Prior to this, you could declare seed properties under the `models:` key (confusing, right?). Support for declaring seed properties under a `models:` key will be removed in a future release.

</Changelog>
