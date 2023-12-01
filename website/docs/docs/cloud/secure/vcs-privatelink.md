---
title: "Configuring PrivateLink for self-hosted cloud version control systems (VCS)"
id: vcs-privatelink
description: "Setting up a PrivateLink connection between dbt Cloud and an organization’s cloud hosted git server"
sidebar_label: "PrivateLink for VCS"
---

import SetUpPages from '/snippets/_available-tiers-privatelink.md';

<SetUpPages features={'/snippets/_available-tiers-privatelink.md'}/>

AWS PrivateLink provides private connectivity from dbt Cloud to your self-hosted cloud version control system (VCS) service by routing requests through your virtual private cloud (VPC). This type of connection does not require you to publicly expose an endpoint to your VCS repositories or for requests to the service to traverse the public internet, ensuring the most secure connection possible. AWS recommends PrivateLink connectivity as part of its [Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html) and details this particular pattern in the **Shared Services** section of the [AWS PrivateLink whitepaper](https://docs.aws.amazon.com/pdfs/whitepapers/latest/aws-privatelink/aws-privatelink.pdf).

You will learn, at a high level, the resources necessary to implement this solution. Cloud environments and provisioning processes vary greatly, so information from this guide may need to be adapted to fit your requirements.

## PrivateLink connection overview

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/privatelink-vcs-architecture.png" width="80%" title="High level overview of the dbt Cloud and AWS PrivateLink for VCS architecture" />

### Required resources for creating a connection

Creating an Interface VPC PrivateLink connection requires creating multiple AWS resources in your AWS account(s) and private network containing the self-hosted VCS instance. You are responsible for provisioning and maintaining these resources. Once provisioned, connection information and permissions are shared with dbt Labs to complete the connection, allowing for direct VPC to VPC private connectivity. 

This approach is distinct from and does not require you to implement VPC peering between your AWS account(s) and dbt Cloud.

You need these resource to create a PrivateLink connection, which allows the dbt Cloud application to connect to your self-hosted cloud VCS. These resources can be created via the AWS Console, AWS CLI, or Infrastructure-as-Code such as [Terraform](https://registry.terraform.io/providers/hashicorp/aws/latest/docs) or [AWS CloudFormation](https://aws.amazon.com/cloudformation/).

- **Target Group(s)** - A [Target Group](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-target-groups.html) is attached to a [Listener](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-listeners.html) on the NLB and is responsible for routing incoming requests to healthy targets in the group. If connecting to the VCS system over both SSH and HTTPS, two **Target Groups** will need to be created.
    - **Target Type (choose most applicable):**
        - **Instance/ASG:** Select existing EC2 instance(s) where the VCS system is running, or [an autoscaling group](https://docs.aws.amazon.com/autoscaling/ec2/userguide/attach-load-balancer-asg.html) (ASG) to automatically attach any instances launched from that ASG.
        - **Application Load Balancer (ALB):** Select an ALB that already has VCS EC2 instances attached (HTTP/S traffic only).
        - **IP Addresses:** Select the IP address(es) of the EC2 instances where the VCS system is installed. Keep in mind that the IP of the EC2 instance can change if the instance is relaunched for any reason.
    - **Protocol/Port:** Choose one protocol and port pair per Target Group, for example:
        - TG1 - SSH: TCP/22
        - TG2 - HTTPS: TCP/443 or TLS if you want to attach a certificate to decrypt TLS connections ([details](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/create-tls-listener.html)).
    - **VPC:** Choose the VPC in which the VPC Endpoint Service and NLB will be created.
    - **Health checks:** Targets must register as healthy in order for the NLB to forward requests. Configure a health check that’s appropriate for your service and the protocol of the Target Group ([details](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/target-group-health-checks.html)).
    - **Register targets:** Register the targets (see above) for the VCS service ([details](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-register-targets.html)). _It's critical to be sure targets are healthy before attempting connection from dbt Cloud._
- **Network Load Balancer (NLB)** - Requires creating a Listener that attaches to the newly created Target Group(s) for port `443` and/or `22`, as applicable.
    - **Scheme:** Internal
    - **IP address type:** IPv4
    - **Network mapping:** Choose the VPC that the VPC Endpoint Service and NLB are being deployed in, and choose subnets from at least two Availability Zones.
    - **Listeners:** Create one Listener per Target Group that maps the appropriate incoming port to the corresponding Target Group ([details](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-listeners.html)).
- **Endpoint Service** - The VPC Endpoint Service is what allows for the VPC to VPC connection, routing incoming requests to the configured load balancer.
    - **Load balancer type:** Network.
    - **Load balancer:** Attach the NLB created in the previous step.
    - **Acceptance required (recommended)**:  When enabled, requires a new connection request to the VPC Endpoint Service to be accepted by the customer before connectivity is allowed ([details](https://docs.aws.amazon.com/vpc/latest/privatelink/configure-endpoint-service.html#accept-reject-connection-requests)).

    Once these resources have been provisioned, access needs to be granted for the dbt Labs AWS account to create a VPC Endpoint in our VPC. On the newly created VPC Endpoint Service, add a new [Allowed Principal](https://docs.aws.amazon.com/vpc/latest/privatelink/configure-endpoint-service.html#add-remove-permissions) for the appropriate dbt Labs principal: 

   -  **AWS Account ID:**	`arn:aws:iam::<account id>:root` (contact your dbt Labs account representative for appropriate account ID).

### Completing the connection

To complete the connection, dbt Labs must now provision a VPC Endpoint to connect to your VPC Endpoint Service. This requires you send the following information:
 
 - VPC Endpoint Service name:

 <Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/vpc-endpoint-service-name.png" width="80%" title="Location of the VPC Endpoint Service name in the AWS console" />

 - **DNS configuration:** If the connection to the VCS service requires a custom domain and/or URL for TLS, a private hosted zone can be configured by the dbt Labs Infrastructure team in the dbt Cloud private network. For example:
    - **Private hosted zone:** `examplecorp.com`
    - **DNS record:** `github.examplecorp.com`

### Accepting the connection request

When you have been notified that the resources are provisioned within the dbt Cloud environment, you must accept the endpoint connection (unless the VPC Endpoint Service is set to auto-accept connection requests). Requests can be accepted through the AWS console, as seen below, or through the AWS CLI.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/accept-request.png" width="80%" title="Accept the connection request" />

Once you accept the endpoint connection request, you can use the PrivateLink endpoint in dbt Cloud.

## Configure in dbt Cloud

Once dbt confirms that the PrivateLink integration is complete, you can use it in a new or existing git configuration. 
1. Select **PrivateLink Endpoint** as the connection type, and your configured integrations will appear in the dropdown menu. 
2. Select the configured endpoint from the drop down list.
3. Click **Save**.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/vcs-setup-new.png" width="80%" title="Configuring a new git integration" />

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/vcs-setup-existing.png" width="80%" title="Editing an existing git integration" />