---
title: "Postgres"
id: "profile-postgres"
---

## Profile Configuration

Postgres targets should be set up using the following configuration in your `profiles.yml` file.

<File name='~/.dbt/profiles.yml'>

```yaml
company-name:
  target: dev
  outputs:
    dev:
      type: postgres
      host: [hostname]
      user: [username]
      pass: [password]
      port: [port]
      dbname: [database name]
      schema: [dbt schema]
      threads: [1 or more]
      keepalives_idle: 0 # default 0, indicating the system default
      search_path: [optional, override the default postgres search_path]

```

</File>

### Postgres notes

While Postgres works reasonably well for datasets smaller than about 10mm rows, database tuning is sometimes required. Make sure to create indexes for columns that are commonly used in joins or where clauses.