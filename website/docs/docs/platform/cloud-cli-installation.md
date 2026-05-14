---
title: Install dbt CLI 
sidebar_label: "Installation"
id: dbt-cli-installation
description: "Instructions for installing and configuring dbt platform's CLI tool."
pagination_next: "docs/platform/configure-dbt-cli"
---

import LongSession from '/snippets/_long-sessions-cli.md';

The <Constant name="dbt_platform" /> natively supports developing using a command line interface (CLI), empowering team members to contribute with enhanced flexibility and collaboration. The dbt CLI allows you to run dbt commands against your <Constant name="dbt_platform" /> development environment from your local command line.

:::note CLI compatibility

The <Constant name="platform_cli" /> is a <Constant name="dbt_platform" /> tool available to users on any [plan](https://www.getdbt.com/pricing). It is intended for use only with the <Constant name="dbt_platform" /> and may conflict with local installations of the <Constant name="core" /> or <Constant name="fusion_engine" /> CLIs. Refer to the [FAQs](#faqs) for more information.

:::

dbt commands run against the platform's infrastructure and benefit from:

* Secure credential storage in the <Constant name="dbt_platform" />
* [Automatic deferral](/docs/platform/about-defer) of build artifacts to your project's production environment 
* Speedier, lower-cost builds
* Support for dbt Mesh ([cross-project `ref`](/docs/mesh/govern/project-dependencies))
* Significant platform improvements, to be released over the coming months

<Lightbox src="/img/docs/dbt-platform/dbt-cli-overview.png" title="Diagram of how the dbt CLI works with dbt's infrastructure to run dbt commands from your local command line." />

## Prerequisites

The <Constant name="platform_cli" /> is available in all [deployment regions](/docs/platform/about-platform/access-regions-ip-addresses) and for both multi-tenant and single-tenant accounts.

- For the best <Constant name="platform_cli" /> experience, install the platform CLI on a machine that doesn't already have the <Constant name="core" /> or <Constant name="fusion" /> CLI installed.
- If you installed the <Constant name="core" /> CLI in a virtual environment, deactivate that environment or create an alias for the platform CLI before you run platform CLI commands.
- If you installed the <Constant name="fusion" /> CLI locally, create an alias for the platform CLI before you run platform CLI commands.

Refer to the [FAQs](#faqs) for more information about managing multiple <Constant name="platform_cli" /> tools and creating an alias.

:::tip Using the <Constant name="dbt_platform"/> CLI for local development with <Constant name="fusion"/>?
See the [Hybrid development with <Constant name="dbt_platform"/>  and <Constant name="fusion"/>](/guides/fusion-platform-local-workflow) guide to keep credentials, environment variables, and <Constant name="fusion"/> versions in sync across your local CLI and <Constant name="dbt_platform"/>.
:::

## Install dbt CLI

You can install the <Constant name="platform_cli" /> via the command line by using one of the following methods: 

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

2. Install the <Constant name="platform_cli" /> with Homebrew:

   - First, remove the `dbt-labs` tap, the separate repository for packages, from Homebrew. This prevents Homebrew from installing packages from that repository:
      ```bash
      brew untap dbt-labs/dbt
      ```
   - Then, add and install the <Constant name="platform_cli" /> as a package:
      ```bash
      brew tap dbt-labs/dbt-cli
      brew install dbt
      ```
      If you have multiple taps, use `brew install dbt-labs/dbt-cli/dbt`.

3. Verify your installation by running `dbt --help` in the command line. If you see the following output, you installed it correctly:
      ```bash
      The dbt CLI - an ELT tool for running SQL transformations and data models in dbt...
      ```

     If you don't see this output, check that you've deactivated pyenv or venv and don't have a global dbt version installed.
   
   * Note that you no longer need to run the `dbt deps` command when your environment starts. Previously, initialization required this step. However, you should still run `dbt deps` if you make any changes to your `packages.yml` file.

4. Clone your repository to your local computer using `git clone`. For example, to clone a GitHub repo using HTTPS format, run `git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY`.

5. After cloning your repo, [configure](/docs/platform/configure-dbt-cli) the <Constant name="platform_cli" /> for your <Constant name="dbt" /> project. This lets you run dbt commands like [`dbt environment show`](/reference/commands/dbt-environment) to view your <Constant name="dbt" /> configuration or `dbt compile` to compile your project and validate models and tests. You can also add, edit, and synchronize files with your repo.

</TabItem>

<TabItem value="windows" label="Windows (native executable)">

Refer to the [FAQs](#faqs) if your operating system runs into path conflicts.

1. Download the latest Windows release for your platform from [GitHub](https://github.com/dbt-labs/dbt-cli/releases).

2. Extract the `dbt.exe` executable into the same folder as your dbt project.

:::info

Advanced users can configure multiple projects to use the same <Constant name="platform_cli" /> by:

 1. Placing the executable file (`.exe`) in the "Program Files" folder
 2. [Adding it to their Windows PATH environment variable](https://medium.com/@kevinmarkvi/how-to-add-executables-to-your-path-in-windows-5ffa4ce61a53)
 3. Saving it where needed

Note that if you're using VS Code, you must restart it to pick up modified environment variables.
:::

4. Verify your installation by running `./dbt --help` in the command line. If you see the following output, you installed it correctly:
      ```bash
      The dbt CLI - an ELT tool for running SQL transformations and data models in dbt...
      ```

     If you don't see this output, check that you've deactivated pyenv or venv and don't have a global dbt version installed.

   * Note that you no longer need to run the `dbt deps` command when your environment starts. Previously, initialization required this step. However, you should still run `dbt deps` if you make any changes to your `packages.yml` file.

5. Clone your repository to your local computer using `git clone`. For example, to clone a GitHub repo using HTTPS format, run `git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY`.

6. After cloning your repo, [configure](/docs/platform/configure-dbt-cli) the <Constant name="platform_cli" /> for your <Constant name="dbt" /> project. This lets you run dbt commands like [`dbt environment show`](/reference/commands/dbt-environment) to view your <Constant name="dbt" /> configuration or `dbt compile` to compile your project and validate models and tests. You can also add, edit, and synchronize files with your repo.

</TabItem>

<TabItem value="linux" label="Linux (native executable)">

Refer to the [FAQs](#faqs) if your operating system runs into path conflicts.

1. Download the latest Linux release for your platform from [GitHub](https://github.com/dbt-labs/dbt-cli/releases). (Pick the file based on your CPU architecture)

2. Extract the `dbt-cli` binary to the same folder as your dbt project.

  ```bash
  tar -xf dbt_0.29.9_linux_amd64.tar.gz
  ./dbt --version
  ```

:::info

Advanced users can configure multiple projects to use the same dbt CLI executable by adding it to their PATH environment variable in their shell profile.

:::

3. Verify your installation by running `./dbt --help` in the command line. If you see the following output, you installed it correctly:
      ```bash
      The dbt CLI - an ELT tool for running SQL transformations and data models in dbt...
      ```

     If you don't see this output, check that you've deactivated pyenv or venv and don't have a global dbt version installed.
   
   * Note that you no longer need to run the `dbt deps` command when your environment starts. Previously, initialization required this step. However, you should still run `dbt deps` if you make any changes to your `packages.yml` file.

4. Clone your repository to your local computer using `git clone`. For example, to clone a GitHub repo using HTTPS format, run `git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY`.

5. After cloning your repo, [configure](/docs/platform/configure-dbt-cli) the <Constant name="platform_cli" /> for your <Constant name="dbt" /> project. This lets you run dbt commands like [`dbt environment show`](/reference/commands/dbt-environment) to view your <Constant name="dbt" /> configuration or `dbt compile` to compile your project and validate models and tests. You can also add, edit, and synchronize files with your repo.

</TabItem>

<TabItem value="pip" label="Existing dbt Core users (pip)">

If you already have dbt Core installed, the <Constant name="platform_cli" /> may conflict. Here are some considerations:

- **Prevent conflicts** <br /> Use both the <Constant name="platform_cli" /> and <Constant name="core" /> with `pip` and create a new virtual environment.<br /><br />
- **Use both <Constant name="platform_cli" /> and <Constant name="core" /> with brew or native installs** <br /> If you use Homebrew, consider aliasing the <Constant name="platform_cli" /> as "dbt-cli" to avoid conflict. For more details, check the [FAQs](#faqs) if your operating system experiences path conflicts.<br /><br />
- **Reverting to dbt Core from the <Constant name="platform_cli" />** <br />
  If you've already installed the <Constant name="platform_cli" /> and need to switch back to dbt Core:<br />
  - Uninstall the <Constant name="platform_cli" /> using the command: `pip uninstall dbt`
  - Reinstall <Constant name="core" /> using the following command, replacing "adapter_name" with the appropriate adapter name:
    ```shell
    python -m pip install dbt-adapter_name --force-reinstall
    ```
    For example, if you use Snowflake as an adapter, run: `python -m pip install dbt-snowflake --force-reinstall`

--------

Before installing the <Constant name="platform_cli" />, make sure you have Python installed and your virtual environment (venv or pyenv) configured. If you already have a Python environment configured, you can skip to the [pip installation step](#install-dbt-cloud-cli-in-pip).

### Install a virtual environment

We recommend using virtual environments (venv) to isolate the `dbt-cli` environment.

1. Create a new virtual environment named "dbt-cli" with this command:
   ```shell
   python3 -m venv dbt-cli
    ```

2. Activate the virtual environment each time you create a shell window or session, depending on your operating system:

   - For Mac and Linux, use: `source dbt-cli/bin/activate`<br/>
   - For Windows, use: `dbt-cli\Scripts\activate`

3. (Mac and Linux only) Create an alias to activate your dbt environment with every new shell window or session. You can add the following to your shell's configuration file (for example, `$HOME/.bashrc, $HOME/.zshrc`) while replacing `<PATH_TO_VIRTUAL_ENV_CONFIG>` with the path to your virtual environment configuration:
   ```shell
   alias env_dbt='source <PATH_TO_VIRTUAL_ENV_CONFIG>/bin/activate'
   ```

### Install dbt CLI in pip

1. (Optional) If you already have <Constant name="core" /> installed, this installation will override that package. Check your <Constant name="core" /> version in case you need to reinstall it later by running the following command:

  ```bash
  dbt --version
  ```

2. Make sure you're in your virtual environment and run the following command to install the <Constant name="platform_cli" />:

  ```bash
  pip install dbt --no-cache-dir
  ```

  If there are installation issues, running the command with the `--force-reinstall` argument might help:
   ```bash
   pip install dbt --no-cache-dir --force-reinstall
   ``` 

3. (Optional) To revert to <Constant name="core" />, first uninstall both the <Constant name="platform_cli" /> and <Constant name="core" />. Then reinstall <Constant name="core" />.

  ```bash
  pip uninstall dbt-core dbt
  pip install dbt-adapter_name --force-reinstall
  ```

4. Clone your repository to your local computer using `git clone`. For example, to clone a GitHub repo using HTTPS format, run `git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY`.

5. After cloning your repo, [configure](/docs/platform/configure-dbt-cli) the <Constant name="platform_cli" /> for your <Constant name="dbt" /> project. This lets you run dbt commands like [`dbt environment show`](/reference/commands/dbt-environment) to view your <Constant name="dbt" /> configuration or `dbt compile` to compile your project and validate models and tests. You can also add, edit, and synchronize files with your repo.

</TabItem>


</Tabs>

## Update dbt CLI

The following instructions explain how to update the <Constant name="platform_cli" /> to the latest version depending on your operating system.


<Tabs>

<TabItem value="mac" label="macOS (brew)">

To update the <Constant name="platform_cli" />, run `brew update` and then `brew upgrade dbt`.

</TabItem>

<TabItem value="windows" label="Windows (executable)">

To update, follow the [Windows installation instructions](/docs/platform/dbt-cli-installation?install=windows#install-dbt-cloud-cli) and replace the existing `dbt.exe` executable with the new one.

</TabItem>

<TabItem value="linux" label="Linux (executable)">

To update, follow the [Linux installation instructions](/docs/platform/dbt-cli-installation?install=linux#install-dbt-cloud-cli) and replace the existing `dbt` executable with the new one.

</TabItem>

<TabItem value="existing" label="Existing dbt Core users (pip)">

To update:
- Make sure you're in your virtual environment
- Run `python -m pip install --upgrade dbt`.
	
</TabItem>

</Tabs>
  
  
## Considerations

import CloudCliRelativePath from '/snippets/_cloud-cli-relative-path.md';

<CloudCliRelativePath />

## FAQs

<DetailsToggle alt_header="What's the difference between the dbt CLI and dbt Core?">

The <Constant name="platform_cli" /> and <a href="https://github.com/dbt-labs/dbt-core">dbt Core</a>, an open-source project, are both command line tools that enable you to run dbt commands. 

The key distinction is that the <Constant name="platform_cli" /> is tailored for the <Constant name="dbt_platform" />'s infrastructure and integrates with all its <a href="https://docs.getdbt.com/docs/platform/about-platform/dbt-platform-features">features</a>.

</DetailsToggle>

<DetailsToggle alt_header="How do I run both the dbt CLI and dbt Core?">

For compatibility, both the <Constant name="platform_cli" /> and <Constant name="core" /> are invoked by running `dbt`. This can create path conflicts if your operating system selects one over the other based on your $PATH environment variable (settings).

If you have <Constant name="core" /> installed locally, either:

1. Install using the <code>pip3 install dbt</code> [pip](/docs/platform/dbt-cli-installation?install=pip#install-dbt-cloud-cli) command.
2. Install natively, ensuring you either deactivate the virtual environment containing <Constant name="core" /> or create an alias for the <Constant name="platform_cli" />. 
3. (Advanced users) Install natively, but modify the $PATH environment variable to correctly point to the <Constant name="platform_cli" /> binary to use both <Constant name="platform_cli" /> and <Constant name="core" /> together.

You can always uninstall the <Constant name="platform_cli" /> to return to using <Constant name="core" />.

</DetailsToggle>

<DetailsToggle alt_header="How to create an alias?">

To create an alias for the <Constant name="platform_cli" />: <br />

1. Open your shell's profile configuration file. Depending on your shell and system, this could be `~/.bashrc`, `~/.bash_profile`, `~/.zshrc`, or another file.<br />

2. Add an alias that points to the <Constant name="platform_cli" /> binary. For example: <code>alias dbt-cli="path_to_dbt_cli_binary"</code>
   
   Replace <code>path_to_dbt_cli_binary</code> with the actual path to the <Constant name="platform_cli" /> binary, which is <code>/opt/homebrew/bin/dbt</code>. With this alias, you can use the command <code>dbt-cli</code> to invoke the <Constant name="platform_cli" />.<br />

3. Save the file and then either restart your shell or run <code>source</code> on the profile file to apply the changes.
   For example, in bash you would run: <code>source ~/.bashrc</code><br />

4. Test and use the alias to run commands:<br />
   - To run the <Constant name="platform_cli" />, use the <code>dbt-cli</code> command: <code>dbt-cli command_name</code>. Replace 'command_name' with the specific dbt command you want to execute.<br />
   - To run dbt Core, use the <code>dbt</code> command: <code>dbt command_name</code>. Replace 'command_name' with the specific dbt command you want to execute.<br />


You can then use the <code>dbt-cli</code> command to invoke the <Constant name="platform_cli" /> while you keep dbt Core installed natively.

</DetailsToggle>

<DetailsToggle alt_header="Why am I receiving a `Stuck session` error when trying to run a new command?">

The <Constant name="platform_cli" /> allows only one command that writes to the data warehouse at a time. If you attempt to run multiple write commands simultaneously (for example, `dbt run` and `dbt build`), you will encounter a `stuck session` error. To resolve this, cancel the specific invocation by passing its ID to the cancel command. For more information, refer to [parallel execution](/reference/dbt-commands#parallel-execution).

</DetailsToggle>

<DetailsToggle alt_header="I'm getting a `Session occupied` error in dbt CLI?">

<LongSession />

</DetailsToggle>
  

