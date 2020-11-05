---
title: Exposure properties
---

<Changelog>

* Exposures are new in `v0.18.1`

</Changelog>

## Related documentation
- [Declaring resource properties](declaring-properties)

Exposures are defined in `.yml` files in your `models` directory (as defined by the [`source-paths` config](source-paths)), nested under an `exposures:` key.

You can name these files `whatever_you_want.yml`, and nest them arbitrarily deeply in subfolders within the `models/` directory.

### Available Properties

Required:
- **name**
- **type**: one of `dashboard`, `notebook`, `analysis`, `ml`, `application`
- **owner**: email

Expected:
- **depends_on**: list of relations (`ref` + `source`)

Optional properties:
- **url**
- **maturity**: one of `high`, `medium`, `low`
- **owner**: name

We plan to add more subtypes and optional properties in future releases.

<File name='models/<filename>.yml'>

```yml
version: 2

exposures:
  - name: <string>
    [description](description): <markdown_string>
    type: {dashboard, notebook, analysis, ml, application}
    url: <string>
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
