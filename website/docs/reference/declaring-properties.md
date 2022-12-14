---
title: Declaring resource properties
---

## Overview
While configurations tell dbt _how_ to build something in your warehouse (for example, whether a model should be a table or view, or which SQL to use when running a snapshot), resource properties are used to declare things _about_ your dbt project or data warehouse.

For example, you can use resource properties to:
* Describe models, snapshots, seed files, and their columns
* Assert "truths" about a model, in the form of [tests](building-a-dbt-project/tests), e.g. "this `id` column is unique"
* Apply tags to resources
* Define existing tables contains raw data as [sources](using-sources)
* Assert the expected "freshness" of this raw data

In dbt, these properties are declared in `.yml` files, in the same directory as your resources. There's a few quirks for backwards compatibility reasons:

| Resource  | Default directories       | Defined by                   |
|-----------|---------------------------|------------------------------|
| models    | `models/`                 | [source-paths](source-paths) |
| sources   | `models/`                 | [source-paths](source-paths) |
| seeds     | `data/` or `models/`      | [data-paths](data-paths) or [source-paths](source-paths) |
| snapshots | `snapshots/` or `models/` | [snapshot-paths](snapshot-paths) or [source-paths](source-paths) |
| analyses  | `analyses/` or `models/`  | [analysis-paths](analysis-paths) or [source-paths](source-paths) |
| macros    | `macros/` or `models/`    | [macro-paths](macro-paths) or [source-paths](source-paths) |

You can name these files `whatever_you_want.yml` and nest them arbitrarily deeply in subfolders within each directory.

:::info

#### schema.yml files

Previous versions of the docs referred to these as `schema.yml` files — we've moved away from that terminology since the word `schema` is used to mean other things when talking about databases, and people often thought that you _had_ to name these files `schema.yml`.

(Of course, you're still free to name your files `schema.yml`)

:::

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

You can also use Jinja to conditionally configure the schema associated with sources. Anything that can be computed in Jinja can be used to determine what schema to look for a table in at runtime.

<File name='models/jaffle_shop_with_dynamic_schema.yml'>

```yml
version: 2

sources:
  - name: raw_jaffle_shop
    schema: {{ 'core_production' if target.name == 'prod' else 'core_staging' }}
    description: A replica of the postgres database used to power the jaffle_shop app.
    tables:
        <...>

```

</File>

The value of the `schema` parameter will be resolved by the Jinja compiler prior to dbt reading the `.yml` file itself. For information on the `target` environment variable, check out [this document](/reference/dbt-jinja-functions/target).

## Related documentation
You can find an exhaustive list of each property for a resource in the following docs:
* [Model Properties](model-properties)
* [Source Properties](source-properties)
* [Seed Properties](seed-properties)
* [Snapshot Properties](snapshot-properties)
* [Analysis Properties](analysis-properties)
* [Macro Properties](macro-properties)

## FAQs
<FAQ src="schema-yml-name" />
<FAQ src="resource-yml-name" />
<FAQ src="multiple-resource-yml-files" />
<FAQ src="properties-not-in-config" />
<FAQ src="why-version-2" />
<FAQ src="yaml-file-extension" />

## Troubleshooting common errors

### Invalid test config given in [model name]

This error occurs when your `.yml` file does not conform to the structure expected by dbt. A full error message might look like:
```
* Invalid test config given in models/schema.yml near {'namee': 'event', ...}
  Invalid arguments passed to "UnparsedNodeUpdate" instance: 'name' is a required property, Additional properties are not allowed ('namee' was unexpected)
```

While verbose, an error like this should help you track down the issue. Here, the `name` field was provided as `namee` by accident. To fix this error, ensure that your `.yml` conforms to the expected structure described in this guide.

### Invalid syntax in your schema.yml file

If your `.yml` file is not valid yaml, then dbt will show you an error like this:

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

This error occurred because a semicolon (`;`) was accidentally used instead of a colon (`:`) after the `description` field. To resolve issues like this, find the `.yml` file referenced in the error message and fix any syntax errors present in the file. There are online yaml validators that can be helpful here, but please be mindful of submitting sensitive information to third-party applications!
