---
title: "About the info_schema macro"
sidebar_label: "info_schema"
id: "info-schema-macro"
description: "Use the `info_schema()` macro in check SQL files to query project metadata at parse time."
availability:
  engine: v2
---

`{{ info_schema('<view_name>') }}` is the supported way to query the [dbt Information Schema](/docs/build/dbt-information-schema) with [`dbt show --inline`](/docs/build/dbt-information-schema#querying-with-dbt-show) or in a [check](/docs/build/checks). 

When you pass the name of the view you want to query (for example, `{{ info_schema('models') }}`), the macro reads from a logical view layer built at parse time. Checks access project metadata directly at parse time &mdash; no materialized [Information Schema](/reference/info-schema) files required. `dbt show --inline` reads the same metadata, but requires you to first run `dbt build` or `dbt run`.

Each view exposes a set of columns you can select and filter on in your check SQL. For example, to find models without a description:

```sql
select name
from {{ info_schema('models') }}
where description = ''
```

For the full list of columns available for each view, refer to the [Views and columns reference](/reference/info-schema-views).

:::note
Checks currently only have access to parse-time metadata. Only views whose columns are fully populated at parse time are available. Passing a view name that doesn't exist or isn't available at parse time causes the check to fail with a message listing what is available.
:::