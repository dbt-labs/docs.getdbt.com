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

dbt generates the `package-lock.yml` file in the _project_root_ where `packages.yml` is recorded, which contains all the resolved packages, the first time you run `dbt deps`. Each subsequent run records the packages installed in this file. If the subsequent `dbt deps` runs contain no updated packages in `dependencies.yml` or `packages.yml`, dbt-core installs from `package-lock.yml`. 

When you update the package spec and run `dbt deps` again, the `package-lock.yml` and `packages.yml` files update accordingly. 

There are two flags related to `package-lock.yml`:
- `dbt deps --lock` &mdash; creates or updates the `package-lock.yml` file but does not install the packages.
- `dbt deps --upgrade` &mdash; creates or updates the `package-lock.yml` file with the most recent dependencies from `packages.yml`. Also install the packages unless the `--lock` flag is also passed.

Examples of the `--add-package` flag:
```shell
# add package from hub (--source arg defaults to "hub")
dbt deps --add-package dbt-labs/dbt_utils@1.0.0

# add package from hub with semantic version range
dbt deps --add-package dbt-labs/snowplow@">=0.7.0,<0.8.0"

# add package from git
dbt deps --add-package https://github.com/fivetran/dbt_amplitude@v0.3.0 --source git

# add package from local
dbt deps --add-package /opt/dbt/redshift --source local
```
</VersionBlock>
