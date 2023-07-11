
<VersionBlock firstVersion="1.6">

- Have a [multi-tenant dbt Cloud](/docs/deploy/regions) instance, hosted in North America
- Have both your production and development environments running dbt version 1.6 or higher 
- Use Snowflake and Postgres, BigQuery, Databricks, and Redshift data platform
- Install the [MetricFlow CLI](https://github.com/dbt-labs/metricflow) package
  * Note &mdash; After installing the package, make sure you run at least one model.
- Set up the [Discovery API](/docs/dbt-cloud-apis/discovery-api) in the integrated tool to import metric definitions 
  * Developer accounts will be able to query the Proxy Server using SQL, but will not be able to browse pre-populated dbt metrics in external tools, which requires access to the Discovery API <br />

</VersionBlock>


<VersionBlock lastVersion="1.5">

- Have a multi-tenant dbt Cloud instance, <a href="https://docs.getdbt.com/docs/deploy/regions">hosted</a> in North America <br />
- Have both your production and development environments running dbt version 1.3 or higher <br />
- Use Snowflake data platform <br />
- Install the <a href="https://hub.getdbt.com/dbt-labs/metrics/latest/">dbt metrics package</a> version <code>>=1.3.0, <1.4.0</code> in your dbt project <br />
  * **Note** &mdash; After installing the dbt metrics package and updating the `packages.yml` file, make sure you run at least one model.
- Set up the <a href="https://docs.getdbt.com/docs/dbt-cloud-apis/discovery-api">Discovery API</a> in the integrated tool to import metric definitions 
  * Developer accounts will be able to query the Proxy Server using SQL, but will not be able to browse pre-populated dbt metrics in external tools, which requires access to the Discovery API <br />
- Recommended - Review the <a href="https://docs.getdbt.com/docs/build/metrics">dbt metrics page</a> and <a href="https://docs.getdbt.com/blog/understanding-the-components-of-the-dbt-semantic-layer">Understanding the components of the dbt Semantic Layer</a> blog <br />

</VersionBlock>

<VersionBlock firstVersion="1.3" lastVersion="1.3" >

- Have a multi-tenant dbt Cloud instance, <a href="https://docs.getdbt.com/docs/deploy/regions">hosted</a> in North America <br />
- Have both your production and development environments running dbt version 1.3 or higher <br />
- Use Snowflake data platform <br />
- Install the <a href="https://hub.getdbt.com/dbt-labs/metrics/latest/">dbt metrics package</a> version <code>>=1.3.0, <1.4.0</code> in your dbt project <br />
  * **Note** &mdash; After installing the dbt metrics package and updating the `packages.yml` file, make sure you run at least one model.
- Set up the <a href="https://docs.getdbt.com/docs/dbt-cloud-apis/discovery-api">Discovery API</a> in the integrated tool to import metric definitions 
  * Developer accounts will be able to query the Proxy Server using SQL, but will not be able to browse pre-populated dbt metrics in external tools, which requires access to the Discovery API <br />
- Recommended - Review the <a href="https://docs.getdbt.com/docs/build/metrics">dbt metrics page</a> and <a href="https://docs.getdbt.com/blog/understanding-the-components-of-the-dbt-semantic-layer">Understanding the components of the dbt Semantic Layer</a> blog <br />

</VersionBlock>

<VersionBlock lastVersion="1.2">

- Have a multi-tenant dbt Cloud instance, <a href="https://docs.getdbt.com/docs/deploy/regions">hosted</a> in North America <br /> 
- Have both your production and development environments running dbt version 1.2 <br />
- Use Snowflake data platform <br />
- Install the <a href="https://hub.getdbt.com/dbt-labs/metrics/latest/">dbt metrics package</a> version <code>>=0.3.0, <0.4.0</code> in your dbt project <br />
  * **Note** &mdash; After installing the dbt metrics package and updating the `packages.yml` file, make sure you run at least one model.
- Set up the <a href="https://docs.getdbt.com/docs/dbt-cloud-apis/discovery-api">Discovery API</a> in the integrated tool to import metric definitions 
  * Developer accounts will be able to query the Proxy Server using SQL, but will not be able to browse pre-populated dbt metrics in external tools, which requires access to the Discovery API <br />
- Recommended - Review the <a href="https://docs.getdbt.com/docs/build/metrics">dbt metrics page</a> and <a href="https://docs.getdbt.com/blog/understanding-the-components-of-the-dbt-semantic-layer">Understanding the components of the dbt Semantic Layer</a> blog <br />

</VersionBlock>
