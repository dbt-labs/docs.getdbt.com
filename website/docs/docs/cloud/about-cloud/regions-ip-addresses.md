---
title: "Access, Regions, & IP addresses"
sidebar: "Access, Regions, & IP Addresses"
id: "access-regions-ip-addresses"
description: "Available regions and ip addresses"
---

<Constant name="cloud" /> is [hosted](/docs/cloud/about-cloud/architecture) in multiple regions and will always connect to your data platform or git provider from the below IP addresses. Be sure to allow traffic from these IPs in your firewall, and include them in any database grants.

- [<Constant name="cloud" /> Enterprise-tier](https://www.getdbt.com/pricing/) plans can choose to have their account hosted in any of the regions listed in the following table. 
- Organizations **must** choose a single region per <Constant name="cloud" /> account. To run <Constant name="cloud" /> in multiple regions, we recommend using multiple <Constant name="cloud" /> accounts. 

| Region | Location | Access URL | IP addresses | Available plans | <div style={{width:'130px'}}>Status page link</div> |
|--------|----------|------------|--------------|-------| --------- |
| North America [^1] | AWS us-east-1 (N. Virginia) | **Multi-tenant:**<br />cloud.getdbt.com <br /><br /> **Cell based:** ACCOUNT_PREFIX.us1.dbt.com | 52.45.144.63 <br /> 54.81.134.249 <br />52.22.161.231 <br />52.3.77.232 <br />3.214.191.130 <br />34.233.79.135 | [All dbt platform plans](https://www.getdbt.com/pricing/) | **Multi-tenant:** <br /> [US AWS](https://status.getdbt.com/us-aws)<br /><br /> **Cell based:** <br />[US Cell 1 AWS](https://status.getdbt.com/us-cell-1-aws) <br /> [US Cell 2 AWS](https://status.getdbt.com/us-cell-2-aws) <br /> [US Cell 3 AWS](https://status.getdbt.com/us-cell-3-aws) |
| North America [^1] | Azure <br /> East US 2 (Virginia) | **Cell based:** ACCOUNT_PREFIX.us2.dbt.com | 20.10.67.192/26 | All Enterprise plans | [US Cell 1 AZURE](https://status.getdbt.com/us-cell-1-azure) |
| North America [^1] | GCP (us-central1) <Lifecycle status='beta'/>  | **Cell based:** ACCOUNT_PREFIX.us3.dbt.com   | 34.33.2.0/26 | All Enterprise plans | [US Cell 1 GCP](https://status.getdbt.com/us-cell-1-gcp) | 
| EMEA [^1] | AWS eu-central-1	(Frankfurt) | emea.dbt.com | 3.123.45.39 <br /> 3.126.140.248 <br /> 3.72.153.148 | All Enterprise plans | [EMEA AWS](https://status.getdbt.com/emea-aws) |
| EMEA [^1] | Azure <br /> North Europe (Ireland)  |    **Cell based:** ACCOUNT_PREFIX.eu2.dbt.com  | 20.13.190.192/26   | All Enterprise plans | [EMEA Cell 1 AZURE](https://status.getdbt.com/emea-cell-1-azure) |
| APAC  [^1] | 	AWS ap-southeast-2  (Sydney)| au.dbt.com | 52.65.89.235 <br /> 3.106.40.33 <br /> 13.239.155.206 <br />|  All Enterprise plans | [APAC AWS](https://status.getdbt.com/apac-aws) |
| Virtual Private dbt or Single tenant | Customized |  Customized | Ask [Support](/community/resources/getting-help#dbt-cloud-support) for your IPs | All Enterprise plans | Customized |


[^1]: These regions support [multi-tenant](/docs/cloud/about-cloud/tenancy) deployment environments hosted by dbt Labs.

## Accessing your account

To log into <Constant name="cloud" />, use the URL that applies to your environment.  Your access URL used will depend on a few factors, including location and tenancy:
- **US multi-tenant:** Use your unique URL that starts with your account prefix, followed by `us1.dbt.com`. For example, `abc123.us1.dbt.com`. You can also use `cloud.getdbt.com`, but this URL will be removed in the future. 
    - If you are unsure of your access URL, navigate to `us1.dbt.com` and enter your <Constant name="cloud" /> credentials. If you are a member of a single account, you will be logged in, and your URL will be displayed in the browser. If you are a member of multiple accounts, you will be presented with a list of options, along with the appropriate login URLs for each.

    <Lightbox src="/img/docs/dbt-cloud/find-account.png" title="dbt accounts" />

- **EMEA multi-tenant:** Use `emea.dbt.com`.
- **APAC multi-tenant:** Use `au.dbt.com`.
- **Worldwide single-tenant and VPC:** Use the vanity URL provided during your onboarding.

## Locating your dbt IP addresses

There are two ways to view your <Constant name="cloud" /> IP addresses:
- If no projects exist in the account, create a new project, and the IP addresses will be displayed during the **Configure your environment** steps.
- If you have an existing project, navigate to **Account Settings** and ensure you are in the **Projects** pane. Click on a project name, and the **Project Settings** window will open. Locate the **Connection** field and click on the name. Scroll down to the **Settings**, and the first text block lists your IP addresses. 

### Static IP addresses

<Constant name="cloud" /> is hosted on AWS, Azure, and the Google Cloud Platform (GCP). While we can offer static URLs for access, we cannot provide a list of IP addresses to configure connections due to the nature of these cloud services.

* Dynamic IP addresses &mdash; <Constant name="cloud" /> offers static URLs for streamlined access, but the dynamic nature of cloud services means the underlying IP addresses change occasionally. The cloud service provider manages the IP ranges and may change them according to their operational and security needs.

* Using hostnames for consistent access &mdash; To ensure uninterrupted access, we recommend that you use <Constant name="cloud" /> services using hostnames. Hostnames provide a consistent reference point, regardless of any changes in underlying IP addresses. We are aligning with an industry-standard practice employed by organizations such as Snowflake.

* Optimizing VPN connections &mdash; You should integrate a proxy alongside VPN for users who leverage VPN connections. This strategy enables steady IP addresses for your connections, facilitating smooth traffic flow through the VPN and onward to <Constant name="cloud" />. By employing a proxy and a VPN, you can direct traffic through the VPN and then to <Constant name="cloud" />. It's crucial to set up the proxy if you need to integrate with additional services.

## API Access URLs

<Constant name="cloud" /> accounts with cell-based account prefixes have unique access URLs for account APIs. These URLs can be found in your **Account settings** below the **Account information** pane.

<Lightbox src="/img/docs/dbt-cloud/access-urls.png" title="Access URLs in the account settings" />

These URLs are unique to each account and begin with the same prefix as the URL used to [access your account](#accessing-your-account). The URLs cover the following APIs:

- Admin API (via access URL)
- <Constant name="semantic_layer" /> JDBC API
- <Constant name="semantic_layer" /> GraphQL API
- Discovery API 

Learn more about these features in our [API documentation](/docs/dbt-cloud-apis/overview).
