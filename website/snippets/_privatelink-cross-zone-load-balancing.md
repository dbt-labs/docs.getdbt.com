
:::note Cross-Zone Load Balancing
We highly recommend cross-zone load balancing for your NLB or Target Group; some connections may require it. Cross-zone load balancing may also [improve routing distribution and connection resiliency](https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/how-elastic-load-balancing-works.html#cross-zone-load-balancing). Note that cross-zone connectivity may incur additional data transfer charges, though this should be minimal for requests from dbt Cloud.

- [Enabling cross-zone load balancing for a load balancer or target group](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/edit-target-group-attributes.html#target-group-cross-zone)
:::
