---
title: "MetricFlow time spine YAML"
id: "require_yaml_configuration_for_mf_time_spines"
sidebar_label: "require yaml configuration for mf time spines"
---

:::caution Removed in <Constant name="core_v2" />

This flag was removed in <Constant name="core_v2" /> and in <Constant name="fusion" />. The new behavior is always enabled. If you're upgrading, remove this flag from your `dbt_project.yml`.

:::



| require_yaml_configuration_for_mf_time_spines | <Constant name="dbt" /> **Latest** | <Constant name="core" /> |
|---|---|---|
| Introduced | 2024.10 | 1.9.0 |
| Matured (default → `true`) | Sep 1, 2026 | 1.12.0 |
| Removed | — | v2.0 |

<br />

In previous versions (dbt Core 1.8 and earlier), the MetricFlow time spine configuration was stored in a `metricflow_time_spine.sql` file.

Starting in <Constant name="core" /> v1.12, this flag defaults to `true`. When enabled, dbt suppresses the `MFTimespineWithoutYamlConfigurationDeprecation` deprecation warning. The legacy SQL file configuration continues to work in both cases.

The MetricFlow properties YAML file should have the `time_spine:` field. Refer to [MetricFlow timespine](/docs/build/metricflow-time-spine) for more details.

## Impact

This flag has no functional impact; the legacy time-spine model continues to work in both cases. The only visible changes are:

- The `MFTimespineWithoutYamlConfigurationDeprecation` warning no longer appears in logs.
- If you use `--warn-error`, the warning no longer fires and will no longer escalate to an error.

<Expandable alt_header="Opting out of this flag">

No action is required for most projects. The legacy `metricflow_time_spine.sql` model continues to work with or without this flag.

If you rely on the `MFTimespineWithoutYamlConfigurationDeprecation` warning firing under `--warn-error` to enforce a YAML migration, you can opt out by setting the flag to `false` in `dbt_project.yml`:

<File name='dbt_project.yml'>

```yaml
flags:
  require_yaml_configuration_for_mf_time_spines: false
```

</File>

To remove the deprecation warning permanently, migrate `metricflow_time_spine.sql` to a YAML `time_spine` block under a model entry in `models:`. Refer to [MetricFlow timespine](/docs/build/metricflow-time-spine) for the current syntax.

</Expandable>
