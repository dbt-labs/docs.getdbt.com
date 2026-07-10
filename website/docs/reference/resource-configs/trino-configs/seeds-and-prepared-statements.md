---
title: "Seeds and prepared statements"
sidebar_label: "Seeds and prepared statements"
description: "Learn how dbt seeds use prepared statements in Starburst and Trino, and how to tune batch size to avoid header limits."
---

The [dbt seed](/docs/build/seeds) command makes use of prepared statements in [Starburst](https://docs.starburst.io/latest/sql/prepare.html)/[Trino](https://trino.io/docs/current/sql/prepare.html).

Prepared statements are templated SQL statements that you can execute repeatedly with high efficiency. The values are sent in a separate field rather than hard coded in the SQL string itself. This is often how application frontends structure their record `INSERT` statements in the OLTP database backend. Because of this, it's common for prepared statements to have as many placeholder variables (parameters) as there are columns in the destination table.

Most seed files have more than one row, and often thousands of rows. This makes the size of the client request as large as there are parameters.

### Header line length limit in Python HTTP client 

You might run into an error message about header line limit if your prepared statements have too many parameters. This is because the header line limit in Python's HTTP client is `65536` bytes. 

You can avoid this upper limit by converting the large prepared statement into smaller statements. dbt already does this by batching an entire seed file into groups of rows &mdash; one group for a number of rows in the CSV. 

Let's say you have a seed file with 20 columns, 600 rows, and 12,000 parameters. Instead of creating a single prepared statement for this, you can have dbt create four prepared `INSERT` statements with 150 rows and 3,000 parameters.

There's a drawback to grouping your table rows. When there are many columns (parameters) in a seed file, the batch size needs to be very small.

For the `dbt-trino` adapter, the macro for batch size is `trino__get_batch_size()` and its default value is `1000`. To change this default behavior, you can add this macro to your dbt project:

<File name='macros/YOUR_MACRO_NAME.sql'>

```sql
{% macro trino__get_batch_size() %}
  {{ return(10000) }} -- Adjust this number as you see fit
{% endmacro %}
```

</File>

Another way to avoid the header line length limit is to set `prepared_statements_enabled` to `true` in your dbt profile; however, this is considered legacy behavior and can be removed in a future release.
