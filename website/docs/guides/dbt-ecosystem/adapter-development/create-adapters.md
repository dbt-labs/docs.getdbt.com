---
title: "Build, test, document, and promote adapters" 
id: "adapter-creation"
hoverSnippet: Learn how to 
# time_to_complete: '30 minutes' commenting out until we test
icon: 'guides'
hide_table_of_contents: true
tags: ['Adapter creation']
level: 'Advanced'
recently_updated: true
---

## Introduction

Adapters are an essential component of dbt. At their most basic level, they are how dbt Core connects with the various supported data platforms. At a higher-level, dbt Core adapters strive to give analytics engineers more transferrable skills as well as standardize how analytics projects are structured. Gone are the days where you have to learn a new language or flavor of SQL when you move to a new job that has a different data platform. That is the power of adapters in dbt Core.
 
 Navigating and developing around the nuances of different databases can be daunting, but you are not alone. Visit [#adapter-ecosystem](https://getdbt.slack.com/archives/C030A0UF5LM) Slack channel for additional help beyond the documentation.

### All databases are not the same

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

### What needs to be adapted?

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


### How dbt encapsulates and abstracts these differences

Differences between databases are encoded into discrete areas:

| Components       | Code Path                                         | Function                                                                      |
|------------------|---------------------------------------------------|-------------------------------------------------------------------------------|
| Python Classes   | `adapters/<adapter_name>`                         | Configuration (See above [Python classes](##python classes)                   |
| Macros           | `include/<adapter_name>/macros/adapters/`         | SQL API & statement syntax (for example, how to create schema or how to get table info) |
| Materializations | `include/<adapter_name>/macros/materializations/` | Table/view/snapshot/ workflow definitions                                     |


#### Python Classes

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

#### Macros

A set of *macros* responsible for generating SQL that is compliant with the target database.

#### Materializations

A set of *materializations* and their corresponding helper macros defined in dbt using jinja and SQL. They codify for dbt how model files should be persisted into the database.

### Adapter Architecture


Below is a diagram of how dbt-postgres, the adapter at the center of dbt-core, works.

<Lightbox src="/img/adapter-guide/adapter architecture - postgres.png" title="adapter architecture diagram"/>

## Prerequisites

It is very important that you have the right skills, and understand the level of difficulty required to make an adapter for your data platform.

The more you can answer Yes to the below questions, the easier your adapter development (and user-) experience will be. See the [New Adapter Information Sheet wiki](https://github.com/dbt-labs/dbt-core/wiki/New-Adapter-Information-Sheet) for even more specific questions.

### Training

- the developer (and any product managers) ideally will have substantial experience as an end-user of dbt. If not, it is highly advised that you at least take the [dbt Fundamentals](https://courses.getdbt.com/courses/fundamentals) and [Advanced Materializations](https://courses.getdbt.com/courses/advanced-materializations) course.

### Database

- Does the database complete transactions fast enough for interactive development?
- Can you execute SQL against the data platform?
- Is there a concept of schemas?
- Does the data platform support ANSI SQL, or at least a subset?

### Driver / Connection Library

- Is there a Python-based driver for interacting with the database that is db API 2.0 compliant (e.g. Psycopg2 for Postgres, pyodbc for SQL Server)
- Does it support: prepared statements, multiple statements, or single sign on token authorization to the data platform?

### Open source software

- Does your organization have an established process for publishing open source software?

It is easiest to build an adapter for dbt when the following the <Term id="data-warehouse" />/platform in question has:

- a conventional ANSI-SQL interface (or as close to it as possible),
- a mature connection library/SDK that uses ODBC or Python DB 2 API, and
- a way to enable developers to iterate rapidly with both quick reads and writes

### Maintaining your new adapter

When your adapter becomes more popular, and people start using it, you may quickly become the maintainer of an increasingly popular open source project. With this new role, comes some unexpected responsibilities that not only include code maintenance, but also working with a community of users and contributors. To help people understand what to expect of your project, you should communicate your intentions early and often in your adapter documentation or README. Answer questions like, Is this experimental work that people should use at their own risk? Or is this production-grade code that you're committed to maintaining into the future?

#### Keeping the code compatible with dbt Core

New minor version releases of `dbt-core` may include changes to the Python interface for adapter plugins, as well as new or updated test cases. The maintainers of `dbt-core` will clearly communicate these changes in documentation and release notes, and they will aim for backwards compatibility whenever possible.

Patch releases of `dbt-core` will _not_ include breaking changes to adapter-facing code. For more details, see ["About dbt Core versions"](/docs/dbt-versions/core).

#### Versioning and releasing your adapter

We strongly encourage you to adopt the following approach when versioning and releasing your plugin:

- The minor version of your plugin should match the minor version in `dbt-core` (e.g. 1.1.x).
- Aim to release a new version of your plugin for each new minor version of `dbt-core` (once every three months).
- While your plugin is new, and you're iterating on features, aim to offer backwards compatibility and deprecation notices for at least one minor version. As your plugin matures, aim to leave backwards compatibility and deprecation notices in place until the next major version (dbt Core v2).
- Release patch versions of your plugins whenever needed. These patch releases should contain fixes _only_.

## Building a new adapter

This step will walk you through the first creating the necessary adapter classes and macros, and provide some resources to help you validate that your new adapter is working correctly. Make sure you've familiarized yourself with the previous steps in this guide.

Once the adapter is passing most of the functional tests (see ["Testing a new adapter"](4-testing-a-new-adapter)
), please let the community know that is available to use by adding the adapter to the ["Supported Data Platforms"](/docs/supported-data-platforms) page by following the steps given in [Documenting your adapter](/guides/dbt-ecosystem/adapter-development/5-documenting-a-new-adapter).

For any questions you may have, don't hesitate to ask in the [#adapter-ecosystem](https://getdbt.slack.com/archives/C030A0UF5LM) Slack channel. The community is very helpful and likely has experienced a similar issue as you.

### Scaffolding a new adapter

 To create a new adapter plugin from scratch, you can use the [dbt-database-adapter-scaffold](https://github.com/dbt-labs/dbt-database-adapter-scaffold) to trigger an interactive session which will generate a scaffolding for you to build upon.

    Example usage:

    ```
    $ cookiecutter gh:dbt-labs/dbt-database-adapter-scaffold
    ```

The generated boilerplate starting project will include a basic adapter plugin file structure, examples of macros, high level method descriptions, etc.

One of the most important choices you will make during the cookiecutter generation will revolve around the field for `is_sql_adapter` which is a boolean used to correctly apply imports for either a `SQLAdapter` or `BaseAdapter`. Knowing which you will need requires a deeper knowledge of your selected database but a few good guides for the choice are.

- Does your database have a complete SQL API? Can it perform tasks using SQL such as creating schemas, dropping schemas, querying an `information_schema` for metadata calls? If so, it is more likely to be a SQLAdapter where you set `is_sql_adapter` to `True`.
- Most adapters do fall under SQL adapters which is why we chose it as the default `True` value.
- It is very possible to build out a fully functional `BaseAdapter`. This will require a little more ground work as it doesn't come with some prebuilt methods the `SQLAdapter` class provides. See `dbt-bigquery` as a good guide.

### Implementation Details

Regardless if you decide to use the cookiecutter template or manually create the plugin, this section will go over each method that is required to be implemented. The table below provides a high-level overview of the classes, methods, and macros you may have to define for your data platform.

| file                                              | component                                                         | purpose                                                                                                                                                                               |
|---------------------------------------------------|-------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `./setup.py`                                      | `setup()` function                                                | adapter meta-data (package name, version, author, homepage, etc)                                                                                                                      |
| `myadapter/dbt/adapters/myadapter/__init__.py`    | `AdapterPlugin`                                                   | bundle all the information below into a dbt plugin                                                                                                                                    |
| `myadapter/dbt/adapters/myadapter/connections.py` | `MyAdapterCredentials` class                                      | parameters to connect to and configure the database, via a the chosen Python driver                                                                                                   |
| `myadapter/dbt/adapters/myadapter/connections.py` | `MyAdapterConnectionManager` class                                | telling dbt how to interact with the database w.r.t opening/closing connections, executing queries, and fetching data. Effectively a wrapper around the db API or driver.             |
| `myadapter/dbt/include/bigquery/`                 | a dbt project of macro "overrides" in the format of "myadapter__" | any differences in SQL syntax for regular db operations will be modified here from the global_project (e.g. "Create Table As Select", "Get all relations in the current schema", etc) |
| `myadapter/dbt/adapters/myadapter/impl.py`        | `MyAdapterConfig`                                                 | database- and relation-level configs and                                                                                                                                              |
| `myadapter/dbt/adapters/myadapter/impl.py`        | `MyAdapterAdapter`                                                | for changing _how_ dbt performs operations like macros and other needed Python functionality                                                                                          |
| `myadapter/dbt/adapters/myadapter/column.py`      | `MyAdapterColumn`                                                 | for defining database-specific column such as datatype mappings                                                                                                                       |

### Editing `setup.py`

Edit the file at `myadapter/setup.py` and fill in the missing information.

You can skip this step if you passed the arguments for `email`, `url`, `author`, and `dependencies` to the cookiecutter template script. If you plan on having nested macro folder structures, you may need to add entries to `package_data` so your macro source files get installed.

### Editing the connection manager

Edit the connection manager at `myadapter/dbt/adapters/myadapter/connections.py`. This file is defined in the sections below.

#### The Credentials class

The credentials class defines all of the database-specific credentials (e.g. `username` and `password`) that users will need in the [connection profile](/docs/supported-data-platforms) for your new adapter. Each credentials contract should subclass dbt.adapters.base.Credentials, and be implemented as a python dataclass.

Note that the base class includes required database and schema fields, as dbt uses those values internally.

For example, if your adapter requires a host, integer port, username string, and password string, but host is the only required field, you'd add definitions for those new properties to the class as types, like this:

<File name='connections.py'>

```python

from dataclasses import dataclass
from typing import Optional

from dbt.adapters.base import Credentials


@dataclass
class MyAdapterCredentials(Credentials):
    host: str
    port: int = 1337
    username: Optional[str] = None
    password: Optional[str] = None

    @property
    def type(self):
        return 'myadapter'

    @property
    def unique_field(self):
        """
        Hashed and included in anonymous telemetry to track adapter adoption.
        Pick a field that can uniquely identify one team/organization building with this adapter
        """
        return self.host

    def _connection_keys(self):
        """
        List of keys to display in the `dbt debug` output.
        """
        return ('host', 'port', 'database', 'username')
```

</File>

There are a few things you can do to make it easier for users when connecting to your database:

- Be sure to implement the Credentials' `_connection_keys` method shown above. This method will return the keys that should be displayed in the output of the `dbt debug` command. As a general rule, it's good to return all the arguments used in connecting to the actual database except the password (even optional arguments).
- Create a `profile_template.yml` to enable configuration prompts for a brand-new user setting up a connection profile via the [`dbt init` command](/reference/commands/init). See more details [below](#other-files).
- You may also want to define an `ALIASES` mapping on your Credentials class to include any config names you want users to be able to use in place of 'database' or 'schema'. For example if everyone using the MyAdapter database calls their databases "collections", you might do:

<File name='connections.py'>

```python
@dataclass
class MyAdapterCredentials(Credentials):
    host: str
    port: int = 1337
    username: Optional[str] = None
    password: Optional[str] = None

    ALIASES = {
        'collection': 'database',
    }
```

</File>

Then users can use `collection` OR `database` in their `profiles.yml`, `dbt_project.yml`, or `config()` calls to set the database.

#### `ConnectionManager` class methods

Once credentials are configured, you'll need to implement some connection-oriented methods. They are enumerated in the SQLConnectionManager docstring, but an overview will also be provided here.

**Methods to implement:**

- `open`
- `get_response`
- `cancel`
- `exception_handler`
- `standardize_grants_dict`

##### `open(cls, connection)`

`open()` is a classmethod that gets a connection object (which could be in any state, but will have a `Credentials` object with the attributes you defined above) and moves it to the 'open' state.

Generally this means doing the following:
    - if the connection is open already, log and return it.
        - If a database needed changes to the underlying connection before re-use, that would happen here
    - create a connection handle using the underlying database library using the credentials
        - on success:
            - set connection.state to `'open'`
            - set connection.handle to the handle object
                - this is what must have a `cursor()` method that returns a cursor!
        - on error:
            - set connection.state to `'fail'`
            - set connection.handle to `None`
            - raise a `dbt.exceptions.FailedToConnectException` with the error and any other relevant information

For example:

<File name='connections.py'>

```python
    @classmethod
    def open(cls, connection):
        if connection.state == 'open':
            logger.debug('Connection is already open, skipping open.')
            return connection

        credentials = connection.credentials

        try:
            handle = myadapter_library.connect(
                host=credentials.host,
                port=credentials.port,
                username=credentials.username,
                password=credentials.password,
                catalog=credentials.database
            )
            connection.state = 'open'
            connection.handle = handle
        return connection
```

</File>

##### `get_response(cls, cursor)`

`get_response` is a classmethod that gets a cursor object and returns adapter-specific information about the last executed command. The return value should be an `AdapterResponse` object that includes items such as `code`, `rows_affected`, `bytes_processed`, and a summary `_message` for logging to stdout.

<File name='connections.py'>

```python
    @classmethod
    def get_response(cls, cursor) -> AdapterResponse:
        code = cursor.sqlstate or "OK"
        rows = cursor.rowcount
        status_message = f"{code} {rows}"
        return AdapterResponse(
            _message=status_message,
            code=code,
            rows_affected=rows
        )
```

</File>

##### `cancel(self, connection)`

`cancel` is an instance method that gets a connection object and attempts to cancel any ongoing queries, which is database dependent. Some databases don't support the concept of cancellation, they can simply implement it via 'pass' and their adapter classes should implement an `is_cancelable` that returns False - On ctrl+c connections may remain running. This method must be implemented carefully, as the affected connection will likely be in use in a different thread.

<File name='connections.py'>

```python
    def cancel(self, connection):
        tid = connection.handle.transaction_id()
        sql = 'select cancel_transaction({})'.format(tid)
        logger.debug("Cancelling query '{}' ({})".format(connection_name, pid))
        _, cursor = self.add_query(sql, 'master')
        res = cursor.fetchone()
        logger.debug("Canceled query '{}': {}".format(connection_name, res))
```

</File>

##### `exception_handler(self, sql, connection_name='master')`

`exception_handler` is an instance method that returns a context manager that will handle exceptions raised by running queries, catch them, log appropriately, and then raise exceptions dbt knows how to handle.

If you use the (highly recommended) `@contextmanager` decorator, you only have to wrap a `yield` inside a `try` block, like so:

<File name='connections.py'>

```python
    @contextmanager
    def exception_handler(self, sql: str):
        try:
            yield
        except myadapter_library.DatabaseError as exc:
            self.release(connection_name)

            logger.debug('myadapter error: {}'.format(str(e)))
            raise dbt.exceptions.DatabaseException(str(exc))
        except Exception as exc:
            logger.debug("Error running SQL: {}".format(sql))
            logger.debug("Rolling back transaction.")
            self.release(connection_name)
            raise dbt.exceptions.RuntimeException(str(exc))
```

</File>

##### `standardize_grants_dict(self, grants_table: agate.Table) -> dict`

`standardize_grants_dict` is an method that returns the dbt-standardized grants dictionary that matches how users configure grants now in dbt. The input is the result of `SHOW GRANTS ON {{model}}` call loaded into an agate table.

If there's any massaging of agate table containing the results, of `SHOW GRANTS ON {{model}}`, that can't easily be accomplished in SQL, it can be done here. For example, the SQL to show grants _should_ filter OUT any grants TO the current user/role (e.g. OWNERSHIP). If that's not possible in SQL, it can be done in this method instead.

<File name='impl.py'>

```python
    @available
    def standardize_grants_dict(self, grants_table: agate.Table) -> dict:
        """
        :param grants_table: An agate table containing the query result of
            the SQL returned by get_show_grant_sql
        :return: A standardized dictionary matching the `grants` config
        :rtype: dict
        """
        grants_dict: Dict[str, List[str]] = {}
        for row in grants_table:
            grantee = row["grantee"]
            privilege = row["privilege_type"]
            if privilege in grants_dict.keys():
                grants_dict[privilege].append(grantee)
            else:
                grants_dict.update({privilege: [grantee]})
        return grants_dict
```

</File>

### Editing the adapter implementation

Edit the connection manager at `myadapter/dbt/adapters/myadapter/impl.py`

Very little is required to implement the adapter itself. On some adapters, you will not need to override anything. On others, you'll likely need to override some of the ``convert_*`` classmethods, or override the `is_cancelable` classmethod on others to return `False`.

#### `datenow()`

This classmethod provides the adapter's canonical date function. This is not used but is required– anyway on all adapters.

<File name='impl.py'>

```python
    @classmethod
    def date_function(cls):
        return 'datenow()'
```

</File>

### Editing SQL logic

dbt implements specific SQL operations using jinja macros. While reasonable defaults are provided for many such operations (like `create_schema`, `drop_schema`, `create_table`, etc), you may need to override one or more of macros when building a new adapter.

#### Required macros

The following macros must be implemented, but you can override their behavior for your adapter using the "dispatch" pattern described below. Macros marked (required) do not have a valid default implementation, and are required for dbt to operate.

- `alter_column_type` ([source](https://github.com/dbt-labs/dbt-core/blob/f988f76fccc1878aaf8d8631c05be3e9104b3b9a/core/dbt/include/global_project/macros/adapters/columns.sql#L37-L55))
- `check_schema_exists` ([source](https://github.com/dbt-labs/dbt-core/blob/f988f76fccc1878aaf8d8631c05be3e9104b3b9a/core/dbt/include/global_project/macros/adapters/metadata.sql#L43-L55))
- `create_schema` ([source](https://github.com/dbt-labs/dbt-core/blob/f988f76fccc1878aaf8d8631c05be3e9104b3b9a/core/dbt/include/global_project/macros/adapters/schema.sql#L1-L9))
- `drop_relation` ([source](https://github.com/dbt-labs/dbt-core/blob/f988f76fccc1878aaf8d8631c05be3e9104b3b9a/core/dbt/include/global_project/macros/adapters/relation.sql#L34-L42))
- `drop_schema` ([source](https://github.com/dbt-labs/dbt-core/blob/f988f76fccc1878aaf8d8631c05be3e9104b3b9a/core/dbt/include/global_project/macros/adapters/schema.sql#L12-L20))
- `get_columns_in_relation` ([source](https://github.com/dbt-labs/dbt-core/blob/f988f76fccc1878aaf8d8631c05be3e9104b3b9a/core/dbt/include/global_project/macros/adapters/columns.sql#L1-L8)) (required)
- `list_relations_without_caching` ([source](https://github.com/dbt-labs/dbt-core/blob/f988f76fccc1878aaf8d8631c05be3e9104b3b9a/core/dbt/include/global_project/macros/adapters/metadata.sql#L58-L65)) (required)
- `list_schemas` ([source](https://github.com/dbt-labs/dbt-core/blob/f988f76fccc1878aaf8d8631c05be3e9104b3b9a/core/dbt/include/global_project/macros/adapters/metadata.sql#L29-L40))
- `rename_relation` ([source](https://github.com/dbt-labs/dbt-core/blob/f988f76fccc1878aaf8d8631c05be3e9104b3b9a/core/dbt/include/global_project/macros/adapters/relation.sql#L56-L65))
- `truncate_relation` ([source](https://github.com/dbt-labs/dbt-core/blob/f988f76fccc1878aaf8d8631c05be3e9104b3b9a/core/dbt/include/global_project/macros/adapters/relation.sql#L45-L53))
- `current_timestamp` ([source](https://github.com/dbt-labs/dbt-core/blob/f988f76fccc1878aaf8d8631c05be3e9104b3b9a/core/dbt/include/global_project/macros/adapters/freshness.sql#L1-L8)) (required)
- `copy_grants`

#### Adapter dispatch

Most modern databases support a majority of the standard SQL spec. There are some databases that _do not_ support critical aspects of the SQL spec however, or they provide their own nonstandard mechanisms for implementing the same functionality. To account for these variations in SQL support, dbt provides a mechanism called [multiple dispatch](https://en.wikipedia.org/wiki/Multiple_dispatch) for macros. With this feature, macros can be overridden for specific adapters. This makes it possible to implement high-level methods (like "create <Term id="table" />") in a database-specific way.

<File name='adapters.sql'>

```jinja2

{# dbt will call this macro by name, providing any arguments #}
{% macro create_table_as(temporary, relation, sql) -%}

  {# dbt will dispatch the macro call to the relevant macro #}
  {{ return(
      adapter.dispatch('create_table_as')(temporary, relation, sql)
     ) }}
{%- endmacro %}



{# If no macro matches the specified adapter, "default" will be used #}
{% macro default__create_table_as(temporary, relation, sql) -%}
   ...
{%- endmacro %}



{# Example which defines special logic for Redshift #}
{% macro redshift__create_table_as(temporary, relation, sql) -%}
   ...
{%- endmacro %}



{# Example which defines special logic for BigQuery #}
{% macro bigquery__create_table_as(temporary, relation, sql) -%}
   ...
{%- endmacro %}
```

</File>

The `adapter.dispatch()` macro takes a second argument, `packages`, which represents a set of "search namespaces" in which to find potential implementations of a dispatched macro. This allows users of community-supported adapters to extend or "shim" dispatched macros from common packages, such as `dbt-utils`, with adapter-specific versions in their own project or other installed packages. See:

- "Shim" package examples: [`spark-utils`](https://github.com/dbt-labs/spark-utils), [`tsql-utils`](https://github.com/dbt-msft/tsql-utils)
- [`adapter.dispatch` docs](/reference/dbt-jinja-functions/dispatch)

#### Overriding adapter methods

While much of dbt's adapter-specific functionality can be modified in adapter macros, it can also make sense to override adapter methods directly. In this example, assume that a database does not support a `cascade` parameter to `drop schema`. Instead, we can implement an approximation where we drop each relation and then drop the schema.

<File name='impl.py'>

```python
    def drop_schema(self, relation: BaseRelation):
        relations = self.list_relations(
            database=relation.database,
            schema=relation.schema
        )
        for relation in relations:
            self.drop_relation(relation)
        super().drop_schema(relation)
```

</File>

#### Grants Macros

See [this GitHub discussion](https://github.com/dbt-labs/dbt-core/discussions/5468) for information on the macros required for `GRANT` statements:

### Other files

#### `profile_template.yml`

In order to enable the [`dbt init` command](/reference/commands/init) to prompt users when setting up a new project and connection profile, you should include a **profile template**. The filepath needs to be `dbt/include/<adapter_name>/profile_template.yml`. It's possible to provide hints, default values, and conditional prompts based on connection methods that require different supporting attributes. Users will also be able to include custom versions of this file in their own projects, with fixed values specific to their organization, to support their colleagues when using your dbt adapter for the first time.

See examples:

- [dbt-postgres](https://github.com/dbt-labs/dbt-core/blob/main/plugins/postgres/dbt/include/postgres/profile_template.yml)
- [dbt-redshift](https://github.com/dbt-labs/dbt-redshift/blob/main/dbt/include/redshift/profile_template.yml)
- [dbt-snowflake](https://github.com/dbt-labs/dbt-snowflake/blob/main/dbt/include/snowflake/profile_template.yml)
- [dbt-bigquery](https://github.com/dbt-labs/dbt-bigquery/blob/main/dbt/include/bigquery/profile_template.yml)

#### `__version__.py`

To assure that `dbt --version` provides the latest dbt core version the adapter supports, be sure include a `__version__.py` file. The filepath will be `dbt/adapters/<adapter_name>/__version__.py`. We recommend using the latest dbt core version and as the adapter is made compatible with later versions, this file will need to be updated. For a sample file, check out this [example](https://github.com/dbt-labs/dbt-snowflake/blob/main/dbt/adapters/snowflake/__version__.py).

It should be noted that both of these files are included in the bootstrapped output of the `dbt-database-adapter-scaffold` so when using the scaffolding, these files will be included.

## Testing your adapter

:::info

Previously, we offered a packaged suite of tests for dbt adapter functionality: [`pytest-dbt-adapter`](https://github.com/dbt-labs/dbt-adapter-tests). We are deprecating that suite, in favor of the newer testing framework outlined in this document.

:::

This document has two sections:

1. "[About the testing framework](#about-the-testing-framework)" describes the standard framework that we maintain for using pytest together with dbt. It includes an example that shows the anatomy of a simple test case.
2. "[Testing your adapter](#testing-your-adapter)" offers a step-by-step guide for using our out-of-the-box suite of "basic" tests, which will validate that your adapter meets a baseline of dbt functionality.

### Testing prerequisites

- Your adapter must be compatible with dbt-core **v1.1** or newer
- You should be familiar with **pytest**: <https://docs.pytest.org/>

### About the testing framework

dbt-core offers a standard framework for running pre-built functional tests, and for defining your own tests. The core testing framework is built using `pytest`, a mature and standard library for testing Python projects.

The **[`tests` module](https://github.com/dbt-labs/dbt-core/tree/HEAD/core/dbt/tests)** within `dbt-core` includes basic utilities for setting up pytest + dbt. These are used by all "pre-built" functional tests, and make it possible to quickly write your own tests.

Those utilities allow you to do three basic things:

1. **Quickly set up a dbt "project."** Define project resources via methods such as `models()` and `seeds()`. Use `project_config_update()` to pass configurations into `dbt_project.yml`.
2. **Define a sequence of dbt commands.** The most important utility  is `run_dbt()`, which returns the [results](/reference/dbt-classes#result-objects) of each dbt command. It takes a list of CLI specifiers (subcommand + flags), as well as an optional second argument, `expect_pass=False`, for cases where you expect the command to fail.
3. **Validate the results of those dbt commands.** For example, `check_relations_equal()` asserts that two database objects have the same structure and content. You can also write your own `assert` statements, by inspecting the results of a dbt command, or querying arbitrary database objects with `project.run_sql()`.

You can see the full suite of utilities, with arguments and annotations, in [`util.py`](https://github.com/dbt-labs/dbt-core/blob/main/core/dbt/tests/util.py). You'll also see them crop up across a number of test cases. While all utilities are intended to be reusable, you won't need all of them for every test. In the example below, we'll show a simple test case that uses only a few utilities.

#### Example: a simple test case

This example will show you the anatomy of a test case using dbt + pytest. We will create reusable components, combine them to form a dbt "project", and define a sequence of dbt commands. Then, we'll use Python `assert` statements to ensure those commands succeed (or fail) as we expect.

In ["Getting started running basic tests,"](#getting-started-running-basic-tests) we'll offer step-by-step instructions for installing and configuring `pytest`, so that you can run it on your own machine. For now, it's more important to see how the pieces of a test case fit together.

This example includes a seed, a model, and two tests—one of which will fail.

1. Define Python strings that will represent the file contents in your dbt project. Defining these in a separate file enables you to reuse the same components across different test cases. The pytest name for this type of reusable component is "fixture."

<File name="tests/functional/example/fixtures.py">

```python
# seeds/my_seed.csv
my_seed_csv = """
id,name,some_date
1,Easton,1981-05-20T06:46:51
2,Lillian,1978-09-03T18:10:33
3,Jeremiah,1982-03-11T03:59:51
4,Nolan,1976-05-06T20:21:35
""".lstrip()

# models/my_model.sql
my_model_sql = """
select * from {{ ref('my_seed') }}
union all
select null as id, null as name, null as some_date
"""

# models/my_model.yml
my_model_yml = """
version: 2
models:
  - name: my_model
    columns:
      - name: id
        tests:
          - unique
          - not_null  # this test will fail
"""
```

</File>

2. Use the "fixtures" to define the project for your test case. These fixtures are always scoped to the **class**, where the class represents one test case—that is, one dbt project or scenario. (The same test case can be used for one or more actual tests, which we'll see in step 3.) Following the default pytest configurations, the file name must begin with `test_`, and the class name must begin with `Test`.

<File name="tests/functional/example/test_example_failing_test.py">

```python
import pytest
from dbt.tests.util import run_dbt

# our file contents
from tests.functional.example.fixtures import (
    my_seed_csv,
    my_model_sql,
    my_model_yml,
)

# class must begin with 'Test'
class TestExample:
    """
    Methods in this class will be of two types:
    1. Fixtures defining the dbt "project" for this test case.
       These are scoped to the class, and reused for all tests in the class.
    2. Actual tests, whose names begin with 'test_'.
       These define sequences of dbt commands and 'assert' statements.
    """
    
    # configuration in dbt_project.yml
    @pytest.fixture(scope="class")
    def project_config_update(self):
        return {
          "name": "example",
          "models": {"+materialized": "view"}
        }

    # everything that goes in the "seeds" directory
    @pytest.fixture(scope="class")
    def seeds(self):
        return {
            "my_seed.csv": my_seed_csv,
        }

    # everything that goes in the "models" directory
    @pytest.fixture(scope="class")
    def models(self):
        return {
            "my_model.sql": my_model_sql,
            "my_model.yml": my_model_yml,
        }
        
    # continues below
```

</File>

3. Now that we've set up our project, it's time to define a sequence of dbt commands and assertions. We define one or more methods in the same file, on the same class (`TestExampleFailingTest`), whose names begin with `test_`. These methods share the same setup (project scenario) from above, but they can be run independently by pytest—so they shouldn't depend on each other in any way.

<File name="tests/functional/example/test_example_failing_test.py">

```python
    # continued from above

    # The actual sequence of dbt commands and assertions
    # pytest will take care of all "setup" + "teardown"
    def test_run_seed_test(self, project):
        """
        Seed, then run, then test. We expect one of the tests to fail
        An alternative pattern is to use pytest "xfail" (see below)
        """
        # seed seeds
        results = run_dbt(["seed"])
        assert len(results) == 1
        # run models
        results = run_dbt(["run"])
        assert len(results) == 1
        # test tests
        results = run_dbt(["test"], expect_pass = False) # expect failing test
        assert len(results) == 2
        # validate that the results include one pass and one failure
        result_statuses = sorted(r.status for r in results)
        assert result_statuses == ["fail", "pass"]

    @pytest.mark.xfail
    def test_build(self, project):
        """Expect a failing test"""
        # do it all
        results = run_dbt(["build"])
```

</File>

3. Our test is ready to run! The last step is to invoke `pytest` from your command line. We'll walk through the actual setup and configuration of `pytest` in the next section.

<File name="terminal">

```sh
$ python3 -m pytest tests/functional/test_example.py
=========================== test session starts ============================
platform ... -- Python ..., pytest-..., pluggy-...
rootdir: ...
plugins: ...

tests/functional/test_example.py .X                                  [100%]

======================= 1 passed, 1 xpassed in 1.38s =======================
```

</File>

You can find more ways to run tests, along with a full command reference, in the [pytest usage docs](https://docs.pytest.org/how-to/usage.html).

We've found the `-s` flag (or `--capture=no`) helpful to print logs from the underlying dbt invocations, and to step into an interactive debugger if you've added one. You can also use environment variables to set [global dbt configs](/reference/global-configs/about-global-configs), such as `DBT_DEBUG` (to show debug-level logs).

### Testing this adapter

Anyone who installs `dbt-core`, and wishes to define their own test cases, can use the framework presented in the first section. The framework is especially useful for testing standard dbt behavior across different databases.

To that end, we have built and made available a [package of reusable adapter test cases](https://github.com/dbt-labs/dbt-core/tree/HEAD/tests/adapter), for creators and maintainers of adapter plugins. These test cases cover basic expected functionality, as well as functionality that frequently requires different implementations across databases.

For the time being, this package is also located within the `dbt-core` repository, but separate from the `dbt-core` Python package.

### Categories of tests

In the course of creating and maintaining your adapter, it's likely that you will end up implementing tests that fall into three broad categories:

1. **Basic tests** that every adapter plugin is expected to pass. These are defined in `tests.adapter.basic`. Given differences across data platforms, these may require slight modification or reimplementation. Significantly overriding or disabling these tests should be with good reason, since each represents basic functionality expected by dbt users. For example, if your adapter does not support incremental models, you should disable the test, [by marking it with `skip` or `xfail`](https://docs.pytest.org/en/latest/how-to/skipping.html), as well as noting that limitation in any documentation, READMEs, and usage guides that accompany your adapter.

2. **Optional tests**, for second-order functionality that is common across plugins, but not required for basic use. Your plugin can opt into these test cases by inheriting existing ones, or reimplementing them with adjustments. For now, this category includes all tests located outside the `basic` subdirectory. More tests will be added as we convert older tests defined on dbt-core and mature plugins to use the standard framework.

3. **Custom tests**, for behavior that is specific to your adapter / data platform. Each <Term id="data-warehouse" /> has its own specialties and idiosyncracies. We encourage you to use the same `pytest`-based framework, utilities, and fixtures to write your own custom tests for functionality that is unique to your adapter.

If you run into an issue with the core framework, or the basic/optional test cases—or if you've written a custom test that you believe would be relevant and useful for other adapter plugin developers—please open an issue or PR in the `dbt-core` repository on GitHub.

### Getting started running basic tests

In this section, we'll walk through the three steps to start running our basic test cases on your adapter plugin:

1. Install dependencies
2. Set up and configure pytest
3. Define test cases

### Install dependencies

You should already have a virtual environment with `dbt-core` and your adapter plugin installed. You'll also need to install:

- [`pytest`](https://pypi.org/project/pytest/)
- [`dbt-tests-adapter`](https://pypi.org/project/dbt-tests-adapter/), the set of common test cases
- (optional) [`pytest` plugins](https://docs.pytest.org/en/7.0.x/reference/plugin_list.html)--we'll use `pytest-dotenv` below

Or specify all dependencies in a requirements file like:
<File name="dev_requirements.txt">

```txt
pytest
pytest-dotenv
dbt-tests-adapter
```

</File>

```sh
pip install -r dev_requirements.txt
```

### Set up and configure pytest

First, set yourself up to run `pytest` by creating a file named `pytest.ini` at the root of your repository:

<File name="pytest.ini">

```python
[pytest]
filterwarnings =
    ignore:.*'soft_unicode' has been renamed to 'soft_str'*:DeprecationWarning
    ignore:unclosed file .*:ResourceWarning
env_files =
    test.env  # uses pytest-dotenv plugin
              # this allows you to store env vars for database connection in a file named test.env
              # rather than passing them in every CLI command, or setting in `PYTEST_ADDOPTS`
              # be sure to add "test.env" to .gitignore as well!
testpaths =
    tests/functional  # name per convention
```

</File>

Then, create a configuration file within your tests directory. In it, you'll want to define all necessary profile configuration for connecting to your data platform in local development and continuous integration. We recommend setting these values with environment variables, since this file will be checked into version control.

<File name="tests/conftest.py">

```python
import pytest
import os

# Import the standard functional fixtures as a plugin
# Note: fixtures with session scope need to be local
pytest_plugins = ["dbt.tests.fixtures.project"]

# The profile dictionary, used to write out profiles.yml
# dbt will supply a unique schema per test, so we do not specify 'schema' here
@pytest.fixture(scope="class")
def dbt_profile_target():
    return {
        'type': '<myadapter>',
        'threads': 1,
        'host': os.getenv('HOST_ENV_VAR_NAME'),
        'user': os.getenv('USER_ENV_VAR_NAME'),
        ...
    }
```

</File>

### Define test cases

As in the example above, each test case is defined as a class, and has its own "project" setup. To get started, you can import all basic test cases and try running them without changes.

<File name="tests/functional/adapter/test_basic.py">

```python
import pytest

from dbt.tests.adapter.basic.test_base import BaseSimpleMaterializations
from dbt.tests.adapter.basic.test_singular_tests import BaseSingularTests
from dbt.tests.adapter.basic.test_singular_tests_ephemeral import BaseSingularTestsEphemeral
from dbt.tests.adapter.basic.test_empty import BaseEmpty
from dbt.tests.adapter.basic.test_ephemeral import BaseEphemeral
from dbt.tests.adapter.basic.test_incremental import BaseIncremental
from dbt.tests.adapter.basic.test_generic_tests import BaseGenericTests
from dbt.tests.adapter.basic.test_snapshot_check_cols import BaseSnapshotCheckCols
from dbt.tests.adapter.basic.test_snapshot_timestamp import BaseSnapshotTimestamp
from dbt.tests.adapter.basic.test_adapter_methods import BaseAdapterMethod

class TestSimpleMaterializationsMyAdapter(BaseSimpleMaterializations):
    pass


class TestSingularTestsMyAdapter(BaseSingularTests):
    pass


class TestSingularTestsEphemeralMyAdapter(BaseSingularTestsEphemeral):
    pass


class TestEmptyMyAdapter(BaseEmpty):
    pass


class TestEphemeralMyAdapter(BaseEphemeral):
    pass


class TestIncrementalMyAdapter(BaseIncremental):
    pass


class TestGenericTestsMyAdapter(BaseGenericTests):
    pass


class TestSnapshotCheckColsMyAdapter(BaseSnapshotCheckCols):
    pass


class TestSnapshotTimestampMyAdapter(BaseSnapshotTimestamp):
    pass


class TestBaseAdapterMethod(BaseAdapterMethod):
    pass
```

</File>

Finally, run pytest:

```sh
python3 -m pytest tests/functional
```

### Modifying test cases

You may need to make slight modifications in a specific test case to get it passing on your adapter. The mechanism to do this is simple: rather than simply inheriting the "base" test with `pass`, you can redefine any of its fixtures or test methods.

For instance, on Redshift, we need to explicitly cast a column in the fixture input seed to use data type `varchar(64)`:

<File name="tests/functional/adapter/test_basic.py">

```python
import pytest
from dbt.tests.adapter.basic.files import seeds_base_csv, seeds_added_csv, seeds_newcolumns_csv
from dbt.tests.adapter.basic.test_snapshot_check_cols import BaseSnapshotCheckCols

# set the datatype of the name column in the 'added' seed so it
# can hold the '_update' that's added
schema_seed_added_yml = """
version: 2
seeds:
  - name: added
    config:
      column_types:
        name: varchar(64)
"""

class TestSnapshotCheckColsRedshift(BaseSnapshotCheckCols):
    # Redshift defines the 'name' column such that it's not big enough
    # to hold the '_update' added in the test.
    @pytest.fixture(scope="class")
    def models(self):
        return {
            "base.csv": seeds_base_csv,
            "added.csv": seeds_added_csv,
            "seeds.yml": schema_seed_added_yml,
        }
```

</File>

As another example, the `dbt-bigquery` adapter asks users to "authorize" replacing a <Term id="table" /> with a <Term id="view" /> by supplying the `--full-refresh` flag. The reason: In the table <Term id="materialization" /> logic, a view by the same name must first be dropped; if the table query fails, the model will be missing.

Knowing this possibility, the "base" test case offers a `require_full_refresh` switch on the `test_config` fixture class. For BigQuery, we'll switch it on:

<File name="tests/functional/adapter/test_basic.py">

```python
import pytest
from dbt.tests.adapter.basic.test_base import BaseSimpleMaterializations

class TestSimpleMaterializationsBigQuery(BaseSimpleMaterializations):
    @pytest.fixture(scope="class")
    def test_config(self):
        # effect: add '--full-refresh' flag in requisite 'dbt run' step
        return {"require_full_refresh": True}
```

</File>

It's always worth asking whether the required modifications represent gaps in perceived or expected dbt functionality. Are these simple implementation details, which any user of this database would understand? Are they limitations worth documenting?

If, on the other hand, they represent poor assumptions in the "basic" test cases, which fail to account for a common pattern in other types of databases-—please open an issue or PR in the `dbt-core` repository on GitHub.

### Running with multiple profiles

Some databases support multiple connection methods, which map to actually different functionality behind the scenes. For instance, the `dbt-spark` adapter supports connections to Apache Spark clusters _and_ Databricks runtimes, which supports additional functionality out of the box, enabled by the Delta file format.

<File name="tests/conftest.py">

```python
def pytest_addoption(parser):
    parser.addoption("--profile", action="store", default="apache_spark", type=str)


# Using @pytest.mark.skip_profile('apache_spark') uses the 'skip_by_profile_type'
# autouse fixture below
def pytest_configure(config):
    config.addinivalue_line(
        "markers",
        "skip_profile(profile): skip test for the given profile",
    )

@pytest.fixture(scope="session")
def dbt_profile_target(request):
    profile_type = request.config.getoption("--profile")
    elif profile_type == "databricks_sql_endpoint":
        target = databricks_sql_endpoint_target()
    elif profile_type == "apache_spark":
        target = apache_spark_target()
    else:
        raise ValueError(f"Invalid profile type '{profile_type}'")
    return target

def apache_spark_target():
    return {
        "type": "spark",
        "host": "localhost",
        ...
    }

def databricks_sql_endpoint_target():
    return {
        "type": "spark",
        "host": os.getenv("DBT_DATABRICKS_HOST_NAME"),
        ...
    }

@pytest.fixture(autouse=True)
def skip_by_profile_type(request):
    profile_type = request.config.getoption("--profile")
    if request.node.get_closest_marker("skip_profile"):
        for skip_profile_type in request.node.get_closest_marker("skip_profile").args:
            if skip_profile_type == profile_type:
                pytest.skip("skipped on '{profile_type}' profile")
```

</File>

If there are tests that _shouldn't_ run for a given profile:

<File name="tests/functional/adapter/basic.py">

```python
# Snapshots require access to the Delta file format, available on our Databricks connection,
# so let's skip on Apache Spark
@pytest.mark.skip_profile('apache_spark')
class TestSnapshotCheckColsSpark(BaseSnapshotCheckCols):
    @pytest.fixture(scope="class")
    def project_config_update(self):
        return {
            "seeds": {
                "+file_format": "delta",
            },
            "snapshots": {
                "+file_format": "delta",
            }
        }
```

</File>

Finally:

```sh
python3 -m pytest tests/functional --profile apache_spark
python3 -m pytest tests/functional --profile databricks_sql_endpoint
```
