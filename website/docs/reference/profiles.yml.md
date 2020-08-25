---

---

If you're using the dbt CLI, you'll need to set up a `profiles.yml` file.

You can learn more about this in the article on [Connecting to your warehouse](configure-your-profile).

This article lists the parts of your `profile.yml` which are _not_ database specific. Check out the article for your database for exact connection details.

<File name='profiles.yml'>

```yml
[config](#config):
  [partial_parse](#partial_parse): <true | false>
  [use_colors](#use_colors): <true | false>
  [printer_width](#printer_width): <integer>
  [send_anonymous_usage_stats](#send_anonymous_usage_stats): <true | false>

<profile-name>:
  target: <target-name>
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


## partial_parse

<File name='profiles.yml'>

```yaml

config:
  partial_parse: true

```

</File>


Partial parsing can improve the performance characteristics of dbt runs by limiting the number of files that are parsed by dbt. Here, "parsing" means reading files in a dbt project from disk and capturing `ref()` and `config()` method calls. dbt uses these method calls to determine 1) the shape of the dbt DAG and 2) the supplied configurations for dbt resources.

If partial parsing is enabled and files are unchanged between invocations of dbt, then dbt does not need to re-parse these files — it can instead use the parsed representation from the _last_ invocation of dbt. If a file *has* changed between invocations of dbt, then dbt will re-parse the file and update the parsed node cache accordingly.

Use caution when enabling partial parsing in dbt. If environment variables control the parsed representation of your project, then the logic executed by dbt may differ from the logic specified in your project. Partial parsing should only be used when all of the logic in your dbt project is encoded in the files inside of that project.

If partial parsing is enabled and `--vars` change between runs, dbt will always re-parse.

By default, `partial_parse` is set to `false`

**Usage**
To enable partial parsing for all dbt projects, specify `partial_parse: true` in your `profiles.yml` file:

```yaml
config:
  partial_parse: True
```

You can also achieve this by using the [`--partial-parse` command line flag](global-cli-flags#partial-parsing).

The value in your `profiles.yml` can be overridden with the `--partial-parse` or `--no-partial-parse` flags.

## use_colors

By default, dbt will colorize the output it prints in your terminal. You can turn this off by adding the following to your `profiles.yml` file:

<File name='profiles.yml'>

```yaml
config:
  use_colors: False
```

</File>


## printer_width

By default, dbt will print out lines padded to 80 characters wide. You can change this setting by adding the following to your `profiles.yml` file:

<File name='profiles.yml'>

```yaml
config:
  printer_width: 120
```

</File>

## send_anonymous_usage_stats

We want to build the best version of dbt possible, and a crucial part of that is understanding how users work with dbt. To this end, we've added some simple event tracking to dbt (using Snowplow). We do not track credentials, model contents or model names (we consider these private, and frankly none of our business).

Usage statistics are fired when dbt is invoked and when models are run. These events contain basic platform information (OS + python version). The schemas for these events can be seen [here](https://github.com/fishtown-analytics/dbt/tree/development/events/schemas/com.fishtownanalytics)

By default this is turned on – you can opt out of event tracking at any time by adding the following to your `profiles.yml` file:
```yaml
config:
  send_anonymous_usage_stats: False
```
