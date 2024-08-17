---
id: model
title: Model
description: A model is an essential building block of the DAG
displayText: model
hoverSnippet: A model is an essential building block of the DAG
---

A model is an essential building block of the DAG that lives in a single file and contains logic that transforms data. This logic can be expressed as a SQL `select` statement or a Python dataframe operation. Models can be materialized in the warehouse in different ways &mdash; most of these [materializations](/terms/materialization) require models to be built in the warehouse. 

For more information, see:

* [About dbt Models](/docs/build/models)
* [Quickstart Guides](/guides?tags=Quickstart)
* Reference > [Model properties](/reference/model-properties)
* Reference > [Materializations](/reference/resource-configs/materialized)
