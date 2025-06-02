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
  - git: https://github.com/dbt-labs/dbt_audit_helper.git
    revision: 0.4.0
  - git: "https://github.com/dbt-labs/dbt_labs-experimental-features" # git URL
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
Installing https://github.com/dbt-labs/dbt_audit_helper.git@0.4.0
  Installed from revision 0.4.0
Installing https://github.com/dbt-labs/dbt_labs-experimental-features@0.0.1
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

dbt generates a `package-lock.yml` file in the root of your project. This file records the exact resolved versions (including commit SHAs) of all packages defined in your `packages.yml` or `dependencies.yml` file. The `package-lock.yml` file ensures consistent and repeatable installs across all environments.

When you run `dbt deps`, dbt installs packages based on the versions locked in the `package-lock.yml`. This means that as long as your packages file hasn’t changed, the exact same dependency versions will be installed even if newer versions of those packages have been released. This consistency is important to maintain stability in development and production environments, and to prevent unexpected issues from new releases with potential bugs.

If the `packages.yml` file has changed (for example, a new package is added or a version range is updated), then `dbt deps` automatically resolves the new set of dependencies and updates the lock file accordingly. You can also manually trigger an upgrade by running `dbt deps --upgrade`.

To maintain consistency, commit the `package-lock.yml` file to version control. This guarantees consistency across all environments and for all developers.

### Managing `package-lock.yml`

The `package-lock.yml` file should be committed to Git initially and updated only when you intend to change versions or uninstall a package. For example, run `dbt deps --upgrade` to get updated package versions or `dbt deps --lock` to update the lock file based on changes to the packages config without installing the packages.

To bypass using `package-lock.yml` entirely, you can add it to your project's `.gitignore`. However, this approach sacrifices the predictability of builds. If you choose this route, we strongly recommend adding version pins for third-party packages in your `packages` config.

### Detecting changes in `packages` config

The `package-lock.yml` file includes a `sha1_hash` of your packages config. If you update `packages.yml`, dbt will detect the change and rerun dependency resolution during the next `dbt deps` command. To update the lock file without installing the new packages, use the `--lock` flag:

```shell
dbt deps --lock
```

### Forcing package updates

To update all packages, even if `packages.yml` hasn't changed, use the `--upgrade` flag:

```shell
dbt deps --upgrade
```

This is particularly useful for fetching the latest commits from the `main` branch of an internally maintained Git package. 

:::warning
Forcing package upgrades may introduce build inconsistencies unless carefully managed.
:::

### Adding specific packages

The `dbt deps` command can add or update package configurations directly, saving you from remembering exact syntax. 

#### Hub packages (default)

Hub packages are the default package types and the easiest to install.

```shell
dbt deps --add-package dbt-labs/dbt_utils@1.0.0

# with semantic version range
dbt deps --add-package dbt-labs/snowplow@">=0.7.0,<0.8.0"
```

#### Non-Hub packages

Use the `--source` flag to specify the type of package to be installed:

```shell

# Git package
dbt deps --add-package https://github.com/fivetran/dbt_amplitude@v0.3.0 --source git

# Local package
dbt deps --add-package /opt/dbt/redshift --source local
```
