The state directory needs to be built with dbt v1.9 or higher, or [Versionless](/docs/dbt-versions/versionless-cloud) dbt Cloud along with `state_modified_compare_more_unrendered_values: true` within your dbt_project.yml.

If the state directory was built with an older dbt version or if the `state_modified_compare_more_unrendered_values` behavior change flag was not set (or it was set to `false`), you need to rebuild the state directory to avoid false positives during state comparison with `state:modified`.
