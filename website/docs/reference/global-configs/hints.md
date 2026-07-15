---
title: "CLI hints"
id: "hints"
sidebar: "CLI hints"
---

<VersionCallout version="1.12" />

dbt surfaces occasional, non-blocking hints during command execution that point toward ways to reduce build and parse times. Hints appear as `[HINT]`-prefixed notes in the CLI output; they are informational only and never block a run.

Each hint is shown, at most, once per week per project target directory.

## Disabling hints

Hints are enabled by default. To disable them, use any of the following:

- **CLI**: `--no-hints-enabled`
- **Environment variable**: `DBT_ENGINE_HINTS_ENABLED=false`
- **Project file**: Set `hints_enabled: false` in `dbt_project.yml`:
    <File name='dbt_project.yml'>

    ```yaml
    flags:
      hints_enabled: false
    ```

    </File>

## Available hints

The following hints are available today, with plans to add more in the future. 

### Large build without state or deferral

Appears during `dbt build` when more than 100 models are selected and state or deferral (`--state`, `--defer`, `--defer-state`) is not in use. Suggests using [dbt State](/docs/deploy/dbt-state-about), [deferral](/reference/node-selection/defer), or [`dbt clone`](/reference/commands/clone) to skip unnecessary work and reuse existing results, or [node selectors](/reference/node-selection/syntax) to reduce the number of models selected.

### Long parsing without v2 parser

Appears after manifest load when parsing takes 30 seconds or longer and the [Opt-in v2 parser](/reference/global-configs/parsing#opt-in-v2-parser) is not enabled. Suggests enabling `--use-v2-parser` to reduce parse time.
