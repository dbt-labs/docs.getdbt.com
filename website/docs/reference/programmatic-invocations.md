---
title: "Programmatic invocations"
---

In v1.5, dbt-core added support for programmatic invocations. The intent of this entry point is provide **exact parity** with CLI functionality, callable from within a Python script or application.

The main entry point is a `dbtRunner` class that wraps around `dbt-core`'s CLI, and allows you to "invoke" CLI commands as Python methods. Each command returns a `dbtRunnerResult` object, which has three attributes:
- `success` (bool): Whether the command succeeded.
- `result`: If the command completed (successfully or with handled errors), its result(s). Return type varies by command.
- `exception`: If the dbt invocation encountered an unhandled error and did not complete, the exception it encountered.

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

### `dbtRunnerResult` and exit codes

There is a 1:1 correspondence between [CLI exit codes](reference/exit-codes) and the `dbtRunnerResult` returned by a programmatic invocation:
1. Completed without error: `success=True`, exit code `0`, `result` populated based on the command, `exception` empty.
2. At least one handled error (e.g. test failure, model build error): `success=False`, exit code `1`, `result` populated (based on the command), `exception` empty.
3. Unhandled error: `success=False`, exit code `2`, `exception` populated with top-level error, `result` empty because the invocation did not gracefully complete and return results.

### Caveats

We are not committed to this interface forever. We expect it to unlock real use cases in the short & medium term while we work on a more stable long-term interface into dbt-core as a mature library & Python SDK.

- The `results` objects returned by each command are liable to change. Some of these objects are already contracted, in part, because they overlap with [dbt artifacts](dbt-artifacts).

### Advanced usage patterns

:::caution
The syntax and support for these patterns are liable to change in future versions of `dbt-core`.
:::

The goal of `dbtRunner` is to offer parity with CLI workflows, within a programmatic environment. There are a few advanced usage patterns that extend what's possible with the CLI.

Pass pre-constructed objects into `dbtRunner`, to avoid recreating those objects by reading files from disk. Currently, the only object supported is the `Manifest`.

```python
from dbt.cli.main import dbtRunner, dbtRunnerResult
from dbt.contracts.graph.manifest import Manifest

# use 'parse' command to load a Manifest
res: dbtRunnerResult = dbtRunner().invoke(["parse"])
manifest: Manifest = res.result

# introspect manifest
for node in manifest.nodes.values():
    if node.resource_type == "model" and node.access == "public":
        assert node.description != ""

# reuse this manifest in subsequent commands to skip parsing
dbt = dbtRunner(manifest=manifest)
cli_args = ["run", "--select", "tag:my_tag"]
res: dbtRunnerResult = dbt.invoke(cli_args)
```

Register a `callback` on the `EventManager`, to access structured events and enable custom logging.
```python
from dbt.cli.main import dbtRunner
from dbt.events.base_types import EventMsg

def print_version_callback(event: EventMsg):
    if event.info.name == "MainReportVersion":
        print(f"We are thrilled to be running dbt{event.data.version}")

dbt = dbtRunner(callbacks=[print_version_callback])
dbt.invoke(["list"])
```

Pass in params as `**kwargs`, instead of passing in a list of CLI-style strings. At present, dbt will not do any validation or type coercion on your inputs. The subcommand must be specified, in a list, as the first positional argument.
```python
from dbt.cli.main import dbtRunner
dbt = dbtRunner()
dbt.invoke(["run"], select=["tag:my_tag"], fail_fast=True)
```
