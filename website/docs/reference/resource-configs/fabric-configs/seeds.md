---
title: "Seeds"
sidebar_label: "Seeds"
description: "dbt-fabric inserts seed files in batches of 400 rows and adjusts the batch size to stay within Fabric's parameter limit."
---

By default, `dbt-fabric` will attempt to insert seed files in batches of 400 rows.
If this exceeds Microsoft Fabric Data Warehouse 2100 parameter limit, the adapter will automatically limit to the highest safe value possible.

To set a different default seed value, you can set the variable `max_batch_size` in your project configuration.

<File name="dbt_project.yml">

```yaml
vars:
  max_batch_size: 200 # Any integer less than or equal to 2100 will do.
```

</File>
