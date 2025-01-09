---
resource_types: all
datatype: markdown_string
description: "This guide explains how to use the description key to add YAML descriptions to dbt resources (models, sources, seeds) using markdown and Jinja for better documentation."
---

<Tabs
  defaultValue="models"
  values={[
    { label: 'Models', value: 'models', },
    { label: 'Sources', value: 'sources', },
    { label: 'Seeds', value: 'seeds', },
    { label: 'Snapshots', value: 'snapshots', },
    { label: 'Analyses', value: 'analyses', },
    { label: 'Macros', value: 'macros', },
    { label: 'Data tests', value: 'data_tests', },
    { label: 'Unit tests', value: 'unit_tests', },
  ]
}>
<TabItem value="models">

<File name='models/schema.yml'>

```yml
version: 2

models:
  - name: model_name
    description: markdown_string

    columns:
      - name: column_name
        description: markdown_string

```

</File>

</TabItem>

<TabItem value="sources">

<File name='models/schema.yml'>

```yml
version: 2

sources:
  - name: source_name
    description: markdown_string

    tables:
      - name: table_name
        description: markdown_string

        columns:
          - name: column_name
            description: markdown_string

```

</File>

</TabItem>

<TabItem value="seeds">

<File name='seeds/schema.yml'>

```yml
version: 2

seeds:
  - name: seed_name
    description: markdown_string

    columns:
      - name: column_name
        description: markdown_string

```

</File>

</TabItem>

<TabItem value="snapshots">

<File name='snapshots/schema.yml'>

```yml
version: 2

snapshots:
  - name: snapshot_name
    description: markdown_string

    columns:
      - name: column_name
        description: markdown_string

```

</File>

</TabItem>

<TabItem value="analyses">

<File name='analysis/schema.yml'>

```yml
version: 2

analyses:
  - name: analysis_name
    description: markdown_string

    columns:
      - name: column_name
        description: markdown_string

```

</File>

</TabItem>

<TabItem value="macros">

<File name='macros/schema.yml'>

```yml
version: 2

macros:
  - name: macro_name
    description: markdown_string

    arguments:
      - name: argument_name
        description: markdown_string

```

</File>

</TabItem>

<TabItem value="data_tests">

<VersionBlock firstVersion="1.9">

You can add a description to a [singular data test](/docs/build/data-tests#singular-data-tests) or a [generic data test](/docs/build/data-tests#generic-data-tests).

<File name='tests/schema.yml'>

```yml
# Singular data test example

version: 2

data_tests:
  - name: data_test_name
    description: markdown_string
```
</File>

<File name='tests/schema.yml'>

```yml
# Generic data test example

version: 2

models:
  - name: model_name
    columns:
      - name: column_name
        tests:
          - unique:
            description: markdown_string
```
</File>

</VersionBlock>

<VersionBlock lastVersion="1.8">

The `description` property is available for [singular data tests](/docs/build/data-tests#singular-data-tests) or [generic data tests](/docs/build/data-tests#generic-data-tests) beginning in dbt v1.9.

</VersionBlock> 

</TabItem>

<TabItem value="unit_tests">

<VersionBlock firstVersion="1.8">

<File name='models/schema.yml'>

```yml
unit_tests:
  - name: unit_test_name
    description: "markdown_string"
    model: model_name 
    given: ts
      - input: ref_or_source_call
        rows:
         - {column_name: column_value}
         - {column_name: column_value}
         - {column_name: column_value}
         - {column_name: column_value}
      - input: ref_or_source_call
        format: csv
        rows: dictionary | string
    expect: 
      format: dict | csv | sql
      fixture: fixture_name
```

</File>

</VersionBlock>

<VersionBlock lastVersion="1.7">

The `description` property is available for [unit tests](/docs/build/unit-tests) beginning in dbt v1.8.

</VersionBlock>

</TabItem>

</Tabs>

## Definition

A user-defined description used to document:

- a model, and model columns
- sources, source tables, and source columns
- seeds, and seed columns
- snapshots, and snapshot columns
- analyses, and analysis columns
- macros, and macro arguments
- data tests, and data test columns
- unit tests for models

These descriptions are used in the documentation website rendered by dbt (refer to [the documentation guide](/docs/build/documentation) or [dbt Explorer](/docs/collaborate/explore-projects)). 

Descriptions can include markdown, as well as the [`doc` jinja function](/reference/dbt-jinja-functions/doc).

:::caution You may need to quote your YAML

Be mindful of YAML semantics when providing a description. If your description contains special YAML characters like curly brackets, colons, or square brackets, you may need to quote your description. An example of a quoted description is shown [below](#use-some-markdown-in-a-description).

:::

## Examples

This section contains examples of how to add descriptions to various resources:

- [Add a simple description to a model and column](#add-a-simple-description-to-a-model-and-column) <br />
- [Add a multiline description to a model](#add-a-multiline-description-to-a-model) <br />
- [Use some markdown in a description](#use-some-markdown-in-a-description) <br />
- [Use a docs block in a description](#use-a-docs-block-in-a-description) <br />
- [Link to another model in a description](#link-to-another-model-in-a-description)
- [Include an image from your repo in your descriptions](#include-an-image-from-your-repo-in-your-descriptions) <br />
- [Include an image from the web in your descriptions](#include-an-image-from-the-web-in-your-descriptions) <br />
- [Add a description to a data test](#add-a-description-to-a-data-test) <br />
- [Add a description to a unit test](#add-a-description-to-a-unit-test) <br />

### Add a simple description to a model and column

<File name='models/schema.yml'>

```yml
version: 2

models:
  - name: dim_customers
    description: One record per customer

    columns:
      - name: customer_id
        description: Primary key

```

</File>

### Add a multiline description to a model

You can use YAML [block notation](https://yaml-multiline.info/) to split a longer description over multiple lines:

<File name='models/schema.yml'>

```yml
version: 2

models:
  - name: dim_customers
    description: >
      One record per customer. Note that a customer must have made a purchase to
      be included in this <Term id="table" /> — customer accounts that were created but never
      used have been filtered out.

    columns:
      - name: customer_id
        description: Primary key.

```

</File>

### Use some markdown in a description

You can use markdown in your descriptions, but you may need to quote your description to ensure the YAML parser doesn't get confused by special characters!

<File name='models/schema.yml'>

```yml
version: 2

models:
  - name: dim_customers
    description: "**\[Read more](https://www.google.com/)**"

    columns:
      - name: customer_id
        description: Primary key.

```

</File>

### Use a docs block in a description

If you have a long description, especially if it contains markdown, it may make more sense to leverage a [`docs` block](/reference/dbt-jinja-functions/doc). A benefit of this approach is that code editors will correctly highlight markdown, making it easier to debug as you write.

<File name='models/schema.yml'>

```yml
version: 2

models:
  - name: fct_orders
    description: This table has basic information about orders, as well as some derived facts based on payments

    columns:
      - name: status
        description: '{{ doc("orders_status") }}'

```

</File>

<File name='models/docs.md'>

```

{% docs orders_status %}

Orders can be one of the following statuses:

| status         | description                                                               |
|----------------|---------------------------------------------------------------------------|
| placed         | The order has been placed but has not yet left the warehouse              |
| shipped        | The order has been shipped to the customer and is currently in transit     |
| completed      | The order has been received by the customer                               |
| returned       | The order has been returned by the customer and received at the warehouse |


{% enddocs %}

```

</File>


### Link to another model in a description

You can use relative links to link to another model. It's a little hacky — but to do this:

1. Serve your docs site.
2. Navigate to the model you want to link to, e.g. `http://127.0.0.1:8080/#!/model/model.jaffle_shop.stg_stripe__payments`
3. Copy the url_path, i.e. everything after `http://127.0.0.1:8080/`, so in this case `#!/model/model.jaffle_shop.stg_stripe__payments`
4. Paste it as the link

<File name='models/schema.yml'>

```yml
version: 2

models:
  - name: customers
    description: "Filtering done based on \[stg_stripe__payments](#!/model/model.jaffle_shop.stg_stripe__payments)"

    columns:
      - name: customer_id
        description: Primary key

```

</File>


### Include an image from your repo in your descriptions

This section applies to dbt Core users only. Including an image from your repository ensures your images are version-controlled. 

Both dbt Cloud and dbt Core users can [include an image from the web](#include-an-image-from-the-web-in-your-descriptions), which offers dynamic content, reduced repository size, accessibility, and ease of collaboration.

To include an image in your model's `description` field:

1. Add the file in a subdirectory, e.g. `assets/dbt-logo.svg`
2. Set the [`asset-paths` config](/reference/project-configs/asset-paths) in your `dbt_project.yml` file so that this directory gets copied to the `target/` directory as part of `dbt docs generate`

<File name='dbt_project.yml'>

```yml
asset-paths: ["assets"]
```

</File>

2. Use a Markdown link to the image in your `description:`

<File name='models/schema.yml'>

```yml
version: 2

models:
  - name: customers
    description: "!\[dbt Logo](assets/dbt-logo.svg)"

    columns:
      - name: customer_id
        description: Primary key

```

</File>

3. Run `dbt docs generate` — the `assets` directory will be copied to the `target` directory

4. Run `dbt docs serve` — the image will be rendered as part of your project documentation:

If mixing images and text, also consider using a docs block.

### Include an image from the web in your descriptions

This section applies to dbt Cloud and dbt Core users. Including an image from the web offers dynamic content, reduced repository size, accessibility, and ease of collaboration.

To include images from the web, specify the image URL in your model's `description` field:

<File name='models/schema.yml'>

```yml
version: 2

models:
  - name: customers
    description: "!\[dbt Logo](https://github.com/dbt-labs/dbt-core/blob/main/etc/dbt-core.svg)"

    columns:
      - name: customer_id
        description: Primary key

```

</File>

If mixing images and text, also consider using a docs block.

### Add a description to a data test

<VersionBlock lastVersion="1.8">

<VersionCallout version="1.9" />

</VersionBlock>

You can add a `description` property to a generic or singular data test.

#### Generic data test

This example shows a generic data test that checks for unique values in a column for the `orders` model.

<File name='models/<filename>.yml'>

```yaml
version: 2

models:
  - name: orders
    columns:
      - name: order_id
        tests:
            - unique:
              description: "The order_id is unique for every row in the orders model"
```
</File>

#### Singular data test

This example shows a singular data test that checks to ensure all values in the `payments` model are not negative (≥ 0).

<File name='tests/<filename>.yml'>

```yaml
version: 2
data_tests:
  - name: assert_total_payment_amount_is_positive
    description: >
      Refunds have a negative amount, so the total amount should always be >= 0.
      Therefore return records where total amount < 0 to make the test fail.

```
</File>

Note that in order for the test to run, the `tests/assert_total_payment_amount_is_positive.sql` SQL file has to exist in the `tests` directory.

### Add a description to a unit test

<VersionBlock lastVersion="1.7">

<VersionCallout version="1.8" />

</VersionBlock>

This example shows a unit test that checks to ensure the `opened_at` timestamp is properly truncated to a date for the `stg_locations` model.

<File name='models/<filename>.yml'>

```yaml
unit_tests:
  - name: test_does_location_opened_at_trunc_to_date
    description: "Check that opened_at timestamp is properly truncated to a date."
    model: stg_locations
    given:
      - input: source('ecom', 'raw_stores')
        rows:
          - {id: 1, name: "Rego Park", tax_rate: 0.2, opened_at: "2016-09-01T00:00:00"}
          - {id: 2, name: "Jamaica", tax_rate: 0.1, opened_at: "2079-10-27T23:59:59.9999"}
    expect:
      rows:
        - {location_id: 1, location_name: "Rego Park", tax_rate: 0.2, opened_date: "2016-09-01"}
        - {location_id: 2, location_name: "Jamaica", tax_rate: 0.1, opened_date: "2079-10-27"}
```

</File>
