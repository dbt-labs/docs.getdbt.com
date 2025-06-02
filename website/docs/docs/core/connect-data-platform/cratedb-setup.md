---
title: "CrateDB setup"
description: "Read this guide to learn about the CrateDB data platform setup in dbt."
id: "cratedb-setup"
meta:
  maintained_by: Crate.io, Inc.
  authors: 'CrateDB maintainers'
  github_repo: 'crate/dbt-cratedb2'
  pypi_package: 'dbt-cratedb2'
  min_core_version: 'v1.0.0'
  cloud_support: Not Supported
  min_supported_version: 'n/a'
  slack_channel_name: 'Community Forum'
  slack_channel_link: 'https://community.cratedb.com/'
  platform_name: 'CrateDB'
  config_page: '/reference/resource-configs/no-configs'
---

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta}/>


[CrateDB] is compatible with PostgreSQL, so its dbt adapter strongly depends on
dbt-postgres, documented at [PostgreSQL profile setup].

CrateDB targets are configured exactly the same way, see also [PostgreSQL
configuration], with just a few things to consider which are special to
CrateDB. Relevant details are outlined at [using dbt with CrateDB],
which also includes up-to-date information.


## Profile configuration

CrateDB targets should be set up using a configuration like this minimal sample
of settings in your [`profiles.yml`] file.

<File name='~/.dbt/profiles.yml'>

```yaml
cratedb_analytics:
  target: dev
  outputs:
    dev:
      type: cratedb
      host: [clustername].aks1.westeurope.azure.cratedb.net
      port: 5432
      user: [username]
      pass: [password]
      dbname: crate         # Do not change this value. CrateDB's only catalog is `crate`.
      schema: doc           # Define the schema name. CrateDB's default schema is `doc`.
```

</File>



[CrateDB]: https://cratedb.com/database
[PostgreSQL configuration]: https://docs.getdbt.com/reference/resource-configs/postgres-configs
[PostgreSQL profile setup]: https://docs.getdbt.com/docs/core/connect-data-platform/postgres-setup
[`profiles.yml`]: https://docs.getdbt.com/docs/core/connect-data-platform/profiles.yml
[using dbt with CrateDB]: https://cratedb.com/docs/guide/integrate/dbt/
