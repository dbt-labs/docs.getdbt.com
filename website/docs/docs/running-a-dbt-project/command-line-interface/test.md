---
title: "test"
id: "test"
---

`dbt test` runs tests on data in deployed models. There are two types of tests:

- schema validations, declared in a `schema.yml` file.
- custom data tests, written as SQL `SELECT` statements.

`dbt test` runs both types of test and reports the results to the console.

The tests to run can be selected using the `--models` flag discussed [here](model-selection-syntax).

```bash
# run tests for one_specific_model
dbt test --models one_specific_model

# run tests for all models in package
dbt test --models some_package.*

# run only custom data tests
dbt test --data

# run only schema tests
dbt test --schema

# run custom data tests for one_specific_model
dbt test --data --models one_specific_model

# run schema tests for one_specific_model
dbt test --schema --models one_specific_model
```

For more information on writing tests, see the [Testing Documentation](testing).