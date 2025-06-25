---
title: "About dbt environment command"
sidebar_label: "environment"
id: dbt-environment
---

The `dbt environment` command enables you to interact with your <Constant name="cloud" /> environment. Use the command for:

- Viewing your local configuration details (account ID, active project ID, deployment environment, and more).
- Viewing your <Constant name="cloud" /> configuration details (environment ID, environment name, connection type, and more).

This guide lists all the commands and options you can use with `dbt environment` in the [<Constant name="cloud_cli" />](/docs/cloud/cloud-cli-installation). To use them, add a command or option like this: `dbt environment [command]` or use the shorthand  `dbt env [command]`.

### dbt environment show

`show` command &mdash; To view your local and <Constant name="cloud" /> configuration details. To run the command with the <Constant name="cloud_cli" />, type one of the following commands, including the shorthand:

```shell
dbt environment show
```
```shell
dbt env show
```

The command returns the following information:

```bash
❯ dbt env show
Local Configuration:
  Active account ID              185854
  Active project ID              271692
  Active host name               cloud.getdbt.com
  dbt_cloud.yml file path        /Users/cesar/.dbt/dbt_cloud.yml
  dbt_project.yml file path      /Users/cesar/git/cloud-cli-test-project/dbt_project.yml
  <Constant name="cloud" /> CLI version          0.35.7
  OS info                        darwin arm64

Cloud Configuration:
  Account ID                     185854
  Project ID                     271692
  Project name                   Snowflake
  Environment ID                 243762
  Environment name               Development
  Defer environment ID           [N/A]
  dbt version                    1.6.0-latest
  Target name                    default
  Connection type                snowflake

Snowflake Connection Details:
  Account                        ska67070
  Warehouse                      DBT_TESTING_ALT
  Database                       DBT_TEST
  Schema                         CLOUD_CLI_TESTING
  Role                           SYSADMIN
  User                           dbt_cloud_user
  Client session keep alive      false 
```

Note, that <Constant name="cloud" /> won't return anything that is a secret key and will return an 'NA' for any field that isn't configured.

### dbt environment flags

Use the following flags (or options) with the `dbt environment` command:

- `-h`, `--help` &mdash; To view the help documentation for a specific command in your command line interface.

  ```shell 
  dbt environment [command] --help
  ```

  The `--help` flag returns the following information:

  ```bash
    ❯ dbt help environment
    Interact with dbt environments

  Usage:
    dbt environment [command]

  Aliases:
    environment, env

  Available Commands:
    show        Show the working environment

  Flags:
    -h, --help   help for environment

  Use "dbt environment [command] --help" for more information about a command.
  ```

  For example, to view the help documentation for the `show` command, type one of the following commands, including the shorthand:

  ```shell
  dbt environment show --help
  dbt env show -h
  ```
