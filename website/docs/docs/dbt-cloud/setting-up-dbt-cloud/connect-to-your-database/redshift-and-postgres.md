---
title: "Connecting to Redshift and Postgres"
id: "connecting-to-redshift-and-postgres"
sidebar_label: "Redshift and Postgres"
---

## Connecting to Redshift and Postgres

The following fields are required when creating a Redshift connection:

| Field | Description | Examples |
| ----- | ----------- | -------- |
| Host Name | The hostname of the Postgres or Redshift database to connect to. This can either be a hostname an IP address. | `xxx.us-east-1.amazonaws.com` |
| Port | Usually 5432 (Postgres) or 5439 (Redshift) | `5439` |
| Database | The logical database to connect to and run queries against. | `analytics` |



<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/postgres-redshift-connection.png" title="Configuring a Redshift connection"/>

### Connecting via an SSH Tunnel

To connect to a Postgres or Redshift instance via an SSH tunnel, check the "Use SSH Tunnel" option when creating your connection. When configuring the tunnel, you'll need to supply the hostname, username, and port for the bastion server.

Once the connection is saved, a public key will be generated and displayed for the Connection. You can copy this public key to the bastion server to authorize dbt Cloud to connect to your database via the bastion server.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/postgres-redshift-ssh-tunnel.png" title="A generated public key for a Redshift connection"/>
