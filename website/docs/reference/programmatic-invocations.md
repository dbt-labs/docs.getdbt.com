---
title: "Programmatic invocations"
---

Programmatic invocations let you call dbt commands from Python scripts and applications, instead of running them in a shell. This is useful when you want to embed dbt runs into a larger application or workflow, while still using the same command surface area as the <Constant name="core" /> CLI.

Common use cases include:

- Running dbt as part of a Python application or service
- Integrating dbt runs into orchestration workflows
- Building internal tools that need to run dbt commands and inspect results

Refer to the [<Constant name="core" /> package on PyPI](https://pypi.org/project/dbt-core/) to install the official Python package for <Constant name="core" /> if you haven't done so already.

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

For implementation details, refer to the source definitions of `dbtRunner` and `dbtRunnerResult` in the [<Constant name="core" /> repository](https://github.com/dbt-labs/dbt-core/blob/1.latest/core/dbt/cli/main.py).

## Supported arguments

`dbtRunner.invoke` accepts the same arguments as the <Constant name="core" /> CLI. The first positional argument is the command (for example, `run`, `build`, `test`), followed by any flags and options you would normally pass on the command line.

For example, `dbt.invoke(["run", "--select", "tag:my_tag"])` is equivalent to running `dbt run --select tag:my_tag`. There is no separate, dbtRunner‑specific list of arguments; the authoritative source for available options is the CLI help reference (`dbt --help`, `dbt run --help`, and so on) and the [dbt command reference](/reference/dbt-commands) documentation.

```python
from dbt.cli.main import dbtRunner
dbt = dbtRunner()
# equivalent ways to pass arguments
dbt.invoke(["run", "--select", "tag:my_tag"])
dbt.invoke(["run"], select="tag:my_tag")
```

## Parallel execution not supported

[`dbt-core`](https://pypi.org/project/dbt-core/) doesn't support [safe parallel execution](/reference/dbt-commands#parallel-execution) for multiple invocations in the same process. Running multiple dbt commands concurrently in one process is unsafe and officially discouraged, and requires a wrapping process to manage subprocesses. This is because:

- Running concurrent commands can unexpectedly interact with the data platform. For example, running `dbt run` and `dbt build` for the same models simultaneously could lead to unpredictable results.
- Each `dbt-core` command interacts with global Python variables. To ensure safe operation, commands need to be executed in separate processes, for example by spawning subprocesses or using Celery for orchestration.

For [safe parallel execution](/reference/dbt-commands#available-commands), you can use the [<Constant name="platform_cli" />](/docs/platform/dbt-cli-installation) or [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio), both of which do that additional work to manage concurrency (multiple processes) on your behalf.

## `dbtRunnerResult`

Each command returns a `dbtRunnerResult` object with three attributes:

- `success` (bool): Whether the command succeeded.
- `result`: When the command completes (successfully or with handled errors), it returns the command's result(s). The return type varies by command.
- `exception`: When the dbt invocation encounters an unhandled error and does not complete, the exception that was raised.

There is a one-to-one correspondence between [CLI exit codes](/reference/exit-codes) and the `dbtRunnerResult` returned by a programmatic invocation:

| Scenario                                                                                    | CLI Exit Code | `success` | `result`         | `exception` |
|---------------------------------------------------------------------------------------------|--------------:|-----------|-------------------|-------------|
| Invocation completed without error                                                          | 0             | `True`      | varies by command | `None`        |
| Invocation completed with at least one handled error (for example, test failure or model build error) | 1             | `False`     | varies by command | `None`        |
| Unhandled error. Invocation did not complete, and returns no results.                       | 2             | `False`     | `None`              | Exception   |

## Commitments and caveats

We're making an ongoing commitment to providing a Python entry point at functional parity with <Constant name="core" />'s CLI. We reserve the right to change the underlying implementation used to achieve that goal. We expect that the current implementation will unlock real use cases in the short- and medium-term while we work on a set of stable, long-term interfaces that will ultimately replace it.

In particular, the objects returned by each command in `dbtRunnerResult.result` are not fully contracted, and therefore liable to change. Some of the returned objects are partially documented, because they overlap in part with the contents of [dbt artifacts](/reference/artifacts/dbt-artifacts). As Python objects, they contain many more fields and methods than what's available in the serialized JSON artifacts. These additional fields and methods should be considered **internal and liable to change in future versions of dbt-core.**

## Advanced usage patterns

:::caution
The syntax and support for these patterns are liable to change in future versions of `dbt-core`.
:::

The goal of `dbtRunner` is to offer parity with CLI workflows within a programmatic environment. There are a few advanced usage patterns that extend what's possible with the CLI.

### Reusing objects

Pass pre-constructed objects into `dbtRunner`, to avoid recreating those objects by reading files from disk. Currently, the only object supported is the `Manifest` (project contents).

```python
from dbt.cli.main import dbtRunner, dbtRunnerResult
from dbt.contracts.graph.manifest import Manifest

# use 'parse' command to load a Manifest
res: dbtRunnerResult = dbtRunner().invoke(["parse"])
manifest: Manifest = res.result

# introspect manifest
# for example, assert every public model has a description
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


```python
from dbt.cli.main import dbtRunner
from dbt_common.events.base_types import EventMsg

def print_version_callback(event: EventMsg):
    if event.info.name == "MainReportVersion":
        print(f"We are thrilled to be running dbt{event.data.version}")

dbt = dbtRunner(callbacks=[print_version_callback])
dbt.invoke(["list"])
```


### Overriding parameters

Pass in parameters as keyword arguments, instead of a list of CLI-style strings. At present, dbt will not do any validation or type coercion on your inputs. The command must be specified, in a list, as the first positional argument.
```python
from dbt.cli.main import dbtRunner
dbt = dbtRunner()

# these are equivalent
dbt.invoke(["--fail-fast", "run", "--select", "tag:my_tag"])
dbt.invoke(["run"], select=["tag:my_tag"], fail_fast=True)
```
