---
id: airgapped-deployment
title: Airgapped (Beta)
---

:::info Airgapped

This section provides a high level summary of the airgapped deployment type for dbt Cloud. This deployment type is currently in Beta and may not be supported in the long term.
If you’re interested in learning more about airgapped deployments for dbt Cloud, contact us at sales@getdbt.com.

:::

The airgapped deployment is similar to an on-premise installation in that the dbt Cloud instance will live in your network, and is subject to your security procedures, technologies, and controls. An airgapped install allows you to run dbt Cloud without any external network dependencies and is ideal for organizations that have strict rules around installing software from the cloud.

The installation process for airgapped is a bit different. Instead of downloading and installing images during installation time, you will download all of the necessary configuration and Docker images before starting the installation process, and manage uploading these images yourself. This means that you can remove all external network dependencies and run this application in a very secure environment.

For more information about the dbt Cloud Airgapped deployment see the below.

- [Customer Managed Network Architecture](/docs/cloud/about-cloud/architecture)
