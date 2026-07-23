---
title: Install dbt
id: install-dbt
description: "Learn how to install the dbt CLI and other tools in your Windows, macOS, or Linux environment"
sidebar_label: "Install dbt"
---

import AboutFusion from '/snippets/_about-fusion.md';

<VersionBlock firstVersion="2.0">

Get <Constant name="dbt" /> running on your machine in a few minutes. Installing dbt gives you <Constant name="fusion" /> by default: the current, free-to-use experience for v2. Choose your preferred installation method:

## Install dbt <Lifecycle status="preview" />

<Tabs groupId="install-method" queryString>

<TabItem value="pip" label="pip">

```shell
python -m pip install --pre dbt
```

To upgrade later, run `python -m pip install --upgrade --pre dbt`.

</TabItem>

<TabItem value="homebrew" label="Homebrew (macOS)">

```shell
brew install dbt
```

To upgrade later, run `brew upgrade dbt`.

</TabItem>

<TabItem value="curl" label="curl (macOS/Linux)">

```shell
curl -fsSL https://public.cdn.getdbt.com/fs/install/install.sh | sh -s -- --update
```

Close and reopen your terminal (or run `exec $SHELL`) so the new `$PATH` is recognized. 

To upgrade later, run `dbt system update`.

</TabItem>

<TabItem value="winget" label="winget (Windows)">

```shell
winget install --id dbtLabs.dbt --exact
```

To install a specific version, run `winget install --id dbtLabs.dbt --exact --version <version>`.

</TabItem>

<TabItem value="windows" label="Windows (PowerShell)">

```powershell
irm https://public.cdn.getdbt.com/fs/install/install.ps1 | iex
```

Close and reopen your shell (or run `Start-Process powershell`) so the new `Path` is recognized. 

To upgrade later, run `dbt system update`.

</TabItem>

</Tabs>

- Verify your installation:

  ```shell
  dbt --version
  ```

- With <Constant name="dbt" /> v2, you can start using the <Constant name="fusion" /> experience right away. For the best v2 editor experience, install the dbt VS Code extension to use features like autocomplete, inline errors, and lineage.

  For full <Term id="lsp" /> features and other richer <Constant name="fusion" /> capabilities, run `dbt login` to sign in with a free <Constant name="dbt_platform" /> account:

  ```shell
  dbt login
  ```

Refer to the [dbt VS Code extension docs](/docs/about-dbt-extension) for more info.

If you or your org has a strict requirement to use the open-source runtime, install it [here](/docs/local/install-dbt-core-v2).

## Troubleshooting

Common issues and resolutions:

- **dbt command not found:** Add the installation location to your `$PATH`.
- **Version conflicts:** Check that no other <Constant name="core" /> or <Constant name="platform_cli" /> versions are installed or active on your machine.
- **Installation permissions:** Make sure your user account can install software locally.

## Frequently asked questions

- <Expandable alt_header="Can I revert to my previous dbt installation?">
    Yes. To test a new install without affecting your existing workflows, use a separate environment or virtual machine.
  </Expandable>
- <Expandable alt_header="Can I download the Apache 2.0 runtime only?">
    Yes if you need to use the Apache 2.0 runtime, you can [install dbt Core 2.0](/docs/local/install-dbt-core-v2), the open-source project behind Fusion.
  </Expandable>

<AboutFusion />

</VersionBlock>

<VersionBlock lastVersion="1.99">

:::tip Want faster dbt?
Upgrade to v2 to get <Constant name="fusion" /> &mdash; up to 30x faster performance, <Term id="lsp" /> features like autocomplete and inline errors, and more. [Upgrade to v2](/docs/dbt-versions/core-upgrade/upgrading-to-v2).
:::

## Install dbt Core v1.x CLI

dbt Core v1.x is the original open-source dbt engine. Install it with `pip`, Docker, or from source.

<Expandable alt_header="Pip installation" >

### Prerequisites

- [Python](https://www.python.org/downloads/) (`python --version` or `python3 --version`)
- [pip](https://pip.pypa.io/en/stable/installation/) (`pip --version` or `pip3 --version`)

<FAQ path="Core/install-pip-os-prereqs" />
<FAQ path="Core/install-python-compatibility" />

### Create a virtual environment

<Tabs>
  <TabItem value="Unix/macOS" label="Unix/macOS">

  ```shell
  python3 -m venv .venv
  source .venv/bin/activate
  ```

  </TabItem>
  <TabItem value="Windows" label="Windows">

  ```shell
  py -m venv .venv
  .venv\Scripts\activate
  ```

  </TabItem>
</Tabs>

To deactivate, run `deactivate`. To auto-activate in your new shell sessions, add an alias to your `~/.bashrc` or `~/.zshrc`:

```shell
alias env_dbt='source <PATH_TO_VIRTUAL_ENV_CONFIG>/bin/activate'
```

### Install your adapter

Installing an adapter automatically installs `dbt-core`. Choose your adapter from [Supported Data Platforms](/docs/supported-data-platforms):

```shell
python -m pip install dbt-ADAPTER_NAME
```

To install `dbt-core` without an adapter (for tool integrations only):

```shell
python -m pip install dbt-core
```

### Upgrade

```shell
# Upgrade adapter (and dbt-core)
python -m pip install --upgrade dbt-ADAPTER_NAME

# Downgrade to a specific version
python -m pip install --upgrade dbt-core==1.9
```

### Install a prerelease

Use `--pre` to install prerelease versions. This may also install prerelease versions of other dependencies.

```shell
python3 -m pip install --pre dbt-ADAPTER_NAME
```

</Expandable>

<Expandable alt_header="Docker">

<Constant name="core" /> images are distributed via [GitHub Packages](https://github.com/dbt-labs/dbt-core/pkgs/container/dbt-core) and include pinned versions of dbt-core, one or more adapters, and all dependencies.

### Prerequisites

- [Docker](https://docs.docker.com/) installed
- Familiarity with [adapters](/docs/supported-data-platforms) and [Core versioning](/docs/dbt-versions)

### Pull an image

Images follow the pattern `ghcr.io/dbt-labs/<db_adapter_name>:<version_tag>`. Available tags:
- `latest` — latest overall release
- `<Major>.<Minor>.latest` — latest patch for a version family (for example, `1.9.latest`)

```shell
docker pull ghcr.io/dbt-labs/<db_adapter_name>:<version_tag>
```

### Run dbt in a container

Bind-mount your project and profiles, then run any dbt command:

```shell
docker run \
--network=host \
--mount type=bind,source=/absolute/path/to/project,target=/usr/app \
--mount type=bind,source=/absolute/path/to/profiles.yml,target=/root/.dbt/profiles.yml \
<dbt_image_name> \
<dbt_command>
```

Note: bind-mount sources must be absolute paths. You may need to adjust `--network` settings depending on your warehouse host.

### Build a custom image

If the pre-made images don't fit your use case, use the [`Dockerfile`](https://github.com/dbt-labs/dbt-core/blob/1.latest/docker/Dockerfile) and [`README`](https://github.com/dbt-labs/dbt-core/blob/1.latest/docker/README.md) to build images with multiple adapters, third-party adapters, or different system architectures. Custom image builds are community-supported — [open an issue](https://github.com/dbt-labs/dbt-core/issues) or [ask the community](/community/resources/getting-help) if you run into trouble.

</Expandable>

<Expandable alt_header="Source">

Install from source to get unreleased code or a specific commit. Clone the repo and install with `pip`:

```shell
git clone https://github.com/dbt-labs/dbt-core.git
cd dbt-core
python -m pip install -r requirements.txt
```

For editable mode (changes take effect immediately):

```shell
python -m pip install -e editable-requirements.txt
```

### Install an adapter from source

Install `dbt-core` first, then clone and install your adapter. For example, for Redshift:

```shell
git clone https://github.com/dbt-labs/dbt-redshift.git
cd dbt-redshift
python -m pip install .
```

For editable mode: `python -m pip install -e .`

For more details, read the [contributing guidelines](https://github.com/dbt-labs/dbt-core/blob/HEAD/CONTRIBUTING.md).

</Expandable>

:::tip Pro tip: Using the --help flag

Most command-line tools, including dbt, support a `--help` flag that shows available commands and arguments. With dbt, you can use `--help` in two ways:<br /><br />
&mdash; `dbt --help`: Shows available dbt commands<br />
&mdash; `dbt run --help`: Shows available flags for the `run` command

:::

</VersionBlock>

## Next steps

- Configure [environment variables](/docs/local/configure-environment-variables) to manage credentials.
- Configure your [profiles.yml](/docs/local/profiles.yml#location-of-profilesyml) file.
- Configure your [data platform connection](/docs/local/connect-data-platform/about-dbt-connections).
- Create your first [dbt project](/docs/build/projects) using the [`dbt init`](/reference/commands/init) command.
