---
id: dml
title: DML
description: Data Manipulation Language (DML) is a class of SQL statements that are used to query, edit, add and delete row-level data from database tables or views.
displayText: DML  
hoverSnippet: Data Manipulation Language (DML) is a class of SQL statements that are used to query, edit, add and delete row-level data from database tables or views. The main DML statements are SELECT, INSERT, DELETE, and UPDATE. 
---

<head>
	<title>DML: The SQL statements that make the data world go 'round</title>
</head>

Data Manipulation Language (DML) is a class of SQL statements that are used to query, edit, add and delete row-level data from database <Term id="table">tables</Term> or <Term id="view">views</Term>. The main DML statements are `SELECT`, `INSERT`, `DELETE`, and `UPDATE`.

DML is contrasted with <Term id="ddl">Data Definition Language (DDL)</Term> which is a series of SQL statements that you can use to edit and manipulate the *structure* of databases and the objects in them.

Similar to DDL, DML can be a *tad* bit boring. However, DML statements are what allows analysts and analytics engineers to do their work. We hope you can use this glossary to understand when and why DML statements are used and how they may contrast with similar DDL commands.


## Types of DML Statements

The primary DML statements are `SELECT`, `INSERT`, `DELETE`, and `UPDATE`. With the exception of `SELECT` statements, all of the others are only applicable to data within tables in a database. The primary difference between `SELECT` and all the other DML statements is its impact to row-level data:

- To *change* the actual data that lives in tables, use `INSERT`, `DELETE`, and `UPDATE` statements
- To *access* the data in databse object, use `SELECT` statements

:::important Important
For the most part, the syntax for DML statements are pretty universal across [Supported Data Platforms](https://docs.getdbt.com/docs/supported-data-platforms) including Google Bigquery, Databricks, Postgres, Amazon Redshift, and Snowflake. Regardless, please use the “Further Reading” section to see the specifics on how the following DML statements would be implemented in your database of interest!
:::

### SELECT

Ah, our favorite of DML statements! This is the SQL we all know and love (most of the time). Because the `SELECT` statement allows you to access and manipulate data that exists in database objects, it makes it the true powerhouse in data analysis and analytics engineering. 

You write `SELECT` statements to create queries that build data models and perform robust analysis. With `SELECT` statements, you can join different views and tables, qualify data by setting filters, apply functions and operators on the data, and more. `SELECT` statements, unlike `INSERT`, `DELETE`, and `UPDATE`, don’t actually change the row-level value stored in the tables/views. Instead, you write `SELECT` statements to express the business logic needed to perform analysis.

All `SELECT` statements need three elements: a `SELECT` clause in the beginning, the actual field selection and manipulation, and a `FROM` statement which is specifying which database object you’re trying to access.

Here’s an example `SELECT` statement:

```sql
select

	payment_method,
	sum(amount) AS amount

from {{ ref('raw_payments') }}
group by 1
```

In this example, your selection of the `payment_method` column and summation of the `amount` column is the meat of your query. The `from {{ ref('raw_payments') }}` specifies the actual table you want to do the selecting from.

### INSERT

Using the `INSERT` DML command, you can add rows to a table that exists in your database. To be honest, data folks are rarely inserting data into tables manually with the `INSERT` command. Instead, data team members will most often use data that’s already been inserted by an <Term id="elt" /> tool or other data ingestion process.

You can insert a record [in jaffle_shop’s](https://github.com/dbt-labs/jaffle_shop) `raw_customers` table like this:

```sql
INSERT INTO raw_customers VALUES (101, 'Kira', 'F.');
```

As you can see from this example, you clearly set all the column values that exist in your `raw_customers` table. For `INSERT` statements, you can explicitly specify the values you want to insert or use a query result to set the column values.

### DELETE

The `DELETE` command will remove rows in an existing table in your database. In practice, you will usually specify a `WHERE` clause with your `DELETE` statement to only remove specific rows from a table. But, you shouldn't really ever delete rows from tables. Instead, you should apply filters on queries themselves to remove rows from your modeling or analysis.

For the most part, if you wanted to remove all existing rows in a table, but keep the underlying table structure, you would use the `TRUNCATE` DDL command. If you wanted to remove all rows and drop the entire table, you could use the `DROP` DDL command.

You can delete the record for any Henry W. in jaffle_shop’s `customers` table by executing this statement:

```sql
DELETE FROM customers WHERE first_name = 'Henry' AND last_name = 'W.';
```

### UPDATE

With the `UPDATE` statement, you can change the actual data in existing rows in a table. Unlike the `ALTER` DDL command that changes the underlying structure or naming of database objects, the `UPDATE` statement will alter the actual row-level data. You can qualify an `UPDATE` command with a `WHERE` statement to change the values of columns of only specific rows.

You can manually update the status column of an order in your orders table like this:

```sql
UPDATE orders SET status = 'returned' WHERE order_id = 7;
```

:::tip Tip
The `UPDATE` statement is often compared to the `MERGE` statement. With `MERGE` statements, you can insert, update, *and* delete records in a single command. Merges are often utilized when there is data between two tables that needs to be reconciled or updated. You'll see merges most commonly executed when a source table is updated and a downstream table needs to be updated as a result of this change. Learn more about [how dbt uses merges in incremental models here](https://docs.getdbt.com/docs/build/incremental-models#how-do-incremental-models-work-behind-the-scenes).
:::

## Conclusion

DML statements allow you to query, edit, add, and remove data stored in database objects. The primary DML commands are `SELECT`, `INSERT`, `DELETE`, and `UPDATE`. Using DML statements, you can perform powerful actions on the actual data stored in your system. You'll typically see DML `SELECT` statements written in data models to conduct data analysis or create new tables and views. In many ways, DML is the air that us data folks breathe!

## Further reading

For more resources on why people who use dbt don’t write DML, check out the following:

- [Why not write DML](/faqs/project/why-not-write-dml)
- [SQL dialect](/faqs/models/sql-dialect)

For database-specific DML documents, please check out the resources below:

- [DML in Snowflake](https://docs.snowflake.com/en/sql-reference/sql-dml.html)
- [Updating tables with DML commands in Redshift](https://docs.aws.amazon.com/redshift/latest/dg/t_Updating_tables_with_DML_commands.html)
- [DML in Google BigQuery](https://cloud.google.com/bigquery/docs/reference/standard-sql/data-manipulation-language)
- [Delta Lake DML for Databricks](https://databricks.com/blog/2020/09/29/diving-into-delta-lake-dml-internals-update-delete-merge.html)
