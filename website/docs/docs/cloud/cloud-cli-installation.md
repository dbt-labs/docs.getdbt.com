---
title: Install dbt Cloud CLI 
sidebar_label: "Installation"
id: cloud-cli-installation
description: "Instructions for installing and configuring dbt Cloud CLI"
pagination_next: "docs/cloud/configure-cloud-cli"
---

dbt Cloud natively supports developing using a command line (CLI), empowering team members to contribute with enhanced flexibility and collaboration. The dbt Cloud CLI allows you to run dbt commands against your dbt Cloud development environment from your local command line.

dbt commands are run against dbt Cloud's infrastructure and benefit from:

* Secure credential storage in the dbt Cloud platform
* [Automatic deferral](/docs/cloud/about-cloud-develop-defer) of build artifacts to your Cloud project's production environment 
* Speedier, lower-cost builds
* Support for dbt Mesh ([cross-project `ref`](/docs/collaborate/govern/project-dependencies))
* Significant platform improvements, to be released over the coming months

<Lightbox src="/img/docs/dbt-cloud/cloud-cli-overview.jpg" title="Diagram of how the dbt Cloud CLI works with dbt Cloud's infrastructure to run dbt commands from your local command line." />

## Prerequisites 
The dbt Cloud CLI is available in all [deployment regions](/docs/cloud/about-cloud/access-regions-ip-addresses) and for both multi-tenant and single-tenant accounts.

## Install dbt Cloud CLI

You can install the dbt Cloud CLI on the command line by using one of these methods. 

<details>
<summary>View a video tutorial for a step-by-step guide to installation.</summary>

<LoomVideo id="dd80828306c5432a996d4580135041b6?sid=fe1895b7-1281-4e42-9968-5f7d11768000"/>

</details>

<Tabs queryString="install">

<TabItem value="brew" label="macOS (brew)">

Before you begin, make sure you have [Homebrew installed](http://brew.sh/) in your code editor or command line terminal. Refer to the [FAQs](#faqs) if your operating system runs into path conflicts. 

1. Verify that you don't already have dbt Core installed by running the following command:
  
  ```bash
  which dbt
  ```
  
  If the output is `dbt not found`, then that confirms you don't have it installed.

:::tip Run `pip uninstall dbt` to uninstall dbt Core

If you've installed dbt Core globally in some other way, uninstall it first before proceeding:

```bash
pip uninstall dbt
```

:::

2. Install the dbt Cloud CLI with Homebrew:

   - First, remove the `dbt-labs` tap, the separate repository for packages, from Homebrew. This prevents Homebrew from installing packages from that repository:
      ```bash
      brew untap dbt-labs/dbt
   -  Then, add and install the dbt Cloud CLI as a package:
      ```bash
      brew tap dbt-labs/dbt-cli
      brew install dbt
      ```
      If you have multiple taps, use `brew install dbt-labs/dbt-cli/dbt`.

3. Verify your installation by running `dbt --help` in the command line. If you see the following output, your installation is correct:
      ```bash
      The dbt Cloud CLI - an ELT tool for running SQL transformations and data models in dbt Cloud...
      ```

     If you don't see this output, check that you've deactivated pyenv or venv and don't have a global dbt version installed.
   
   * Note that you no longer need to run the `dbt deps` command when your environment starts. This step was previously required during initialization. However, you should still run `dbt deps` if you make any changes to your `packages.yml` file.

4. Clone your repository to your local computer using `git clone`. For example, to clone a GitHub repo using HTTPS format, run `git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY`.

5. After cloning your repo, [configure](/docs/cloud/configure-cloud-cli) the dbt Cloud CLI for your dbt Cloud project. This lets you run dbt commands like [`dbt environment show`](/reference/commands/dbt-environment) to view your dbt Cloud configuration or `dbt compile` to compile your project and validate models and tests. You can also add, edit, and synchronize files with your repo.

</TabItem>

<TabItem value="windows" label="Windows (native executable)">

Refer to the [FAQs](#faqs) if your operating system runs into path conflicts.

1. Download the latest Windows release for your platform from [GitHub](https://github.com/dbt-labs/dbt-cli/releases).

2. Extract the `dbt.exe` executable into the same folder as your dbt project.

:::info

Advanced users can configure multiple projects to use the same dbt Cloud CLI by:

 1. Placing the executable file (`.exe`) in the "Program Files" folder
 2. [Adding it to their Windows PATH environment variable](https://medium.com/@kevinmarkvi/how-to-add-executables-to-your-path-in-windows-5ffa4ce61a53)
 3. Saving it where needed

Note that if you're using VS Code, you must restart it to pick up modified environment variables.
:::

3. Verify your installation by running `./dbt --help` in the command line. If you see the following output, your installation is correct:
      ```bash
      The dbt Cloud CLI - an ELT tool for running SQL transformations and data models in dbt Cloud...
      ```

     If you don't see this output, check that you've deactivated pyenv or venv and don't have a global dbt version installed.

   * Note that you no longer need to run the `dbt deps` command when your environment starts. This step was previously required during initialization. However, you should still run `dbt deps` if you make any changes to your `packages.yml` file.

4. Clone your repository to your local computer using `git clone`. For example, to clone a GitHub repo using HTTPS format, run `git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY`.

5. After cloning your repo, [configure](/docs/cloud/configure-cloud-cli) the dbt Cloud CLI for your dbt Cloud project. This lets you run dbt commands like [`dbt environment show`](/reference/commands/dbt-environment) to view your dbt Cloud configuration or `dbt compile` to compile your project and validate models and tests. You can also add, edit, and synchronize files with your repo.

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

4. Clone your repository to your local computer using `git clone`. For example, to clone a GitHub repo using HTTPS format, run `git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY`.

5. After cloning your repo, [configure](/docs/cloud/configure-cloud-cli) the dbt Cloud CLI for your dbt Cloud project. This lets you run dbt commands like [`dbt environment show`](/reference/commands/dbt-environment) to view your dbt Cloud configuration or `dbt compile` to compile your project and validate models and tests. You can also add, edit, and synchronize files with your repo.

</TabItem>

<TabItem value="pip" label="Existing dbt Core users (pip)">

If you already have dbt Core installed, the dbt Cloud CLI may conflict. Here are some considerations:

- **Prevent conflicts** <br /> Use both the dbt Cloud CLI and dbt Core with `pip` and create a new virtual environment.<br /><br />
- **Use both dbt Cloud CLI and dbt Core with brew or native installs** <br /> If you use Homebrew, consider aliasing the dbt Cloud CLI as "dbt-cloud" to avoid conflict. For more details, check the [FAQs](#faqs) if your operating system experiences path conflicts.<br /><br />
- **Reverting to dbt Core from the dbt Cloud CLI** <br />
  If you've already installed the dbt Cloud CLI and need to switch back to dbt Core:<br />
  - Uninstall the dbt Cloud CLI using the command: `pip uninstall dbt`
  - Reinstall dbt Core using the following command, replacing "adapter_name" with the appropriate adapter name:
    ```shell
    python -m pip install dbt-adapter_name --force-reinstall
    ```
    For example, if I used Snowflake as an adapter, I would run: `python -m pip install dbt-snowflake --force-reinstall`

--------

Before installing the dbt Cloud CLI, make sure you have Python installed and your virtual environment venv or pyenv . If you already have a Python environment configured, you can skip to the [pip installation step](#install-dbt-cloud-cli-in-pip).

### Install a virtual environment

We recommend using virtual environments (venv) to namespace `cloud-cli`.

1. Create a new virtual environment named "dbt-cloud" with this command:
   ```shell
   python3 -m venv dbt-cloud
    ```

2. Activate the virtual environment each time you create a shell window or session, depending on your operating system:

   - For Mac and Linux, use: `source dbt-cloud/bin/activate`<br/>
   - For Windows, use: `dbt-env\Scripts\activate` 

3. (Mac and Linux only) Create an alias to activate your dbt environment with every new shell window or session. You can add the following to your shell's configuration file (for example, `$HOME/.bashrc, $HOME/.zshrc`) while replacing `<PATH_TO_VIRTUAL_ENV_CONFIG>` with the path to your virtual environment configuration:
   ```shell
   alias env_dbt='source <PATH_TO_VIRTUAL_ENV_CONFIG>/bin/activate'
   ```

### Install dbt Cloud CLI in pip

1. (Optional) If you already have dbt Core installed, this installation will override that package. Check your dbt Core version in case you need to reinstall it later by running the following command :

  ```bash
  dbt --version
  ```

2. Make sure you're in your virtual environment and run the following command to install the dbt Cloud CLI:

  ```bash
  pip install dbt --no-cache-dir
  ```

  If there are installation issues, running the command with the `--force-reinstall` argument might help:
   ```bash
   pip install dbt --no-cache-dir --force-reinstall
   ``` 

3. (Optional) To revert to dbt Core, first uninstall both the dbt Cloud CLI and dbt Core. Then reinstall dbt Core.

  ```bash
  pip uninstall dbt-core dbt
  pip install dbt-adapter_name --force-reinstall
  ```

4. Clone your repository to your local computer using `git clone`. For example, to clone a GitHub repo using HTTPS format, run `git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY`.

5. After cloning your repo, [configure](/docs/cloud/configure-cloud-cli) the dbt Cloud CLI for your dbt Cloud project. This lets you run dbt commands like [`dbt environment show`](/reference/commands/dbt-environment) to view your dbt Cloud configuration or `dbt compile` to compile your project and validate models and tests. You can also add, edit, and synchronize files with your repo.

</TabItem>


</Tabs>

## Update dbt Cloud CLI

The following instructions explain how to update the dbt Cloud CLI to the latest version depending on your operating system.


<Tabs>

<TabItem value="mac" label="macOS (brew)">

To update the dbt Cloud CLI, run `brew update` and then `brew upgrade dbt`.

</TabItem>

<TabItem value="windows" label="Windows (executable)">

To update, follow the same process explained in [Windows](/docs/cloud/cloud-cli-installation?install=windows#install-dbt-cloud-cli) and replace the existing `dbt.exe` executable with the new one.

</TabItem>

<TabItem value="linux" label="Linux (executable)">

To update, follow the same process explained in [Linux](/docs/cloud/cloud-cli-installation?install=linux#install-dbt-cloud-cli) and replace the existing `dbt` executable with the new one.

</TabItem>

<TabItem value="existing" label="Existing dbt Core users (pip)">

To update:
- Make sure you're in your virtual environment
- Run `python -m pip install --upgrade dbt`.
	
</TabItem>

</Tabs>

## VS Code extension <Lifecycle status="beta"/>

Visual Studio (VS) Code extensions enhance command line tools by adding extra functionalities. [Power user for dbt Core and dbt Cloud](https://marketplace.visualstudio.com/items?itemName=innoverio.vscode-dbt-power-user) is a common extension used to enhance your dbt development with VS Code.

You can use the dbt Cloud CLI with Power User for dbt Core and dbt Cloud by following the instructions [here](https://docs.myaltimate.com/setup/reqdConfigCloud/). 

The Power User extension will handle installing the Cloud CLI on your behalf.

## FAQs

<DetailsToggle alt_header="What's the difference between the dbt Cloud CLI and dbt Core?">

The dbt Cloud CLI and <a href="https://github.com/dbt-labs/dbt-core">dbt Core</a>, an open-source project, are both command line tools that enable you to run dbt commands. 

The key distinction is the dbt Cloud CLI is tailored for dbt Cloud's infrastructure and integrates with all its <a href="https://docs.getdbt.com/docs/cloud/about-cloud/dbt-cloud-features">features</a>.

</DetailsToggle>

<DetailsToggle alt_header="How do I run both the dbt Cloud CLI and dbt Core?">

For compatibility, both the dbt Cloud CLI and dbt Core are invoked by running `dbt`. This can create path conflicts if your operating system selects one over the other based on your $PATH environment variable (settings).

If you have dbt Core installed locally, either:

1. Install using the <code>pip3 install dbt</code> [pip](/docs/cloud/cloud-cli-installation?install=pip#install-dbt-cloud-cli) command.
2. Install natively, ensuring you either deactivate the virtual environment containing dbt Core or create an alias for the dbt Cloud CLI. 
3. (Advanced users) Install natively, but modify the $PATH environment variable to correctly point to the dbt Cloud CLI binary to use both dbt Cloud CLI and dbt Core together.

You can always uninstall the dbt Cloud CLI to return to using dbt Core.

</DetailsToggle>

<DetailsToggle alt_header="How to create an alias?">

To create an alias for the dbt Cloud CLI: <br />

1. Open your shell's profile configuration file. Depending on your shell and system, this could be `~/.bashrc`, `~/.bash_profile`, `~/.zshrc`, or another file.<br />

2. Add an alias that points to the dbt Cloud CLI binary. For example:<code>alias dbt-cloud="path_to_dbt_cloud_cli_binary</code>
   
   Replace <code>path_to_dbt_cloud_cli_binary</code> with the actual path to the dbt Cloud CLI binary, which is <code>/opt/homebrew/bin/dbt</code>. With this alias, you can use the command <code>dbt-cloud</code> to invoke the dbt Cloud CLI.<br />

3. Save the file and then either restart your shell or run <code>source</code> on the profile file to apply the changes.
As an example, in bash you would run: <code>source ~/.bashrc</code><br />

1. Test and use the alias to run commands:<br />
   - To run the dbt Cloud CLI, use the <code>dbt-cloud</code> command: <code>dbt-cloud command_name</code>. Replace 'command_name' with the specific dbt command you want to execute.<br />
   - To run the dbt Core, use the <code>dbt</code> command: <code>dbt command_name</code>. Replace 'command_name' with the specific dbt command you want to execute.<br />


This alias will allow you to use the <code>dbt-cloud</code> command to invoke the dbt Cloud CLI while having dbt Core installed natively.

</DetailsToggle>

<DetailsToggle alt_header="Why am I receiving a `Session occupied` error?">


If you've ran a dbt command and receive a <code>Session occupied</code> error, you can reattach to your existing session with <code>dbt reattach</code> and then press <code>Control-C</code> and choose to cancel the invocation.

</DetailsToggle>
