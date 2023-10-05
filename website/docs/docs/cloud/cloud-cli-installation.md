---
title: Install dbt Cloud CLI 
id: cloud-cli-installation
description: "Instructions for installing and configuring dbt Cloud CLI"
pagination_next: "docs/cloud/configure-cloud-cli"
---

:::info Public preview functionality

The dbt Cloud CLI is currently in [public preview](/docs/dbt-versions/product-lifecycles#dbt-cloud). Share feedback or request features you'd like to see on the [dbt community Slack](https://getdbt.slack.com/archives/C05M77P54FL).

::: 

dbt Cloud natively supports developing using a command line (CLI), empowering team members to contribute with enhanced flexibility and collaboration. The dbt Cloud CLI allows you to run dbt commands against your dbt Cloud development environment from your local command line.

dbt commands are run against dbt Cloud's infrastructure and benefit from:

* Secure credential storage in the dbt Cloud platform.
* Automatic deferral of build artifacts to your Cloud project's production environment. 
* Speedier, lower cost builds.
* Support for dbt Mesh (cross-project `ref`),
* Significant platform improvements, to be released over the coming months.

The dbt Cloud CLI and [dbt Core](https://github.com/dbt-labs/dbt-core), an open-source project, are both command line tools that let you run your dbt projects and use the same dbt commands. The key difference is that the dbt Cloud CLI is designed to work specifically with dbt Cloud's infrastructure.

## Install dbt Cloud CLI

You can install the dbt Cloud CLI on the command line by using one of these methods:

* [Install with Homebrew (MacOS)](#install-with-homebrew-macos)<br />
* [Install manually (Windows)](#install-manually-windows)<br />
* [Install manually (Linux)](#install-manually-linux)<br />


:::caution

For compatibility, both the dbt Cloud CLI and dbt Core are invoked by running `dbt`. This can create path conflicts if your operating system selects one over the other based on your $PATH environment variable (settings).

If you have dbt Core installed locally, ensure that you deactivate your Python environment or uninstall it using `pip uninstall dbt` before proceeding.  Alternatively, advanced users can modify the $PATH environment variable to correctly point to the dbt Cloud CLI binary to use both dbt Cloud CLI and dbt Core together.

You can always uninstall the Cloud CLI to return to using dbt Core.
:::

### Install with Homebrew (MacOS)

Before you begin, make sure you have [Homebrew installed](http://brew.sh/) in your code editor or command line terminal. 

1. Run the following command to verify that there is no conflict with a dbt Core installation on your system:
   
```bash
which dbt
```
   - This should return a `dbt not found`. If the dbt help text appears, use `pip uninstall dbt` to deactivate dbt Core from your machine.
  
2. Install the dbt Cloud CLI with Homebrew: 

```bash
brew tap dbt-labs/dbt-cli
brew install dbt-cloud-cli
```

3. Verify the installation by running `dbt --help` from the command line. If the help text doesn't indicate that you're using the dbt Cloud CLI, make sure you've deactivated your pyenv or venv and don't have a version of dbt globally installed.
  
### Install manually (Windows)

1. Download the latest Windows release for your platform from [GitHub](https://github.com/dbt-labs/dbt-cli/releases).

2. Extract the `dbt.exe` executeable into the same folder as your dbt project.

:::info

Advanced users can configure multiple projects to use the same dbt Cloud CLI by placing the executeable in the Program Files folder and [adding it to their Windows PATH environment variable](https://medium.com/@kevinmarkvi/how-to-add-executables-to-your-path-in-windows-5ffa4ce61a53).

Note that if you are using VS Code, you'll need to restart it to pick up modified environment variables.
:::

3. Verify the installation by running `./dbt --help` from the command line. If the help text doesn't indicate that you're using the dbt Cloud CLI, make sure you've deactivated your pyenv or venv and don't have a version of dbt globally installed.

### Install manually (Linux)

1. Download the latest Linux release for your platform from [GitHub](https://github.com/dbt-labs/dbt-cli/releases). (Pick the file based on your CPU architecture)

2. Extract the `dbt-cloud-cli` binary to the same folder as your dbt project.

```bash
tar -xf dbt_0.29.9_linux_amd64.tar.gz
./dbt --version
```

:::info

Advanced users can configure multiple projects to use the same Cloud CLI executeable by adding it to their PATH environment variable in their shell profile.

:::

3. Verify the installation by running `./dbt --help` from the command line. If the help text doesn't indicate that you're using the dbt Cloud CLI, make sure you've deactivated your pyenv or venv and don't have a version of dbt globally installed.

## Update dbt Cloud CLI

The following instructions explain how to update the dbt CLoud CLI to the latest version depending on your operating system. During the public preview period, we recommend updating before filing a bug report. This is because the API is subject to breaking changes.

#### Update with Homebrew (MacOS)

To update the dbt Cloud CLI, run `brew upgrade dbt-cloud-cli`. 
#### Update manually (Windows and Linux)

To update, follow the same process explained in [Install manually (Windows)](#install-manually-windows) and replace the existing `dbt.exe` executable with the new one.


## Next steps

After installation, you can [configure](/docs/cloud/configure-cloud-cli) the dbt Cloud CLI for your dbt Cloud project and use it to run [dbt commands](/reference/dbt-commands) similar to dbt Core. For example, you can execute the following commands to compile a project using dbt Cloud:

```bash
dbt deps
dbt compile
```
