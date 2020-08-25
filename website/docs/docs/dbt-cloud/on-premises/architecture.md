---
id: architecture
title: Architecture & Data Flows
---

This guide is intended to help administrators running instances of dbt Cloud on-premises understand the internal components of their instance, as well as how their instance will interact with other services over the internet.

## Required External Dependencies

dbt Cloud has several external network dependencies that are required for normal operation. This section enumerates the required external dependencies for a normal dbt Cloud installation.

### Replicated

Replicated (https://www.replicated.com/) is a third-party service that provides a management layer over the dbt Cloud Kubernetes appliance. Our installer configures an additional KOTS (https://kots.io/) appliance to configure and manage the dbt Cloud appliance. KOTS is open-source, Apache 2 licensed software developed by Replicated.

An overview of Replicated's security posture can be found at: https://www.replicated.com/resources/files/Replicated-Security-Whitepaper.pdf

#### Initial Installation

During initial installation, the KOTS appliance can be directly downloaded from the Internet or packaged up and delivered to your infrastructure. Access to the following resources is required:

##### Accessed via HTTPS

- `get.replicated.com`: This endpoint hosts the Replicated install script.
- `registry.replicated.com`: The private Replicated Docker registry.
- `registry-data.replicated.com`: The private Replicated Docker registry.
- `quay.io`: Some dependencies of Replicated are hosted as public images in the Quay.io registry.
- `hub.docker.com`: Some dependencies of Replicated are hosted as public images in Docker Hub.

Replicated maintains a list of Replicated-owned IPs for IP access restriction purposes at https://github.com/replicatedhq/ips/blob/master/ip_addresses.json.

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

Replicated maintains a list of Replicated-owned IPs for IP access restriction purposes at https://github.com/replicatedhq/ips/blob/master/ip_addresses.json.

#### Ongoing Access

In order to perform basic maintenance and license checking, the following outbound access is required:

##### Accessed via HTTPS

- `api.replicated.com`: This endpoint services the license sync check and is used to pull down yaml files for app upgrades.

### Optional External Dependencies

#### Integrations

_Can be individually enabled or disabled_

dbt Cloud supports integrations with a number of third-party applications. If enabled, these applications will require some further network access.

- **Github, Github Enterprise, Github Enterprise Server**: if the Github integration is enabled, and you wish to make use of PR builds, you will need to grant Github the ability to send webhooks to your dbt Cloud instance.
- **Slack**: if enabled, you can send notifications on completed dbt Cloud runs to your Slack organization.
- **Email over SMTP**: if enabled, your dbt Cloud instance will be able to send email to your users.

### Inbound (Client) Traffic

dbt Cloud requires some ports to be opened for inbound traffic from admins and end users. All inbound traffic is secured using TLS / HTTPS. Upon installation, the Replicated appliance will generate a self-signed cert, and then prompt the admin configuring the installation to provide an SSL certificate to be used for securing inbound client requests to the application.

The required inbound ports are:

- 443 (tcp): For end user access to the dbt Cloud application.
- 8800 (tcp): For admin access to the dbt Cloud admin console.

### Application Data Flows

The dbt Cloud application is comprised of a set of static components, as well as a set of dynamic components. The static components are constantly running to serve highly available dbt Cloud functionality, for example, the dbt Cloud web application. The dynamic components are created just-in-time to fill background jobs or a user request to use the IDE. These components are enumerated below.

<img src="/img/docs/dbt-cloud/on-premises/data-flows.png" />

#### Static Application Components

- **api gateway**: The api gateway is the entrypoint for all client requests to dbt Cloud. The api gateway serves static content, and contains logic for routing requests within the dbt Cloud application.
- **app**: The app is the dbt Cloud application server. It consists of a Django application capable of serving dbt Cloud REST API requests.
- **scheduler**: The scheduler is a continuously running process that orchestrates background jobs in dbt Cloud. It consists of two components: the scheduler container which provisions dynamic resources just-in-time, and the background cleanup container which performs maintenance tasks on the dbt Cloud database, including flushing logs from dbt runs out into the object store.

#### Dynamic Application Components

- **dbt run**: A "run" in dbt Cloud represents a series of background invocations of dbt that are triggered either on a cron scheduler, manually by a user, or via dbt Cloud's API.
- **dbt develop**: This is a server capable of serving dbt IDE requests for a single user. dbt Cloud will create one of these for each user that is actively using the dbt IDE.

#### Application Critical Components

In addition to the application components, there are a few critical dependencies of the application components that are required in order for the dbt Cloud application to function.

- **PostgreSQL database**: dbt Cloud uses a PostgreSQL database as its backend. This can be a cloud-hosted database, for example, AWS RDS, Azure Database, Google Cloud SQL (recommended for production deployments); or, it can be embedded into the dbt Cloud Kubernetes appliance (not recommended for production deployments).
- **Object Storage**: dbt Cloud requires an S3-compatible Object Storage system for persisting run logs and artifacts.
- **Storage Volumes**: dbt Cloud requires a Kubernetes storage provider capable of creating dynamic persistent volumes that can be mounted to multiple containers in R/W mode.

### Data Warehouse Interaction

dbt Cloud's primary role is as a data processor, not a data store. The dbt Cloud application enables users to dispatch SQL to the warehouse for transformation purposes. However, it is possible for users to dispatch SQL that returns customer data into the dbt Cloud application. This data is never persisted and will only exist in memory on the instance in question. In order to properly lock down customer data, it is critical that proper data warehouse permissioning is applied to prevent improper access or storage of sensitive data.
