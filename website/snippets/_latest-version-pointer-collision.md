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

To fix this, you can do the following:

<Tabs>
<TabItem value="remove" label="Remove the `alias` (recommended)">

Remove the `alias` from the latest version:

```yaml
config:
  alias: dim_customers
```
Advantages: simple and safe; just let the automatic pointer handle it. 

</TabItem>
<TabItem value="disable" label="Disable the latest version pointer for only that model">

```yaml
        config:
          alias: dim_customers
    config:
      latest_version_pointer:
        enabled: false
```

Advantages: immediately backward-compatible for pre-existing `alias` configs.

</TabItem>
<TabItem value="unique" label="Set a different `latest_version_pointer.alias` that is unique">

```yaml
        config:
          alias: dim_customers_latest
```
</TabItem>

<TabItem value="override" label=" Override the `generate_latest_version_pointer_alias` macro">

Override the [`generate_latest_version_pointer_alias`](/docs/build/custom-aliases#generate_latest_version_pointer_alias) macro to use a different naming convention globally.

`macros/generate_latest_version_pointer_alias.sql`

```
{% macro generate_latest_version_pointer_alias(custom_alias_name=none, node=none) -%}
    {{ node.name ~ "_latest" }}
{%- endmacro %}
```
</TabItem>
</Tabs>
