---
title: "About dbt test command"
sidebar_label: "test"
id: "test"
---

`dbt test` runs tests defined on models, sources, snapshots, and seeds. It expects that you have already created those resources through the appropriate commands.

The tests to run can be selected using the `--select` flag discussed [here](/reference/node-selection/syntax).

```bash
# run tests for one_specific_model
dbt test --select "one_specific_model"

# run tests for all models in package
dbt test --select "some_package.*"

# run only tests defined singularly
dbt test --select "test_type:singular"

# run only tests defined generically
dbt test --select "test_type:generic"

# run singular tests limited to one_specific_model
dbt test --select "one_specific_model,test_type:singular"

# run generic tests limited to one_specific_model
dbt test --select "one_specific_model,test_type:generic"
```

For more information on writing tests, see the [Testing Documentation](/docs/build/tests).
