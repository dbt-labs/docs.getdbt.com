---
title: Can I store my data tests in a directory other than the `tests` directory in my project?
description: "Where to store data tests in a directory"
sidebar_label: 'How to name data tests directory'
id: configurable-data-test-path

---
By default, dbt expects your singular data test files to be located in the `tests` subdirectory of your project, and generic data test definitions to be located in `tests/generic` or `macros`.

To change this, update the [test-paths](reference/project-configs/test-paths.md) configuration in your `dbt_project.yml`
file, like so:

<File name='dbt_project.yml'>

```yml
test-paths: ["my_cool_tests"]
```

</File>

Then, you can define generic data tests in `my_cool_tests/generic/`, and singular data tests everywhere else in `my_cool_tests/`.
