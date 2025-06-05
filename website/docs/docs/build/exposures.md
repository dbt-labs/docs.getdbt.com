---
title: "Add Exposures to your DAG"
sidebar_label: "Exposures"
id: "exposures"
---

Exposures make it possible to define and describe a downstream use of your dbt project, such as in a dashboard, application, or data science pipeline. By defining exposures, you can then:
- run, test, and list resources that feed into your exposure
- populate a dedicated page in the auto-generated [documentation](/docs/build/documentation) site with context relevant to data consumers

Exposures can be defined in two ways:
- Manual &mdash; Declared [explicitly](/docs/build/exposures#declaring-an-exposure) in your project’s YAML files.
- Automatic &mdash;  <Constant name="cloud" /> [creates and visualizes downstream exposures](/docs/cloud-integrations/downstream-exposures) automatically for supported integrations, removing the need for manual YAML definitions. These downstream exposures are stored in dbt’s metadata system, appear in [<Constant name="explorer" />](/docs/explore/explore-projects), and behave like manual exposures. However, they don’t exist in YAML files.

### Declaring an exposure

Exposures are defined in `.yml` files nested under an `exposures:` key.

The following example shows an exposure definition in a `models/<filename>.yml` file:

<File name='models/<filename>.yml'>

```yaml
version: 2

exposures:

  - name: weekly_jaffle_metrics
    label: Jaffles by the Week
    type: dashboard
    maturity: high
    url: https://bi.tool/dashboards/1
    description: >
      Did someone say "exponential growth"?

    depends_on:
      - ref('fct_orders')
      - ref('dim_customers')
      - source('gsheets', 'goals')
      - metric('count_orders')

    owner:
      name: Callum McData
      email: data@jaffleshop.com
```

</File>

### Available properties

_Required:_
- **name**: a unique exposure name written in [snake case](https://en.wikipedia.org/wiki/Snake_case)
- **type**: one of `dashboard`, `notebook`, `analysis`, `ml`, `application` (used to organize in docs site)
- **owner**: `name` or `email` required; additional properties allowed

_Expected:_
- **depends_on**: list of refable nodes, including `metric`, `ref`, and `source`. While possible, it is highly unlikely you will ever need an `exposure` to depend on a `source` directly.

_Optional:_
- **label**:  May contain spaces, capital letters, or special characters.
- **url**:  Activates and populates the link to **View this exposure** in the upper right corner of the generated documentation site
- **maturity**: Indicates the level of confidence or stability in the exposure. One of `high`, `medium`, or `low`. For example, you could use `high` maturity for a well-established dashboard, widely used and trusted within your organization. Use `low` maturity for a new or experimental analysis.

_General properties (optional)_

- [**description**](/reference/resource-properties/description)
- [**tags**](/reference/resource-configs/tags)
- [**meta**](/reference/resource-configs/meta)
- [**enabled**](/reference/resource-configs/enabled) &mdash; You can set this property at the exposure level or at the project level in the [`dbt_project.yml`](/reference/dbt_project.yml) file.

### Referencing exposures

Once an exposure is defined, you can run commands that reference it:
```
dbt run -s +exposure:weekly_jaffle_report
dbt test -s +exposure:weekly_jaffle_report

```

When we generate the [<Constant name="explorer" /> site](/docs/explore/explore-projects), you'll see the exposure appear:

<Lightbox src="/img/docs/building-a-dbt-project/dbt-explorer-exposures.jpg" title="Exposures has a dedicated section, under the 'Resources' tab in dbt Explorer,  which lists each exposure in your project."/>
<Lightbox src="/img/docs/building-a-dbt-project/dag-exposures.png" title="Exposures appear as nodes in the dbt Explorer DAG. It displays an orange 'EXP' indicator within the node. "/>

## Related docs

* [Exposure properties](/reference/exposure-properties)
* [`exposure:` selection method](/reference/node-selection/methods#exposure)
* [Data health tiles](/docs/explore/data-tile)
