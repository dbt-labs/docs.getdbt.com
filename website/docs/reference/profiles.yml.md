---

---

If you're using the dbt CLI, you'll need to set up a `profiles.yml` file.

You can learn more about this in the article on [Connecting to your warehouse](configure-your-profile).

This article lists the parts of your `profiles.yml` which are _not_ database specific. Check out the article for your database for exact connection details.

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

See the docs on [partial parsing](parsing#partial-parsing) for details on functionality. By default, `partial_parse` is set to `false`. To enable partial parsing for all dbt projects you run locally, specify `partial_parse: true` in your `profiles.yml` file:

You can also turn partial parsing on or off via [command line flags](global-cli-flags#partial-parsing). The CLI flags (`--partial-parse` or `--no-partial-parse`) will take precedence over the config set in `profiles.yml`.

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

Usage statistics are fired when dbt is invoked and when models are run. These events contain basic platform information (OS + python version). You can see all the event definitions in [`tracking.py`](https://github.com/fishtown-analytics/dbt/blob/HEAD/core/dbt/tracking.py).

By default this is turned on – you can opt out of event tracking at any time by adding the following to your `profiles.yml` file:
```yaml
config:
  send_anonymous_usage_stats: False
```
