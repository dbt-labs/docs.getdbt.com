To prevent naming collisions, dbt raises a `dbt1005` error if the latest version's alias is the same as the pointer view name. In <Constant name="fusion" />, where `latest_version_pointer` is enabled by default, this error can surface on models that have an explicit `alias` matching the model's base name, even if you never configured the pointer yourself.

For example, the following configuration would raise `dbt1005` because both `dim_customers_v2` and the pointer view would resolve to `dim_customers`:

```
dbt1005 (Cannot create latest version pointer: the latest version of 'dim_customers' is already aliased to 'dim_customers')
```

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

To fix this, select one of the following options:

- [Remove the `alias` (recommended)](#remove-the-alias-recommended)
- [Disable the latest version pointer for that model](#disable-the-latest-version-pointer-for-that-model)
- [Set a unique `alias`](#set-a-unique-alias)
- [Override the `generate_latest_version_pointer_alias` macro](#override-the-generate_latest_version_pointer_alias-macro)

#### Remove the `alias` (recommended)

Remove the `alias` from the latest version and let the automatic pointer handle it:

```yaml
config:
  alias: dim_customers
```

#### Disable the latest version pointer for that model

This approach is immediately backward-compatible for pre-existing `alias` configs:

```yaml
        config:
          alias: dim_customers
    config:
      latest_version_pointer:
        enabled: false
```

#### Set a unique `alias`

```yaml
        config:
          alias: dim_customers_latest
```

#### Override the `generate_latest_version_pointer_alias` macro

Override the [`generate_latest_version_pointer_alias`](/docs/build/custom-aliases#generate_latest_version_pointer_alias) macro to use a different naming convention globally:

<File name='macros/generate_latest_version_pointer_alias.sql'>

```sql
{% macro generate_latest_version_pointer_alias(custom_alias_name=none, node=none) -%}
    {{ node.name ~ "_latest" }}
{%- endmacro %}
```

</File>
