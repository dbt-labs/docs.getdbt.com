---
title: "Connect Redshift, PostgreSQL, and AlloyDB"
id: connect-redshift-postgresql-alloydb
description: "Setup instructions for connecting Redshift, PostgreSQL, and AlloyDBnpm to dbt Cloud"
sidebar_label: "Connect Redshift, PostgreSQL, and AlloyDB"
---

The following fields are required when creating a Postgres, Redshift, or AlloyDB connection:

| Field | Description | Examples |
| ----- | ----------- | -------- |
| Host Name | The hostname of the Postgres, Redshift, or AlloyDB database to connect to. This can either be a hostname or an IP address. | `xxx.us-east-1.amazonaws.com` |
| Port | Usually 5432 (Postgres) or 5439 (Redshift) | `5439` |
| Database | The logical database to connect to and run queries against. | `analytics` |

**Note**: When you set up a Redshift or Postgres connection in dbt Cloud, SSL-related parameters aren't available as inputs. 

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/postgres-redshift-connection.png" width="70%" title="Configuring a Redshift connection"/>

For dbt Cloud users, please log in using the default Database username and password. Note this is because [`IAM` authentication](https://docs.aws.amazon.com/redshift/latest/mgmt/generating-user-credentials.html) is not compatible with dbt Cloud.

### Connecting via an SSH Tunnel

To connect to a Postgres, Redshift, or AlloyDB instance via an SSH tunnel, select the **Use SSH Tunnel** option when creating your connection. When configuring the tunnel, you must supply the hostname, username, and port for the [bastion server](#about-the-bastion-server-in-aws).

Once the connection is saved, a public key will be generated and displayed for the Connection. You can copy this public key to the bastion server to authorize dbt Cloud to connect to your database via the bastion server.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/postgres-redshift-ssh-tunnel.png" width="70%" title="A generated public key for a Redshift connection"/>

#### About the Bastion server in AWS

<details>
  <summary>What is a Bastion server?</summary>
  <div>
    <div>
      A bastion server in <a href="https://aws.amazon.com/blogs/security/how-to-record-ssh-sessions-established-through-a-bastion-host/">Amazon Web Services (AWS)</a> is a host that allows dbt Cloud to open an SSH connection. 
      
      <br></br>
    
      dbt Cloud only sends queries and doesn't transmit large data volumes. This means the bastion server can run on an AWS instance of any size, like a t2.small instance or t2.micro.<br></br><br></br>
    
      Make sure the location of the instance is the same Virtual Private Cloud (VPC) as the Redshift instance, and configure the security group for the bastion server to ensure that it's able to connect to the warehouse port.
    </div>
  </div>
</details>


### Configuring the Bastion Server in AWS

To configure the SSH tunnel in dbt Cloud, you'll need to provide the hostname/IP of your bastion server, username, and port, of your choosing, that dbt Cloud will connect to. Review the following steps:

- Verify the bastion server has its network security rules set up to accept connections from the [dbt Cloud IP addresses](/docs/cloud/about-cloud/access-regions-ip-addresses) on whatever port you configured.
- Set up the user account by using the bastion servers instance's CLI, The following example uses the username `dbtcloud:`
    
```shell
sudo groupadd dbtcloud
sudo useradd -m -g dbtcloud dbtcloud
sudo su - dbtcloud
mkdir ~/.ssh
chmod 700 ~/.ssh
touch ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```  

- Copy and paste the dbt Cloud generated public key, into the authorized_keys file.

The Bastion server should now be ready for dbt Cloud to use as a tunnel into the Redshift environment.


## Configuration

To optimize performance with data platform-specific configurations in dbt Cloud, refer to [Redshift-specific configuration](/reference/resource-configs/redshift-configs).

To grant users or roles database permissions (access rights and privileges), refer to the [Redshift permissions](/reference/database-permissions/redshift-permissions) page or [Postgres permissions](/reference/database-permissions/postgres-permissions) page.

## FAQs

<detailsToggle alt_header="Database Error - could not connect to server: Connection timed out">
When setting up a database connection using an SSH tunnel, you need the following components:

- A load balancer (like ELB or NLB) to manage traffic.
- A bastion host (or jump server) that runs the SSH protocol, acting as a secure entry point.
- The database itself (such as a Redshift cluster).

dbt Cloud uses an SSH tunnel to connect through the load balancer to the database. This connection is established at the start of any dbt job run. If the tunnel connection drops, the job fails.

Tunnel failures usually happen because:

- The SSH daemon times out if it's idle for too long.
- The load balancer cuts off the connection if it's idle.
- dbt Cloud tries to keep the connection alive by checking in every 30 seconds, and the system will end the connection if there's no response from the SSH service after 300 seconds. This helps avoid drops due to inactivity unless the Load Balancer's timeout is less than 30 seconds.

Bastion hosts might have additional SSH settings to disconnect inactive clients after several checks without a response. By default, it checks three times.

To prevent premature disconnections, you can adjust the settings on the bastion host:

- `ClientAliveCountMax ` &mdash; Configures the number of checks before deciding the client is inactive. For example, `ClientAliveCountMax 10` checks 10 times.
- `ClientAliveInterval` &mdash; Configures when to check for client activity. For example, `ClientAliveInterval 30` checks every 30 seconds.
The example adjustments ensure that inactive SSH clients are disconnected after about 300 seconds, reducing the chance of tunnel failures.

</detailsToggle>
