---
title: "Python SDK"
id: sl-python
description: "Learn how to use the dbt Semantic Layer SDK for Python library to interact with the dbt Semantic Layer."
tags: [Semantic Layer, APIs]
keywords: [dbt Cloud, API, dbt Semantic Layer, python]
sidebar_label: "Python SDK"
---

The `dbt-sl-sk` Python software development kit (SDK) is a Python library that provides you with easy access to the dbt Semantic Layer with Python. It allows developers to interact with the Semantic Layer APIs and query metrics and dimensions in downstream tools.

## Installation

To install the SDK, you'll need to specify optional dependencies depending on whether you want to use it synchronously (backed by [requests](https://github.com/psf/requests/)) or with [asyncio](https://docs.python.org/3/library/asyncio.html) (backed by [aiohttp](https://github.com/aio-libs/aiohttp/)).

#### Sync installation

```bash
pip install dbt-sl-sdk[sync]
```
#### Async installation

```bash
pip install dbt-sl-sdk[async]
```

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

## asyncio usage
If you're using asyncio, import `AsyncSemanticLayerClient` from `dbtsl.asyncio`. The APIs of `SemanticLayerClient` and `AsyncSemanticLayerClient` are identical, but the async version has async methods that you need to `await`.

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

## Integrating with dataframe libraries

The SDK returns all query data as [pyarrow](https://arrow.apache.org/docs/python/index.html) tables. 

To use the data with libraries like [pandas](https://pandas.pydata.org/) or [polars](https://pola.rs/), manually convert the data into the desired format:

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
For additional usage examples, check out our [usage examples](https://github.com/dbt-labs/semantic-layer-sdk-python/tree/main/examples), which include:

- Fetching dimension values
- Fetching metrics async and async
- List saved queries async
- and more.

## Disabling telemetry
By default, the SDK sends some [platform-related information](https://arc.net/l/quote/chejsupc) to dbt Labs. To opt out, set the `PLATFORM.anonymous` attribute to `True`:

```python
from dbtsl.env import PLATFORM
PLATFORM.anonymous = True

# ... initialize client
```

## Contributing
To contribute to this project, check out our [contribution guidelines](https://github.com/dbt-labs/semantic-layer-sdk-python/blob/main/CONTRIBUTING.md) and open a GitHub [issue](https://github.com/dbt-labs/semantic-layer-sdk-python/issues) or [pull request](https://github.com/dbt-labs/semantic-layer-sdk-python/pulls). 
