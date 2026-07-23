---
title: "Upgrading to v2"
id: upgrading-to-v2
description: New features and changes in v2
displayed_sidebar: "docs"
---

import FusionAdapters from '/snippets/_fusion-dwh.md';
import FusionUpgradeSteps from '/snippets/_fusion-upgrade-steps.md';
import FusionLifecycle from '/snippets/_fusion-lifecycle-callout.md';
import FusionThreads from '/snippets/_fusion-threads.md';
import FusionPartialParseCliFlags from '/snippets/_fusion-partial-parse-cli-flags.md';

v2 is the current era of dbt, delivered through <Constant name="fusion" />. When you install dbt, you get <Constant name="fusion" /> by default. This guide walks you through upgrading a v1 project to v2. 

v2 is faster and stricter, but your existing project language and DAG semantics carry over, so once you upgrade, your project works as before &mdash; just faster.


<FusionLifecycle />

import AboutFusion from '/snippets/_about-fusion.md';

<AboutFusion />

## Install dbt

Upgrading to v2 is an install step. Install dbt using `pip` to get <Constant name="fusion" /> for v2:

```shell
python -m pip install --pre dbt
```

For full instructions, including Homebrew, winget, and additional options, refer to [Install dbt](/docs/local/install-dbt).

## What to know before upgrading

This new major version is an opportunity to _strengthen the framework_ by removing deprecated functionality, rationalizing confusing behavior, and providing more rigorous validation on erroneous inputs. This means that there is some work involved in preparing an existing dbt project for v2.

That work is documented below — it should be simple, straightforward, and in many cases, auto-fixable with the [`dbt-autofix`](https://github.com/dbt-labs/dbt-autofix) helper or the [agent skill](https://github.com/dbt-labs/dbt-agent-skills/tree/main/skills/dbt-migration/skills/migrating-dbt-core-to-fusion).

:::tip Test v2 parser compatibility from dbt Core v1.12

If you're on <Constant name="core" /> v1.12, you can test the rust parser compatibility before fully migrating by using the opt-in [`--use-v2-parser`](/reference/global-configs/parsing#opt-in-v2-parser) flag. This delegates parsing to the v2 parser without changing any other behavior, making it a low-risk way to catch compatibility issues early.

:::

<FusionUpgradeSteps />

### Supported adapters

The following adapters are supported in v2:

<FusionAdapters />

### A clean slate

v2 will not support any deprecated functionality (see the [Changes overview](/reference/changes-overview) for details):
- All [deprecation warnings](/reference/deprecations) must be resolved before upgrading to the new engine. This includes historic deprecations and [new ones as of dbt Core v1.10](/docs/dbt-versions/core-upgrade/upgrading-to-v1.10#deprecation-warnings).
- Some [behavior change flags](/reference/global-configs/behavior-changes#behavior-change-flags) will be removed (generally enabled). You can no longer opt out of them using `flags:` in your `dbt_project.yml`.

### Ecosystem packages

The most popular `dbt-labs` packages (`dbt_utils`, `audit_helper`, `dbt_external_tables`, `dbt_project_evaluator`) are already compatible with v2. External packages published by organizations outside of dbt may use outdated code or incompatible features that fail to parse in v2. We're working with those package maintainers to make packages available for v2. Packages requiring an upgrade to a new release for v2 compatibility, will be documented in this upgrade guide.

## New and changed features and functionality

### `dbt login`

In <Constant name="dbt" /> v2, [`dbt login`](/reference/commands/login) enables browser-based authentication. It opens a browser window prompting you to sign in to your <Constant name="dbt_platform" /> account or create a free account.

Run [`dbt login status`](/reference/commands/login#dbt-login-status) to view your current authentication status.

`dbt login` unlocks a broader set of features, such as advanced features in the [dbt VS Code extension](/docs/about-dbt-extension). For details, refer to [`dbt login`](/reference/commands/login).

### Changed functionality

When developing v2, there were opportunities to improve the dbt framework — failing earlier (when possible), fixing bugs, optimizing run order, and deprecating flags that are no longer relevant. The result is a handful of specific and nuanced changes to existing behavior.

When upgrading to v2, you should expect the following changes in functionality:

#### Parse time printing of relations will print out the full qualified name, instead of an empty string

In dbt Core v1.x, when printing the result of `get_relation()`, the parse time output for that Jinja would print `None` (the undefined object coerces to the string "None").

In v2, to help with intelligent batching of `get_relation()` calls (and significantly speed up `dbt compile`), dbt needs to construct a relation object with the fully qualified name resolved at parse time for the `get_relation()` adapter call.

Constructing a relation object with the fully qualified name in v2 produces different behavior than v1 in `print()`, `log()`, or any Jinja macro that outputs to `stdout` or `stderr` at parse time. 

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

The output after `dbt parse` in dbt Core v1.x:

```
relation: None
relation_via_api: my_db.my_schema.my_table
```

The output after `dbt parse` in v2:

```
relation: my_db.my_schema.my_table
relation_via_api: my_db.my_schema.my_table
```

#### Deprecated flags

Deprecated flags are command-line flags (like `--models`, `--print`) that you pass to dbt commands. These are being removed in v2. This is different from:
- [Deprecation warnings](/reference/deprecations) &mdash; Features in your project code (models, YAML, macros) that need to be updated
- [Behavior change flags](/reference/global-configs/behavior-changes) &mdash; Flags in `dbt_project.yml` that let you opt in/out of new behaviors

See the [Changes overview](/reference/changes-overview) for a full comparison.

Some historic CLI flags from v1 will no longer do anything in v2. If you pass them into a dbt command in v2, the command will not error, but the flag will do nothing (and warn accordingly).

| flag name | remediation |
| ----------| ----------- |
| `--models` / `--model` / `-m` | Refer to [CLI flags that need changes](#cli-flags-that-need-changes). |
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
| [`--resource-type` / `--exclude-resource-type`](/reference/global-configs/resource-type) | Refer to [CLI flags that need changes](#cli-flags-that-need-changes). |
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
| [`--partial-parse` / `--no-partial-parse`](/reference/parsing#partial-parsing)  | Refer to [CLI flags that need changes](#cli-flags-that-need-changes). |

##### CLI flags that need changes {#cli-flags-that-need-changes}

The following deprecated flags require updates in your job definitions or scripts:

- **`--models` / `--model` / `-m`:** Use `--select` / `-s` instead (renamed in dbt Core v0.21). dbt raises an error in v2 if you use the old flags. Do not pass `--models` as the value to `-s` (for example, `dbt run -s --models`); v1 treated that as a model name, but v2 requires a valid selector.

- **`--resource-type` / `--exclude-resource-type`:** Use `--resource-types` / `--exclude-resource-types`. For more information, see [Resource type flags](/reference/global-configs/resource-type).

<FusionPartialParseCliFlags />

#### Conflicting package versions when a local package depends on a hub package which the root package also wants will error

If a local package depends on a hub package that the root package also wants, `dbt deps` doesn't resolve conflicting versions in <Constant name="core" /> v1; it will install whatever the root project requests.

v2 will present an error:

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

In v1, `dbt parse` passes, but `dbt compile` fails.

In v2, dbt will error out during `parse`.

#### Parse will fail on missing generic test

When you have an undefined generic test in your project:

```yaml

models:
  - name: dim_wizards
    data_tests:
      - does_not_exist

```

In v1, `dbt parse` passes, but `dbt compile` fails.

In v2, dbt will error out during `parse`.   

#### Parse will fail on missing variable

When you have an undefined variable in your project:

```sql

select {{ var('does_not_exist') }} as my_column

```

In v1, `dbt parse` passes, but `dbt compile` fails.

In v2, dbt will error out during `parse`.

#### Stricter evaluation of duplicate docs blocks

In v1, it was possible to create scenarios with duplicate [docs blocks](/docs/build/documentation#using-docs-blocks). For example, you can have two packages with identical docs blocks referenced by an unqualified name in your dbt project. In this case, v1 would use whichever docs block is referenced without any warnings or errors.


v2 adds stricter evaluation of names of docs blocks to prevent such ambiguity. It will present an error if it detects duplicate names:

```bash
dbt found two docs with the same name: 'docs_block_title' in files: 'models/crm/_crm.md' and 'docs/crm/business_class_marketing.md'
```

To resolve this error, rename any duplicate docs blocks. 

#### `dbt clean` will not delete any files in configured resource paths or files outside the project directory

In dbt Core v1.x, `dbt clean` deletes:
- Any files outside the project directory if `clean-targets` is configured with an absolute path or relative path containing `../`, though there is an opt-in config to disable this (`--clean-project-files-only` / `--no-clean-project-files-only`).
- Any files in the `asset-paths` or `doc-paths` (even though other resource paths, like `model-paths` and `seed-paths`, are restricted).

In v2, `dbt clean` will not delete any files in configured resource paths or files outside the project directory.

#### All unit tests are run first in `dbt build`

In dbt Core v1.x, the direct parents of the model being unit tested needed to exist in the warehouse to retrieve the needed column name and type information. `dbt build` runs the unit tests (and their dependent models) _in lineage order_.

In v2, `dbt build` runs _all_ of the unit tests _first_, and then builds the rest of the DAG, due to built-in column name and type awareness.

#### Configuring `--threads`

<Constant name="core" /> v1 runs with `--threads 1` by default. You can increase this number to run more nodes in parallel on the remote data platform, up to the max parallelism enabled by the DAG.

v2 handles threading differently depending on your data platform:

<FusionThreads />

For more information, refer to [Using threads](/docs/running-a-dbt-project/using-threads#fusion-engine-thread-optimization).

#### Continue to compile unrelated nodes after hitting a compile error

As soon as <Constant name="core" /> v1 `compile` encounters an error compiling one of your models, dbt stops and doesn't compile anything else.

When v2's `compile` encounters an error, it will skip nodes downstream of the one that failed to compile, but it will keep compiling the rest of the DAG (in parallel, up to the number of configured / optimal threads).

#### Seeds with extra commas don't result in extra columns

In dbt Core v1.x, if you have an additional comma on your seed, dbt creates a seed with an additional empty column.

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

In v2, it will not produce this extra column in the table resulting from `dbt seed`:

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

In v1, you can set algebraic functions in the return function of a Jinja macro:

```jinja
{% macro my_macro() %}

return('xyz') + 'abc'

{% endmacro %}
```

This is no longer supported in v2 and will emit a warning:

```bash
[warning] [JinjaTopLevelReturn (dbt1508)]: return is not at the top level of the block.
Its value is final and cannot be modified by surrounding expressions.
Example: return(0) + 1. The + 1 is ignored and the macro returns 0.
```

This is not a common use case and there is no deprecation warning for this behavior in v1. The supported format is:

```jinja
{% macro my_macro() %}

return('xyzabc')

{% endmacro %}
```
### Accessing custom configurations in meta

`config.get()` and `config.require()` don't return values from the `meta` dictionary. If you try to access a key that only exists in `meta`, dbt emits a warning:

```bash
warning: The key 'my_key' was not found using config.get('my_key'), but was 
detected as a custom config under 'meta'. Please use config.meta_get('my_key') 
or config.meta_require('my_key') instead.
```

Behavior when a key exists only in meta:

| Method | Behavior |
|--------|----------|
| `config.get('my_key')` | Returns the default value and emits a warning. |
| `config.require('my_key')` | Raises an error and emits a warning. |

To access custom configurations stored under meta, use the explicit methods:

```jinja
{% set owner = config.meta_get('owner') %}
{% set has_pii = config.meta_require('pii') %}
```

For more information, see [config.meta_get()](/reference/dbt-jinja-functions/config#configmeta_get) and [config.meta_require()](/reference/dbt-jinja-functions/config#configmeta_require).

### v2 compiler

#### Snowflake model functions

v2 supports [Snowflake ML model functions](https://docs.snowflake.com/en/guides-overview-ml-functions), which allow you to call machine learning models directly in SQL. 

Because model function return types are flexible and defined by the underlying model, v2 uses simplified type checking:
- **Arguments:** v2 accepts any arguments without strict type validation.
- **Return type:** v2 treats all model function results as `VARIANT`.

To use the result in your models, cast it to the expected type:

```sql
select 
  my_model!predict(input_column)::float as prediction_score
from {{ ref('my_table') }}
```


### Package support

import FusionPackages from '/snippets/_fusion-supported-packages.md';

<FusionPackages />

## Distributions

v2 is available in two distributions. For more information, refer to [dbt licensing](/docs/dbt-licensing).

<SimpleTable>
| Distribution | Package | Use it when |
| --- | --- | --- |
| <Constant name="fusion" /> | `dbt` | You want the recommended v2 experience, with Fusion installed by default. |
| dbt Core 2.0 | `dbt-core` | Your organization has a strict requirement to use the Apache 2.0 [open-source runtime](/docs/local/install-dbt-core-v2). |
</SimpleTable>

If you have a older project that isn’t ready to move to v2, continue using `dbt-core` v1.x for compatibility. For new or upgraded projects, we recommend v2.
