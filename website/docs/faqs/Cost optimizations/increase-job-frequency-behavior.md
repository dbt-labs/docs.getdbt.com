---
title:  How will cost and cost reductions change if I update my jobs to run them more frequently?
description: "Explanation of how increasing run frequency affects cost reductions"
sidebar_label: 'Cost Insights and frequency changes of runs'
id: metadata-warehouse-costs
---

Our reduction metric reflects the compute costs avoided when dbt reuses an existing result instead of running the same work again. When you change the behavior of your runs and run workflows more frequently — for example, because performance improvements make it easier to schedule them more often — there are naturally more opportunities for reuse.
As reuse increases, the total avoided compute increases as well. So as your run frequency grows, your reported savings may grow too.
This metric is designed to show the efficiency impact of reuse within your current workload. It reflects compute costs avoided through smarter execution, rather than total warehouse spend reduction.
