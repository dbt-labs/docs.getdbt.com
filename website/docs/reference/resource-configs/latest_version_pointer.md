---
title: latest_version_pointer
description: "Use latest_version_pointer to automatically create a view pointing to the latest version of a versioned model."
id: "latest_version_pointer"
resource_types: [models]
datatype: "{<dictionary>}"
---

import LatestVersionPointerBeta from '/snippets/_latest-version-pointer-beta.md';
import LatestVersionPointerCollision from '/snippets/_latest-version-pointer-collision.md';

<VersionCallout version="1.12" />

# latest_version_pointer <Lifecycle status="beta" />

<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
    { label: 'Project file', value: 'project-yaml', },
    { label: 'Property file', value: 'property-yaml', },
    { label: 'SQL config', value: 'config', },
  ]
}>

<TabItem value="project-yaml">

<File name='dbt_project.yml'>

```yaml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)latest_version_pointer:
      enabled: true | false
      alias: <string>
```

</File>

</TabItem>

<TabItem value="property-yaml">

<File name='models/schema.yml'>

```yaml
models:
  - name: [<model-name>]
    config:
      latest_version_pointer:
        enabled: true | false
        alias: <string>
```

</File>

</TabItem>

<TabItem value="config">

<File name='models/<model_name>.sql'>

```sql
{{ config(
    latest_version_pointer={
        "enabled": true | false,
        "alias": "<string>"
    }
) }}
```

</File>

</TabItem>

</Tabs>

## Definition

<LatestVersionPointerBeta />

The `latest_version_pointer` config creates a view named after a [versioned model's](/docs/mesh/govern/model-versions) base name (for example, `dim_customers`) that always points to the latest versioned relation (for example, `dim_customers_v2`). The view is created after the model with `is_latest_version = true` materializes successfully and is skipped for all other versions.

You can also enable this feature globally for all versioned models by setting the [`latest_version_pointer_enabled_by_default`](/reference/global-configs/behavior-changes#latest-version-pointer-for-versioned-models) flag to `true` in `dbt_project.yml`:

<File name='dbt_project.yml'>

```yaml
flags:
  latest_version_pointer_enabled_by_default: true
```

</File>

`latest_version_pointer` accepts two optional sub-keys for per-model control:

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `enabled` | boolean | — | Enables or disables the pointer view for this model. Overrides the `latest_version_pointer_enabled_by_default` project flag when set; defers to the flag when not set. |
| `alias` | string | Model base name | Custom name for the pointer view. Overrides the default base name. For more information, see [Alias customization](#alias-customization).|

## Alias customization

By default, the pointer view uses the model's base name (for example, `dim_customers`). You can customize this in two ways:

- **Per model**: Set `latest_version_pointer.alias` in the model config.
- **Globally**: Override the [`generate_latest_version_pointer_alias`](/docs/build/custom-aliases#generate_latest_version_pointer_alias) macro in your project. This macro follows the same pattern as [`generate_alias_name`](/docs/build/custom-aliases#generate_alias_name).

<LatestVersionPointerCollision />

## Related documentation

- [Model versions](/docs/mesh/govern/model-versions)
- [Pointing to the latest version](/docs/mesh/govern/model-versions#pointing-to-the-latest-version)
- [`latest_version_pointer_enabled_by_default` flag](/reference/global-configs/behavior-changes#latest-version-pointer-for-versioned-models)
- [`versions`](/reference/resource-properties/versions)
- [`latest_version`](/reference/resource-properties/latest_version)
