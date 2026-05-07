---
title: "Connect Confluent Cloud to dbt Core"
sidebar_label: "Confluent Cloud"
id: "confluent-setup"
description: "Set up dbt Core with Confluent Cloud for Apache Flink using the dbt-confluent adapter."
meta:
  maintained_by: Confluent
  authors: "Confluent"
  github_repo: "confluentinc/dbt-confluent"
  pypi_package: "dbt-confluent"
  min_core_version: "v1.11.0"
  cloud_support: Not Supported
  min_supported_version: "n/a"
  slack_channel_name: "n/a"
  slack_channel_link: "n/a"
  platform_name: "Confluent Cloud"
  config_page: "/reference/resource-configs/confluent-configs"
---

:::info Community plugin

Some features may be limited. To contribute, refer to the source repository below.
:::

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

## Connecting to Confluent Cloud with dbt-confluent

Use the `dbt-confluent` adapter to connect to [Confluent Cloud for Apache Flink](https://docs.confluent.io/cloud/current/flink/overview.html), a fully managed stream processing service. The adapter [deploys dbt models as Flink SQL statements](https://docs.confluent.io/cloud/current/flink/operate-and-deploy/deploy-flink-dbt.html) that run continuously on Confluent Cloud.

### Prerequisites

- A [Confluent Cloud](https://confluent.cloud/) account
- A [Flink compute pool](https://docs.confluent.io/cloud/current/flink/operate-and-deploy/compute-pools.html) in your environment
- A [Flink API key](https://docs.confluent.io/cloud/current/flink/authenticate/authenticate-api-keys.html) for a service account with appropriate [RBAC permissions](https://docs.confluent.io/cloud/current/flink/operate-and-deploy/flink-rbac.html)
- Python 3.10 or later

### Installation

Install `dbt-confluent` from PyPI:

```bash
pip install dbt-confluent
```

### Configuring your profile

Add the following configuration to your `profiles.yml` file to define Confluent Cloud targets.

<File name='~/.dbt/profiles.yml'>

```yaml
my_confluent_project:
  target: dev
  outputs:
    dev:
      type: confluent
      cloud_provider: aws
      cloud_region: us-east-1
      organization_id: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
      compute_pool_id: lfcp-xxxxx
      environment_id: env-xxxxx
      dbname: my_kafka_cluster
      flink_api_key: "{{ env_var('CONFLUENT_FLINK_API_KEY') }}"
      flink_api_secret: "{{ env_var('CONFLUENT_FLINK_API_SECRET') }}"
      threads: 1
```

</File>

#### Description of profile fields

| Field | Required | Description |
|---|---|---|
| `type` | Yes | Must be set to `confluent`. |
| `cloud_provider` | Yes | The cloud provider for your Confluent Cloud environment (`aws`, `azure`, or `gcp`). |
| `cloud_region` | Yes | The cloud region for your environment (for example, `us-east-1`, `us-west-2`). |
| `organization_id` | Yes | Your Confluent Cloud organization ID (UUID format). Find this in the Confluent Cloud Console under **Settings**. |
| `compute_pool_id` | Yes | The ID of the Flink compute pool to run statements on (for example, `lfcp-xxxxx`). |
| `environment_id` | Yes | The Confluent Cloud environment ID (for example, `env-xxxxx`). Maps to the Flink SQL catalog. |
| `dbname` | Yes | The Kafka cluster name within the environment. Maps to the Flink SQL database. |
| `flink_api_key` | Yes | A Flink API key for authenticating with Confluent Cloud. Use `env_var` to avoid storing secrets in plain text. |
| `flink_api_secret` | Yes | The corresponding Flink API secret. Use `env_var` to avoid storing secrets in plain text. |
| `execution_mode` | No | Sets the default execution mode for statements. One of: `streaming_query` (default), `streaming_ddl`, `snapshot`, `snapshot_ddl`. |
| `statement_name_prefix` | No | Adds a prefix to each Flink statement name. Default: `dbt-`. |
| `statement_label` | No | Applies a label to all Flink statements so you can filter them in the Confluent Cloud Console. Default: `dbt-confluent`. |
| `threads` | No | Sets how many models dbt runs concurrently. Default: `1`. |

### Understanding Confluent Cloud concepts

In Confluent Cloud for Apache Flink, dbt concepts map to Flink SQL as follows:

| dbt concept | Confluent Cloud / Flink SQL concept |
|---|---|
| `database` (via `environment_id`) | Flink SQL catalog (Confluent Cloud environment) |
| `schema` (via `dbname`) | Flink SQL database (Kafka cluster) |
| `model` | Flink SQL statement |
| `table` | Kafka topic with a schema |

### Environment variables

Use environment variables to configure your profile, especially in CI/CD pipelines:

```bash
export CONFLUENT_FLINK_API_KEY=your-api-key
export CONFLUENT_FLINK_API_SECRET=your-api-secret
```

Then reference them in `profiles.yml` using the `env_var` Jinja function:

```yaml
flink_api_key: "{{ env_var('CONFLUENT_FLINK_API_KEY') }}"
flink_api_secret: "{{ env_var('CONFLUENT_FLINK_API_SECRET') }}"
```
