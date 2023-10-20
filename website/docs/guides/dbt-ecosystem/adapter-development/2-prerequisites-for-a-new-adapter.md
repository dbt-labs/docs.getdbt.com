---
title: "Prerequisites for a new adapter"
id: "2-prerequisites-for-a-new-adapter"
---

To learn what an adapter is and they role they serve, see [What are adapters?](1-what-are-adapters)

It is very important that make sure that you have the right skills, and to understand the level of difficulty required to make an adapter for your data platform.

## Pre-Requisite Data Warehouse Features

The more you can answer Yes to the below questions, the easier your adapter development (and user-) experience will be. See the [New Adapter Information Sheet wiki](https://github.com/dbt-labs/dbt-core/wiki/New-Adapter-Information-Sheet) for even more specific questions.

### Training
- the developer (and any product managers) ideally will have substantial experience as an end-user of dbt. If not, it is highly advised that you at least take the [dbt Fundamentals](https://courses.getdbt.com/courses/fundamentals) and [Advanced Materializations](https://courses.getdbt.com/courses/advanced-materializations) course.

### Database
- Does the database complete transactions fast enough for interactive development?
- Can you execute SQL against the data platform?
- Is there a concept of schemas?
- Does the data platform support ANSI SQL, or at least a subset?
### Driver / Connection Library
- Is there a Python-based driver for interacting with the database that is db API 2.0 compliant (e.g. Psycopg2 for Postgres, pyodbc for SQL Server)
- Does it support: prepared statements, multiple statements, or single sign on token authorization to the data platform?

### Open source software
- Does your organization have an established process for publishing open source software?


It is easiest to build an adapter for dbt when the following the <Term id="data-warehouse" />/platform in question has:
- a conventional ANSI-SQL interface (or as close to it as possible),
- a mature connection library/SDK that uses ODBC or Python DB 2 API, and
- a way to enable developers to iterate rapidly with both quick reads and writes


## Maintaining your new adapter

When your adapter becomes more popular, and people start using it, you may quickly become the maintainer of an increasingly popular open source project. With this new role, comes some unexpected responsibilities that not only include code maintenance, but also working with a community of users and contributors. To help people understand what to expect of your project, you should communicate your intentions early and often in your adapter documentation or README. Answer questions like, Is this experimental work that people should use at their own risk? Or is this production-grade code that you're committed to maintaining into the future?

### Keeping the code compatible with dbt Core

New minor version releases of `dbt-core` may include changes to the Python interface for adapter plugins, as well as new or updated test cases. The maintainers of `dbt-core` will clearly communicate these changes in documentation and release notes, and they will aim for backwards compatibility whenever possible.

Patch releases of `dbt-core` will _not_ include breaking changes to adapter-facing code. For more details, see ["About dbt Core versions"](/docs/dbt-versions/core).

### Versioning and releasing your adapter

We strongly encourage you to adopt the following approach when versioning and releasing your plugin:
- The minor version of your plugin should match the minor version in `dbt-core` (e.g. 1.1.x).
- Aim to release a new version of your plugin for each new minor version of `dbt-core` (once every three months).
- While your plugin is new, and you're iterating on features, aim to offer backwards compatibility and deprecation notices for at least one minor version. As your plugin matures, aim to leave backwards compatibility and deprecation notices in place until the next major version (dbt Core v2).
- Release patch versions of your plugins whenever needed. These patch releases should contain fixes _only_.
