---
title: "What are adapters? Why do we need them?"
id: "1-what-are-adapters"
---

Here is a quick intro as to why adapters need to exist and how they are currently constructed. For any questions you may have, don't hesitate to ask in the [#adapter-ecosystem](https://getdbt.slack.com/archives/C030A0UF5LM) Slack channel. The community is very helpful and likely has experienced a similar issue as you.

## No one ever: "Aren't all databases the same?"

There's a huge amount of work that goes into creating a database. At a high level, here's the "layers" that go into a database (outermost inwards):
- SQL API
- Client Library / Driver
- Server Connection Manager
- Query parser
- Query optimizer
- Runtime
- Storage Access Layer
- Storage

There's a lot more there than just SQL as a language (no insult intended to Donald Chamberlain). Ultimately, the reason that databases (and later data warehouses ) are so popular is that you can abstract away a great deal of the complexity from your brain to the database itself. This leaves you to focus more on the data

Enter the radical notion that is dbt. By further abstracting and standardizing the outermost layers of a database (SQL API, client library, connection manager), into a framework, it both:
1. opens database technology to less technical users (webmaster -> web developer), and
2. enables more meaningful conversations about how data warehousing should be done.

Enter dbt adapters.

## What exactly needs to be adapted?

dbt "adapters" are responsible for _adapting_ dbt's "standard" functionality to a given database. For a variety of reasons, our prototypical database and adapter is PostgreSQL and dbt-postgres, and most of our adapters are somewhat based on the functionality described in dbt-postgres.

 If there's a new database with which you'd like dbt to work, chances are that you'll need to either build a new adapter, or extend an existing one.

The outermost layers of a database mentioned above map roughly to the areas in which the dbt adapter framework encapsulates inter-database differences:

### SQL API

Even amongst ANSI compliant databases, there are virtually always differences in the SQL grammar. Here's some categories and specific examples of SQL statements that can be constructed differently.


| category                                     | specific area of differences                                                                     | examples                                                                                                                                                                                           |
|----------------------------------------------|--------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| statement syntax                             | the grammar of using `IF EXISTS`                                                                 | `IF <TABLE> EXISTS, DROP TABLE`<br></br>vs<br></br>`DROP <TABLE> IF EXISTS`                                                                                                                                  |
| workflow definition & semantics              | incremental updates                                                                              | `MERGE` vs. `DELETE; INSERT`                                                                                                                                                                       |
| relation and column attributes/configuration | database-specifc materialization configs           | `DIST = ROUND_ROBIN` (Synapse)<br></br>vs<br></br>`DIST = EVEN` (Redshift)                                                                                                                                   |
| permissioning                                | grant statements that can only take one grantee at a time vs those that accept lists of grantees | `grant SELECT on table dinner.corn to corn_kid, everyone` <br></br> <br></br>```grant SELECT on table dinner.corn to corn_kid```<br></br>```grant SELECT on table dinner.corn to everyone<br></br>``` |

### Python Client Library & Connection Manager

The other big category of inter-database differences comes with how the client connects to the database, and executes queries against said connection. In order to integrate with dbt, a data platform needs to have a pre-existing python client library, or at least support ODBC in which case a generic python library like pyodbc can be used.

| category                     | specific area of differences              | examples                                                                                                    |
|------------------------------|-------------------------------------------|-------------------------------------------------------------------------------------------------------------|
| credentials & authentication | authentication                             | username & password<br></br>vs<br></br>MFA with `boto3` or Okta token                                                |
| connection opening/closing   | create a new connection to db             | `psycopg2.connect(connection_string)`<br></br>vs<br></br>`google.cloud.bigquery.Client( ... )`                        |
| inserting local data         | load seed .`csv` files into Python memory | `Adapter.upload_file()` (BigQuery)<br></br>`INSERT ... INTO VALUES ...` prepared statement (all other databases) |


## How does dbt encapsulate and abstract these differences?

Differences between databases are encoded into discrete areas:

| Components       | Code Path                                         | Function                                                                      |
|------------------|---------------------------------------------------|-------------------------------------------------------------------------------|
| Python Classes   | `adapters/<adapter_name>`                         | Configuration (See above [Python classes](##python classes)                   |
| Macros           | `include/<adapter_name>/macros/adapters/`         | SQL API & statement syntax (e.g. how to create schema, how to get table info) |
| Materializations | `include/<adapter_name>/macros/materializations/` | table/view/snapshot/ workflow definitions                                     |
 

### Python Classes

These classes implement all the methods responsible for
1. connecting to a database and issuing queries, and
2. providing dbt with database-specific configuration information 

| Class                    | Description                                                                                                                                                                                 |
|--------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| AdapterClass             | high-level configuration type conversion and any database-specifc python methods needed                                                                                                     |
| AdapterCredentials       | typed dictionary of possible profiles and associated methods                                                                                                                                |
| AdapterConnectionManager | all the methods responsible for connecting to a database and issuing queries                                                                                                                |
| AdapterRelation          | how relation names should be rendered, printed, and/or quoted? Do relation names use all three parts?`catalog.model_name` (two-part name) or `database.schema.model_name` (three-part name) |
| AdapterColumn            | how names should be rendered, and database-specific properties                                                                                                                              |

### Macros

A set of *macros* responsible for generating SQL that is compliant with the target database.

### Materializations

At the highest level: a set of *<Term id="materialization">materializations</Term>* and their corresponding helper macros that are defined in dbt using jinja and SQL. They codify for dbt how model files should be persisted into the database (i.e. materialized).

## Adapter Architecture


Below is a diagram of how dbt-postgres, the adapter at the center of dbt-core, works.

<Lightbox src="/img/adapter-guide/adapter architecture - postgres.png" title="adapter architecture diagram"/>