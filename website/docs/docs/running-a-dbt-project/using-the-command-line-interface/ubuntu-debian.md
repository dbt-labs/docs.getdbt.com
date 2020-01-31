---
title: "Ubuntu / Debian"
id: "ubuntu-debian"
---

## pip

First, make sure you have git, postgres, and python-dev installed:

<Callout type="warning" title="Python Requirements">

The dbt CLI is compatible with Python versions 3.6 and higher. As of v0.15.0, dbt is no longer compatible with Python2.

</Callout>

```bash
sudo apt-get install git libpq-dev python-dev
```

Then, install using `pip`:

```bash
pip install dbt
```

If you encounter errors relating to `cryptography`, you may need to downgrade your version. First, upgrade your versions of `pip` and `cffi`:
```
# Install the latest pip
pip install -U pip

# Then upgrade cffi
sudo apt-get remove python-cffi
sudo pip install --upgrade cffi
```
Next, install the latest supported version of `cryptography`:
```
# Specify the version on install
pip install cryptography==1.7.2
```
Then you can install dbt

```bash
pip install dbt
```

To upgrade, use:

```bash
pip install --upgrade dbt
```

Then, try running dbt:
```
dbt --version
```

If your terminal informs you that the `dbt` executable is not found, try re-installing with the `-I` flag:
```
pip install -I dbt
```