---
title: Migrating from DDL, DML, and stored procedures
id: 1-migrating-from-stored-procedures
---

One of the more common situations that new dbt adopters encounter is a historical codebase of transformations written as a hodgepodge of DDL and DML statements, or stored procedures. Going from DML statements to dbt models is often a challenging hump for new users to get over, because the process involves a significant paradigm shift between a procedural flow of building a dataset (e.g. a series of DDL and DML statements) to a declarative approach to defining a dataset (e.g. how dbt uses SELECT statements to express data models). This guide aims to provide tips, tricks, and common patterns for converting DML statements to dbt models.

## Preparing to migrate

Before getting into the meat of conversion, it’s worth noting that DML statements will not always illustrate a comprehensive set of columns and column types that an original table might contain. Without knowing the DDL to create the table, it’s impossible to know precisely if your conversion effort is apples-to-apples, but you can generally get close.

If your <Term id="data-warehouse" /> supports `SHOW CREATE TABLE`, that can be a quick way to get a comprehensive set of columns you’ll want to recreate. If you don’t have the DDL, but are working on a substantial stored procedure, one approach that can work is to pull column lists out of any DML statements that modify the table, and build up a full set of the columns that appear.

As for ensuring that you have the right column types, since models materialized by dbt generally use `CREATE TABLE AS SELECT` or `CREATE VIEW AS SELECT` as the driver for object creation, tables can end up with unintended column types if the queries aren’t explicit. For example, if you care about `INT` versus `DECIMAL` versus `NUMERIC`, it’s generally going to be best to be explicit. The good news is that this is easy with dbt: you just cast the column to the type you intend.

We also generally recommend that column renaming and type casting happen as close to the source tables as possible, typically in a layer of staging transformations, which helps ensure that future dbt modelers will know where to look for those transformations! See [How we structure our dbt projects](/best-practices/how-we-structure/1-guide-overview) for more guidance on overall project structure.

### Operations we need to map

There are four primary DML statements that you are likely to have to convert to dbt operations while migrating a procedure:

- `INSERT`
- `UPDATE`
- `DELETE`
- `MERGE`

Each of these can be addressed using various techniques in dbt. Handling `MERGE`s is a bit more involved than the rest, but can be handled effectively via dbt. The first three, however, are fairly simple to convert.
