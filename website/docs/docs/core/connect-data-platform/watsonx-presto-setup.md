---
title: "IBM watsonx.data Presto setup"
description: "Read this guide to learn about the IBM watsonx.data Presto setup in dbt."
id: "watsonx-presto-setup"
meta:
  maintained_by: IBM
  authors: Karnati Naga Vivek, Hariharan Ashokan, Biju Palliyath, Gopikrishnan Varadarajulu, Rohan Pednekar
  github_repo: 'IBM/dbt-watsonx-presto'
  pypi_package: 'dbt-watsonx-presto'
  min_core_version: v1.8.0
  cloud_support: 'Not Supported'
  min_supported_version: 'n/a'
  slack_channel_name: 
  slack_channel_link: 
  platform_name: IBM watsonx.data
  config_page: /reference/resource-configs/watsonx-presto-config
---

The dbt-watsonx-presto adapter allows you to use dbt to transform and manage data on IBM watsonx.data Presto(Java), leveraging its distributed SQL query engine capabilities. Before proceeding, ensure you have the following:
<ul>
  <li>An active IBM watsonx.data Presto(Java) engine with connection details (host, port, catalog, schema) in SaaS/Software.</li>
  <li>Authentication credentials: Username and password/apikey.</li>
  <li>For watsonx.data instances, SSL verification is required for secure connections. If the instance host uses HTTPS, there is no need to specify the SSL certificate parameter. However, if the instance host uses an unsecured HTTP connection, ensure you provide the path to the SSL certificate file.</li>
</ul>
Refer to [Configuring dbt-watsonx-presto](https://www.ibm.com/docs/en/watsonx/watsonxdata/2.1.x?topic=presto-configuration-setting-up-your-profile) for guidance on obtaining and organizing these details.


import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta}/>


## Connecting to IBM watsonx.data presto

To connect dbt with watsonx.data Presto(java), you need to configure a profile in your `profiles.yml` file located in the `.dbt/` directory of your home folder. The following is an example configuration for connecting to IBM watsonx.data SaaS and Software instances:

<File name='~/.dbt/profiles.yml'>

```yaml
my_project:
  outputs:
    software:
      type: presto
      method: BasicAuth
      user: [user]
      password: [password]
      host: [hostname]
      database: [catalog name]
      schema: [your dbt schema]
      port: [port number]
      threads: [1 or more]
      ssl_verify: path/to/certificate

    saas:
      type: presto
      method: BasicAuth
      user: [user]
      password: [api_key]
      host: [hostname]
      database: [catalog name]
      schema: [your dbt schema]
      port: [port number]
      threads: [1 or more]

  target: software

```

</File>

## Host parameters

The following profile fields are required to configure watsonx.data Presto(java) connections. For IBM watsonx.data SaaS or Software instances, you can get the `hostname` and `port` details by clicking **View connect details** on the Presto(java) engine details page.

| Option    | Required/Optional | Description | Example  |
| --------- | ------- | ------- | ----------- |
| `method`  | Required | Specifies the authentication method for secure connections. Use `BasicAuth` when connecting to IBM watsonx.data SaaS or Software instances. | `BasicAuth` |
|   `user`  | Required | Username or email address for authentication. | `user` |
| `password`| Required | Password or API key for authentication | `password` |
|   `host`  | Required | Hostname for connecting to Presto. | `127.0.0.1` |
| `database`| Required | The catalog name in your Presto instance. | `Analytics` |
|  `schema` | Required | The schema name within your Presto instance catalog. | `my_schema`  |
|   `port`  | Required | The port for connecting to Presto.  | `443`  |
| `ssl_verify` | Optional (default: **true**) | Specifies the path to the SSL certificate or a boolean value. The SSL certificate path is required if the watsonx.data instance is not secure (HTTP).| `path/to/certificate` or `true` |


### Schemas and databases
When selecting the catalog and the schema, make sure the user has read and write access to both. This selection does not limit your ability to query the catalog. Instead, they serve as the default location for where tables and views are materialized. In addition, the Presto connector used in the catalog must support creating tables. This default can be changed later from within your dbt project.

### SSL verification
- If the Presto instance uses an unsecured HTTP connection, you must set `ssl_verify` to the path of the SSL certificate file.
- If the instance uses `HTTPS`, this parameter is not required and can be omitted.

## Additional parameters

The following profile fields are optional to set up. They let you configure your instance session and dbt for your connection. 


| Profile field                 |  Description                                                                                                | Example                              |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| `threads`                     | How many threads dbt should use (default is `1`)                                                            | `8`                                  |
| `http_headers`                | HTTP headers to send alongside requests to Presto, specified as a yaml dictionary of (header, value) pairs. | `X-Presto-Routing-Group: my-instance` |
| `http_scheme`                 | The HTTP scheme to use for requests to    (default: `http`, or `https` if `BasicAuth`)                | `https` or `http`                    |
