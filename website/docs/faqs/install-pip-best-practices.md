---
title: What are best practices for installing dbt with pip?
---

**First,** we recommend [python virtual environments](https://docs.python-guide.org/dev/virtualenvs/) to namespace `pip` modules. Here's an example setup:
```shell
python3 -m venv dbt-env				# create the environment
source dbt-env/bin/activate			# activate the environment
```

If you install `dbt` in a virtual environment, that same virtual environment must be re-activated each time a shell window or session is created.

Tip: `alias` the `source ...` command in your `$HOME/.bashrc`, `$HOME/.zshrc`, or whatever rc file your shell draws from. For example, you can add a command like `alias env_dbt='source <...>/bin/activate'`, where `<...>` is substituted for the path to your virtual environment configuration.

**Second,** dbt installations are tested using the latest versions of `pip` + `setuptools`. Newer versions have improved behavior around dependency resolution. Before installing, you should ensure that you are using the latest versions:
```shell
pip install --upgrade pip setuptools
```
