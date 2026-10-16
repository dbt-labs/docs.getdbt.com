---
title:  How does increasing job frequency affect cost reduction estimates?
description: "Explanation of how increasing run frequency affects cost reductions"
sidebar_label: 'Job frequency and cost reductions'
id: job-frequency
---

Cost reduction metrics reflect how dbt optimizes compute costs by reusing existing results instead of running the same model again.

When you increase your job run frequency (for example, because performance improvements make it easier to schedule jobs more often), dbt has more opportunities to reuse models. As reuse increases, dbt optimizes more compute, which means your reported cost reductions may also increase.

This metric shows the efficiency impact of reuse within your current workload. It reflects the compute costs that dbt reduces by reusing models instead of rebuilding them, rather than showing your total warehouse spend reduction.
