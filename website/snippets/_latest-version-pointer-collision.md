To prevent naming collisions, dbt raises an error if the latest version's alias is the same as the pointer name. For example, the following configuration would cause an error because both `dim_customers_v2` and the pointer view would resolve to `dim_customers`:

```yaml
models:
  - name: dim_customers
    versions:
      - v: 1
      - v: 2
        config:
          alias: dim_customers  # collides with the pointer view name
    config:
      latest_version_pointer:
        enabled: true
```

To fix this, you can:
- Remove the `alias` from the latest version.
- Set a different `latest_version_pointer.alias`.
- Override the [`generate_latest_version_pointer_alias`](/docs/build/custom-aliases#generate_latest_version_pointer_alias) macro to use a different naming convention globally.
