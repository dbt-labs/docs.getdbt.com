---
title: "Packages"
id: "package-management"
---

## What is a package?
Software engineers frequently modularize code into libraries. These libraries help programmers operate with leverage: they can spend more time focusing on their unique business logic, and less time implementing code that someone else has already spent the time perfecting.

In dbt, libraries like these are called _packages_. dbt's packages are so powerful because so many of the analytic problems we encountered are shared across organizations, for example:
* transforming data from a consistently structured SaaS dataset, for example:
 * turning [Snowplow](https://hub.getdbt.com/fishtown-analytics/snowplow/latest/), [Segment](https://hub.getdbt.com/fishtown-analytics/segment/latest/) or [Heap](https://hub.getdbt.com/fishtown-analytics/heap/latest/) pageviews into sessions
  * transforming [AdWords](https://hub.getdbt.com/fishtown-analytics/adwords/latest/) or [Facebook Ads](https://hub.getdbt.com/fishtown-analytics/facebook_ads/latest/) spend data into a consistent format.
* writing dbt macros that perform similar functions, for example:
  * [generating SQL](https://github.com/fishtown-analytics/dbt-utils#sql-helpers) to union together two relations, pivot columns, or construct a surrogate key
  * creating [custom schema tests](https://github.com/fishtown-analytics/dbt-utils#schema-tests)
  * writing [audit queries](https://hub.getdbt.com/fishtown-analytics/audit_helper/latest/)
* building models and macros for a particular tool used in your data stack, for example:
  * Models to understand [Redshift](https://hub.getdbt.com/fishtown-analytics/redshift/latest/) privileges.
  * Macros to work with data loaded by [Stitch](https://hub.getdbt.com/fishtown-analytics/stitch_utils/latest/).

dbt _packages_ are in fact standalone dbt projects, with models and macros that tackle a specific problem area. As a dbt user, by adding a package to your project, the package's models and macros will become part of your own project. This means:
* Models in the package will be materialized when you `dbt run`.
* You can use `ref` in your own models to refer to models from the package.
* You can use macros in the package in you own project.

## How do I add a package to my project?
1. Add a `packages.yml` file to your dbt project. This should be at the same level as your `dbt_project.yml` file.
2. Specify the package(s) you wish to add using one of the supported syntaxes, for example:

<File name='packages.yml'>

```yaml
packages:
  - package: fishtown-analytics/snowplow
    version: 0.7.0

  - git: "https://github.com/fishtown-analytics/dbt-utils.git"
    revision: 0.1.21

  - local: /opt/dbt/redshift
```

</File>

3. Run `dbt deps` to install the package(s). Packages get installed in the `dbt_modules` directory – by default this directory is ignored by git, to avoid duplicating the source code for the package.

## How do I specify a package?
You can specify a package using one of the following methods, depending on where your package is stored.

### Hub packages (recommended)
[dbt Hub](https://hub.getdbt.com) is a registry for dbt packages. Packages that are listed on dbt Hub can be installed like so:

<File name='packages.yml'>

```yaml
packages:
  - package: fishtown-analytics/snowplow
    version: 0.7.3 # version number
```

</File>

Hub packages require a version to be specified – you can find the latest release number on dbt Hub. Since Hub packages use [semantic versioning](https://semver.org/), we recommend pinning your package to the latest patch version from a specific minor release, like so:


```yaml
packages:
  - package: fishtown-analytics/snowplow
    version: [">=0.7.0", "<0.8.0"]
```

Where possible, we recommend installing packages via dbt Hub, since this allows dbt to handle duplicate dependencies. This is helpful in situations such as:
* Your project uses both the dbt-utils and Snowplow packages; and the Snowplow package _also_ uses the dbt-utils package.
* Your project uses both the Snowplow and Stripe packages, both of which use the dbt-utils package.

In comparison, other package installation methods are unable to handle the duplicate dbt-utils package.

### Git packages
Packages stored on a Git server can be installed using the `git` syntax, like so:


<File name='packages.yml'>

```yaml
packages:
  - git: "https://github.com/fishtown-analytics/dbt-utils.git" # git URL
    revision: 0.1.21 # tag or branch name
```

</File>

Add the Git URL for the package, and optionally specify a revision. The revision can be either the name of a branch, or a tagged release. We **strongly recommend** "pinning" your package to a specific release by specifying a release name.

If you do not provide a revision, or if you use `master`, then any updates to the package will be incorporated into your project the next time you run `dbt deps`. While we generally try to avoid making breaking changes to these packages, they are sometimes unavoidable. Pinning a package revision helps prevent your code from changing without your explicit approval.

To find the latest release for a package, navigate to the `Releases` tab in the relevant GitHub repository. For example, you can find all of the releases for the dbt-utils package [here](https://github.com/fishtown-analytics/dbt-utils/releases).

As of v0.14.0, dbt will warn you if you install a package using the `git` syntax without specifying a version (see below).

#### Private packages
Private packages can be installed by using the SSH configuration on the machine or by passing in a username and password with the git URL. It is recommended that you use SSH authentication method where possible.

<File name='packages.yml'>

```yaml
packages:
  - git: "git@github.com:fishtown-analytics/dbt-utils.git" # git SSH URL
```
This method requires the SSH configuration be stored in `~/.ssh/`.

</File>

```yaml
packages:
  - git: "https://<username>:<password>@github.com/fishtown-analytics/dbt-utils.git" # git HTTPS URL
```

You can also reference an [environment variables](env_var).

```yaml
packages:
  - git: "https://{{env_var('GIT_CREDENTIALS)}}@github.com/fishtown-analytics/dbt-utils.git" # git HTTPS URL
```

### Local packages
Packages that you have stored locally can be installed by specifying the path to the project, like so:

<File name='packages.yml'>

```yaml
packages:
  - local: /opt/dbt/redshift # use a local path
```

</File>

Local packages should only be used for specific situations, for example, when testing local changes to a package.

## What packages are available?
Check out [dbt Hub](https://hub.getdbt.com) to see the library of published dbt packages!

## Advanced package configuration
### Updating a package
When you update a version or revision in your `packages.yml` file, it isn't automatically updated in your dbt project. You should run `dbt deps` to update the package. You may also need to run a [full refresh](run) of the models in this package.

### Uninstalling a package
When you remove a package from your `packages.yml` file, it isn't automatically deleted from your dbt project, as it still exists in your `dbt_modules/` directory. If you want to completely uninstall a package, you should either:
* delete the package directory in `dbt_modules/`;  or
* run `dbt clean` to delete _all_ packages (and any compiled models), followed by `dbt deps`.

### Configuring packages
You can configure the models and seeds in a package from the `dbt_project.yml` file, like so:

<File name='dbt_project.yml'>

```yml

vars:
  snowplow:
    'snowplow:timezone': 'America/New_York'
    'snowplow:page_ping_frequency': 10
    'snowplow:events': "{{ ref('sp_base_events') }}"
    'snowplow:context:web_page': "{{ ref('sp_base_web_page_context') }}"
    'snowplow:context:performance_timing': false
    'snowplow:context:useragent': false
    'snowplow:pass_through_columns': []

models:
  snowplow:
    +schema: snowplow

seeds:
  snowplow:
    +schema: snowplow_seeds
```

</File>

For example, when using a dataset specific package, you may need to configure variables for the names of the tables that contain your raw data.

Configurations made in your `dbt_project.yml` file will override any configurations in a package (either in the `dbt_project.yml` file of the package, or in config blocks).

### Specifying unpinned Git packages
If your project specifies an "unpinned" Git package, you may see a warning like:
```
The git package "https://github.com/fishtown-analytics/dbt-utils.git" is not pinned.
This can introduce breaking changes into your project without warning!
```

This warning can be silenced by setting `warn-unpinned: false` in the package specification. **Note:** This is not recommended.

<File name='packages.yml'>

```yaml
packages:
  - git: https://github.com/fishtown-analytics/dbt-utils.git
    warn-unpinned: false
```

</File>

### Setting two-part versions
As of 0.17.0, if the package version you want is only specified as `major`.`minor`, as opposed to `major.minor.patch`, you may get an error that `1.0 is not of type 'string'`. In that case you will have to tell dbt that your version number is a string.

<File name='packages.yml'>

```yaml
packages:
 - git: https://github.com/fishtown-analytics/dbt-codegen.git
   version: "{{ 1.0 | as_text }}"
```

</File>
