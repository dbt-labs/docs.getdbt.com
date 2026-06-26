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

## Beta limitations

Keep these limitations in mind:

### Layout rules

`dbt lint` doesn't currently issue layout (`LT*`) warnings. Layout enforcement will ship as a separate subcommand, `dbt fmt` (coming soon), which will format code to your layout policy rather than warn. This keeps lint output focused on correctness and style issues that require human intervention, while layout becomes a formatting step.

### Rules without autofix

The following rules report violations but can't be auto-fixed by `--fix`. They require reordering of SQL fragments or broader reflow that source-mapping (based on `macro_spans`) can't safely fix inside Jinja-templated SQL:

- **Aliasing:** `AL03`, `AL04`, `AL06`, `AL08`
- **References:** `RF01`, `RF02`, `RF04`, `RF05`
- **Structure:** `ST03`, `ST04`, `ST05`, `ST06`, `ST07`, `ST09`, `ST10`, `ST11`
- **Ambiguity / convention:** `AM01`, `AM06`, `CV08`, `CV09`, `CV12`

### Single fix pass

`--fix` runs a single pass; it doesn't iterate until the file is clean. A fix applied by one rule can expose a violation from another rule on the next run. For example, `AL09` removes a self-alias, which may then cause `RF02` to flag the now-unqualified reference. Re-run `dbt lint --fix` until the output is clean.

## Feedback

If you encounter unexpected behavior or have suggestions, open an issue in the [dbt-core GitHub repository](https://github.com/dbt-labs/dbt-core/issues) and apply the `Linter` label.
