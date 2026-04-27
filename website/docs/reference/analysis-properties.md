---
title: Analysis properties
---

import PropsCallout from '/snippets/_config-prop-callout.md';
import AnalysesProjectLevelConfig from '/snippets/_analyses-project-level-config.md';

<VersionBlock lastVersion="1.11">

We recommend you define analysis properties in your `analyses/` directory, which is illustrated in the [`analysis-paths`](/reference/project-configs/analysis-paths) configuration. <PropsCallout title={frontMatter.title}/>  <br /> 

You can name these files `whatever_you_want.yml`, and nest them arbitrarily deeply in subfolders within the `analyses/` or `models/` directory.
</VersionBlock>

<VersionBlock firstVersion="1.12">

We recommend you define analysis properties in your `analyses/` directory, which is illustrated in the [`analysis-paths`](/reference/project-configs/analysis-paths) configuration. You can name these files `whatever_you_want.yml`, and nest them arbitrarily deeply in subfolders within the `analyses/` or `models/` directory.

</VersionBlock>

<File name='analyses/<filename>.yml'>

```yml

analyses:
  - name: <analysis_name> # required
    [description](/reference/resource-properties/description): <markdown_string>
    config:
      [enabled](/reference/resource-configs/enabled): true | false
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

<AnalysesProjectLevelConfig />

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

</File>

</VersionBlock>
