---
title: Can I store my seeds in a directory other than the `data` directory in my project?
---
Be default, dbt expects your seed files to be located in the `data` subdirectory
of your project.

To change this, update the [data-paths](reference/data-paths.md) configuration in your `dbt_project.yml`
file, like so:

<File name='dbt_project.yml'>

```yml
data-paths: ["seeds"]
```

</File>
