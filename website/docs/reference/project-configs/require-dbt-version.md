---
datatype: version-range | [version-range]
default_value: None
---
<File name='dbt_project.yml'>

```yml
require-dbt-version: version-range | [version-range]
```

</File>

## Definition

Optionally specify a range of dbt versions that a project is compatible with.

By using this configuration, dbt will throw a helpful error message if a user tries to run your project with an unsupported version of dbt. This is especially useful for packages (like [dbt-utils](https://github.com/fishtown-analytics/dbt-utils)). Additionally, this can help ensure that your whole team is synchronized on the same version of dbt for local development.

If this configuration is not specified, no version check will occur.

<Changelog>

* `v0.13.0`: This configuration was introduced

</Changelog>

:::info YAML Quoting

This configuration needs to be interpolated by the yaml parser as a string. As such, you should quote the value of the configuration. For example. Also take care to get the spacing correct.
```yml
# ✅ These will work
require-dbt-version: ">=0.16.0"
require-dbt-version: '>=0.16.0'

# ❌ These will not work
require-dbt-version: >=0.16.0
require-dbt-version: ">= 0.16.0"
```

:::


## Examples

### Require a specific dbt version
Use an exact version number. In this example, this project will only run with dbt v0.16.0 supported.

<File name='dbt_project.yml'>

```yml
require-dbt-version: 0.16.0

```

</File>

### Specify a minimum dbt version
Use a `>=` operator for a minimum boundary. In this example, this project will run with any version of dbt greater than or equal to 0.16.0.


<File name='dbt_project.yml'>

```yml
require-dbt-version: ">=0.16.0"

```

</File>


### Pin to a minor dbt version using a range
Use a comma separated list for an upper and lower bound. In this example, this project will run with dbt 0.16.x.

<File name='dbt_project.yml'>

```yml
require-dbt-version: ">=0.16.0,<0.17.0"

```

</File>

OR

<File name='dbt_project.yml'>

```yml
require-dbt-version: [">=0.16.0", "<0.17.0"]

```

</File>


## Invalid dbt versions

If the version of dbt used to invoke a project disagrees with the specified `require-dbt-version` in the project or _any_ of the included packages, then dbt will fail immediately with the following error:
```
$ dbt compile
Running with dbt=0.17.0
Encountered an error while reading the project:
Runtime Error
  This version of dbt is not supported with the 'my_project' package.
    Installed version of dbt: =0.16.0
    Required version of dbt for 'my_project': ['>=0.16.0', '<0.17.0']
  Check the requirements for the 'my_project' package, or run dbt again with --no-version-check
```

## Disabling version checks

To suppress failures to to incompatible dbt versions, supply the `--no-version-check` flag to `dbt run`.
```
$ dbt run --no-version-check
Running with dbt=0.17.0
Found 13 models, 2 tests, 1 archives, 0 analyses, 204 macros, 2 operations....
```

## Recommendation
* This is a recommended configuration
* You should pin your required dbt version to a minor release (see above [example](#pin-to-a-minor-dbt-version-using-a-range))
