---
datatype: version
required: True
keyword: project version, project versioning, dbt project versioning
---

import VersionsCallout from '/snippets/_version-callout.md';

<VersionsCallout />


dbt projects have two distinct types of `version` tags. This field has a different meaning depending on its location.

## `dbt_project.yml` versions

The version tag in a `dbt_project` file represents the version of your dbt project. Starting in dbt version 1.5, `version` in the `dbt_project.yml` is an *optional parameter*. If used, the version must be in a [semantic version](https://semver.org/) format, such as `1.0.0`. The default value is `None` if not specified. For users on dbt version 1.4 or lower, this tag is required, though it isn't currently used meaningfully by dbt.

For more on Core versions, see [About dbt Core versions](/docs/dbt-versions/core).

<File name='dbt_project.yml'>

```yml
version: version
```

</File>

## `.yml` property file versions

A version tag in a `.yml` property file provides the control tag, which informs how dbt processes property files. 

Starting from version 1.5, dbt will no longer require this configuration in your resource `.yml` files.  If you want to know more about why this tag was previously required, you can refer to the [FAQs](#faqs). For users on dbt version 1.4 or lower, this tag is required,

For more on property files, see their general [documentation](/reference/configs-and-properties#where-can-i-define-properties) on the same page.

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
version: 2  # Only 2 is accepted by dbt versions up to 1.4.latest.

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

## FAQS

<FAQ path="Project/why-version-2" />
