---
title: "About profiles.yml"
id: profiles.yml
---

If you're using [dbt Core](/docs/core/installation-overview), you'll need a `profiles.yml` file that contains the connection details for your data platform. When you run dbt Core from the command line, it reads your `dbt_project.yml` file to find the `profile` name, and then looks for a profile with the same name in your `profiles.yml` file. This profile contains all the information dbt needs to connect to your data platform.

For detailed info, you can refer to the [Connection profiles](/docs/core/connect-data-platform/connection-profiles).

:::tip No `profiles.yml` file needed for dbt Cloud
If you're using dbt Cloud, you can [connect to your data platform](/docs/cloud/connect-data-platform/about-connections) directly in the dbt Cloud interface and don't need a `profiles.yml` file.
:::

This section identifies the parts of your `profiles.yml` that aren't specific to a particular data platform. For specific connection details, refer to the relevant page for your data platform.

To add an additional target (like `prod`) to your existing `profiles.yml`, you can add another entry under the `outputs` key.

<VersionBlock lastVersion="1.7">

:::warning Global configs

Starting in dbt v1.8, global configs have been deprecated from the `profiles.yml` file and should be configured in the [`dbt_project.yml`](/reference/dbt_project.yml) file instead. 

:::

<File name='profiles.yml'>

```yml
[config](/reference/global-configs/about-global-configs):
  [send_anonymous_usage_stats](/reference/global-configs/usage-stats): <true | false>
  [use_colors](/reference/global-configs/print-output#print-color): <true | false>
  [partial_parse](/reference/global-configs/parsing): <true | false>
  [printer_width](/reference/global-configs/print-output#printer-width): <integer>
  [write_json](/reference/global-configs/json-artifacts): <true | false>
  [warn_error](/reference/global-configs/warnings): <true | false>
  [warn_error_options](/reference/global-configs/warnings): <include: all | include: [<error-name>] | include: all, exclude: [<error-name>]>
  [log_format](/reference/global-configs/logs): <text | json | default>
  [debug](/reference/global-configs/logs#log-level): <true | false>
  [version_check](/reference/global-configs/version-compatibility): <true | false>
  [fail_fast](/reference/global-configs/failing-fast): <true | false>
  [indirect_selection](/reference/global-configs/indirect-selection): <eager | cautious | buildable | empty>
  [use_experimental_parser](/reference/global-configs/parsing): <true | false>
  [static_parser](/reference/global-configs/parsing): <true | false>
  [cache_selected_only](/reference/global-configs/cache): <true | false>
  [populate_cache](/reference/global-configs/cache): <true | false>

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

</VersionBlock>

<VersionBlock firstVersion="1.8">

<File name='profiles.yml'>

```yml

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

</VersionBlock>

## User config

You can set default values of global configs for all projects that you run using your local machine. Refer to [About global configs](/reference/global-configs/about-global-configs) for details.
