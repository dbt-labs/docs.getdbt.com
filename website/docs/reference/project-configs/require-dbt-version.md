---
datatype: version-range | [version-range]
description: "Read this guide to understand the require-dbt-version configuration in dbt."
default_value: None
---


<File name='dbt_project.yml'>

```yml
require-dbt-version: version-range | [version-range]
```

</File>

## Definition

You can use `require-dbt-version` to restrict your project to only work with a range of dbt versions.

When you set this configuration:
- If you have installed packages from the [dbt Packages hub](https://hub.getdbt.com/) that specify a `require_dbt_version` that doesn't match, running dbt commands will result in an error. 
- It helps package maintainers (such as [dbt-utils](https://github.com/dbt-labs/dbt-utils)) ensure that users' dbt version is compatible with the package. 
- It signals [compatibility with <Constant name="fusion_engine"/>](#fusion-compatibility) (`2.0.0` and higher).
- It might also help your whole team remain synchronized on the same version of dbt for local development, to avoid compatibility issues from changed behavior.

You should pin to a major release. See [pin to a range](#pin-to-a-range) for more details. If this configuration isn't specified, no version check will occur.

:::info <Constant name="cloud" /> release tracks 

<Snippet path="_config-dbt-version-check" />

:::

## YAML quoting

This configuration needs to be interpolated by the YAML parser as a string. As such, you should quote the value of the configuration, taking care to avoid whitespace. For example:
```yml
# ✅ These will work
require-dbt-version: ">=1.0.0" # Double quotes are OK
require-dbt-version: '>=1.0.0' # So are single quotes

# ❌ These will not work
require-dbt-version: >=1.0.0 # No quotes? No good
require-dbt-version: ">= 1.0.0" # Don't put whitespace after the equality signs
```

#### Avoid unbounded upper limits

We recommend [defining both lower and upper bounds](#pin-to-a-range), such as `">=1.0.0,<3.0.0"`, to ensure stability across releases.  We don't recommend having an unbounded `require-dbt-version` (for example, `">=1.0.0"`). Without an upper limit, a project may break when dbt releases a new major version. 

## Fusion compatibility
The `require-dbt-version` also signals whether a project or package supports the [<Constant name="fusion_engine"/>](/docs/fusion) (`2.0.0` and higher).

- If it excludes `2.0.0`, <Constant name="fusion"/> will warn today and error in a future release, matching <Constant name="core"/> behavior.
- You can [bypass version checks](#disabling-version-checks) with `--no-version-check`. 

Refer to [pin to a range](#pin-to-a-range) for more info on how to define a version range.

<Expandable alt_header="Use dbt-autofix to update dbt projects and packages">

[`dbt-autofix` tool](https://github.com/dbt-labs/dbt-autofix) automatically scans your dbt project for deprecated configurations and updates them to align with the latest best practices and prepare for <Constant name="fusion"/> migration. 

When it runs, `dbt-autofix` will:
- Check your `packages.yml` to determine which packages it can automatically upgrade.
- Look for packages that list `require-dbt-version: 2.0.0` or higher (indicating <Constant name="fusion"/> support).
- Upgrade those packages to the lowest version that supports <Constant name="fusion"/>.

This ensures that `dbt-autofix` only updates packages that are confirmed to work with <Constant name="fusion"/> and avoids updating packages that are known to be incompatible with <Constant name="fusion"/>.

</Expandable>

## Examples

The following examples showcase how to use the `require-dbt-version`:

<!-- no toc -->
- [Specify a minimum dbt version](#specify-a-minimum-dbt-version) &mdash; Use a <code>>=</code> operator for a minimum boundary.
- [Pin to a range](#pin-to-a-range) &mdash; Use a comma separated list to specify an upper and lower bound.
- [Require a specific dbt version](#require-a-specific-dbt-version) &mdash; Restrict your project to run only with an exact version of <Constant name="core" />.

### Specify a minimum dbt version
Use a `>=` operator to specify a lower and an upper limit. For example:

<File name='dbt_project.yml'>

```yml 
require-dbt-version: ">=1.9.0" # project will only work with versions 1.9 and higher.
require-dbt-version: ">=2.0.0" # project will only work with the dbt Fusion engine (v2.0.0 and higher).
```

</File>

Remember, having an unbounded upper limit isn't recommended. Instead, check out the [pin to a range](#pin-to-a-range) example to define a range with both a lower and upper limit to ensure stability across releases.

### Pin to a range
Use a comma separated list for an upper and lower bound. You can define a version range either as a YAML list (using square brackets) or as a comma-delimited string &mdash; both forms are valid and work.

To signal compatibility with the <Constant name="fusion_engine"/>, include `2.0.0` or higher in your version range. Both of the following formats are valid:

<File name='dbt_project.yml'>

```yaml
require-dbt-version: [">=1.10.0", "<3.0.0"]

# or

require-dbt-version: ">=1.10.0,<3.0.0"
```
</File>

If your range excludes 2.0.0 (for example, `>=1.6.0,<2.0.0`), <Constant name="fusion"/> will show a warning now and error in a future release. You can [bypass version checks](#disabling-version-checks) with `--no-version-check`.

 ### Require a specific dbt version

:::info Not recommended
Pinning to a specific dbt version is discouraged because it limits project flexibility and can cause compatibility issues, especially with dbt packages. It's recommended to [pin to a major release](#pin-to-a-range), using a version range (for example, `">=1.0.0", "<2.0.0"`) for broader compatibility and to benefit from updates.

While you can restrict your project to run only with an exact version of <Constant name="core" />, we do not recommend this for <Constant name="core" /> v1.0.0 and higher. 

:::

In the following example, the project will only run with dbt v1.5: 

<File name='dbt_project.yml'>

```yml
require-dbt-version: "1.5.0"
```

</File>

## Invalid dbt versions

If the version of dbt used to invoke a project disagrees with the specified `require-dbt-version` in the project or _any_ of the included packages, then dbt will fail immediately with the following error:
```
$ dbt compile
Running with dbt=1.5.0
Encountered an error while reading the project:
Runtime Error
  This version of dbt is not supported with the 'my_project' package.
    Installed version of dbt: =1.5.0
    Required version of dbt for 'my_project': ['>=1.6.0', '<2.0.0']
  Check the requirements for the 'my_project' package, or run dbt again with --no-version-check
```

## Disabling version checks

To suppress failures to to incompatible dbt versions, supply the `--no-version-check` flag to `dbt run`.
```
$ dbt run --no-version-check
Running with dbt=1.5.0
Found 13 models, 2 tests, 1 archives, 0 analyses, 204 macros, 2 operations....
```

See [global configs](/reference/global-configs/version-compatibility) for usage details.
