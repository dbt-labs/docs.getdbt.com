---
title: "Python models"
sidebar_label: "Python models"
description: "Run Python models in dbt-duckdb, process data in batches for larger-than-memory datasets, and import local Python modules."
---

<VersionBlock lastVersion="1.99">

dbt supports [Python models](/docs/build/python-models) in <Constant name="core" /> 1.3 and later. In `dbt-duckdb`, Python models run in the same process that owns the DuckDB connection. The `.py` file is loaded as a Python module using [`importlib`](https://docs.python.org/3/library/importlib.html), the `model` function is called with a `dbt` object (containing `ref` and `source` information) and a `DuckDBPyConnection` object, and the returned object is materialized as a table.

The value of `dbt.ref` and `dbt.source` inside a Python model will be a [DuckDB Relation](https://duckdb.org/docs/api/python/reference/) object that you can convert into a Pandas/Polars DataFrame or an Arrow table. The return value can be any object DuckDB knows how to turn into a table, including a Pandas/Polars DataFrame, a DuckDB Relation, or an Arrow Table, Dataset, RecordBatchReader, or Scanner.

### Process data in batches

In `dbt-duckdb` 1.6.1 and later, you can read and write data in chunks so you can work with larger-than-memory datasets in Python models:

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

### Use local Python modules

The `module_paths` profile setting lets you specify a list of filesystem paths containing additional Python modules. These paths are added to the dbt process's `sys.path`, which makes the modules importable within dbt. You can use this to include helper code in your project, such as custom `dbt-duckdb` plugins or shared libraries for Python models.

</VersionBlock>
