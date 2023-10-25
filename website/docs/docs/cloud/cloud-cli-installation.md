---
title: Install dbt Cloud CLI 
sidebar_label: "Install dbt Cloud CLI"
id: cloud-cli-installation
description: "Instructions for installing and configuring dbt Cloud CLI"
pagination_next: "docs/cloud/configure-cloud-cli"
---

import CloudCLIFlag from '/snippets/_cloud-cli-flag.md';

<CloudCLIFlag/>


dbt Cloud natively supports developing using a command line (CLI), empowering team members to contribute with enhanced flexibility and collaboration. The dbt Cloud CLI allows you to run dbt commands against your dbt Cloud development environment from your local command line.

dbt commands are run against dbt Cloud's infrastructure and benefit from:

* Secure credential storage in the dbt Cloud platform.
* [Automatic deferral](/docs/cloud/about-cloud-develop-defer) of build artifacts to your Cloud project's production environment. 
* Speedier, lower-cost builds.
* Support for dbt Mesh ([cross-project `ref`](/docs/collaborate/govern/project-dependencies)),
https://github.com/dbt-labs/docs.getdbt.com/pull/4320* Significant platform improvements, to be released over the coming months.


## Prerequisites 
The dbt Cloud CLI is available in all [deployment regions](/docs/cloud/about-cloud/regions-ip-addresses) and for both multi-tenant and single-tenant accounts (Azure single-tenant not supported at this time).

- Ensure you are using dbt version 1.5 or higher. Refer to [dbt Cloud versions](/docs/dbt-versions/upgrade-core-in-cloud) to upgrade.
- Avoid using SSH tunneling for [Postgres and Redshift](/docs/cloud/connect-data-platform/connect-redshift-postgresql-alloydb) connections.
- Avoid using [PrivateLink](/cloud/secure/about-privatelink).

## Install dbt Cloud CLI

You can install the dbt Cloud CLI on the command line by using one of these methods. 

<details>
<summary>Watch a step-by-step video guide</summary>
For a video walkthrough of the installation process, refer to the following video:

<LoomVideo id="dd80828306c5432a996d4580135041b6?sid=fe1895b7-1281-4e42-9968-5f7d11768000"/>

</details>

<Tabs queryString="install">
	
<TabItem value="brew" label="macOS (brew)">

Before you begin, make sure you have [Homebrew installed](http://brew.sh/) in your code editor or command line terminal. Refer to the [FAQs](#faqs) if your operating system runs into path conflicts.

1. Run the following command to verify that you don't already have dbt Core installed:
   
  ```bash
  which dbt
  ```
   - This should return a `dbt not found`. If the dbt help text appears, use `pip uninstall dbt` to remove dbt Core from your machine. <br />
  
2. Install the dbt Cloud CLI with Homebrew: 

   - First, remove the dbt-labs tap, the separate repository for packages, from Homebrew. This prevents Homebrew from installing packages from that repository:
      ```bash
      brew untap dbt-labs/dbt
   -  Then run `brew tap` to add and install the dbt Cloud CLI as a package:
      ```bash
      brew tap dbt-labs/dbt-cli
      ```
   - Lastly, install the dbt Cloud CLI with Homebrew:
      ```bash
      brew install dbt
      ```

3. Verify your installation by running `dbt --help` in the command line. If you see the following output, your installation is correct:
      ```bash
      The dbt Cloud CLI - an ELT tool for running SQL transformations and data models in dbt Cloud...
      ```

     If you don't see this output, check that you've deactivated pyenv or venv and don't have a global dbt version installed.
   
   * Note that you no longer need to run the `dbt deps` command when your environment starts. This step was previously required during initialization. However, you should still run `dbt deps` if you make any changes to your `packages.yml` file.

4. After you've verified the installation, [configure](/docs/cloud/configure-cloud-cli) the dbt Cloud CLI for your dbt Cloud project and use it to run [dbt commands](/reference/dbt-commands) similar to dbt Core. For example, execute `dbt compile` to compile a project using dbt Cloud and validate your models and tests.
   * If you're using the dbt Cloud CLI, you can connect to your data platform directly in the dbt Cloud interface and don't need a [`profiles.yml`](/docs/core/connect-data-platform/profiles.yml) file locally on your machine.  

</TabItem>

<TabItem value="windows" label="Windows (native executable)">

Refer to the [FAQs](#faqs) if your operating system runs into path conflicts.

1. Download the latest Windows release for your platform from [GitHub](https://github.com/dbt-labs/dbt-cli/releases).

2. Extract the `dbt.exe` executable into the same folder as your dbt project.

:::info

Advanced users can configure multiple projects to use the same dbt Cloud CLI by placing the executable in the Program Files folder and [adding it to their Windows PATH environment variable](https://medium.com/@kevinmarkvi/how-to-add-executables-to-your-path-in-windows-5ffa4ce61a53).

Note that if you are using VS Code, you must restart it to pick up modified environment variables.
:::

3. Verify your installation by running `./dbt --help` in the command line. If you see the following output, your installation is correct:
      ```bash
      The dbt Cloud CLI - an ELT tool for running SQL transformations and data models in dbt Cloud...
      ```

     If you don't see this output, check that you've deactivated pyenv or venv and don't have a global dbt version installed.
   
   * Note that you no longer need to run the `dbt deps` command when your environment starts. This step was previously required during initialization. However, you should still run `dbt deps` if you make any changes to your `packages.yml` file.

4. After installation, [configure](/docs/cloud/configure-cloud-cli) the dbt Cloud CLI for your dbt Cloud project and use it to run [dbt commands](/reference/dbt-commands) similar to dbt Core. For example, execute `dbt compile`, to compile a project using dbt Cloud and confirm that it works.
   * If you're using the dbt Cloud CLI, you can connect to your data platform directly in the dbt Cloud interface and don't need a [`profiles.yml`](/docs/core/connect-data-platform/profiles.yml) file locally on your machine. 

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

3. Verify your installation by running `./dbt --help` in the command line. If you see the following output, your installation is correct:
      ```bash
      The dbt Cloud CLI - an ELT tool for running SQL transformations and data models in dbt Cloud...
      ```

     If you don't see this output, check that you've deactivated pyenv or venv and don't have a global dbt version installed.
   
   * Note that you no longer need to run the `dbt deps` command when your environment starts. This step was previously required during initialization. However, you should still run `dbt deps` if you make any changes to your `packages.yml` file.

4. After installation, [configure](/docs/cloud/configure-cloud-cli) the dbt Cloud CLI for your dbt Cloud project and use it to run [dbt commands](/reference/dbt-commands) similar to dbt Core. For example, execute `dbt compile`, to compile a project using dbt Cloud and confirm that it works.
   * If you're using the dbt Cloud CLI, you can connect to your data platform directly in the dbt Cloud interface and don't need a [`profiles.yml`](/docs/core/connect-data-platform/profiles.yml) file locally on your machine.

</TabItem>

<TabItem value="pip" label="Existing dbt Core users (pip)">


:::info Use native packages or a virtual environment to prevent dbt Core conflicts

To prevent overwriting dbt Core, avoid installing the dbt Cloud CLI with pip. Instead, consider using the native installation method and configuring your PATH or create a new virtual environment.

If you've already installed the dbt Cloud CLI and need to switch back to dbt Core, uninstall the dbt Cloud CLI, and follow the dbt Core installation instructions.

You can also have both dbt Cloud CLI and dbt Core installed simultaneously. To avoid conflicts, alias the dbt Cloud CLI as `dbt-cloud`. For more details, check the [FAQs](#faqs) if your operating system experiences path conflicts.
:::


Before installing the dbt Cloud CLI, make sure you have Python installed and your virtual environment venv or pyenv . If you already have a Python environment configured, you can skip to the [pip installation step](#install-dbt-cloud-cli-in-pip).


### Install a virtual environment

We recommend using virtual environments (venv) to namespace `cloud-cli`.

1. Create a new venv:
   ```shell
   python3 -m venv dbt-cloud
    ```

2. Activate the virtual environment each time you create a shell window or session:
  ```shell   
  source dbt-cloud/bin/activate         # activate the environment for Mac and Linux OR
  dbt-env\Scripts\activate            # activate the environment for Windows
  ```

3. (Mac and Linux only) Create an alias to activate your dbt environment with every new shell window or session. You can add the following to your shell's configuration file (for example, $HOME/.bashrc, $HOME/.zshrc) while replacing `<PATH_TO_VIRTUAL_ENV_CONFIG>` with the path to your virtual environment configuration:
   ```shell
   alias env_dbt='source <PATH_TO_VIRTUAL_ENV_CONFIG>/bin/activate'
   ```
   
### Install dbt Cloud CLI in pip

1. (Optional) If you already have dbt Core installed, this installation will override that package. Note your dbt Core version in case you need to reinstall it later:

  ```bash
  dbt --version
  ```

2. Make sure you're in your virtual environment and run the following command to install the dbt Cloud CLI:

  ```bash
  pip3 install dbt
  ```

3. (Optional) To revert back to dbt Core, first uninstall both the dbt Cloud CLI and dbt Core
4. Reinstall dbt Core using the version from Step 2.

  ```bash
  pip3 uninstall dbt-core dbt
  pip3 install dbt-core==VERSION
  ```

4. After you've verified the installation, [configure](/docs/cloud/configure-cloud-cli) the dbt Cloud CLI for your dbt Cloud project and use it to run [dbt commands](/reference/dbt-commands) similar to dbt Core. For example, execute `dbt compile` to compile a project using dbt Cloud and validate your models and tests.
   * If you're using the dbt Cloud CLI, you can connect to your data platform directly in the dbt Cloud interface and don't need a [`profiles.yml`](/docs/core/connect-data-platform/profiles.yml) file locally on your machine. 

</TabItem>

</Tabs>


## Update dbt Cloud CLI

The following instructions explain how to update the dbt CLoud CLI to the latest version depending on your operating system. 

During the public preview period, we recommend updating before filing a bug report. This is because the API is subject to breaking changes.


<Tabs>

<TabItem value="mac" label="macOS (brew)">

To update the dbt Cloud CLI, run `brew upgrade dbt`. (You can also use `brew install dbt`). 

</TabItem>

<TabItem value="windows" label="Windows (executable)">

To update, follow the same process explained in [Windows](/docs/cloud/cloud-cli-installation?install=windows#install-dbt-cloud-cli) and replace the existing `dbt.exe` executable with the new one.

</TabItem>

<TabItem value="linux" label="Linux (executable)">

To update, follow the same process explained in [Windows](/docs/cloud/cloud-cli-installation?install=linux#install-dbt-cloud-cli) and replace the existing `dbt` executable with the new one.

</TabItem>

<TabItem value="existing" label="Existing dbt Core users (pip)">

To update:
- Make sure you're in your virtual environment
- Run `pip install --upgrade dbt`.
	
</TabItem>

</Tabs>

## FAQs

<details>

<summary>What's the difference between the dbt Cloud CLI and dbt Core?</summary>
The dbt Cloud CLI and <a href="https://github.com/dbt-labs/dbt-core">dbt Core</a>, an open-source project, are both command line tools that enable you to run dbt commands. The key distinction is the dbt Cloud CLI is tailored for dbt Cloud's infrastructure and integrates with all its <a href="https://docs.getdbt.com/docs/cloud/about-cloud/dbt-cloud-features">features</a>.

</details>

<details>
<summary>How do I run both the dbt Cloud CLI and dbt Core?</summary>
For compatibility, both the dbt Cloud CLI and dbt Core are invoked by running <code>dbt</code>. This can create path conflicts if your operating system selects one over the other based on your $PATH environment variable (settings).

If you have dbt Core installed locally, either:

1. Install using [pip](/docs/cloud/cloud-cli-installation?install=pip#install-dbt-cloud-cli).

2. Install natively, but ensure that you deactivate your Python environment or uninstall it using `pip uninstall dbt` before proceeding.  

3. (Advanced users) Install natively, but modify the $PATH environment variable to correctly point to the dbt Cloud CLI binary to use both dbt Cloud CLI and dbt Core together.

You can always uninstall the dbt Cloud CLI to return to using dbt Core.
</details>


