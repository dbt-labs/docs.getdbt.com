:::info Upgrade your dbt version to access the new dbt Semantic Layer

The dbt Semantic Layer has undergone a [significant revamp](https://www.getdbt.com/blog/dbt-semantic-layer-whats-next/), making it more efficient to define and query metrics. We've introduced improved governance, enhanced efficiency, data accessibility, and new Semantic Layer APIs.

**What’s changed?** The dbt_metrics package has been [deprecated](https://docs.getdbt.com/blog/deprecating-dbt-metrics) and replaced with [MetricFlow](/docs/build/about-metricflow?version=1.6), one of the Semantic Layer's key component and a new way framework for defining metrics in dbt. The dbt_metrics package is no longer supported and won't receive any code fixes.

**What should you do?** If you're using the legacy Semantic Layer, we **highly** recommend you [upgrade your dbt version](/docs/dbt-versions/upgrade-core-in-cloud) to dbt v1.6 or higher to use the new dbt Semantic Layer. Refer to the dedicated [migration guide](/guides/migration/sl-migration) for more info.

**Who does this affect?** Users on[Team or Enterprise plans](https://www.getdbt.com/pricing/) hosted on a multi-tenant North American [deployment region](/docs/cloud/about-cloud/regions-ip-addresses) and using dbt v1.6 or later can access the newly enhanced dbt Semantic Layer. Users on dbt Cloud Developer plans or dbt Core users can use MetricFlow to only define and test metrics locally.

:::
