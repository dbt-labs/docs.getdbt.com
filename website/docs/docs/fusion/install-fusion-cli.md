---
title: "Install Fusion on the CLI"
description: "Install the Fusion engine locally on the command line interface (CLI) to take data transformation to the next level."
id: install-fusion-cli
---

# Install Fusion

Fusion can be installed via the command line from our official CDN:

- **macOS/Linux:** Using `curl`
<!--- **Windows:** Using `irm` -->

### macOS & Linux installation

Run the following command in the terminal:

```shell
curl -fsSL https://public.cdn.getdbt.com/fs/install/install.sh | sh -s -- --update
```

To use `dbtf` immediately after installation, reload your shell so that the new `$PATH` is recognized:

```shell
exec $SHELL
```

Or, close and reopen your Terminal window. This will load the updated environment settings into the new session.

<!-- ### Windows installation (PowerShell)

Run the following command in PowerShell:

```powershell
irm https://public.cdn.getdbt.com/fs/install/install.ps1 | iex
```

To use `dbtf` immediately after installation, reload your shell so that the new `Path` is recognized:

```powershell
Start-Process powershell
```

Or, close and reopen PowerShell. This will load the updated environment settings into the new session.
-->

### Verify the installation

After installation, open a new command-line window and verify that Fusion is installed correctly by checking the version. You can run these commands using `dbt`, or use `dbtf` as an unambiguous alias for Fusion, if you have another dbt CLI installed on your machine.

```bash
dbtf --version
```

- **macOS** & **Linux**: $HOME/.local/bin/dbt
<!--- **Windows:** `C:\Users\<YourUsername>\.local\bin\dbt.exe` -->

This location is automatically added to your path to easily execute the `dbtf` command, but it requires reloading your shell.

### Update Fusion

The following command will update to the latest version of Fusion and adapter code:

```shell
dbtf system update
```

### Uninstall

This command will uninstall the Fusion binary from your system (but aliases will remain wherever they are installed, for example `~/.zshrc`):

```shell
dbtf system uninstall
```

### Adapter installation

The Fusion install automatically includes adapters outlined in the [Fusion requirements](/docs/fusion/supported-features#requirements). Other adapters will be available at a later date.

## Troubleshooting

Common issues and resolutions:

- **dbt command not found:** Ensure installation location is correctly added to your `$PATH`.
- **Version conflicts:** Verify no existing dbt Core or dbt CLI versions are installed (or active) that could conflict with Fusion.
- **Installation permissions:** Confirm your user has appropriate permissions to install software locally.

## Frequently asked questions

- Can I revert to my previous dbt installation?

    Yes. If you want to test Fusion without affecting your existing workflows, consider isolating or managing your installation via separate environments or virtual machines.

import AboutFusion from '/snippets/_about-fusion.md';

<AboutFusion />
