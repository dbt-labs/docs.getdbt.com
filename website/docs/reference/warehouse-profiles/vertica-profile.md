---
title: "Vertica Profile"
---

:::info Community plugin

Some core functionality may be limited. If you're interested in contributing, check out the source code for each repository listed below.

:::

## Overview of dbt-vertica
**Maintained by:** Community    
**Authors:** Matthew Carter, Andy Regan, Andrew Hedengren
**Source:** https://github.com/mpcarter/dbt-vertica
**Core version:** v0.21.0 and newer    
**dbt Cloud:** Not Supported    

![dbt-vertica stars](https://img.shields.io/github/stars/mpcarter/dbt-vertica)

Easiest install is to use pip:

    pip install dbt-vertica

You don't need to install dbt separately. Installing `dbt-vertica` will also install `dbt-core` and `vertica-python`.

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
  target: dev
```

</File>

By default, `dbt-vertica` will request `ConnectionLoadBalance=true` (which is generally a good thing), and set a session label of `dbt_your-username`.

There are three options for SSL: `ssl`, `ssl_env_cafile`, and `ssl_uri`.
See their use in the code [here](https://github.com/mpcarter/dbt-vertica/blob/d15f925049dabd2833b4d88304edd216e3f654ed/dbt/adapters/vertica/connections.py#L72-L87).
