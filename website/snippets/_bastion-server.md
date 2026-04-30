Use an SSH tunnel when your {props.redshift}{props.postgresalloydb} instance is not publicly accessible and must be reached through a [bastion server](/docs/platform/connect-data-platform/connect-redshift#about-the-bastion-server-in-aws). When enabled, <Constant name="dbt_platform" /> connects to your database by first establishing a secure connection to the bastion host, which then forwards traffic to your database.

To configure a connection using an SSH tunnel:

1. Navigate to **Account settings** (by clicking on your account name in the left side menu) and select **Connections**.
2. Select an existing connection to edit it, or click **+ New connection**.
3. In **Connection settings**, ensure **SSH Tunnel Enabled** is checked.
4. Enter the hostname, username, and port for the bastion server.

<Lightbox
  src="/img/docs/dbt-platform/platform-configuring-dbt-platform/postgres-redshift-ssh-tunnel.png"
  width="70%"
  title="A public key is generated after saving"
/>

5. Click **Save**. <Constant name="dbt_platform" /> generates and displays a public key.
6. Copy the newly generated public key to the bastion server and add it to the server’s `authorized_keys` file to authorize <Constant name="dbt_platform" /> to connect through the bastion host. If the new key is not added, the SSH tunnel connection will fail.


    :::important
    Each time you create and save a new SSH tunnel connection, <Constant name="dbt_platform" /> generates a unique SSH key pair, even when the connection details are identical to an existing connection. 
    :::

#### About the Bastion server in AWS

<details>
  <summary>What is a bastion server?</summary>
  <div>
    <div>
      A bastion server in <a href="https://aws.amazon.com/blogs/security/how-to-record-ssh-sessions-established-through-a-bastion-host/">Amazon Web Services (AWS)</a> is a host that allows <Constant name="dbt" /> to open an SSH connection. 
      
      <br></br>
    
      <Constant name="dbt" /> only sends queries and doesn't transmit large data volumes. This means the bastion server can run on an AWS instance of any size, like a t2.small instance or t2.micro.<br></br><br></br>
    
      Make sure the location of the instance is the same Virtual Private Cloud (VPC) as the {props.redshift}{props.postgres} instance, and configure the security group for the bastion server to ensure that it's able to connect to the warehouse port.
    </div>
  </div>
</details>


#### Configuring the Bastion Server in AWS

To configure the SSH tunnel in <Constant name="dbt" />, you'll need to provide the hostname/IP of your bastion server, username, and port, of your choosing, that <Constant name="dbt" /> will connect to. Review the following steps:

1. Verify the bastion server has its network security rules set up to accept connections from the [<Constant name="dbt" /> IP addresses](/docs/platform/about-platform/access-regions-ip-addresses) on whatever port you configured.
2. Set up the user account by using the bastion servers instance's CLI, The following example uses the username `dbtcloud`:
    
    ```shell
    sudo groupadd dbtcloud
    sudo useradd -m -g dbtcloud dbtcloud
    sudo su - dbtcloud
    mkdir ~/.ssh
    chmod 700 ~/.ssh
    touch ~/.ssh/authorized_keys
    chmod 600 ~/.ssh/authorized_keys
    ```  

3. Copy and paste the <Constant name="dbt" /> generated public key, into the authorized_keys file.

The bastion server should now be ready for <Constant name="dbt" /> to use as a tunnel into the {props.redshift}{props.postgres} environment.