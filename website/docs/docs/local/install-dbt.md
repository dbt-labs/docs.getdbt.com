---
title: Install dbt locally
id: install-dbt
description: "Learn how to install dbt in local environments"
sidebar_label: "Install dbt"
pagination_next: "docs/local/configure-environment-variables"
pagination_prev: null
---

Get dbt running on your machine in a few minutes. Choose your path:

<Tabs>

<TabItem value="Fusion" label="Fusion + dbt extension (recommended)" default>

import FusionManualInstall from '/snippets/_fusion-manual-install.md';

## Install Fusion from the CLI <Lifecycle status="preview" />

<Constant name="fusion"/> CLI delivers <Constant name="fusion_engine" /> performance benefits (faster parsing, compilation, execution) but does not include <Term id="lsp" /> features. For the best <Constant name="fusion_engine" /> experience, install the dbt VS Code extension in your VS Code or compatible IDE. 

<FusionManualInstall />

## Install the extension

Install the dbt VS Code extension on [VS Code, Cursor](https://marketplace.visualstudio.com/items?itemName=dbtLabsInc.dbt&ssr=false#overview), and [Windsurf](https://open-vsx.org/extension/dbtLabsInc/dbt)

1. In your editor, open the **Extensions** tab and search for `dbt`.
2. Locate the extension from the publisher `dbtLabsInc` or `dbt Labs Inc`, then click **Install**.

    <Lightbox src="/img/docs/extension/extension-marketplace.png" width="90%" title="Search for the extension"/>

3. Confirm that the extension is active by checking for the **dbt Extension** label in the status bar. Hover over the label to view diagnostic information.

    <Lightbox src="/img/docs/extension/dbt-extension-statusbar.png" width="60%" title="If you see the 'dbt Extension' label, the extension is activated"/>

4. After the extension activates, it automatically downloads the correct dbt Language Server (<Term id="lsp"/>) for your operating system.

    <Lightbox src="/img/docs/extension/extension-lsp-download.png" width="60%" title="The dbt Language Server will be installed automatically"/>

Check out the [dbt VS Code extension docs](/docs/about-dbt-extension) for more information.

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

<TabItem value="CoreV2" label="dbt Core v2">

:::caution dbt Core v2 is in alpha
dbt Core v2 is under active development and not recommended for production use. Features and APIs may change before the stable release. For stable local development, use <Constant name="fusion" />.
:::

dbt Core v2 is the next major version of dbt Core, built on the <Constant name="fusion_engine" /> runtime. It is installed using `pip`, same as v1, but targets the v2 prerelease package.

**Installation with pip:**

```shell
python -m pip install --pre dbt-core
```

```shell
dbt --version
```

Confirm the installed version begins with `2.`.

<AboutFusion />

</TabItem>

<TabItem value="Core" label="dbt Core v1">

dbt Core v1 is the original open-source dbt engine. Install it with `pip`, Docker, or from source.

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

To deactivate: `deactivate`. To auto-activate in new shell sessions, add an alias to your `~/.bashrc` or `~/.zshrc`:

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

**Prerequisites:** [Docker](https://docs.docker.com/) installed, and familiarity with [adapters](/docs/supported-data-platforms) and [Core versioning](/docs/dbt-versions).

### Pull an image

Images follow the pattern `ghcr.io/dbt-labs/<db_adapter_name>:<version_tag>`. Available tags:
- `latest` — latest overall release
- `<Major>.<Minor>.latest` — latest patch for a version family (e.g. `1.9.latest`)

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

If the pre-made images don't fit your use case, a [`Dockerfile`](https://github.com/dbt-labs/dbt-core/blob/1.latest/docker/Dockerfile) and [`README`](https://github.com/dbt-labs/dbt-core/blob/1.latest/docker/README.md) are available for building images with multiple adapters, third-party adapters, or different system architectures. Custom image builds are community-supported — [open an issue](https://github.com/dbt-labs/dbt-core/issues) or [ask the community](/community/resources/getting-help) if you run into trouble.

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

<FAQ path="Core/install-pip-best-practices" />

</Expandable>

</TabItem>
</Tabs>


:::tip Pro tip: Using the --help flag

Most command-line tools, including dbt, have a `--help` flag that you can use to show available commands and arguments. For example, you can use the `--help` flag with dbt in two ways:<br /><br />
&mdash; `dbt --help`: Lists the commands available for dbt<br />
&mdash; `dbt run --help`: Lists the flags available for the `run` command

:::


## Next steps

- Configure [environment variables](/docs/local/configure-environment-variables) to manage credentials.
- Configure your [profiles.yml](/docs/local/profiles.yml#location-of-profilesyml) file.
- Configure your [data platform connection](/docs/local/connect-data-platform/about-dbt-connections).
- Create your first [dbt project](/docs/build/projects) using the [`dbt init`](/reference/commands/init) command. 

