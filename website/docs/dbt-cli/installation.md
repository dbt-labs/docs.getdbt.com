---
title: "Installation"
id: "installation"
---

We recommend you use install dbt using one of three tried and tested methods:

- [homebrew](#homebrew) (recommended for MacOS)
- [pip](#pip)
- [from source](#install-from-source)

## Homebrew

Install [Homebrew](http://brew.sh/). Then, run:

```shell
brew update
brew install git
brew tap dbt-labs/dbt
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
brew install dbt@0.19.0
brew link dbt@0.19.0
```

Now, you can use dbt version 0.19.0:

```shell
$ dbt --version
installed version: 0.19.0
```

You can switch between versions by linking the one you want to use:

```shell
brew unlink dbt@0.19.0
brew link dbt
```

If you want to use a development version of dbt, you can install it as follows:

```shell
brew unlink dbt
brew update
brew install dbt-development
brew link dbt-development
```

## pip

dbt is a Python module distributed on [pypi](https://pypi.org/project/dbt/), and can be installed via `pip`. We recommend using virtual environments when installing with `pip`. [Some additional steps](#additional-steps-by-operating-system) may be required for Windows and certain flavors of Linux.

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

### Additional steps by operating system

These operating systems require additional pre-installation setup. After running whichever commands are relevant to your development environment, return to the instructions above.

#### Ubuntu/Debian
```shell
sudo apt-get install git libpq-dev python-dev python3-pip
sudo apt-get remove python-cffi
sudo pip install --upgrade cffi
pip install cryptography~=3.4
```

#### CentOS

```shell
sudo yum install redhat-rpm-config gcc libffi-devel \
  python-devel openssl-devel
```

#### Windows

Install [Git for Windows](https://git-scm.com/downloads) and [Python version 3.5 or higher for Windows](https://www.python.org/downloads/windows/). Installation with Python 3.9 seems to have issues where some of the dependencies cannot be installed properly (cryptography is one of them.) Either try the installation by downgrading your Python version from 3.9.x or create a virtual environment with lower version of Python than that of 3.9.x but equal to or higher than the minimum required version 3.5.

## Install from source

Create a dbt virtual environment as detailed in the `pip` section above.

Then, install dbt from GitHub source
```shell
git clone https://github.com/dbt-labs/dbt.git
cd dbt
pip install -r requirements.txt
```
