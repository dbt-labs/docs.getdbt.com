---
title: "AWS private connectivity"
id: aws-overview
description: "Configure private connections for AWS deployments of the dbt platform."
sidebar_label: "Overview"
---

import SetUpPages from '/snippets/_available-tiers-private-connection.md';
import AWSMatrix from '/snippets/_aws-private-connectivity-matrix.md';
import Terminology from '/snippets/_terminology.md';

<SetUpPages />

AWS PrivateLink enables secure, private connectivity between <Constant name="cloud" /> and your AWS-hosted services. With PrivateLink, traffic between dbt and your data platforms or self-hosted services stays within the AWS network and does not traverse the public internet.

For more details, refer to the [AWS PrivateLink documentation](https://docs.aws.amazon.com/vpc/latest/privatelink/).

<AWSMatrix />


<Terminology />