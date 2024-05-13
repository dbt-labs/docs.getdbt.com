---
title: "Resource type"
id: "resource-type"
sidebar: "resource type"
---

The `--resource-type` and `--exclude-resource-type` flags include or exclude resource types from the `dbt build` and `dbt clone` commands.

The available resource types are:

<VersionBlock lastVersion="1.6">

</VersionBlock>

<VersionBlock firstVersion="1.7">

- [saved queries](/docs/build/saved-queries)  

</VersionBlock>


<VersionBlock firstVersion="1.8">

- [unit tests](/docs/build/unit-tests)

</VersionBlock>

## Example

<VersionBlock lastVersion="1.7">

For example, use the following command to exclude certain resources from your dbt build process: 

<File name='Usage'>

```text
$ dbt build --exclude-resource-type RESOURCE_TYPE
```

</File>

</VersionBlock>

<VersionBlock firstVersion="1.7">

- In this example, run the following command to build `saved_queries` with the `--resource-type` flag:

<File name='Usage'>

```text
dbt build --resource-type SAVED_QUERY_NAME
```

</File>

</VersionBlock>

<VersionBlock firstVersion="1.8">

-  In this example, use the following command to exclude certain resources, such as unit tests, from your dbt build process: 

<File name='Usage'>

```text
$ dbt build --exclude-resource-type UNIT_TEST_NAME
```

</File>

</VersionBlock>
