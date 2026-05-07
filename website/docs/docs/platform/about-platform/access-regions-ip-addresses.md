---
title: "Access, Regions, & IP addresses"
sidebar: "Access, Regions, & IP Addresses"
id: "access-regions-ip-addresses"
description: "Available regions and ip addresses"
---

<Constant name="dbt" /> is [hosted](/docs/platform/about-platform/architecture) in multiple regions across the following service providers:

- [Amazon Web Services](#AWS)
- [Google Cloud Platform](#GCP)
- [Microsoft Azure](#Azure)

Your <Constant name="dbt" /> account will always connect to your data platform or git provider from the below IP addresses. Be sure to allow traffic from these IPs in your firewall, and include them in any database grants.

- [<Constant name="dbt" /> Enterprise-tier](https://www.getdbt.com/pricing/) plans can choose to have their account hosted in any of the regions listed in the following table. 
- Organizations **must** choose a single region per <Constant name="dbt" /> account. To run <Constant name="dbt" /> in multiple regions, we recommend using multiple <Constant name="dbt" /> accounts. 

## Amazon Web Services (AWS) {#AWS}

<FilterableTable>

| Region | Location | <div style={{width:'110px'}}>Access URL</div> | <div style={{width:'100px'}}>IP addresses</div> | Available plans | <div style={{width:'200px'}}>Status page link</div> |
|--------|----------|------------|--------------|-------| --------- |
| North America  | AWS us-east-1 (N. Virginia) | <small>ACCOUNT_PREFIX.us1.dbt.com</small> | 52.45.144.63 <br /> 54.81.134.249 <br />52.22.161.231 <br />52.3.77.232 <br />3.214.191.130 <br />34.233.79.135 | [All dbt platform plans](https://www.getdbt.com/pricing/) | **Multi-tenant:** <br /> [US AWS](https://status.getdbt.com/us-aws)<br /><br /> **Cell based:** <br />[US Cell 1 AWS](https://status.getdbt.com/us-cell-1-aws) <br /> [US Cell 2 AWS](https://status.getdbt.com/us-cell-2-aws) <br /> [US Cell 3 AWS](https://status.getdbt.com/us-cell-3-aws) |
| EMEA  | eu-central-1	(Frankfurt) | <small>ACCOUNT_PREFIX.eu1.dbt.com</small> | 3.123.45.39 <br /> 3.126.140.248 <br /> 3.72.153.148 | All Enterprise plans | [EMEA AWS](https://status.getdbt.com/emea-aws) |
| APAC  | ap-southeast-2  (Sydney)| <small>ACCOUNT_PREFIX.au1.dbt.com</small> | 52.65.89.235 <br /> 3.106.40.33 <br /> 13.239.155.206 <br />|  All Enterprise plans | [APAC AWS](https://status.getdbt.com/apac-aws) |
| Japan | ap-northeast-1 (Tokyo) | <small>ACCOUNT_PREFIX.jp1.dbt.com</small> | 35.76.76.152 <br />  54.238.211.79 <br /> 13.115.236.233 <br /> | All Enterprise plans | [JP Cell 1 AWS](https://status.getdbt.com/jp-cell-1-aws) | 
| Virtual Private dbt or Single tenant | Customized |  Customized | Ask [Support](/community/resources/getting-help#dbt-cloud-support) for your IPs | All Enterprise plans | Customized |

</FilterableTable>

## Google Cloud Platform (GCP) {#GCP}

<FilterableTable>

| Region | Location | <div style={{width:'110px'}}>Access URL</div> | <div style={{width:'100px'}}>IP addresses</div> | Available plans | <div style={{width:'200px'}}>Status page link</div> |
|--------|----------|------------|--------------|-------| --------- |
| North America  | us-central1 | <small>ACCOUNT_PREFIX.us3.dbt.com</small> | 34.33.2.0/26 | All Enterprise plans | [US Cell 1 GCP](https://status.getdbt.com/us-cell-1-gcp) | 
| EMEA  | London  |  <small>ACCOUNT_PREFIX.eu3.dbt.com</small> |  34.39.41.0/26  | All Enterprise plans | [EU Cell 1 GCP](https://status.getdbt.com/eu-cell-1-gcp) |
| EMEA  | Frankfurt | <small>ACCOUNT_PREFIX.eu4.dbt.com</small> | 34.185.244.128/26 | All Enteprise plans | [EU4 Cell 1 GCP](https://status.getdbt.com/eu-4-cell-1-gcp) |

</FilterableTable>

## Microsoft Azure {#Azure}

<FilterableTable>

| Region | Location | <div style={{width:'110px'}}>Access URL</div> | <div style={{width:'100px'}}>IP addresses</div> | Available plans | <div style={{width:'200px'}}>Status page link</div> |
|--------|----------|------------|--------------|-------| --------- |
| North America  | East US 2 (Virginia) | <small>ACCOUNT_PREFIX.us2.dbt.com</small> | 20.10.67.192/26 | All Enterprise plans | [US Cell 1 AZURE](https://status.getdbt.com/us-cell-1-azure) |
| EMEA  |  North Europe (Ireland)  |  <small>ACCOUNT_PREFIX.eu2.dbt.com</small>  | 20.13.190.192/26   | All Enterprise plans | [EMEA Cell 1 AZURE](https://status.getdbt.com/emea-cell-1-azure) |
| Virtual Private dbt or Single tenant | Customized |  Customized | Ask [Support](/community/resources/getting-help#dbt-cloud-support) for your IPs | All Enterprise plans | Customized |

</FilterableTable>

## Accessing your account

The recommended way to sign in to <Constant name="dbt_platform"/> is [https://login.dbt.com](https://login.dbt.com). Enter your email, verify it, and select the account you want to open from the list of accounts associated with your email. For more information about the login process, refer to [Log in to dbt platform](/docs/platform/about-platform/login).

If you already know your account **Access URL**, you can sign in directly. Your access URL depends on your region and tenancy:

<Lightbox src="/img/docs/dbt-platform/find-account.png" width="60%" title="dbt accounts" />

- **US multi-tenant:** `ACCOUNT_PREFIX.us1.dbt.com` (for example, `abc123.us1.dbt.com`)
- **EMEA multi-tenant:** `ACCOUNT_PREFIX.eu1.dbt.com` (for example, `abc123.eu1.dbt.com`)
- **APAC multi-tenant:** `ACCOUNT_PREFIX.au1.dbt.com` (for example, `abc123.au1.dbt.com`)
- **Worldwide single-tenant and VPC:** Use the vanity URL provided during your onboarding.

Refer to the [tables earlier](#AWS) for the full list of access URLs by region.

## Locating your dbt IP addresses

There are two ways to view your <Constant name="dbt_platform" /> IP addresses:
- If no projects exist in the account, create a new project, and the IP addresses will be displayed during the **Configure your environment** steps.
- If you have an existing project, navigate to **Account Settings** and ensure you are in the **Projects** pane. Click on a project name, and the **Project Settings** window will open. Locate the **Connection** field and click on the name. Scroll down to the **Settings**, and the first text block lists your IP addresses. 

### Static IP addresses

<Constant name="dbt_platform" /> is hosted on AWS, Azure, and the Google Cloud Platform (GCP). While we can offer static URLs for access, we cannot provide a list of IP addresses to configure connections due to the nature of these cloud services.

* Dynamic IP addresses &mdash; <Constant name="dbt_platform" /> provides static URLs for streamlined access, but the dynamic nature of cloud services means the underlying IP addresses can change occasionally. Cloud providers manage these IP ranges and may update them based on operational and security needs.

* Using hostnames for consistent access &mdash; To ensure uninterrupted access, use <Constant name="dbt_platform" /> hostnames. Hostnames provide a consistent reference point, such as `abc123.us1.dbt.com`, even if underlying IP addresses change. This aligns with an industry-standard practice used by platforms such as Snowflake.

* Optimizing VPN connections &mdash; You should integrate a proxy alongside VPN for users who leverage VPN connections. This strategy enables steady IP addresses for your connections, facilitating smooth traffic flow through the VPN and onward to <Constant name="dbt_platform" />. By employing a proxy and a VPN, you can direct traffic through the VPN and then to <Constant name="dbt_platform" />. It's crucial to set up the proxy if you need to integrate with additional services.

## API Access URLs

For <Constant name="dbt_platform" /> accounts with cell-based account prefixes, account API access URLs are unique per account. You can find these URLs in **Account settings**, under **Account information**.

<Lightbox src="/img/docs/dbt-platform/access-urls.png" title="Access URLs in the account settings" />

These URLs are unique to each account and begin with the same prefix as the URL used to [access your account](#accessing-your-account). The URLs cover the following APIs:

- Admin API (via access URL)
- <Constant name="semantic_layer" /> JDBC API
- <Constant name="semantic_layer" /> GraphQL API
- Discovery API 

Learn more about these features in our [API documentation](/docs/dbt-apis/overview).
