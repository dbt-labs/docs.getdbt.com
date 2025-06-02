---
title: "Deprecation of dbt Server"
description: "Announcing the deprecation of dbt Server and what you need to know"
slug: deprecation-of-dbt-server

authors: [roxi_dahlke]

tags: [dbt Server]
hide_table_of_contents: false

date: 2024-01-15
is_featured: false
---

## Summary

We’re announcing that [dbt Server](https://github.com/dbt-labs/dbt-server) is officially deprecated and will no longer be maintained by dbt Labs going forward. You can continue to use the repository and fork it for your needs. We’re also looking for a maintainer of the repository from our community! If you’re interested, please reach out by opening an issue in the [repository](https://github.com/dbt-labs/dbt-server/issues).


<!-- truncate -->
## Why are we deprecating dbt Server?

At dbt Labs, we are continually working to build rich experiences that help our users scale collaboration around data. To achieve this vision, we need to take moments to think about which products are contributing to this goal, and sometimes make hard decisions about the ones that are not, so that we can focus on enhancing the most impactful ones. 

dbt Server previously supported our legacy Semantic Layer, which was [fully deprecated in December 2023](https://docs.getdbt.com/docs/dbt-versions/release-notes/Dec-2023/legacy-sl). In October 2023, we introduced the GA of the revamped dbt Semantic Layer with [significant improvements](https://www.getdbt.com/blog/build-centralize-and-deliver-consistent-metrics-with-the-dbt-semantic-layer), made possible by the [acquisition of Transform](https://www.getdbt.com/blog/dbt-acquisition-transform) and the integration of [MetricFlow](https://docs.getdbt.com/docs/build/about-metricflow) into dbt. 

The dbt Semantic Layer is now fully independent of dbt Server and operates on MetricFlow Server, a powerful new proprietary technology designed for enhanced scalability. We’re incredibly excited about the new updates and encourage you to check out our [documentation](https://docs.getdbt.com/docs/use-dbt-semantic-layer/dbt-sl), as well as [this blog](https://www.getdbt.com/blog/how-the-dbt-semantic-layer-works) on how the product works.

The deprecation of dbt Server and updates to the Semantic Layer signify the evolution of the dbt ecosystem towards more focus on in product and out-of-the-box experiences around connectivity, scale, and flexibility. We are excited that you are along with us on this journey. 
