---
title: "Install dbt"
id: "installation"
---

We recommend you use install dbt using one of three tried and tested methods:

- [brew](#homebrew) (recommended for MacOS)
- [pip](#pip)
- [from source](#install-from-source)

## Homebrew

Install [Homebrew](http://brew.sh/). Then, run:

```shell
brew update
brew install git
brew tap fishtown-analytics/dbt
brew install dbt
```

Test your installation with `dbt --version`.

### Upgrading

To upgrade dbt, use:

```shell
brew update
brew upgrade dbt
```

### Installing different versions with Homebrew

You can install and use multiple versions of dbt with Homebrew through something called Homebrew "links." To allow installation of another version of dbt, first unlink the current version:

```shell
brew unlink dbt
brew install dbt@0.17.0
brew link dbt@0.17.0
```

Now, you can use dbt version 0.17.0:

```shell
$ dbt --version
installed version: 0.17.0
```

You can switch between versions by linking the one you want to use:

```shell
brew unlink dbt@0.17.0
brew link dbt
```

If you'd prefer to use the development version of dbt, you can install it as follows:

```shell
brew unlink dbt
brew update
brew install dbt-development
brew link dbt-development
```

## pip

dbt is a Python module distributed on [pypi](https://pypi.org/project/dbt/), and can be installed via `pip`. We recommend using virtual environments when installing dbt via pip. Some additional steps are required for linux flavors. See the relevant section for [prerequisite commands](#additional-steps-by-installation).

:::caution Python3
The dbt CLI is compatible with Python versions 3.6 and higher. As of v0.15.0, dbt is no longer compatible with Python2.
:::

If you encounter SSL cryptography errors during installation, ensure your local `pip` is current (via [cryptography.io](https://cryptography.io/en/latest/faq/#compiling-cryptography-on-os-x-produces-a-fatal-error-openssl-aes-h-file-not-found-error))

### Installation

First, we recommend [python virtual environments](https://docs.python-guide.org/dev/virtualenvs/) to namespace `pip` modules. Here's an example setup:
```shell
python3 -m venv dbt-env				# create the environment
source dbt-env/bin/activate			# activate the environment
```

If you install `dbt` in a virtual environment, that same virtual environment must be re-activated each time a shell window or session is created.

Tip: `alias` the `source ...` command in your `$HOME/.bashrc`, `$HOME/.zshrc`, or whatever rc file your shell draws from. For example, you can add a command like `alias env_dbt='source <...>/bin/activate'`, where `<...>` is substituted for the path to your virtual environment configuration.

```shell
pip install dbt
```

Check your installation with `dbt --version`.

### Upgrading
To upgrade dbt, use:
```
pip install --upgrade dbt
```

### Additional Steps by Installation

After running the following commands relevant to your development environment, you can return to the generic installation instructions above.

#### Ubuntu/Debian
```shell
sudo apt-get install git libpq-dev python-dev python3-pip
sudo apt-get remove python-cffi
sudo pip install --upgrade cffi
pip install cryptography==1.7.2
```

#### Centos

```shell
sudo yum install redhat-rpm-config gcc libffi-devel \
  python-devel openssl-devel
```

#### Windows

Install [Git for Windows](https://git-scm.com/downloads) and [Python version 3.5 or higher for Windows](https://www.python.org/downloads/windows/).

## Install from Source

Create a dbt virtual environment as detailed in the `pip` section above.

Finally, install dbt from GitHub source
```shell
git clone https://github.com/fishtown-analytics/dbt.git
cd dbt
pip install -r editable_requirements.txt
```
