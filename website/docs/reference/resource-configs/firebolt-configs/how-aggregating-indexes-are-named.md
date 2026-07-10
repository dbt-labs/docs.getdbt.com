---
title: "How aggregating indexes are named"
sidebar_label: "Aggregating index naming"
description: "Learn how dbt-firebolt automatically generates names for aggregating indexes using a set naming convention."
---

In dbt-firebolt, you do not provide names for aggregating indexes; they are named programmatically. dbt will generate index names using the following convention:

```
<table-name>__<key-column>__<index-type>_<unix-timestamp-at-execution>
```

For example, a join index could be named `my_users__id__join_1633504263` and an aggregating index could be named `my_orders__order_date__aggregating_1633504263`.
