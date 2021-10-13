---
title: Can I store my data tests in a directory other than the `test` directory in my project?
---
By default, dbt expects your singular test files to be located in the `tests` subdirectory of your project.

To change this, update the [test-paths](reference/project-configs/test-paths.md) configuration in your `dbt_project.yml`
file, like so:

<File name='dbt_project.yml'>

```yml
test-paths: ["data-tests"]
```

</File>
