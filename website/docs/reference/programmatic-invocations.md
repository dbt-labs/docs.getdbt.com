---
title: "Programmatic invocations"
---

In v1.5, dbt-core added support for programmatic invocations. The intent is to expose the existing dbt Core CLI via a Python entry point, such that top-level commands are callable from within a Python script or application.

The entry point is a `dbtRunner` class, which allows you to `invoke` the same commands as on the CLI.

```python
from dbt.cli.main import dbtRunner, dbtRunnerResult

# initialize
dbt = dbtRunner()

# create CLI args as a list of strings
cli_args = ["run", "--select", "tag:my_tag"]

# run the command
res: dbtRunnerResult = dbt.invoke(cli_args)

# inspect the results
for r in res.result:
    print(f"{r.node.name}: {r.status}")
```

## Parallel execution not supported

[`dbt-core`](https://pypi.org/project/dbt-core/) doesn't support [safe parallel execution](/reference/dbt-commands#parallel-execution) for multiple invocations in the same process. This means it's not safe to run multiple dbt commands concurrently. It's officially discouraged and requires a wrapping process to handle sub-processes. This is because:

- Running concurrent commands can unexpectedly interact with the data platform. For example, running `dbt run` and `dbt build` for the same models simultaneously could lead to unpredictable results.
- Each `dbt-core` command interacts with global Python variables. To ensure safe operation, commands need to be executed in separate processes, which can be achieved using methods like spawning processes or using tools like Celery.

To run [safe parallel execution](/reference/dbt-commands#available-commands), you can use the [dbt Cloud CLI](/docs/cloud/cloud-cli-installation) or [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud), both of which does that additional work to manage concurrency (multiple processes) on your behalf.

## `dbtRunnerResult`

Each command returns a `dbtRunnerResult` object, which has three attributes:
- `success` (bool): Whether the command succeeded.
- `result`: If the command completed (successfully or with handled errors), its result(s). Return type varies by command.
- `exception`: If the dbt invocation encountered an unhandled error and did not complete, the exception it encountered.

There is a 1:1 correspondence between [CLI exit codes](/reference/exit-codes) and the `dbtRunnerResult` returned by a programmatic invocation:

| Scenario                                                                                    | CLI Exit Code | `success` | `result`         | `exception` |
|---------------------------------------------------------------------------------------------|--------------:|-----------|-------------------|-------------|
| Invocation completed without error                                                          | 0             | `True`      | varies by command | `None`        |
| Invocation completed with at least one handled error (e.g. test failure, model build error) | 1             | `False`     | varies by command | `None`        |
| Unhandled error. Invocation did not complete, and returns no results.                       | 2             | `False`     | `None`              | Exception   |

## Commitments & Caveats

From dbt Core v1.5 onward, we making an ongoing commitment to providing a Python entry point at functional parity with dbt-core's CLI. We reserve the right to change the underlying implementation used to achieve that goal. We expect that the current implementation will unlock real use cases, in the short & medium term, while we work on a set of stable, long-term interfaces that will ultimately replace it.

In particular, the objects returned by each command in `dbtRunnerResult.result` are not fully contracted, and therefore liable to change. Some of the returned objects are partially documented, because they overlap in part with the contents of [dbt artifacts](/reference/artifacts/dbt-artifacts). As Python objects, they contain many more fields and methods than what's available in the serialized JSON artifacts. These additional fields and methods should be considered **internal and liable to change in future versions of dbt-core.**

## Advanced usage patterns

:::caution
The syntax and support for these patterns are liable to change in future versions of `dbt-core`.
:::

The goal of `dbtRunner` is to offer parity with CLI workflows, within a programmatic environment. There are a few advanced usage patterns that extend what's possible with the CLI.

### Reusing objects

Pass pre-constructed objects into `dbtRunner`, to avoid recreating those objects by reading files from disk. Currently, the only object supported is the `Manifest` (project contents).

```python
from dbt.cli.main import dbtRunner, dbtRunnerResult
from dbt.contracts.graph.manifest import Manifest

# use 'parse' command to load a Manifest
res: dbtRunnerResult = dbtRunner().invoke(["parse"])
manifest: Manifest = res.result

# introspect manifest
# e.g. assert every public model has a description
for node in manifest.nodes.values():
    if node.resource_type == "model" and node.access == "public":
        assert node.description != "", f"{node.name} is missing a description"

# reuse this manifest in subsequent commands to skip parsing
dbt = dbtRunner(manifest=manifest)
cli_args = ["run", "--select", "tag:my_tag"]
res = dbt.invoke(cli_args)
```

### Registering callbacks

Register `callbacks` on dbt's `EventManager`, to access structured events and enable custom logging. The current behavior of callbacks is to block subsequent steps from proceeding; this functionality is not guaranteed in future versions.

<VersionBlock firstVersion="1.8">

```python
from dbt.cli.main import dbtRunner
from dbt_common.events.base_types import EventMsg

def print_version_callback(event: EventMsg):
    if event.info.name == "MainReportVersion":
        print(f"We are thrilled to be running dbt{event.data.version}")

dbt = dbtRunner(callbacks=[print_version_callback])
dbt.invoke(["list"])
```

</VersionBlock>

<VersionBlock lastVersion="1.7">

```python
from dbt.cli.main import dbtRunner
from dbt.events.base_types import EventMsg

def print_version_callback(event: EventMsg):
    if event.info.name == "MainReportVersion":
        print(f"We are thrilled to be running dbt{event.data.version}")

dbt = dbtRunner(callbacks=[print_version_callback])
dbt.invoke(["list"])
```

</VersionBlock>

### Overriding parameters

Pass in parameters as keyword arguments, instead of a list of CLI-style strings. At present, dbt will not do any validation or type coercion on your inputs. The subcommand must be specified, in a list, as the first positional argument.
```python
from dbt.cli.main import dbtRunner
dbt = dbtRunner()

# these are equivalent
dbt.invoke(["--fail-fast", "run", "--select", "tag:my_tag"])
dbt.invoke(["run"], select=["tag:my_tag"], fail_fast=True)
```
