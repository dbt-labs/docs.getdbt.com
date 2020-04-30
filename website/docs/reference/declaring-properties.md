---
title: Declaring resource properties
---

## Overview
While configurations tell dbt _how_ to build something in your warehouse (for example, whether a model should be a table or view, or which SQL to use when running a snapshot), resource properties are used to declare things _about_ your dbt project, or data warehouse.

For example, you can use resource properties to:
* Describe models, snapshots, seed files, and their columns
* Assert "truths" about a model, in the form of [tests](testing), e.g. "this `id` column is unique"
* Apply tags to resources
* Define existing tables contains raw data as [sources](using-sources)
* Assert the expected "freshness" of this raw data

In dbt, these properties are declared in `.yml` files, in the same path as your resources. There's a few quirks for backwards compatibility reasons:

| Resource  | Default directories       | Defined by                   |
|-----------|---------------------------|------------------------------|
| models    | `models/`                 | [source-paths](source-paths) |
| sources   | `models/`                 | [source-paths](source-paths) |
| seeds     | `data/` or `models/`      | [data-paths](data-paths) or [source-paths](source-paths) |
| snapshots | `snapshots/` or `models/` | [snapshot-paths](snapshot-paths) or [source-paths](source-paths) |
| analyses  | `analyses/` or `models/`  | [analysis-paths](analysis-paths) or [source-paths](source-paths) |
| macros    | `macros/` or `models/`    | [macro-paths](macro-paths) or [source-paths](source-paths) |

You can name these files `whatever_you_want.yml` and nest them arbitrarily deeply in subfolders within each directory.

<Alert type='info'>
    <h4>YAML syntax</h4>
    dbt uses YAML in a few different places. If you're new to YAML, it would be worth taking the time to learn how arrays, dictionaries and strings are represented in YAML.
</Alert>

## Example
Here's an example that defines both `sources` and `models` for a project:

<File name='models/jaffle_shop.yml'>

```yml
version: 2

sources:
  - name: raw_jaffle_shop
    description: A replica of the postgres database used to power the jaffle_shop app.
    tables:
      - name: customers
        columns:
          - name: id
            description: Primary key of the table
            tests:
              - unique
              - not_null

      - name: orders
        columns:
          - name: id
            description: Primary key of the table
            tests:
              - unique
              - not_null

          - name: user_id
            description: Foreign key to customers

          - name: status
            tests:
              - accepted_values:
                  values: ['placed', 'shipped', 'completed', 'return_pending', 'returned']


models:
  - name: stg_jaffle_shop__customers
    columns:
      - name: customer_id
        tests:
          - unique
          - not_null

  - name: stg_jaffle_shop__orders
    columns:
      - name: order_id
        tests:
          - unique
          - not_null
      - name: status
        tests:
          - accepted_values:
              values: ['placed', 'shipped', 'completed', 'return_pending', 'returned']


```

</File>


## Related documentation
You can find an exhaustive list of each property for a resource in the following docs:
* [Model Properties](model-properties)
* [Source Properties](source-properties)
* [Seed Properties](seed-properties)
* [Snapshot Properties](snapshot-properties)
* [Analysis Properties](analysis-properties)
* [Macro Properties](macro-properties)

## FAQs:
- Do I need to name these files `schema.yml`?
- Why do are properties defined separately to configurations?
- Why version 2?
- Can I use the `.yaml` file extension?
- Should I use one file per model, or one file per directory? Should I co-locate my resource properties (i.e. sources and models together)


## Usage

### Versioning schema.yml

schema.yml files must specify a version. The only currently supported version for schema.yml files is `version: 2`. This version identifier makes it possible for new dbt functionality to be incorporated into the schema.yml syntax in future releases.

## Troubleshooting Common Errors

### Invalid test config given in [model name]

This error occurs when your schema.yml does not conform to the structure expected by dbt. A full error message might look like:
```
* Invalid test config given in models/schema.yml near {'namee': 'event', ...}
  Invalid arguments passed to "UnparsedNodeUpdate" instance: 'name' is a required property, Additional properties are not allowed ('namee' was unexpected)
```

While verbose, an error like this should help you track down the issue. Here, the `name` field was provided as `namee` by accident. To fix this error, ensure that your schema.yml conforms to the expected structure described in this guide.

### Invalid syntax in your schema.yml file

If your schema.yml file is not valid yaml, then dbt will show you an error like this:

```
Runtime Error
  Syntax error near line 6
  ------------------------------
  5  |   - name: events
  6  |     description; "A table containing clickstream events from the marketing website"
  7  |

  Raw Error:
  ------------------------------
  while scanning a simple key
    in "<unicode string>", line 6, column 5:
          description; "A table containing clickstream events from the marketing website"
          ^

```

This error occurred because a semicolon (`;`) was accidentally used instead of a colon (`:`) after the `description` field. To resolve issues like this, find the schema.yml file referenced in the error message and fix any syntax errors present in the file. There are online yaml validators that can be helpful here, but please be mindful of submitting sensitive information to third-party applications!
