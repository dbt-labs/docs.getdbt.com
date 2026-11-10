---
title: "Migrate models to Lake Compute"
description: "Use the built-in dbt tools to update your models to use Lake Compute."
sidebar_label: "Lake Compute migration"
id: lake-compute-migration
---
# Lake Compute migration <Lifecycle status="private_beta" />

dbt offers and native tool to assist you in updating your dbt models to run using Lake Compute. It's currently only supported for Snowflake but more data warehouses will be supported soon. You can start the workflows by executing `dbt init lakecompute`.

## Prerequisites

- A dbt project on Snowflake running on dbt v2 (more adapter support coming soon).
- Lake Compute set up, with the `DBT_ENGINE_EXPERIMENTAL_MULTI_ADAPTER=true` [environment variable](#required-environment-variable) set.
- Data warehouse and Lake Compute credentials available to dbt.

## How migration works

The command moves a project through four steps. Each step is a mode of `dbt init lakecompute`:

1. **Check:** Compiles the project offline and sorts each model as ready, waiting on its inputs, an upstream table, or needing changes. Each blocker displays which persona needs to fix it.
2. **Size:** Reads warehouse query history, `EXPLAIN` plans, and table sizes to show which models fit in Lake Compute's memory and what each costs today. It also gives the check real column types.
3. **Switch:** Adds `adapter='lakecompute'` to the models that can move, rewrites the SQL it can translate, and converts views in the way. 
4. **Validate:** Fingerprints each table before the switch, then compares it with the Lake Compute build.

The tool translates syntax it can translate deterministically. Anything else needs a rewrite by you or an agent, which lands together with the switch.

## Migrate with an AI agent

The Lake Compute skills let an agent run the entire workflow. It will assess the project, fix blockers, switch, build, and validate. The agent runs every command itself. It asks for confirmation before any steps that reads from the data warehouse or writes files, and you can approve each command in your agent's permission prompt. If you want less involvement, use your agent's auto mode, or tell it to proceed without confirmation.

1. Install the Lake Compute skills from the [dbt-agent-skills](https://github.com/dbt-labs/dbt-agent-skills/tree/main/skills/dbt/skills) repository into your agent, following the same steps as other dbt agent skills. Claude and Cursor are supported. Codex support is coming soon.
2. Ask the agent to migrate your project. For example:

   > Move as much of this project as you can from Snowflake to Lake Compute.

3. Review the agent's plan. It runs the offline check, fixes the syntax that the tool can't translate, runs a dry run of the switch, and then asks you to confirm.
4. Confirm. The agent writes the switch, builds the models on Lake Compute, and compares each table with its Snowflake version. It then lists what's left on Snowflake.

## Migrate manually

Take a baseline so you have a comparison to validate after switching:

```bash
dbt init lake compute --baseline
```

In a terminal, run the following command to open a guided, three-step flow (check, size, switch):

```bash
dbt init lakecompute --history-days 1
```

To run each step as a command, or to use it in scripts, add `--json --quiet` for machine-readable output:

```bash
# Check the project offline and print a summary
dbt init lakecompute --json --quiet --dry-run --summary

# Size the models using Snowflake query history
dbt init lakecompute --snowflake --history-days 1 --json --quiet --yes

# Preview the switch. Remove --dry-run to write the changes.
dbt init lakecompute --switch --convert-views --dry-run

# Build the migrated models on Lake Compute
DBT_ENGINE_EXPERIMENTAL_MULTI_ADAPTER=true dbt build --target lakecompute --select config.adapter:lakecompute
```

### Validate the results

Take a baseline with `dbt init lake compute --baseline` _before_ you switch, then run `dbt init lake compute --validate` after the Lake Compute build to compare the tables. `--baseline` fingerprints only the models that can move at that time, so take it after you finish any manual fixes.

### Considerations

- `--history-days` sets how much query history the `Size` step reads. In our testing, reading 30 days of history took about 15 minutes on a large account, so start with a smaller value, such as `--history-days 1`.
- The tool works on the models it can move. It doesn't change models that use features Lake Compute doesn't support yet. Refer to [Private beta limitations](/docs/lake-compute#private-beta-limitations).