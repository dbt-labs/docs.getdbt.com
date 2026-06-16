---
title: lag_tolerance
description: "Configure lag_tolerance to prevent unnecessary node rebuilds when upstream data updates more frequently than your node needs to."
id: "lag-tolerance"
tags: ['dbt State']
---

# lag_tolerance

<Tabs>
<TabItem value="project" label="Project YAML file">

<File name="dbt_project.yml">

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)state:
      lag_tolerance: <duration_string>
```

</File>
</TabItem>

<TabItem value="property" label="Properties YAML file">

<File name="models/<filename>.yml">

```yaml
models:
  - name: my_model
    config:
      state:
        lag_tolerance: <duration_string>
```

</File>
</TabItem>

<TabItem value="sql" label="SQL file config">

<File name="models/<filename>.sql">

```sql
{{ config(
    state={
      "lag_tolerance": "<duration_string>"
    }
) }}
```

</File>
</TabItem>
</Tabs>

## Definition

Source systems may update more frequently than downstream models need to rebuild. For example, a model used for daily reporting doesn't need to refresh more than once per day, even if new upstream data is available hourly.

With `lag_tolerance`, you can prevent those unnecessary rebuilds. When dbt State evaluates whether to rebuild a node, it checks whether upstream parents have fresh data that exceeds the `lag_tolerance` threshold. If they haven't, dbt reuses the existing node rather than cloning or rebuilding it.

This config accepts two value types:

- **Duration strings** in the format `<number><unit>`:

  <SimpleTable>

  | Unit | Accepted values |
  |------|----------------|
  | Seconds | `s`, `second`, `seconds` |
  | Minutes | `m`, `minute`, `minutes` |
  | Hours | `h`, `hour`, `hours` |
  | Days | `d`, `day`, `days` |
  | Weeks | `w`, `week`, `weeks` |

  </SimpleTable>

- **Jinja expressions** - `lag_tolerance` is evaluated as a Jinja template, so you can use any dbt context variables (`target`, `var()`, `env_var()`) to set dynamic tolerances. This is useful for applying different tolerances per environment without duplicating config blocks:

  ```yaml
  lag_tolerance: "{{ '4h' if target.name == 'prod' else '7d' }}"
  ```

## Default

`45m`. When `lag_tolerance` is not set, dbt State applies a default tolerance of 45 minutes.

## Examples

### Use different tolerances per environment

Use a Jinja expression to set a tight tolerance in production and a looser one everywhere else. This keeps production data fresh while reducing unnecessary rebuilds during development:

<File name="dbt_project.yml">

```yaml
models:
  +state:
    lag_tolerance: "{{ '4h' if target.name == 'prod' else '7d' }}"
```

</File>

In this example, models in the `prod` target rebuild only when upstream data is more than 4 hours old. In all other environments, models wait 7 days before rebuilding.

### Apply different tolerances per folder

Set different tolerances for different parts of your project by targeting folders:

<File name="dbt_project.yml">

```yaml
models:
  <your_project>:
    marts:
      +state:
        lag_tolerance: 1d
    staging:
      +state:
        lag_tolerance: 1h
```

</File>

### Override for a specific model

Override the project-level default for a single model:

<File name="models/my_model.yml">

```yaml
models:
  - name: my_model
    config:
      state:
        lag_tolerance: 1h
```

</File>

## Related docs

- [About dbt State](/docs/deploy/dbt-state-about)
- [Set up dbt State](/docs/deploy/dbt-state-setup)
