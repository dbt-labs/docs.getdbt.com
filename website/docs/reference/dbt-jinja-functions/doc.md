---
title: "About the doc function"
sidebar_label: "doc"
id: "doc"
description: "Use `doc()` in description fields to reference docs blocks."
---
 
You can specify documentation text in a docs block, then use the `doc()` Jinja function in description fields as a way to reuse the same text in multiple places. You can only use the `doc()` Jinja function in properties YAML files for resources with description properties. For example, models, model columns, sources, source tables, source columns, and so on.
 
The `doc()` Jinja function, which is analogous to `ref()`, looks up the named docs block (for example, `{% docs orders %} ... {% enddocs %}` in a `docs.md` file) and returns its rendered content. For more information, refer to the [Documentation guide](/docs/explore/build-and-view-your-docs).
 
## Usage
 
In dbt, column descriptions can be defined directly in a model's properties YAML file. These descriptions are written as plain text and are associated with a specific column.
 
### Manually adding descriptions
 
<File name="models/orders.yml">
 
```yaml
models:
  - name: orders
    columns:
      - name: order_total_cents
        description: "Total order amount in cents. This value is always a positive integer and excludes taxes and shipping."
```
 
</File>
 
When you run `dbt docs generate` and view the docs site, this text appears exactly as written but only for the `order_total_cents` column of the `orders` model.
 
### Reusing descriptions with doc()
 
To avoid repeating the same description across multiple models or columns, dbt lets you define documentation separately and reference it using the `doc()` function.
 
With this approach, documentation is written once in a markdown file using a named docs block, and then reused wherever needed in your project. This helps ensure consistency and makes it easier to maintain shared definitions over time.
 
First, define a reusable documentation block in a `docs.md`:
 
<File name="models/docs/example.md">
 
```
{% docs order_total_cents %}
Total order amount in cents. This value is always a positive integer and excludes taxes and shipping.
{% enddocs %}
```
 
</File>
 
This defines a docs block named `order_total_cents`. Reference it with `doc('order_total_cents')` in description fields wherever you need the same text.
 
Next, reference this documentation in your properties YAML file:
 
<File name="models/orders.yml">
 
```yaml
models:
  - name: orders
    columns:
      - name: order_total_cents
        description: "{{ doc('order_total_cents') }}"
```
 
</File>
 
When you run `dbt docs generate`, dbt resolves the `doc()` reference by looking up the corresponding docs block and injecting its content into the generated documentation.
 
As a result, the column description displays the text defined in the markdown file, rather than inline YAML.
 
## Avoid duplicate names
 
Docs block names must be unique within your project. If you define multiple `{% docs %}` blocks with the same name, dbt cannot reliably determine which block to use when `doc('DOCS_BLOCK_NAME')` is called.
 
<VersionBlock firstVersion="1.11" lastVersion="1.99">
 
In <Constant name="core" /> v1.11 and later, duplicate docs block names are not allowed. If duplicates are found, dbt reports the conflicting files and raises a compilation error. Rename one block so each docs block name is unique.
 
<File name="models/docs/example.md">
 
```
{% docs order_total_cents %}
Total order amount in cents. This value is always a positive integer and excludes taxes and shipping.
{% enddocs %}
 
{% docs order_total_cents %}
Total order amount in cents, excluding taxes and shipping fees.
{% enddocs %}
```
 
</File>
 
```shell
dbt parse
09:55:55  Running with dbt=1.11.8
09:55:55  Registered adapter: duckdb=1.10.1
09:55:56  Encountered an error:
Compilation Error
  dbt found two docs with the name "order_total_cents".
  
  Since these resources have the same name, dbt will be unable to find the correct resource
  when looking for doc("order_total_cents").
  
  To fix this, change the name of one of these resources:
  - doc.orders.order_total_cents (models/docs/example.md)
  - doc.orders.order_total_cents (models/docs/example.md)
```
 
</VersionBlock>
 
<VersionBlock firstVersion="2.0">
 
In the <Constant name="fusion_engine" />, duplicate docs block names are not allowed. If duplicates are found, dbt reports the conflicting files and surfaces a warning. Rename one block so each docs block name is unique. For more information, refer to [Stricter evaluation of duplicate docs blocks](/docs/dbt-versions/core-upgrade/upgrading-to-fusion?version=2.0#stricter-evaluation-of-duplicate-docs-blocks).
 
<File name="models/docs/example.md">
 
```
{% docs order_total_cents %}
Total order amount in cents. This value is always a positive integer and excludes taxes and shipping.
{% enddocs %}
 
{% docs order_total_cents %}
Total order amount in cents, excluding taxes and shipping fees.
{% enddocs %}
```
 
</File>
 
```text
dbt found two docs with the same name: 'order_total_cents' in files: 'models/docs/example.md' and 'models/docs/example.md'
```
 
</VersionBlock>