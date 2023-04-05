---
title: "Programmatic invocations"
---

In v1.5, dbt-core added support for a first-ever Python API for programmatic invocations. The intent of this API is to provide **exact parity** with CLI functionality, callable from within a Python script or application.

The entry point is a `dbtRunner` class that wraps around the `dbt-core` CLI and allows you to "invoke" CLI commands as Python methods. Each command returns a tuple of:
- `results` (return type depends on command)
- `success` (boolean): whether the command succeeded

```python
from dbt.cli.main import dbtRunner

# initialize
dbt = dbtRunner()

# create CLI args as a list of strings
cli_args = ['run', '--select', 'some_models']

# run the command
results: List[Any]
success: boolean
results, success = dbt.invoke(cli_args)
```

### Caveats

We are not committed to this interface forever. We expect it to unlock real use cases in the short & medium term while we work on a more stable long-term interface into dbt-core as a mature library & Python SDK.

- The `results` objects returned by each command are liable to change. Some of these objects are already contracted, in part, because they overlap with [dbt artifacts](dbt-artifacts).

### Advanced usage patterns

Pass pre-constructed objects into `dbtRunner`, to avoid recreating those objects by reading files from disk.

```python
import os
from dbt.cli.main import dbtRunner

# load profile + project
project_dir = os.getcwd()
profile = load_profile(project_dir, {}, 'testing-postgres')
project = load_project(project_dir, False, profile, {})
  
# initialize the runner with pre-loaded profile and project
dbt = dbtRunner(profile=profile, project=project)

# use 'parse' command to load a Manifest
results, success = dbt.invoke(['parse'])
# TODO get manifest from parse results

dbt = dbtRunner(profile=profile, project=project, manifest=manifest)

# run more commands, re-using the components saved above
res, success = dbt.invoke(cli_args)
```

Register a `callback` on the `EventManager`, to access structured events and enable custom logging.
```
TODO
```

Pass in params as `**kwargs`, instead of parsing from a list of strings (CLI-style).
```
TODO
```
