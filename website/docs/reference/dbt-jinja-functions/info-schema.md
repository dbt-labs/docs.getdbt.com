---
title: "About the info_schema macro"
sidebar_label: "info_schema"
id: "info-schema-macro"
description: "Use the `info_schema()` macro to reference dbt Information Schema tables in checks or with dbt show --inline."
availability:
  engine: v2
---

`{{ info_schema('<view_name>') }}` is the supported way to reference [dbt Information Schema](/docs/build/dbt-information-schema) tables in a [check](/docs/build/checks) or with [`dbt show --inline`](/docs/build/dbt-information-schema#querying-with-dbt-show).

When you pass the name of the view you want to query (for example, `{{ info_schema('models') }}`), the macro reads from a logical view layer built at parse time.

For example, to find models without a description:

```sql
select name
from {{ info_schema('models') }}
where description = ''
```

For the full list of columns available for each view, refer to [Columns available for checks](/reference/info-schema#columns-available-for-checks).

:::note
Checks can only access parse-time project metadata. Only views whose columns are fully populated at parse time are available. Passing a view name that doesn't exist or isn't available at parse time causes the check to fail with a message listing what is available.
:::