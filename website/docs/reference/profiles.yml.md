---

---

If you're using the dbt CLI, you'll need to set up a `profiles.yml` file.

You can learn more about this in the article on [Connecting to your warehouse](/docs/core/connection-profiles).

This article lists the parts of your `profiles.yml` which are _not_ database specific. Check out the article for your database for exact connection details.

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
