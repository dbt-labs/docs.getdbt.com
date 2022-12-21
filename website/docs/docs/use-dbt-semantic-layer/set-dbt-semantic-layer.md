---
title: "Set up the dbt Semantic Layer"
id: setup-dbt-semantic-layer
description: "You can set up the dbt Semantic Layer in dbt Cloud."
sidebar_label: "Set up the dbt Semantic Layer"
---

With the dbt Semantic Layer, you'll be able to centrally define business metrics, reduce code duplication and inconsistency, create self-service in downstream tools, and more. Configure the dbt Semantic Layer in dbt Cloud to connect with your integrated partner tool. 

## Prerequisites

Before you set up the dbt Semantic Layer, make sure you meet the following:

<VersionBlock firstVersion="1.3">

- Have a multi-tenant dbt Cloud account, <a href="https://docs.getdbt.com/docs/deploy/regions">hosted</a> in North America <br />
- Have both your production and development environments running dbt version 1.3 or higher <br />
- Use Snowflake data platform <br />
- Install the <a href="https://hub.getdbt.com/dbt-labs/metrics/latest/">dbt metrics package</a> version <code>">=1.3.0", "<1.4.0"</code> in your dbt project <br />
- Set up the <a href="https://docs.getdbt.com/docs/dbt-cloud-apis/metadata-api">Metadata API</a> in the integrated tool to import metric definitions 
  * Developer accounts will be able to query the Proxy Server using SQL, but will not be able to browse pre-populated dbt metrics in external tools, which requires access to the Metadata API <br />
- Recommended - Review the <a href="https://docs.getdbt.com/docs/build/metrics">dbt metrics page</a> and <a href="https://docs.getdbt.com/blog/understanding-the-components-of-the-dbt-semantic-layer">Understanding the components of the dbt Semantic Layer</a> blog <br />

</VersionBlock>

<VersionBlock lastVersion="1.2">

- Have a multi-tenant dbt Cloud account, <a href="https://docs.getdbt.com/docs/deploy/regions">hosted</a> in North America <br /> 
- Have both your production and development environments running dbt version 1.2 (latest) <br />
- Use Snowflake data platform <br />
- Install the <a href="https://hub.getdbt.com/dbt-labs/metrics/latest/">dbt metrics package</a> version <code>">=0.3.0", "<0.4.0"</code> in your dbt project <br />
- Set up the <a href="https://docs.getdbt.com/docs/dbt-cloud-apis/metadata-api">Metadata API</a> in the integrated tool to import metric definitions 
  * Developer accounts will be able to query the Proxy Server using SQL, but will not be able to browse pre-populated dbt metrics in external tools, which requires access to the Metadata API <br />
- Recommended - Review the <a href="https://docs.getdbt.com/docs/build/metrics">dbt metrics page</a> and <a href="https://docs.getdbt.com/blog/understanding-the-components-of-the-dbt-semantic-layer">Understanding the components of the dbt Semantic Layer</a> blog <br />

</VersionBlock>


<Snippet src="sl-considerations-banner" />


## Set up dbt Semantic Layer

<Snippet src="sl-set-up-steps" />

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/configure_sl.png" title="Set up dbt Semantic Layer in dbt Cloud" /><br />

 
## Related docs

- [Integrated partner tools](https://www.getdbt.com/product/semantic-layer-integrations) for info on the different integration partners and their documentation
- [Product architecture](/docs/use-dbt-semantic-layer/dbt-semantic-layer#product-architecture) page for more information on plan availability
- [dbt metrics](/docs/build/metrics) for in-depth detail on attributes, properties, filters, and how to define and query metrics
- [dbt Server repo](https://github.com/dbt-labs/dbt-server), which is a persisted HTTP server that wraps dbt core to handle RESTful API requests for dbt operations
