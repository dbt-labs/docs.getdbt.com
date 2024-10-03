---
title: "dbt Cloud Administrative API"
id: "admin-cloud-api"
pagination_next: "docs/dbt-cloud-apis/discovery-api"
---

The dbt Cloud Administrative API is enabled by default for [Team and Enterprise plans](https://www.getdbt.com/pricing/). It can be used to:

- Download artifacts after a job has completed
- Kick off a job run from an orchestration tool
- Manage your dbt Cloud account
- and more

dbt Cloud currently supports two versions of the Administrative API: v2 and v3. In general, v3 is the recommended version to use, but we don't yet have all our v2 routes upgraded to v3. We're currently working on this. If you can't find something in our v3 docs, check out the shorter list of v2 endpoints because you might find it there. 

Many endpoints of the Administrative API can also be called through the [dbt Cloud Terraform provider](https://registry.terraform.io/providers/dbt-labs/dbtcloud/latest). The built-in documentation on the Terraform registry contains [a guide on how to get started with the provider](https://registry.terraform.io/providers/dbt-labs/dbtcloud/latest/docs/guides/1_getting_started) as well as [a page showing all the Terraform resources available](https://registry.terraform.io/providers/dbt-labs/dbtcloud/latest/docs/guides/99_list_resources) to configure.

<div className="grid--2-col">

<Card
    title="API v2"
    body="Our legacy API version, with limited endpoints and features. Contains information not available in v3."
link="/dbt-cloud/api-v2"
    icon="pencil-paper"/>

<Card
    title="API v3"
    body="Our latest API version, with new endpoints and features."
link="/dbt-cloud/api-v3"
    icon="pencil-paper"/>

<div className="card-container">
 <Card
    title="dbt Cloud Terraform provider"
    link="https://registry.terraform.io/providers/dbt-labs/dbtcloud/latest"
    body="The Terraform provider maintained by dbt Labs which can be used to manage a dbt Cloud account."
    icon="pencil-paper"/>
    <a href="https://registry.terraform.io/providers/dbt-labs/dbtcloud/latest"
    className="external-link"      
    target="_blank"
    rel="noopener noreferrer">
    <Icon name='fa-external-link' />
  </a>
</div>
    
</div>
