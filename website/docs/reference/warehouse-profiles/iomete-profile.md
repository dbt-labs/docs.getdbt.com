---
title: "iomete Profile"
---

## Overview of dbt-iomete

**Maintained by:** iomete
**Author:** Namig Aliyev
**Source:** [Github](https://github.com/iomete/dbt-iomete)
**Documentation** [iomete](https://docs.iomete.com/docs/profile-setup)
**dbt Cloud:** Currently un-supported
**dbt Slack channel** [Link to channel](https://getdbt.slack.com/archives/C03JFG22EP9)


![dbt-iomete stars](https://img.shields.io/github/stars/iomete/dbt-iomete?style=for-the-badge)

## Installation and Distribution

The easiest way to install dbt-iomete is to use `pip`:


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
      host: dwh-<account_number>.iomete.com
      port: 443
      schema: database_name
      user: iomete_user_name
      password: iomete_user_password
```

</File>

##### Description of Profile Fields

| Field    | Description                                                                                                                             | Required | Example                |
|----------|-----------------------------------------------------------------------------------------------------------------------------------------|----------|------------------------|
| type     | The specific adapter to use                                                                                                             | Required | `iomete`               |
| cluster  | The cluster to connect                                                                                                                  | Required | `reporting`            |
| host     | The host name of the connection. It is a combination of <br/>`account_number` with the prefix `dwh-` <br/>and the suffix `.iomete.com`. | Required | `dwh-12345.iomete.com` |
| port     | The port to use.                                                                                                                        | Required | `443`                  |
| schema   | Specify the schema (database) to build models into.                                                                                     | Required | `dbt_finance`          |
| username | The iomete username to use to connect to the server.                                                                                    | Required | `dbt_user`             |
| password | The iomete user password to use to connect to the server.                                                                               | Required | `strong_password`      |

## Supported Functionality

Most dbt Core functionality is supported. 

Iceberg specific improvements.
1. Joining the results of `show tables` and `show views`.