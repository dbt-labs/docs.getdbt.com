To connect to a {props.redshift}{props.postgresalloydb} instance via an SSH tunnel, select the **Use SSH Tunnel** option when creating your connection. When configuring the tunnel, you must supply the hostname, username, and port for the [bastion server](#about-the-bastion-server-in-aws).

Once the connection is saved, a public key will be generated and displayed for the Connection. You can copy this public key to the bastion server to authorize <Constant name="cloud" /> to connect to your database via the bastion server.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/postgres-redshift-ssh-tunnel.png" width="70%" title="A public key is generated after saving"/>

#### About the Bastion server in AWS

<details>
  <summary>What is a bastion server?</summary>
  <div>
    <div>
      A bastion server in <a href="https://aws.amazon.com/blogs/security/how-to-record-ssh-sessions-established-through-a-bastion-host/">Amazon Web Services (AWS)</a> is a host that allows <Constant name="cloud" /> to open an SSH connection. 
      
      <br></br>
    
      <Constant name="cloud" /> only sends queries and doesn't transmit large data volumes. This means the bastion server can run on an AWS instance of any size, like a t2.small instance or t2.micro.<br></br><br></br>
    
      Make sure the location of the instance is the same Virtual Private Cloud (VPC) as the {props.redshift}{props.postgres} instance, and configure the security group for the bastion server to ensure that it's able to connect to the warehouse port.
    </div>
  </div>
</details>


#### Configuring the Bastion Server in AWS

To configure the SSH tunnel in <Constant name="cloud" />, you'll need to provide the hostname/IP of your bastion server, username, and port, of your choosing, that <Constant name="cloud" /> will connect to. Review the following steps:

1. Verify the bastion server has its network security rules set up to accept connections from the [<Constant name="cloud" /> IP addresses](/docs/cloud/about-cloud/access-regions-ip-addresses) on whatever port you configured.
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

3. Copy and paste the <Constant name="cloud" /> generated public key, into the authorized_keys file.

The bastion server should now be ready for <Constant name="cloud" /> to use as a tunnel into the {props.redshift}{props.postgres} environment.