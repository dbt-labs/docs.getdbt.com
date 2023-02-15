---
id: dependencies
title: External Dependencies
---

:::note

We longer support new on-premises deployments, and instead have moved to a [Single Tenant](single-tenant) model hosted in the cloud

:::

This guide is intended to help administrators running instances of dbt Cloud on-premises understand the internal components of their instance, as well as how their instance will interact with other services over the internet.

## Required External Dependencies

dbt Cloud has several external network dependencies that are required for normal operation. This section enumerates the required external dependencies for a normal dbt Cloud installation.

### Replicated

Replicated (https://www.replicated.com/) is a third-party service that provides a management layer over the dbt Cloud Kubernetes appliance. Our installer configures an additional KOTS (https://kots.io/) appliance to configure and manage the dbt Cloud application. KOTS is open-source, Apache 2 licensed software developed by Replicated.

An overview of Replicated's security posture can be found at: https://www.replicated.com/resources/files/Replicated-Security-Whitepaper.pdf

#### Initial Installation

During initial installation, the KOTS appliance can be directly downloaded from the Internet or packaged up and delivered to your infrastructure. Access to the following resources is required:

##### Accessed via HTTPS

- `get.replicated.com`: This endpoint hosts the Replicated install script.
- `registry.replicated.com`: The private Replicated Docker registry.
- `registry-data.replicated.com`: The private Replicated Docker registry.
- `quay.io`: Some dependencies of Replicated are hosted as public images in the Quay.io registry.
- `hub.docker.com`: Some dependencies of Replicated are hosted as public images in Docker Hub.

Replicated maintains a list of Replicated-owned IPs for IP access restriction purposes at https://github.com/replicatedhq/ips/blob/main/ip_addresses.json.

#### dbt Cloud Appliance Installation and Upgrades

To install the dbt Cloud appliance or perform updates, some external connections are required. All connections are initiated from inside the network, and can vary depending on the installation method and the application update.

##### Accessed via HTTPS

- `api.replicated.com`: This endpoint services the license sync check and used to pull down yaml for app upgrades.
- `registry.replicated.com`: The private Replicated Docker registry.
- `registry-data.replicated.com`: The private Replicated Docker registry.
- `quay.io`: Some dependencies of Replicated are hosted as public images in the Quay.io registry.
- `hub.docker.com`: Some dependencies of Replicated are hosted as public images in Docker Hub.
- `usage.getdbt.com`: Your installation will send usage data to our server once per week. The schema of the data is as follows:

```json
{
    "accounts": [
        "id": 1,
        "name": "fishtown_analytics",
        "developer_licenses": 20,
        "read_only_licenses": 100,
        "dbt_cloud_version": "1.0.0"
    ]
}

```

Replicated maintains a list of Replicated-owned IPs for IP access restriction purposes at https://github.com/replicatedhq/ips/blob/main/ip_addresses.json.

#### Ongoing Access

In order to perform basic maintenance and license checking, the following outbound access is required:

##### Accessed via HTTPS

- `api.replicated.com`: This endpoint services the license sync check and is used to pull down yaml files for app upgrades.

## Optional External Dependencies

### Integrations

_Can be individually enabled or disabled_

dbt Cloud supports integrations with a number of third-party applications. If enabled, these applications will require some further network access.

- **Github, Github Enterprise, Github Enterprise Server**: if the Github integration is enabled, and you wish to make use of PR builds, you will need to grant Github the ability to send webhooks to your dbt Cloud instance.
- **Slack**: if enabled, you can send notifications on completed dbt Cloud runs to your Slack organization.
- **Email over SMTP**: if enabled, your dbt Cloud instance will be able to send email to your users.
- **Datadog**: if enabled, your dbt Cloud instance will attempt to send metrics and logs to Datadog. Note that this requires a valid Datadog agent installation.


## Inbound (Client) Traffic

dbt Cloud requires some ports to be opened for inbound traffic from admins and end users. All inbound traffic is secured using TLS / HTTPS. Upon installation, the Replicated appliance will generate a self-signed cert, and then prompt the admin configuring the installation to provide an SSL certificate to be used for securing inbound client requests to the application.

The required inbound ports are:

- 443 (tcp): For end user access to the dbt Cloud application.
- 8800 (tcp): For admin access to the dbt Cloud admin console.

### Additional Information

For additional information related to inbound traffic view the following sections.

- [Application Data Flows](docs/deploy/architecture#application-data-flows)
- [Data Warehouse Interaction](/docs/deploy/architecture#data-warehouse-interaction)
- [Customer Managed Network Architecture](/docs/deploy/architecture)
