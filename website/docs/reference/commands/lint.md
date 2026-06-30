---
title: "About dbt lint command"
sidebar_label: "lint"
description: "Use dbt lint to check your SQL files for style, correctness, and convention violations using SQLFluff-compatible rules."
id: "lint"
---

# About dbt lint command <Lifecycle status="beta" />

`dbt lint` is a high-performance SQL linter built into the dbt platform. It is SQLFluff-compatible: it reads your `.sqlfluff` config, uses the same rule codes (for example, `CP01`, `RF03`), and respects `-- noqa` suppression comments.

You can use your existing SQLFluff config with minimal changes. dbt Labs intends to track the latest SQLFluff rule spec going forward.

:::note
`dbt lint` is part of the <Constant name="fusion_engine" />. It is not the same as `dbt sqlfluff lint` on the <Constant name="platform_cli" />. For SQLFluff on the platform CLI, see [Configure the dbt CLI](/docs/platform/configure-dbt-cli). [Linting in Studio IDE](/docs/platform/studio-ide/lint-format) continues to use SQLFluff at this time.
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

## Configuration

`dbt lint` auto-discovers the nearest `.sqlfluff` file in your project directory tree. CLI flags `--rules` and `--exclude-rules` take precedence over the values in the config file. To create a `.sqlfluff` file, see [SQLFluff configuration files](https://docs.sqlfluff.com/en/stable/configuration/setting_configuration.html).

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

## Beta limitations

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

<DetailsToggle alt_header="Why does dbt lint only lint one variant of Jinja-templated SQL?">

`dbt lint` always renders exactly one variant of your Jinja templates: the SQL your templates produce using the inputs available at parse time. It does not attempt to lint every possible SQL output a macro could produce under different inputs.

This is a deliberate choice. Linting every possible render variant is expensive and surfaces violations in SQL your project may never execute. dbt Labs believes linting the SQL your project produces using its parse-time inputs is the right model for dbt projects. If you have feedback on this approach, open an issue in the [dbt-core GitHub repository](https://github.com/dbt-labs/dbt-core/issues) with the `Linter` label.

</DetailsToggle>

<DetailsToggle alt_header="Why doesn't dbt lint report violations from some macros?">

`dbt lint` lints the SQL that all macros produce. However, it intentionally suppresses diagnostics for macros that would issue introspection queries if `execute` were set to `true`. Without `execute` enabled, these macros typically produce invalid SQL. Flagging violations against that output generates noise rather than signal.

This behavior is similar to SQLFluff's `ignore_templated_areas` setting. However, you can't configure it today.

</DetailsToggle>

## Feedback

If you encounter unexpected behavior or have suggestions, open an issue in the [dbt-core GitHub repository](https://github.com/dbt-labs/dbt-core/issues) and apply the `Linter` label.
