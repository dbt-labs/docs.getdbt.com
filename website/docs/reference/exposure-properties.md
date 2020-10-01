---
title: Exposure properties
---

<Changelog>

* Exposures are new in `v0.18.1`

</Changelog>

## Related documentation
- [Using exposures](using-exposures)
- [Declaring resource properties](declaring-properties)

Exposure properties can be declared in `.yml` files in:
- your `data/` directory (as defined by the [`data-paths` config](data-paths))

You can name these files `whatever_you_want.yml`, and nest them arbitrarily deeply in subfolders within `models/` directory.

### Available Properties

Required:
- **name**
- **type**: one of `dashboard`, `notebook`, `analysis`, `ml`, `application`
- **owner**: email

Expected:
- **depends_on**: list of relations (`ref` + `source`)

Optional properties:
- **maturity**: one of `high`, `medium`, `low`
- **owner**: name

We plan to add more subtypes and optional properties in future releases.

<File name='data/<filename>.yml'>

```yml
version: 2

exposures:
  - name: <string>
    [description](description): <markdown_string>
    type: {dashboard, notebook, analysis, ml, application}
    maturity: {high, medium, low}
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
