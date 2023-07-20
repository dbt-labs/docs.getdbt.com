---
title: "Regions & IP addresses"
id: "regions-ip-addresses"
description: "Available regions and ip addresses"
---

dbt Cloud is [hosted](/docs/cloud/about-cloud/architecture) in multiple regions and will always connect to your data platform or git provider from the below IP addresses. Be sure to allow traffic from these IPs in your firewall, and include them in any database grants.

[dbt Cloud Enterprise](https://www.getdbt.com/pricing/) plans can choose to have their account hosted in any of the below regions. Organizations **must** choose a single region per dbt Cloud account. If you need to run dbt Cloud in multiple regions, we recommend using multiple dbt Cloud accounts. 


| Region | Location | Access URL | IP addresses | Developer plan | Team plan | Enterprise plan |
|--------|----------|------------|--------------|----------------|-----------|-----------------|
| North America [^1] | AWS us-east-1 (N. Virginia) | cloud.getdbt.com | 52.45.144.63 <br /> 54.81.134.249 <br />52.22.161.231 | ✅ | ✅ | ✅ |
| EMEA [^1] | AWS eu-central-1	(Frankfurt) | emea.dbt.com | 3.123.45.39 <br /> 3.126.140.248 <br /> 3.72.153.148 | ❌ | ❌ | ✅ |
| APAC  [^1] | 	AWS ap-southeast-2  (Sydney)| au.dbt.com | 52.65.89.235 <br /> 3.106.40.33 <br /> 13.239.155.206 <br />| ❌ | ❌ | ✅ |
| Virtual Private dbt or Single tenant | Customized |  Customized | Ask [Support](/community/resources/getting-help#dbt-cloud-support) for your IPs | ❌ | ❌ | ✅ |


[^1]: These regions support [multi-tenant](/docs/cloud/about-cloud/tenancy) deployment environments hosted by dbt Labs.
