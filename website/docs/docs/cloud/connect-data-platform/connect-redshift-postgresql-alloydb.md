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

### Connecting via an SSH Tunnel

To connect to a Postgres, Redshift, or AlloyDB instance via an SSH tunnel, select the **Use SSH Tunnel** option when creating your connection. When configuring the tunnel, you must supply the hostname, username, and port for the [bastion server](#about-the-bastion-server-in-aws).

Once the connection is saved, a public key will be generated and displayed for the Connection. You can copy this public key to the bastion server to authorize dbt Cloud to connect to your database via the bastion server.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/postgres-redshift-ssh-tunnel.png" width="70%" title="A generated public key for a Redshift connection"/>

#### About the Bastion server in AWS

<details>
  <summary>What is a Bastion server?</summary>
  <div>
    <div>A bastion server in <a href="https://aws.amazon.com/blogs/security/how-to-record-ssh-sessions-established-through-a-bastion-host/">Amazon Web Services (AWS)</a> is a host that allows dbt Cloud to open an SSH connection. <br></br>
    
dbt Cloud only sends queries and doesn't transmit large data volumes. This means the bastion server can run on an AWS instance of any size, like a t2.small instance or t2.micro.<br></br><br></br>
    
Make sure the location of the instance is the same Virtual Private Cloud (VPC) as the Redshift instance, and configure the security group for the bastion server to ensure that it's able to connect to the warehouse port.
    </div>
  </div>
</details>


### Configuring the Bastion Server in AWS

To configure the SSH tunnel in dbt Cloud, you'll need to provide the hostname/IP of your bastion server, username, and port, of your choosing, that dbt Cloud will connect to. Review the following steps:

- Verify the bastion server has its network security rules set up to accept connections from the [dbt Cloud IP addresses](/docs/cloud/about-cloud/regions-ip-addresses) on whatever port you configured.
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

#### Intermittent connection issues

<details>
  <summary>Database Error - could not connect to server: Connection timed out</summary>
  You will have the following components when you configure a connection to a database using an SSH tunnel: <br />
  - An Elastic Load Balancer (ELB) or Network Load Balancing (NLB) instance.<br />
  - A bastion host (or jump server) running the <code>sshd</code> process.<br />
  - A Database (such as Redshift cluster)<br /><br />

dbt Cloud establishes an SSH tunnel connection through the ELB or NLB to the <code>sshd</code> process. This is responsible for routing traffic to the database. When dbt initiates a job run, an SSH tunnel is created at the start of the run. If this SSH tunnel fails at any point, the job will also fail.<br />
  
  The most common causes of tunnel failures are:<br />
  - The SSH daemon terminates the session due to an idle timeout.<br />
  - The ELB or NLB terminates the connection when it's idle.<br />
  
dbt Cloud sets a value for its SSH tunnel called `ServerAliveInterval` and `ServerAliveCountMax` that polls the connection every 30 seconds and the underlying OS in our run "pods" will terminate the connection if the `sshd` process fails to respond after 300s. This will, in many cases, prevent an idle timeout entirely so long as the customer is not using ELB with a firewall-level idle timeout of less than 30 seconds. However, if the customer is using ELB and is using an Idle Connection Timeout of less than 30s, this will be insufficient to prevent tunnels from being terminated. <br />
  
Some versions of Linux used on bastion hosts use a version of `sshd` with additional idle timeout settings `ClientAliveCountMax`. This value sets the number of client alive messages that may be sent without `sshd` receiving any messages back from the client. If this threshold is reached while client alive messages are being sent, `sshd` will disconnect the client, terminating the session. The client-alive mechanism is helpful when the client or server needs to know when a connection has become inactive. The default value is 3.<br /><br />

`ClientAliveInterval`:<br />
This value sets a timeout interval in seconds after which if no data has been received from the client, `sshd` will send a message through the encrypted channel to request a response from the client. The default is 0, indicating that these messages will not be sent to the client.<br />

Using default values, tunnels could be terminated prematurely by `sshd`. To solve this problem, the `/etc/ssh/sshd_config` file on the bastion host can be configured with the following values:<br /><br />
- `ClientAliveCountMax` 10<br />
- `ClientAliveInterval` 30<br />
where `ClientAliveCountMax` should be set to a non-zero value and `ClientAliveInterval` should be a value less than the ELB or NLB idle timeout value.<br />

With these settings, unresponsive SSH clients will be disconnected after approximately 300 seconds, helping to prevent tunnel failures.
</details>


## Configuration

To learn how to optimize performance with data platform-specific configurations in dbt Cloud, refer to [Redshift-specific configuration](/reference/resource-configs/redshift-configs).

To grant users or roles database permissions (access rights and privileges), refer to the [Redshift permissions](/reference/database-permissions/redshift-permissions) page or [Postgres permissions](/reference/database-permissions/postgres-permissions) page.
