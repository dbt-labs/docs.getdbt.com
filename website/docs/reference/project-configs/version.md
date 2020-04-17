---
datatype: version
required: True
---
<File name='dbt_project.yml'>

```yml
version: version
```

</File>

## Definition
The version of a dbt project. Note that while **this is a required parameter**, it is not currently meaningfully used by dbt.

The version must be in a [semantic version](https://semver.org/) format, e.g. `1.0.0`
