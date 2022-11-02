---
title: How do I load data into my warehouse?
description: "Recommendations on tools to load data to warehouse"
sidebar_label: 'Recommendations on tools to get data into your warehouse'
id: loading-data

---
dbt assumes that you already have a copy of your data, in your <Term id="data-warehouse" />. We recommend you use an off-the-shelf tool like [Stitch](https://www.stitchdata.com/) or [Fivetran](https://fivetran.com/) to get data into your warehouse.

**Can dbt be used to load data?**

No, dbt does not extract or load data. It focuses on the transformation step only.
