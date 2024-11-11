---
title: "About dbt deps command"
sidebar_label: "deps"
id: "deps"
---

`dbt deps` pulls the most recent version of the dependencies listed in your `packages.yml` from git. See [Package-Management](/docs/build/packages) for more information.

Where relevant, dbt will display up to date and/or latest versions of packages that are listed on dbt Hub. Example below.

> This does NOT apply to packages that are installed via git/local

```yaml
packages:
  - package: dbt-labs/dbt_utils
    version: 0.7.1
  - package: brooklyn-data/dbt_artifacts
    version: 1.2.0
    install-prerelease: true
  - package: dbt-labs/codegen
    version: 0.4.0
  - package: calogica/dbt_expectations
    version: 0.4.1
  - git: https://github.com/dbt-labs/dbt-audit-helper.git
    revision: 0.4.0
  - git: "https://github.com/dbt-labs/dbt-labs-experimental-features" # git URL
    subdirectory: "materialized-views" # name of subdirectory containing `dbt_project.yml`
    revision: 0.0.1
  - package: dbt-labs/snowplow
    version: 0.13.0
```

```txt
Installing dbt-labs/dbt_utils@0.7.1
  Installed from version 0.7.1
  Up to date!
Installing brooklyn-data/dbt_artifacts@1.2.0
  Installed from version 1.2.0
Installing dbt-labs/codegen@0.4.0
  Installed from version 0.4.0
  Up to date!
Installing calogica/dbt_expectations@0.4.1
  Installed from version 0.4.1
  Up to date!
Installing https://github.com/dbt-labs/dbt-audit-helper.git@0.4.0
  Installed from revision 0.4.0
Installing https://github.com/dbt-labs/dbt-labs-experimental-features@0.0.1
  Installed from revision 0.0.1
   and subdirectory materialized-views
Installing dbt-labs/snowplow@0.13.0
  Installed from version 0.13.0
  Updated version available: 0.13.1
Installing calogica/dbt_date@0.4.0
  Installed from version 0.4.0
  Up to date!

Updates available for packages: ['tailsdotcom/dbt_artifacts', 'dbt-labs/snowplow']
Update your versions in packages.yml, then run dbt deps
```

## Predictable package installs

Starting in dbt Core v1.7, dbt generates a `package-lock.yml` file in the root of your project. This contains the complete set of resolved packages based on the `packages` configuration in `dependencies.yml` or `packages.yml`. Each subsequent invocation of `dbt deps` will install from the _locked_ set of packages specified in this file. Storing the complete set of required packages (with pinned versions) in version-controlled code ensures predictable installs in production and consistency across all developers and environments. 

The `package-lock.yml` file should be committed in Git initially, and then updated and committed only when you want to change versions or uninstall a package (for example  `dbt deps --upgrade` or `dbt deps --lock`).

The `package-lock.yml` file includes a `sha1_hash` of the `packages` config. This enables dbt to detect if the `packages` config has been updated, and to rerun dependency resolution. To only check for changes to the `packages` config and update the lock file accordingly without installing those packages, provide the `--lock` flag (that is, `dbt deps --lock`).

### Forcing upgrades

It's possible to force package resolution to rerun, even if the `packages` config hasn't changed, by running `dbt deps --upgrade`. This enables you to get the latest commits from the `main` branch of an internally maintained `git` package while accepting the risk of unpredictable builds. 

An alternative to running `dbt deps --upgrade` in production is to "ignore" the lock file by adding `package-lock.yml` to your project's `.gitignore` file. 

If you pursue either approach, dbt Labs strongly recommends adding version pins for third-party packages within your `packages` config.

## Add specific packages

The `dbt deps` command can add or update an existing package configuration &mdash; no need to remember the exact syntax for package configurations. 

For Hub packages (default), which are the easiest to install:

```shell
dbt deps --add-package dbt-labs/dbt_utils@1.0.0

# with semantic version range
dbt deps --add-package dbt-labs/snowplow@">=0.7.0,<0.8.0"
```

For other package types, use the `--source` flag:
```shell
# add package from git
dbt deps --add-package https://github.com/fivetran/dbt_amplitude@v0.3.0 --source git

# add package from local
dbt deps --add-package /opt/dbt/redshift --source local
```
