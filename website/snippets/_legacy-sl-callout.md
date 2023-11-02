:::important Upgrade to access the new dbt Semantic Layer

The dbt Semantic Layer has undergone a [significant revamp](https://www.getdbt.com/blog/dbt-semantic-layer-whats-next/), improving governance, introducing a new API, and making it more efficient to define and query metrics. The legacy Semantic Layer, available in dbt v1.5 or lower, is no longer supported and won't receive any code fixes.

**Who does this affect?** Anyone who uses the legacy Semantic Layer. The new Semantic Layer is available to [Team or Enterprise](https://www.getdbt.com/pricing/) multi-tenant dbt Cloud plans [hosted in North America](/docs/cloud/about-cloud/regions-ip-addresses) (more regions coming soon). You must be on dbt v1.6 or higher to access it. Users on dbt Cloud Developer plans or dbt Core users can use MetricFlow to only define and test metrics locally.

**What’s changed?** The dbt_metrics package has been [deprecated](https://docs.getdbt.com/blog/deprecating-dbt-metrics) and replaced with [MetricFlow](/docs/build/about-metricflow?version=1.6), a new framework for defining metrics in dbt. This means dbt_metrics is no longer supported after dbt v1.5 and won't receive any code fixes.

**What should you do?** If you're using the legacy Semantic Layer, we **highly** recommend you [upgrade your dbt version](/docs/dbt-versions/upgrade-core-in-cloud) to dbt v1.6 or higher to use the new dbt Semantic Layer. To migrate to the new Semantic Layer, refer to the dedicated [migration guide](/guides/sl-migration) for more info.

:::
