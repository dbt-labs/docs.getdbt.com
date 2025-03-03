dbt demarcates between a folder name and a configuration by using a `+` prefix before the configuration name. The `+` prefix is used for configs _only_ and applies to `dbt_project.yml` under the corresponding resource key. It doesn't apply to:
- `config()` Jinja macro within a resource file
- config property in a `.yml` file.

For more info, see the [Using the `+` prefix](/reference/resource-configs/plus-prefix).
