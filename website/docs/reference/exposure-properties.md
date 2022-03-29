---
title: Exposure properties
---

<Changelog>

* Exposures are new in `v0.18.1`

</Changelog>

## Related documentation
- [Using exposures](exposures)
- [Declaring resource properties](configs-and-properties)

## Overview
Exposures are defined in `.yml` files nested under an `exposures:` key. You may define `exposures` in YAML files that also define define `sources` or `models`.

You can name these files `whatever_you_want.yml`, and nest them arbitrarily deeply in subfolders within the `models/` directory.

<File name='models/<filename>.yml'>

```yml
version: 2

exposures:
  - name: <string>
    [description](description): <markdown_string>
    type: {dashboard, notebook, analysis, ml, application}
    url: <string>
    maturity: {high, medium, low}
    [tags](resource-configs/tags): [<string>]
    [meta](resource-configs/meta): {<dictionary>}
    owner:
      name: <string>
      email: <string>
    
    depends_on:
      - ref('model')
      - ref('seed')
      - source('name', 'table')

  - name: ... # declare properties of additional exposures
```
</File>


## Example

<File name='models/jaffle/exposures.yml'>

```yaml
exposures:
  
  - name: weekly_jaffle_metrics
    type: dashboard                         # required
    maturity: high                          # optional
    url: https://bi.tool/dashboards/1       # optional
    description: >                          # optional
      Did someone say "exponential growth"?
    
    depends_on:                             # expected
      - ref('fct_orders')
      - ref('dim_customers')
      - source('gsheets', 'goals')

    owner:
      name: Claire from Data                # optional
      email: data@jaffleshop.com            # required

      
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
