---
title: "AWS private connectivity"
id: aws-overview
description: "Configure private connections for AWS deployments of dbt Cloud"
sidebar_label: "Overview"
---

import SetUpPages from '/snippets/_available-tiers-private-connection.md';
import AWSMatrix from '/snippets/_aws-private-connectivity-matrix.md';

<SetUpPages features={'/snippets/_available-tiers-private-connection.md'}/>

AWS PrivateLink enables secure, private connectivity between <Constant name="cloud" /> and your AWS-hosted services. With PrivateLink, traffic between dbt and your data platforms or self-hosted services stays within the AWS network and does not traverse the public internet.

For more details, refer to the [AWS PrivateLink documentation](https://docs.aws.amazon.com/vpc/latest/privatelink/).

<AWSMatrix />

---

## Configuration guides

### Data platforms

- [Snowflake](/docs/cloud/secure/private-connectivity/aws/aws-snowflake)
- [Databricks](/docs/cloud/secure/private-connectivity/aws/aws-databricks)
- [Redshift](/docs/cloud/secure/private-connectivity/aws/aws-redshift)
- [Postgres](/docs/cloud/secure/private-connectivity/aws/aws-postgres)

### Self-hosted services

- [Self-hosted services (VCS, databases, and more)](/docs/cloud/secure/private-connectivity/aws/aws-self-hosted)

---

## Terminology

For definitions of terms like **Native**, **Vendor**, **Customer-provisioned**, and **dbt-provisioned**, see the [Terminology section](/docs/cloud/secure/private-connectivity/private-connectivity#terminology) in the private connectivity overview.
