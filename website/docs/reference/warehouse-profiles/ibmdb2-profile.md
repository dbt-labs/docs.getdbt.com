---
title: "IBM DB2 Profile"
---

:::info Community plugin

Some core functionality may be limited. If you're interested in contributing, check out the source code for each repository listed below.

:::

## Overview of dbt-ibmdb2

**Maintained by:** Community  
**Author:** [Rasmus Nyberg](https://github.com/aurany)   
**Source:** [GitHub](https://github.com/aurany/dbt-ibmdb2)  
**Core version:** v1.0.4   
**dbt Cloud:** Not Supported     

![dbt-ibmdb2 stars](https://img.shields.io/github/stars/aurany/dbt-ibmdb2?style=for-the-badge)
![latest version on PyPI](https://img.shields.io/pypi/v/dbt-ibmdb2?style=for-the-badge)

The package can be installed from PyPI with:

```python
pip install dbt-ibmdb2
```

This is an experimental plugin:
- We have not tested it extensively
- Tested with [dbt-adapter-tests](https://pypi.org/project/pytest-dbt-adapter/) and DB2 LUW on Mac OS+RHEL8
- Compatibility with other [dbt packages](https://hub.getdbt.com/) (like [dbt_utils](https://hub.getdbt.com/fishtown-analytics/dbt_utils/latest/)) is only partially tested

## Connecting to IBM DB2 with dbt-ibmdb2

IBM DB2 targets should be set up using the following configuration in your `profiles.yml` file.

Example:

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: ibmdb2
      schema: analytics
      database: test
      host: localhost
      port: 50000
      protocol: TCPIP
      username: my_username
      password: my_password
```

</File>

#### Description of IBM DB2 Profile Fields

| Option          | Description                                                                         | Required?                                                          | Example                                        |
| --------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------- |
| type            | The specific adapter to use                                                         | Required                                                           | `ibmdb2`                                       |
| schema          | Specify the schema (database) to build models into                                  | Required                                                           | `analytics`                                    |
| database        | Specify the database you want to connect to                                         | Required                                                           | `testdb`                                         |
| host            | Hostname or IP-adress                                                               | Required                                                           | `localhost`                                    |
| port            | The port to use                                                                     | Optional                                                           | `50000`                                        |
| protocol        | Protocol to use                                                                     | Optional                                                           | `TCPIP`                                        |
| username        | The username to use to connect to the server                                        | Required                                                           | `my-username`                                  |
| password        | The password to use for authenticating to the server                                | Required                                                           | `my-password`                                  |


## Supported features

| DB2 LUW | DB2 z/OS | Feature |
|:---------:|:---:|---------------------|
| ✅ | 🤷 | Table materialization       |
| ✅ | 🤷 | View materialization        |
| ✅ | 🤷 | Incremental materialization |
| ✅ | 🤷 | Ephemeral materialization   |
| ✅ | 🤷 | Seeds                       |
| ✅ | 🤷 | Sources                     |
| ✅ | 🤷 | Custom data tests           |
| ✅ | 🤷 | Docs generate               |
| ✅ | 🤷 | Snapshots                   |

## Notes 
- dbt-ibmdb2 is built on the ibm_db python package and there are some known encoding issues related to z/OS.
