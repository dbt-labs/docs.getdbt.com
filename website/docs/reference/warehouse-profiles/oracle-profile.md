---
title: "Oracle Profile"
---

:::info Community plugin

Some core functionality may be limited. If you're interested in contributing, check out the source code for each repository listed below.

:::

## Overview of dbt-oracle
**Maintained by:** Community      
**Author:** Vitor Avancini    
**Source:** https://github.com/techindicium/dbt-oracle    
**Core version:** v0.16.0 and newer     

![dbt-oracle stars](https://img.shields.io/github/stars/techindicium/dbt-oracle?style=for-the-badge)

Easiest install is to use pip:

    pip install dbt-oracle

You will need Oracle client driver installed. Check this [link](https://cx-oracle.readthedocs.io/en/latest/user_guide/installation.html) for the installation guide for your operating system

### Connecting to Oracle with **dbt-oracle** 

#### User / password authentication

Configure your dbt profile for using Oracle Authentication:

##### Oracle Authentication
<File name='profiles.yml'>

```yaml
dbt_oracle:
   target: dev
   outputs:
      dev:
         type: oracle
         host: localhost
         user: system
         pass: oracle
         port: 1521
         dbname: [dbname]
         schema: [schema]
         threads: 4
```
</File>