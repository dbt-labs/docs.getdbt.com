---
title: "schema.yml Files"
id: "schemayml-files"
---

## Overview
In dbt, models are defined in `.sql` files containing `SELECT` statements. dbt provides a mechanism, `schema.yml` files, to both test and document these models. This section of the documentation provides an overview of the syntax for these `schema.yml` files. For specific information about testing models, check out the [Testing](testing) guide. For more information about documenting your models, check out the [Documentation](documentation) guide. Read on for general information about schema.yml syntax and semantics.

## A word on naming
When dbt runs, it will search through the `source-paths` directories of your dbt project looking for any files that end with `.yml`. While this documentation site will always refer to these files as `schema.yml`, you are free to name these files however you'd like, as long as they end with `.yml`. You can have as many of these `schema.yml` files as you'd like, and they can be nested arbitrarily deeply into your models directories.

## Usage

### Versioning schema.yml

schema.yml files must specify a version. The only currently supported version for schema.yml files is `version: 2`. This version identifier makes it possible for new dbt functionality to be incorporated into the schema.yml syntax in future releases.

### Anatomy of schema.yml
schema.yml files are used to describe and test models and [sources](using-sources). An example `schema.yml` file is shown below. This example describes a model named `events`. It contains a description for the model, as well as descriptions and tests for three of the columns in the model.

<File name='models/snowplow/events/schema.yml'>

```yaml
version: 2

models:
  - name: events
    description: A table containing clickstream events from the marketing website

    columns:
        - name: event_id
          description: This is a unique identifier for the event
          tests:
              - unique
              - not_null

        - name: event_time
          description: "When the event occurred in UTC (eg. 2018-01-01 12:00:00)"
          tests:
              - not_null
              
        - name: user_id
          description: The ID of the user who recorded the event
          tests:
              - not_null
              - relationships:
                  to: ref('users')
                  field: id
```

</File>

### Fields
#### name
The `name` field can be used to specify both model names and column names in schema.yml files. When `name` is used to denote a model (as shown on line 4 above), dbt will look up that model by its filename. The example above will look for a model called `events.sql`, for instance.

#### descriptions
The `description` field can be used to describe both models, and the columns contained within a model. You can either supply a simple string here (as shown above), or you can reference long-form markdown using a `docs` block. More information on `docs` blocks can be found in the [Documenting Models](documentation) guide.

Be mindful of yaml semantics when providing a description. If your description contains special yaml characters like curly brackets, colons, or square brackets, you may need to quote your description. An example of a quoted description is shown in the description field for `event_time` above.

#### tests
The `tests` field is used to assert properties of a column or table. Defining tests is a great way to confirm that your code is working correctly, and also helps prevent regressions when your code changes.

In the example above, the `not_null`, `unique`, and `relationships` tests are specified for columns in the `events` model. Once these tests are defined, you can validate their correctness by running `dbt test`. More information on the options and syntax for these schema tests can be found in the [Testing](testing) guide.

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
