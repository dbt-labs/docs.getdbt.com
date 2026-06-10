---
title: "What are the best practices for installing dbt Core with pip?"
description: "Instructions on how to install dbt Core with pip"
sidebar_label: 'Installing dbt Core with pip'
id: install-pip-best-practices.md
---

:::info
The <Constant name="fusion_engine" /> is a next-generation, Rust-based engine that powers dbt development across the platform and local tooling. See [<Constant name="fusion_engine" />](/docs/fusion) for more information.
:::

## Best practices

Managing Python local environments can be challenging! You can use these best practices to improve the <Constant name="core" /> installation with `pip`. 

| Best practice | Recommendation | Why it matters |
|---------------|----------------|----------------|
| [Install <Constant name="core" /> with an adapter](/docs/local/install-dbt?version=1#installing-the-adapter) and keep versions in sync | Install with: `python -m pip install dbt-ADAPTER_NAME` <br /><br /> (For example, `python -m pip install dbt-snowflake`) <br /><br /> Match adapter versions to your <Constant name="core" /> version <br /><br /> | Provides a complete, compatible, and ready-to-run dbt setup <br /><br /> <br /><br /> Prevents runtime errors and adapter incompatibilities |
| For tooling without a warehouse connection, install dbt Core without an adapter | `python -m pip install` | Keeps your setup lean, predictable, and easier to maintain|
| Use [virtual environments](/faqs/Core/install-pip-best-practices.md#using-virtual-environments) | Install dbt in an isolated environment (for example, `venv`, `pipenv`, `poetry`) | Avoids dependency conflicts |
| Reactivate your virtual environment for each session | Reactivate your virtual environment at the start of each new session before installing dependencies or running dbt commands | Keeps your dbt setup predictable, isolated, and reproducible |
| [Create a project](/docs/local/install-dbt#create-a-project) | Use the `dbt init` command to create and initialize your first project | Creates a standard dbt project and verifies your installation |
| Ensure you have the latest versions of `pip`, `wheel`, and `setuptools` | Before installing dbt, upgrade your Python packaging tools:<br /><br />`python -m pip install --upgrade pip wheel setuptools` | Helps ensure a smoother, more predictable dbt installation |

<br />

Note, dbt adapters and <Constant name="core" /> are versioned independently to make it easier for us to maintain and independently evolve adapters going forward. 

### Using virtual environments

We recommend using [virtual environments](https://docs.python-guide.org/dev/virtualenvs/) to namespace `pip` modules. Here's an example setup:

```shell

python3 -m venv dbt-env				# create the environment
source dbt-env/bin/activate			# activate the environment for Mac and Linux
dbt-env\Scripts\activate			# activate the environment for Windows
```

If you install `dbt` in a virtual environment, you need to reactivate that same virtual environment each time you create a shell window or session.

*Tip:* You can create an alias for the `source` command in your `$HOME/.bashrc`, `$HOME/.zshrc`, or whichever rc file your shell draws from. For example, you can add a command like `alias env_dbt='source <PATH_TO_VIRTUAL_ENV_CONFIG>/bin/activate'`, replacing `<PATH_TO_VIRTUAL_ENV_CONFIG>` with the path to your virtual environment configuration.

### Using the latest versions

dbt installations are tested using the latest versions of `pip` and `setuptools`. Newer versions have improved behavior around dependency resolution, as well as much faster install times by using precompiled "wheels" when available for your operating system.

Before installing dbt, make sure you have the latest versions:

```shell

python -m pip install --upgrade pip wheel setuptools

```
