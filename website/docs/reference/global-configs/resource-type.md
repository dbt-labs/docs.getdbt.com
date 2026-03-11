---
title: "Resource type"
id: "resource-type"
sidebar: "resource type"
---

<VersionBlock firstVersion="2.0">

:::info Renamed in the <Constant name="fusion_engine" />
The `--resource-type` and `--exclude-resource-type` flags have been renamed to `--resource-types` and `--exclude-resource-types` (plural) in the <Constant name="fusion_engine" />. Update your commands and job definitions accordingly. [Learn more about deprecated flags](/docs/dbt-versions/core-upgrade/upgrading-to-fusion#deprecated-flags).
:::

</VersionBlock>

<VersionBlock firstVersion="2.0">

The `--resource-types` and `--exclude-resource-types` flags include or exclude resource types from the `dbt build`, `dbt test`, `dbt clone`, and `dbt list` commands.

</VersionBlock>

<VersionBlock lastVersion="1.99">

The `--resource-type` and `--exclude-resource-type` flags include or exclude resource types from the `dbt build`, `dbt test`, `dbt clone`, and `dbt list` commands.

</VersionBlock>

This means the flags enable you to specify which types of resources to include or exclude when running the commands, instead of targeting specific resources.

<VersionBlock firstVersion="2.0">

:::tip Note
The `--exclude-resource-types` flag is only available in dbt version 1.8 and higher. If you're using older versions, this flag won't be available.
:::

</VersionBlock>

<VersionBlock lastVersion="1.99">

:::tip Note
The `--exclude-resource-type` flag is only available in dbt version 1.8 and higher. If you're using older versions, this flag won't be available.
:::

</VersionBlock>

The available resource types are:

<VersionBlock lastVersion="1.10">

- [`analysis`](/docs/build/analyses)
- [`exposure`](/docs/build/exposures)
- [`metric`](/docs/build/build-metrics-intro)
- [`model`](/docs/build/models)
- [`saved_query`](/docs/build/saved-queries)
- [`seed`](/docs/build/seeds)
- [`semantic_model`](/docs/build/semantic-models)
- [`snapshot`](/docs/build/snapshots)
- [`source`](/docs/build/sources)
- [`test`](/docs/build/data-tests)
- [`unit_test`](/docs/build/unit-tests)
</VersionBlock>

<VersionBlock firstVersion="1.11"> 

- [`analysis`](/docs/build/analyses)
- [`exposure`](/docs/build/exposures)
- [`function`](/docs/build/udfs)
- [`metric`](/docs/build/build-metrics-intro)
- [`model`](/docs/build/models)
- [`saved_query`](/docs/build/saved-queries)
- [`seed`](/docs/build/seeds)
- [`semantic_model`](/docs/build/semantic-models)
- [`snapshot`](/docs/build/snapshots)
- [`source`](/docs/build/sources)
- [`test`](/docs/build/data-tests)
- [`unit_test`](/docs/build/unit-tests)
</VersionBlock>


## Positive vs negative filters

<VersionBlock firstVersion="2.0">

- `--resource-types` is a positive filter &mdash; dbt only runs the resource types selected in the command, implicitly skipping every other type.
- `--exclude-resource-types` is a negative filter &mdash; dbt starts with the full catalog of resource types and then omits the types selected in the command. dbt runs everything _except_ those resource types. 

You can use both flags in a command; dbt first applies the positive filter (`--resource-types`) and then removes the types listed in the negative filter (`--exclude-resource-types`). For example:

```text
dbt build --resource-types model test snapshot --exclude-resource-types snapshot
```

Note that the list of dbt resource types is mutually exclusive and collectively exhaustive (MECE). This means that any `--resource-types` selection can also be achieved by excluding the other resource types using `--exclude-resource-types`, and vice versa.

</VersionBlock>

<VersionBlock lastVersion="1.99">

- `--resource-type` is a positive filter &mdash; dbt only runs the resource types selected in the command, implicitly skipping every other type.
- `--exclude-resource-type` is a negative filter &mdash; dbt starts with the full catalog of resource types and then omits the types selected in the command. dbt runs everything _except_ those resource types. 

You can use both flags in a command; dbt first applies the positive filter (`--resource-type`) and then removes the types listed in the negative filter (`--exclude-resource-type`). For example:

```text
dbt build --resource-type model test snapshot --exclude-resource-type snapshot
```

Note that the list of dbt resource types is mutually exclusive and collectively exhaustive (MECE). This means that any `--resource-type` selection can also be achieved by excluding the other resource types using `--exclude-resource-type`, and vice versa.

</VersionBlock>

## Examples

<VersionBlock firstVersion="2.0">

Instead of targeting specific resources, use the `--resource-types` or `--exclude-resource-types` flags to target all resources of a certain type: `dbt build --resource-types RESOURCE_TYPE`, replacing `RESOURCE_TYPE` with the resource type you want to include.

See the following sample commands for including or excluding resource types. Note that the `--exclude-resource-types` flag is only available in dbt version 1.8 and higher.

<Expandable alt_header="Include resource types">

### Include multiple resource types

Use the following command to include multiple resource types such as data tests and models in your build process:

<File name='Usage'>

```text
dbt build --resource-types test model
```

</File>

### Include all snapshots

Use the following command to only include snapshots in your dbt build process:

<File name='Usage'>

```text
dbt build --resource-types snapshot
```

</File>

### Include all saved queries

Use the following command to only include saved queries with the `--resource-types` flag:

<File name='Usage'>

```text
dbt build --resource-types saved_query
```

</File>

### Include all data tests

Use the following command to only include data tests in your build process:

<File name='Usage'>

```text
dbt build --resource-types test
```

</File>

### Include all data tests during testing

Use the following command to only include data tests when running tests:

<File name='Usage'>

```text
dbt test --resource-types test
```

</File>

</Expandable>
<Expandable alt_header="Exclude resource types">

### Exclude multiple resource types

Use the following command to exclude multiple resource types such as data tests and models from your build process:

<File name='Usage'>

```text
dbt build --exclude-resource-types test model
```

</File>

### Exclude all unit tests

Use the following command to exclude unit tests from your dbt build process.

<File name='Usage'>

```text
dbt build --exclude-resource-types unit_test
```

</File>

### Exclude all unit tests during testing

Use the following command to exclude unit tests when running tests:

<File name='Usage'>

```text
dbt test --exclude-resource-types unit_test
```

</File>

</Expandable>

</VersionBlock>

<VersionBlock lastVersion="1.99">

Instead of targeting specific resources, use the `--resource-type` or `--exclude-resource-type` flags to target all resources of a certain type: `dbt build --resource-type RESOURCE_TYPE`, replacing `RESOURCE_TYPE` with the resource type you want to include.

See the following sample commands for including or excluding resource types. Note that the `--exclude-resource-type` flag is only available in dbt version 1.8 and higher.

<Expandable alt_header="Include resource types">

### Include multiple resource types

Use the following command to include multiple resource types such as data tests and models in your build process:

<File name='Usage'>

```text
dbt build --resource-type test model
```

</File>

### Include all snapshots

Use the following command to only include snapshots in your dbt build process:

<File name='Usage'>

```text
dbt build --resource-type snapshot
```

</File>

### Include all saved queries

Use the following command to only include saved queries with the `--resource-type` flag:

<File name='Usage'>

```text
dbt build --resource-type saved_query
```

</File>

### Include all data tests

Use the following command to only include data tests in your build process:

<File name='Usage'>

```text
dbt build --resource-type test
```

</File>

<VersionBlock firstVersion="1.9">

### Include all data tests during testing

Use the following command to only include data tests when running tests:

<File name='Usage'>

```text
dbt test --resource-type test
```

</File>

</VersionBlock>

</Expandable>
<Expandable alt_header="Exclude resource types">

### Exclude multiple resource types

Use the following command to exclude multiple resource types such as data tests and models from your build process:

<File name='Usage'>

```text
dbt build --exclude-resource-type test model
```

</File>

### Exclude all unit tests

Use the following command to exclude unit tests from your dbt build process.

<File name='Usage'>

```text
dbt build --exclude-resource-type unit_test
```

</File>

<VersionBlock firstVersion="1.9">

### Exclude all unit tests during testing

Use the following command to exclude unit tests when running tests:

<File name='Usage'>

```text
dbt test --exclude-resource-type unit_test
```

</File>

</VersionBlock>
</Expandable>

</VersionBlock>
