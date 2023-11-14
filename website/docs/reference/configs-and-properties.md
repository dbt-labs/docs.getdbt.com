---
title: About configs and properties
---

Resources in your project—models, snapshots, seeds, tests, and the rest—can have a number of declared **properties**. Resources can also define **configurations**, which are a special kind of property that bring extra abilities. What's the distinction?
- Properties are declared for resources one-by-one in `.yml` files. Configs can be defined there, nested under a `config` property. They can also be set one-by-one via a `config()` macro (right within `.sql` files), and for many resources at once in `dbt_project.yml`.
- Because configs can be set in multiple places, they are also applied hierarchically. An individual resource might _inherit_ or _override_ configs set elsewhere.
- You can select resources based on their config values using the `config:` selection method, but not the values of non-config properties

A rule of thumb: properties declare things _about_ your project resources; configs go the extra step of telling dbt _how_ to build those resources in your warehouse. This is generally true, but not always, so it's always good to check!

For example, you can use resource **properties** to:
* Describe models, snapshots, seed files, and their columns
* Assert "truths" about a model, in the form of [tests](/docs/build/tests), e.g. "this `id` column is unique"
* Define pointers to existing tables that contain raw data, in the form of [sources](/docs/build/sources), and assert the expected "freshness" of this raw data
* Define official downstream uses of your data models, in the form of [exposures](/docs/build/exposures)

Whereas you can use **configurations** to:
* Change how a model will be materialized (<Term id="table" />, <Term id="view" />, incremental, etc)
* Declare where a seed will be created in the database (`<database>.<schema>.<alias>`)
* Declare whether a resource should persist its descriptions as comments in the database
* Apply tags and "meta" properties

## Where can I define configs?

Depending on the resource type, configurations can be defined:

1. Using a [`config()` Jinja macro](/reference/dbt-jinja-functions/config) within a `model`, `snapshot`, or `test` SQL file
2. Using a [`config` property](/reference/resource-properties/config) in a `.yml` file
3. From the [`dbt_project.yml` file](dbt_project.yml), under the corresponding resource key (`models:`, `snapshots:`, `tests:`, etc)

### Config inheritance

dbt prioritizes configurations in order of specificity, from most specificity to least specificity. This generally follows the order above: an in-file `config()` block --> properties defined in a `.yml` file --> config defined in the project file. 

Note - Generic tests work a little differently when it comes to specificity. See [test configs](/reference/test-configs).

Within the project file, configurations are also applied hierarchically. The most specific config always "wins": In the project file, configurations applied to a `marketing` subdirectory will take precedence over configurations applied to the entire `jaffle_shop` project. To apply a configuration to a model, or directory of models, define the resource path as nested dictionary keys.

### Combining configs

Most configurations are "clobbered" when applied hierarchically. Whenever a more specific value is available, it will completely replace the less specific value. Note that a few configs have different merge behavior:
- [`tags`](tags) are additive. If a model has some tags configured in `dbt_project.yml`, and more tags applied in its `.sql` file, the final set of tags will include all of them.
- [`meta`](/reference/resource-configs/meta) dictionaries are merged (a more specific key-value pair replaces a less specific value with the same key)
- [`pre-hook` and `post-hook`](/reference/resource-configs/pre-hook-post-hook) are also additive.

## Where can I define properties?

In dbt, properties are declared in `.yml` files, in the same directory as your resources.

You can name these files `whatever_you_want.yml` and nest them arbitrarily deeply in subfolders within each directory.

We highly recommend that you define properties in dedicated paths alongside the resources they're describing.

:::info

#### schema.yml files

Previous versions of the docs referred to these as `schema.yml` files — we've moved away from that terminology since the word `schema` is used to mean other things when talking about databases, and people often thought that you _had_ to name these files `schema.yml`.

(Of course, you're still free to name your files `schema.yml`)

:::

### Which properties are _not_ also configs?

dbt has the ability to define node configs in `.yml` files, in addition to `config()` blocks and `dbt_project.yml`. But the reverse isn't always true: there are some things in `.yml` files that can _only_ be defined there.

Certain properties are special, because:

- They have a unique Jinja rendering context
- They create new project resources
- They don't make sense as hierarchical configuration
- They're older properties that haven't yet been redefined as configs

These properties are:

- [`description`](/reference/resource-properties/description)
- [`tests`](/reference/resource-properties/tests)
- [`docs`](/reference/resource-configs/docs)
- [`columns`](/reference/resource-properties/columns)
- [`quote`](/reference/resource-properties/quote)
- [`source` properties](/reference/source-properties) (e.g. `loaded_at_field`, `freshness`)
- [`exposure` properties](/reference/exposure-properties) (e.g. `type`, `maturity`)
- [`macro` properties](/reference/macro-properties) (e.g. `arguments`)

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
    config:
      tags: ['pii']
    columns:
      - name: customer_id
        tests:
          - unique
          - not_null

  - name: stg_jaffle_shop__orders
    config:
      materialized: view
    columns:
      - name: order_id
        tests:
          - unique
          - not_null
      - name: status
        tests:
          - accepted_values:
              values: ['placed', 'shipped', 'completed', 'return_pending', 'returned']
              config:
                severity: warn


```

</File>



<!--
## Related documentation
You can find an exhaustive list of each supported property and config, broken down by resource type:
* Model [properties](/reference/model-properties) and [configs](/reference/model-configs)
* Source [properties](/reference/source-properties) and [configs](source-configs)
* Seed [properties](/reference/seed-properties) and [configs](/reference/seed-configs)
* [Snapshot Properties](snapshot-properties)
* Analysis [properties](analysis-properties)
* [Macro Properties](/reference/macro-properties)
* Exposure [properties](/reference/exposure-properties)
-->

## FAQs
<FAQ path="Project/schema-yml-name" />
<FAQ path="Project/resource-yml-name" />
<FAQ path="Project/multiple-resource-yml-files" />
<FAQ path="Project/properties-not-in-config" />
<FAQ path="Project/why-version-2" />
<FAQ path="Project/yaml-file-extension" />

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

This error occurred because a semicolon (`;`) was accidentally used instead of a colon (`:`) after the `description` field. To resolve issues like this, find the `.yml` file referenced in the error message and fix any syntax errors present in the file. There are online YAML validators that can be helpful here, but please be mindful of submitting sensitive information to third-party applications!

