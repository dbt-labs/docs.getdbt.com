---
title: "Build your first semantic model"
id: 3-semantic-layer-build-semantic-model
description: Getting started with the dbt Semantic Layer
displayText: "dbt Cloud Semantic Layer best practices"
hoverSnippet: Learn how to get started with the dbt Semantic Layer
---

## Our first semantic model

A semantic model is the Semantic Layer equivalent to a logical layer model (what historically has just been called a 'model' in dbt land). Just as configurations for models are defined on the `models:` YAML key, configurations for semantic models are housed under `semantic models:`. A key difference is that while a logical model consists of configuration and SQL or Python code, a semantic model is defined purely via YAML. Rather than encoding a specific dataset, a semantic model describes relationships that let your end users select and refine their own datasets reliably.

- ⚙️ Semantic models are **comprised of three components**:
  - 🫂 **entities**: these describe the **relationships** between various semantic models (think ids)
  - 🪣 **dimensions**: these are the columns you want to **slice, dice, group, and filter by** (think timestamps, categories, booleans)
  - 📏 **measures**: these are the **quantitative values you want to aggregate**
- We define **columns as being an entity, dimension, or measure**.

```YAML
semantic_models:
  - name: customers
    entities:
      ...
    dimensions:
      ...
    measures:
      ...

```

## Defining customers

## Validating configs
