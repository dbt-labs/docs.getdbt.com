---
title: How do I load data into my warehouse?
---
dbt assumes that you already have a copy of your data, in your data warehouse. We recommend you use an off-the-shelf tool like [Stitch](https://www.stitchdata.com/) or [Fivetran](https://fivetran.com/) to get data into your warehouse.

**Can dbt be used to load data?**

No, dbt does not extract or load data. It focuses on the transformation step only.
