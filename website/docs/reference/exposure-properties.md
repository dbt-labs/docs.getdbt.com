---
title: Exposure properties
description: "Read this guide to understand exposure properties in dbt."
---

## Related documentation
- [Using exposures](/docs/build/exposures)
- [Declaring resource properties](/reference/configs-and-properties)

## Overview

import PropsCallout from '/snippets/_config-prop-callout.md';

Exposures are defined in `properties.yml` files nested under an `exposures:` key. You may define `exposures` in YAML files that also define `sources` or `models`. <PropsCallout title={frontMatter.title}/>  <br /> 

Note that while most exposure properties must be configured directly in these YAML files, you can set the [`enabled`](/reference/resource-configs/enabled) config at the [project level](#project-level-configs) in the`dbt_project.yml` file.


You can name these files `whatever_you_want.yml`, and nest them arbitrarily deeply in subfolders within the `models/` directory.

Exposure names must contain only letters, numbers, and underscores (no spaces or special characters). For a short human-friendly name with title casing, spaces, and special characters, use the `label` property.

<File name='models/<filename>.yml'>

```yml
version: 2

exposures:
  - name: <string_with_underscores>
    [description](/reference/resource-properties/description): <markdown_string>
    type: {dashboard, notebook, analysis, ml, application}
    url: <string>
    maturity: {high, medium, low}  # Indicates level of confidence or stability in the exposure
    [enabled](/reference/resource-configs/enabled): true | false
    config: # 'tags' and 'meta' changed to config in v1.10
      [tags](/reference/resource-configs/tags): [<string>] 
      [meta](/reference/resource-configs/meta): {<dictionary>} 
    owner: # supports 'name' and 'email' only
      name: <string>
      email: <string>
    
    depends_on:
      - ref('model')
      - ref('seed')
      - source('name', 'table')
      - metric('metric_name')
      
    label: "Human-Friendly Name for this Exposure!"
    [config](/reference/resource-properties/config):
      enabled: true | false

  - name: ... # declare properties of additional exposures
```
</File>

## Example

<File name='models/jaffle/exposures.yml'>

```yaml
version: 2

exposures:

  - name: weekly_jaffle_metrics
    label: Jaffles by the Week              # optional
    type: dashboard                         # required
    maturity: high                          # optional
    url: https://bi.tool/dashboards/1       # optional
    description: >                          # optional
      Did someone say "exponential growth"?

    depends_on:                             # expected
      - ref('fct_orders')
      - ref('dim_customers')
      - source('gsheets', 'goals')
      - metric('count_orders')

    owner:
      name: Callum McData
      email: data@jaffleshop.com


      
  - name: jaffle_recommender
    maturity: medium
    type: ml
    url: https://jupyter.org/mycoolalg
    description: >
      Deep learning to power personalized "Discover Sandwiches Weekly"
    
    depends_on:
      - ref('fct_orders')
      
    owner:
      name: Data Science Drew
      email: data@jaffleshop.com

      
  - name: jaffle_wrapped
    type: application
    description: Tell users about their favorite jaffles of the year
    depends_on: [ ref('fct_orders') ]
    owner: { email: summer-intern@jaffleshop.com }
```

</File>

#### Project-level configs

You can define project-level configs for exposures in the `dbt_project.yml` file under the `exposures:` key using the `+` prefix. Currently, only the [`enabled` config](/reference/resource-configs/enabled) is supported:

<File name="dbt_project.yml">

```yml
name: 'project_name'

# rest of dbt_project.yml

exposures:
  +enabled: true
```

</File>
