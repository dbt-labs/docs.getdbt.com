---
title: "Snapshots"
sidebar_label: "Snapshots"
description: "How the ClickHouse connector supports dbt snapshots to record changes to a mutable model over time."
---

dbt snapshots allow a record to be made of changes to a mutable model over time. This in turn allows point-in-time
queries on models, where analysts can “look back in time” at the previous state of a model. This functionality is
supported by the ClickHouse connector and is configured using the following syntax:


<VersionBlock firstVersion="1.9">

<File name='snapshots/<model_name>.sql'>

```jinja
{{
   config(
     schema = "<schema-name>",
     unique_key = "<column-name>",
     strategy = "<strategy>",
     updated_at = "<updated-at-column-name>",
   )
}}
```

</File>

</VersionBlock>

For more information on configuration, check out the [snapshot configs](/reference/snapshot-configs) reference page.
