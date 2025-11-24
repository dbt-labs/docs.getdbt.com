---
title: "Connect Redshift"
id: connect-redshift
description: "Setup instructions for connecting Redshift to dbt"
sidebar_label: "Connect Redshift"
---
 
dbt platform supports connecting to Redshift. 

The following fields are required when creating a connection:

| Field | Description | Examples |
| ----- | ----------- | -------- |
| Host Name | The hostname of the database to connect to. This can either be a hostname or an IP address. Refer to [set up pages](/docs/core/connect-data-platform/about-core-connections) to find the hostname for your adapter. | Redshift: `hostname.region.redshift.amazonaws.com` |
| Port | Usually 5439 (Redshift) | `5439` |
| Database | The logical database to connect to and run queries against. | `analytics` |

**Note**: When you set up a Redshift connection in <Constant name="cloud" />, SSL-related parameters aren't available as inputs. 


<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/postgres-redshift-connection.png" width="70%" title="Configuring a Redshift connection"/>

### Authentication Parameters

See the following supported authentication methods for Redshift:

- Username and password
- SSH tunneling
- Identity Center via [external Oauth](/docs/cloud/manage-access/redshift-external-oauth)
- IAM User authentication via [extended attributes](/docs/dbt-cloud-environments#extended-attributes)

On the <Constant name="dbt_platform" />, the IAM user authentication is currently only supported via [extended attributes](/docs/dbt-cloud-environments#extended-attributes). Once the project is created, development and deployment environments can be updated to use extended attributes to pass the fields described below, as some are not supported via textbox.

You will need to create an IAM User, generate an [access key](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey), and either:
- on a cluster, a database user is expected in the `user` field. The IAM user is only leveraged for authentication, the database user for authorization
- on Serverless, grant permission to the IAM user in Redshift. The `user` field is ignored (but still required)
- For both, the `password` field will be ignored.

| Profile field | Example | Description |
| ------------- | ------- | ------------ |
| `method` |IAM| use IAM to authenticate via IAM User authentication |
| `cluster_id` | CLUSTER_ID| Required for IAM authentication only for provisoned cluster, not for Serverless |
| `user`   | username | User querying the database, ignored for Serverless (but still required) |
| `region`  | us-east-1 | Region of your Redshift instance | 
| `access_key_id` | ACCESS_KEY_ID | IAM user [access key id](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey) |
| `secret_access_key` | SECRET_ACCESS_KEY | IAM user secret access key |

<br/>

#### Example Extended Attributes for IAM User on Redshift Serverless

To avoid pasting secrets in extended attributes, leverage [environment variables](/docs/build/environment-variables#handling-secrets):

<File name='~/.dbt/profiles.yml'>

```yaml
host: my-production-instance.myregion.redshift-serverless.amazonaws.com
method: iam
region: us-east-2
access_key_id: '{{ env_var(''DBT_ENV_ACCESS_KEY_ID'') }}'
secret_access_key: '{{ env_var(''DBT_ENV_SECRET_ACCESS_KEY'') }}'
```

</File>

Both `DBT_ENV_ACCESS_KEY_ID` and `DBT_ENV_SECRET_ACCESS_KEY` will need [to be assigned](/docs/build/environment-variables) for every environment leveraging extended attributes as such.

### Connecting via an SSH Tunnel

import BastionServer from '/snippets/_bastion-server.md';

<BastionServer redshift='Redshift' />


## Configuration

To optimize performance with data platform-specific configurations in <Constant name="cloud" />, refer to [Redshift-specific configuration](/reference/resource-configs/redshift-configs).

To grant users or roles database permissions (access rights and privileges), refer to the [Redshift permissions](/reference/database-permissions/redshift-permissions) page.

## FAQs

<DetailsToggle alt_header="Database Error - could not connect to server: Connection timed out">
When setting up a database connection using an SSH tunnel, you need the following components:

- A load balancer (like ELB or NLB) to manage traffic.
- A bastion host (or jump server) that runs the SSH protocol, acting as a secure entry point.
- The database itself (such as a Redshift cluster).

<Constant name="cloud" /> uses an SSH tunnel to connect through the load balancer to the database. This connection is established at the start of any dbt job run. If the tunnel connection drops, the job fails.

Tunnel failures usually happen because:

- The SSH daemon times out if it's idle for too long.
- The load balancer cuts off the connection if it's idle.
- <Constant name="cloud" /> tries to keep the connection alive by checking in every 30 seconds, and the system will end the connection if there's no response from the SSH service after 300 seconds. This helps avoid drops due to inactivity unless the Load Balancer's timeout is less than 30 seconds.

Bastion hosts might have additional SSH settings to disconnect inactive clients after several checks without a response. By default, it checks three times.

To prevent premature disconnections, you can adjust the settings on the bastion host:

- `ClientAliveCountMax ` &mdash; Configures the number of checks before deciding the client is inactive. For example, `ClientAliveCountMax 10` checks 10 times.
- `ClientAliveInterval` &mdash; Configures when to check for client activity. For example, `ClientAliveInterval 30` checks every 30 seconds.
The example adjustments ensure that inactive SSH clients are disconnected after about 300 seconds, reducing the chance of tunnel failures.

</DetailsToggle>
