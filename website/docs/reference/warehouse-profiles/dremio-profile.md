---
title: "Dremio Profile"
---


:::info Community contributed plugin

This is a Community Contributed plugin for dbt. If you're interested in contributing, check out the source code for the repository [dbt-dremio](https://github.com/fabrice-etanchaud/dbt-dremio)

:::

## Overview of dbt-dremio
**Status:** Community Contributed

**Author:** Fabrice Etanchaud (Maif-vie)

**Source Code:** https://github.com/fabrice-etanchaud/dbt-dremio

**dbt-dremio** supports dbt 0.18.0 or newer.

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
