:::tip
From dbt Core v1.10, you can opt into validating the arguments you define in macro documentation using the `validate_macro_args` behavior change flag. When enabled, dbt will:

- Infer arguments from the macro and includes them in the [manifest.json](/reference/artifacts/manifest-json) file if no arguments are documented.
- Raise a warning if documented argument names don't match the macro definition.
- Raise a warning if `type` fields don't follow [supported formats](/reference/resource-properties/arguments#supported-types).

Learn more about [macro argument validation](/reference/global-configs/behavior-changes#macro-argument-validation).
:::
