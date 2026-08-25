---
title: "Jinja file extensions"
id: "allow_jinja_file_extensions"
sidebar_label: "allow jinja file extensions"
---

| allow_jinja_file_extensions | <Constant name="dbt" /> **Latest** | <Constant name="core" /> |
|---|---|---|
| Introduced | 2026.5 | 1.12.0 |
| Matured (default → `true`) | — | — |
| Removed | — | — |

The `allow_jinja_file_extensions` flag is set to `false` by default.

When set to `true`, dbt recognizes Jinja-style extension suffixes (for example, `.j2`, `.jinja`, and `.jinja2`) appended to `.sql` and `.md` files. This lets you use Jinja-aware syntax highlighting in IDEs that associate these suffixes with Jinja templating.

dbt strips the Jinja suffix when determining node names; resource names remain unchanged regardless of whether the Jinja suffix is present. For example, a [docs block](/docs/build/documentation#using-docs-blocks) file named `my_docs.md.j2` is parsed identically to `my_docs.md`, and a model file named `my_model.sql.j2` is parsed as the model `my_model`.

When this flag is `false` or unset, dbt ignores files with these suffixes without logging a warning. If you've already added schema properties for that file, you'll see a "Did not find matching node for patch warning on schema.yml" warning.
