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

There are four entity types: 
- [Primary](#primary) &mdash; Has only one record for each row in the table and includes every record in the data platform. This key uniquely identifies each record in the table.
- [Unique](#unique) &mdash;  Contains only one record per row in the table and allows for null values. May have a subset of records in the data warehouse. 
- [Foreign](#foreign) &mdash; A field (or a set of fields) in one table that uniquely identifies a row in another table. This key establishes a link between tables.
- [Natural](#natural) &mdash; Columns or combinations of columns in a table that uniquely identify a record based on real-world data. This key is derived from actual data attributes.

:::tip Use entities as dimensions
You can also use entities as dimensions, which allows you to aggregate a metric to the granularity of that entity.
:::

## Entity types

MetricFlow's join logic depends on the entity `type` you use and determines how to join semantic models. Refer to [Joins](/docs/build/join-logic) for more info on how to construct joins.

### Primary
A primary key has _only one_ record for each row in the table and includes every record in the data platform. It must contain unique values and can't contain null values. Use the primary key to ensure that each record in the table is distinct and identifiable.

<Expandable alt_header="Primary key example">

For example, consider a table of employees with the following columns:

```sql
employee_id (primary key)
first_name
last_name
```
In this case, `employee_id` is the primary key. Each `employee_id` is unique and represents one specific employee. There can be no duplicate `employee_id` and can't be null.

</Expandable>

### Unique
A unique key contains _only one_ record per row in the table but may have a subset of records in the data warehouse. However, unlike the primary key, a unique key allows for null values. The unique key ensures that the column's values are distinct, except for null values.

<Expandable alt_header="Unique key example">

For example, consider a table of students with the following columns:

```sql
student_id (primary key)
email (unique key)
first_name
last_name
```

In this example, `email` is defined as a unique key. Each email address must be unique; however, multiple students can have null email addresses. This is because the unique key constraint allows for one or more null values, but non-null values must be unique. This then creates a set of records with unique emails (non-null) that could be a subset of the entire table, which includes all students.

</Expandable>

### Foreign
A foreign key is a field (or a set of fields) in one table that uniquely identifies a row in another table. The foreign key establishes a link between the data in two tables.
It can include zero, one, or multiple instances of the same record. It can also contain null values.

<Expandable alt_header="Foreign key example">

For example, consider you have two tables, `customers` and `orders`:

customers table:

```sql
customer_id (primary key)
customer_name
```

orders table:

```sql
order_id (primary key)
order_date
customer_id (foreign key)
```

In this example, the `customer_id` in the `orders` table is a foreign key that references the `customer_id` in the `customers` table. This link means each order is associated with a specific customer. However, not every order must have a customer; the `customer_id` in the orders table can be null or have the same `customer_id` for multiple orders.

</Expandable>

### Natural

Natural keys are columns or combinations of columns in a table that uniquely identify a record based on real-world data. For instance, if you have a `sales_person_department` dimension table, the `sales_person_id` can serve as a natural key. You can only use natural keys for [SCD type II dimensions](/docs/build/dimensions#scd-type-ii).

## Entities configuration

The following is the complete spec for entities:

<VersionBlock firstVersion="1.9">

```yaml
semantic_models:
  - name: semantic_model_name
   ..rest of the semantic model config
    entities:
      - name: entity_name  ## Required
        type: Primary, natural, foreign, or unique ## Required
        description: A description of the field or role the entity takes in this table  ## Optional
        expr: The field that denotes that entity (transaction_id).  ## Optional
              Defaults to name if unspecified.  
        [config](/reference/resource-properties/config): Specify configurations for entity.  ## Optional
          [meta](/reference/resource-configs/meta): {<dictionary>} Set metadata for a resource and organize resources. Accepts plain text, spaces, and quotes.  ## Optional
```
</VersionBlock>

<VersionBlock lastVersion="1.8">

```yaml
semantic_models:
  - name: semantic_model_name
   ..rest of the semantic model config
    entities:
      - name: entity_name     ## Required
        type: Primary, or natural, or foreign, or unique ## Required
        description: A description of the field or role the entity takes in this table ## Optional
        expr: The field that denotes that entity (transaction_id).  ## Optional
              Defaults to name if unspecified.
```
</VersionBlock>

Here's an example of how to define entities in a semantic model:

<VersionBlock firstVersion="1.9"> 

```yaml
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
    entities:
  - name: transaction
    type: 
    description: A description of the field or role the entity takes in this table ## Optional
    expr: The field that denotes that entity (transaction_id).  
          Defaults to name if unspecified.
    [config](/reference/resource-properties/config):
      [meta](/reference/resource-configs/meta):
        data_owner: "Finance team"
```
</VersionBlock>

<VersionBlock lastVersion="1.8"> 

```yaml
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
    entities:
  - name: transaction
    type: 
    description: A description of the field or role the entity takes in this table ## Optional
    expr: The field that denotes that entity (transaction_id).  
          Defaults to name if unspecified.
```
</VersionBlock>

## Combine columns with a key

If a table doesn't have any key (like a primary key), use _surrogate combination_ to form a key that will help you identify a record by combining two columns. This applies to any [entity type](/docs/build/entities#entity-types). For example, you can combine `date_key` and `brand_code` from the `raw_brand_target_weekly` table to form a _surrogate key_. The following example creates a surrogate key by joining `date_key` and `brand_code` using a pipe (`|`) as a separator.

```yaml

entities:
  - name: brand_target_key # Entity name or identified.
    type: foreign # This can be any entity type key. 
    expr: date_key || '|' || brand_code # Defines the expression for linking fields to form the surrogate key.
```
