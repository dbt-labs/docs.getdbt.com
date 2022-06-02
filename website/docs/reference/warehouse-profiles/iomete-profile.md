---
title: "Apache iomete Profile"
---

## Overview of dbt-iomete

**Maintained by:** iomete
**Author:** Namig Aliyev
**Source:** [Github](https://github.com/iomete/dbt-iomete)
**dbt Cloud:** Currently un-supported
**dbt Slack channel** [Link to channel]()


![dbt-iomete stars](https://img.shields.io/github/stars/iomete/dbt-iomete?style=for-the-badge)

## Installation and Distribution

The easiest way to install dbt-databricks is to use `pip`:


```zsh
pip install dbt-iomete
```

Alternatively, you can install the package from GitHub with:

```zsh
pip install git+https://github.com/iomete/dbt-iomete.git
```

Set up a iomete Target

iomete targets should be set up using the following configuration in your profiles.yml file.

<File name='profiles.yml'>

```yaml
iomete:
  target: dev
  outputs:
    dev:
      type: iomete
      cluster: cluster_name
      host: dwh-<account>.iomete.com
      port: 443
      schema: database_name
      user: iomete_user_name
      password: iomete_user_password
      threads: 1
      connect_retries: 5
      connect_timeout: 60
```

</File>

##### Description of Profile Fields

| Field    | Description                                                                                                                           | Required | Example                |
|----------|---------------------------------------------------------------------------------------------------------------------------------------|----------|------------------------|
| type     | The specific adapter to use                                                                                                           | Required | `iomete`               |
| cluster  | The cluster to connect                                                                                                                | Required | `reporting`            |
| host     | The host name of the connection. It is a combination of <br/>account_number with the prefix `dwh-` <br/>and the suffix `.iomete.com`. | Required | `dwh-12345.iomete.com` |
| port     | The port to use.                                                                                                                      | Required | `443`                  |
| schema   | Specify the schema (database) to build models into.                                                                                   | Required | `dbt_finance`          |
| username | The iomete username to use to connect to the server.                                                                                  | Required | `dbt_user`             |
| password | The iomete user password to use to connect to the server.                                                                             | Required | `strong_password`      |
| threads  | The number of threads available to dbt.                                                                                               | Required | `1`                    |