import Lifecycle from '/src/components/lifeCycle';

## AWS private connectivity matrix

The following charts outline private connectivity options for AWS deployments of <Constant name="cloud" /> ([multi-tenant and single-tenant](/docs/cloud/about-cloud/tenancy)).

**Legend:**
- ✅ = Available
- ❌ = Not currently available

Availability indicates whether a private endpoint can be established at the network layer. If you have questions about a specific use case, [contact dbt Support](/community/resources/getting-help#dbt-cloud-support).

### Connecting to dbt single-tenant

Your services can connect to <Constant name="cloud" /> over private connectivity using the <Term id="dbt-provisioned">dbt-provisioned</Term> model.

| Connectivity type | AWS ST |
|-------------------|--------|
| Private <Constant name="cloud" /> access | ✅ |
| Dual access (public + private) | ✅ |


### Connecting to data platforms and native services

| Service | MT | ST |
|---------|-----|-----|
| Snowflake | ✅ | ✅ |
| &nbsp;&nbsp;Snowflake Internal Stage | ✅ | ✅ |
| Databricks | ✅ | ✅ |
| Redshift | ✅ | ✅ |
| Redshift Serverless | ✅ | ✅ |
| Amazon Athena w/ AWS Glue* | ❌ | ✅ |
| AWS CodeCommit* | ❌ | ✅ |
| Teradata VantageCloud | ✅ | ✅ |

*<Term id="shared-endpoint">Shared endpoint</Term> (all others are <Term id="dedicated-endpoint">dedicated</Term>)

### Connecting to self-hosted services

All self-hosted connections use the <Term id="customer-provisioned">customer-provisioned</Term> model.

| Service | MT | ST |
|---------|-----|-----|
| GitHub Enterprise Server | ✅ | ✅ |
| GitLab Self-Managed | ✅ | ✅ |
| Bitbucket Data Center | ✅ | ✅ |
| Azure DevOps Server | ✅ <sup>1</sup> | ✅ <sup>1</sup>|
| Postgres | ✅ | ✅ |
| Spark | ✅ | ✅ |
| Starburst / Trino | ✅ | ✅ |
| Teradata (self-hosted) | ✅ | ✅ |

<sup>1</sup> Reported working but not yet validated by dbt Labs

**Requirements for self-hosted services:**
- Network Load Balancer
- VPC Endpoint Service

For detailed setup instructions, see [AWS PrivateLink for self-hosted services](/docs/cloud/secure/private-connectivity/aws/aws-self-hosted).
