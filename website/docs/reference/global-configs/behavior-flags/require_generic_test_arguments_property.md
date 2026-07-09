---
title: "Generic test arguments property"
id: "require_generic_test_arguments_property"
sidebar_label: "require generic test arguments property"
---

:::info This flag has reached maturity

The default value is now `true`. To preserve the previous behavior, set this flag to `false` in your `dbt_project.yml`.

:::

| require_generic_test_arguments_property | <Constant name="dbt" /> **Latest** | <Constant name="core" /> |
|---|---|---|
| Introduced | 2025.07 | 1.10.5 |
| Matured (default → `true`) | 2025.08 | 1.10.8 |
| Removed | — | — |

dbt supports parsing key-value arguments that are inputs to generic tests when specified under the `arguments` property. In the past, dbt didn't support a way to clearly disambiguate between properties that were inputs to generic tests and framework configurations, and only accepted arguments as top-level properties.

If you are on an older Core version where the flag is `false`, dbt will recognize the `arguments` property but raise the `ArgumentsPropertyInGenericTestDeprecation` warning.

Here's an example using the new `arguments` property:

<File name='model.yml'>

```yaml
models:
  - name: my_model_with_generic_test
    data_tests:
      - dbt_utils.expression_is_true:
          arguments:
            expression: "order_items_subtotal = subtotal"
```

</File>

Here's an example using the alternative `test_name` format:

<File name='model.yml'>

```yaml
models:
  - name: my_model_with_generic_test
    data_tests:
    - name: arbitrary_name
      test_name: dbt_utils.expression_is_true
      arguments:
         expression: "order_items_subtotal = subtotal"
      config:
        where: "1=1"
```

</File>

With this flag enabled, dbt will:
- Parse any key-value pairs under `arguments` in generic tests as inputs to the generic test macro.
- Raise a `MissingArgumentsPropertyInGenericTestDeprecation` warning if additional non-config arguments are specified outside of the `arguments` property.

To preserve the previous behavior:

<File name='dbt_project.yml'>

```yaml
flags:
  require_generic_test_arguments_property: false
```

</File>
