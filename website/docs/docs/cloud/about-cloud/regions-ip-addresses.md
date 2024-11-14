---
title: "Access, Regions, & IP addresses"
sidebar: "Access, Regions, & IP Addresses"
id: "access-regions-ip-addresses"
description: "Available regions and ip addresses"
---

dbt Cloud is [hosted](/docs/cloud/about-cloud/architecture) in multiple regions and will always connect to your data platform or git provider from the below IP addresses. Be sure to allow traffic from these IPs in your firewall, and include them in any database grants.

[dbt Cloud Enterprise](https://www.getdbt.com/pricing/) plans can choose to have their account hosted in any of the below regions. Organizations **must** choose a single region per dbt Cloud account. If you need to run dbt Cloud in multiple regions, we recommend using multiple dbt Cloud accounts. 


| Region | Location | Access URL | IP addresses | Developer plan | Team plan | Enterprise plan |
|--------|----------|------------|--------------|----------------|-----------|-----------------|
| North America [^1] | AWS us-east-1 (N. Virginia) | **Multi-tenant:** cloud.getdbt.com <br /> **Cell based:** ACCOUNT_PREFIX.us1.dbt.com | 52.45.144.63 <br /> 54.81.134.249 <br />52.22.161.231 <br />52.3.77.232 <br />3.214.191.130 <br />34.233.79.135 | ✅ | ✅ | ✅ |
| EMEA [^1] | AWS eu-central-1	(Frankfurt) | emea.dbt.com | 3.123.45.39 <br /> 3.126.140.248 <br /> 3.72.153.148 | ❌ | ❌ | ✅ |
| EMEA [^1] | Azure <br /> North Europe (Ireland)  |    **Cell based:** ACCOUNT_PREFIX.eu2.dbt.com  | 20.13.190.192/26                                     | ❌ | ❌ | ✅ |
| APAC  [^1] | 	AWS ap-southeast-2  (Sydney)| au.dbt.com | 52.65.89.235 <br /> 3.106.40.33 <br /> 13.239.155.206 <br />| ❌ | ❌ | ✅ |
| Virtual Private dbt or Single tenant | Customized |  Customized | Ask [Support](/community/resources/getting-help#dbt-cloud-support) for your IPs | ❌ | ❌ | ✅ |


[^1]: These regions support [multi-tenant](/docs/cloud/about-cloud/tenancy) deployment environments hosted by dbt Labs.

## Accessing your account

To log into dbt Cloud, use the URL that applies to your environment.  Your access URL used will depend on a few factors, including location and tenancy:
- **US multi-tenant:** Use your unique URL that starts with your account prefix, followed by `us1.dbt.com`. For example, `abc123.us1.dbt.com`. You can also use `cloud.getdbt.com`, but this URL will be removed in the future. 
    - If you are unsure of your access URL, navigate to `us1.dbt.com` and enter your dbt Cloud credentials. If you are a member of a single account, you will be logged in, and your URL will be displayed in the browser. If you are a member of multiple accounts, you will be presented with a list of options, along with the appropriate login URLs for each.

    <Lightbox src="/img/docs/dbt-cloud/find-account.png" title="dbt Cloud accounts" />

- **EMEA multi-tenant:** Use `emea.dbt.com`.
- **APAC multi-tenant:** Use `au.dbt.com`.
- **Worldwide single-tenant and VPC:** Use the vanity URL provided during your onboarding.

## Locating your dbt Cloud IP addresses

There are two ways to view your dbt Cloud IP addresses:
- If no projects exist in the account, create a new project, and the IP addresses will be displayed during the **Configure your environment** steps.
- If you have an existing project, navigate to **Account Settings** and ensure you are in the **Projects** pane. Click on a project name, and the **Project Settings** window will open. Locate the **Connection** field and click on the name. Scroll down to the **Settings**, and the first text block lists your IP addresses. 

### Static IP addresses

dbt Cloud, like many cloud services, relies on underlying AWS cloud infrastructure for operations. While we can offer static URLs for access, we cannot provide a list of IP addresses to configure connections due to the nature of AWS cloud services.

* Dynamic IP addresses &mdash; dbt Cloud infrastructure uses Amazon Web Services (AWS). dbt Cloud offers static URLs for streamlined access, but the dynamic nature of cloud services means the underlying IP addresses change occasionally. AWS manages the IP ranges and may change them according to their operational and security needs.

* Using hostnames for consistent access &mdash; To ensure uninterrupted access, we recommend that you use dbt Cloud services using hostnames. Hostnames provide a consistent reference point, regardless of any changes in underlying IP addresses. We are aligning with an industry-standard practice employed by organizations such as Snowflake.

* Optimizing VPN connections &mdash; You should integrate a proxy alongside VPN for users who leverage VPN connections. This strategy enables steady IP addresses for your connections, facilitating smooth traffic flow through the VPN and onward to dbt Cloud. By employing a proxy and a VPN, you can direct traffic through the VPN and then to dbt Cloud. It's crucial to set up the proxy if you need to integrate with additional services.

## API Access URLs

dbt Cloud accounts with cell-based account prefixes have unique access URLs for account APIs. These URLs can be found in your **Account settings** below the **Account information** pane.

<Lightbox src="/img/docs/dbt-cloud/access-urls.png" title="Access URLs in the account settings" />

These URLs are unique to each account and begin with the same prefix as the URL used to [access your account](#accessing-your-account). The URLs cover the following APIs:

- Admin API (via access URL)
- Semantic Layer JDBC API
- Semantic Layer GraphQL API
- Discovery API 

Learn more about these features in our [API documentation](/docs/dbt-cloud-apis/overview).
