---
title: "Packages"
id: "packages"
description:  "Discover how dbt packages help modularize code and transform data efficiently. Learn about git packages, hub packages, private packages, and advanced package configurations."
keywords: [dbt package, private package, dbt private package, dbt data transformation, dbt clone, add dbt package]
---


Software engineers frequently modularize code into libraries. These libraries help programmers operate with leverage: they can spend more time focusing on their unique business logic, and less time implementing code that someone else has already spent the time perfecting.

In dbt, libraries like these are called _packages_. dbt's packages are so powerful because so many of the analytic problems we encountered are shared across organizations, for example:
* transforming data from a consistently structured SaaS dataset, for example:
  * turning [Snowplow](https://hub.getdbt.com/dbt-labs/snowplow/latest/) or [Segment](https://hub.getdbt.com/dbt-labs/segment/latest/) pageviews into sessions
  * transforming [AdWords](https://hub.getdbt.com/dbt-labs/adwords/latest/) or [Facebook Ads](https://hub.getdbt.com/dbt-labs/facebook_ads/latest/) spend data into a consistent format.
* writing dbt macros that perform similar functions, for example:
  * [generating SQL](https://github.com/dbt-labs/dbt-utils#sql-helpers) to union together two relations, pivot columns, or construct a <Term id="surrogate-key" />
  * creating [custom schema tests](https://github.com/dbt-labs/dbt-utils#schema-tests)
  * writing [audit queries](https://hub.getdbt.com/dbt-labs/audit_helper/latest/)
* building models and macros for a particular tool used in your data stack, for example:
  * Models to understand [Redshift](https://hub.getdbt.com/dbt-labs/redshift/latest/) privileges.
  * Macros to work with data loaded by [Stitch](https://hub.getdbt.com/dbt-labs/stitch_utils/latest/).

dbt _packages_ are in fact standalone dbt projects, with models, macros, and other resources that tackle a specific problem area. As a dbt user, by adding a package to your project, all of the package's resources will become part of your own project. This means:
* Models in the package will be materialized when you `dbt run`.
* You can use `ref` in your own models to refer to models from the package.
* You can use `source` to refer to sources in the package.
* You can use macros in the package in your own project.
* It's important to note that defining and installing dbt packages is different from [defining and installing Python packages](/docs/build/python-models#using-pypi-packages)


import UseCaseInfo from '/snippets/_packages_or_dependencies.md';

<UseCaseInfo/>

## How do I add a package to my project?
1. Add a file named `dependencies.yml` or `packages.yml` to your dbt project. This should be at the same level as your `dbt_project.yml` file.
2. Specify the package(s) you wish to add using one of the supported syntaxes, for example:

<File>

```yaml
packages:
  - package: dbt-labs/snowplow
    version: 0.7.0

  - git: "https://github.com/dbt-labs/dbt-utils.git"
    revision: 0.9.2

  - local: /opt/dbt/redshift
```

</File>

The default [`packages-install-path`](/reference/project-configs/packages-install-path) is `dbt_packages`.

3. Run `dbt deps` to install the package(s). Packages get installed in the `dbt_packages` directory – by default this directory is ignored by git, to avoid duplicating the source code for the package.

## How do I specify a package?
You can specify a package using one of the following methods, depending on where your package is stored.

### Hub packages (recommended)

dbt Labs hosts the [Package hub](https://hub.getdbt.com), registry for dbt packages, as a courtesy to the dbt Community, but does not certify or confirm the integrity, operability, effectiveness, or security of any Packages. Please read the [dbt Labs Package Disclaimer](https://hub.getdbt.com/disclaimer/) before installing Hub packages.

You can install available hub packages in the following way:

<File name='packages.yml'>

```yaml
packages:
  - package: dbt-labs/snowplow
    version: 0.7.3 # version number
```

</File>

Hub packages require a version to be specified – you can find the latest release number on dbt Hub. Since Hub packages use [semantic versioning](https://semver.org/), we recommend pinning your package to the latest patch version from a specific minor release, like so:


```yaml
packages:
  - package: dbt-labs/snowplow
    version: [">=0.7.0", "<0.8.0"]
```

`dbt deps` "pins" each package by default. See ["Pinning packages"](#pinning-packages) for details.

Where possible, we recommend installing packages via dbt Hub, since this allows dbt to handle duplicate dependencies. This is helpful in situations such as:
* Your project uses both the dbt-utils and Snowplow packages, and the Snowplow package _also_ uses the dbt-utils package.
* Your project uses both the Snowplow and Stripe packages, both of which use the dbt-utils package.

In comparison, other package installation methods are unable to handle the duplicate dbt-utils package. 

Advanced users can choose to host an internal version of the package hub based on [this repository](https://github.com/dbt-labs/hub.getdbt.com) and setting the `DBT_PACKAGE_HUB_URL` environment variable.

#### Prerelease versions

Some package maintainers may wish to push prerelease versions of packages to the dbt Hub, in order to test out new functionality or compatibility with a new version of dbt. A prerelease version is demarcated by a suffix, such as `a1` (first alpha), `b2` (second beta), or `rc3` (third release candidate).

By default, `dbt deps` will not include prerelease versions when resolving package dependencies. You can enable the installation of prereleases in one of two ways:
- Explicitly specifying a prerelease version in your `version` criteria
- Setting `install_prerelease` to `true`, and providing a compatible version range

For example, both of the following configurations would successfully install `0.4.5-a2` for the [`dbt_artifacts` package](https://hub.getdbt.com/brooklyn-data/dbt_artifacts/latest/):

```yaml
packages:
  - package: brooklyn-data/dbt_artifacts
    version: 0.4.5-a2
```

```yaml
packages:
  - package: brooklyn-data/dbt_artifacts
    version: [">=0.4.4", "<0.4.6"]
    install_prerelease: true
```

### Git packages
Packages stored on a Git server can be installed using the `git` syntax, like so:

<File name='packages.yml'>

```yaml
packages:
  - git: "https://github.com/dbt-labs/dbt-utils.git" # git URL
    revision: 0.9.2 # tag or branch name
```

</File>

Add the Git URL for the package, and optionally specify a revision. The revision can be:
- a branch name
- a tagged release
- a specific commit (full 40-character hash)

Example of a revision specifying a 40-character hash:

```yaml
packages:
  - git: "https://github.com/dbt-labs/dbt-utils.git"
    revision: 4e28d6da126e2940d17f697de783a717f2503188
```

By default, `dbt deps` "pins" each package. See ["Pinning packages"](#pinning-packages) for details.

### Internally hosted tarball URL

Some organizations have security requirements to pull resources only from internal services. To address the need to install packages from hosted environments such as Artifactory or cloud storage buckets, dbt Core enables you to install packages from internally-hosted tarball URLs. 


```yaml
packages:
  - tarball: https://codeload.github.com/dbt-labs/dbt-utils/tar.gz/0.9.6
    name: 'dbt_utils'
```

Where `name: 'dbt_utils'` specifies the subfolder of `dbt_packages` that's created for the package source code to be installed within.

### Private packages

#### SSH Key Method (Command Line only)
If you're using the Command Line, private packages can be cloned via SSH and an SSH key.

When you use SSH keys to authenticate to your git remote server, you don’t need to supply your username and password each time. Read more about SSH keys, how to generate them, and how to add them to your git provider here: [Github](https://docs.github.com/en/github/authenticating-to-github/connecting-to-github-with-ssh) and [GitLab](https://docs.gitlab.com/ee/ssh/).


<File name='packages.yml'>

```yaml
packages:
  - git: "git@github.com:dbt-labs/dbt-utils.git" # git SSH URL
```

</File>

If you're using dbt Cloud, the SSH key method will not work, but you can use the [HTTPS Git Token Method](https://docs.getdbt.com/docs/build/packages#git-token-method).


#### Git token method
This method allows the user to clone via HTTPS by passing in a git token via an environment variable. Be careful of the expiration date of any token you use, as an expired token could cause a scheduled run to fail. Additionally, user tokens can create a challenge if the user ever loses access to a specific repo.


:::info dbt Cloud usage
If you are using dbt Cloud, you must adhere to the naming conventions for environment variables. Environment variables in dbt Cloud must be prefixed with either `DBT_` or `DBT_ENV_SECRET`. Environment variables keys are uppercased and case sensitive. When referencing `{{env_var('DBT_KEY')}}` in your project's code, the key must match exactly the variable defined in dbt Cloud's UI.
:::

In GitHub:

<File name='packages.yml'>

```yaml
packages:
  # use this format when accessing your repository via a github application token
  - git: "https://{{env_var('DBT_ENV_SECRET_GIT_CREDENTIAL')}}@github.com/dbt-labs/awesome_repo.git" # git HTTPS URL

  # use this format when accessing your repository via a classical personal access token
  - git: "https://{{env_var('DBT_ENV_SECRET_GIT_CREDENTIAL')}}@github.com/dbt-labs/awesome_repo.git" # git HTTPS URL
 
   # use this format when accessing your repository via a fine-grained personal access token (username sometimes required)
  - git: "https://GITHUB_USERNAME:{{env_var('DBT_ENV_SECRET_GIT_CREDENTIAL')}}@github.com/dbt-labs/awesome_repo.git" # git HTTPS URL
```

</File>

Read more about creating a GitHub Personal Access token [here](https://docs.github.com/en/enterprise-server@3.1/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token). You can also use a GitHub  App installation [token](https://docs.github.com/en/rest/reference/apps#create-an-installation-access-token-for-an-app).

In GitLab:

<File name='packages.yml'>

```yaml
packages:
  - git: "https://{{env_var('DBT_USER_NAME')}}:{{env_var('DBT_ENV_SECRET_DEPLOY_TOKEN')}}@gitlab.example.com/dbt-labs/awesome_project.git" # git HTTPS URL
```

</File>

Read more about creating a GitLab Deploy Token [here](https://docs.gitlab.com/ee/user/project/deploy_tokens/#creating-a-deploy-token) and how to properly construct your HTTPS URL [here](https://docs.gitlab.com/ee/user/project/deploy_tokens/#git-clone-a-repository). Deploy tokens can be managed by Maintainers only.

In Azure DevOps:

<File name='packages.yml'>

```yaml
packages:
  - git: "https://{{env_var('DBT_ENV_SECRET_PERSONAL_ACCESS_TOKEN')}}@dev.azure.com/dbt-labs/awesome_project/_git/awesome_repo" # git HTTPS URL
```

</File>

Read more about creating a Personal Access Token [here](https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=azure-devops&tabs=preview-page#create-a-pat).

In Bitbucket:

<File name='packages.yml'>

```yaml
packages:
  - git: "https://{{env_var('DBT_USER_NAME')}}:{{env_var('DBT_ENV_SECRET_PERSONAL_ACCESS_TOKEN')}}@bitbucketserver.com/scm/awesome_project/awesome_repo.git" # for Bitbucket Server
```

</File>

Read more about creating a Personal Access Token [here](https://confluence.atlassian.com/bitbucketserver/personal-access-tokens-939515499.html).



#### Configure subdirectory for packaged projects

In general, dbt expects `dbt_project.yml` to be located as a top-level file in a package. If the packaged project is instead nested in a subdirectory—perhaps within a much larger mono repo—you can optionally specify the folder path as `subdirectory`. dbt will attempt a [sparse checkout](https://git-scm.com/docs/git-sparse-checkout) of just the files located within that subdirectory. Note that you must be using a recent version of `git` (`>=2.26.0`).

<File name='packages.yml'>

```yaml
packages:
  - git: "https://github.com/dbt-labs/dbt-labs-experimental-features" # git URL
    subdirectory: "materialized-views" # name of subdirectory containing `dbt_project.yml`
```

</File>

### Local packages
A "local" package is a dbt project accessible from your local file system. You can install it by specifying the project's path. It works best when you nest the project within a subdirectory relative to your current project's directory.

<File name='packages.yml'>

```yaml
packages:
  - local: relative/path/to/subdirectory
```

</File>

Other patterns may work in some cases, but not always. For example, if you install this project as a package elsewhere, or try running it on a different system, the relative and absolute paths will yield the same results.

<File name='packages.yml'>

```yaml
packages:
  # not recommended - support for these patterns vary
  - local: /../../redshift   # relative path to a parent directory
  - local: /opt/dbt/redshift # absolute path on the system
```

</File>

There are a few specific use cases where we recommend using a "local" package:
1. **Monorepo** &mdash; When you have multiple projects, each nested in a subdirectory, within a monorepo. "Local" packages allow you to combine projects for coordinated development and deployment.
2. **Testing changes** &mdash; To test changes in one project or package within the context of a downstream project or package that uses it. By temporarily switching the installation to a "local" package, you can make changes to the former and immediately test them in the latter for quicker iteration. This is similar to [editable installs](https://pip.pypa.io/en/stable/topics/local-project-installs/) in Python.
3. **Nested project** &mdash; When you have a nested project that defines fixtures and tests for a project of utility macros, like [the integration tests within the `dbt-utils` package](https://github.com/dbt-labs/dbt-utils/tree/main/integration_tests).


## What packages are available?
Check out [dbt Hub](https://hub.getdbt.com) to see the library of published dbt packages!

## Advanced package configuration
### Updating a package
When you update a version or revision in your `packages.yml` file, it isn't automatically updated in your dbt project. You should run `dbt deps` to update the package. You may also need to run a [full refresh](/reference/commands/run) of the models in this package.

### Uninstalling a package
When you remove a package from your `packages.yml` file, it isn't automatically deleted from your dbt project, as it still exists in your `dbt_packages/` directory. If you want to completely uninstall a package, you should either:
* delete the package directory in `dbt_packages/`;  or
* run `dbt clean` to delete _all_ packages (and any compiled models), followed by `dbt deps`.

### Pinning packages

Beginning with v1.7, running [`dbt deps`](/reference/commands/deps) "pins" each package by creating or updating the `package-lock.yml` file in the _project_root_ where `packages.yml` is recorded. 

- The `package-lock.yml` file contains a record of all packages installed.
- If subsequent `dbt deps` runs contain no changes to `dependencies.yml` or `packages.yml`, dbt-core installs from `package-lock.yml`. 

For example, if you use a branch name, the `package-lock.yml` file pins to the head commit. If you use a version range, it pins to the latest release. In either case, subsequent commits or versions will **not** be installed. To get new commits or versions, run `dbt deps --upgrade` or add `package-lock.yml` to your .gitignore file.

As of v0.14.0, dbt will warn you if you install a package using the `git` syntax without specifying a revision (see below).

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
The git package "https://github.com/dbt-labs/dbt-utils.git" is not pinned.
This can introduce breaking changes into your project without warning!
```

This warning can be silenced by setting `warn-unpinned: false` in the package specification. **Note:** This is not recommended.

<File name='packages.yml'>

```yaml
packages:
  - git: https://github.com/dbt-labs/dbt-utils.git
    warn-unpinned: false
```

</File>

### Setting two-part versions
In dbt v0.17.0 _only_, if the package version you want is only specified as `major`.`minor`, as opposed to `major.minor.patch`, you may get an error that `1.0 is not of type 'string'`. In that case you will have to tell dbt that your version number is a string. This issue was resolved in v0.17.1 and all subsequent versions.

<File name='packages.yml'>

```yaml
packages:
 - git: https://github.com/dbt-labs/dbt-codegen.git
   version: "{{ 1.0 | as_text }}"
```

</File>

