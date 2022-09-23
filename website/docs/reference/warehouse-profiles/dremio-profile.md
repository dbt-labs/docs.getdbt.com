---
title: "Dremio Profile"
---

:::info Community plugin

Some core functionality may be limited. If you're interested in contributing, check out the source code for each repository listed below.

:::

## Overview of dbt-dremio
**Maintained by:** Community      
**Author:** Fabrice Etanchaud (Maif-vie)    
**Source:** https://github.com/fabrice-etanchaud/dbt-dremio    
**Core version:** v0.18.0 and newer    
**dbt Cloud:** Not Supported    
**Supported Version:** Dremio 4.7+

![dbt-dremio stars](https://img.shields.io/github/stars/fabrice-etanchaud/dbt-dremio?style=for-the-badge)

The easiest way to install it is to use pip:

    pip install dbt-dremio

Follow the repository's link for os dependencies.

## Connecting to Dremio with **dbt-dremio**

### Connecting with ZooKeeper

I have no means to test [connection with ZooKeeper](https://docs.dremio.com/drivers/dremio-connector.html#connecting-to-zookeeper). 
If you do need this, contact me and I will provide you with a branch you can test.

### Direct connection to a coordinator

```yaml
my_profile:
  outputs:
    my_target:
      type: dremio
      threads: 2
# please replace driver below with the one you gave to your dremio odbc driver installation      
      driver: Dremio ODBC Driver 64-bit
      host: [coordinator host]
      port: 31010
      schema: [schema]
      user: [user]
      password: [password]
  target: my_target
