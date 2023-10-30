---
title: "Upgrading to 0.11.0"
id: "upgrading-to-0-11-0"
---

import UpgradeMove from '/snippets/_upgrade-move.md';

<UpgradeMove />

## Schema.yml v2 syntax
dbt v0.11.0 adds an auto-generated docs site to your dbt project. To make effective use of the documentation site, you'll need to use the new "version 2" schema.yml syntax. For a full explanation of the version 2 syntax, check out the [schema.yml Files](/reference/configs-and-properties) section of the documentation.

### Translating schema.yml files to the v2 syntax

1. You can find a script that will translate a v1 schema.yml file to the v2 syntax [here](https://discourse.getdbt.com/t/migrating-to-schema-yml-v2/111).
2. You can upgrade v1 schema.yml files to the v2 syntax manually.

If you're upgrading to the v2 syntax manually, there are some caveats to be aware of:

### 1. Some v1 schema tests do not have immediately obvious representations in the v2 spec

Given:
```
events:
  constraints:
    unique:
      - id
      - "concat(first_name, last_name)"
```

The v2 representation for this schema.yml is:

```
models:
  - name: events
    tests:
      - unique: "concat(first_name, last_name)"

    columns:
      - name: id
        tests:
          - unique
```

Note that the expression provided as a uniqueness test does _not_ pertain to a single column, so it should be created as a model-level test.


### 2. Argument inference for custom schema tests

If you're using a custom schema test in a v1 schema.yml file, it might not be obvious how to translate the test to the v2 syntax. In general, you can always make the test into a model-level test as shown below.

Given:
```
events:
  constraints:
    dbt_utils.recency:
            - {field: created_at, datepart: day, interval: 1}
```

The v2 representation for this schema.yml could be:

```
models:
  - name: events
    tests:
      - dbt_utils.recency:
          field: created_at
          datepart: day
          interval: 1
```

## Default Snowflake Quoting

The default quoting config on Snowflake has changed from being _on_ to being _off_ by default. If you haven't already, you should add a [quoting config](reference/project-configs/quoting.md) to your `dbt_project.yml` file. To use the exact same quoting behavior present in 0.10.2, add this config to your `dbt_project.yml` file:

<File name='dbt_project.yml'>

```yaml
quoting:
  schema: true
  identifier: true

```

</File>
