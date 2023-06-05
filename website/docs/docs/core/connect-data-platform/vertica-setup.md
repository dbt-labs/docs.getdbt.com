---
title: "Vertica setup"
id: "vertica-setup"
meta:
  maintained_by: 'Vertica'
  authors: 'Vertica (Former authors: Matthew Carter, Andy Regan, Andrew Hedengren)'
  github_repo: 'vertica/dbt-vertica'
  pypi_package: 'dbt-vertica'
  min_core_version: 'v1.4.0 and newer'
  cloud_support: 'Not Supported'
  min_supported_version: 'Vertica 12.0.0'
  slack_channel_name: 'n/a'
  slack_channel_link: 'https://www.getdbt.com/community/'
  platform_name: 'Vertica'
  config_page: '/reference/resource-configs/vertica-configs'
---

:::info VENDOR-SUPPORTED PLUGIN

If you're interested in contributing, check out the source code for each repository listed below.

:::

<h2> Overview of {frontMatter.meta.pypi_package} </h2>

<ul>
    <li><strong>Maintained by</strong>: {frontMatter.meta.maintained_by}</li>
    <li><strong>Authors</strong>: {frontMatter.meta.authors}</li>
    <li><strong>GitHub repo</strong>: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a><a href={`https://github.com/${frontMatter.meta.github_repo}`}><img src={`https://img.shields.io/github/stars/${frontMatter.meta.github_repo}?style=for-the-badge`}/></a></li>
    <li><strong>PyPI package</strong>: <code>{frontMatter.meta.pypi_package}</code> <a href={`https://badge.fury.io/py/${frontMatter.meta.pypi_package}`}><img src={`https://badge.fury.io/py/${frontMatter.meta.pypi_package}.svg`}/></a></li>
    <li><strong>Slack channel</strong>: <a href={frontMatter.meta.slack_channel_link}>{frontMatter.meta.slack_channel_name}</a></li>
    <li><strong>Supported dbt Core version</strong>: {frontMatter.meta.min_core_version} and newer</li>
    <li><strong>dbt Cloud support</strong>: {frontMatter.meta.cloud_support}</li>
    <li><strong>Minimum data platform version</strong>: {frontMatter.meta.min_supported_version}</li>
    </ul>


<h2> Installing {frontMatter.meta.pypi_package} </h2>

pip is the easiest way to install the adapter: <code>pip install {frontMatter.meta.pypi_package} </code>

<p>Installing <code>{frontMatter.meta.pypi_package}</code> will also install <code>dbt-core</code> and any other dependencies.</p>

<h2> Configuring {frontMatter.meta.pypi_package} </h2>

<p>For {frontMatter.meta.pypi_package} specific configuration please refer to <a href={frontMatter.meta.config_page}>{frontMatter.meta.platform_name} Configuration.</a> </p>

<p>For further info, refer to the GitHub repository: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}.</a></p>


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


