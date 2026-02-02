---
title: "Connect PostgreSQL, Lakebase and AlloyDB"
id: connect-postgresql-alloydb
description: "Setup instructions for connecting PostgreSQL, Lakebase, and AlloyDB to dbt"
sidebar_label: "Connect PostgreSQL, Lakebase, and AlloyDB"
---
 
dbt platform supports connecting to PostgresSQL and Postgres-compatible databases (AlloyDB, Lakebase). 

The following fields are required when creating a connection:

| Field | Description | Examples |
| ----- | ----------- | -------- |
| Host Name | The hostname of the database to connect to. This can either be a hostname or an IP address. Refer to [set up pages](/docs/core/connect-data-platform/about-core-connections) to find the hostname for your adapter. | Postgres: `xxx.us-east-1.amazonaws.com` |
| Port | Usually 5432 | `5439` |
| Database | The logical database to connect to and run queries against. | `analytics` |

**Note**: When you set up a Postgres connection in <Constant name="cloud" />, SSL-related parameters aren't available as inputs. 


<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/postgres-redshift-connection.png" width="70%" title="Configuring a Postgres connection"/>

### Authentication Parameters

For authentication, <Constant name="cloud" /> users can use **Database username and password** for Postgres and Postgres-compatible databases. For more information on what is supported, check out the database specific setup page for limitations and helpful tips. 

The following table contains the parameters for the database (password-based) connection method.

| Field | Description | Examples |
| ------------- | ------- | ------------ |
| `user`   | Account username to log into your cluster | myuser |
| `password`  | Password for authentication  | _password1! |


### Connecting via an SSH Tunnel

import BastionServer from '/snippets/_bastion-server.md';

<BastionServer postgresalloydb='Postgres or AlloyDB' postgres='Postgres' />


## Configuration

To grant users or roles database permissions (access rights and privileges), refer to the [Postgres permissions](/reference/database-permissions/postgres-permissions) page.

## FAQs

<DetailsToggle alt_header="Database Error - could not connect to server: Connection timed out">
When setting up a database connection using an SSH tunnel, you need the following components:

- A load balancer (like ELB or NLB) to manage traffic.
- A bastion host (or jump server) that runs the SSH protocol, acting as a secure entry point.
- The database itself (such as a Postgres cluster).

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
