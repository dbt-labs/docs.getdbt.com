---
title: "Developing with production deferral in dbt Wizard"
id: "wizard-6-production-deferral"
description: "Configure dbt Wizard CLI to reuse production state while developing and validating a subset of a dbt project."
sidebar_label: "Develop with production deferral"
tags: [AI, Wizard]
---

<IntroText>
Configure production deferral in <Constant name="wizard" /> CLI so local development can reuse unchanged relations from another environment. Deferral reduces the number of upstream models you need to build while you investigate, edit, and validate a focused change.
</IntroText>

This workflow applies to the <Constant name="wizard" /> CLI. The <Constant name="dbt_platform" /> manages credentials and deferral for its own <Constant name="wizard" /> surfaces.

## Choose who manages deferral

<Constant name="wizard" /> stores per-project deferral settings in `~/.dbt/wizard/wizard_config.toml`. Choose the mode that matches how you already manage state.

<SimpleTable>

| `mode` | Use it when |
|---|---|
| `wizard` | You want <Constant name="wizard" /> to create and refresh a production state snapshot from a target in `profiles.yml`. |
| `manual` | You already have a directory containing the production `manifest.json` and want to provide its path. |
| `fusion_cloud` | The dbt Fusion engine and the <Constant name="dbt_platform" /> manage deferral for the connected environment. |
| `cloud_cli` | The <Constant name="platform_cli" /> manages credentials and deferral through the <Constant name="dbt_platform" />. |
| `dbt_state` | Your dbt State or run-cache workflow manages deferral, so <Constant name="wizard" /> shouldn't create its own production snapshot. |
| `disabled` | You don't want deferral for this project. |

</SimpleTable>

The configuration values use underscores. For example, use `dbt_state`, not `dbt-state`.

## Let Wizard manage production state

Use `mode = "wizard"` when your `profiles.yml` contains a target that represents the environment you want to defer to.

Add or update the project entry, replacing the path and target with your own values:

<File name='~/.dbt/wizard/wizard_config.toml'>

```toml
version = 1

[projects."/Users/you/jaffle-shop"]
path = "/Users/you/jaffle-shop/.venv/bin/dbt"

[projects."/Users/you/jaffle-shop".deferral]
mode = "wizard"
target = "prod"
favor_state = true
```

</File>

At startup, <Constant name="wizard" /> parses the production target and stores a snapshot under `target/prod-state` by default. The default snapshot time to live is 24 hours.

Configure the refresh behavior globally when your project needs different parse arguments or a different snapshot location:

<File name='~/.dbt/wizard/wizard_config.toml'>

```toml
[global]
prod_parse_on_startup = true
prod_parse_args = ["parse", "--target", "prod"]
prod_state_ttl_hours = 12
prod_state_dir = "/Users/you/.cache/dbt/prod-state"
```

</File>

If you set `global.prod_parse_args` explicitly, those arguments take precedence over the per-project `deferral.target` value.

## Use an existing state directory

Use `mode = "manual"` when another process downloads or creates the production artifacts:

<File name='~/.dbt/wizard/wizard_config.toml'>

```toml
[projects."/Users/you/jaffle-shop".deferral]
mode = "manual"
state = "/Users/you/dbt-state/production"
favor_state = true
```

</File>

The `state` directory must contain a compatible production `manifest.json`. Keep the artifacts current enough for the code and packages in your working branch.

## Decide whether to favor deferred state

`favor_state` defaults to `true`.

- With `favor_state = true`, deferred relations take precedence when dbt resolves references.
- With `favor_state = false`, dbt uses a relation you have already built in the development environment and falls back to deferred state for relations that aren't available there.

Set this value deliberately. Favoring state is useful when you need a stable production baseline. Turning it off is useful when you want downstream work to consume models you have already built in development.

For the underlying dbt behavior, refer to [`--favor-state`](/reference/node-selection/defer#favor-state).

## Start a session and confirm the plan

Restart `wizard` after editing `wizard_config.toml`, then use a prompt that makes the intended environment explicit:

```text
I am changing fct_orders. Use the configured production deferral state for
unchanged upstream models. Before running any dbt command, show me the selector,
target, state directory, and whether favor-state will be applied.
```

Before approving a command, verify that:

1. The development target receives any new or modified relations.
2. The state directory points to the intended production artifacts.
3. The selector is limited to the resources needed for the task.
4. The `--favor-state` behavior matches your choice.

Deferral changes where dbt resolves unbuilt relations. It doesn't make production a safe write target. Review the target and command before approving any build, test, or query.

## Troubleshoot deferral

<SimpleTable>

| Symptom | Check |
|---|---|
| <Constant name="wizard" /> creates an unexpected production snapshot | Confirm `mode`, `target`, and any explicit `global.prod_parse_args`. Use `manual`, `dbt_state`, or `disabled` when another system owns state. |
| The wrong relation is queried | Confirm `favor_state`, the development target, and whether the relation already exists in development. |
| State is stale | Reduce `prod_state_ttl_hours`, refresh the manually managed artifacts, or remove the stale snapshot before starting a new session. |
| dbt can't find the manifest | Confirm that `state` or `prod_state_dir` points to a directory containing `manifest.json`, not to the file itself. |
| Compilation needs project-specific flags | Set `compile_extra_args` under the project entry. Project values override global compile arguments. |
| <Constant name="wizard" /> uses the wrong profile | Configure `profile_override.path`, `profile_override.profile`, and `profile_override.target` for the project. |

</SimpleTable>

## Related docs

- [About deferral](/reference/node-selection/defer)
- [About dbt State](/docs/deploy/dbt-state-about)
- [<Constant name="wizard" /> configuration](/docs/dbt-ai/wizard-config#deferral)
- [How <Constant name="wizard" /> works](/docs/dbt-ai/wizard-how-it-works#deferral-and-state)
- [Validating dbt changes with <Constant name="wizard" />](/best-practices/how-to-use-wizard/wizard-3-validate-changes)
