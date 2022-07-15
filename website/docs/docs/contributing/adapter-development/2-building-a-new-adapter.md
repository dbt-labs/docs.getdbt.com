---
title: "Building a new adapter"
id: "building-a-new-adapter"
---

To learn what an adapter is and they role they serve, see [What are adapters?](1-what-are-adapters.md)

This guide will walk you through the first creating the necessary adapter classes and macros, and provide some resources to help you validate that your new adapter is working correctly. Once the adapter is passing most of the functional tests (see ["Testing a new adapter"](testing-a-new-adapter)
), please let the community know that is available to use by adding the adapter to the [Available Adapters](docs/available-adapters) page by following the steps given in [Documenting your adapter](docs/contributing/documenting-a-new-adapter).

For any questions you may have, don't hesitate to ask in the [#adapter-ecosystem](https://getdbt.slack.com/archives/C030A0UF5LM) Slack channel. The community is very helpful and likely has experienced a similar issue as you.

## Pre-Requisite Data Warehouse Features

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

## Scaffolding a new adapter
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

### Editing setup.py

Edit the file at `myadapter/setup.py` and fill in the missing information.

You can skip this step if you passed the arguments for `email`, `url`, `author`, and `dependencies` to the script. If you plan on having nested macro folder structures, you may need to add entries to `package_data` so your macro source files get installed.

### Editing the connection manager

Edit the connection manager at `myadapter/dbt/adapters/myadapter/connections.py`. This file is defined in the sections below.

### The Credentials class

The credentials class defines all of the database-specific credentials (e.g. `username` and `password`) that users will need in the [connection profile](configure-your-profile) for your new adapter. Each credentials contract should subclass dbt.adapters.base.Credentials, and be implemented as a python dataclass.

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
- Create a `profile_template.yml` to enable configuration prompts for a brand-new user setting up a connection profile via the [`dbt init` command](init). See more details [below](#other-files).
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

### Connection methods

Once credentials are configured, you'll need to implement some connection-oriented methods. They are enumerated in the SQLConnectionManager docstring, but an overview will also be provided here.

**Methods to implement:**
- open
- get_response
- cancel
- exception_handler

#### open(cls, connection)

`open()` is a classmethod that gets a connection object (which could be in any state, but will have a `Credentials` object with the attributes you defined above) and moves it to the 'open' state.

Generally this means doing the following:
    - if the connection is open already, log and return it.
        - If a database needed changes to the underlying connection before re-use, that would happen here
    - create a connection handle using the underlying database library using the credentials
        - on success:
            - set connection.state to `'open'`
            - set connection.handle to the handle object
                - this is what must have a cursor() method that returns a cursor!
        - on error:
            - set connection.state to `'fail'`
            - set connection.handle to `None`
            - raise a dbt.exceptions.FailedToConnectException with the error and any other relevant information

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

#### get_response(cls, cursor)

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

#### cancel(self, connection)

cancel is an instance method that gets a connection object and attempts to cancel any ongoing queries, which is database dependent. Some databases don't support the concept of cancellation, they can simply implement it via 'pass' and their adapter classes should implement an `is_cancelable` that returns False - On ctrl+c connections may remain running. This method must be implemented carefully, as the affected connection will likely be in use in a different thread.

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

#### exception_handler(self, sql, connection_name='master')

exception_handler is an instance method that returns a context manager that will handle exceptions raised by running queries, catch them, log appropriately, and then raise exceptions dbt knows how to handle.

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

### Editing the adapter implementation

Edit the connection manager at `myadapter/dbt/adapters/myadapter/impl.py`

Very little is required to implement the adapter itself. On some adapters, you will not need to override anything. On others, you'll likely need to override some of the convert_* classmethods, or override the `is_cancelable` classmethod on others to return False.


#### datenow()

This classmethod provides the adapter's canonical date function. This is not used but is required anyway on all adapters.

<File name='impl.py'>

```python
    @classmethod
    def date_function(cls):
        return 'datenow()'
```

</File>

### Editing SQL logic

dbt implements specific SQL operations using jinja macros. While reasonable defaults are provided for many such operations (like `create_schema`, `drop_schema`, `create_table`, etc), you may need to override one or more of macros when building a new adapter.

### Required macros

The following macros must be implemented, but you can override their behavior for your adapter using the "dispatch" pattern described below. Macros marked (required) do not have a valid default implementation, and are required for dbt to operate.

- `alter_column_type` ([source](https://github.com/dbt-labs/dbt-core/blob/HEAD/core/dbt/include/global_project/macros/adapters/common.sql#L140))
- `check_schema_exists` ([source](https://github.com/dbt-labs/dbt-core/blob/HEAD/core/dbt/include/global_project/macros/adapters/common.sql#L224))
- `create_schema` ([source](https://github.com/dbt-labs/dbt-core/blob/HEAD/core/dbt/include/global_project/macros/adapters/common.sql#L21))
- `drop_relation` ([source](https://github.com/dbt-labs/dbt-core/blob/HEAD/core/dbt/include/global_project/macros/adapters/common.sql#L164))
- `drop_schema` ([source](https://github.com/dbt-labs/dbt-core/blob/HEAD/core/dbt/include/global_project/macros/adapters/common.sql#L31))
- `get_columns_in_relation` ([source](https://github.com/dbt-labs/dbt-core/blob/HEAD/core/dbt/include/global_project/macros/adapters/common.sql#L95)) (required)
- `list_relations_without_caching` ([source](https://github.com/dbt-labs/dbt-core/blob/HEAD/core/dbt/include/global_project/macros/adapters/common.sql#L240)) (required)
- `list_schemas` ([source](https://github.com/dbt-labs/dbt-core/blob/HEAD/core/dbt/include/global_project/macros/adapters/common.sql#L210))
- `rename_relation` ([source](https://github.com/dbt-labs/dbt-core/blob/HEAD/core/dbt/include/global_project/macros/adapters/common.sql#L185))
- `truncate_relation` ([source](https://github.com/dbt-labs/dbt-core/blob/HEAD/core/dbt/include/global_project/macros/adapters/common.sql#L175))
- `current_timestamp` ([source](https://github.com/dbt-labs/dbt-core/blob/HEAD/core/dbt/include/global_project/macros/adapters/common.sql#L269)) (required)

### Adapter dispatch

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
- [`adapter.dispatch` docs](dispatch)

### Overriding adapter methods

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

### Other files

#### `profile_template.yml`

In order to enable the [`dbt init` command](/reference/commands/init) to prompt users when setting up a new project and connection profile, you should include a **profile template**. The filepath needs to be `dbt/include/<adapter_name>/profile_template.yml`. It's possible to provide hints, default values, and conditional prompts based on connection methods that require different supporting attributes. Users will also be able to include custom versions of this file in their own projects, with fixed values specific to their organization, to support their colleagues when using your dbt adapter for the first time.

See examples:
- [dbt-postgres](https://github.com/dbt-labs/dbt-core/blob/main/plugins/postgres/dbt/include/postgres/profile_template.yml)
- [dbt-redshift](https://github.com/dbt-labs/dbt-redshift/blob/main/dbt/include/redshift/profile_template.yml)
- [dbt-snowflake](https://github.com/dbt-labs/dbt-snowflake/blob/main/dbt/include/snowflake/profile_template.yml)
- [dbt-bigquery](https://github.com/dbt-labs/dbt-bigquery/blob/main/dbt/include/bigquery/profile_template.yml)

#### `__version__.py`

To assure that `dbt --version` provides the latest dbt core version the adapter supports, be sure include a `__version__.py` file. The filepath will be `dbt/adapters/<adapter_name>/__version__.py`. We recommend using the latest dbt core version and as the adapter is made compatible with later versions, this file will need to be updated. For a sample file, check out this [example](https://github.com/dbt-labs/dbt-core/blob/develop/plugins/snowflake/dbt/adapters/snowflake/__version__.py).

It should be noted that both of these files are included in the bootstrapped output of the `dbt-database-adapter-scaffold` so when using the scaffolding, these files will be included.

### Testing your new adapter

This has moved to its own page: ["Testing a new adapter"](testing-a-new-adapter)

### Documenting your new adapter

Many community members maintain their adapter plugins under open source licenses. If you're interested in doing this, we recommend:
- Hosting on a public git provider (e.g. GitHub, GitLab)
- Publishing to [PyPi](https://pypi.org/)
- Adding to the list of ["Available Adapters"](available-adapters#community-supported)
