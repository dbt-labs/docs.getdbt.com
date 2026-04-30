---
title: "About network security"
id: about-network-security
description: "Configure network security for dbt Cloud"
sidebar_label: "About network security"
---

Network security in <Constant name="dbt" /> gives you control over how traffic flows between dbt and your infrastructure. Choose the approach that best fits your security requirements.

## Choose your connectivity approach

<div className="grid--2-col">

<Card
    title="Over the public internet"
    body="Use IP restrictions to limit which IP addresses can access dbt Cloud or your data platform."
    link="/docs/platform/secure/ip-restrictions"
    icon="dbt-bit"
/>

<Card
    title="Over a private network"
    body="Use your cloud provider's private connectivity technology to keep traffic off the public internet entirely."
    link="/docs/platform/secure/private-connectivity/private-connectivity"
    icon="dbt-bit"
/>

</div>
