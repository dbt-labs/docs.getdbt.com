---
title: Analysis properties
---

import PropsCallout from '/snippets/_config-prop-callout.md';

<VersionBlock lastVersion="1.11">

We recommend you define analysis properties in your `analyses/` directory, which is illustrated in the [`analysis-paths`](/reference/project-configs/analysis-paths) configuration. <PropsCallout title={frontMatter.title}/>  <br /> 

You can name these files `whatever_you_want.yml`, and nest them arbitrarily deeply in subfolders within the `analyses/` or `models/` directory.
</VersionBlock>

<VersionBlock firstVersion="1.12">

We recommend you define analysis properties in your `analyses/` directory, which is illustrated in the [`analysis-paths`](/reference/project-configs/analysis-paths) configuration. You can name these files `whatever_you_want.yml`, and nest them arbitrarily deeply in subfolders within the `analyses/` directory.

</VersionBlock>

<File name='analyses/<filename>.yml'>

```yml

analyses:
  - name: <analysis_name> # required
    [description](/reference/resource-properties/description): <markdown_string>
    config:
      [docs](/reference/resource-configs/docs): # changed to config in v1.10
        show: true | false
        node_color: <color_id> # Use name (such as node_color: purple) or hex code with quotes (such as node_color: "#cd7f32")
      [tags](/reference/resource-configs/tags): <string> | [<string>]
    columns:
      - name: <column_name>
        [description](/reference/resource-properties/description): <markdown_string>
      - name: ... # declare properties of additional columns

  - name: ... # declare properties of additional analyses

```

</File>

<VersionBlock firstVersion="1.12">

You can also configure analyses at the project level in `dbt_project.yml`. Note that `enabled` is the only config supported for project-level configuration of analyses. Refer to [Analyses](/docs/build/analyses#project-level-configuration) for more information.

:::info Beta feature
The project-level configuration for analyses is a beta feature in <Constant name="core" /> v1.12.
:::

<File name='dbt_project.yml'>

```yaml
flags:
  require_corrected_analysis_fqns: true

analyses:
  +[enabled](/reference/resource-configs/enabled): true | false
```

You can also configure analyses at the folder level by nesting subfolders under your project name in the `analyses` block.

<File name='dbt_project.yml'>

```yaml
analyses:
  your_project:
    +enabled: false  # disable all analyses by default
    my_subfolder:
      +enabled: true  # enable a specific subfolder
```

</File>

</VersionBlock>
