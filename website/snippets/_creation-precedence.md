## Creation precedence

Materializations are implemented following this "drop through" life cycle:

1. If a model does not exist with the provided path, create the new model.
2. If a model exists, but has a different type, drop the existing model and create the new model.
3. If [`--full-refresh`](/reference/resource-configs/full_refresh) is supplied, replace the existing model regardless of configuration changes and the [`on_configuration_change`](/reference/resource-configs/on_configuration_change) setting.
    - BigQuery users may need to run `dbt run --full-refresh` (instead of `dbt run`) after changing a model’s materialization (for example, from `table` to `view`) to ensure dbt fully replaces the existing relation and the change is fully applied.
4. If there are no configuration changes, perform the default action for that type (e.g. apply refresh for a materialized view).
5. Determine whether to apply the configuration changes according to the `on_configuration_change` setting.