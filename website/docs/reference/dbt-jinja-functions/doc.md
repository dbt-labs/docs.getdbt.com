---
title: "About the doc function"
sidebar_label: "doc"
id: "doc"
description: "Use `doc()` to reference docs blocks in description fields."
---

The `doc()` Jinja function is analogous to `ref()` and is used to look up a named docs block (for example, `{% docs orders %} ... {% enddocs %}`) and return its rendered content. This lets you reuse documentation text in `schema.yml` description fields (and other Jinja-enabled descriptions). For more information, refer to the [Documentation guide](/docs/explore/build-and-view-your-docs).

## Usage

In dbt, column descriptions are typically defined inline in a model’s `schema.yml` file. These descriptions are written as plain text and are associated directly with a specific column.

### Hardcoded column description

This example shows how a column description is defined directly in the `schema.yml`:

<File name="models/schema.yml">

```yaml
models:
  - name: my_first_dbt_model
    columns:
      - name: id
        description: "The primary key for this table"
```

</File>
When you run `dbt docs generate` and view the docs site, this text appears exactly as written.


### Reusing documentation with doc()

To avoid repeating the same description across multiple models or columns, dbt lets you define documentation separately and reference it using the `doc()` function.

With this approach, documentation is written once in a markdown file using a named docs block, and then reused wherever needed in your project. This helps ensure consistency and makes it easier to maintain shared definitions over time.

First, define a reusable documentation block:

<File name="models/docs.md">

```
{% docs customer_id %}
A reusable customer identifier.
{% enddocs %}
```

</File>

This creates a named piece of documentation (`customer_id`) that dbt can reference elsewhere.

Next, reference this documentation in your `schema.yml`:

<File name="models/schema.yml">


```yaml
models:
  - name: my_first_dbt_model
    columns:
      - name: id
        description: "{{ doc('customer_id') }}"
```

</File>
When you run `dbt docs generate`, dbt resolves the `doc()` reference by looking up the corresponding docs block and injecting its content into the generated documentation.

As a result, the column description in the Docs UI will display the text defined in the markdown file, rather than inline YAML.

### Duplicate docs block names

Docs block names must be unique within your project. If you define multiple `{% docs ... %}` blocks with the same name, dbt can’t reliably decide which block to render when you call `doc('DOCS_BLOCK_NAME')`.

<VersionBlock firstVersion="1.11" lastVersion="1.99">

In <Constant name="core" /> v1.11 and later, duplicate docs blocks are not allowed. dbt raises a compilation error to prevent ambiguous `doc()` references.

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

In the <Constant name="fusion_engine" />, duplicate docs blocks emit a warning during parsing. Even though parsing can finish, you should still resolve the duplicate name to avoid ambiguity. For more information, refer to [Stricter evaluation of duplicate docs blocks](/docs/dbt-versions/core-upgrade/upgrading-to-fusion?version=2.0#stricter-evaluation-of-duplicate-docs-blocks).

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
~/.local/bin/dbt parse
dbt-fusion 2.0.0-preview.168
   Loading ~/.dbt/profiles.yml
=================== Errors and Warnings ===================
warning: dbt9002: dbt found two docs with the same name: 'customer_id' in files: 'models/docs/example.md' and 'models/docs/example.md'
  --> models/docs/example.md
==================== Execution Summary ====================
Finished 'parse' with 1 warning for target 'dev' [693ms]
```

</VersionBlock>
