<File name='snapshots/<filename>.sql'>

```jinja2
{% snapshot snapshot_name %}

{% endsnapshot %}

```

</File>

## Description

The name of a snapshot, as defined in the `{% snapshot %}` block header. This name is used when selecting from a snapshot using the [`ref` function](ref)

This name must not conflict with any model names.

The name does not need to match the file name. As a result, snapshots _can_ have the same filename as a model.


## Examples
### Name a model `order_snapshot`

<File name='snapshots/orders.sql'>

```jinja2
{% snapshot orders_snapshot %}
...
{% endsnapshot %}

```

</File>


To select from this snapshot in a downstream model:

```sql
select * from {{ ref('orders_snapshot') }}
```
