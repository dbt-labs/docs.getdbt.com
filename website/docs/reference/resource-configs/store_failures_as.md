---
resource_types: [tests]
id: "store_failures_as"
---

For the `test` resource type, `store_failures_as` is an optional config that specifies how test failures should be stored in the database. If [`store_failures`](/reference/resource-configs/store_failures) is also configured, `store_failures_as` takes precedence. 

The three supported values are:

- `ephemeral` &mdash; nothing stored in the database (default)
- `table` &mdash; test failures stored as a database table
- `view` &mdash; test failures stored as a database view

You can configure it in all the same places as `store_failures`, including singular tests (.sql files), generic tests (.yml files), and dbt_project.yml.

### Examples

#### Singular test

[Singular test](https://docs.getdbt.com/docs/build/tests#singular-data-tests) in `tests/singular/check_something.sql` file

```sql
{{ config(store_failures_as="table") }}

-- custom singular test
select 1 as id
where 1=0
```

#### Generic test

[Generic tests](https://docs.getdbt.com/docs/build/tests#generic-data-tests) in `models/_models.yml` file

```yaml
models:
  - name: my_model
    columns:
      - name: id
        tests:
          - not_null:
              config:
                store_failures_as: view
          - unique:
              config:
                store_failures_as: ephemeral
```

#### Project level

Config in `dbt_project.yml`

```yaml
name: "my_project"
version: "1.0.0"
config-version: 2
profile: "sandcastle"

tests:
  my_project:
    +store_failures_as: table
    my_subfolder_1:
      +store_failures_as: view
    my_subfolder_2:
      +store_failures_as: ephemeral
```

### "Clobbering" configs

As with most other configurations, `store_failures_as` is "clobbered" when applied hierarchically. Whenever a more specific value is available, it will completely replace the less specific value.

Additional resources: 

- [Test configurations](/reference/data-test-configs#related-documentation)
- [Test-specific configurations](/reference/data-test-configs#test-data-specific-configurations)
- [Configuring directories of models in dbt_project.yml](/reference/model-configs#configuring-directories-of-models-in-dbt_projectyml)
- [Config inheritance](/reference/configs-and-properties#config-inheritance)