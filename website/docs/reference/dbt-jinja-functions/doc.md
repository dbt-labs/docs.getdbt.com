---
title: "About the doc function"
sidebar_label: "doc"
id: "doc"
description: "Use `doc()` in description fields to reference docs blocks."
---

You can specify documentation text in a docs block, then use the `doc()` Jinja function in description fields as a way to reuse the same text in multiple places. You can only use the `doc()` Jinja function in properties YAML files for resources with description properties, for example, models, model columns, sources, source tables, source columns, and so on.

The `doc()` Jinja function, which is analogous to `ref()`, looks up the named docs block (for example, `{% docs orders %} ... {% enddocs %}` in a `docs.md` file) and returns its rendered content. For more information, refer to the [Documentation guide](/docs/explore/build-and-view-your-docs).

## Usage

In dbt, column descriptions can be defined directly in a model’s properties YAML file. These descriptions are written as plain text and are associated with a specific column.

### Properties YAML file descriptions

This example shows how a column description is defined directly in a properties YAML file:

<File name="models/orders.yml">

```yaml
models:
  - name: orders
    columns:
      - name: order_total_cents
        description: "Total order amount in cents."
```

</File>
When you run `dbt docs generate` and view the docs site, this text appears exactly as written but only for the `order_total_cents` column of the `orders` model.


### Reusing documentation with doc()

To avoid repeating the same description across multiple models or columns, dbt lets you define documentation separately and reference it using the `doc()` function.

With this approach, documentation is written once in a markdown file using a named docs block, and then reused wherever needed in your project. This helps ensure consistency and makes it easier to maintain shared definitions over time.

First, define a reusable documentation block in a `docs.md`:

<File name="models/docs.md">

```
{% docs customer_id %}
A reusable customer identifier.
{% enddocs %}
```

</File>

This defines a docs block named `customer_id`. Reference it with `doc('customer_id')` in description fields wherever you need the same text.

Next, reference this documentation in your properties YAML file:

<File name="models/orders.yml">

```yaml
models:
  - name: orders
    columns:
      - name: order_total_cents
        description: "{{ doc('customer_id') }}"
```

</File>
When you run `dbt docs generate`, dbt resolves the `doc()` reference by looking up the corresponding docs block and injecting its content into the generated documentation.

As a result, the column description displays the text defined in the markdown file, rather than inline YAML.

### Duplicate docs block names

Docs block names must be unique within your project. If you define multiple `{% docs ... %}` blocks with the same name, dbt can’t reliably decide which block to render when you call `doc('DOCS_BLOCK_NAME')`.

<VersionBlock firstVersion="1.11" lastVersion="1.99">

In <Constant name="core" /> v1.11 and later, duplicate docs block names are not allowed. If duplicates are found, dbt reports the conflicting files and raises a compilation error. Rename one block so each docs block name is unique.

<File name="models/docs/example.md">

```
{% docs customer_id %}
A reusable customer identifier.
{% enddocs %}

{% docs customer_id %}
A different definition for customer id.
{% enddocs %}
```

</File>

```shell
dbt parse
13:23:41  Running with dbt=1.11.7
13:23:41  Registered adapter: duckdb=1.10.1
13:23:41  Encountered an error:
Compilation Error
  dbt found two docs with the name "customer_id".
  Since these resources have the same name, dbt will be unable to find the correct resource
  when looking for doc("customer_id").
  To fix this, change the name of one of these resources:
  - doc.doc_test.customer_id (models/docs/example.md)
  - doc.doc_test.customer_id (models/docs/example.md)
```

</VersionBlock>

<VersionBlock firstVersion="2.0">

In the <Constant name="fusion_engine" />, duplicate docs block names are not allowed. If duplicates are found, dbt reports the conflicting files. Rename one block so each docs block name is unique. For more information, refer to [Stricter evaluation of duplicate docs blocks](/docs/dbt-versions/core-upgrade/upgrading-to-fusion?version=2.0#stricter-evaluation-of-duplicate-docs-blocks).

For example, define a docs block with the same name in two different markdown files:

<File name="models/crm/_crm.md">

```
{% docs customer_id %}
A reusable customer identifier.
{% enddocs %}
```

</File>

<File name="models/docs/crm/business_class_marketing.md">

```
{% docs customer_id %}
A different definition for customer id.
{% enddocs %}
```

</File>

```text
dbt found two docs with the same name: 'customer_id' in files: 'models/crm/_crm.md' and 'models/docs/crm/business_class_marketing.md'
```

</VersionBlock>
