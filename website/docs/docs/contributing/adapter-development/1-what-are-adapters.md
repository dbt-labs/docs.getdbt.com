---
title: "What are adapters? Why do we need them?"
id: "1-what-are-adapters"
---

Below is a quick intro to why adapters need to exist and how they are currently constructed. For any questions you may have, don't hesitate to ask in the [#adapter-ecosystem](https://getdbt.slack.com/archives/C030A0UF5LM) Slack channel. The community is very helpful and likely has experienced a similar issue as you.

## No one ever: "Aren't all databases the same?"

There's a huge amount of work that goes into creating a database. At a high level, here's the "layers" that go into a data base (outermost inwards):
- SQL API
- Client Library / Driver
- Server Connection Manager
- Query parser
- Query optimizer
- Runtime
- Storage Access Layer
- Storage

There's a lot more there than just SQL as a language (no insult intended to Donald Chamberlain). Ultimately, the reason that databases (and later data warehouses ) are so popular, you basically abstract away a great deal of the complexity to the database itself.

Enter the radical notion that is dbt. By further abstracting and standardizing the outermost layers of a database (SQL API, client library, connection manager), into a framework, it both:
1. opens database technology to less technical users (webmaster -> web developer), and
2. enables more meaningful conversations about how data warehousing should be done.

Even if we only abstract the outermost layers, this is no easy task. Enter dbt adapters.

## What exactly needs to be adapted?

dbt "adapters" are responsible for _adapting_ dbt's "standard" functionality to a given database. For a variety of reasons, our prototypical database and adapter is PostgreSQL and dbt-postgres, and most of our adapters are somewhat based on the functionality described in dbt-postgres.

 If there's a new database with which you'd like dbt to work, chances are that you'll need to either build a new adapter, or extend an existing one.

The outermost layers of a database mentioned above map roughly to the areas in which the dbt adapter framework encapsulates inter-database differences:

### SQL API

Even amongst ANSI compliant databases, there are virtually always difference in the SQL grammar. Here's some categories and specific examples of SQL statements can be constructed differently.


| category                                     | specific area of differences                                                                     | examples                                                                                                                                                                                           |
|----------------------------------------------|--------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| statement syntax                             | the grammar of using `IF EXISTS`                                                                 | `IF <TABLE> EXISTS, DROP TABLE`<br></br>vs<br></br>`DROP <TABLE> IF EXISTS`                                                                                                                                  |
| workflow definition & semantics              | incremental updates                                                                              | `MERGE` vs. `DELETE; INSERT`                                                                                                                                                                       |
| relation and column attributes/configuration | database-specifc materialization configs           | `DIST = ROUND_ROBIN` (Synapse)<br></br>vs<br></br>`DIST = EVEN` (Redshift)                                                                                                                                   |
| permissioning                                | grant statements that can only take one grantee at a time vs those that accept lists of grantees | `grant SELECT on table hogwarts.house_pts to dumbledore, snape` <br></br> ```<br></br>grant SELECT on table hogwarts.house_pts to dumbledore<br></br>grant SELECT on table hogwarts.house_pts to snape<br></br>``` |

### Client Library & Connection Manager

The other big category of inter-database differences comes with how the client connects to the database, and executes queries against said connection. Here's a few differences that justify the abstraction.

| category                     | specific area of differences              | examples                                                                                                    |
|------------------------------|-------------------------------------------|-------------------------------------------------------------------------------------------------------------|
| credentials & authentication | authenication                             | user name & password<br></br>vs<br></br>MFA with `boto3` or Okta token                                                |
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

At the highest level: A set of *<Term id="materialization">materializations</Term>* that tell dbt how to turn model files into persisted objects in the database.

## Adapter Architecture


Below is a diagram of how dbt-postgres, the adapter at the center of dbt-core, works.

<Lightbox src="/img/adapter-guide/adapter architecture - postgres.png" title="adapter architecture diagram"/>