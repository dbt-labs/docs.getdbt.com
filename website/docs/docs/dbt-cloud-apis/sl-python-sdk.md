---
title: "Python SDK"
id: sl-python
description: "Learn how to use the dbt Semantic Layer Python SDK library to interact with the dbt Semantic Layer."
tags: [Semantic Layer, APIs]
keywords: [dbt Cloud, API, dbt Semantic Layer, python, sdk]
sidebar_label: "Python SDK"
---

The [`dbt-sl-sdk` Python software development kit](https://github.com/dbt-labs/semantic-layer-sdk-python) (SDK) is a Python library that provides you with easy access to the dbt Semantic Layer with Python. It allows developers to interact with the dbt Semantic Layer APIs and query metrics and dimensions in downstream tools. 

## Installation

To install the Python SDK, you'll need to specify optional dependencies depending on whether you want to use it synchronously, backed by [requests](https://github.com/psf/requests/), or with asynchronous ([asyncio](https://docs.python.org/3/library/asyncio.html) backed by [aiohttp](https://github.com/aio-libs/aiohttp/)).

The Python SDK supports the Long-Term Support (LTS) versions of Python, such as 3.9, 3.10, 3.11, and 3.12. When Python discontinues support for a version, the Python SDK will also discontinue support for that version. If you’re using a non-supported version, you may experience compatibility issues and won’t receive updates or security patches from the SDK.

<Tabs>
<TabItem value="sync" label="Sync installation">

Sync installation means your program waits for each task to finish before moving on to the next one. 

It's simpler, easier to understand, and suitable for smaller tasks or when your program doesn't need to handle many tasks at the same time.

```bash
pip install "dbt-sl-sdk[sync]"
```
If you're using async frameworks like [FastAPI](https://fastapi.tiangolo.com/) or [Strawberry](https://github.com/strawberry-graphql/strawberry), installing the sync version of the SDK will block your event loop and can significantly slow down your program. In this case, we strongly recommend using async installation.

</TabItem>

<TabItem value="async" label="Async installation">

Async installation means your program can start a task and then move on to other tasks while waiting for the first one to finish. This can handle many tasks at once without waiting, making it faster and more efficient for larger tasks or when you need to manage multiple tasks at the same time. 

For more details, refer to [asyncio](https://docs.python.org/3/library/asyncio.html).

```bash
pip install "dbt-sl-sdk[sync]"
```

Since the [Python ADBC driver](https://github.com/apache/arrow-adbc/tree/main/python/adbc_driver_manager) doesn't yet support asyncio natively, `dbt-sl-sdk` uses a [`ThreadPoolExecutor`](https://github.com/dbt-labs/semantic-layer-sdk-python/blob/5e52e1ca840d20a143b226ae33d194a4a9bc008f/dbtsl/api/adbc/client/asyncio.py#L62) to run `query` and `list dimension-values` (all operations that are done with ADBC).  This is why you might see multiple Python threads spawning.

If you're using async frameworks like [FastAPI](https://fastapi.tiangolo.com/) or [Strawberry](https://github.com/strawberry-graphql/strawberry), installing the sync version of the Python SDK will block your event loop and can significantly slow down your program. In this case, we strongly recommend using async installation.

</TabItem>
</Tabs>

## Usage
To run operations against the Semantic Layer APIs, instantiate (create an instance of) a `SemanticLayerClient` with your specific [API connection parameters](/docs/dbt-cloud-apis/sl-api-overview):

```python
from dbtsl import SemanticLayerClient

client = SemanticLayerClient(
    environment_id=123,
    auth_token="<your-semantic-layer-api-token>",
    host="semantic-layer.cloud.getdbt.com",
)

# query the first metric by `metric_time`
def main():
    with client.session():
        metrics = client.metrics()
        table = client.query(
            metrics=[metrics[0].name],
            group_by=["metric_time"],
        )
        print(table)

main()
```

**Note**: All method calls that reach out to the APIs need to be within a `client.session()` context manager. This allows the client to establish a connection to the APIs only once and reuse the same connection between API calls. 

We recommend creating an application-wide session and reusing the same session throughout the application for optimal performance. Creating a session per request is discouraged and inefficient.

### asyncio usage
If you're using asyncio, import `AsyncSemanticLayerClient` from `dbtsl.asyncio`. The `SemanticLayerClient` and `AsyncSemanticLayerClient` APIs are identical, but the async version has async methods that you need to `await`.

```python
import asyncio
from dbtsl.asyncio import AsyncSemanticLayerClient

client = AsyncSemanticLayerClient(
    environment_id=123,
    auth_token="<your-semantic-layer-api-token>",
    host="semantic-layer.cloud.getdbt.com",
)

async def main():
    async with client.session():
        metrics = await client.metrics()
        table = await client.query(
            metrics=[metrics[0].name],
            group_by=["metric_time"],
        )
        print(table)

asyncio.run(main())

```

## Integrate with dataframe libraries

The Python SDK returns all query data as [pyarrow](https://arrow.apache.org/docs/python/index.html) tables. 

The Python SDK library doesn't come bundled with [Polars](https://pola.rs/) or [Pandas](https://pandas.pydata.org/). If you use these libraries, add them as dependencies in your project.

To use the data with libraries like Polars or Pandas, manually convert the data into the desired format. For example:

#### If you're using pandas

```python
# ... initialize client

arrow_table = client.query(...)
pandas_df = arrow_table.to_pandas()

```

#### If you're using polars

```python
import polars as pl

# ... initialize client

arrow_table = client.query(...)
polars_df = pl.from_arrow(arrow_table)
```

## Usage examples
For additional usage examples, check out the [usage examples](https://github.com/dbt-labs/semantic-layer-sdk-python/tree/main/examples), some of which include:

- [Fetching dimension values sync](https://github.com/dbt-labs/semantic-layer-sdk-python/blob/main/examples/fetch_dimension_values_sync.py)
- Fetching metrics [async](https://github.com/dbt-labs/semantic-layer-sdk-python/blob/main/examples/fetch_metric_async.py) and [sync](https://github.com/dbt-labs/semantic-layer-sdk-python/blob/main/examples/fetch_metric_sync.py)
- [List saved queries async](https://github.com/dbt-labs/semantic-layer-sdk-python/blob/main/examples/list_saved_queries_async.py)

## Disable telemetry
By default, the Python SDK sends some [platform-related information](https://github.com/dbt-labs/semantic-layer-sdk-python/blob/main/dbtsl/env.py) to dbt Labs. To opt-out, set the `PLATFORM.anonymous` attribute to `True`:

```python
from dbtsl.env import PLATFORM
PLATFORM.anonymous = True

# ... initialize client
```

## Contribute
To contribute to this project, check out our [contribution guidelines](https://github.com/dbt-labs/semantic-layer-sdk-python/blob/main/CONTRIBUTING.md) and open a GitHub [issue](https://github.com/dbt-labs/semantic-layer-sdk-python/issues) or [pull request](https://github.com/dbt-labs/semantic-layer-sdk-python/pulls). 
