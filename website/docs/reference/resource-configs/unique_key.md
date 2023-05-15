---
resource_types: [snapshots]
description: "Unique_key - Read this in-depth guide to learn about configurations in dbt."
datatype: column_name_or_expression
---

<File name='snapshots/<filename>.sql'>

```jinja2
{{ config(
  unique_key="column_name"
) }}

```

</File>

<File name='dbt_project.yml'>

```yml
snapshots:
  [<resource-path>](/reference/resource-configs/resource-path):
    +unique_key: column_name_or_expression

```

</File>

## Description
A column name or expression that is unique for the results of a snapshot. dbt uses this to match records between a result set and an existing snapshot, so that changes can be captured correctly.

:::caution 

Providing a non-unique key will result in unexpected snapshot results. dbt **will not** test the uniqueness of this key, consider adding a test to your project to ensure that this key is indeed unique.

:::

## Default
This is a **required parameter**. No default is provided.


## Examples
### Use an `id` column as a unique key
<File name='snapshots/<filename>.sql'>

```jinja2
{{
    config(
      unique_key="id"
    )
}}

```

</File>

You can also write this in yaml. This might be a good idea if multiple snapshots share the same `unique_key` (though we prefer to apply this configuration in a config block, as above).

<File name='dbt_project.yml'>

```yml
snapshots:
  [<resource-path>](/reference/resource-configs/resource-path):
    +unique_key: id

```

</File>

### Use a combination of two columns as a unique key
This configuration accepts a valid column expression. As such, you can concatenate two columns together as a unique key if required. It's a good idea to use a separator (e.g. `'-'`) to ensure uniqueness.


<File name='snapshots/transaction_items_snapshot.sql'>

```jinja2
{% snapshot transaction_items_snapshot %}

    {{
        config(
          unique_key="transaction_id||'-'||line_item_id",
          ...
        )
    }}

select
    transaction_id||'-'||line_item_id as id,
    *
from {{ source('erp', 'transactions') }}

{% endsnapshot %}

```

</File>

Though, it's probably a better idea to construct this column in your query and use that as the `unique_key`:


<File name='snapshots/transaction_items_snapshot.sql'>

```jinja2

{% snapshot transaction_items_snapshot %}

    {{
        config(
          unique_key="id",
          ...
        )
    }}

select
    transaction_id || '-' || line_item_id as id,
    *
from {{ source('erp', 'transactions') }}

{% endsnapshot %}


```

</File>
