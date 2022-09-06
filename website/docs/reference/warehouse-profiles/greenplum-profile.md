---
title: "Greenplum Profile"
---

## Overview of dbt-greenplum

**Maintained by:** Community       
**Author:** Mark Poroshin, Dmitry Bevz       
**Source:** [Github](https://github.com/markporoshin/dbt-greenplum)        
**dbt Cloud:** Not Supported 

The package can be installed from PyPI with:

```bash
$ pip install dbt-greenplum
```
For further (and more likely up-to-date) info, see the [README](https://github.com/markporoshin/dbt-greenplum#README.md)


## Profile Configuration

Greenplum targets should be set up using the following configuration in your `profiles.yml` file.

<File name='~/.dbt/profiles.yml'>

```yaml
company-name:
  target: dev
  outputs:
    dev:
      type: greenplum
      host: [hostname]
      user: [username]
      password: [password]
      port: [port]
      dbname: [database name]
      schema: [dbt schema]
      threads: [1 or more]
      keepalives_idle: 0 # default 0, indicating the system default. See below
      connect_timeout: 10 # default 10 seconds
      search_path: [optional, override the default postgres search_path]
      role: [optional, set the role dbt assumes when executing queries]
      sslmode: [optional, set the sslmode used to connect to the database]

```

</File>

### Notes

This adapter strongly depends on dbt-postgres, so you can read more about configurations here [Profile Setup](postgres-profile)