---
title: "Extrica Setup"
description: "Read this guide to learn about the Extrica Trino Query Engine setup in dbt."
id: "extrica-setup"
meta:
  maintained_by: Extrica, Trianz 
  authors: Gaurav Mittal, Viney Kumar, Mohammed Feroz, and Mrinal Mayank
  github_repo: 'extricatrianz/dbt-extrica'
  pypi_package: 'dbt-extrica'
  min_core_version: 'v1.7.2'
  cloud_support: 'Not Supported'
  min_supported_version: 'n/a'
  platform_name: 'Extrica'
  config_page: '/reference/resource-configs/extrica-configs'
---
<h2> Overview of {frontMatter.meta.pypi_package} </h2>

<ul>
    <li><strong>Maintained by</strong>: {frontMatter.meta.maintained_by}</li>
    <li><strong>Authors</strong>: {frontMatter.meta.authors}</li>
    <li><strong>GitHub repo</strong>: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a></li>
    <li><strong>PyPI package</strong>: <code>{frontMatter.meta.pypi_package}</code> <a href={`https://badge.fury.io/py/${frontMatter.meta.pypi_package}`}><img src={`https://badge.fury.io/py/${frontMatter.meta.pypi_package}.svg`}/></a></li>
    <li><strong>Supported dbt Core version</strong>: {frontMatter.meta.min_core_version} and newer</li>
    <li><strong>dbt Cloud support</strong>: {frontMatter.meta.cloud_support}</li>
    <li><strong>Minimum data platform version</strong>: {frontMatter.meta.min_supported_version}</li>
    </ul>
<h2> Installing {frontMatter.meta.pypi_package} </h2>

Use `pip` to install the adapter, which automatically installs `dbt-core` and any additional dependencies. Use the following command for installation:

<code>python -m pip install {frontMatter.meta.pypi_package}</code>

<h2> Configuring {frontMatter.meta.pypi_package} </h2>

<p>For {frontMatter.meta.platform_name}-specifc configuration please refer to <a href={frontMatter.meta.config_page}>{frontMatter.meta.platform_name} Configuration</a> </p>


<h2> Connecting to {frontMatter.meta.platform_name} </h2>

#### Example profiles.yml 
Here is a  example of a dbt-extrica profile parameters. At a minimum, you need to specify `type`, `method`, `username`, `password` `host`, `port`, `schema`, `catalog` and `threads`.
<File name='~/.dbt/profiles.yml'>

```yaml
<profile-name>:
  outputs:
    dev:
      type: extrica
      method: jwt 
      username: [username for jwt auth]
      password: [password for jwt auth]  
      host: [extrica hostname]
      port: [port number]
      schema: [dev_schema]
      catalog: [catalog_name]
      threads: [1 or more]

    prod:
      type: extrica
      method: jwt 
      username: [username for jwt auth]
      password: [password for jwt auth]  
      host: [extrica hostname]
      port: [port number]
      schema: [dev_schema]
      catalog: [catalog_name]
      threads: [1 or more]
  target: dev

```
</File>

#### Description of Extrica Profile Fields

| Parameter  | Type     | Description                              |
|------------|----------|------------------------------------------|
| type       | string  | Specifies the type of dbt adapter (Extrica). |
| method     | jwt      | Authentication method for JWT authentication. |
| username   | string   | Username for JWT authentication. The obtained JWT token is used to initialize a trino.auth.JWTAuthentication object.      |
| password   | string   | Password for JWT authentication. The obtained JWT token is used to initialize a trino.auth.JWTAuthentication object.      |
| host       | string   | The host parameter specifies the hostname or IP address of the Extrica's Trino server.           |
| port       | integer  | The port parameter specifies the port number on which the Extrica's Trino server is listening.        |
| schema     | string   | Schema or database name for the connection. |
| catalog    | string   | Name of the catalog representing the data source. |
| threads    | integer  | Number of threads for parallel execution of queries. (1 or more |

<p>For further info, refer to the GitHub repository: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a></p>
