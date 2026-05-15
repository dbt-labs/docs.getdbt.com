---
title: Install dbt
id: install-dbt
description: "Learn how to install dbt in local environments"
sidebar_label: "Install dbt"
pagination_next: "docs/local/dbt-core-environments"
pagination_prev: null
---

dbt enables data teams to transform data using analytics engineering best practices. You can run dbt locally through a command line interface (CLI) to build, test, and deploy your data transformations.

## dbt Fusion engine (recommended)

For the best local development experience, we recommend the <Constant name="fusion_engine" />. Built in Rust, <Constant name="fusion" /> delivers:

- **Faster performance** &mdash; Up to 10x faster parsing, compilation, and execution.
- **SQL comprehension** &mdash; Dialect-aware validation catches errors before they reach your warehouse.
- **Column-level lineage** &mdash; Trace data flow across your entire project.

[Install Fusion now!](/docs/local/install-dbt?version=2#installation)

### dbt VS Code extension

The [dbt VS Code extension](/docs/dbt-extension-features) combines <Constant name="fusion" />'s performance with powerful <Term id="lsp"/> editor features:

- **IntelliSense** &mdash; Autocomplete for models, macros, and columns.
- **Inline errors** &mdash; See SQL errors as you type.
- **Hover insights** &mdash; View model definitions and column info without leaving your code.
- **Refactoring tools** &mdash; Rename models and columns across your project.

This is the fastest way to get started with dbt locally.

[Install Fusion with the dbt VS Code extension](/docs/local/install-dbt?version=2#installation)

## dbt Core

[<Constant name="core" />](/docs/local/install-dbt?version=1) is the original Python-based dbt engine. <Constant name="core" /> changed data transformation forever and includes a rich set of features:

- **Apache License 2.0** &mdash; <Constant name="core" /> is open source now and forever.
- **Community adapters** &mdash; An amazing community of contributors has built adapters for a vast [catalog of data warehouses](/docs/supported-data-platforms).
- **Code editor support** &mdash; Build your dbt project in popular editors like VS Code or Cursor.
- **Command line interface** &mdash; Run your project from the terminal using macOS Terminal, iTerm, or the integrated terminal in your code editor.

[Install dbt Core now!](/docs/local/install-dbt?version=1#installation)

## Installation

<VersionBlock firstVersion="2.0">

The <Constant name="fusion_engine" /> provides faster parsing, compilation, and execution. Choose your preferred installation method:

<Tabs>
<TabItem value="vscode" label="VS Code extension" default>

import InstallExtension from '/snippets/_install-dbt-extension.md'; 

<InstallExtension/>

</TabItem>

<TabItem value="cli" label="Fusion CLI">

import FusionManualInstall from '/snippets/_fusion-manual-install.md';

## Install Fusion from the CLI <Lifecycle status="preview" />

Fusion can be installed via the command line from our official content delivery network (CDN). <Constant name="fusion"/> CLI delivers <Constant name="fusion_engine" /> performance benefits (faster parsing, compilation, execution) but does not include <Term id="lsp" /> features. For the best <Constant name="fusion_engine" /> experience, install the dbt VS Code extension in your VS Code or compatible IDE. 

<FusionManualInstall />

## Update Fusion

The following command will update to the latest version of Fusion and adapter code:

```shell
dbtf system update
```

## Uninstall Fusion

This command will uninstall the Fusion binary from your system, but aliases will remain wherever they are installed (for example `~/.zshrc`):

```shell
dbtf system uninstall
```

## Adapter installation

Database drivers used by adapters are **not** bundled in the <Constant name="fusion" /> binary. Instead, <Constant name="fusion" /> automatically downloads the correct [ADBC](https://arrow.apache.org/adbc/) driver for your data platform the first time you run a dbt command (such as `dbt run`, `dbt debug`, or `dbt compile`). <Constant name="fusion" /> detects which driver you need based on your `profiles.yml` configuration and downloads it from the dbt Labs CDN at the time of first connection.

For supported adapters, refer to [Fusion requirements](/docs/fusion/supported-features#requirements). For details on network access requirements (including restricted network environments), refer to [Networking requirements](/docs/fusion/fusion-networking).

## Environment variables

<Constant name="fusion"/> automatically loads environment variables from a `.env` file in your current working directory (the folder you `cd` into and run dbt commands from in your terminal). This helps you manage credentials and settings without hardcoding them in your `profiles.yml` or exposing them in your shell history.

### Using a `.env` file

1. Create a `.env` file in your current working directory (typically at the root of your dbt project):
   ```env
   DBT_MY_DATABASE=my_database
   DBT_MY_SCHEMA=my_schema
   DBT_SECRET_KEY=my_secret_value
   ```

2. Reference these variables in your `profiles.yml` using the [`env_var` Jinja function](/reference/dbt-jinja-functions/env_var):
   ```yaml
   my_profile:
     target: dev
     outputs:
       dev:
         type: snowflake
         account: my_account
         database: "{{ env_var('DBT_MY_DATABASE') }}"
         schema: "{{ env_var('DBT_MY_SCHEMA') }}"
   ```

3. Run dbt commands normally. <Constant name="fusion"/> will automatically load the variables from the `.env` file. For example, running `dbtf debug` will show your connection using the values from `.env`:
   ```shell
   dbtf debug
   ...
   Debugging connection:
   "authenticator": "my_authenticator",
   "account": "my_account",
   "user": "my_user",
   "database": "my_database",        # Loaded from DBT_MY_DATABASE in .env
   "schema": "my_schema",            # Loaded from DBT_MY_SCHEMA in .env
   ```

:::note
We recommend placing your `.env` file in the project root and running dbt commands from that location because the file is loaded _only_ from your current working directory. It doesn't support the `--project-dir` flag or <VersionBlock lastVersion="1.10">`DBT_PROJECT_DIR`</VersionBlock><VersionBlock firstVersion="1.11">`DBT_ENGINE_PROJECT_DIR`</VersionBlock> environment variable, and dbt won't search your project root if you're running commands from a different directory location.
:::

### Precedence order

When the same environment variable is defined in multiple places, <Constant name="fusion"/> uses the following precedence order (highest to lowest):

1. Shell environment &mdash; Variables set directly in your shell (for example, `export DBT_MY_VAR=value`)
2. `.env` file &mdash; Variables defined in the `.env` file in your current working directory

This means environment variables set in your shell always override values from the `.env` file.

:::tip
Add `.env` to your `.gitignore` file to prevent sensitive credentials from being committed to version control. The `dbtf init` command automatically includes `.env` in the generated `.gitignore` file.
:::

For more details on managing environment variables locally, refer to [Configure your local environment](/docs/configure-dbt-extension#set-environment-variables-locally).

## profiles.yml location

<Constant name="fusion"/> searches for `profiles.yml` in the `--profiles-dir` flag (if specified), project root directory, or `~/.dbt/` directory. Unlike <Constant name="core"/>, <Constant name="fusion"/> does not support the <VersionBlock lastVersion="1.10">`DBT_PROFILES_DIR`</VersionBlock><VersionBlock firstVersion="1.11">`DBT_ENGINE_PROFILES_DIR`</VersionBlock> environment variable or `profiles.yml` in arbitrary working directories.

For complete details on profiles.yml configuration and search order, refer to [About profiles.yml](/docs/local/profiles.yml#location-of-profilesyml).

## Troubleshooting

Common issues and resolutions:

- **dbt command not found:** Ensure installation location is correctly added to your `$PATH`.
- **Version conflicts:** Verify no existing <Constant name="core" /> or dbt CLI versions are installed (or active) that could conflict with Fusion.
- **Installation permissions:** Confirm your user has appropriate permissions to install software locally.

## Frequently asked questions

- Can I revert to my previous dbt installation?

    Yes. If you want to test Fusion without affecting your existing workflows, consider isolating or managing your installation via separate environments or virtual machines.

import AboutFusion from '/snippets/_about-fusion.md';

<AboutFusion />

</TabItem>
</Tabs>

</VersionBlock>

<VersionBlock lastVersion="1.99">

[<Constant name="core" />](https://github.com/dbt-labs/dbt-core) is an open-source project where you can develop from the command line and run your dbt project.

:::info How we set up our computers for working on dbt projects

We've written a [guide](https://discourse.getdbt.com/t/how-we-set-up-our-computers-for-working-on-dbt-projects/243) for our recommended setup when running dbt projects using <Constant name="core" />.

:::

If you're using the command line, we recommend learning some basics of your terminal to help you work more effectively. In particular, it's important to understand `cd`, `ls` and `pwd` to be able to navigate through the directory structure of your computer easily.

<Tabs>
<TabItem value="pip" label="pip" default>

You need to use `pip` to install dbt Core on Windows, Linux, or MacOS operating systems.

You can install dbt Core and plugins using `pip` because they are Python modules distributed on [PyPI](https://pypi.org/project/dbt-core/).

<FAQ path="Core/install-pip-os-prereqs" />
<FAQ path="Core/install-python-compatibility" />

## What is a Python virtual environment?

A Python virtual environment creates an isolated workspace for Python projects, preventing conflicts between dependencies of different projects and versions.

You can create virtual environments using tools like [conda](https://anaconda.org/anaconda/conda), [poetry](https://python-poetry.org/docs/managing-environments/) or `venv`. This guide uses `venv` because it's lightweight, has the fewest additional dependencies, and is included in Python by default.

### Prerequisites

- Access to a terminal or command prompt.
- Have [Python](https://www.python.org/downloads/) installed on your machine. You can check if Python is installed by running `python --version` or `python3 --version` in your terminal or command prompt.
- Have [pip installed](https://pip.pypa.io/en/stable/installation/). You can check if pip is installed by running `pip --version` or `pip3 --version`.
- Have the necessary permissions to create directories and install packages on your machine.
- Once you've met the prerequisites, follow these steps to set up your virtual environment.

### Set up a Python virtual environment 

`venv` will set up a Python virtual environment within the `env` folder.

Depending on the operating system you use, you'll need to execute specific steps to set up a virtual environment. 

To set up a Python virtual environment, navigate to your project directory and execute the command. This will generate a new virtual environment within a local folder that you can name anything.  [Our convention](https://github.com/dbt-labs/dbt-core/blob/main/CONTRIBUTING.md#virtual-environments) has been to name it `env` or `env-anything-you-want`

<Tabs>
  <TabItem value="Unix/macOS" label="Unix/macOS">
    1. Create your virtual environment:

    ```shell
    python3 -m venv env
    ```

    2. Activate your virtual environment:

    ```shell
    source env/bin/activate
    ```

    3. Verify Python Path:

    ```shell
    which python
    ```

    4. Run Python:

    ```shell
    env/bin/python
    ```
  </TabItem>

  <TabItem value="Windows" label="Windows">

    Note: Syntax may vary slightly depending on the program. For example, bash would be `source env/Scripts/activate`. The following examples use PowerShell:
    
    1. Create your virtual environment

    ```shell
    py -m venv env
    ```

    2. Activate your virtual environment:

    ```shell
    .env\Scripts\activate
    ```

    3. Verify Python Path:

    ```shell
    where python
    ```

    4. Run Python:

    ```shell
    env\Scripts\python
    ```
  </TabItem>
</Tabs>

If you're using <Constant name="core" />, refer to [What are the best practices for installing <Constant name="core" /> with pip?](/faqs/Core/install-pip-best-practices.md#using-virtual-environments) after creating your virtual environment. 

### Deactivate virtual environment

To switch projects or leave your virtual environment, deactivate the environment using the command while the virtual environment is active:

```shell
deactivate
```

### Create an alias

To activate your dbt environment with every new shell window or session, you can create an alias for the source command in your `$HOME/.bashrc`, `$HOME/.zshrc`, or whichever config file your shell draws from. 

For example, add the following to your rc file, replacing `<PATH_TO_VIRTUAL_ENV_CONFIG>` with the path to your virtual environment configuration.

```shell
alias env_dbt='source <PATH_TO_VIRTUAL_ENV_CONFIG>/bin/activate'
```

## Installing the adapter

Once you decide [which adapter](/docs/supported-data-platforms) you're using, you can install using the command line. Installing an adapter automatically installs `dbt-core`.

```shell
python -m pip install dbt-ADAPTER_NAME
```

For example, if using Postgres:

```shell
python -m pip install dbt-postgres
```

This will install `dbt-core` and `dbt-postgres` _only_:

```shell
$ dbt --version
installed version: 1.0.0
   latest version: 1.0.0

Up to date!

Plugins:
  - postgres: 1.0.0
```

All adapters build on top of `dbt-core`. Some also depend on other adapters: for example, `dbt-redshift` builds on top of `dbt-postgres`. In that case, you would see those adapters included by your specific installation, too.

### Upgrade adapters

To upgrade a specific adapter plugin:

```shell
python -m pip install --upgrade dbt-ADAPTER_NAME
```

### Install dbt-core only

If you're building a tool that integrates with <Constant name="core" />, you may want to install the core library alone, without a database adapter. Note that you won't be able to use dbt as a CLI tool.

```shell
python -m pip install dbt-core
```

## Change dbt Core versions

You can upgrade or downgrade versions of dbt Core by using the `--upgrade` option on the command line (CLI). For more information, see [Best practices for upgrading in Core versions](/docs/dbt-versions#best-practices-for-upgrading).

To upgrade dbt to the latest version:

```
python -m pip install --upgrade dbt-core
```

To downgrade to an older version, specify the version you want to use. This command can be useful when you're resolving package dependencies. As an example:

```
python -m pip install --upgrade dbt-core==1.9
```

## `pip install dbt`

In the fall of 2023, the `dbt` package on PyPI became a supported method to install the [<Constant name="platform_cli" />](/docs/platform/dbt-cli-installation?install=pip#install-dbt-cloud-cli-in-pip).

If you have workflows or integrations that rely on installing the package named `dbt`, you can achieve the same behavior by installing the same five packages that it used:

```shell
python -m pip install \
  dbt-core \
  dbt-postgres \
  dbt-redshift \
  dbt-snowflake \
  dbt-bigquery \
  dbt-trino
```

Or, better yet, just install the package(s) you need!


## Installing prereleases

A prerelease adapter is a version released before the final, stable version. It allows users to test new features, provide feedback, and get early access to upcoming functionality &mdash; ensuring your system will be ready for the final release.

Using a prerelease of an adapter has many benefits such as granting you early access to new features and improvements ahead of the stable release. As well as compatibility testing, allowing you to test the adapter in your environment to catch integration issues early, ensuring your system will be ready for the final release. 

Note that using a prerelease version before the final, stable version means the version isn't fully optimized and can result in unexpected behavior. Additionally, frequent updates and patches during the prerelease phase may require extra time and effort to maintain. Furthermore, the `--pre flag` may install compatible prerelease versions of other dependencies, which could introduce additional instability.

To install prerelease versions of dbt Core and your adapter, use this command (replace `dbt-ADAPTER_NAME` with your adapter)

```shell
python3 -m pip install --pre dbt-ADAPTER_NAME
```

For example, if you're using Snowflake, you would use the command:


```shell
python3 -m pip install --pre dbt-snowflake

```

We recommend you install prereleases in a [virtual Python environment](https://packaging.python.org/en/latest/guides/installing-using-pip-and-virtual-environments/). For example, to install a prerelease in a `POSIX bash`/`zsh` virtual Python environment, use the following commands:

```shell
dbt --version
python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install --upgrade pip
python3 -m pip install --pre dbt-ADAPTER_NAME
source .venv/bin/activate
dbt --version
```
Note, this will also install any pre-releases of all dependencies.

## Activate your virtual environment 

To install or use packages within your virtual environment:

- Activate the virtual environment to add its specific Python and `pip` executables to your shell's PATH. This ensures you use the environment's isolated setup. 

For more information, refer to [Create and use virtual environments](https://packaging.python.org/en/latest/guides/installing-using-pip-and-virtual-environments/#create-and-use-virtual-environments).

Select your operating system and run the following command to activate it:

<Expandable alt_header="Unix/macOS" >

1. Activate your virtual environment: 

```shell
source .venv/bin/activate
which python
.venv/bin/python
  
```
  2. Install the prerelease using the following command:


```shell
python3 -m pip install --pre dbt-ADAPTER_NAME
source .venv/bin/activate
dbt --version
```

</Expandable>

<Expandable alt_header="Windows" >

1. Activate your virtual environment: 

```shell
.venv\Scripts\activate
where python
.venv\Scripts\python
```

2. Install the prerelease using the following command:

```shell
py -m pip install --pre dbt-ADAPTER_NAME
.venv\Scripts\activate
dbt --version
```

</Expandable>

</TabItem>

<TabItem value="docker" label="Docker">

<Constant name="core" /> and all adapter plugins maintained by dbt Labs are available as [Docker](https://docs.docker.com/) images, and distributed via [GitHub Packages](https://docs.github.com/en/packages/learn-github-packages/introduction-to-github-packages) in a [public registry](https://github.com/dbt-labs/dbt-core/pkgs/container/dbt-core).

Using a prebuilt Docker image to install dbt Core in production has a few benefits: it already includes dbt-core, one or more database adapters, and pinned versions of all their dependencies. By contrast, `python -m pip install dbt-ADAPTER_NAME` takes longer to run, and will always install the latest compatible versions of every dependency.

You might also be able to use Docker to install and develop locally if you don't have a Python environment set up. Note that running dbt in this manner can be significantly slower if your operating system differs from the system that built the Docker image. If you're a frequent local developer, we recommend that you install <Constant name="core" /> using pip instead.

### Prerequisites

* You've installed Docker. For more information, see the [Docker](https://docs.docker.com/) site.
* You understand which database adapter(s) you need. For more information, see [About dbt adapters](/docs/local/install-dbt#about-dbt-data-platforms-and-adapters).
* You understand how <Constant name="core" /> is versioned. For more information, see [About <Constant name="core" /> versions](/docs/dbt-versions).
* You have a general understanding of the dbt, dbt workflow, developing locally in the command line interface (CLI). For more information, see [About dbt](/docs/introduction#how-do-i-use-dbt).

### Install a dbt Docker image from Github Packages

Official dbt docker images are hosted as [packages in the `dbt-labs` GitHub organization](https://github.com/orgs/dbt-labs/packages?visibility=public). We maintain images and tags for every version of every database adapter, as well as two tags that update as new versions as released:
- `latest`: Latest overall version of dbt-core + this adapter
- `<Major>.<Minor>.latest`: Latest patch of dbt-core + this adapter for `<Major>.<Minor>` version family. For example, `1.1.latest` includes the latest patches for dbt Core v1.1.

Install an image using the `docker pull` command:
```
docker pull ghcr.io/dbt-labs/<db_adapter_name>:<version_tag>
```

### Running a dbt Docker image in a container

The `ENTRYPOINT` for dbt Docker images is the command `dbt`. You can bind-mount your project to `/usr/app` and use dbt as normal:

```
docker run \
--network=host \
--mount type=bind,source=path/to/project,target=/usr/app \
--mount type=bind,source=path/to/profiles.yml,target=/root/.dbt/profiles.yml \
<dbt_image_name> \
ls
```

Or 

```
docker run \
--network=host \
--mount type=bind,source=path/to/project,target=/usr/app \
--mount type=bind,source=path/to/profiles.yml.dbt,target=/root/.dbt/ \
<dbt_image_name> \
ls
```

Notes:
* Bind-mount sources _must_ be an absolute path
* You may need to make adjustments to the docker networking setting depending on the specifics of your data warehouse or database host.

### Building your own dbt Docker image

If the pre-made images don't fit your use case, we also provide a [`Dockerfile`](https://github.com/dbt-labs/dbt-core/blob/main/docker/Dockerfile) and [`README`](https://github.com/dbt-labs/dbt-core/blob/main/docker/README.md) that can be used to build custom images in a variety of ways.

In particular, the Dockerfile supports building images:
- Images that all adapters maintained by dbt Labs
- Images that install one or more third-party adapters
- Images against another system architecture

Please note that, if you go the route of building your own Docker images, we are unable to offer dedicated support for custom use cases. If you run into problems, you are welcome to [ask the community for help](/community/resources/getting-help) or [open an issue](/community/resources/contributor-expectations#issues) in the `dbt-core` repository. If many users are requesting the same enhancement, we will tag the issue `help_wanted` and invite community contribution.

</TabItem>

<TabItem value="source" label="Source">

<Constant name="core" /> and almost all of its adapter plugins are open source software. As such, the codebases are freely available to download and build from source. You might install from source if you want the latest code or want to install dbt from a specific commit. This might be helpful when you are contributing changes, or if you want to debug a past change.

To download from source, you would clone the repositories from GitHub, making a local copy, and then install the local version using `pip`.

Downloading and building <Constant name="core" /> will enable you to contribute to the project by fixing a bug or implementing a sought-after feature. For more details, read the [contributing guidelines](https://github.com/dbt-labs/dbt-core/blob/HEAD/CONTRIBUTING.md).

### Installing dbt Core

Installing an adapter does not automatically install `dbt-core`. This is because adapters and dbt Core versions have been decoupled from each other so we no longer want to overwrite existing dbt-core installations


To install `dbt-core` only from the GitHub code source:

```shell
git clone https://github.com/dbt-labs/dbt-core.git
cd dbt-core
python -m pip install -r requirements.txt
```


To install in editable mode, which includes your local changes as you make them:

```shell
python -m pip install -e editable-requirements.txt` 
```
instead.

### Installing adapter plugins

To install an adapter plugin from source, you will need to first locate its source repository. For instance, the `dbt-redshift` adapter is located at https://github.com/dbt-labs/dbt-redshift.git, so you can clone it and install from there:


You will also need to install `dbt-core` before installing an adapter plugin.


```shell
git clone https://github.com/dbt-labs/dbt-redshift.git
cd dbt-redshift
python -m pip install .
```

To install in editable mode, such as while contributing, use `python -m pip install -e .` instead.

<FAQ path="Core/install-pip-os-prereqs" />
<FAQ path="Core/install-python-compatibility" />
<FAQ path="Core/install-pip-best-practices" />

</TabItem>
</Tabs>

### Upgrading dbt Core

dbt provides a number of resources for understanding [general best practices](/blog/upgrade-dbt-without-fear) while upgrading your dbt project as well as detailed [migration guides](/docs/dbt-versions/core-upgrade) highlighting the changes required for each [minor and major release](/docs/dbt-versions).

- [Upgrade `pip`](/docs/local/install-dbt)

### About dbt data platforms and adapters

dbt works with a number of different data platforms (databases, query engines, and other SQL-speaking technologies). It does this by using a dedicated _adapter_ for each. When you install <Constant name="core" />, you'll also want to install the specific adapter for your database. For more details, see [Supported Data Platforms](/docs/supported-data-platforms).

:::tip Pro tip: Using the --help flag

Most command-line tools, including dbt, have a `--help` flag that you can use to show available commands and arguments. For example, you can use the `--help` flag with dbt in two ways:<br /><br />
&mdash; `dbt --help`: Lists the commands available for dbt<br />
&mdash; `dbt run --help`: Lists the flags available for the `run` command

:::

### Create a project

After installing <Constant name="core" />, create your first [dbt project](/docs/build/projects) using the [`dbt init`](/reference/commands/init) command. This initializes a new project with the standard dbt directory structure and helps verify that your installation is working as expected.

### Related content

- [Quickstart for dbt Core from a manual install](https://docs.getdbt.com/guides/manual-install?step=1)

</VersionBlock>
