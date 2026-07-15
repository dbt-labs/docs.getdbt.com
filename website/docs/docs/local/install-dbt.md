---
title: Install dbt
id: install-dbt
description: "Learn how to install the dbt CLI and other tools in your Windows, macOS, or Linux environment"
sidebar_label: "Install dbt"
pagination_next: "docs/local/configure-environment-variables"
pagination_prev: null
---

import FusionManualInstall from '/snippets/_fusion-manual-install.md';
import AboutFusion from '/snippets/_about-fusion.md';

Get dbt running on your machine in a few minutes. Choose your path:

<Tabs>

<TabItem value="Fusion" label="Fusion + dbt extension (recommended)" default>

## Install the Fusion CLI <Lifecycle status="preview" />

The <Constant name="fusion"/> CLI delivers <Constant name="fusion_engine" /> performance benefits (faster parsing, compilation, and execution) but doesn't include <Term id="lsp" /> features. For the best <Constant name="fusion_engine" /> experience, install the dbt VS Code extension in VS Code or a compatible IDE.

<FusionManualInstall />

## Install the extension

Install the dbt VS Code extension from the marketplace for [VS Code and Cursor](https://marketplace.visualstudio.com/items?itemName=dbtLabsInc.dbt&ssr=false#overview) or [Windsurf](https://open-vsx.org/extension/dbtLabsInc/dbt).

1. In your editor, open the **Extensions** tab and search for `dbt`.
2. Locate the extension from the publisher `dbtLabsInc` or `dbt Labs Inc`, then click **Install**.

    <Lightbox src="/img/docs/extension/extension-marketplace.png" width="90%" title="Search for the extension"/>

3. Confirm that the extension is active by checking for the **dbt Extension** label in the status bar. Hover over the label to view diagnostic information.

    <Lightbox src="/img/docs/extension/dbt-extension-statusbar.png" width="60%" title="If you see the 'dbt Extension' label, the extension is activated"/>

4. After the extension activates, it automatically downloads the correct dbt Language Server (<Term id="lsp"/>) for your operating system.

    <Lightbox src="/img/docs/extension/extension-lsp-download.png" width="60%" title="The dbt Language Server will be installed automatically"/>

Refer to the [dbt VS Code extension docs](/docs/about-dbt-extension) for more information.

## Troubleshooting

Common issues and resolutions:

- **dbt command not found:** Add the installation location to your `$PATH`.
- **Version conflicts:** Check that no other <Constant name="core" /> or <Constant name="platform_cli" /> versions are installed or active on your machine.
- **Installation permissions:** Make sure your user account can install software locally.

## Frequently asked questions

- Can I revert to my previous dbt installation?

    Yes. To test Fusion without affecting your existing workflows, use a separate environment or virtual machine.

<AboutFusion />

</TabItem>

<TabItem value="CoreV2" label="dbt Core v2">

## Install dbt Core v2 CLI <Lifecycle status="Alpha" />

:::caution dbt Core v2 is in alpha
<Constant name="core" /> v2 is under active development and not recommended for production use. Features and APIs may change before the stable release. For stable development, use <Constant name="fusion" />.
:::

<Constant name="core" /> v2 is the next major version of <Constant name="core" />, built on the <Constant name="fusion_engine" /> runtime. Install it with `pip`, same as v1, but target the v2 prerelease package.

<Expandable alt_header="Pip installation">

```shell
python -m pip install --pre dbt-core
```

```shell
dbt --version
```

Confirm that the installed version begins with `2.`.

</Expandable>

<AboutFusion />

</TabItem>

<TabItem value="Core" label="dbt Core v1">

## Install dbt Core v1 CLI

<Constant name="core" /> v1 is the original open-source dbt engine. Install it with `pip`, Docker, or from source.

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

</TabItem>
</Tabs>


:::tip Pro tip: Using the --help flag

Most command-line tools, including dbt, support a `--help` flag that shows available commands and arguments. With dbt, you can use `--help` in two ways:<br /><br />
&mdash; `dbt --help`: Shows available dbt commands<br />
&mdash; `dbt run --help`: Shows available flags for the `run` command

:::


## Next steps

- Configure [environment variables](/docs/local/configure-environment-variables) to manage credentials.
- Configure your [profiles.yml](/docs/local/profiles.yml#location-of-profilesyml) file.
- Configure your [data platform connection](/docs/local/connect-data-platform/about-dbt-connections).
- Create your first [dbt project](/docs/build/projects) using the [`dbt init`](/reference/commands/init) command.

