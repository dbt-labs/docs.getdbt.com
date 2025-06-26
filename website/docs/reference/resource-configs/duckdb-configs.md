---
title: "DuckDB configurations"
id: "duckdb-configs"
---


## Profile

<Constant name="cloud" /> users don't have to create their own profiles.yml file. dbt-duckdb [profiles](/docs/core/connect-data-platform/duckdb-setup#connecting-to-duckdb-with-dbt-duckdb) should be set up as follows:

```yml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: duckdb
      path: 'file_path/database_name.duckdb'
      extensions:
        - httpfs
        - parquet
      settings:
        s3_region: my-aws-region
        s3_access_key_id: "{{ env_var('S3_ACCESS_KEY_ID') }}"
        s3_secret_access_key: "{{ env_var('S3_SECRET_ACCESS_KEY') }}"
```

This will run your dbt-duckdb pipeline against an in-memory [DuckDB](https://www.duckdb.org) database that will not be persisted after your run completes.

To have your dbt pipeline persist relations in a DuckDB file, set the path field in your profile to the path of the DuckDB file that you would like to read and write on your local filesystem. (If the path is not specified, the path is automatically set to the special value `:memory:` and the database will run in-memory, without persistence).


`dbt-duckdb` adds the `database` property: its value is automatically set to the basename of the file in the path argument with the suffix removed. For example, if the path is `/tmp/a/dbfile.duckdb`, the `database` field will be set to `dbfile`.


## Using MotherDuck


As of `dbt-duckdb 1.5.2`, you can connect to a DuckDB instance running on [MotherDuck](https://motherduck.com) by setting your path to use an `md:` connection string, just as you would with the DuckDB CLI or the Python API.
MotherDuck databases generally work the same way as local DuckDB databases from the perspective of dbt, but there are a few differences to be aware of:
1. Currently, MotherDuck requires a specific version of DuckDB, often the latest, as specified in MotherDuck's documentation.
1. MotherDuck preloads a set of the most common DuckDB extensions for you, but does not support loading custom extensions or user-defined functions.
1. A small subset of advanced SQL features are currently unsupported; the only impact of this on the dbt adapter is that the dbt.listagg macro and foreign-key constraints will work against a local DuckDB database, but will not work against a MotherDuck database.

## Extensions
You can load any supported [DuckDB extensions](https://duckdb.org/docs/extensions/overview) by listing them in the `extensions` field in your profile. You can also set any additional [DuckDB configuration options](https://duckdb.org/docs/sql/configuration) via the `settings` field, including options that are supported in any loaded extensions.

As of `dbt-duckdb 1.4.1`, (experimental) support was added for DuckDB's filesystems implemented via `fsspec`. The fsspec library provides support for reading and writing files from a variety of cloud data storage systems including S3, GCS, and Azure Blob Storage. You can configure a list of fsspec-compatible implementations for use with your `dbt-duckdb` project by installing the relevant Python modules and configuring your profile like so:

```yml
default:
  outputs:
    dev:
      type: duckdb
      path: /tmp/dbt.duckdb
      filesystems:
        - fs: s3
          anon: false
          key: "{{ env_var('S3_ACCESS_KEY_ID') }}"
          secret: "{{ env_var('S3_SECRET_ACCESS_KEY') }}"
          client_kwargs:
            endpoint_url: "http://localhost:4566"
  target: dev
```

Here, the filesystems property takes a list of configurations, where each entry must have a property named `fs` that indicates which fsspec protocol to load (for example, s3, gcs, abfs) and then an arbitrary set of other key-value pairs that are used to configure the fsspec implementation. Refer to [this example project](https://dagster.io/blog/duckdb-data-lake) that illustrates the usage of this feature to connect to a localstack instance running S3 from dbt-duckdb.

## Secret Manager

To use the [DuckDB Secrets Manager](https://duckdb.org/docs/configuration/secrets_manager.html), you can use the secrets field. For example, to connect to S3 and read/write Parquet files using an AWS access key and secret, your profile should look something like this:

```yml
default:
  outputs:
    dev:
      type: duckdb
      path: /tmp/dbt.duckdb
      extensions:
        - httpfs
        - parquet
      secrets:
        - type: s3
          region: my-aws-region
          key_id: "{{ env_var('S3_ACCESS_KEY_ID') }}"
          secret: "{{ env_var('S3_SECRET_ACCESS_KEY') }}"
  target: dev
```

### Fetching credentials from context

Instead of specifying the credentials through the settings block, you can also use the `credential_chain` secret provider. This means that you can use any supported mechanism from AWS to obtain credentials (for example, web identity tokens). To use the `credential_chain` provider and automatically fetch credentials from AWS, specify the provider in the secrets key:

```yml
default:
  outputs:
    dev:
      type: duckdb
      path: /tmp/dbt.duckdb
      extensions:
        - httpfs
        - parquet
      secrets:
        - type: s3
          provider: credential_chain
  target: dev
```

## Attaching Additional Databases

DuckDB version `0.7.0` added support for [attaching additional databases](https://duckdb.org/docs/sql/statements/attach.html) to your `dbt-duckdb` run so that you can read and write from multiple databases. Additional databases may be configured using [dbt run hooks](/docs/build/hooks-operations) or via the attach argument in your profile that was added in `dbt-duckdb 1.4.0`:

```yml
default:
  outputs:
    dev:
      type: duckdb
      path: /tmp/dbt.duckdb
      attach:
        - path: /tmp/other.duckdb
        - path: ./yet/another.duckdb
          alias: yet_another
        - path: s3://yep/even/this/works.duckdb
          read_only: true
        - path: sqlite.db
          type: sqlite
```

The attached databases may be referred to in your dbt sources and models by either:

-  The basename of the database file, minus its suffix (for example `/tmp/other.duckdb` is the other database and `s3://yep/even/this/works.duckdb` is the works database). 

or 

- By an alias you specify (the `./yet/another.duckdb` database in the above configuration is referred to as `yet_another` instead of another). 

Note, these additional databases do not necessarily have to be DuckDB files. DuckDB's storage and catalog engines are pluggable. Additionally, DuckDB 0.7.0 ships with support for reading and writing from attached SQLite databases. You can indicate the type of the database you are connecting to via the type argument, which currently supports duckdb and sqlite.

## Plugins

`dbt-duckdb` has its own [plugin](https://github.com/duckdb/dbt-duckdb/blob/master/dbt/adapters/duckdb/plugins/__init__.py) system to enable advanced users to extend dbt-duckdb with additional functionality, including:
- Defining custom Python UDFs on the DuckDB database connection so that they can be used in your SQL models.
- Loading source data from Excel, Google Sheets, or SQLAlchemy tables.

You can find more details on [Writing Your Own Plugins](https://github.com/duckdb/dbt-duckdb#writing-your-own-plugins). 

To configure a plugin for use in your dbt project, use the `plugins` property on the profile:

```yml
default:
  outputs:
    dev:
      type: duckdb
      path: /tmp/dbt.duckdb
      plugins:
        - module: gsheet
          config:
            method: oauth
        - module: sqlalchemy
          alias: sql
          config:
            connection_url: "{{ env_var('DBT_ENV_SECRET_SQLALCHEMY_URI') }}"
        - module: path.to.custom_udf_module
```

Every plugin must have a module property that indicates where the plugin class to load is defined. There are a [set of built-in plugins](https://github.com/duckdb/dbt-duckdb/blob/master/dbt/adapters/duckdb/plugins) you can define, that may be referenced by their base filename (`excel` or `gsheet`), while user-defined plugins (which are described later in this document) should be referred to by their full module path name (such as, a `lib.my.custom` module that defines a class named plugin.)

Each plugin instance has a name for logging and reference purposes that defaults to the name of the module but that may be overridden by the user by setting the alias property in the configuration. Finally, modules may be initialized using an arbitrary set of key-value pairs that are defined in the config dictionary. In this example, the gsheet plugin is initialized with the setting method: oauth and the `sqlalchemy` plugin (aliased as "sql") is initialized with a `connection_url` that is set as an environment variable.

Note, using plugins may require you to add additional dependencies to the Python environment that your dbt-duckdb pipeline runs in:

- `excel` depends on `pandas`, and `openpyxl` or `xlsxwriter` to perform writes
- `gsheet` depends on `gspread` and `pandas`
- `iceberg` depends on `pyiceberg` and `Python >= 3.8`
- `sqlalchemy` depends on `pandas`, `sqlalchemy`, and the driver(s) you need

## Python Support

dbt added support for [Python models](/docs/build/python-models) in version `1.3.0`. For most data platforms, dbt will package up the Python code defined in a `.py` file and ship it off to be executed in whatever Python environment that data platform supports (for example, Snowpark for Snowflake or Dataproc for BigQuery). 

In `dbt-duckdb`, Python models are executed in the same process that owns the connection to the DuckDB database, which by default, is the Python process that is created when you run dbt. To execute the Python model, the `.py` file that your model is defined in is teated as a Python module and loaded into the running process using [`importlib`](https://docs.python.org/3/library/importlib.html). Then construct the arguments to the model function that you defined (a dbt object that contains the names of any ref and source information your model needs and a `DuckDBPyConnection` object for you to interact with the underlying DuckDB database), call the model function, and then materialize the returned object as a table in DuckDB.

The value of the `dbt.ref` and `dbt.source` functions inside of a Python model will be a [DuckDB Relation](https://duckdb.org/docs/api/python/reference/) object that can be easily converted into a Pandas/Polars DataFrame or an Arrow table. The return value of the model function can be any Python object that DuckDB knows how to turn into a table, including a Pandas/Polars DataFrame, a DuckDB Relation, or an Arrow Table, Dataset, RecordBatchReader, or Scanner.

### Batch Processing

As of version 1.6.1, it is possible to both read and write data in chunks, which allows for larger-than-memory datasets to be manipulated in Python models. Here is a basic example:

```py
import pyarrow as pa

def batcher(batch_reader: pa.RecordBatchReader):
    for batch in batch_reader:
        df = batch.to_pandas()
        # Do some operations on the DF...
        # ...then yield back a new batch
        yield pa.RecordBatch.from_pandas(df)

def model(dbt, session):
    big_model = dbt.ref("big_model")
    batch_reader = big_model.record_batch(100_000)
    batch_iter = batcher(batch_reader)
    return pa.RecordBatchReader.from_batches(batch_reader.schema, batch_iter)
```

### Using Local Python Modules

In `dbt-duckdb 1.6.0`, the profile setting `module_paths` was added which allows users to specify a list of paths on the file system that contain additional Python modules that should be added to the Python processes' `sys.path` property. This allows users to include additional helper Python modules in their dbt projects that can be accessed by running the dbt process and used to define custom dbt-duckdb plugins or library code that is helpful for creating dbt Python models.

## External Files

One of DuckDB's most powerful features is its ability to read and write CSV, JSON, and Parquet files directly, without needing to import/export them from the database first.

### Reading from external files

You may reference external files in your dbt models either directly or as dbt sources by configuring the `external_location` in either the meta or the config option on the source definition. The difference is that the settings under the meta option will be propagated to the documentation for the source generated in dbt docs generate, but the settings under the config option will not be. Any source settings that should be excluded from the docs should be specified by the config, while any options that you would like to be included in the generated documentation should live under meta.

```yml
sources:
  - name: external_source
    config:
      meta: # changed to config in v1.10
        external_location: "s3://my-bucket/my-sources/{name}.parquet"
    tables:
      - name: source1
      - name: source2
```

Here, the meta options on external_source defines `external_location` as an f-string that allows us to express a pattern that indicates the location of any of the tables defined for that source. 

So a dbt model like:

```sql
SELECT *
FROM {{ source('external_source', 'source1') }}
```

will be compiled as:

```sql
SELECT *
FROM 's3://my-bucket/my-sources/source1.parquet'
```

If one of the source tables deviates from the pattern or needs some other special handling, then the `external_location` can also be set on the meta options for the table itself, for example:

```yml
sources:
  - name: external_source
    config:
      meta: # changed to config in v1.10
        external_location: "s3://my-bucket/my-sources/{name}.parquet"
    tables:
      - name: source1
      - name: source2
        config:
          external_location: "read_parquet(['s3://my-bucket/my-sources/source2a.parquet', 's3://my-bucket/my-sources/source2b.parquet'])"
```

In this situation, the `external_location` setting on the source2 table will take precedence. 

A dbt model like:

```sql
SELECT *
FROM {{ source('external_source', 'source2') }}
```

will be compiled to the SQL query:

```sql
SELECT *
FROM read_parquet(['s3://my-bucket/my-sources/source2a.parquet', 's3://my-bucket/my-sources/source2b.parquet'])
```

Note that the value of the `external_location` property does not need to be a path-like string; it can also be a function call, which is helpful in the case that you have an external source that is a CSV file which requires special handling for DuckDB to load it correctly:

```yml
sources:
  - name: flights_source
    tables:
      - name: flights
        config:
          external_location: "read_csv('flights.csv', types={'FlightDate': 'DATE'}, names=['FlightDate', 'UniqueCarrier'])"
          formatter: oldstyle
```

Note, you will need to override the default `str.format` string formatting strategy for this example because the `types={'FlightDate': 'DATE'}` argument to the `read_csv` function will be interpreted by `str.format` as a template to be matched on. This will cause a `KeyError: "'FlightDate'"` when there's an attempt to parse the source in a dbt model. 

The formatter configuration option for the source indicates whether you should use newstyle string formatting (the default), oldstyle string formatting, or template string formatting. 

You can read up on the strategies for different string formatting techniques and find examples, in this [discussion of dbt-duckdb's integration test](https://stackoverflow.com/questions/78821149/formatting-strings-in-dask-duckdb).

You can also create dbt models that are backed by external files via the external materialization strategy:

```sql 
{{
  config(materialized='external', location='local/directory/file.parquet') 
}}

SELECT m.*, s.id IS NOT NULL as has_source_id
FROM {{ ref('upstream_model') }} m
LEFT JOIN {{ source('upstream', 'source') }} s USING (id)
```


| Option | Default | Description |
| --- | --- | --- |
| location | `external_location` macro | The path to write the external materialization to. See below for more details. |
| format | parquet |The format of the external file |(parquet, CSV, or JSON).
| delimiter | , | For CSV files, the delimiter to use for fields. |
| options | None | Any other options to pass to DuckDB's COPY operation (for example partition_by, codec, etc). |
| `glue_register` | false | If true, try to register the file created by this model with the AWS Glue Catalog. |
| `glue_database` | default | The name of the AWS Glue database to register the model with. |


If the location argument is specified, it must be a filename (or S3 bucket/path), and `dbt-duckdb` will attempt to infer the format argument from the file extension of the location if the format argument is unspecified (this functionality was added in version 1.4.1.)

If the location argument is not specified, then the external file will be named after the `model.sql` (or `model.py`) file that defined it with an extension that matches the format argument (parquet, CSV, or JSON). By default, the external files are created relative to the current working directory, but you can change the default directory (or S3 bucket/prefix) by specifying the `external_root` setting in your DuckDB profile.


`dbt-duckdb` supports the `delete+insert` and `append` [strategies](/docs/build/incremental-strategy#built-in-strategies) for incremental table models, but there's no support for incremental materialization strategies for external models.

### Registering External Models

When using `:memory:` as the DuckDB database, subsequent dbt runs can fail when selecting a subset of models that depend on external tables. This is because external files are only registered as DuckDB views when they are created, not when they are referenced. To overcome this issue, use the `register_upstream_external_models` macro that can be triggered at the beginning of a run. To enable this automatic registration, place the following in your `dbt_project.yml` file:


```yml
on-run-start:
  - "{{ register_upstream_external_models() }}"
```


