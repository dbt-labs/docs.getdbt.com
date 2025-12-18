---
title: "Configuring GCP Private Service Connect to your self-hosted service"
id: gcp-self-hosted-psc
description: "Setting up a GCP Private Service Connect connection between dbt and your self-hosted service."
sidebar_label: "GCP Private Service Connect for Self-Hosted Service"
---

# Configuring GCP Private Service Connect for a self-hosted service <Lifecycle status="managed_plus" />



import SetUpPages from '/snippets/_available-tiers-private-connection.md';

<SetUpPages features={'/snippets/_available-tiers-private-connection.md'}/>

GCP Private Service Connect (PSC) enables secure, private connectivity between <Constant name="cloud" /> and your self-hosted services. These services may include version control systems (VCS), data warehouses, or any other applications you manage. With PSC, you do not need to expose your service to the public internet. All communication occurs over a private network, significantly enhancing security. For more details, refer to the GCP [Private Service Connect documentation](https://cloud.google.com/private-service-connect).

## What this guide covers
The focus of this guide is not on any particular service or [Backend](#terminology) architecture, but on the [Service Attachment](#terminology) that interconnects <Constant name="cloud" /> with your self-hosted service. This attachment process should be standard across most use cases.

<Lightbox src="/img/docs/dbt-cloud/gcp-self-hosted-psc/scope-of-guide.png" width="90%" title="The scope of this guide" />

## Audience
This guide is intended for cloud network administrators or engineers responsible for configuring and maintaining secure network communications within your organization's Google Cloud Platform (GCP) environment.

## Terminology
This guide uses several important terms related to Private Service Connect. Understanding these definitions will help ensure successful implementation. For a more detailed explanation of these concepts, refer to the [GCP Private Service Connect documentation](https://docs.cloud.google.com/vpc/docs/private-service-connect#managed-services).

- **Consumer:** In this context, the Consumer is <Constant name="cloud" />, which establishes the PSC connection as the client.
- **Published Service:** The service you are exposing via PSC to dbt Cloud, such as your version control system (VCS), data warehouse, or another application.
- **Service Attachment:** Refers to the resource that is shared with consumer(s) of your Published Service, so that they can establish endpoints to it.
- **Backend:** Can also be referred to as Network Endpoint Groups (NEGs). This is the particular architecture that your service is running on. For example, this may be VMs, GKE Instance Groups, or even on-prem IPs.

## Prerequisites
Before you begin, make sure to review the following requirements:

1. **Supported Load Balancer Types**

    dbt has officially validated Private Service Connect (PSC) functionality with the following load balancer types:
    - Regional Internal Proxy Load Balancer
    - Cross-Regional Internal Proxy Load Balancer

    > While other load balancer types can be compatible with PSC Service Attachments, this guide assumes your service is configured behind one of the officially supported Proxy Load Balancers.
    > For more details, see the [Proxy Load Balancers documentation](https://docs.cloud.google.com/load-balancing/docs/tcp/internal-proxy).

2. **Service Health**

    - Confirm that your service or application is operational and healthy behind the designated load balancer before proceeding.

3. **dbt GCP Project ID**

    - Contact [dbt Support](/community/resources/getting-help#dbt-cloud-support) to obtain the dbt GCP project ID. You will need this in order to share your service attachment with dbt Cloud.


## Instructions
1. Log in to the Google Cloud Platform [console](https://console.cloud.google.com)
2. Navigate to the GCP Organization and Project that your self-hosted service is in.

### Create a dedicated Service Attachment subnet
3. In the search field at the top-middle of the console, search for **VPC networks** and navigate to its product page.
4. On the product page, click the VPC network link where your self-hosted service is located.
5. Select the **Subnets** tab on the next page, and click the **Add subnet** button.
6. In the subnet creation panel:

    a. **Name:** Provide a descriptive name, such as **service-attachment-subnet**

    b. **Description:** This subnet is dedicated to service attachment(s)

    c. **Region:** Pick the region of your self-hosted service

    d. **Purpose:** Choose **Private Service Connect**

    e. Click **Add** to create the subnet

<Lightbox src="/img/docs/dbt-cloud/gcp-self-hosted-psc/service-attach-subnet-creation.png" width="90%" title="Screenshot of step 6: Subnet creation for PSC Service Attachment" />

### Create a Service Attachment
7. After the subnet creation for the service attachment has completed, in the search field at the top-middle of the console, search for **Private Service Connect**, and click on its product page.
8. On the product page, select the **Published services** tab, and click the **Publish service** button.
9. In the Publish service page:

    **Under Target details**

    a. Choose **Load Balancer**

    b. The load balancer types that <Constant name="cloud" /> has validated are the **Regional Internal Proxy Load Balancer** and the **Cross-Regional Internal Proxy Load Balancer**. However, the others may work as well, although not officially supported.

    c. In the **Load balancer** dropdown, choose the load balancer that is in front of your self-hosted service.

    d. Choose the relevant **Forwarding rule** from the dropdown for your load balancer.

    **Under Service details**

    e. Give a descriptive **Service Name**, such as **service-to-my-vcs**

    f. In the **Subnets** dropdown, choose the subnet that you created in step 6 above.

    **Under Connection Preference**

    g. Leave the selection on **Accept connections from selected projects**

    h. Click the **Add accepted project** button and add dbt's GCP project ID that you acquired from support. Note: This project ID may differ for each configuration.

        - Set connection limit to 1

    i. Click **Add service**

<Lightbox src="/img/docs/dbt-cloud/gcp-self-hosted-psc/service-attach-creation.png" width="90%" title="Screenshot of step 9: Creation of PSC Service Attachment" />

10. After the Published Service attachment has been created, click on it to open its details page.
11. Copy the **Service attachment** URI (_not_ the Service attachment ID).

<Lightbox src="/img/docs/dbt-cloud/gcp-self-hosted-psc/service-attach-details.png" width="90%" title="Screenshot of step 11: Copy the Service attachment URI" />

### Providing dbt Support with connection details

12. Add the required information to the template below, and submit your request to [dbt Support](/community/resources/getting-help#dbt-cloud-support):

```
Subject: New GCP Self-hosted Private Service Connect Request
- Type: Self-hosted PSC
- Service Attachment URI:
- Custom DNS (if HTTPS/TLS)
    - DNS record:
- Service Region: (for example, us-east1, us-central1)
```