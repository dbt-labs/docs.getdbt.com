---

---

If you're using the dbt CLI, you'll need to set up a `profiles.yml` file.

You can learn more about this in the article on [Connecting to your warehouse](/docs/get-started/connection-profiles).

This article lists the parts of your `profiles.yml` which are _not_ database specific. Check out the article for your database for exact connection details.

<File name='profiles.yml'>

```yml
[config](global-configs):

  [send_anonymous_usage_stats](global-configs#send_anonymous_usage_stats): <true | false>
  [use_colors](global-configs#use_colors): <true | false>
  [partial_parse](global-configs#partial_parse): <integer>
  [printer_width](global-configs#printer_width): <true | false>
  [write_json](global-configs#write_json): <true | false>
  [warn_error](global-configs#warn_error): <true | false>
  [log_format](global-configs#log_format): json
  [debug](global-configs#debug): <true | false>
  [version_check](global-configs#version_check): <true | false>
  [fail_fast](global-configs#fail_fast): <true | false>
  [use_experimental_parser](global-configs#use_experimental_parser): <true | false>
  [static_parser](global-configs#static_parser): <true | false>


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

You can set default values of global configs for all projects that you run using your local machine. See the docs on [global configs](global-configs) for details.
