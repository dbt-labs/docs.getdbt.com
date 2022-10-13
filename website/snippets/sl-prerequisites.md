<VersionBlock firstVersion="1.3" >

- Have a multi-tenant dbt Cloud account, <a href="https://docs.getdbt.com/docs/deploy/regions">hosted</a> in North America.
  * Team and Enterprise accounts will be able to set up the Semantic Layer and Metadata API in the integrated partner tool to import metric definition. 
  * Developer accounts will be able to query the Proxy Server using SQL, but will not be able to browse pre-populated dbt metrics in external tools, which requires access to the Metadata API. <br />
- Have both your production and development environments running dbt version 1.3 or higher <br />
- Use Snowflake data platform <br />
- Install the <a href="https://hub.getdbt.com/dbt-labs/metrics/latest/">dbt metrics package</a> version <code>">=1.3.0", "<1.4.0"</code> in your dbt project <br />
- Set up the <a href="https://docs.getdbt.com/docs/dbt-cloud/dbt-cloud-api/metadata/metadata-overview">Metadata API</a> in the integrated tool to import metric definitions <br />
- Recommended - Review the <a href="https://docs.getdbt.com/docs/building-a-dbt-project/metrics">dbt metrics page</a> and <a href="https://docs.getdbt.com/blog/getting-started-with-the-dbt-semantic-layer">Getting started with the dbt Semantic Layer</a> blog <br />

</VersionBlock>

<VersionBlock lastVersion="1.2">

- Have a multi-tenant dbt Cloud account, <a href="https://docs.getdbt.com/docs/deploy/regions">hosted</a> in North America.
  * Team and Enterprise accounts will be able to set up the Semantic Layer and Metadata API in the integrated partner tool to import metric definition. 
  * Developer accounts will be able to query the Proxy Server using SQL, but will not be able to browse pre-populated dbt metrics in external tools, which requires access to the Metadata API. <br />
- Have both your production and development environments running dbt version 1.2 (latest) <br />
- Use Snowflake data platform <br />
- Install the <a href="https://hub.getdbt.com/dbt-labs/metrics/latest/">dbt metrics package</a> version <code>">=1.3.0", "<1.4.0"</code> in your dbt project <br />
- Set up the <a href="https://docs.getdbt.com/docs/dbt-cloud/dbt-cloud-api/metadata/metadata-overview">Metadata API</a> in the integrated tool to import metric definitions <br />
- Recommended - Review the <a href="https://docs.getdbt.com/docs/building-a-dbt-project/metrics">dbt metrics page</a> and <a href="https://docs.getdbt.com/blog/getting-started-with-the-dbt-semantic-layer">Getting started with the dbt Semantic Layer</a> blog <br />

</VersionBlock>
