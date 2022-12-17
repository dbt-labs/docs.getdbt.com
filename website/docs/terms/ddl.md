---
id: ddl
title: DDL
description: Data Definition Language (DDL) is a group of SQL statements that you can execute to manage database objects, including tables, views, and more.
displayText: DDL  
hoverSnippet: Data Definition Language (DDL) is a group of SQL statements that you can execute to manage database objects, including tables, views, and more.
---

<head>
	<title>What is Data Definition Language (DDL) in SQL?</title>
</head>

Data Definition Language (DDL) is a group of SQL statements that you can execute to manage database objects, including <Term id="table">tables</Term>, <Term id="view">views</Term>, and more. Using DDL statements, you can perform powerful commands in your database such as creating, modifying, and dropping objects. DDL commands are usually executed in a SQL browser or stored procedure.

DDL is contrasted with <Term id="dml">Data Manipulation Language (DML)</Term> which is the SQL that is used to actually access and manipulate data in database objects. The majority of data analysts will rarely execute DDL commands and will do the majority of their work creating DML statements to model and analyze data. 

:::note Note
Data folks don’t typically write DDL [since dbt will do it for them](https://docs.getdbt.com/docs/about/overview#:~:text=dbt%20allows%20analysts%20avoid%20writing,dbt%20takes%20care%20of%20materialization.).
:::

To be honest, DDL is definitely some of the drier content that exists out there in the greater data world. However, because DDL commands are often uncompromising and should be used with caution, it’s incredibly important to understand how they work and when they should be used. We hope you can use this page to learn about the basics, strengths, and limitations of DDL statements.

## Types of DDL Statements

DDL statements are used to create, drop, and manipulate objects in your database. They are often, but not always, unforgiving and irreversible. “With great power comes great responsibility,” is usually the first thing I think of before I execute a DDL command. We’ll highlight some of the primary DDL commands that are used by analytics engineers below.

:::important Important
The syntax for DDL commands can be pretty database-specific. We are trying to make this glossary page as generic as possible, but please use the “Further Reading” section to see the specifics on how the following DDL commands would be implemented in your database of interest!
:::

### ALTER

Using the `ALTER` DDL command, you can change an object in your database that already exists. By "change", we specifically mean you can:

- Add new, remove, and rename columns to views and tables
- Rename a view or table
- Modify the structure of a view or table
- And more!

The generic syntax to use the ALTER command is as follows:

```sql
ALTER <database object type> <database object name>;
```

To alter a table’s column, you may do something like this:

```sql
ALTER TABLE customers rename column last_name as last_initial;
```

In this example, you have to rename the `last_name` column [in jaffle_shop’s](https://github.com/dbt-labs/jaffle_shop) `customers` table to be called `last_initial`.

### DROP

The `DROP` command. Probably the most high-stakes DDL statement one can execute. One that should be used with the *utmost* of care. At its core, an executed `DROP` statement will remove that object from the <Term id="data-warehouse" />. You can drop tables, views, schemas, databases, users, functions, and more.

Some data warehouses such as Snowflake allow you to add restrictions to `DROP` statements to caution you about the impact of dropping a table, view, or schema before it’s actually dropped. In practice, we recommend you never drop raw source tables as they are often your baseline of truth. Your database user also usually needs the correct permissions to drop database objects.
 
The syntax to use the `DROP` command is as follows:

```sql
DROP <database object type> <database object name>;
```

You can drop your `customer` table like this:

```sql
DROP TABLE customers;
```

### CREATE

With the `CREATE` statement, you can create new objects in your data warehouse. The most common objects created with this statement are tables, schemas, views, and functions. Unlike `DROP`, `ALTER`, and `TRUNCATE` commands, there’s little risk with running `CREATE` statements since you can always drop what you create. 

Creating tables and views with the `CREATE` command requires a strong understanding of how you want the data structured, including column name and data type. Using the `CREATE` command to establish tables and views can be laborious and repetitive, especially if the schema objects contain many columns, but is an effective way to create new objects in a database. After you create a table, you can use DML `INSERT` statements and/or a transformation tool such as dbt to actually get data in it.

The generic syntax to use the `CREATE` command is as follows:

```sql
CREATE <database object type> <database object name>;
```

Creating a table using the `CREATE` statement may look a something like this:

```sql
CREATE TABLE prod.jaffle_shop.jaffles (
	id varchar(255),
	jaffle_name varchar(255)
	created_at timestamp,
	ingredients_list varchar(255),
	is_active boolean
);
```

Note that you had to explicitly define column names and column data type here. *You must have a strong understanding of your data’s structure when using the CREATE command for tables and views.*

### TRUNCATE

The `TRUNCATE` command will remove all rows from a table while maintaining the underlying table structure. The `TRUNCATE` command is only applicable for table objects in a database. Unlike `DROP` statements, `TRUNCATE` statements don’t remove the actual table from the database, just the data stored in them.

The syntax to use the `TRUNCATE` command is as follows:

```sql
TRUNCATE TABLE <table name>;
```

You can truncate your jaffle_shop’s `payments` table by executing this statement:

```sql
TRUNCATE TABLE payments;
```

Previously, this table was 113 rows. After executing this statement, the table is still in your database, but now has zero rows.

## Conclusion

DDL statements allow you to remove, edit, and add database objects. Some of the most common DDL statements you’ll execute include `CREATE`, `DROP`, `COMMENT`, `ALTER`, and more. DDL commands are typically executed in a SQL browser or stored procedure. Ultimately, DDL commands are all-powerful and potentially high-risk and should be used with the greatest of care. In the case of DDL, **do not** throw caution to the wind…

## Further reading

For database-specific DDL resources, check out the following:

- [DDL commands in Snowflake](https://docs.snowflake.com/en/sql-reference/sql-ddl-summary.html)
- [SQL commands in Amazon Redshift](https://docs.aws.amazon.com/redshift/latest/dg/c_SQL_commands.html) (contains DDL)
- [DDL statements in Google BigQuery](https://cloud.google.com/bigquery/docs/reference/standard-sql/data-definition-language)
- [DDL statements in Databricks](https://docs.databricks.com/sql/language-manual/index.html#ddl-statements)
- [DDL in Amazon Athena](https://docs.aws.amazon.com/athena/latest/ug/language-reference.html)
