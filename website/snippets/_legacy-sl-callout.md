:::info Upgrade your dbt version to access the new dbt Semantic Layer

The dbt Semantic Layer has undergone a [significant revamp](https://www.getdbt.com/blog/dbt-semantic-layer-whats-next/), making it more efficient to define and query metrics.

**What’s changed?** The dbt_metrics package has been [deprecated](https://docs.getdbt.com/blog/deprecating-dbt-metrics) and replaced with [MetricFlow](/docs/build/about-metricflow?version=1.6), one of the Semantic Layer's key component and a new way framework for defining metrics in dbt.

**Who does this affect?** The revamped dbt Semantic Layer is available for users on a [Team or Enterprise plans](https://www.getdbt.com/pricing/) on dbt v1.6 and higher. To learn more about it, make sure you select v1.6 or higher in the docs navigation header and [upgrade your dbt version](/docs/dbt-versions/upgrade-core-in-cloud). 

**What should you do?** We **highly** recommend you upgrade to dbt v1.6 and higher to use the new and most recent version of the dbt Semantic Layer, powered by MetricFlow. 

You can still use and configure the legacy dbt Semantic Layer using the deprecated dbt_metrics package on v1.5 or older, however, these versions are no longer supported and won't receive any code fixes. 

:::
