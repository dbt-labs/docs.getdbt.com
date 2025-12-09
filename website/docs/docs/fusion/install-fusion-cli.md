---
title: "Install Fusion CLI"
sidebar_label: "Install Fusion CLI only" 
description: "Install the Fusion engine locally from the command line interface (CLI) to take data transformation to the next level."
keywords: ["dbt Fusion engine", "Fusion", "Install Fusion", "Update Fusion", "Fusion updates" ]
id: install-fusion-cli
---

import FusionManualInstall from '/snippets/_fusion-manual-install.md';

# Install Fusion from the CLI <Lifecycle status="preview" />

Fusion can be installed via the command line from our official content delivery network (CDN).

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

The Fusion install automatically includes adapters outlined in the [Fusion requirements](/docs/fusion/supported-features#requirements). Other adapters will be available at a later date.


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
