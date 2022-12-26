---
title: "Vertica setup"
id: "vertica-setup"
meta:
  maintained_by: Community
  authors: Matthew Carter, Andy Regan, Andrew Hedengren
  github_repo: 'mpcarter/dbt-vertica'
  pypi_package: 'dbt-vertica'
  min_core_version: 'v0.21.0'
  cloud_support: Not Supported
  min_supported_version: 'Vertica 10.0'
  slack_channel_name: 'n/a'
  slack_channel_link: 'https://www.getdbt.com/community/'
  platform_name: 'Vertica'
  config_page: 'no-configs'

  config_page: 'vertica-configs'
---

:::info Community plugin

Some core functionality may be limited. If you're interested in contributing, check out the source code for each repository listed below.

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

pip is the easiest way to install the adapter:

<code>pip install {frontMatter.meta.pypi_package}</code>

<p>Installing <code>{frontMatter.meta.pypi_package}</code> will also install <code>dbt-core</code> and any other dependencies.</p>

<p>Installing <code>{frontMatter.meta.pypi_package}</code> will also install <code>dbt-core</code> , <code>dbt-tests-adapter</code> and any other dependencies.</p>
<h2> Configuring {frontMatter.meta.pypi_package} </h2>

<p>For {frontMatter.meta.platform_name}-specifc configuration please refer to <a href={frontMatter.meta.config_page}>{frontMatter.meta.platform_name} Configuration</a> </p>

<p>For dbt-vertica-specifc configuration please refer to <a href={frontMatter.meta.config_page}>{frontMatter.meta.platform_name} Configuration</a> </p>
<p>For further info, refer to the GitHub repository: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a></p>


### Connecting to Vertica with **dbt-vertica**

#### Username / password authentication

Configure your dbt profile for using Vertica:

##### Vertica connection information

<File name='profiles.yml'>
```yaml
your-profile:
  outputs:
    dev:
      type: vertica # Don't change this!
      host: vertica-host-name
      port: 5433 # or your custom port (optional)
      username: your-username
      password: your-password
      database: vertica-database-name
      schema: your-default-schema
      connection_load_balance: True
      backup_server_node: ['123.123.123.123','www.abc.com',('123.123.123.123',5433)]
  target: dev
```

</File>

By default, `dbt-vertica` will request `ConnectionLoadBalance=true` (which is generally a good thing), and set a session label of `dbt_your-username`.

Load Balancing– Connection Load Balancing helps automatically spread the overhead caused by client connections across the cluster by having hosts redirect client connections to other hosts. Both the server and the client need to enable load balancing for it to function. If the server disables connection load balancing, the load balancing request from client will be ignored. 

`connection_load_balance : True` this paramerter will enable the load balancing in vertica  and `connection_load_balance : False` will disable the  load balancing in vertica.

Backup Server Node– Supply a list of backup hosts to backup_server_node for the client to try if the primary host you specify in the connection parameters (host, port) is unreachable. Each item in the list should be either a host string (using default port 5433) or a (host, port) tuple. A host can be a host name or an IP address.
Format of  passing backup server node in profiles.yml is  below:

`backup_server_node: ['123.123.123.123','www.abc.com',('123.123.123.123',5433)]`

There are three options for SSL: `ssl`, `ssl_env_cafile`, and `ssl_uri`.
See their use in the code [here](https://github.com/mpcarter/dbt-vertica/blob/d15f925049dabd2833b4d88304edd216e3f654ed/dbt/adapters/vertica/connections.py#L72-L87).
See their use in the code [here](https://github.com/mpcarter/dbt-vertica/blob/d15f925049dabd2833b4d88304edd216e3f654ed/dbt/adapters/vertica/connections.py#L72-L87).