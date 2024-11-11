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

<File name='tests/schema.yml'>

```yml
version: 2

data_tests:
  - name: data_test_name
    description: markdown_string

```

</File>

</VersionBlock>

<VersionBlock lastVersion="1.8">

The `description` property is available for generic and singular data tests beginning in dbt v1.9.

</VersionBlock>

</TabItem>

</Tabs>

## Definition
A user-defined description. Can be used to document:
- a model, and model columns
- sources, source tables, and source columns
- seeds, and seed columns
- snapshots, and snapshot columns
- analyses, and analysis columns
- macros, and macro arguments

These descriptions are used in the documentation website rendered by dbt (refer to [the documentation guide](/docs/build/documentation) or [dbt Explorer](/docs/collaborate/explore-projects)). 

Descriptions can include markdown, as well as the [`doc` jinja function](/reference/dbt-jinja-functions/doc).

:::caution You may need to quote your YAML

Be mindful of YAML semantics when providing a description. If your description contains special YAML characters like curly brackets, colons, or square brackets, you may need to quote your description. An example of a quoted description is shown [below](#use-some-markdown-in-a-description).

:::

## Examples

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

