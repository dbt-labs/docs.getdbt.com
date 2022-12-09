---
title: "What are adapters? Why do we need them?" 
id: "1-what-are-adapters"
---

Adapters are an essential component of dbt. At their most basic level, they are how dbt Core connects with the various supported data platforms. At a higher-level, dbt Core adapters strive to give analytics engineers more transferrable skills as well as standardize how analytics projects are structured. Gone are the days where you have to learn a new language or flavor of SQL when you move to a new job that has a different data platform. That is the power of adapters in dbt Core.
 
 Navigating and developing around the nuances of different databases can be daunting, but you are not alone. Visit [#adapter-ecosystem](https://getdbt.slack.com/archives/C030A0UF5LM) Slack channel for additional help beyond the documentation.

## All databases are not the same

There's a tremendous amount of work that goes into creating a database. Here is a high-level list of typical database layers (from the outermost layer moving inwards):
- SQL API
- Client Library / Driver
- Server Connection Manager
- Query parser
- Query optimizer
- Runtime
- Storage Access Layer
- Storage

There's a lot more there than just SQL as a language. Databases (and data warehouses) are so popular because you can abstract away a great deal of the complexity from your brain to the database itself. This enables you to focus more on the data.

dbt allows for further abstraction and standardization of the outermost layers of a database (SQL API, client library, connection manager) into a framework that both:
 - Opens database technology to less technical users (a large swath of a DBA's role has been automated, similar to how the vast majority of folks with websites today no longer have to be "[webmasters](https://en.wikipedia.org/wiki/Webmaster)").
 - Enables more meaningful conversations about how data warehousing should be done.

This is where dbt adapters become critical.

## What needs to be adapted?

dbt adapters are responsible for _adapting_ dbt's standard functionality to a particular database. Our prototypical database and adapter are PostgreSQL and dbt-postgres, and most of our adapters are somewhat based on the functionality described in dbt-postgres.

Connecting dbt to a new database will require a new adapter to be built or an existing adapter to be extended.

The outermost layers of a database map roughly to the areas in which the dbt adapter framework encapsulates inter-database differences.

### SQL API

Even amongst ANSI-compliant databases, there are differences in the SQL grammar. 
Here are some categories and examples of SQL statements that can be constructed differently:


| Category                                     | Area of differences                                                                     | Examples                                                                                                                                                                                           |
|----------------------------------------------|--------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Statement syntax                             | The use of `IF EXISTS`                                                                 | <li>`IF <TABLE> EXISTS, DROP TABLE`</li><li>`DROP <TABLE> IF EXISTS`</li>                                                                                                                                  |
| Workflow definition & semantics              | Incremental updates                                                                              | <li>`MERGE`</li><li>`DELETE; INSERT`</li>                                                                                                                                                                       |
| Relation and column attributes/configuration | Database-specific materialization configs | <li>`DIST = ROUND_ROBIN` (Synapse)</li><li>`DIST = EVEN` (Redshift)</li> |
| Permissioning                                | Grant statements that can only take one grantee at a time vs those that accept lists of grantees | <li>`grant SELECT on table dinner.corn to corn_kid, everyone` </li><li>`grant SELECT on table dinner.corn to corn_kid; grant SELECT on table dinner.corn to everyone`</li> |

### Python Client Library & Connection Manager

The other big category of inter-database differences comes with how the client connects to the database and executes queries against the connection. To integrate with dbt, a data platform must have a pre-existing python client library or support ODBC, using a generic python library like pyodbc.

| Category                     | Area of differences              | Examples                                                                                                    |
|------------------------------|-------------------------------------------|-------------------------------------------------------------------------------------------------------------|
| Credentials & authentication | Authentication                             | <li>Username & password</li><li>MFA with `boto3` or Okta token</li>                                                |
| Connection opening/closing   | Create a new connection to db             |<li>`psycopg2.connect(connection_string)`</li><li>`google.cloud.bigquery.Client(...)`</li>                        |
| Inserting local data         | Load seed .`csv` files into Python memory |<li> `google.cloud.bigquery.Client.load_table_from_file(...)` (BigQuery)</li><li>`INSERT ... INTO VALUES ...` prepared statement (most other databases)</li> |


## How dbt encapsulates and abstracts these differences

Differences between databases are encoded into discrete areas:

| Components       | Code Path                                         | Function                                                                      |
|------------------|---------------------------------------------------|-------------------------------------------------------------------------------|
| Python Classes   | `adapters/<adapter_name>`                         | Configuration (See above [Python classes](##python classes)                   |
| Macros           | `include/<adapter_name>/macros/adapters/`         | SQL API & statement syntax (for example, how to create schema or how to get table info) |
| Materializations | `include/<adapter_name>/macros/materializations/` | Table/view/snapshot/ workflow definitions                                     |


### Python Classes

These classes implement all the methods responsible for:
- Connecting to a database and issuing queries.
- Providing dbt with database-specific configuration information.

| Class                    | Description                                                                                                                                                                                 |
|--------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| AdapterClass | High-level configuration type conversion and any database-specific python methods needed |
| AdapterCredentials       | Typed dictionary of possible profiles and associated methods                                                                                                                                |
| AdapterConnectionManager | All the methods responsible for connecting to a database and issuing queries                                                                                                                |
| AdapterRelation          | How relation names should be rendered, printed, and quoted. Do relation names use all three parts? `catalog.model_name` (two-part name) or `database.schema.model_name` (three-part name) |
| AdapterColumn            | How names should be rendered, and database-specific properties                                                                                                                              |

### Macros

A set of *macros* responsible for generating SQL that is compliant with the target database.

### Materializations

A set of *materializations* and their corresponding helper macros defined in dbt using jinja and SQL. They codify for dbt how model files should be persisted into the database.

## Adapter Architecture


Below is a diagram of how dbt-postgres, the adapter at the center of dbt-core, works.

<Lightbox src="/img/adapter-guide/adapter architecture - postgres.png" title="adapter architecture diagram"/>
