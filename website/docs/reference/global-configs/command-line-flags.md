---
title: "Command line flags"
id: "command-line-flags"
sidebar: "Command line flags"
---

For consistency, command-line interface (CLI) flags should come right after the `dbt` prefix and its subcommands. This includes "global" flags (supported for all commands). When set, CLI flags override environment variables and profile configs. 

For example, instead of using:

```bash
dbt --no-populate-cache run
```

You should use:

```bash
dbt run --no-populate-cache
```

Historically, passing flags (such as "global flags") _before_ the subcommand is a legacy functionality that dbt Labs can remove at any time. We do not support using the same flag before and after the subcommand. 

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
