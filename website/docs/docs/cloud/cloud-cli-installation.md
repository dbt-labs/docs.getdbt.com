---
title: Install dbt Cloud CLI 
sidebar_label: "Install dbt Cloud CLI"
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
* Speedier, lower-cost builds.
* Support for dbt Mesh ([cross-project `ref`](/docs/collaborate/govern/project-dependencies)),
* Significant platform improvements, to be released over the coming months.


## Install dbt Cloud CLI

You can install the dbt Cloud CLI on the command line by using one of these methods:

<Tabs queryString="install">

<TabItem value="pip" label="Existing dbt Core users (pip)">

:::warning Use native packages or a virtual environment to avoid overriding dbt Core

One of the benefits of the dbt Cloud CLI is that there is no need to manage Python environments. We provide this Python package for users who are using the dbt Cloud CLI in place of dbt Core for easy compatibility with existing environments.

Installing this package will override any dbt Core installation in the current Python environment. Avoid this by using the native install experience and configuring your PATH, or by creating a new virtual environment.

To revert back to dbt Core, follow the install instructions for dbt Core.

::: 

This guide is for users who already have a Python environment configured.

1. Ensure you have Python installed and your local venv or pyenv activated.

2. (Optional) If you already have dbt Core installed, this installation will override that package. Note your dbt Core version in case you need to reinstall it later:

```bash
dbt --version
```

3. Run the following command to install the dbt Cloud CLI

```bash
pip3 install dbt
```

4. (Optional) To revert back to dbt Core, first uninstall both the dbt Cloud CLI and dbt Core
5. Then reinstall dbt Core using the version from Step 2.

```bash
pip3 uninstall dbt-core dbt
pip3 install dbt-core==VERSION
```
</TabItem>

	
<TabItem value="brew" label="macOS (brew)">

Before you begin, make sure you have [Homebrew installed](http://brew.sh/) in your code editor or command line terminal. Refer to the [FAQs](#faqs) if your operating system runs into path conflicts.


1. Run the following command to verify that there is no conflict with a dbt Core installation on your system:
   
```bash
which dbt
```
   - This should return a `dbt not found`. If the dbt help text appears, use `pip uninstall dbt` to deactivate dbt Core from your machine.
  
2. Install the dbt Cloud CLI with Homebrew: 

```bash
brew tap dbt-labs/dbt-cli
brew install dbt
```

3. Verify the installation by running `dbt --help` from the command line. If the help text doesn't indicate that you're using the dbt Cloud CLI, make sure you've deactivated your pyenv or venv and don't have a version of dbt globally installed.
  * You no longer need to use the `dbt deps` command. Previously, you had to run that command.

</TabItem>

<TabItem value="windows" label="Windows (native executable)">

Refer to the [FAQs](#faqs) if your operating system runs into path conflicts.

1. Download the latest Windows release for your platform from [GitHub](https://github.com/dbt-labs/dbt-cli/releases).

2. Extract the `dbt.exe` executable into the same folder as your dbt project.

:::info

Advanced users can configure multiple projects to use the same dbt Cloud CLI by placing the executable in the Program Files folder and [adding it to their Windows PATH environment variable](https://medium.com/@kevinmarkvi/how-to-add-executables-to-your-path-in-windows-5ffa4ce61a53).

Note that if you are using VS Code, you must restart it to pick up modified environment variables.
:::

3. Verify the installation by running `./dbt --help` from the command line. If the help text doesn't indicate that you're using the dbt Cloud CLI, make sure you've deactivated your pyenv or venv and don't have a version of dbt globally installed.
  * You no longer need to use the `dbt deps` command. Previously, you had to run that command.

</TabItem>

<TabItem value="linux" label="Linux (native executable)">

Refer to the [FAQs](#faqs) if your operating system runs into path conflicts.

1. Download the latest Linux release for your platform from [GitHub](https://github.com/dbt-labs/dbt-cli/releases). (Pick the file based on your CPU architecture)

2. Extract the `dbt-cloud-cli` binary to the same folder as your dbt project.

```bash
tar -xf dbt_0.29.9_linux_amd64.tar.gz
./dbt --version
```

:::info

Advanced users can configure multiple projects to use the same Cloud CLI executable by adding it to their PATH environment variable in their shell profile.

:::

3. Verify the installation by running `./dbt --help` from the command line. If the help text doesn't indicate that you're using the dbt Cloud CLI, make sure you've deactivated your pyenv or venv and don't have a version of dbt globally installed.
  * You no longer need to use the `dbt deps` command. Previously, you had to run that command.

</TabItem>

</Tabs>


## Update dbt Cloud CLI

The following instructions explain how to update the dbt CLoud CLI to the latest version depending on your operating system. During the public preview period, we recommend updating before filing a bug report. This is because the API is subject to breaking changes.


<Tabs>

<TabItem value="existing" label="Existing dbt Core users (pip)">

To update, run `pip install --upgrade dbt`.
	
<TabItem value="mac" label="macOS (brew)">

To update the dbt Cloud CLI, run `brew upgrade dbt-cloud-cli`. 

</TabItem>
<TabItem value="windowslinux" label="Windows and Linux (executables)">

To update, follow the same process explained in [Install manually (Windows)](/docs/cloud/cloud-cli-installation?install=windows#install-dbt-cloud-cli) and replace the existing `dbt.exe` executable with the new one.

</TabItem>

</Tabs>


## Next steps

After installation, you can [configure](/docs/cloud/configure-cloud-cli) the dbt Cloud CLI for your dbt Cloud project and use it to run [dbt commands](/reference/dbt-commands) similar to dbt Core. For example, you can execute the following commands to compile a project using dbt Cloud:


```bash
dbt compile
```

## FAQs

<details>

<summary>What's the difference between the dbt Cloud CLI and dbt Core?</summary>
The dbt Cloud CLI and <a href="https://github.com/dbt-labs/dbt-core">dbt Core</a>, an open-source project, are both command line tools that enable you to run dbt commands. The key distinction is the dbt Cloud CLI is tailored for dbt Cloud's infrastructure and integrates with all its <a href="https://docs.getdbt.com/docs/cloud/about-cloud/dbt-cloud-features">features</a>.

</details>

<details>
<summary>How do I run both the Cloud CLI and dbt Core?</summary>
For compatibility, both the dbt Cloud CLI and dbt Core are invoked by running `dbt`. This can create path conflicts if your operating system selects one over the other based on your $PATH environment variable (settings).

If you have dbt Core installed locally, either:

1. Install using [pip](/docs/cloud/cloud-cli-installation?install=pip#install-dbt-cloud-cli).

2. Install natively, but ensure that you deactivate your Python environment or uninstall it using `pip uninstall dbt` before proceeding.  

3. (Advanced users) Install natively, but modify the $PATH environment variable to correctly point to the dbt Cloud CLI binary to use both dbt Cloud CLI and dbt Core together.

You can always uninstall the Cloud CLI to return to using dbt Core.
</details>


