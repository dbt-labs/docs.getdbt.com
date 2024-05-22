---
title: "Resource type"
id: "resource-type"
sidebar: "resource type"
---

The `--resource-type` and `--exclude-resource-type` flags include or exclude resource types from the `dbt build`, `dbt clone`, and `dbt list` commands.

This means the flags enable you to specify which types of resources to include or exclude when running the commands, instead of targeting specific resources.

The available resource types are:

<VersionBlock lastVersion="1.6">

- [`analysis`](/docs/build/analyses)
- [`exposure`](/docs/build/exposures)
- [`metric`](/docs/build/build-metrics-intro)
- [`model`](/docs/build/models)
- [`seed`](/docs/build/seeds)
- [`snapshot`](/docs/build/snapshots)
- [`source`](/docs/build/sources)
- [`test`](/docs/build/data-tests)

</VersionBlock>

<VersionBlock lastVersion="1.7" firstVersion="1.7">

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

</VersionBlock>

<VersionBlock firstVersion="1.8">

- [`analysis`](/docs/build/analyses)
- [`exposure`](/docs/build/exposures)
- [`metric`](/docs/build/build-metrics-intro)
- [`model`](/docs/build/models)
- [`saved_query`](/docs/build/saved-queries)
- [`seed`](/docs/build/seeds)
- [`semantic_model`](/docs/build/semantic-models)
- [`snapshot`](/docs/build/snapshots)
- [`source`](/docs/build/sources)
- [`data_test`](/docs/build/data-tests)
- [`unit_test`](/docs/build/unit-tests)

</VersionBlock>

## Example

Instead of targeting specific resources, use the `--resource-flag` or `--exclude-resource-type` flags to target all resources of a certain type: `dbt build --exclude-resource-type RESOURCE_TYPE` replacing `RESOURCE_TYPE` with the resource type you want to exclude.

- For example, use the following command to exclude _all_ snapshots from your dbt build process:

<File name='Usage'>

```text
dbt build --exclude-resource-type snapshot
```

</File>

<VersionBlock firstVersion="1.7">

- In this example, run the following command to include _all_ saved queries with the `--resource-type` flag:

<File name='Usage'>

```text
dbt build --resource-type saved_query
```

</File>

</VersionBlock>

<VersionBlock firstVersion="1.8">

-  In this example, use the following command to exclude _all_ unit tests, from your dbt build process:

<File name='Usage'>

```text
dbt build --exclude-resource-type unit_test
```

</File>

</VersionBlock>
