---
title: "dbt Cloud Administrative API"
id: "admin-cloud-api"
---

The dbt Cloud Administrative API is enabled by default for [Team and Enterprise plans](https://www.getdbt.com/pricing/). It can be used to:

- Download artifacts after a job has completed
- Kick off a job run from an orchestration tool
- Manage your dbt Cloud account
- and more

dbt Cloud currently supports two versions of the Administrative API: v2 and v3. In general, v3 is the recommended version to use, but we don't yet have all our v2 routes upgraded to v3. We're currently working on this. If you can't find something in our v3 docs, check out the shorter list of v2 endpoints because you might find it there. 

<div className="grid--2-col">

<Card
    title="API v2 (legacy docs)"
    body="Our legacy API version, with limited endpoints and features. Contains information not available in v3."
link="/dbt-cloud/api-v2-legacy"
    icon="pencil-paper"/>

<Card
    title="API v2 (beta docs)"
    body="Our legacy API version, with limited endpoints and features. Contains information not available in v3. These docs are in beta and may not be complete."
link="/dbt-cloud/api-v2"
    icon="pencil-paper"/>

<Card
    title="API v3 (beta docs)"
    body="Our latest API version, with new endpoints and features. These docs are in beta and may not be complete."
link="/dbt-cloud/api-v3"
    icon="pencil-paper"/>

</div>
