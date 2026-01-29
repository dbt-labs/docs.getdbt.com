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

---

## Cross-region private connections

dbt Labs maintains globally connected private networks to host Private Service Connect endpoints across GCP regions. This allows <Constant name="cloud" /> environments to connect to supported regions from any <Constant name="cloud" /> instance within GCP. Access to these endpoints is protected by network policies and application connection safeguards, in addition to the authentication and authorization mechanisms provided by each connected platform.

Some GCP services, such as BigQuery, may have regional restrictions for Private Service Connect endpoints. Refer to [Google's Private Service Connect documentation](https://cloud.google.com/vpc/docs/private-service-connect) for service-specific regional availability.

:::caution Environment variables
Using [Environment variables](/docs/build/environment-variables) when configuring private connection endpoints isn't supported in <Constant name="cloud" />. Instead, use [Extended Attributes](/docs/deploy/deploy-environments#extended-attributes) to dynamically change these values in your <Constant name="cloud" /> environment.
:::
