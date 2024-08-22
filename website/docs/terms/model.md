---
id: model
title: Model
description: A model is an essential building block of the DAG
displayText: model
hoverSnippet: A model is an essential building block of the DAG
---

A model is an essential building block of the DAG that lives in a single file and contains logic that transforms data. This logic can be expressed as a SQL `select` statement or a Python dataframe operation. Models can be materialized in the warehouse in different ways &mdash; most of these [materialization](/terms/materialization) require models to be built in the warehouse. 

For more information, refer to:

* [About dbt models](/docs/build/models)
* [Quickstart guides](/guides?tags=Quickstart)
* [Model properties](/reference/model-properties)
* [Materializations](/reference/resource-configs/materialized)
