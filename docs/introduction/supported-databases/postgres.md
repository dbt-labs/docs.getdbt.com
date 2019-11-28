---
title: Postgres
sidebar_label: Postgres
---
# Postgres

## Set up a Postgres target

Postgres targets should be set up using the following configuration in your `profiles.yml` file.
[block:code]
{
  "codes": [
    {
      "code": "company-name:\n  target: dev\n  outputs:\n    dev:\n      type: postgres\n      host: [hostname]\n      user: [username]\n      pass: [password]\n      port: [port]\n      dbname: [database name]\n      schema: [dbt schema]\n      threads: [1 or more]\n      keepalives_idle: 0 # default 0, indicating the system default\n      search_path: [optional, override the default postgres search_path]\n",
      "language": "yaml",
      "name": "~/.dbt/profiles.yml"
    }
  ]
}
[/block]
### Postgres notes

While Postgres works reasonably well for datasets smaller than about 10mm rows, database tuning is sometimes required. Make sure to create indexes for columns that are commonly used in joins or where clauses.
