---
title: "GCP private connectivity"
id: gcp-overview
description: "Configure private connections for GCP deployments of the dbt platform."
sidebar_label: "About GCP Private Service Connect"
---

import SetUpPages from '/snippets/_available-tiers-private-connection.md';
import GCPMatrix from '/snippets/_gcp-private-connectivity-matrix.md';

<SetUpPages features={'/snippets/_available-tiers-private-connection.md'}/>

GCP Private Service Connect enables secure, private connectivity between <Constant name="dbt" /> and your GCP-hosted services. With Private Service Connect, traffic between dbt and your data platforms or self-hosted services stays within the Google Cloud network and does not traverse the public internet.

For more details, refer to the [GCP Private Service Connect documentation](https://cloud.google.com/vpc/docs/private-service-connect).

<GCPMatrix />

## Cross-region private connections

dbt Labs has globally connected private networks specifically used to host private endpoints, which are connected to <Constant name="dbt" /> instance environments. This connectivity allows <Constant name="dbt" /> environments to connect to any supported region from any <Constant name="dbt" /> instance within the same cloud provider network. To ensure security, access to these endpoints is protected by security groups, network policies, and application connection safeguards, in addition to the authentication and authorization mechanisms provided by each of the connected platforms.