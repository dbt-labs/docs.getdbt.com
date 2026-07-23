---
title: "Macro argument validation"
id: "validate_macro_args"
sidebar_label: "validate macro args"
---



| validate_macro_args | <Constant name="dbt" /> **Latest** | <Constant name="core" /> |
|---|---|---|
| Introduced | 2025.03 | 1.10.0 |
| Matured (default → `true`) | Sep 1, 2026 | 1.12.0 |
| Removed | — | — |

<br />

dbt validates macro arguments using the `validate_macro_args` flag. Starting in <Constant name="core" /> v1.12, this flag defaults to `true`.

In the past, dbt didn't enforce a standard vocabulary for the [`type`](/reference/resource-properties/arguments#type) field on macro arguments in YAML. Because of this, the `type` field was used for documentation only, and dbt didn't check that:
- the argument names matched those in your macro
- the argument types were valid or consistent with the macro's Jinja definition

Here's an example of a documented macro:

<File name='macros/filename.yml'>

```yaml
macros:
  - name: <macro name>
    arguments:
      - name: <arg name>
        type: <string>
```

</File>

When you set the `validate_macro_args` flag to `true`, dbt will:
- Validate macro arguments during project parsing.
- Check that all argument names in your YAML match those in the macro definition.
- Raise warnings if the names or types don't match.
- Validate that the [`type` values follow the supported format](/reference/resource-properties/arguments#supported-types).
- If no arguments are documented in the YAML, infer them from the macro and include them in the [`manifest.json` file](/reference/artifacts/manifest-json).

<Expandable alt_header="When does validation occur?">

Macro argument validation runs during project parsing, not during macro execution. Any dbt command that parses the project will trigger validation if you enable the `validate_macro_args` flag.

- In <Constant name="core"/>:
  - Validation runs as part of parsing for most commands (`parse`, `build`, `run`, `test`, `seed`, `snapshot`, `compile`).
  - With a full parse, dbt validates all macros.
  - With partial parsing (the default), dbt validates only macros affected by changed files.
  - Use `--no-partial-parse` to force validation of all macros.

</Expandable>

## Impact

On its own, the flag emits warnings and builds continue. However, these warnings use the force-handled path and respect `--warn-error`, so projects with `--warn-error` set will see build failures at parse time.

This affects projects where the `arguments:` listed in a macro's YAML patch no longer match the macro's actual Jinja signature. For those projects, every command fails at parse time until you either update the YAML arguments to match the macro or remove the `arguments:` block entirely.

<Expandable alt_header="Recommended actions">

If `InvalidMacroAnnotation` warnings are appearing at parse time (or causing parse failures with `--warn-error` set), check each log line — it names the macro and the specific mismatch. In the `macros:` YAML block for each affected macro, align the `arguments:` entries with the `{% macro name(args) %}` declaration in the `.sql` file, or remove the `arguments:` block entirely.

To silence the warnings without fixing the YAML, use `warn_error_options`:

<File name='dbt_project.yml'>

```yaml
flags:
  warn_error_options:
    silence:
      - InvalidMacroAnnotation
```

</File>

To opt out of this behavior, set the flag to `false`:

<File name='dbt_project.yml'>

```yaml
flags:
  validate_macro_args: false
```

</File>

</Expandable>
