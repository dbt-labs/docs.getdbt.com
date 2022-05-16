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

## Getting started

Exposures make it possible to define and describe a downstream use of your dbt project, such as in a dashboard, application, or data science pipeline. By defining exposures, you can then:
- run, test, and list resources that feed into your exposure
- populate a dedicated page in the auto-generated [documentation](documentation) site with context relevant to data consumers

### Declaring an exposure

Exposures are defined in `.yml` files nested under an `exposures:` key.

<File name='models/<filename>.yml'>

```yaml
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
- **name** (must be unique among exposures)
- **type**: one of `dashboard`, `notebook`, `analysis`, `ml`, `application` (used to organize in docs site)
- **owner**: email

_Expected:_
- **depends_on**: list of refable nodes (`ref` + `source`)

_Optional:_
- **url**
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

## Exposures are new!

Exposures were introduced in dbt v0.18.1, with a limited set of supported types and properties. If you're interested in requesting or contributing additional properties, check out issue [dbt#2835](https://github.com/dbt-labs/dbt-core/issues/2835).
