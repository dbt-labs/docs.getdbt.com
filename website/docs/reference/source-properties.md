---
title: "Source properties"
description: "Learn how to use source properties in dbt."
---

## Related documentation
- [Using sources](/docs/build/sources)
- [Declaring resource properties](/reference/configs-and-properties)

## Overview

import PropsCallout from '/snippets/_config-prop-callout.md';

Source properties can be declared in any `properties.yml` file in your `models/` directory (as defined by the [`model-paths` config](/reference/project-configs/model-paths)). <PropsCallout title={frontMatter.title}/>  <br /> 


You can name these files `whatever_you_want.yml`, and nest them arbitrarily deeply in subfolders within the `models/` directory:

<File name='models/<filename>.yml'>

```yml
version: 2

sources:
  - name: <string> # required
    [description](/reference/resource-properties/description): <markdown_string>
    [database](/reference/resource-properties/database): <database_name>
    [schema](/reference/resource-properties/schema): <schema_name>
    [loader](/reference/resource-properties/loader): <string>

    # requires v1.1+
    [config](/reference/resource-properties/config):
      [<source_config>](source-configs): <config_value>
      [freshness](/reference/resource-properties/freshness):
        # changed to config in v1.10
        [loaded_at_field](/reference/resource-properties/freshness#loaded_at_field): <column_name>
        warn_after:
          [count](/reference/resource-properties/freshness#count): <positive_integer>
          [period](/reference/resource-properties/freshness#period): minute | hour | day
        error_after:
          [count](/reference/resource-properties/freshness#count): <positive_integer>
          [period](/reference/resource-properties/freshness#period): minute | hour | day
        [filter](/reference/resource-properties/freshness#filter): <where-condition>
      [meta](/reference/resource-configs/meta): {<dictionary>} # changed to config in v1.10
      [tags](/reference/resource-configs/tags): [<string>] # changed to config in v1.10

    # deprecated in v1.10
    [overrides](/reference/resource-properties/overrides): <string>

    [quoting](/reference/resource-properties/quoting):
      database: true | false
      schema: true | false
      identifier: true | false

    tables:
      - name: <string> #required
        [description](/reference/resource-properties/description): <markdown_string>
        [identifier](/reference/resource-properties/identifier): <table_name>
        [data_tests](/reference/resource-properties/data-tests):
          - <test>
          - ... # declare additional tests
        [config](/reference/resource-properties/config):
          [loaded_at_field](/reference/resource-properties/freshness#loaded_at_field): <column_name>
          [meta](/reference/resource-configs/meta): {<dictionary>}
          [tags](/reference/resource-configs/tags): [<string>]
          [freshness](/reference/resource-properties/freshness):
            warn_after:
              [count](/reference/resource-properties/freshness#count): <positive_integer>
              [period](/reference/resource-properties/freshness#period): minute | hour | day
            error_after:
              [count](/reference/resource-properties/freshness#count): <positive_integer>
              [period](/reference/resource-properties/freshness#period): minute | hour | day
            [filter](/reference/resource-properties/freshness#filter): <where-condition>

        [quoting](/reference/resource-properties/quoting):
          database: true | false
          schema: true | false
          identifier: true | false
        [external](/reference/resource-properties/external): {<dictionary>}
        columns:
          - name: <column_name> # required
            [description](/reference/resource-properties/description): <markdown_string>
            [quote](/reference/resource-properties/columns#quote): true | false
            [data_tests](/reference/resource-properties/data-tests):
              - <test>
              - ... # declare additional tests
            [config](/reference/resource-properties/config):
              [meta](/reference/resource-configs/meta): {<dictionary>}
              [tags](/reference/resource-configs/tags): [<string>]
          - name: ... # declare properties of additional columns

      - name: ... # declare properties of additional source tables

  - name: ... # declare properties of additional sources

```

</File>


## Example

<File name='models/<filename>.yml'>

```yaml
version: 2

sources:
  - name: jaffle_shop
    database: raw
    schema: public
    loader: emr # informational only (free text)

    config:
      # changed to config in v1.10
      loaded_at_field: _loaded_at # configure for all sources
      # meta fields are rendered in auto-generated documentation
      meta: # changed to config in v1.10
        contains_pii: true
        owner: "@alice"

      # Add tags to this source
      tags: # changed to config in v1.10
        - ecom
        - pii

    quoting:
      database: false
      schema: false
      identifier: false

    tables:
      - name: orders
        identifier: Orders_
        config:
          # changed to config in v1.10
          loaded_at_field: updated_at # override source defaults
        columns:
          - name: id
            data_tests:
              - unique

          - name: price_in_usd
            data_tests:
              - not_null

      - name: customers
        quoting:
          identifier: true # override source defaults
        columns:
            data_tests:
              - unique
```

</File>
