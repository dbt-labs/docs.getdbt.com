---
title: "Indices"
sidebar_label: "Indices"
description: "Create indices for your table by using post-hooks that call purpose-built macros in Microsoft SQL Server."
---

You can specify indices to be created for your table by specifying post-hooks calling purpose-built macros.

The following macros are available:

* `create_clustered_index(columns, unique=False)`: columns is a list of columns, unique is an optional boolean (defaults to False).
* `create_nonclustered_index(columns, includes=columns)`: columns is a list of columns, includes is an optional list of columns to include in the index.
* `drop_all_indexes_on_table()`: drops current indices on a table. Only meaningful if the model is incremental.`

Some examples:

<File name="models/example.sql">

```sql
{{
    config({
        "as_columnstore": false,
        "materialized": 'table',
        "post-hook": [
            "{{ create_clustered_index(columns = ['row_id', 'row_id_complement'], unique=True) }}",
            "{{ create_nonclustered_index(columns = ['modified_date']) }}",
            "{{ create_nonclustered_index(columns = ['row_id'], includes = ['modified_date']) }}",
        ]
    })

}}

select *
from ...
```

</File>
