---
title: "GCP private connectivity"
id: gcp-overview
description: "Configure private connections for GCP deployments of dbt Cloud"
sidebar_label: "Overview"
---

import SetUpPages from '/snippets/_available-tiers-private-connection.md';
import GCPMatrix from '/snippets/_gcp-private-connectivity-matrix.md';

<SetUpPages features={'/snippets/_available-tiers-private-connection.md'}/>

GCP Private Service Connect (PSC) enables secure, private connectivity between <Constant name="cloud" /> and your GCP-hosted services. With PSC, traffic between dbt and your data platforms or self-hosted services stays within the Google network and does not traverse the public internet.

For more details, refer to the [GCP Private Service Connect documentation](https://cloud.google.com/vpc/docs/private-service-connect).

<GCPMatrix />

---

## Configuration guides

### Data platforms

- [Snowflake](/docs/cloud/secure/gcp/gcp-snowflake)
- [BigQuery](/docs/cloud/secure/gcp/gcp-bigquery)

### Self-hosted services

- [Self-hosted services (VCS, databases, and more)](/docs/cloud/secure/gcp/gcp-self-hosted)

