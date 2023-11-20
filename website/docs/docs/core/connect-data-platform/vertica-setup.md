---
title: "Vertica setup"
id: "vertica-setup"
meta:
  maintained_by: 'Vertica'
  authors: 'Vertica (Former authors: Matthew Carter, Andy Regan, Andrew Hedengren)'
  github_repo: 'vertica/dbt-vertica'
  pypi_package: 'dbt-vertica'
  min_core_version: 'v1.6.0 and newer'
  cloud_support: 'Not Supported'
  min_supported_version: 'Vertica 23.4.0'
  slack_channel_name: 'n/a'
  slack_channel_link: 'https://www.getdbt.com/community/'
  platform_name: 'Vertica'
  config_page: '/reference/resource-configs/vertica-configs'
---

:::info VENDOR-SUPPORTED PLUGIN

If you're interested in contributing, check out the source code for each repository listed below.

:::

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta}/>


<h3> Connecting to {frontMatter.meta.platform_name}   with {frontMatter.meta.pypi_package} </h3>

#### Username / password authentication

Configure your dbt profile for using Vertica:

##### Vertica connection information

<File name='profiles.yml'>

```yaml
your-profile:
  outputs:
    dev:
      type: vertica # Don't change this!
      host: [hostname]
      port: [port] # or your custom port (optional)
      username: [your username]
      password: [your password]
      database: [database name]
      schema: [dbt schema]
      connection_load_balance: True
      backup_server_node: [list of backup hostnames or IPs]
      retries: [1 or more]  
      threads: [1 or more]
  target: dev
```

</File>


##### Description of Profile Fields:




| Property                         | Description                                                                                                  | Required?                                                                                                        |Default Value |Example                          |
|--------------------------------|--------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------|----------------------------|----------------------------------|
|type                         | The specific adapter to use.                                                                        | Yes    | None          | vertica
| host                           | The host name or IP address of any active node in the Vertica Server.                                                                         |Yes                                                 | None                     | 127.0.0.1
| port                       | The port to use, default or custom.                                                                      | Yes                                                                      | 5433       |5433
| username                         | The username to use to connect to the server.                                                              | Yes                                                           | None            | dbadmin|
password   |The password to use for authenticating to the server. |Yes|None|my_password|
database |The name of the database running on the server. |Yes | None | my_db |
schema|	The schema to build models into.|	No|	None	|VMart|
connection_load_balance|	A Boolean value that indicates whether the connection can be redirected to a host in the database other than host.|	No|	True	|True|
backup_server_node|	List of hosts to connect to if the primary host specified in the connection (host, port) is unreachable. Each item in the list should be either a host string (using default port 5433) or a (host, port) tuple. A host can be a host name or an IP address.|	No|	None	|['123.123.123.123','www.abc.com',('123.123.123.124',5433)]|
retries	|The retry times after an unsuccessful connection.|	No|	2	|3|
threads	|The number of threads the dbt project will run on.|	No|	1|	3|
label|	A session label to identify the connection.	|No	|An auto-generated label with format of: dbt_username	|dbt_dbadmin|


For more information on Vertica’s connection properties please refer to [Vertica-Python](https://github.com/vertica/vertica-python#create-a-connection) Connection Properties.


