---
title: "Configuring table tags"
sidebar_label: "Table tags"
description: "Use the table_tag config to apply existing Snowflake tags to tables, views, and dynamic tables."
---

<VersionBlock firstVersion="1.10">

To add tags to tables, views, and dynamic tables, use the `table_tag` config. Note, the tag must already exist in Snowflake before you apply it.

<File name='models/<modelname>.sql'>

```sql
{{ config(
    table_tag = "my_tag_name = 'my_tag_value'"
) }}

select ...

```

</File>

</VersionBlock>
