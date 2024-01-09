---
title: "What are the best practices for installing dbt Core with pip?"
description: "Instructions on how to install dbt Core with pip"
sidebar_label: 'Installing dbt Core with pip'
id: install-pip-best-practices.md
---

Managing Python local environments can be challenging! You can use these best practices to improve the dbt Core installation with pip. 

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
