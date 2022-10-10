---
title: "Regions"
id: "regions"
description: "Available regions"
---

Users on dbt Cloud Enterprise plans can choose to have their account hosted in any of the below regions:

| Region | Location | Access URL | IP addresses | 
|--------|----------|------------|--------------|
| North America | us-east-1 (N. Virginia) | cloud.getdbt.com | 52.45.144.63 <br /> 54.81.134.249 <br />52.22.161.231 |
| EMEA | eu-central-1	(Frankfurt) | emea.dbt.com | 3.123.45.39 <br /> 3.126.140.248 <br /> 3.72.153.148 |
| Virttual Private dbt | Customized |  Customized | Ask [Support](/guides/legacy/getting-help#dbt-cloud-support) for your IPs |


dbt Cloud will always connect to your data platform from the above IP addresses. Be sure to allow traffic from these IPs in your firewall, and include them in any database grants.

:::info 📌

Organizations **must** choose a single region per dbt Cloud account. If you need to run dbt Cloud in multiple regions, we recommend using multiple dbt Cloud accounts. 

:::
