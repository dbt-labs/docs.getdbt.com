---
title: "Unit test overrides"
sidebar_label: "Overrides"
---

When configuring your unit test, you can override the output of [macros](/docs/build/jinja-macros#macros), [project variables](/docs/build/project-variables), or [environment variables](/docs/build/environment-variables) for a given unit test. 

```yml

 - name: test_my_model_overrides
    model: my_model
    given:
      - input: ref('my_model_a')
        rows:
          - {id: 1, a: 1}
      - input: ref('my_model_b')
        rows:
          - {id: 1, b: 2}
          - {id: 2, b: 2}
    overrides:
      macros:
        type_numeric: override
        invocation_id: 123
      vars:
        my_test: var_override
      env_vars:
        MY_TEST: env_var_override
    expect:
      rows:
        - {macro_call: override, var_call: var_override, env_var_call: env_var_override, invocation_id: 123}

```

## Macros

You can override the output of any macro in your unit test defition. 

If the model you're unit testing uses these macros, you must override them:
  - [`is_incremental`](/docs/build/incremental-models#understand-the-is_incremental-macro): If you're unit testing an incremental model, you must explicity set `is_incremental` to `true` or `false`. See more docs on unit testing incremental models [here](/docs/build/unit-tests#unit-testing-incremental-models). 

  ```yml

  unit_tests:
    - name: my_unit_test
      model: my_incremental_model
      overrides:
        macros:
          # unit test this model in "full refresh" mode
          is_incremental: false 
      ...

  ```

  - [`dbt_utils.star`](/blog/star-sql-love-letter): If you're unit testing a model that uses the `star` macro, you must explicity set `star` to a list of columns. This is because the `star` only accepts a [relation](/reference/dbt-classes#relation) for the `from` argument; the unit test mock input data is injected directly into the model SQL, replacing the `ref('')` or `source('')` function, causing the `star` macro to fail unless overidden.

  ```yml

  unit_tests:
    - name: my_other_unit_test
      model: my_model_that_uses_star
      overrides:
        macros:
          # explicity set star to relevant list of columns
          star: col_a,col_b,col_c 
      ...

  ``` 
