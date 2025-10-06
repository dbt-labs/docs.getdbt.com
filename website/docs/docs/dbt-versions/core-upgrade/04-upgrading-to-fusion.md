---
title: "Upgrading to the dbt Fusion engine (v2.0)"
id: upgrading-to-fusion
description: New features and changes in Fusion
displayed_sidebar: "docs"
---

import FusionAdapters from '/snippets/_fusion-dwh.md';
import FusionBeta from '/snippets/_fusion-beta-callout.md';

<FusionBeta />

import AboutFusion from '/snippets/_about-fusion.md';

<AboutFusion />

## What to know before upgrading

<Constant name="core" />  and dbt Fusion share a common language spec—the code in your project. dbt Labs is committed to providing feature parity with <Constant name="core" />  wherever possible.

At the same time, we want to take this opportunity to _strengthen the framework_ by removing deprecated functionality, rationalizing confusing behavior, and providing more rigorous validation on erroneous inputs. This means that there is some work involved in preparing an existing dbt project for readiness on Fusion.

That work is documented below — it should be simple, straightforward, and in many cases, auto-fixable with the [`dbt-autofix`](https://github.com/dbt-labs/dbt-autofix) helper.

You can find more information about what's changing in the dbt Fusion engine [changelog](https://github.com/dbt-labs/dbt-fusion/blob/main/CHANGELOG.md).

### Supported adapters

The following adapters are supported in the dbt Fusion engine:

<FusionAdapters />

### A clean slate

dbt Labs is committed to moving forward with Fusion, and it will not support any deprecated functionality:
- All [deprecation warnings](/reference/deprecations) must be resolved before upgrading to the new engine. This included historic deprecations and [new ones as of dbt Core v1.10](/docs/dbt-versions/core-upgrade/upgrading-to-v1.10#deprecation-warnings). _While Fusion is in beta, it will raise validation warnings, but these warnings will become errors when Fusion goes into Preview._
- All [behavior change flags](/reference/global-configs/behavior-changes#behaviors) will be removed (generally enabled). You can no longer opt out of them using `flags:` in your `dbt_project.yml`.

### Ecosystem packages

The most popular `dbt-labs` packages (`dbt_utils`, `audit_helper`, `dbt_external_tables`, `dbt_project_evaluator`) are already compatible with Fusion. External packages published by organizations outside of dbt may use outdated code or incompatible features that fail to parse with the new Fusion engine. Now that we've announced Fusion in beta, we're going to work with other package maintainers to get them ready & working on Fusion. If we know that a popular package will require upgrading to a new release for Fusion compatibility, we will document it here.

### Changed functionality

When developing the Fusion engine, there were opportunities to improve the dbt framework - failing earlier (when possible), fixing bugs, optimizing run order, and deprecating flags that are no longer relevant. The result is a handful of specific and nuanced changes to existing behavior.

When upgrading to Fusion, you should expect the following changes in functionality:

#### Parse time printing of relations will print out the full qualified name, instead of an empty string

In dbt Core v1, when printing the result of `get_relation()`, the parse time output for that Jinja would print `None` (the undefined object coerces to the string “None”).

In Fusion, to help with intelligent batching of `get_relation()` calls (and significantly speed up `dbt compile`), dbt needs to construct a relation object with the fully qualified name resolved at parse time for the `get_relation()` adapter call.

Constructing a relation object with the fully qualified name in Fusion produces different behavior than dbt Core v1 in `print()`, `log()`, or any Jinja macro that outputs to `stdout` or `stderr` at parse time. 

Example:

```jinja
{% set relation = adapter.get_relation(
database=db_name,
schema=db_schema,
identifier='a')
%}
{{ print('relation: ' ~ relation) }}

{% set relation_via_api = api.Relation.create(
database=db_name,
schema=db_schema,
identifier='a'
) %}
{{ print('relation_via_api: ' ~ relation_via_api) }}
```

The output after `dbt parse` in dbt Core v1:

```
relation: None
relation_via_api: my_db.my_schema.my_table
```

The output after `dbt parse` in Fusion:

```
relation: my_db.my_schema.my_table
relation_via_api: my_db.my_schema.my_table
```

#### Deprecated flags

Some historic flags in dbt Core v1 will no longer do anything in Fusion. If you pass them into a dbt command using Fusion, the command will not error, but the flag will do nothing (and warn accordingly).

One exception to this rule: The `--models` / `--model` / `-m` flag was renamed to `--select` / `--s` way back in dbt Core v0.21 (Oct 2021). Silently skipping this flag means ignoring your command's selection criteria, which could mean building your entire DAG when you only meant to select a small subset. For this reason, the `--models` / `--model` / `-m` flag **will raise an error** in Fusion. Please update your job definitions accordingly.

| flag name | remediation |
| ----------| ----------- |
| `dbt seed` [`--show`](/reference/commands/seed) | N/A |
| [`--print` / `--no-print`](/reference/global-configs/print-output) | No action required |
| [`--printer-width`](/reference/global-configs/print-output#printer-width) | No action required |
| [`--source`](/reference/commands/deps#non-hub-packages) | No action required |
| [`--record-timing-info` / `-r`](/reference/global-configs/record-timing-info) | No action required |
| [`--cache-selected-only` / `--no-cache-selected-only`](/reference/global-configs/cache) | No action required |
| [`--clean-project-files-only` / `--no-clean-project-files-only`](/reference/commands/clean#--clean-project-files-only) | No action required |
| `--single-threaded` / `--no-single-threaded` | No action required |
| `dbt source freshness` [`--output` / `-o`](/docs/deploy/source-freshness)  | |
| [`--config-dir`](/reference/commands/debug)  | No action required | 
| [`--resource-type` / `--exclude-resource-type`](/reference/global-configs/resource-type) | change to `--resource-types` / `--exclude-resource-types` |
| `--show-resource-report` / `--no-show-resource-report` | No action required |
| [`--log-cache-events` / `--no-log-cache-events`](/reference/global-configs/logs#logging-relational-cache-events) | No action required | 
| `--use-experimental-parser` / `--no-use-experimental-parser` | No action required |
| [`--empty-catalog`](/reference/commands/cmd-docs#dbt-docs-generate ) | |
| [`--compile` / `--no-compile`](/reference/commands/cmd-docs#dbt-docs-generate) | |
| `--inline-direct` |  No action required |
| `--partial-parse-file-diff` / `--no-partial-parse-file-diff` | No action required |
| `--partial-parse-file-path` | No action required |
| `--populate-cache` / `--no-populate-cache` | No action required |
| `--static-parser` / `--no-static-parser` | No action required |
| `--use-fast-test-edges` / `--no-use-fast-test-edges` | No action required |
| [`--introspect` / `--no-introspect`](/reference/commands/compile#introspective-queries) | No action required |
| `--inject-ephemeral-ctes` / `--no-inject-ephemeral-ctes` | | 
| [`--partial-parse` / `--no-partial-parse`](/reference/parsing#partial-parsing)  | No action required |

#### Conflicting package versions when a local package depends on a hub package which the root package also wants will error

If a local package depends on a hub package that the root package also wants, `dbt deps` doesn't resolve conflicting versions in dbt Core v1; it will install whatever the root project requests.

Fusion will present an error:

```bash
error: dbt8999: Cannot combine non-exact versions: =0.8.3 and =1.1.1
```


#### Parse will fail on nonexistent macro invocations and adapter methods

When you call a nonexistent macro in dbt:

```sql
select
  id as payment_id,
  # my_nonexistent_macro is a macro that DOES NOT EXIST
  {{ my_nonexistent_macro('amount') }} as amount_usd,
from app_data.payments
```

Or a nonexistent adapter method:

```sql
{{ adapter.does_not_exist() }}
```

In dbt Core v1, `dbt parse` passes, but `dbt compile` fails.

Fusion will error out during `parse`.

#### Parse will fail on missing generic test

When you have an undefined generic test in your project:

```yaml

models:
  - name: dim_wizards
    data_tests:
      - does_not_exist

```

In dbt Core v1, `dbt parse` passes, but `dbt compile` fails.

Fusion will error out during `parse`.   

#### Parse will fail on missing variable

When you have an undefined variable in your project:

```sql

select {{ var('does_not_exist') }} as my_column

```

In dbt Core v1, `dbt parse` passes, but `dbt compile` fails.

Fusion will error out during `parse`.

#### Stricter evaluation of duplicate docs blocks

In older versions of <Constant name="core" />, it was possible to create scenarios with duplicate [docs blocks](/docs/build/documentation#using-docs-blocks). For example, you can have two packages with identical docs blocks referenced by an unqualified name in your dbt project. In this case, <Constant name="core" /> would use whichever docs block is referenced without any warnings or errors. 

<Constant name="fusion" /> adds stricter evaluation of names of docs blocks to prevent such ambiguity. It will present an error if it detects duplicate names:

```bash
dbt found two docs with the same name: 'docs_block_title in files: 'models/crm/_crm.md' and 'docs/crm/business_class_marketing.md'
```

To resolve this error, rename any duplicate docs blocks. 

#### End of support for legacy manifest versions

You can no longer interoperate with pre-1.8 versions of dbt-core if you're a:
- Hybrid customer running Fusion and an old (pre-v1.8) version of dbt Core
- Customer upgrading from the old (pre-v1.8) version of dbt Core to Fusion

Fusion can not interoperate with the old manifest, which powers features like deferral for `state:modified` comparison.

#### `dbt clean` will not delete any files in configured resource paths or files outside the project directory

In dbt Core v1, `dbt clean` deletes:
- Any files outside the project directory if `clean-targets` is configured with an absolute path or relative path containing `../`, though there is an opt-in config to disable this (`--clean-project-files-only` / `--no-clean-project-files-only`).
- Any files in the `asset-paths` or `doc-paths` (even though other resource paths, like `model-paths` and `seed-paths`, are restricted).

In Fusion, `dbt clean` will not delete any files in configured resource paths or files outside the project directory.

#### All unit tests are run first in `dbt build`

In dbt Core v1, the direct parents of the model being unit tested needed to exist in the warehouse to retrieve the needed column name and type information. `dbt build` runs the unit tests (and their dependent models) _in lineage order_.

In Fusion, `dbt build` runs _all_ of the unit tests _first_, and then build the rest of the DAG, due to built-in column name and type awareness. 

#### Configuring `--threads`

dbt Core runs with `--threads 1` by default. You can increase this number to run more nodes in parallel on the remote data platform, up to the max parallelism enabled by the DAG.

In Fusion, if `--threads` is not set, or set to `--threads 0`, dbt will use a per-adapter default value for maximum threads. Some data platforms can handle more concurrent connections than others. If there is a user-configured value for `--threads` (via CLI flag or `profiles.yml`), Fusion will use it.

#### Continue to compile unrelated nodes after hitting a compile error

As soon as dbt Core's `compile` encounters an error compiling one of your models, dbt stops and doesn't compile anything else.

When Fusion's `compile` encounters an error, it will skip nodes downstream of the one that failed to compile, but it will keep compiling the rest of the DAG (in parallel, up to the number of configured / optimal threads).

#### Seeds with extra commas don't result in extra columns

In dbt Core v1, if you have an additional comma on your seed, dbt creates a seed with an additional empty column.

For example, the following seed file (with an extra comma):

```
animal,  
dog,  
cat,  
bear,  

```

Will produce this table when `dbt seed` is executed:

| animal | b |  
| ------ | - |  
| dog    |   |  
| cat    |   |  
| bear   |   |  

Fusion will not produce this extra column in the table resulting from `dbt seed`:

| animal |  
| ------ |  
| dog    |  
| cat    |  
| bear   |  

#### Move standalone anchors under `anchors:` key

As part of the ongoing process of making the dbt authoring language more precise, unexpected top-level keys in a YAML file will result in errors. A common use case behind these unexpected keys is standalone anchor definitions at the top level of a YAML file. You can use the new top-level `anchors:` key as a container for these reusable configuration blocks.

For example, rather than using this configuration:

<File name='models/_models.yml'>

```yml
# id_column is not a valid name for a top-level key in the dbt authoring spec, and will raise an error
id_column: &id_column_alias
  name: id
  description: This is a unique identifier.
  data_type: int
  data_tests:
    - not_null
    - unique

models:
  - name: my_first_model
    columns: 
      - *id_column_alias
      - name: unrelated_column_a
        description: This column is not repeated in other models.
  - name: my_second_model
    columns: 
      - *id_column_alias
```

</File>

Move the anchor under the `anchors:` key instead:

<File name='models/_models.yml'>

```yml
anchors: 
  - &id_column_alias
      name: id
      description: This is a unique identifier.
      data_type: int
      data_tests:
        - not_null
        - unique

models:
  - name: my_first_model
    columns: 
      - *id_column_alias
      - name: unrelated_column_a
        description: This column is not repeated in other models
  - name: my_second_model
    columns: 
      - *id_column_alias
```

</File>

This move is only necessary for fragments defined outside of the main YAML structure. For more information about this new key, see [anchors](/reference/resource-properties/anchors).

#### Algebraic operations in Jinja macros

In <Constant name="core" />, you can set algebraic functions in the return function of a Jinja macro:

```jinja
{% macro my_macro() %}

return('xyz') + 'abc'

{% endmacro %}
```

This is no longer supported in <Constant name="fusion" /> and will return an error: 

```bash
error: dbt1501: Failed to add template invalid operation: return() is called in a non-block context
```

This is not a common use case and there is no deprecation warning for this behavior in  <Constant name="core" />. The supported format is:

```jinja
{% macro my_macro() %}

return('xyzabc')

{% endmacro %}
```

### Package support

import FusionPackages from '/snippets/_fusion-supported-packages.md';

<FusionPackages />
