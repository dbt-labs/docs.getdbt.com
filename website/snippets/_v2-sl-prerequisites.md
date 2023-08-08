
<VersionBlock firstVersion="1.6">

To use the Semantic Layer, you must:

- Have a dbt Cloud Team or Enterprise [multi-tenant](/docs/cloud/about-cloud/regions-ip-addresses) deployment, hosted in North America.
- Have both your production and development environments running dbt version 1.6 or higher.
- Use Snowflake, BigQuery, Databricks, or Redshift (dbt Cloud Postgres support coming soon).
-  Create a successful run in the environment where you configure the Semantic Layer. <br/>
  **Note:** Semantic Layer currently supports the Deployment environment. (_development experience coming soon_)
- Install the [MetricFlow CLI](/docs/build/metricflow-cli). After installing the package, make sure you run at least one model.
- Set up the [Semantic Layer API](/docs/dbt-cloud-apis/sl-api-overview) in the integrated tool to import metric definitions. <br /> 
**Note:** Developer accounts can only query data manually using the [MetricFlow CLI](/docs/build/metricflow-cli) and SQL. To dynamically query metrics using external tools, you must have a dbt Cloud Team or Enterprise account with access to the Semantic Layer API.<br />
- Understand [MetricFlow's](/docs/build/about-metricflow) key concepts, which powers the revamped dbt Semantic Layer.


</VersionBlock>


<VersionBlock firstVersion="1.3" lastVersion="1.5" >

- Have a multi-tenant dbt Cloud instance, <a href="https://docs.getdbt.com/docs/cloud/about-cloud/regions-ip-addresses">hosted</a> in North America <br />
- Have both your production and development environments running dbt version 1.3 or higher <br />
- Use Snowflake data platform <br />
- Install the <a href="https://hub.getdbt.com/dbt-labs/metrics/latest/">dbt metrics package</a> version <code>>=1.3.0, <1.4.0</code> in your dbt project <br />
  * **Note** &mdash; After installing the dbt metrics package and updating the `packages.yml` file, make sure you run at least one model.
- Set up the <a href="https://docs.getdbt.com/docs/dbt-cloud-apis/discovery-api">Discovery API</a> in the integrated tool to import metric definitions 
  * Developer accounts will be able to query the Proxy Server using SQL, but will not be able to browse pre-populated dbt metrics in external tools, which requires access to the Discovery API <br />

</VersionBlock>

<VersionBlock lastVersion="1.2">

- Have a multi-tenant dbt Cloud instance, <a href="https://docs.getdbt.com/docs/cloud/about-cloud/regions-ip-addresses">hosted</a> in North America <br /> 
- Have both your production and development environments running dbt version 1.2 <br />
- Use Snowflake data platform <br />
- Install the <a href="https://hub.getdbt.com/dbt-labs/metrics/latest/">dbt metrics package</a> version <code>>=0.3.0, <0.4.0</code> in your dbt project <br />
  * **Note** &mdash; After installing the dbt metrics package and updating the `packages.yml` file, make sure you run at least one model.
- Set up the <a href="https://docs.getdbt.com/docs/dbt-cloud-apis/discovery-api">Discovery API</a> in the integrated tool to import metric definitions 
  * Developer accounts will be able to query the Proxy Server using SQL, but will not be able to browse pre-populated dbt metrics in external tools, which requires access to the Discovery API <br />

</VersionBlock>
