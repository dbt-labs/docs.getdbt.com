---
title: "Enforce best practices with dbt project evaluator"
slug: run-dbt-project-evaluator
description: dbt Project Evaluator can be run from inside of your existing dbt Cloud CI job to identify common flaws in projects.
---

dbt Project Evaluator is a package designed to identify deviations from best practices common to many dbt projects, including modeling, testing, documentation, structure and performance problems. For an introduction to the package, read its [launch blog post](/blog/align-with-dbt-project-evaluator).

## Step 1: Install the package

As with all packages, add a reference to `dbt-labs/dbt_project_evaluator` to your `packages.yml` file. See the [dbt Package Hub](https://hub.getdbt.com/dbt-labs/dbt_project_evaluator/latest/) for full installation instructions.

## Step 2: Define test severity with an environment variable

As noted in the [documentation](https://dbt-labs.github.io/dbt-project-evaluator/latest/ci-check/), tests in the package are set to `warn` severity by default.

To have these tests fail in CI, create a new environment called `DBT_PROJECT_EVALUATOR_SEVERITY`. Set the project-wide default to `warn`, and set it to `error` in the CI environment.

In your `dbt_project.yml` file, override the severity configuration:

```yaml
tests:
dbt_project_evaluator:
    +severity: "{{ env_var('DBT_PROJECT_EVALUATOR_SEVERITY', 'warn') }}"
```

## Step 3: Update your CI commands

Because these tests should only run after the rest of your project has been built, your existing CI command will need to be updated to exclude the dbt_project_evaluator package. You will then add a second step which builds _only_ the package's models and tests.

Update your steps to:

```bash
dbt build --select state:modified+ --exclude package:dbt_project_evaluator
dbt build --select package:dbt_project_evaluator
```

## Step 4: Apply any customizations

Depending on the state of your project when you roll out the evaluator, you may need to skip some tests or allow exceptions for some areas. To do this, refer to the documentation on:

- [disabling tests](https://dbt-labs.github.io/dbt-project-evaluator/latest/customization/customization/)
- [excluding groups of models from a specific test](https://dbt-labs.github.io/dbt-project-evaluator/latest/customization/exceptions/)
- [excluding packages or sources/models based on path](https://dbt-labs.github.io/dbt-project-evaluator/latest/customization/excluding-packages-and-paths/)

If you create a seed to exclude groups of models from a specific test, remember to disable the default seed and include `dbt_project_evaluator_exceptions` in your second `dbt build` command above.
