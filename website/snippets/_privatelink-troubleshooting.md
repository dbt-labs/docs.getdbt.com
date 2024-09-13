## Troubleshooting

If the PrivateLink endpoint has been provisioned and configured in dbt Cloud, but connectivity is still failing, check the following in your networking setup to ensure requests and responses can be successfully routed between dbt Cloud and the backing service.

### Configuration

Start with the configuration:

<Expandable alt_header="1. NLB Security Group">

The Network Load Balancer (NLB) associated with the VPC Endpoint Service must either not have an associated Security Group or the Security Group must have a rule that allows requests from the appropriate dbt Cloud _private CIDR(s)_. Note that this differs from the static public IPs listed on the dbt Cloud Connection page. dbt Support can provide the correct private CIDR(s) upon request.
   - **Note***: To test if this is the issue, temporarily adding an allow rule of `10.0.0.0/8` should allow connectivity until the rule can be refined to a smaller CIDR

</Expandable>

<Expandable alt_header="2. NLB Listener and Target Group">

Check that there is a Listener connected to the NLB that matches the port that dbt Cloud is trying to connect to. This Listener must have a configured action to forward to a Target Group with targets that point to your backing service. At least one (but preferably all) of these targets must be **Healthy**. Unhealthy targets could suggest that the backing service is, in fact, unhealthy or that the service is protected by a Security Group that doesn't allow requests from the NLB.

</Expandable>

<Expandable alt_header="3. Cross-zone Load Balancing">

Check that _Cross-zone load balancing_ is enabled for your NLB (check the **Attributes** tab of the NLB in the AWS console). If this is disabled, and the zones that dbt Cloud is connected to are misaligned with the zones where the service is running, requests may not be able to be routed correctly. Enabling cross-zone load balancing will also make the connection more resilient in the case of a failover in a zone outage scenario. Cross-zone connectivity may incur additional data transfer charges, though this should be minimal for requests from dbt Cloud.

</Expandable>

<Expandable alt_header="4. Routing tables and ACLs">

If all the above check out, it may be possible that requests are not routing correctly within the private network. This could be due to a misconfiguration in the VPCs routing tables or access control lists. Review these settings with your network administrator to ensure that requests can be routed from the VPC Endpoint Service to the backing service and that the response can be returned to the VPC Endpoint Service. One way to test this is to create a VPC endpoint in another VPC in your network to test that connectivity is working independent of dbt's connection.

</Expandable>

### Monitoring

To help isolate connection issues over a PrivateLink connection from dbt Cloud, there are a few monitoring sources that can be used to verify request activity. Requests must first be sent to the endpoint to see anything in the monitoring. Contact dbt Support to understand when connection testing occurred or request new connection attempts. Use these times to correlate with activity in the following monitoring sources.

<Expandable alt_header="VPC Endpoint Service Monitoring">

In the AWS Console, navigate to VPC -> Endpoint Services. Select the Endpoint Service being tested and click the **Monitoring** tab. Update the time selection to include when test connection attempts were sent. If there is activity in the _New connections_ and _Bytes processed_ graphs, then requests have been received by the Endpoint Service, suggesting that the dbt endpoint is routing properly.

</Expandable>

<Expandable alt_header="NLB Monitoring">

In the AWS Console, navigate to EC2 -> Load Balancers. Select the Network Load Balancer (NLB) being tested and click the **Monitoring** tab. Update the time selection to include when test connection attempts were sent. If there is activity in the _New flow count_ and _Processed bytes_ graphs, then requests have been received by the NLB from the Endpoint Service, suggesting the NLB Listener, Target Group, and Security Group are correctly configured.

</Expandable>

<Expandable alt_header="VPC Flow Logs">

VPC Flow Logs can provide various helpful information for requests being routed through your VPCs, though they can sometimes be challenging to locate and interpret. Flow logs can be written to either S3 or CloudWatch Logs, so determine the availability of these logs for your VPC and query them accordingly. Flow logs record the Elastic Network Interface (ENI) ID, source and destination IP and port, and whether the request was accepted or rejected by the security group and/or network ACL. This can be useful in understanding if a request arrived at a certain network interface and whether that request was accepted, potentially illuminating overly restrictive rules. For more information on accessing and interpreting VPC Flow Logs, see the related [AWS documentation](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html).

</Expandable>