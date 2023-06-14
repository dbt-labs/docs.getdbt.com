---
title: What model configurations exist?
description: "Learning about model configurations"
sidebar_label: 'Model configurations'
id: available-configurations
---
You can also configure:

* [tags](/reference/resource-configs/tags) to support easy categorization and graph selection
* [custom schemas](/reference/resource-properties/schema) to split your models across multiple schemas
* [aliases](/reference/resource-configs/alias) if your <Term id="view" />/<Term id="table" /> name should differ from the filename
* Snippets of SQL to run at the start or end of a model, known as [hooks](/docs/build/hooks-operations)
* Warehouse-specific configurations for performance (e.g. `sort` and `dist` keys on Redshift, `partitions` on BigQuery)

Check out the docs on [model configurations](/reference/model-configs) to learn more.
