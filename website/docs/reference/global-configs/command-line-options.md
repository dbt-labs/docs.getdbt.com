---
title: "Command line options"
id: "command-line-options"
sidebar: "Command line options"
---

For consistency, command-line interface (CLI) flags should come right after the `dbt` prefix and its subcommands. This includes "global" flags (supported for all commands). For a list of all dbt CLI flags you can set, refer to [Available flags](/reference/global-configs/about-global-configs#available-flags). When set, CLI flags override [environment variables](https://docs.getdbt.com/reference/global-configs/environment-variable-configs) and [project flags](/reference/global-configs/project-flags).

Environment variables contain a `DBT_` prefix. 

For example, instead of using:

```bash
dbt --no-populate-cache run
```

You should use:

```bash
dbt run --no-populate-cache
```

Historically, passing flags (such as "global flags") _before_ the subcommand is a legacy functionality that dbt Labs can remove at any time. We do not support using the same flag before and after the subcommand. 

## Using boolean and non-boolean flags

You can construct your commands with boolean flags to enable or disable or with non-boolean flags that use specific values, such as strings. 

<Tabs>

<TabItem value="nonboolean" label="Non-boolean config">

Use this non-boolean config structure:
- Replacing `<SUBCOMMAND>`  with the command this config applies to.
- `<THIS-CONFIG>` with the config you are enabling or disabling, and
- `<SETTING>` with the new setting for the config.

<File name='CLI flags'>


```text

<SUBCOMMAND> --<THIS-CONFIG>=<SETTING> 

```

</File>

### Example

<File name='CLI flags'>


```text

dbt run --printer-width=80 
dbt test --indirect-selection=eager

```

</File>

</TabItem>

<TabItem value="boolean" label="Boolean config">

To enable or disable boolean configs:
- Use `<SUBCOMMAND>` this config applies to.
- Followed by `--<THIS-CONFIG>` to turn it on, or `--no-<THIS-CONFIG>` to turn it off.
- Replace `<THIS-CONFIG>` with the config you are enabling or disabling


<File name='CLI flags'>


```text
dbt <SUBCOMMAND> --<THIS-CONFIG> 
dbt <SUBCOMMAND> --no-<THIS-CONFIG> 

```

</File>

### Example

<File name='CLI flags'>


```text

dbt run --version-check
dbt run --no-version-check 

```

</File>

</TabItem>

</Tabs>
