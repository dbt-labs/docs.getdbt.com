---
title: "Building a new adapter"
id: "3-building-a-new-adapter"
---

:::tip
Before you build your adapter, we strongly encourage you to first learn dbt as an end user, learn [what an adapter is and the role they serve](1-what-are-adapters), as well as [data platform prerequisites](2-prerequisites-for-a-new-adapter)
:::


This guide will walk you through the first creating the necessary adapter classes and macros, and provide some resources to help you validate that your new adapter is working correctly. Once the adapter is passing most of the functional tests (see ["Testing a new adapter"](4-testing-a-new-adapter)
), please let the community know that is available to use by adding the adapter to the ["Supported Data Platforms"](/docs/supported-data-platforms) page by following the steps given in [Documenting your adapter](/guides/dbt-ecosystem/adapter-development/5-documenting-a-new-adapter).

For any questions you may have, don't hesitate to ask in the [#adapter-ecosystem](https://getdbt.slack.com/archives/C030A0UF5LM) Slack channel. The community is very helpful and likely has experienced a similar issue as you.

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

## Implementation Details

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

If there's any massaging of agate table containing the results, of `SHOW GRANTS ON {{model}}`, that can't easily be accomplished in SQL, it can be done here. For example, the SQL to show grants *should* filter OUT any grants TO the current user/role (e.g. OWNERSHIP). If that's not possible in SQL, it can be done in this method instead.

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

## Testing your new adapter

This has moved to its own page: ["Testing a new adapter"](4-testing-a-new-adapter)

## Documenting your new adapter

This has moved to its own page: ["Documenting a new adapter"](/guides/dbt-ecosystem/adapter-development/5-documenting-a-new-adapter)

## Maintaining your new adapter

This has moved to a new spot: ["Maintaining your new adapter"](2-prerequisites-for-a-new-adapter##maintaining-your-new-adapter)
