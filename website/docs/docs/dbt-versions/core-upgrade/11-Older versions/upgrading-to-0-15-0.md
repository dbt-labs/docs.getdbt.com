---
title: "Upgrading to 0.15.0"
id: "upgrading-to-0-15-0"
displayed_sidebar: "docs"
---

import UpgradeMove from '/snippets/_upgrade-move.md';

<UpgradeMove />

The dbt v0.15.0 release contains a handful of breaking code changes for users upgrading from v0.14.0.


## Breaking changes

### Stricter YML compilation

Previous versions of dbt would raise warnings and ignore improperly formatted `.yml` files.
Compilation errors in .yml files are now treated as errors instead of warnings.

### Relation class

The `table_name` field has been removed from Relations. Macros that
expect this field will now return errors. See the latest
[class reference](/reference/dbt-classes#relation) for details.

### Custom materializations

All <Term id="materialization">materializations</Term> must now manage dbt's Relation cache. For more information, refer to  [Create new materializations](/guides/creating-new-materializations).

### dbt Server

The existing `compile` and `execute` rpc tasks have been renamed to `compile_sql` and `execute_sql`.
For more details, see the latest [rpc docs](/reference/commands/rpc).

## Python requirements

dbt v0.15.0 removes support for for Python 2.x, [as it will no longer be supported on January 1, 2020](https://www.python.org/dev/peps/pep-0373/).

If you are installing dbt in a Python environment alongside other Python modules,
please be mindful of the following changes to dbt's Python dependencies:

- Dropped support for `networkx 1.x`
- Upgraded `werkzeug` to `0.15.6`
- Pinned `psycopg2` dependency to `2.8.x` to prevent segfaults
- Set a strict upper bound for `jsonschema` dependency
