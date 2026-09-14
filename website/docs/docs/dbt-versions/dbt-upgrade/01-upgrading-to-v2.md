---
title: "Upgrading to v2"
id: upgrading-to-v2
description: New features and changes in v2
displayed_sidebar: "docs"
availability:
  engine: v2
  access: free
---

# Upgrading to v2 <Lifecycle status="beta" />

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

## Resources

- [<Constant name="fusion_engine" /> changelog](https://github.com/dbt-labs/dbt/blob/main/CHANGELOG-fusion.md)

## Install dbt

Upgrading to v2 is an install step. Install dbt using `pip` to get <Constant name="fusion" /> for v2:

```shell
python -m pip install --pre dbt
```

For full instructions, including Homebrew, winget, and additional options, refer to [Install dbt](/docs/local/install-dbt).

## What to know before upgrading

If you have an older project that isn't ready to move to v2, or you need compatibility with existing tooling, packages, or workflows that haven't moved to v2 yet, you can stay on dbt v1.x, which remains fully supported. Over time, new capabilities will land in v2 only, so most people will eventually want to upgrade. To install or continue using v1.x, refer to [Install dbt v1.x](/docs/local/install-dbt?version=1.12).

This new major version is an opportunity to _strengthen the framework_ by removing deprecated functionality, rationalizing confusing behavior, and providing more rigorous validation on erroneous inputs. This means that there is some work involved in preparing an existing dbt project for v2.

That work is documented below — it should be simple, straightforward, and in many cases, auto-fixable with the [`dbt-autofix`](https://github.com/dbt-labs/dbt-autofix) helper or the [agent skill](https://github.com/dbt-labs/dbt-agent-skills/tree/main/skills/dbt-migration/skills/migrating-dbt-core-to-fusion).

:::tip Test v2 parser compatibility from <Constant name="dbt" /> v1.12

If you're on <Constant name="dbt" /> v1.12, you can test the rust parser compatibility before fully migrating by using the opt-in [`--use-v2-parser`](/reference/global-configs/parsing#opt-in-v2-parser) flag. This delegates parsing to the v2 parser without changing any other behavior, making it a low-risk way to catch compatibility issues early.

:::

<FusionUpgradeSteps />

### Supported adapters

The following adapters are supported in v2:

<FusionAdapters />

### A clean slate

v2 will not support any deprecated functionality (see the [Changes overview](/reference/changes-overview) for details):
- All [deprecation warnings](/reference/deprecations) must be resolved before upgrading to the new engine. This includes historic deprecations and [new ones as of <Constant name="dbt" /> v1.10](/docs/dbt-versions/dbt-upgrade/upgrading-to-v1.10#deprecation-warnings).
- Some [behavior change flags](/reference/global-configs/behavior-changes#behavior-change-flags) will be removed (generally enabled). You can no longer opt out of them using `flags:` in your `dbt_project.yml`.

### Ecosystem packages

The most popular `dbt-labs` packages (`dbt_utils`, `audit_helper`, `dbt_external_tables`, `dbt_project_evaluator`) are already compatible with v2. External packages published by organizations outside of dbt may use outdated code or incompatible features that fail to parse in v2. We're working with those package maintainers to make packages available for v2. Packages requiring an upgrade to a new release for v2 compatibility, will be documented in this upgrade guide.

## New and changed features and functionality

<!-- Docs for ino schema, model freshness, checks, and agent skills will be added in separate PRs -->


### Strict validation

In v1, misspelled configs, unexpected YAML keys, and invalid flags were silently ignored. In v2, dbt enforces a tightly-defined language specification at parse time and raises explicit errors for any violation, including unused config paths in `dbt_project.yml`, unknown CLI options, and duplicate config keys.

### Faster Rust parser

The v2 engine is a complete rewrite in Rust, delivering faster parse and compile times, especially on large projects. No configuration is needed; the performance improvement is automatic.

### dbt Docs v2

v2 introduces [dbt Docs v2](/docs/build/view-documentation#dbt-docs-v2), a faster, statically hostable documentation experience that replaces the v1 static site. `dbt docs generate` compiles your project, produces the v2 Parquet artifacts, and exports a static site in a single command. `dbt docs serve` previews that site locally, and because the browser queries those artifacts directly with DuckDB-WASM (WebAssembly), you can also host the generated files on any static file host. You only need `--generate-info-schema` if you want to produce the artifacts from a separate `dbt compile` or `dbt build` command.

To hydrate catalog metadata (`catalog.json`) for <Constant name="catalog" /> without building the site, use the [`--write-catalog` flag](/reference/commands/cmd-docs#--write-catalog-flag) instead.

For full usage, refer to [About dbt docs commands](/reference/commands/cmd-docs).

### dbt-docs site

The new dbt-docs site visualizes your full project metadata (models, sources, tests, macros, and column-level lineage) directly from the Parquet artifacts in `target/index/`. Because the browser queries those artifacts locally via DuckDB-WASM, no server-side query engine is needed and the site can be hosted on any static file host.

Column-level lineage is visible in dbt-docs when you build with `--static-analysis strict`. For details on generating and serving the site, refer to [About dbt docs commands](/reference/commands/cmd-docs).

### Adapters built on ADBC drivers

All v2 adapters connect to data warehouses via the [Arrow Database Connectivity (ADBC)](https://arrow.apache.org/adbc/) standard instead of Python-based adapter libraries. As a result, dbt ships as a single self-contained binary with no Python runtime required.

On first run, dbt downloads adapter drivers from the dbt Labs CDN and caches them locally. Subsequent runs work offline. For supported adapters, refer to [Supported data platforms](/docs/supported-data-platforms).

### `dbt lint`

v2 introduces [`dbt lint`](/reference/commands/lint), a high-performance SQL linter built into dbt. It is SQLFluff-compatible: it reads your `.sqlfluff` config and uses the same rule codes (for example, `CP01`, `RF03`). Run `dbt lint` to lint all models, or `dbt lint [FILE]` to target a specific file. Use `--fix` to auto-apply fixable violations.

### SQL syntax comprehension

Baseline static analysis parses each model's SQL at compile time to understand its structure without a warehouse connection. This is the default mode in dbt v2. Enable it explicitly per-model or project-wide:

```yaml
# dbt_project.yml
models:
  your_project:
    +static_analysis: baseline
```

Or pass `--static-analysis baseline` on the CLI. Baseline analysis infers column schemas at compile time without running queries. For details, refer to [About static analysis](/docs/build/about-static-analysis).

### SQL type and semantic comprehension

Strict static analysis fully resolves column types and validates references across your project without executing queries. It is required to produce [column-level lineage](/docs/explore/column-level-lineage).

Enable it per-model or project-wide:

```yaml
# dbt_project.yml
models:
  your_project:
    +static_analysis: strict
```

Or pass `--static-analysis strict` on the CLI (or set `DBT_STATIC_ANALYSIS=strict`). For details, refer to [static_analysis](/reference/resource-configs/static-analysis).

:::note Deprecated values
`static_analysis: on` and `static_analysis: unsafe` are deprecated synonyms for `strict`. Update these to `strict`; they will be removed in a future release.
:::

### Column-level lineage

v2 tracks which source columns flow into which output columns across your entire DAG. To generate column lineage, build or compile with `--static-analysis strict`:

```shell
dbt build --static-analysis strict
```

The lineage is then visible in [dbt-docs](/docs/build/view-documentation#dbt-docs-v2). No additional configuration is needed; the site detects the presence of the lineage artifact automatically. For details, refer to [Column-level lineage](/docs/explore/column-level-lineage).

### Language server protocol (LSP)

v2 includes a built-in language server that enables IDE features for dbt SQL and YAML files, including hover information, diagnostics, go-to-definition, and column-level completions. The standalone `dbt-lsp` package is no longer published; LSP is now bundled in the `dbt` binary and used automatically by the dbt VS Code extension and <Constant name="studio_ide" />.

Features available depend on your `static_analysis` setting: `baseline` adds syntax error detection and CTE preview; `strict` adds column go-to-definition, column lineage, and type checking. For details, refer to [About dbt LSP](/docs/about-dbt-lsp).

### `dbt login`

In <Constant name="dbt" /> v2, [`dbt login`](/reference/commands/login?version=2.0) enables browser-based authentication. It opens a browser window prompting you to sign in to your <Constant name="dbt_platform" /> account or create a free account.

Run [`dbt login status`](/reference/commands/login?version=2.0#dbt-login-status) to view your current authentication status.

### Experimental features

#### Local execution of unit tests <Lifecycle status="beta" />

v2 introduces the [`compute`](/reference/resource-configs/compute) config for unit tests. Set your unit tests with `compute: local` and dbt runs the test with DuckDB instead of sending it to your data platform, which takes the warehouse round trip out of your development loop.

This config is experimental and requires opt-in: set `DBT_ENGINE_EXPERIMENTAL_LOCAL_UNIT_TESTS=true` in the environment where dbt runs before you use `compute: local`. For details, refer to [Run unit tests locally](/docs/build/unit-tests#run-unit-tests-locally).

#### Multi-adapter invocations

v2 supports running a single project against multiple adapters simultaneously. This is experimental and requires opt-in:

```bash
export DBT_ENGINE_EXPERIMENTAL_MULTI_ADAPTER=true
```

Without this flag, dbt fails at parse time if any node in the project has an `adapter` config, even for runs that don't select that node. The gate reads config as written, not as selected, so the entire project needs the env var to parse once any model uses a non-default adapter.

### Changed functionality

When developing v2, there were opportunities to improve the dbt framework — failing earlier (when possible), fixing bugs, optimizing run order, and deprecating flags that are no longer relevant. The result is a handful of specific and nuanced changes to existing behavior.

When upgrading to v2, you should expect the following changes in functionality:

#### Parse time printing of relations will print out the full qualified name, instead of an empty string

In <Constant name="core_v1" />, when printing the result of `get_relation()`, the parse time output for that Jinja would print `None` (the undefined object coerces to the string "None").

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

The output after `dbt parse` in <Constant name="core_v1" />:

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
| `--inject-ephemeral-ctes` / `--no-inject-ephemeral-ctes` | | 
| [`--partial-parse` / `--no-partial-parse`](/reference/parsing#partial-parsing)  | Refer to [CLI flags that need changes](#cli-flags-that-need-changes). |

##### CLI flags that need changes {#cli-flags-that-need-changes}

The following deprecated flags require updates in your job definitions or scripts:

- **`--models` / `--model` / `-m`:** Use `--select` / `-s` instead (renamed in <Constant name="dbt" /> v0.21). dbt raises an error in v2 if you use the old flags. Do not pass `--models` as the value to `-s` (for example, `dbt run -s --models`); v1 treated that as a model name, but v2 requires a valid selector.

- **`--resource-type` / `--exclude-resource-type`:** Use `--resource-types` / `--exclude-resource-types`. For more information, see [Resource type flags](/reference/global-configs/resource-type).

<FusionPartialParseCliFlags />

#### Conflicting package versions when a local package depends on a hub package which the root package also wants will error

If a local package depends on a hub package that the root package also wants, `dbt deps` doesn't resolve conflicting versions in <Constant name="core" />; it will install whatever the root project requests.

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

In <Constant name="core_v1" />, `dbt clean` deletes:
- Any files outside the project directory if `clean-targets` is configured with an absolute path or relative path containing `../`, though there is an opt-in config to disable this (`--clean-project-files-only` / `--no-clean-project-files-only`).
- Any files in the `asset-paths` or `doc-paths` (even though other resource paths, like `model-paths` and `seed-paths`, are restricted).

In v2, `dbt clean` will not delete any files in configured resource paths or files outside the project directory.

#### All unit tests are run first in `dbt build`

In <Constant name="core_v1" />, the direct parents of the model being unit tested needed to exist in the warehouse to retrieve the needed column name and type information. `dbt build` runs the unit tests (and their dependent models) _in lineage order_.

In v2, `dbt build` runs _all_ of the unit tests _first_, and then builds the rest of the DAG, due to built-in column name and type awareness.

#### Configuring `--threads`

<Constant name="core" /> runs with `--threads 1` by default. You can increase this number to run more nodes in parallel on the remote data platform, up to the max parallelism enabled by the DAG.

v2 handles threading differently depending on your data platform:

<FusionThreads />

For more information, refer to [Using threads](/docs/running-a-dbt-project/using-threads#dbt-v2-thread-optimization).

#### Continue to compile unrelated nodes after hitting a compile error

As soon as v1's `compile` encounters an error compiling one of your models, dbt stops and doesn't compile anything else.

When v2's `compile` encounters an error, it will skip nodes downstream of the one that failed to compile, but it will keep compiling the rest of the DAG (in parallel, up to the number of configured / optimal threads).

#### Seeds with extra commas don't result in extra columns

In <Constant name="core_v1" />, if you have an additional comma on your seed, dbt creates a seed with an additional empty column.

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

#### Self-referential (recursive) YAML anchors are not supported {#self-referential-yaml}

In v1, dbt could parse a YAML anchor that merges into an element of the same sequence it's defined on, creating a self-referential (cyclic) anchor. For example, anchoring a full `tables:` sequence and then merging that anchor into one of the sequence's own elements:

```yml
sources:
  - name: catalogue
    tables: &tables
      - name: anchor_item
        description: The first table in the sequence.
      - <<: *tables
        name: merged_item
```

This parsed successfully in v1 only because PyYAML (the YAML library <Constant name="core_v1" /> depends on) incidentally allows self-referential anchors, a side effect of Python's own support for cyclic data structures, not an intentional YAML feature. No other major YAML implementation allows this pattern.

In v2, parsing this pattern hits a recursion limit and raises an error, so the entire properties file fails to parse. This is a deliberate limitation, not a bug. v2 does not plan to support self-referential anchors.

To resolve this, remove the self-reference. Anchor only the parts of the document that don't merge back into themselves, for example, anchor a single table mapping instead of the whole sequence:

```yml
sources:
  - name: catalogue
    tables:
      - &anchor_item_alias
        name: anchor_item
        description: The first table in the sequence.
      - <<: *anchor_item_alias
        name: merged_item
```

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
#### Accessing custom configurations in meta

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


## Quick hits

- v2 supports exporting traces and logs in JSONL, Parquet, and OTLP formats. For details, refer to [dbt v2 telemetry and observability](/reference/telemetry-observability).
- Data tests can now run in batches (`DBT_ENGINE_BATCH_TESTS=true`) and skip redundant cached results (`DBT_ENGINE_SKIP_REDUNDANT_TESTS=true`), reducing execution overhead on large projects.
- The v2 compiler parses and type-checks [Snowflake model function](https://docs.snowflake.com/en/guides-overview-ml-functions) calls (`model!method(...)`), accepting any arguments and treating results as `VARIANT`. Cast the result to the type you need (for example, `model!predict(col)::float`).

## Package support

import FusionPackages from '/snippets/_fusion-supported-packages.md';

<FusionPackages />

## Distributions

v2 is available in two distributions. For more information, refer to [dbt licensing](/docs/dbt-licensing).

<SimpleTable>
| Distribution | Package | Use it when |
| --- | --- | --- |
| <Constant name="fusion" /> | `dbt` | The recommended v2 experience. |
| dbt OSS | `dbt-core` | Your organization has a strict requirement to use the Apache 2.0 [open-source runtime](/docs/local/install-dbt-v2). |
</SimpleTable>

If you have a older project that isn’t ready to move to v2, continue using v1.x for compatibility. For new or upgraded projects, we recommend v2.
