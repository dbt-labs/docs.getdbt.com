
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
  - name: stg_jaffle_shop__customers #  Must match the filename of a model -- including case sensitivity.
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

## Related documentation
You can find an exhaustive list of each supported property and config, broken down by resource type:
* Model [properties](/reference/model-properties) and [configs](/reference/model-configs)
* Source [properties](/reference/source-properties) and [configs](source-configs)
* Seed [properties](/reference/seed-properties) and [configs](/reference/seed-configs)
* Snapshot [properties](snapshot-properties)
* Analysis [properties](analysis-properties)
* Macro [properties](/reference/macro-properties)
* Exposure [properties](/reference/exposure-properties)

## FAQs
<FAQ path="Project/schema-yml-name" />
<FAQ path="Project/resource-yml-name" />
<FAQ path="Project/multiple-resource-yml-files" />
<FAQ path="Project/properties-not-in-config" />
<FAQ path="Project/why-version-2" />
<FAQ path="Project/yaml-file-extension" />


## Troubleshooting common errors

<Expandable alt_header="Invalid test config given in [model name]">

This error occurs when your `.yml` file does not conform to the structure expected by dbt. A full error message might look like:
```
* Invalid test config given in models/schema.yml near {'namee': 'event', ...}
  Invalid arguments passed to "UnparsedNodeUpdate" instance: 'name' is a required property, Additional properties are not allowed ('namee' was unexpected)
```

While verbose, an error like this should help you track down the issue. Here, the `name` field was provided as `namee` by accident. To fix this error, ensure that your `.yml` conforms to the expected structure described in this guide.

</Expandable>

<Expandable alt_header="Invalid syntax in your schema.yml file" >

If your `.yml` file is not valid yaml, then dbt will show you an error like this:

```text
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

</Expandable>
