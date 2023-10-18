---
id: surrogate-key
title: Surrogate key
description: A surrogate key is a unique identifier derived from the data itself. It's commonly a hashed value of multiple columns that will create a unique id for each row.
displayText: surrogate key  
hoverSnippet: A surrogate key is a unique identifier derived from the data itself. It often takes the form of a hashed value of multiple columns that will create a uniqueness constraint for each row.
---

<head>
  <title>What is a surrogate key in database table? - dbt Labs</title>
</head>

A surrogate key is a unique identifier derived from the data itself. It often takes the form of a hashed value of multiple columns that will create a uniqueness constraint for each row. You will need to create a surrogate key for every table that doesn't have a natural <Term id="primary-key" />. 

Why would you ever need to make a surrogate key? Shouldn’t all tables innately just have a field that uniquely identifies each row? Now that would be too easy…

Let’s say you have a table with all license plate numbers and the state of the plate. While license plate numbers are unique to their state, there could be duplicate license plate numbers across different states. So by default, there’s no natural key that can uniquely identify each row here. In order to uniquely identify each record in this table, you could create a surrogate key based on the unique combination of license plate number and its state.

## Surrogate keys, natural keys, and primary keys oh my!

Primary keys can be established two ways: naturally or derived through the data in a surrogate key.

* A __natural key__ is a primary key that is innate to the data. Perhaps in some tables there’s a unique `id` field in each table that would act as the natural key. You can use documentation like entity relationship diagrams (ERDs) to help understand natural keys in APIs or backend application database tables. 
* A __surrogate key__ is a hashed value of multiple fields in a dataset that create a uniqueness constraint on that dataset. You’ll essentially need to make a surrogate key in every table that lacks a natural key.

:::note Note
You may also hear about primary keys being a form of a _constraint_ on a database object. Column constraints are specified in the <Term id="ddl" /> to create or alter a database object. For <Term id="data-warehouse">data warehouses</Term> that support the enforcement of primary key constraints, this means that an error would be raised if a field's uniqueness or non-nullness was broken upon an `INSERT` or `UPDATE` statement. Most modern data warehouses don’t support _and_ enforce [primary key constraints](https://docs.getdbt.com/terms/primary-key#Data-warehouse-support-for-primary-keys), so it’s important to have [automated testing](https://docs.getdbt.com/blog/primary-key-testing#how-to-test-primary-keys-with-dbt) in-place to ensure your primary keys are unique and not null.
:::

## How surrogate keys are created

In analytics engineering, you can generate surrogate keys using a hashing method of your choice. Remember, in order to truly create a uniqueness constraint on a database object, you’ll need to hash the fields together that _make each row unique_; when you generate a correct surrogate key for a dataset, you’re really establishing the true <Term id="grain" /> of that dataset.

Let’s take this to an example. Below, there is a table you pull from an ad platform that collects `calendar_date`, `ad_id`, and some performance columns.

<table>
  <tr>
   <td><b>calendar_date</b>
   </td>
   <td><b>ad_id</b>
   </td>
   <td><b>impressions</b>
   </td>
   <td><b>spend</b>
   </td>
   <td><b>clicks</b>
   </td>
   <td><b>conversions</b>
   </td>
  </tr>
  <tr>
   <td>2022-05-16
   </td>
   <td>212
   </td>
   <td>88744
   </td>
   <td>4523.00
   </td>
   <td>9432
   </td>
   <td>166
   </td>
  </tr>
  <tr>
   <td>2022-05-16
   </td>
   <td>214
   </td>
   <td>323
   </td>
   <td>6.49
   </td>
   <td>4
   </td>
   <td>0
   </td>
  </tr>
  <tr>
   <td>2022-05-05
   </td>
   <td>212
   </td>
   <td>125600
   </td>
   <td>117244.56
   </td>
   <td>17318
   </td>
   <td>56
   </td>
  </tr>
</table>


In this state, this table has no natural key that can act as a primary key. You know the grain of this table: this is showing performance for each `ad_id` per `calendar_date`. Therefore, hashing those two fields will create a uniqueness constraint on this table.

To create a surrogate key for this table using the MD5 function, run the following:

```sql
select 
	md5(calendar_date || ad_id) as unique_id,
	*
from {{ source('ad_platform', 'custom_daily_report')}}
```

After executing this, the table would now have the `unique_id` field now uniquely identifying each row.

<table>
  <tr>
   <td><b>unique_id</b>
   </td>
   <td><b>calendar_date</b>
   </td>
   <td><b>ad_id</b>
   </td>
   <td><b>impressions</b>
   </td>
   <td><b>spend</b>
   </td>
   <td><b>clicks</b>
   </td>
   <td><b>conversions</b>
   </td>
  </tr>
  <tr>
   <td>62aef884fbe3470ce7d9a92140b09b17
   </td>
   <td>2022-05-16
   </td>
   <td>212
   </td>
   <td>88744
   </td>
   <td>4523.00
   </td>
   <td>9432
   </td>
   <td>166
   </td>
  </tr>
  <tr>
   <td>ea385f7a5e560ef4d8a78f7d913927e4
   </td>
   <td>2022-05-16
   </td>
   <td>214
   </td>
   <td>323
   </td>
   <td>6.49
   </td>
   <td>4
   </td>
   <td>0
   </td>
  </tr>
  <tr>
   <td>53a33f257d1d4f2446469ac5adad1c0c
   </td>
   <td>2022-05-05
   </td>
   <td>212
   </td>
   <td>125600
   </td>
   <td>117244.56
   </td>
   <td>17318
   </td>
   <td>56
   </td>
  </tr>
</table>

## Testing surrogate keys

Amazing, you just made a surrogate key! You can just move on to the next data model, right? No!! It’s  critically important to test your surrogate keys for uniqueness and non-null values to ensure that the correct fields were chosen to create the surrogate key.

In order to test for null and unique values you can utilize code-based tests like [dbt tests](/docs/build/tests), that can check fields for nullness and uniqueness. You can additionally utilize simple SQL queries or unit tests to check if surrogate key count and non-nullness is correct.

## A note on hashing algorithms

Depending on your data warehouse, there’s several cryptographic hashing options to create surrogate keys. The primary hashing methods include MD5 or other algorithms, like HASH or SHA. Choosing the appropriate hashing function is dependent on your dataset and what your warehouse supports.

<table>
  <tr>
   <td><strong>Hashing algorithm</strong>
   </td>
   <td><strong>Bit length</strong>
   </td>
   <td><strong>Known collisions?</strong>
   </td>
  </tr>
  <tr>
   <td>HASH
   </td>
   <td>64 bits
   </td>
   <td>Yes, past ~4 billion elements
   </td>
  </tr>
  <tr>
   <td>MD5
   </td>
   <td>128 bits
   </td>
   <td>Yes, but <a href="https://stackoverflow.com/questions/201705/how-many-random-elements-before-md5-produces-collisions">incredibly unlikely</a>
   </td>
  </tr>
  <tr>
   <td>SHA256
   </td>
   <td>256 bits
   </td>
   <td>No
   </td>
  </tr>
</table>

:::note Note
A collision occurs when two pieces of data that are different end up hashing to the same value. If a collision occurs, a different hashing method should be used.
:::


## Why we like surrogate keys

Let’s keep it brief: surrogate keys allow data folks to quickly understand the grain of the database object and are compatible across many different data warehouses.


### Readability

Because surrogate keys are comprised of the fields that make a uniqueness constraint on the data, you can quickly identify the grain of the data. For example, if you see in your data model that the surrogate key field is created by hashing the `ad_id` and `calendar_date` fields, you can immediately know the true grain of the data. When you clearly understand the grain of a database object, this can make for an easier understanding of how entities join together and fan out.


### Compatibility

Making a surrogate key involves a relatively straightforward usage of SQL: maybe some coalescing, concatenation,  and a hashing method. Most, if not all, modern data warehouses support both the ability to concat, coalesce, and hash fields. They may not have the exact same syntax or hashing functions available, but their core functionality is the same.

:::tip Tip
dbt supports several macros to help data folks write DRY (don’t repeat yourself) code. The [surrogate_key macro](https://github.com/dbt-labs/dbt-utils#surrogate_key-source) helps you create surrogate keys with the MD5 function without having to worry about coalescing potentially null field values.
:::


## Performance concerns for surrogate keys

In the past, you may have seen surrogate keys take the form of <Term id="monotonically-increasing"/> integers (ex. 1, 2, 3, 4). These surrogate keys were often limited to 4-bit integers that could be indexed quickly. However, in the practice of analytics engineering, surrogate keys derived from the data often take the form of a hashed string value. Given this form, these surrogate keys are not necessarily optimized for performance for large table scans and complex joins. For large data models (millions, billions, trillions of rows) that have surrogate keys, you should materialize them as tables or [incremental models](https://docs.getdbt.com/docs/build/incremental-models) to help make joining entities more efficient.

## Conclusion

Surrogate keys are unique row identifiers that are created by using columns in a database object to create a uniqueness constraint on the data. To create a surrogate key, you will use a cryptographic algorithm usually in the form of the MD5 function to hash together fields that create a uniqueness constraint on the dataset. Ultimately, surrogate keys are a great way to create unique row identifiers for database objects that lack them naturally and allow folks to easily identify the grain of the data.

## Further reading

Want to learn more about keys, dbt, and everything in-between? Check out the following:

* [Glossary: Primary keys](https://docs.getdbt.com/terms/primary-key)
* [Generating surrogate keys across warehouses](https://docs.getdbt.com/blog/sql-surrogate-keys)
* [Generating an auto-incrementing ID in dbt](https://discourse.getdbt.com/t/generating-an-auto-incrementing-id-in-dbt/579/2)
* [The most underutilized function in SQL](https://www.getdbt.com/blog/the-most-underutilized-function-in-sql/)