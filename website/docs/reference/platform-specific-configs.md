---
title: "Platform-specific configs"
id: "platform-specific-configs"
description: "Extra settings for one data platform, and where to set them."
sidebar_label: "Platform-specific configs"
slug: /reference/resource-configs
availability: all_users
---

import DocCardList from '@theme/DocCardList';

Platform-specific configs are extra settings for one data platform. A setting changes how <Constant name="dbt" /> builds models and other resources. Set it for many resources in `dbt_project.yml`, or for one resource in a properties file or in that resource's `config()` block.

Settings that apply on every platform, such as `materialized` and `schema`, are documented in [Model configurations](/reference/model-configs).

Choose a platform below for settings such as:

- how new data is added
- how tables are stored, partitioned, clustered, or indexed
- settings that exist only on that platform

[Snowflake functions](/reference/resource-configs/snowflake-function-support) and [BigQuery functions](/reference/resource-configs/bigquery-function-support) are lists of SQL functions <Constant name="fusion" /> can check.

<DocCardList />
