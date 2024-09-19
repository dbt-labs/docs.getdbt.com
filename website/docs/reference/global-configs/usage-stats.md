---
title: "Anonymous usage stats"
id: "usage-stats"
sidebar: "Anonymous usage stats"
---

dbt Labs is on a mission to build the best version of dbt possible, and a crucial part of that is understanding how users work with dbt. To this end, we've added some simple event tracking (or telemetry) to dbt using Snowplow. Importantly, we do not track credentials, raw model contents, or model names: we consider these private, and frankly none of our business. 

The data we collect is used for use cases such as industry identification, use-case research, improvements of sales, marketing, product features, and services. Telemetry allows users to seamlessly contribute to the continuous improvement of dbt, enabling us to better serve the data community.

Usage statistics are fired when dbt is invoked and when models are run. These events contain basic platform information (OS + Python version) and metadata such as:
- Whether the invocation succeeded.
- How long it took.
- An anonymized hash key representing the raw model content.
- Number of nodes that were run.

For full transparency, you can see all the event definitions in [`tracking.py`](https://github.com/dbt-labs/dbt-core/blob/HEAD/core/dbt/tracking.py).

- dbt Cloud has telemetry enabled by default to help us enhance the user experience and improve the product by using real user feedback and usage patterns. While it cannot be disabled, we ensure the data is [secure](https://www.getdbt.com/security) and used responsibly. Collecting this data enables us to provide a better product experience, including improvements to the performance of dbt. 

- dbt Core users have telemetry enabled by default to help us understand usage patterns and improve the product. Users can opt out of event tracking at any time by adding the following to your `profiles.yml` file:

  ```yaml
  config:
    send_anonymous_usage_stats: False
  ```

  dbt Core users can also use the `DO_NOT_TRACK` environment variable to enable or disable sending anonymous data. For more information, see [Environment variables](/docs/build/environment-variables).

  `DO_NOT_TRACK=1` is the same as `DBT_SEND_ANONYMOUS_USAGE_STATS=False`
