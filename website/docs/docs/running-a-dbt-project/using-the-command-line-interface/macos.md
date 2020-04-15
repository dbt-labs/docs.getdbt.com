---
title: "macOS"
id: "macos"
---

## Homebrew

### Installation

The preferred way to install dbt on macOS is via [Homebrew](http://brew.sh/). Install Homebrew, then run:

```bash
brew update
brew tap fishtown-analytics/dbt
brew install dbt
```

You'll also need git:

```bash
brew install git
```

### Upgrading

To upgrade dbt, use:

```bash
brew update
brew upgrade dbt
```

### Installing different versions with Homebrew

You can install and use multiple versions of dbt with Homebrew through something called Homebrew "links." To allow installation of another version of dbt, first unlink the current version:

```bash
brew unlink dbt
brew install dbt@0.15.1
brew link dbt@0.15.1
```

Now, you can use dbt version 0.15.1:

```bash
$ dbt --version
installed version: 0.15.1
```

You can switch between versions by linking the one you want to use:

```bash
brew unlink dbt@0.15.0
brew link dbt
```

If you'd prefer to use the development version of dbt, you can install it as follows:

```bash
brew unlink dbt
brew update
brew install dbt-development
brew link dbt-development
```

## pip
You can also use pip to install dbt – check out the [main installation documentation](cli-installation) for more information.

If you encounter SSL cryptography errors during install, make sure your copy of pip is up-to-date (via [cryptography.io](https://cryptography.io/en/latest/faq/#compiling-cryptography-on-os-x-produces-a-fatal-error-openssl-aes-h-file-not-found-error))

```bash
pip install -U pip
pip install -U dbt
```
