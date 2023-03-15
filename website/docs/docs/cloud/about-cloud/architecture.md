---
title: Architecture
id: architecture
---

This page is intended to help practitioners and those interested in the architecture and data flow of the hosted dbt Cloud product.

## About dbt Cloud architecture

The dbt Cloud application comprises a set of static and dynamic components. The static components are constantly running to serve highly available dbt Cloud functionality, for example, the dbt Cloud web application. The dynamic components are created ad-hoc to fill background jobs or requests to use the IDE. 

dbt Cloud is available in most regions around the world in both [single tenant](/docs/cloud/about-cloud/tenancy#single-tenant)(AWS and Azure) and [multi-tenant](/docs/cloud/about-cloud/tenancy#multi-tenant) configurations.  

dbt Cloud uses PostgreSQL for its backend, S3-compatible Object Storage systems for logs and artifacts, and a Kubernetes storage solution for creating dynamic, persistent volumes. 

All data at rest on dbt Cloud servers is protected using AES-256 encryption. 

<img src="/img/docs/dbt-cloud/on-premises/data-flows.png" />

For a more detailed breakdown of the dbt Cloud apps, [download the advanced architecture guide PDF](https://drive.google.com/uc?export=download&id=1lktNuMZybXfqFtr24J8zAssEfoL9r51S).

## Communication

dbt Cloud can communicate with several external services, including data platforms, git repositories, authentication services, and directories. All communications occur over HTTPS (attempts to connect via HTTP are redirected to HTTPS). dbt Cloud encrypts in transit using the TLS 1.2 cryptographic protocol. 

TLS (Transport Layer Security) 1.2 is an industry-standard protocol for encrypting sensitive data while it travels over the public internet (which does not offer native encryption).

A typical scenario that might be seen frequently worldwide is an employee working in a public space, such as an airport or café. The user might be connected to an unsecured public network offered by a facility to which many others are also connected. What if there is a bad actor amongst them running a program (such as Wireshark) that can "capture" network packets and analyze them over the air?

Let's say the user is accessing dbt Cloud and running models accessing information from a data platform in this public space while connected to the unsecured network. When users interact with dbt Cloud, the information sent from their computer to the service is encrypted with TLS 1.2.

If that user runs a command that initializes communication between dbt Cloud and the data warehouse (or a git repo or an auth service) over the internet, that communication is also encrypted.  This means that while the bad actor can technically see the traffic moving over that unsecured network, they can't read or otherwise parse any information. They will not be able to eavesdrop on or hack the information in any way whatsoever. At most, they'd see a nonsensical set of characters that no person or computer on earth can decrypt (unless they have a couple hundred years to spare).

For more detailed information on our security practices, read our [Security page](https://getdbt.com/security).

### Data warehouse interaction

dbt Cloud's primary role is as a data processor, not a data store. The dbt Cloud application enables users to dispatch SQL to the warehouse for transformation. However, users can post SQL that returns customer data into the dbt Cloud application. This data never persists and will only exist in memory on the instance for the duration of the session. To properly lock down customer data, proper <Term id="data-warehouse" /> permissions must be applied to prevent improper access or storage of sensitive data.

### Git sync

dbt Cloud can sync with a variety of git repos, including [Github](/docs/cloud/git/connect-github) and [Gitlab](/docs/cloud/git/connect-gitlab), within its integrated development environment ([IDE](/docs/cloud/develop-in-the-cloud)). Communication takes place over HTTPS, rather than SSH, and is protected using the TLS 1.2 protocol for data in transit.

The git repo information is stored on dbt Cloud servers to make it accessible during the IDE sessions. When the git sync is disabled, you must [contact support](mailto:support@getdbt.com) to request deletion of the synced data. 

### Authentication services

The default settings of dbt Cloud enable local users with credentials stored in dbt Cloud, but integration with a variety of authentication services are offered as an alternative, including [single sign-on services](/docs/cloud/manage-access/sso-overview). Access to features can be granted/restricted by role using [RBAC](/docs/cloud/manage-access/enterprise-permissions).

## Security

dbt Labs is dedicated to upholding industry standards for Cloud security and GDPR compliance. For more information on dbt Cloud security, including our compliance certificates, please read our [Security page](https://www.getdbt.com/security/).
