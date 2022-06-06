---
title: "MindsDB configurations"
id: "mindsdb-configs"
---

## Authentication

To succesfully connect dbt to MinsDB you will need to provide the following configuration from the MindsDB instance.

| Key   | Required| Description | Self-hosted | MindsDB Cloud |
|---------|-------------------------|---------------------------|-------------------------|--------------------------|
| type     |    ✔️   | The specific adapter to use                          | `mindsdb`                      | `mindsdb` |
| host     |    ✔️   | The MindsDB (hostname) to connect to                 | Default to `172.0.0.1`         | Default to `cloud.mindsdb.com`|
| port     |    ✔️   | The port to use                                      | Default to  `47335`             | Default to `3306`|
| schema   |    ✔️   | Specify the schema (database) to build models into   | The MindsDB [integration name](https://docs.mindsdb.com/sql/create/databases/)|The MindsDB [integration name](https://docs.mindsdb.com/sql/create/databases/)
| username |    ✔️   | The username to use to connect to the server         | Default to `mindsdb` | Your mindsdb cloud username|
| password |    ✔️   | The password to use for authenticating to the server | No password by default| Your mindsdb cloud password|
