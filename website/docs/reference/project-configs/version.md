---
datatype: version
required: True
---

<VersionBlock firstVersion="1.5">

dbt projects have two distinct types of the `version` tags. This field has a different meaning depending on its location.

## `dbt_project.yml` versions

The version tag in a `dbt_project` file represents the version of your dbt project. Starting in version 1.5, `version` in the `dbt_project.yml` is an *optional parameter*. If specified, the version must be in a [semantic version](https://semver.org/) format, e.g. `1.0.0`. The default value if not specified is `None`. 

For more on Core versions, see [About dbt Core versions](/docs/dbt-versions/core).
<File name='dbt_project.yml'>

```yml
version: version
```

</File>

## `.yml` property file versions

A version tag in a `.yml` property file provides the control tag, which informs how dbt processes property files. 

Starting in version 1.5, dbt will no longer require this configuration in your resource `.yml` files. For more on why we required this tag, see property file [FAQs](reference/configs-and-properties#faqs).

For more on property files, see their general [documentation](reference/configs-and-properties#where-can-i-define-properties) on the same page.

<Tabs
  groupId="resource-version-configs"
  defaultValue="version-specified"
  values={[
    { label: 'Resource property file with version specified', value: 'version-specified', },
    { label: 'Resource property file without version specified', value: 'no-version-specified', },
  ]
}>
<TabItem value="version-specified">

<File name='<any valid filename>.yml'>

```yml
version: 2  # Only 2 is accepted by current and recent versions of dbt.

models: 
    ...
```

</File>

</TabItem>

<TabItem value="no-version-specified">

<File name='<any valid filename>.yml'>

```yml

models: 
    ...
```

</File>

</TabItem>

</Tabs>


</VersionBlock>

<VersionBlock lastVersion="1.4">

dbt projects have two distinct types of the `version` tags. This field has a different meaning depending on its location.

## `dbt_project.yml` versions

The version tag in a `dbt_project` file represents the version of your dbt project. Although **this is a required parameter**, it is not currently meaningfully used by dbt. The version must be in a [semantic version](https://semver.org/) format, e.g. `1.0.0`. For more on Core versions, see [About dbt Core versions](/docs/dbt-versions/core).
<File name='dbt_project.yml'>

```yml
version: version
```

</File>

## `.yml` property file versions

A version tag in a `.yml` property file provides the control tag, which informs how dbt processes property files. For more on why we require this tag, see property file [FAQs](reference/configs-and-properties#faqs).

For more on property files, see their general [documentation](reference/configs-and-properties#where-can-i-define-properties) on the same page.

<File name='<any valid filename>.yml'>

```yml
version: 2  # Only 2 is accepted by current and recent versions of dbt.

models: 
    ...
```

</File>

</VersionBlock>
