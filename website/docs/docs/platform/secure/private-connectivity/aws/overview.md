---
title: "AWS private connectivity"
id: aws-overview
description: "Configure private connections for AWS deployments of the dbt platform."
sidebar_label: "About AWS PrivateLink"
---

import SetUpPages from '/snippets/_available-tiers-enterprise-plus.md';
import AWSMatrix from '/snippets/_aws-private-connectivity-matrix.md';

<SetUpPages />

AWS PrivateLink enables secure, private connectivity between <Constant name="dbt" /> and your AWS-hosted services. With PrivateLink, traffic between dbt and your data platforms or self-hosted services stays within the AWS network and does not traverse the public internet.

For more details, refer to the [AWS PrivateLink documentation](https://docs.aws.amazon.com/vpc/latest/privatelink/).

<AWSMatrix />

## Cross-region private connections

dbt Labs has globally connected private networks specifically used to host private endpoints, which are connected to <Constant name="dbt" /> instance environments. This connectivity allows <Constant name="dbt" /> environments to connect to any supported region from any <Constant name="dbt" /> instance within the same cloud provider network. To ensure security, access to these endpoints is protected by security groups, network policies, and application connection safeguards, in addition to the authentication and authorization mechanisms provided by each of the connected platforms.