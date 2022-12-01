---
title: "Exposures"
id: "exposures"
---

<Changelog>

* **v0.18.1**: Exposures are new!
* **v0.20.0**: Exposures support `tags` and `meta` properties

</Changelog>

## Related documentation
* [Exposure properties](exposure-properties)
* [`exposure:` selection method](node-selection/methods#the-exposure-method)

## Overview

Exposures make it possible to define and describe a downstream use of your dbt project, such as in a dashboard, application, or data science pipeline. By defining exposures, you can then:
- run, test, and list resources that feed into your exposure
- populate a dedicated page in the auto-generated [documentation](documentation) site with context relevant to data consumers

### Declaring an exposure

Exposures are defined in `.yml` files nested under an `exposures:` key.

<File name='models/<filename>.yml'>

```yaml
version: 2

exposures:

  - name: weekly_jaffle_metrics
    type: dashboard
    maturity: high
    url: https://bi.tool/dashboards/1
    description: >
      Did someone say "exponential growth"?

    depends_on:
      - ref('fct_orders')
      - ref('dim_customers')
      - source('gsheets', 'goals')

    owner:
      name: Claire from Data
      email: data@jaffleshop.com
```

</File>

### Available properties

_Required:_
- **name** (must be unique among exposures and you must use the [snake case](https://en.wikipedia.org/wiki/Snake_case) naming convention)
- **type**: one of `dashboard`, `notebook`, `analysis`, `ml`, `application` (used to organize in docs site)
- **owner**: email

_Expected:_
- **depends_on**: list of refable nodes (`ref` + `source`)

_Optional:_
- **url**:  enables the link to **View this exposure** in the upper right corner of the generated documentation site
- **maturity**: one of `high`, `medium`, `low`
- **owner**: name

_General properties (optional)_
- **description**
- **tags**
- **meta**

We plan to add more subtypes and optional properties in future releases.

### Referencing exposures

Once an exposure is defined, you can run commands that reference it:
```
dbt run -s +exposure:weekly_jaffle_metrics
dbt test -s +exposure:weekly_jaffle_metrics
```

When we generate our documentation site, you'll see the exposure appear:

<Lightbox src="/img/docs/building-a-dbt-project/dbt-docs-exposures.png" title="Dedicated page in dbt-docs for each exposure"/>
<Lightbox src="/img/docs/building-a-dbt-project/dag-exposures.png" title="Exposures appear as orange-y nodes in the DAG"/>
