---
title: Entities
id: entities
description: "Entities are real-world concepts that correspond to key parts of your business, such as customers, transactions, and ad campaigns."
sidebar_label: "Entities"
tags: [Metrics, Semantic Layer]
---

Entities are real-world concepts in a business such as customers, transactions, and ad campaigns. We often focus our analyses around specific entities, such as customer churn or annual recurring revenue modeling. We represent entities in our semantic models using id columns that serve as join keys to other semantic models in your semantic graph.

Within a semantic graph, the required parameters for an entity are `name` and `type`. The `name` refers to either the key column name from the underlying data table, or it may serve as an alias with the column name referenced in the `expr` parameter. The `name` for your entity must be unique to the semantic model and can not be the same as an existing `measure` or `dimension` within that same model.

Entities can be specified with a single column or multiple columns. Entities (join keys) in a semantic model are identified by their name. Each entity name must be unique within a semantic model, but it doesn't have to be unique across different semantic models. 

There are four entity types: primary, foreign, unique, or natural.

:::tip Use entities as dimensions
You can also use entities as dimensions, which allows you to aggregate a metric to the granularity of that entity.
:::

## Entity types

MetricFlow's join logic depends on the entity `type` you use, and it also determines how to join semantic models. Refer to [Joins](/docs/build/join-logic) for more info on how to construct joins.

* **Primary &mdash;** A primary key has **only one** record for each row in the table, and it includes every record in the data platform.
* **Unique &mdash;** A unique key contains **only one** record per row in the table, but it may have a subset of records in the data warehouse. It can also include nulls.
* **Foreign &mdash;** A foreign key can include zero, one, or multiple instances of the same record. Null values may also be present.
* **Natural &mdash;** Natural keys are columns or combinations of columns in a table that uniquely identify a record based on real-world data. For instance, in a sales_person_department dimension table, the sales_person_id can serve as a natural key. You can only use natural keys for [SCD type II dimensions](/docs/build/dimensions#scd-type-ii).

The following is the complete spec for entities:

```yaml
entities:
  - name: transaction     ## Required
    type: Primary or natural or foreign or unique ## Required
    description: A description of the field or role the entity takes in this table ## Optional
    expr: The field that denotes that entity (transaction_id).  ## Optional
          Defaults to name if unspecified.

```

Here's an example of how to define entities in a semantic model:

``` yaml
entities:
  - name: transaction
    type: primary
    expr: id_transaction
  - name: order
    type: foreign
    expr: id_order
  - name: user
    type: foreign
    expr: substring(id_order from 2)
```

### Combine columns with a key

If a table doesn't have any key (like a primary key), use _surrogate combination_ to form a key that will help you identify a record by combining two columns. This applies to any [entity type](/docs/build/entities#entity-types). For example, you can combine `date_key` and `brand_code` from the `raw_brand_target_weekly` table to form a _surrogate key_. The following example creates a surrogate key by joining `date_key` and `brand_code` using a pipe (`|`) as a separator. 

```yaml
entities:
  - name: brand_target_key # Entity name or identified.
    type: foreign # This can be any entity type key. 
    expr: date_key || '|' || brand_code # Defines the expression for linking fields to form the surrogate key.
```


