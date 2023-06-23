---
title: "Command line flags"
id: "command-line-flags"
sidebar: "Command line flags"
---

Command line (CLI) flags immediately follow `dbt` and precede your subcommand. When set, CLI flags override environment variables and profile configs.

Use this non-boolean config structure, replacing  `<THIS-CONFIG>` with the config you are enabling or disabling, `<SETTING>` with the new setting for the config, and `<SUBCOMMAND>`  with the command this config applies to:

<File name='CLI flags'>


```text

$ --<THIS-CONFIG>=<SETTING> <SUBCOMMAND>

```

</File>

Non-boolean config examples:

<File name='CLI flags'>


```text

dbt --printer-width=80 run
dbt --indirect-selection=eager test

```

</File>

To turn on boolean configs, you would use the `--<THIS-CONFIG>` CLI flag, and a `--no-<THIS-CONFIG>` CLI flag to turn off boolean configs, replacing `<THIS-CONFIG>` with the config you are enabling or disabling and `<SUBCOMMAND>`  with the command this config applies to.

Boolean config structure:

<File name='CLI flags'>


```text
dbt --<THIS-CONFIG> <SUBCOMMAND>
dbt --no-<THIS-CONFIG> <SUBCOMMAND>

```

</File>

Boolean config example:

<File name='CLI flags'>


```text

dbt --version-check run
dbt --no-version-check run

```

</File>