---
title: "About profiles.yml"
id: profiles.yml
---

If you're using dbt from the [command line (CLI)](/docs/core/about-the-cli), you'll need a `profiles.yml` file that contains the connection details for your data platform. When you run dbt from the CLI, it reads your `dbt_project.yml` file to find the `profile` name, and then looks for a profile with the same name in your `profiles.yml` file. This profile contains all the information dbt needs to connect to your data platform. 

For detailed info, you can refer to the [Connection profiles](/docs/core/connect-data-platform/connection-profiles).

:::tip No `profiles.yml` file needed for dbt Cloud
If you're using dbt Cloud, you can [connect to your data platform](/docs/cloud/connect-data-platform/about-connections) directly in the dbt Cloud interface and don't need a `profiles.yml` file.
:::


This section identifies the parts of your `profiles.yml` that aren't specific to a particular data platform. For specific connection details, refer to the relevant page for your data platform.

<File name='profiles.yml'>

```yml
[config](/reference/global-configs):
  [send_anonymous_usage_stats](/reference/global-configs#send-anonymous-usage-stats): <true | false>
  [use_colors](/reference/global-configs#use-colors): <true | false>
  [partial_parse](/reference/global-configs#partial-parsing): <true | false>
  [printer_width](/reference/global-configs#printer-width): <integer>
  [write_json](/reference/global-configs#writing-json-artifacts): <true | false>
  [warn_error](/reference/global-configs#warnings-as-errors): <true | false>
  [warn_error_options](/reference/global-configs#warnings-as-errors): <include: all | include: [<error-name>] | include: all, exclude: [<error-name>]>
  [log_format](/reference/global-configs#log-formatting): <text | json | default>
  [debug](/reference/global-configs#debug-level-logging): <true | false>
  [version_check](/reference/global-configs#checking-version-compatibility): <true | false>
  [fail_fast](/reference/global-configs#failing-fast): <true | false>
  [use_experimental_parser](/reference/global-configs#experimental-parser): <true | false>
  [static_parser](/reference/global-configs#static-parser): <true | false>

<profile-name>:
  target: <target-name> # this is the default target
  outputs:
    <target-name>:
      type: <bigquery | postgres | redshift | snowflake | other>
      schema: <schema_identifier>
      threads: <natural_number>

      ### database-specific connection details
      ...

    <target-name>: # additional targets
      ...

<profile-name>: # additional profiles
  ...

```

</File>

## User config

You can set default values of global configs for all projects that you run using your local machine. See the docs on [global configs](/reference/global-configs) for details.
