---
title: "Model contracts"
sidebar_label: "Model contracts"
description: "Learn how the Trino adapter supports model contracts, currently limited to not_null constraints on supported connectors."
---

The `dbt-trino` adapter supports [model contracts](/docs/mesh/govern/model-contracts). Currently, only [constraints](/reference/resource-properties/constraints) with `type` as `not_null` are supported.
Before using `not_null` constraints in your model, make sure the underlying connector supports `not null`, to avoid running into errors.
