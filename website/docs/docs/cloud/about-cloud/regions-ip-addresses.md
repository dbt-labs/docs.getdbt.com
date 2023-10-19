---
title: "Regions & IP addresses"
id: "regions-ip-addresses"
description: "Available regions and ip addresses"
---

dbt Cloud is [hosted](/docs/cloud/about-cloud/architecture) in multiple regions and will always connect to your data platform or git provider from the below IP addresses. Be sure to allow traffic from these IPs in your firewall, and include them in any database grants.

[dbt Cloud Enterprise](https://www.getdbt.com/pricing/) plans can choose to have their account hosted in any of the below regions. Organizations **must** choose a single region per dbt Cloud account. If you need to run dbt Cloud in multiple regions, we recommend using multiple dbt Cloud accounts. 


| Region | Location | Access URL | IP addresses | Developer plan | Team plan | Enterprise plan |
|--------|----------|------------|--------------|----------------|-----------|-----------------|
| North America multi-tenant [^1] | AWS us-east-1 (N. Virginia) | cloud.getdbt.com | 52.45.144.63 <br /> 54.81.134.249 <br />52.22.161.231 | ✅ | ✅ | ✅ |
| North America Cell 1 [^1]       | AWS use-east-1 (N.Virginia) | {account prefix}.us1.dbt.com | [Located in Account Settings](#locating-your-dbt-cloud-ip-addresses) | ❌ | ❌ | ❌ |
| EMEA [^1] | AWS eu-central-1	(Frankfurt) | emea.dbt.com | 3.123.45.39 <br /> 3.126.140.248 <br /> 3.72.153.148 | ❌ | ❌ | ✅ |
| APAC  [^1] | 	AWS ap-southeast-2  (Sydney)| au.dbt.com | 52.65.89.235 <br /> 3.106.40.33 <br /> 13.239.155.206 <br />| ❌ | ❌ | ✅ |
| Virtual Private dbt or Single tenant | Customized |  Customized | Ask [Support](/community/resources/getting-help#dbt-cloud-support) for your IPs | ❌ | ❌ | ✅ |


[^1]: These regions support [multi-tenant](/docs/cloud/about-cloud/tenancy) deployment environments hosted by dbt Labs.

### Locating your dbt Cloud IP addresses

There are two ways to view your dbt Cloud IP addresses:
- If no projects exist in the account, create a new project, and the IP addresses will be displayed during the **Configure your environment** steps.
- If you have an existing project, navigate to **Account Settings** and ensure you are in the **Projects** pane. Click on a project name, and the **Project Settings** window will open. Locate the **Connection** field and click on the name. Scroll down to the **Settings**, and the first text block lists your IP addresses. 

### Static IP addresses

dbt Cloud, like many cloud services, relies on underlying AWS cloud infrastructure for operations. While we can offer exact URLs for access, we're unable to provide a list of static IP addresses to configure connections due to its cloud nature.

1. Dynamic IP addresses &mdash; dbt Cloud infrastructure uses Amazon Web Services (AWS). dbt Cloud offers static URLs for streamlined access, but the dynamic nature of cloud services means the underlying IP addresses change occasionally. AWS manages the IP ranges and may change them according to their operational and security needs.

2. Using hostnames for consistent access &mdash; To ensure uninterrupted access to dbt Cloud services, it's recommended that you use hostnames for configurations. Hostnames provide a consistent reference point, regardless of any changes in underlying IP addresses. This is an industry-standard practice employed by organizations such as Snowflake.

3. Optimizing VPN connections &mdash; We suggest integrating a proxy alongside the VPN for users who leverage VPN connections. This strategy enables steady IP addresses for your connections, facilitating smooth traffic flow through the VPN and onward to dbt Cloud. By employing a proxy and a VPN, traffic can be directed through the VPN and then to dbt Cloud. If there's any need to integrate with additional services, it's crucial to set up the proxy accordingly.
