---
title: "Platform-specific configs"
id: "platform-specific-configs"
description: "Configs unique to one data platform."
sidebar_label: "Platform-specific configs"
slug: /reference/resource-configs
availability: all_users
---

import DocCardList from '@theme/DocCardList';

Platform-specific configs are configurations unique to a data platform. These configs may change how <Constant name="dbt" /> builds models and other resources.

Configurations applicable to every platform, such as `materialized` and `schema`, are documented in [Model configurations](/reference/model-configs).

Choose a platform for configs such as:

- How new data is added
- How tables are stored, partitioned, clustered, or indexed
- How grants, seeds, and snapshots are created

[Snowflake functions](/reference/resource-configs/snowflake-function-support) and [BigQuery functions](/reference/resource-configs/bigquery-function-support) are not platform configs. They list the SQL functions <Constant name="fusion" /> can check during [static analysis](/docs/build/about-static-analysis).

<DocCardList />
