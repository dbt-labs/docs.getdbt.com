:::tip
From dbt Core v1.10, you can opt into validating the arguments you define in macro documentation using the `validate_macro_args` behavior change flag. When enabled, dbt will:
- Warn if documented argument names don’t match the macro definition.
- Warn if `type` fields don’t follow [supported formats](/reference/resource-properties/arguments#supported-types-for-macro-argument-validation).

Learn more about [macro argument validation](/reference/global-configs/behavior-changes#macro-argument-validation).
:::
