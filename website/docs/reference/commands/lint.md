---
title: "About dbt lint command"
sidebar_label: "lint"
description: "Use dbt lint to check your SQL files for style, correctness, and convention violations using your .sqlfluff config and SQLFluff rule codes."
id: "lint"
availability:
  engine: v2
---

# About dbt lint command

`dbt lint` is a fast SQL linter built into <Constant name="fusion_engine" />, available locally or in <Constant name="dbt_platform"/>. dbt lint requires v2 or later. If you're on an earlier version, [upgrade or install dbt](/docs/dbt-versions/dbt-upgrade/upgrading-to-v2?version=2).

It's SQLFluff-compatible: it reads your `.sqlfluff` config, uses the same rule codes (for example, `CP01`, `RF03`), and respects `-- noqa` suppression comments. Compatible doesn't mean identical: `dbt lint` and SQLFluff can return different results for the same file and config. Refer to [Rule parity with SQLFluff](#rule-parity-with-sqlfluff).


You can use your existing SQLFluff config with minimal changes. dbt Labs intends to track the latest SQLFluff rule spec going forward.

:::note
`dbt lint` is part of <Constant name="fusion_engine" /> and is not the same as `dbt sqlfluff lint` on the <Constant name="platform_cli" />. For SQLFluff on the platform CLI, refer to [Configure the dbt platform CLI](/docs/platform/configure-dbt-cli). [Linting in Studio IDE](/docs/platform/studio-ide/lint-format) continues to use SQLFluff.
:::

## Benchmarks

Across project sizes from 1k to 10k models, `dbt lint` runs _40×–250×_ faster than SQLFluff with all cores enabled and _280×–1500×_ faster than single-threaded SQLFluff.

dbt Labs ran these benchmarks on SQLFluff 4.2.1 against dbt projects on the Snowflake dialect, ranging from 1k to 10k models, on a MacBook Pro with a 12-core Apple M4 Pro and 24 GB of RAM.

## Usage

```shell
dbt lint [FILE] [flags]
```

`[FILE]` is optional. When you omit `[FILE]`, `dbt lint` lints all SQL files in your project.

## Flags

| Flag | Description |
|------|-------------|
| `--fix` | Automatically apply fixes for auto-fixable rule violations. See [Rules without autofix](#rules-without-autofix) for rules that cannot be fixed automatically. |
| `--config <path>` | Path to a `.sqlfluff` config file. Overrides auto-discovery. |
| `--rules` | Comma-separated list of rule codes to enable. Overrides config. |
| `--exclude-rules` | Comma-separated list of rule codes to disable. Overrides config. |
| `--changed` | Lint only files modified in the current git working tree. |
| `--format human\|json\|github-annotation` | Output format. Defaults to `human`. Use `json` for machine-readable output or `github-annotation` for GitHub Actions integration. |
| `--jinja-render-mode <mode>` | How `dbt lint` renders Jinja before linting. Accepts `symbolic` (default), `rendered`, or `turbo`. Overrides `.sqlfluff` config. Refer to [Jinja render modes](#jinja-render-modes). |

## Configuration

`dbt lint` auto-discovers the nearest `.sqlfluff` file in your project directory tree. CLI flags `--rules` and `--exclude-rules` take precedence over the values in the config file. To create a `.sqlfluff` file, see [SQLFluff configuration files](https://docs.sqlfluff.com/en/stable/configuration/setting_configuration.html).

## dbt-specific rules

Beyond the standard SQLFluff rule set, `dbt lint` adds a small set of dbt-specific rules, using the `DBT##` code prefix. Add these codes to your `.sqlfluff` file's `rules` or `exclude_rules` settings just like any other rule code.

:::note
This list is preliminary and unconfirmed. Details may change before general availability.
:::

| Code | Dotted name | Rule |
|------|-------------|------|
| `DBT01` | `dbt.import_ctes` | Every `ref()`/`source()` must be imported through a top-level CTE, not referenced inline |
| `DBT02` | `dbt.join_condition_or` | A `JOIN`'s `ON` clause must not contain `OR` |
| `DBT03` | `dbt.function_wrapped_filter_column` | A comparison must not wrap a bare column reference in a function call |
| `DBT04` | `dbt.leading_wildcard_like` | A `LIKE`/`ILIKE` pattern must not start with a wildcard |
| `DBT05` | `dbt.hard_coded_reference` | A `ref()`/`source()` must not be hard-coded to a literal string |

## Jinja render modes

Before `dbt lint` can check a model, it has to turn your Jinja-templated SQL into plain SQL. Most Jinja renders cleanly at lint time, but some macros ask your data platform a question, such as which columns a table has, and `dbt lint` never connects to your platform, so those calls have no real answer. The `jinja_render_mode` setting controls how `dbt lint` handles them, and that changes which violations you see.

Most projects should keep the default, `symbolic`. The three modes are:

| Mode | Summary |
|------|---------|
| [`symbolic` (default)](#symbolic-default) | Renders your Jinja normally and substitutes a placeholder for results it can't get from your platform. |
| [`rendered`](#rendered) | Renders your Jinja against empty stub values, with no signal that they're stand-ins. |
| [`turbo`](#turbo) | Skips execution entirely and lints your literal template text. |

### Symbolic (default)

Executes your Jinja, but tracks which values come from <Term id="introspective-adapter-call">introspective adapter calls</Term>, such as `adapter.execute`, `adapter.get_relation`, and `adapter.get_columns_in_relation`. Because those calls can't reach your warehouse at lint time, `dbt lint` replaces their output with a placeholder instead of a misleading empty value. Everything else renders normally.

Keep the default. It produces the fewest false positives on projects that use <Term id="introspective-macro">introspective macros</Term>.

For example, a model that loops over the result of an introspective call:

```jinja
{% set cols = adapter.get_columns_in_relation(ref('orders')) %}
select {{ cols | map(attribute='name') | join(', ') }}
from {{ ref('orders') }}
```

renders, for linting purposes, as something like:

```sql
select your_columns
from orders
```

`dbt lint` doesn't report violations against the placeholder value itself, but it lints everything else in the query normally.

### Rendered

Executes your Jinja against parse-time stub values. Introspective adapter calls return empty results with no signal that the values aren't real, so the same model renders as:

```sql
select
from orders
```

The empty `select` list can produce SQL your project would never run, and `dbt lint` checks that unrealistic result instead. Compare `rendered` against `symbolic` when you're investigating an unexpected violation.

### Turbo

Never executes your Jinja. It reads the template syntactically, keeps the literal SQL you wrote, and replaces every `{{ ... }}` expression with a placeholder, including ones that aren't introspective:

```sql
select your_expression
from your_expression
```

Use it when rendering is too slow or fails outright on a model. It's the fastest mode, but it can't see anything a macro generates.

### Set the render mode

Set the mode for a single run with `--jinja-render-mode`. The flag works with both `dbt lint` and `dbt format`:

```shell
dbt lint --jinja-render-mode rendered
dbt format --jinja-render-mode turbo
```

Set it for the whole project in the `[dbt]` section of your `.sqlfluff` file:

```ini
[dbt]
jinja_render_mode = rendered
```

The CLI flag takes precedence over the config file.

### Render variants

In `symbolic` and `turbo` modes, a single model can produce more than one candidate SQL output. When `dbt lint` reaches an `{% if %}` block whose condition it can't resolve, it lints more than one branch rather than guessing which one you meant. Each candidate is a _render variant_, and `dbt lint` reports the violations it finds across all of them.

`render_variant_limit` caps how many variants `dbt lint` produces per model, and defaults to `5`. Set it in the `[sqlfluff]` section of your `.sqlfluff` file:

```ini
[sqlfluff]
render_variant_limit = 10
```

Raising the limit widens coverage at the cost of lint time, because each additional variant is another render of the template. Lowering it to `1` restricts `dbt lint` to a single variant per model.

## Ignoring files and directories

Use a `.sqlfluffignore` file at your project root to exclude paths you aren't ready to lint yet, such as `dbt_packages/` or `models/legacy/`.

`.sqlfluffignore` uses `.gitignore`-style syntax. For the full pattern reference, see the [SQLFluff `.sqlfluffignore` documentation](https://docs.sqlfluff.com/en/stable/configuration.html#id2).

```
# .sqlfluffignore
dbt_packages/
models/legacy/
snapshots/
```

When you're ready to lint those paths, remove their entries from `.sqlfluffignore`.

### Reducing noise in the Studio IDE Problems tab
The Studio IDE lints SQL automatically and surfaces violations in the **Problems** tab. If you see a large number of style warnings and aren't ready to address them, add your model directories to `.sqlfluffignore` to remove those violations from the **Problems** tab immediately. Remove the ignore entries incrementally as you clean up violations.

## Suppressing violations

`dbt lint` supports the full SQLFluff suppression syntax:

| Suppression | Scope |
|-------------|-------|
| `-- noqa` | Suppress all violations on the line |
| `-- noqa: CP01, RF03` | Suppress specific rules on this line |
| `-- noqa-file` | Suppress all violations in the file |
| `-- sqlfluff:disable CP01` | Disable a rule in the file |

## Supported dialects

The following dialects are currently supported with `dbt lint`:

- Snowflake
- BigQuery
- DuckDB
- Redshift
- Databricks
- SparkSQL (currently aliased to Databricks)

Additional dialect support is coming soon.

## dbt format

`dbt format` (also available as `dbt fmt`) automatically formats your SQL files according to the layout (`LT*`) rules in your `.sqlfluff` file. Unlike `dbt lint`, it doesn't issue diagnostics. It applies fixes silently and in place when you run the command.

```shell
dbt format [FILE] [flags]
dbt fmt [FILE] [flags]
```

`[FILE]` is optional. When omitted, `dbt format` formats all SQL files in your project.

## Rule parity with SQLFluff

`dbt lint` aims for high overlap with SQLFluff, but it doesn't guarantee rule-for-rule parity, and small differences will always exist. Layout and indentation rules, such as `LT02`, are one known area of difference.

Because [linting in the <Constant name="studio_ide" />](/docs/platform/studio-ide/lint-format) still uses SQLFluff, <Constant name="studio_ide" /> **Lint file** and `dbt lint` can report different violations for the same project code. Similarly, CI jobs on a <Constant name="fusion" /> version invoke `dbt lint` instead of SQLFluff, so results from [CI jobs](/docs/deploy/continuous-integration#sql-linting) can differ from your SQLFluff results.

If you need SQLFluff behavior, you can either lint in the <Constant name="studio_ide" />, which continues to run SQLFluff, or run SQLFluff locally using the standalone <Constant name="core" /> engine templater. Refer to [<Constant name="fusion" /> limitations](/docs/dbt/supported-features#limitations) for more information.

## Limitations

Keep these limitations in mind:

### Rules without autofix

The following rules report violations but can't be auto-fixed by `--fix`. They require reordering of SQL fragments or broader reflow that source-mapping (based on `macro_spans`) can't safely fix inside Jinja-templated SQL:

- **Aliasing:** `AL03`, `AL04`, `AL06`, `AL08`
- **References:** `RF01`, `RF02`, `RF04`, `RF05`
- **Structure:** `ST03`, `ST04`, `ST05`, `ST06`, `ST07`, `ST09`, `ST10`, `ST11`
- **Ambiguity / convention:** `AM01`, `AM06`, `CV08`, `CV09`, `CV12`

### Single fix pass

`--fix` runs a single pass; it doesn't iterate until the file is clean. A fix applied by one rule can expose a violation from another rule on the next run. For example, `AL09` removes a self-alias, which may then cause `RF02` to flag the now-unqualified reference. Re-run `dbt lint --fix` until the output is clean.


## FAQs

<DetailsToggle alt_header="Why doesn't dbt lint check every possible output of my Jinja?">

`dbt lint` lints a bounded set of [render variants](#render-variants) per model, not every SQL output your macros could produce under every combination of inputs.

This is a deliberate choice. The number of possible outputs grows combinatorially with the number of unresolved conditions in a template, so linting all of them is expensive and surfaces violations in SQL your project might never execute. Instead, `dbt lint` varies one unresolved condition at a time, up to `render_variant_limit`.

Keep one consequence in mind: when `dbt lint` explores a branch your project never takes, it can surface a violation from that unused path, most often inside a third-party package macro. If you have feedback on this approach, open an issue in the [dbt-core GitHub repository](https://github.com/dbt-labs/dbt/issues) with the `Linter` label.

</DetailsToggle>

<DetailsToggle alt_header="Why doesn't dbt lint report violations from some macros?">

`dbt lint` lints the SQL that all macros produce, but it can't resolve macros that depend on querying your warehouse. Introspective adapter calls, such as `adapter.execute` and `adapter.get_columns_in_relation`, have no real result at lint time.

How `dbt lint` handles that depends on your [render mode](#jinja-render-modes). In the default `symbolic` mode, `dbt lint` substitutes a placeholder wherever an introspective result would appear and doesn't report violations against that placeholder, because flagging fabricated output generates noise rather than signal. The rest of the macro still lints normally.

This behavior is similar to SQLFluff's `ignore_templated_areas` setting.

</DetailsToggle>

## Feedback

If you encounter unexpected behavior or have suggestions, open an issue in the [dbt-labs/dbt GitHub repository](https://github.com/dbt-labs/dbt/issues) and apply the `Linter` label.
