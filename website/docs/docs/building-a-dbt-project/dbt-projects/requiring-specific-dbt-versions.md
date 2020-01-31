---
title: "Requiring specific dbt versions"
id: "requiring-specific-dbt-versions"
---

## Overview

The `require-dbt-version` option of `dbt_project.yml` can be used to throw a helpful error message if a user tries to run your project with an unsupported version of dbt. This is especially useful for packages (like [dbt-utils](https://github.com/fishtown-analytics/dbt-utils)). Additionally, this can help ensure that your whole team is synchronized on the same version of dbt for local development.

## Configuration

To specify compatible versions for a project, set the `require-dbt-version` config to a valid version identifier or range as shown here:

<File name='dbt_project.yml'>

```yaml

name: my_dbt_project

...

# Specify a requirement on an _exact_ version of dbt (0.13.0)
require-dbt-version: "0.13.0"

# Specify a minimum boundary on a dbt version
# Any version greater than or equal to 0.13.0 is supported
require-dbt-version: ">=0.13.0"

# Specify a range of supported versions
# Any 0.13.x version of dbt is supported
require-dbt-version: ">=0.13.0,<0.14.0"

```

</File>

## Invalid dbt versions

If the version of dbt used to invoke a project disagrees with the specified `require-dbt-version` in the project or _any_ of the included packages, then dbt will fail immediately with the following error:
```
$ dbt compile
Running with dbt=0.13.0
Encountered an error while reading the project:
Runtime Error
  This version of dbt is not supported with the 'my_project' package.
    Installed version of dbt: =0.13.0
    Required version of dbt for 'my_project': ['>=0.12.0', '<0.13.0']
  Check the requirements for the 'my_project' package, or run dbt again with --no-version-check
```

## Disabling version checks

To suppress failures to to incompatible dbt versions, supply the `--no-version-check` flag to `dbt run`.
```
$ dbt run --no-version check
Running with dbt=0.13.0
Found 13 models, 2 tests, 1 archives, 0 analyses, 204 macros, 2 operations....
```
