---
datatype: version
required: True
---

dbt projects have two distinct types of the `version` tags. This field has a different meaning depending on its location.

## `dbt_project.yml` versions

<File name='dbt_project.yml'>

```yml
version: version
```

</File>

### Definition

The version must be in a [semantic version](https://semver.org/) format, e.g. `1.0.0`

##  `.yml` property file versions

<File name='<any valid filename>.yml'>

```yml
version: 2  # Only 2 is accepted by current and recent versions of dbt.
```
 
</File>

### Definition
A control tag that informs how dbt processes property files. For more on why 2 is required, see property file [FAQs](https://docs.getdbt.com/reference/configs-and-properties#faqs).

For more on property files, see their general [documentation](https://docs.getdbt.com/reference/configs-and-properties#where-can-i-define-properties) on the same page.
