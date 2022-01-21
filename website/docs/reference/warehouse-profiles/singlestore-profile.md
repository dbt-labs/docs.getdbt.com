---
title: "SingleStore Profile"
---

:::info Vendor-supported plugin

Certain core functionality may vary. If you would like to report a bug, request a feature, or contribute, you can check out the linked repository and open an issue.

:::

## Overview of dbt-singlestore

**Maintained by:** SingleStore, Inc.  
**Source:** [Github](https://github.com/memsql/dbt-singlestore)  
**Core version:** v1.0.0 and newer  
**dbt Cloud:** Not Supported  
**SingleStore version:** v7.5 and newer  


## Installation and Distribution

SingleStore dbt adapter is managed in its own repository, [dbt-singlestore](https://github.com/memsql/dbt-singlestore). You can use `pip` to install the SingleStore adapter:

```
pip install dbt-singlestore
```

Alternatively, you can clone the repository contents to a folder, and run `pip install .` from it. For other information including support of dbt features by SingleStore, see the [GitHub README](https://github.com/memsql/dbt-singlestore#readme).


## Set up a SingleStore Target

SingleStore targets should be set up using the following configuration in your `profiles.yml` file.

<File name='~/.dbt/profiles.yml'>

```yaml
singlestore:
  target: dev
  outputs:
    dev:
      type: singlestore
      host: [hostname]
      port: [port number]
      user: [user]
      password: [password]
      schema: [schema/database name]
      threads: [1 or more]  
```

</File>

## Notes

When you run `dbt docs serve`, you would see `null` under "Database" -> "Tables and Views". This happens because "database" and "schema" denote the same object in SingleStore, so dbt's `database` is set to be always `NULL`. You need to click on `null` to see the actual SingleStore database(s) which has been specified as the `schema` in your project.
