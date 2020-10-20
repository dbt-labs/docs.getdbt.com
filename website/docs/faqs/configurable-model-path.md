---
title: Can I store my models in a directory other than the `models` directory in my project?
---
By default, dbt expects your seed files to be located in the `models` subdirectory of your project.

To change this, update the [source-paths](reference/project-configs/source-paths.md) configuration in your `dbt_project.yml`
file, like so:

<File name='dbt_project.yml'>

```yml
source-paths: ["transformations"]
```

</File>
