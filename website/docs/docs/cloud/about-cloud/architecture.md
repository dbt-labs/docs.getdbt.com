---
title: "dbt Architecture"
id: "architecture"
description: "Information about the architecture, communication, and security of dbt"
---

This page helps practitioners and those interested in <Constant name="cloud" />'s architecture and data flow.

## About dbt architecture

The <Constant name="cloud" /> application has two types of components: static and dynamic. The static components are always running to serve highly available <Constant name="cloud" /> functions, like the <Constant name="cloud" /> web application. On the other hand, the dynamic components are created ad-hoc to handle tasks such as background jobs or requests to use the <Constant name="cloud_ide" />.

<Constant name="cloud" /> is available in most regions around the world in both [single tenant](/docs/cloud/about-cloud/tenancy#single-tenant) (AWS and Azure) and [multi-tenant](/docs/cloud/about-cloud/tenancy#multi-tenant) configurations.  

<Constant name="cloud" /> uses PostgreSQL for its backend, S3-compatible Object Storage systems for logs and artifacts, and a Kubernetes storage solution for creating dynamic, persistent volumes. 

All data at rest on <Constant name="cloud" /> servers is protected using AES-256 encryption. 

<img src="/img/docs/dbt-cloud/on-premises/data-flows.png" />

For a more detailed breakdown of the <Constant name="cloud" /> apps, [download the advanced architecture guide PDF](https://drive.google.com/uc?export=download&id=1lktNuMZybXfqFtr24J8zAssEfoL9r51S).

## Communication

<Constant name="cloud" /> can communicate with several external services, including data platforms, git repositories, authentication services, and directories. All communications occur over HTTPS (attempts to connect via HTTP are redirected to HTTPS). <Constant name="cloud" /> encrypts in transit using the TLS 1.2 cryptographic protocol. 

TLS (Transport Layer Security) 1.2 is an industry-standard protocol for encrypting sensitive data while it travels over the public internet (which does not offer native encryption).

A typical scenario that might be seen frequently is an employee working in a public space, such as an airport or café. The user might be connected to an unsecured public network offered by a facility to which many others are also connected. What if there is a bad actor amongst them running a program that can "capture" network packets and analyze them over the air?

When that user is accessing <Constant name="cloud" /> and running models that interact with the data platform, the information sent to and from their computer and the services is encrypted with TLS 1.2.

If that user runs a command that initializes communication between <Constant name="cloud" /> and the data warehouse (or a git repo or an auth service) over the internet, that communication is also encrypted.  This means that while the bad actor can technically see the traffic moving over that unsecured network, they can't read or otherwise parse any information. They will not be able to eavesdrop on or hack the information in any way whatsoever. They would see a nonsensical set of characters that nobody can decrypt.

For more detailed information on our security practices, read our [Security page](https://getdbt.com/security).

### Data warehouse interaction

<Constant name="cloud" />'s primary role is as a data processor, not a data store. The <Constant name="cloud" /> application enables users to dispatch SQL to the warehouse for transformation. However, users can post SQL that returns customer data into the <Constant name="cloud" /> application. This data never persists and will only exist in memory on the instance for the duration of the session. To lock down customer data correctly, proper <Term id="data-warehouse" /> permissions must be applied to prevent improper access or storage of sensitive data.


Some data warehouse providers offer advanced security features that can be leveraged in <Constant name="cloud" />. [Private connections](/docs/cloud/secure/about-private-connectivity) allows supported data platforms on AWS to communicate with <Constant name="cloud" /> without the traffic traversing the public internet. [Snowflake](/docs/cloud/manage-access/set-up-snowflake-oauth) and [BigQuery](/docs/cloud/manage-access/set-up-bigquery-oauth) offer Oauth integration which adds a layer of security for the data platforms (Enterprise-tier plan only).

### Git sync

<Constant name="cloud" /> can sync with a variety of git providers, including [Github](/docs/cloud/git/connect-github), [Gitlab](/docs/cloud/git/connect-gitlab), and [Azure DevOps](/docs/cloud/git/connect-azure-devops) within its integrated development environment ([<Constant name="cloud_ide" />](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud)). Communication takes place over HTTPS rather than SSH and is protected using the TLS 1.2 protocol for data in transit.

The git repo information is stored on <Constant name="cloud" /> servers to make it accessible during the <Constant name="cloud_ide" /> sessions. When the git sync is disabled, you must [contact support](mailto:support@getdbt.com) to request the deletion of the synced data. 

### Authentication services

The default settings of <Constant name="cloud" /> enable local users with credentials stored in <Constant name="cloud" />. Still, integrations with various authentication services are offered as an alternative, including [single sign-on services](/docs/cloud/manage-access/sso-overview). Access to features can be granted/restricted by role using [RBAC](/docs/cloud/manage-access/about-user-access#role-based-access-control-).

SSO features are essential because they reduce the number of credentials a user must maintain. Users sign in once and the authentication token is shared among integrated services (such as <Constant name="cloud" />). The token expires and must be refreshed at predetermined intervals, requiring the user to go through the authentication process again. If the user is disabled in the SSO provider service, their access to <Constant name="cloud" /> is disabled, and they cannot override this with local auth credentials. 

[Snowflake](/docs/cloud/manage-access/set-up-snowflake-oauth) and [BigQuery](/docs/cloud/manage-access/set-up-bigquery-oauth) offer OAuth (JSON to pass info and API calls for auth) services as an alternative to SAML (XML to pass info and session cookies for auth). Users can authenticate against the data platform for secure access to <Constant name="cloud" /> and prevent access when credentials are revoked. 

## Security

dbt Labs is dedicated to upholding industry standards for Cloud security and GDPR compliance. Our compliance certifications include the following:

- SOC2 Type II &mdash; assesses a service provider’s security control environment against the trust services principles and criteria set forth by the American Institute of Certified Public Accountants (AICPA).
- ISO27001:2013 &mdash; a globally recognized standard for establishing and certifying an information security management system (ISMS).
- GDPR - dbt Labs is committed to maintaining GDPR compliance standards. Read more about our [Data Processing Addendum](https://www.getdbt.com/cloud/dpa).


For more detailed information about our security practices, read our [Security page](https://www.getdbt.com/security/).


