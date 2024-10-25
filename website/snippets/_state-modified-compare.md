You need to build the state directory using dbt v1.9 or higher, or [Versionless](/docs/dbt-versions/versionless-cloud) dbt Cloud, and you need to set `state_modified_compare_more_unrendered_values` to `true` within your dbt_project.yml.

If the state directory was built with an older dbt version or if the `state_modified_compare_more_unrendered_values` behavior change flag was either not set or set to `false`, you need to rebuild the state directory to avoid false positives during state comparison with `state:modified`.
