---
title: "init"
id: "init"
---

`dbt init [project_name]` performs several actions necessary to create a new dbt project:

- creates a `~/.dbt/profiles.yml` file if one does not already exist
- creates a new folder called `[project_name]`
- generates directories and sample files necessary to get started with dbt

### Adapter-specific profile
<Changelog>New in v0.18.0</Changelog>

You may optionally specify an `--adapter`. If you do, dbt will create `~/.dbt/profiles.yml` 
(if one does not already exist) in accordance with the intended adapter type.

```bash
dbt init [project_name] --adapter bigquery
```

<File name='~/.dbt/profiles.yml'>

```yml
default:
  outputs:

    dev:
      type: bigquery
      method: oauth
      project: [GCP project id]
      dataset: [the name of your dbt dataset] # You can also use "schema" here
      threads: [1 or more]
      timeout_seconds: 300
      location: US # Optional, one of US or EU
      priority: interactive
      retries: 1

    prod:
      type: bigquery
      method: service-account
      project: [GCP project id]
      dataset: [the name of your dbt dataset]
      threads: [1 or more]
      keyfile: [/path/to/bigquery/keyfile.json]
      timeout_seconds: 300
      priority: interactive
      retries: 1

  target: dev
```

</File>