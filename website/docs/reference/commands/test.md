---
title: "test"
id: "test"
---

`dbt test` runs tests defined on models, sources, snapshots, and seeds. It expects that you have already created those resources through the appropriate commands.

The tests to run can be selected using the `--models` flag discussed [here](node-selection/syntax).

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

For more information on writing tests, see the [Testing Documentation](building-a-dbt-project/tests).
