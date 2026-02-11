:::note Validating local changes

When using `dbt sl validate` locally with Fusion or dbt CLI (through a configured `dbt_cloud.yml`), the command validates against your local semantic manifest, and not the platform's manifest. This means your uncommitted local changes are included in the validation.

If running without a platform connection, use `mf validate-configs` instead for local validations.

For more information, see [Availability by environment](/docs/build/validation#availability-by-environment).
:::