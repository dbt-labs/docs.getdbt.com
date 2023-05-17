---
title: Entities
id: entities
description: "Entities are real-world concepts that correspond to key parts of your business, such as customers, transactions, and ad campaigns."
sidebar_label: "Entities"
tags: [Metrics, Semantic Layer]
---

Entities are real-world concepts in a business such as customers, transactions, and ad campaigns. We often focus our analyses around specific entities, such as customer churn or annual recurring revenue modeling. We represent entities in our semantic models using id columns that serve as join keys to other semantic model in your semantic graph.

Within a semantic graph, the required parameters for an entity are `name` and `type`. The `name` refers to either the key column name from the underlying data table, or it may serve as an alias with the column name referenced in the `expr` parameter.

Entities can be specified with a single column or multiple columns to create a composite entity. Entities (join keys) in a semantic model are identified by their `name`. Each entity name must be unique within a semantic model, but it doesn't have to be unique across different semantic models.

There are four entity types: primary, foreign, unique, or natural.

:::tip Use entities as a dimension
You can also use entities as a dimension, which allows you to aggregate a metric to the granularity of that entity.
:::


## Entity types

MetricFlow's join logic depends on the entity `type` you use, and it also determines how to join semantic models. Refer to [Joins](/docs/build/join-logi) for more info on how to construct joins.

* **Primary &mdash;** A primary key has **only one** record for each row in the table, and it includes every record in the data platform.
* **Unique &mdash;** A unique key contains **only one** record per row in the table, but it may have a subset of records in the data warehouse. It can also include nulls.
* **Foreign &mdash;** A foreign key can include zero, one, or multiple instances of the same record. Null values may also be present.
* **Natural &mdash;** Natural keys are column or combination of columns in a table that uniquely identify a record based on real-world data. For instance, in a sales_person_department dimension table, the sales_person_id can serve as a natural key.

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
    expr: SUBSTRING(id_order FROM 2)
```

## Composite keys

Configure semantic models with composite keys. A composite key is a combination of two or more columns that uniquely identify an entity occurrence or a table row. To define composite keys, you can use the entities section in the semantic model, just like any other entity.

You can include primary or foreign entities in composite keys. Unique entities can't be included in a composite key. 

:::info Explicitly define composite keys

MetricFlow won't create a composite key automatically. If two semantic models have entities that match those in a composite key, MetricFlow won't assume they can be joined via the composite key unless it's explicitly defined. 

For example, if another semantic model named `users_v2` also happens to have the entities `team_id` and `id`, MetricFlow won't assume that the semantic model `users_v2` can be joined with semantic model `users` using the composite key `user_team` unless explicitly defined.

You don't have to define all the entities in the composite key beforehand. Instead, consider whether each field can stand alone as an entity or only be used as part of a composite key.
:::

<Tabs>
<TabItem value="example1" label="Example 1">

This is an example about a table called `people.users` that has information about users (`id`) and their teams (`team_id`). To uniquely identify each user-team combination, we create a composite key called `user_team` by combining the `team_id` and `id` columns. This is done in the following configuration file, which defines the entities `team_id`, `id`, and `user_team`.

```yaml
semantic_model: 
  name: users 
  description: Users and their teams 
  owners: 
    - owner@company.com 
  model: ref('people.users') 

entities: 
  - name: team_id 
    type: foreign 
  - name: id 
    type: foreign 
  - name: user_team # Composite key created 
    type: primary # Composite keys can also be foreign 
    entities: 
      - ref: team_id 
      - ref: id 

```

You can combine as many entities as needed to create a composite key. This is useful when dealing with event logs, where a combination of multiple columns such as `timestamp`, `machine_id`, and `event_type` is needed to generate a unique entity key.

</TabItem>

<TabItem value="example2" label="Example 2">

In the example semantic model users, there's a composite key called `user_message`. The composite key combines two entities: `user` and `message`, to create a new entity that uniquely identifies a row or occurrence in the table.

The entity `message` has been previously defined as a standalone entity, which means it has its own definition in the semantic model.

However, the entity `user` is defined within the composite entity `user_message`. This means that the definition of the entity `user` is only applicable within the scope of the `user_message` composite key, and can't be used outside of it.

```yaml
semantic_model: 
    name: users 
    description: Users and messages sent 
    owners: 
        - owner@company.com 
    model: ref('people.users

    entities: 
        - name: message
          expr: message_id
          type: foreign 
        - name: user_message # Composite key created 
          type: primary # Composite keys can also be foreign 
          entities: 
            - name: user 
              expr: user_id 
            - ref: message  
          type: foreign 

```
</TabItem>
</Tabs>

### Query composite keys

You can filter a composite entity by specifying each field that makes up the entity using a WHERE clause For example, if your composite entity is made up of `user_id` and `message_id`, you can run a query as follows:

```
TODO: Update syntax
mf query --metrics messages --dimensions metric_time --where "user = 10 and message = 7"
```
