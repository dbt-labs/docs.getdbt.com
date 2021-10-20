---
title: Can I store my models in a directory other than the `models` directory in my project?
---
- **v1.0.0:** The config 'source-path' has been deprecated in favor of [`model-paths`](model-paths).

By default, dbt expects your seed files to be located in the `models` subdirectory of your project.

To change this, update the [model-paths](reference/project-configs/model-paths.md) configuration in your `dbt_project.yml`
file, like so:

<File name='dbt_project.yml'>

```yml
model-paths: ["transformations"]
```

</File>
