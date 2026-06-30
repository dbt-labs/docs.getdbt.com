---
title: "Behavior changes"
id: "behavior-changes"
sidebar: "Behavior changes"
intro_text: "Behavior change flags let you control when to adopt new runtime behaviors in dbt. They're configured in your dbt_project.yml file."
---

:::info How this relates to other changes

Since behavior change flags are different from other dbt changes, it's important to understand the difference:
- [Deprecation warnings](/reference/deprecations) &mdash; Features in your project code that will stop working (behavior flags often control when these become errors)
- [Deprecated CLI flags](/docs/dbt-versions/core-upgrade/upgrading-to-v2#deprecated-flags) &mdash; Command-line flags being removed in dbt Fusion

See the [Changes overview](/reference/changes-overview) for a quick comparison.

If you're upgrading to [dbt Fusion](/docs/dbt-versions/core-upgrade/upgrading-to-v2) or [<Constant name="core_v2" />](/docs/dbt-versions/core-upgrade/upgrading-to-v2), a subset of behavior change flags are removed and their new behavior is always enabled.

:::

## Flag lifecycle

Behavior change flags go through three phases of development:

1. **Introduction (disabled by default):** dbt adds logic to support both 'old' and 'new' behaviors. The 'new' behavior is gated behind a flag, disabled by default, preserving the old behavior.
2. **Maturity (enabled by default):** The default value of the flag is switched, from `false` to `true`, enabling the new behavior by default. Users can preserve the 'old' behavior and opt out of the 'new' behavior by setting the flag to `false` in their projects. They may see deprecation warnings when they do so.
3. **Removal (generally enabled):** After marking the flag for deprecation, we remove it along with the 'old' behavior it supported from the dbt codebases. We aim to support most flags indefinitely, but we're not committed to supporting them forever. If we choose to remove a flag, we'll offer significant advance warning.

## What is a behavior change?

The same dbt project code and the same dbt commands return one result before the behavior change, and they return a different result after the behavior change.

Examples of behavior changes:
- dbt begins raising a validation _error_ that it didn't previously.
- dbt changes the signature of a built-in macro. Your project has a custom reimplementation of that macro. This could lead to errors, because your custom reimplementation will be passed arguments it cannot accept.
- A dbt adapter renames or removes a method that was previously available on the `{{ adapter }}` object in the dbt-Jinja context.
- dbt makes a breaking change to contracted metadata artifacts by deleting a required field, changing the name or type of an existing field, or removing the default value of an existing field ([README](https://github.com/dbt-labs/dbt-core/blob/1.latest/docs/arch/7_Artifacts.md#breaking-changes)).
- dbt removes one of the fields from [structured logs](/reference/events-logging#structured-logging).

The following are **not** behavior changes:
- Fixing a bug where the previous behavior was defective, undesirable, or undocumented.
- dbt begins raising a _warning_ that it didn't previously.
- dbt updates the language of human-friendly messages in log events.
- dbt makes a non-breaking change to contracted metadata artifacts by adding a new field with a default, or deleting a field with a default ([README](https://github.com/dbt-labs/dbt-core/blob/1.latest/docs/arch/7_Artifacts.md#non-breaking-changes)).

## Behavior change flags

These flags _must_ be set in the `flags` dictionary in `dbt_project.yml`. They configure behaviors closely tied to project code, which means they should be defined in version control and modified through pull or merge requests, with the same testing and peer review.

For a complete list of all flags and their intro/maturity dates, refer to [Behavior change flag tables](/reference/global-configs/behavior-changes-tables). For documentation on each individual flag, refer to the [behavior flags reference](/reference/global-configs/behavior-flags/require_explicit_package_overrides_for_builtin_materializations).
