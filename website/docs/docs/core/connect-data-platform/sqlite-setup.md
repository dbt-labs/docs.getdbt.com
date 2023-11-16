---
title: "SQLite setup"
description: "Read this guide to learn about the SQLite warehouse setup in dbt."
id: "sqlite-setup"
meta:
  maintained_by: Community
  authors: 'Jeff Chiu (https://github.com/codeforkjeff)'
  github_repo: 'codeforkjeff/dbt-sqlite'
  pypi_package: 'dbt-sqlite'
  min_core_version: 'v1.1.0'
  cloud_support: Not Supported
  min_supported_version: 'SQlite Version 3.0'
  slack_channel_name: 'n/a'
  slack_channel_link: 'https://www.getdbt.com/community'
  platform_name: 'SQLite'
  config_page: '/reference/resource-configs/no-configs'
---

:::info Community plugin

Some core functionality may be limited. If you're interested in contributing, check out the source code for each repository listed below.

:::

<h2> Overview of {frontMatter.meta.pypi_package} </h2>

<ul>
    <li><strong>Maintained by</strong>: {frontMatter.meta.maintained_by}</li>
    <li><strong>Authors</strong>: {frontMatter.meta.authors}</li>
    <li><strong>GitHub repo</strong>: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a><a href={`https://github.com/${frontMatter.meta.github_repo}`}><img src={`https://img.shields.io/github/stars/${frontMatter.meta.github_repo}?style=for-the-badge`}/></a></li>
    <li><strong>PyPI package</strong>: <code>{frontMatter.meta.pypi_package}</code> <a href={`https://badge.fury.io/py/${frontMatter.meta.pypi_package}`}><img src={`https://badge.fury.io/py/${frontMatter.meta.pypi_package}.svg`}/></a></li>
    <li><strong>Slack channel</strong>: <a href={frontMatter.meta.slack_channel_link}>{frontMatter.meta.slack_channel_name}</a></li>
    <li><strong>Supported dbt Core version</strong>: {frontMatter.meta.min_core_version} and newer</li>
    <li><strong>dbt Cloud support</strong>: {frontMatter.meta.cloud_support}</li>
    <li><strong>Minimum data platform version</strong>: {frontMatter.meta.min_supported_version}</li>
    </ul>


<h2> Installing {frontMatter.meta.pypi_package} </h2>

pip is the easiest way to install the adapter:

<code>python -m pip install {frontMatter.meta.pypi_package}</code>

<p>Installing <code>{frontMatter.meta.pypi_package}</code> will also install <code>dbt-core</code> and any other dependencies.</p>

<h2> Configuring {frontMatter.meta.pypi_package} </h2>

<p>For {frontMatter.meta.platform_name}-specifc configuration please refer to <a href={frontMatter.meta.config_page}>{frontMatter.meta.platform_name} Configuration</a> </p>

<p>For further info, refer to the GitHub repository: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a></p>


Starting with the release of dbt-core 1.0.0, versions of dbt-sqlite are aligned to the same major+minor [version](https://semver.org/) of dbt-core.
- versions 1.1.x of this adapter work with dbt-core 1.1.x
- versions 1.0.x of this adapter work with dbt-core 1.0.x
- versions 0.2.x of this adapter work with dbt 0.20.x and 0.21.x
- versions 0.1.x of this adapter work with dbt 0.19.x
- versions 0.0.x of this adapter work with dbt 0.18.x

## Connecting to SQLite with dbt-sqlite

SQLite targets should be set up using the following configuration in your `profiles.yml` file.

Example:

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: sqlite
      threads: 1
      database: 'database'
      schema: 'main'
      schemas_and_paths:
        main: 'file_path/database_name.db'
      schema_directory: 'file_path'
      #optional fields
      extensions:
        - "/path/to/sqlean/crypto.so"
```

</File>

#### Description of SQLite Profile Fields

| Field                    | Description |
|--------------------------|--------------------------------------------------------------------------------------------------------|
| `type`                   | Required. Must be set to `sqlite`. |
| `threads`                | Required. Must be set to `1`. SQLite locks the whole db on writes so anything > 1 won't help. |
| `database`               | Required but the value is arbitrary because there is no 'database' portion of relation names in SQLite so it gets stripped from the output of ref() and from SQL everywhere. It still needs to be set in the configuration and is used by dbt internally.|
| `schema`                 | Value of 'schema' must be defined in schema_paths below. in most cases, this should be main. |
| `schemas_and_paths`      | Connect schemas to paths: at least one of these must be 'main' |
| `schema_directory`	     | Directory where all *.db files are attached as schema, using base filename as schema name, and where new schemas are created. This can overlap with the dirs of files in schemas_and_paths as long as there's no conflicts. |
| `extensions`             | Optional. List of file paths of SQLite extensions to load. crypto.so is needed for snapshots to work; see SQLlite Extensions below. |

## Caveats 

- Schemas are implemented as attached database files. (SQLite conflates databases and schemas.)

  - SQLite automatically assigns 'main' to the file you initially connect to, so this must be defined in your profile. Other schemas defined in your profile
  get attached when database connection is created.

  - If dbt needs to create a new schema, it will be created in `schema_directory` as `schema_name.db`. Dropping a schema results in dropping all its relations and detaching the database file from the session.

  - Schema names are stored in view definitions, so when you access a non-'main' database file outside dbt, you'll need to attach it using the same name, or the views won't work.

  - SQLite does not allow views in one schema (i.e. database file) to reference objects in another schema. You'll get this error from SQLite: "view [someview] cannot reference objects in database [somedatabase]". You must set `materialized='table'` in models that reference other schemas.

- Materializations are simplified: they drop and re-create the model, instead of doing the backup-and-swap-in new model that the other dbt database adapters support. This choice was made because SQLite doesn't support `DROP ... CASCADE` or `ALTER VIEW` or provide information about relation dependencies in something information_schema-like. These limitations make it really difficult to make the backup-and-swap-in functionality work properly. Given how SQLite aggressively [locks](https://sqlite.org/lockingv3.html the database anyway, it's probably not worth the effort.

## SQLite Extensions

For snapshots to work, you'll need the `crypto` module from SQLean to get an `md5()` function. It's recommended that you install all the SQLean modules, as they provide many common SQL functions missing from SQLite.

Precompiled binaries are available for download from the [SQLean github repository page](https://github.com/nalgeon/sqlean). You can also compile them yourself if you want.

Point to these module files in your profile config as shown in the example above.

Mac OS seems to ship with [SQLite libraries that do not have support for loading extensions compiled in](https://docs.python.org/3/library/sqlite3.html#f1), so this won't work "out of the box." Accordingly, snapshots won't work. If you need snapshot functionality, you'll need to compile SQLite/python or find a python distribution for Mac OS with this support.
