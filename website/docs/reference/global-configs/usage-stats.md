---
title: "Anonymous usage stats"
id: "usage-stats"
sidebar: "Anonymous usage stats"
---

We want to build the best version of dbt possible, and a crucial part of that is understanding how users work with dbt. To this end, we've added some simple event tracking to dbt (using Snowplow). We do not track credentials, raw model contents or model names (we consider these private, and frankly none of our business). Some possible use cases for usage stats might be industry identification, use-case research, sales/marketing, product, services and/or feature improvement purposes.

Usage statistics are fired when dbt is invoked and when models are run. These events contain basic platform information (OS + python version) and metadata such as whether the invocation succeeded, how long it took, an anonymized hash key representing the raw model content, and number of nodes that were run. You can see all the event definitions in [`tracking.py`](https://github.com/dbt-labs/dbt-core/blob/HEAD/core/dbt/tracking.py).

By default, this is enabled. dbt Core users can opt out of event tracking at any time by adding the following to your `profiles.yml` file:

```yaml
config:
  send_anonymous_usage_stats: False
```

dbt Core users can also use the DO_NOT_TRACK environment variable to enable or disable sending anonymous data. For more information, see [Environment variables](/docs/build/environment-variables).

`DO_NOT_TRACK=1` is the same as `DBT_SEND_ANONYMOUS_USAGE_STATS=False`
`DO_NOT_TRACK=0` is the same as `DBT_SEND_ANONYMOUS_USAGE_STATS=True`
