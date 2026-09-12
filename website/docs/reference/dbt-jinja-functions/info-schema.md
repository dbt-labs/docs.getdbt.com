---
title: "About the info_schema macro"
sidebar_label: "info_schema"
id: "info-schema-macro"
description: "Use the `info_schema()` macro in check SQL files to query project metadata at parse time."
availability:
  engine: v2
---

`{{ info_schema('<view_name>') }}` is the supported way to query project metadata inside [project quality checks](/docs/build/project-checks). Pass the name of the view you want to query (for example, `{{ info_schema('models') }}` to query models, or `{{ info_schema('edges') }}` to query DAG edges). The macro reads from a logical view layer over your project metadata built at parse time. Checks can access the latest project metadata without requiring materialized [Information Schema](/reference/info-schema) files.

Each view exposes a set of columns you can select and filter on in your check SQL. For example, to find models without a description:

```sql
select name
from {{ info_schema('models') }}
where description = ''
```

For the full list of columns available for each view, refer to the [Views and columns reference](/reference/info-schema-views).

Only views whose columns are fully populated at parse time are available. Passing a view name that doesn't exist or isn't available at parse time causes the check to fail with a message listing what is available.

:::note
Run results and other post-run data are not available in checks. Project checks run _before_ models execute, so post-run views do not exist at check time.
:::