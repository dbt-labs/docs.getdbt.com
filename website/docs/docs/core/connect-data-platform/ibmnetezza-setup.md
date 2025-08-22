---
title: "IBM Netezza setup"
description: "Read this guide to learn about the IBM Netezza setup in dbt."
id: "ibmnetezza-setup"
meta:
  maintained_by: IBM
  authors: Abhishek Jog, Sagar Soni, Ayush Mehrotra
  github_repo: 'IBM/nz-dbt'
  pypi_package: 'dbt-ibm-netezza'
  min_core_version: v1.9.2
  cloud_support: 'Not Supported'
  min_supported_version: '11.2.3.4'
  slack_channel_name: 
  slack_channel_link: 
  platform_name: IBM Netezza
  config_page: /reference/resource-configs/ibm-netezza-config
---

The dbt-ibm-netezza adapter allows you to use dbt to transform and manage data on IBM Netezza, leveraging its distributed SQL query engine capabilities. Before proceeding, ensure you have the following:
<ul>
  <li>An active IBM Netezza engine with connection details (host, port, database, schema, etc) in SaaS/PaaS.</li>
  <li>Authentication credentials: Username and password.</li>
</ul>
Refer to [Configuring dbt-ibm-netezza](https://github.com/IBM/nz-dbt?tab=readme-ov-file#testing-sample-dbt-project) for guidance on obtaining and organizing these details.


import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta}/>


## Connecting to IBM Netezza

To connect dbt with IBM Netezza, you need to configure a profile in your `profiles.yml` file located in the `.dbt/` directory of your home folder. The following is an example configuration for connecting to IBM Netezza instances:

<File name='~/.dbt/profiles.yml'>

```yaml
my_project:
  outputs:
    dev:
      type: netezza
      user: [user]
      password: [password]
      host: [hostname]
      database: [catalog name]
      schema: [schema name]
      port: 5480
      threads: [1 or more]

  target: dev

```

</File>


### Setup external table options

You also need to configure the `et_options.yml` file located in your project directory. Make sure the file is correctly setup before running the `dbt seed`. This ensures that data is inserted into your tables accurately as specified in the external data file.

<File name='./et_options.yml'>

```yaml
- !ETOptions
    SkipRows: "1"
    Delimiter: "','"
    DateDelim: "'-'"
    MaxErrors: " 0 "
```

</File>

Refer the [Netezza external tables option summary](https://www.ibm.com/docs/en/netezza?topic=eto-option-summary) for more options in the file.


## Host parameters

The following profile fields are required to configure IBM Netezza connections.

| Option    | Required/Optional | Description | Example  |
| --------- | ------- | ------- | ----------- |
|   `user`  | Required | Username or email address for authentication. | `user` |
| `password`| Required | Password or API key for authentication | `password` |
|   `host`  | Required | Hostname for connecting to Netezza. | `127.0.0.1` |
| `database`| Required | The catalog name in your Netezza instance. | `SYSTEM` |
|  `schema` | Required | The schema name within your Netezza instance catalog. | `my_schema`  |
|   `port`  | Required | The port for connecting to Netezza.  | `5480`  |


### Schemas and databases
When selecting the database and the schema, make sure the user has read and write access to both. This selection does not limit your ability to query the database. Instead, they serve as the default location for where tables and views are materialized.

## Notes:

The `dbt-ibm-netezza` adapter is built on the IBM Netezza Python driver - [nzpy](https://pypi.org/project/nzpy/) and is a pre-requisite which gets installed along with the adapter.
