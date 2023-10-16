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

<VersionBlock firstVersion="1.7">

The first time you run `dbt deps`, dbt will generate the `package-lock.yml` file in the _project_root_ where `packages.yml` is recorded, containing all of the resolved packages. Each Subsequent run will record the packages installed in this file. If the subsequent `dbt deps` runs contain no updated packages in `depenedencies.yml` or `packages.yml`, dbt-core will install from `package-lock.yml`. 

When you update the package spec and run `dbt deps` again, the package-lock and package files will be updated accordingly. You can run `dbt deps --lock` to update the `package-lock.yml` with the most recent dependencies from `packages.

The `--add` flag allows you to add a package to the `packages.yml` with configurable `--version` and `--source` information. The `--dry-run` flag, when set to `False`(default) will re-compile the `package-lock.yml` file after a new package is added to the `packages.yml` file. Set it to `True` and the changes will not persist. 

Examples of the `--add` flag:
```shell
# add package from hub (--source arg defaults to "hub")
dbt deps add --package dbt-labs/dbt_utils --version 1.0.0

# add package from hub with semantic version
dbt deps add --package dbt-labs/snowplow --version ">=0.7.0,<0.8.0"

# add package from git
dbt deps add --package https://github.com/fivetran/dbt_amplitude --version v0.3.0 --source git 

# add package from local (--version not required for local)
dbt deps add --package /opt/dbt/redshift --source local

# add package to packages.yml WITHOUT updating package-lock.yml
dbt deps add --package dbt-labs/dbt_utils --version 1.0.0 --dry-run True

```
</VersionBlock>